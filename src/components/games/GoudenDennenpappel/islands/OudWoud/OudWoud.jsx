// Het Oude Woud — Island 1
// Player collects 3 mushrooms, rolls a log, picks up map fragment
// All game logic lives here; Three.js objects are in OudWoudScene.js

import { useState, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { ThreeCanvas } from '../../engine/ThreeCanvas';
import { FirstPersonController } from '../../engine/FirstPersonController';
import { buildOudWoudScene, applyTreeWobble } from './OudWoudScene';
import { DialogueBox } from '../../ui/DialogueBox';
import { CollectableHUD } from '../../ui/CollectableHUD';
import { TouchControls } from '../../ui/TouchControls';
import { OUD_WOUD_DIALOGUES } from '../../data/freek-dialogues';

// GDP-003: Generate a sky PMREM env map at load time so all PBR surfaces pick up
// sky-blue/warm indirect bounce light. One-time GPU cost; generator is disposed
// immediately after so it doesn't hold extra GPU memory.
function buildSkyEnvMap(renderer) {
  // Small gradient canvas — equirectangular: top row = zenith, bottom = nadir
  const w = 64, h = 32;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0,    '#3a8bbf'); // deep sky blue overhead
  grad.addColorStop(0.38, '#7ec8e3'); // light sky at mid-altitude
  grad.addColorStop(0.50, '#e8c88a'); // warm golden horizon
  grad.addColorStop(1,    '#8b6020'); // warm ground bounce
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  const srcTex = new THREE.CanvasTexture(canvas);
  srcTex.mapping = THREE.EquirectangularReflectionMapping;
  srcTex.colorSpace = THREE.SRGBColorSpace;

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const rt = pmrem.fromEquirectangular(srcTex);

  // Free generator + source texture; the render-target texture stays on GPU
  srcTex.dispose();
  pmrem.dispose();

  return rt; // caller sets scene.environment = rt.texture
}

const COLLECT_RADIUS = 1.8; // walk through to collect
const COLLECT_RADIUS_SQ = COLLECT_RADIUS * COLLECT_RADIUS;
const LOG_PROXIMITY = 2.5;  // walk into log to push it

const TOTAL_MUSHROOMS = 3;

export function OudWoud({ playerName, onComplete, onExit }) {
  // React state (drives UI re-renders)
  const [mushroomCount, setMushroomCount] = useState(0);
  const [logRolled, setLogRolled] = useState(false);
  const [dialogue, setDialogue] = useState(null);

  // Three.js refs (no re-renders)
  const controllerRef = useRef(null);
  const sceneObjectsRef = useRef(null);
  const logBoxIndexRef = useRef(-1);
  const wobbleMapRef = useRef(new Map()); // treeIdx (number) -> { startTime, sign }
  const allMushroomsFoundRef = useRef(false);
  const logRolledRef = useRef(false);

  // Dialogue helpers
  const showDialogue = useCallback((lines, onDone) => {
    setDialogue({ lines, index: 0, onDone: onDone ?? null });
  }, []);

  const advanceDialogue = useCallback(() => {
    setDialogue((prev) => {
      if (!prev) return null;
      const next = prev.index + 1;
      if (next >= prev.lines.length) {
        prev.onDone?.();
        return null;
      }
      return { ...prev, index: next };
    });
  }, []);

  // Auto-close dialogue after timeout (for non-critical messages)
  const autoCloseTimerRef = useRef(null);
  const prevDialogueRef = useRef(null);
  if (dialogue !== prevDialogueRef.current) {
    prevDialogueRef.current = dialogue;
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    if (dialogue?.autoClose) {
      autoCloseTimerRef.current = setTimeout(() => {
        setDialogue((d) => (d === dialogue ? null : d));
        autoCloseTimerRef.current = null;
      }, dialogue.autoClose);
    }
  }

  // --- Callback refs (called from proximity checks, need latest state) ---
  const collectedMushroomsRef = useRef(new Set());

  // Mushroom collect callback — stored in ref so it's always current
  const collectMushroomRef = useRef(null);
  collectMushroomRef.current = (index) => {
    if (collectedMushroomsRef.current.has(index)) return;
    const mushroom = sceneObjectsRef.current?.mushrooms[index];
    if (!mushroom || !mushroom.visible) return;

    collectedMushroomsRef.current.add(index);
    mushroom.visible = false;

    // React 18+ batches these two state updates into a single render pass
    setMushroomCount((prev) => {
      const next = prev + 1;
      if (next === TOTAL_MUSHROOMS) {
        allMushroomsFoundRef.current = true;
      }
      return next;
    });

    // Compute dialogue outside the updater — avoids scheduling a second render
    const count = collectedMushroomsRef.current.size;
    if (count === TOTAL_MUSHROOMS) {
      setDialogue({
        lines: OUD_WOUD_DIALOGUES.allMushrooms,
        index: 0,
        onDone: null,
        centered: true,
      });
    } else {
      const lines = OUD_WOUD_DIALOGUES.mushroomFound(count);
      if (lines) {
        setDialogue({
          lines,
          index: 0,
          onDone: null,
          autoClose: 5000,
        });
      }
    }
  };

  // Log roll callback — triggered by walking into the log
  // Roll distance + speed scales with how fast the player is moving (velocity-based fake physics)
  const rollLogRef = useRef(null);
  const logAnimRef = useRef(null);
  rollLogRef.current = (impactSpeed = 1) => {
    if (logRolledRef.current) return;
    logRolledRef.current = true;
    const objects = sceneObjectsRef.current;
    if (!objects) return;

    // Remove log collision box so player can walk through immediately
    controllerRef.current?.removeCollisionBox(logBoxIndexRef.current);

    // Scale roll with impact: slow tap = 6 units / 1.8s, full sprint = 16 units / 0.7s
    const t = Math.max(0.2, Math.min(1, impactSpeed));
    const rollDist = 6 + t * 10;       // 6–16 units
    const duration = 1800 - t * 1100;  // 1800ms–700ms

    // Clamp roll distance so log stops at nearest rock in its path
    const logX = objects.log.position.x;
    const logZ = objects.log.position.z;
    const logHalfWidth = 3.0; // log extends ~3 units each side of center X
    const logRadius = 0.42;
    const rockRadius = 0.45; // max rock size
    let maxDist = rollDist;
    (objects.rockPositions || []).forEach(([rx, rz]) => {
      // Only check rocks that overlap the log's X span and are behind it
      if (rx >= logX - logHalfWidth && rx <= logX + logHalfWidth && rz < logZ) {
        const hitDist = (logZ - rz) - logRadius - rockRadius;
        if (hitDist > 0 && hitDist < maxDist) maxDist = hitDist;
      }
    });

    logAnimRef.current = {
      startZ: logZ,
      targetZ: logZ - maxDist,
      startTime: performance.now(),
      duration: duration * (maxDist / rollDist), // scale duration proportionally
      spinMultiplier: (2 + t * 4) * (maxDist / rollDist),
    };

    setLogRolled(true);
  };

  // Fragment pickup callback
  const fragmentCollectedRef = useRef(false);
  const pickupFragmentRef = useRef(null);
  pickupFragmentRef.current = () => {
    if (fragmentCollectedRef.current) return;
    fragmentCollectedRef.current = true;
    const frag = sceneObjectsRef.current?.mapFragment;
    if (frag) frag.visible = false;
    setDialogue({ lines: OUD_WOUD_DIALOGUES.complete, index: 0, onDone: onComplete, centered: true });
  };

  // --- Three.js setup (called once when canvas is ready) ---
  const handleReady = useCallback(
    ({ scene, camera, renderer }) => {
      const objects = buildOudWoudScene(scene);
      sceneObjectsRef.current = objects;

      // GDP-003: Apply sky env map so all PBR surfaces get sky-blue/warm bounce light
      const envRT = buildSkyEnvMap(renderer);
      scene.environment = envRT.texture;

      // Position camera at start
      camera.position.copy(objects.startPosition);

      // First-person controller with collision data
      const controller = new FirstPersonController(camera);
      objects.collisionCircles.forEach((c, i) => {
        const treeIdx = i;
        c.onHit = (relX) => {
          if (!wobbleMapRef.current.has(treeIdx)) {
            wobbleMapRef.current.set(treeIdx, { startTime: performance.now(), sign: relX >= 0 ? 1 : -1 });
          }
        };
        controller.addCollisionCircle(c.x, c.z, c.r);
        // Patch onHit onto the controller's circle entry so it fires during update()
        const entry = controller.collisionCircles[controller.collisionCircles.length - 1];
        entry.onHit = c.onHit;
      });
      const { minX, maxX, minZ, maxZ } = objects.logCollision;
      logBoxIndexRef.current = controller.addCollisionBox(minX, maxX, minZ, maxZ);

      // Island boundary walls — invisible thick boxes outside the play area
      const b = objects.islandBounds;
      controller.addCollisionBox(-500,    b.minX, -500,    500);    // west
      controller.addCollisionBox(b.maxX,  500,    -500,    500);    // east
      controller.addCollisionBox(-500,    500,    b.maxZ,  500);    // north
      controller.addCollisionBox(-500,    500,    -500,    b.minZ); // south

      controllerRef.current = controller;

      // Intro dialogue — centered instruction mode
      setDialogue({
        lines: OUD_WOUD_DIALOGUES.intro(playerName),
        index: 0,
        onDone: null,
        centered: true,
      });
    },
    [playerName]
  );

  // --- Frame update (called every animation frame) ---
  const handleFrame = useCallback(({ delta, camera }) => {
    controllerRef.current?.update(delta);

    const objects = sceneObjectsRef.current;
    if (!objects || !camera) return;

    // Animate water texture offset for a gentle rippling effect
    if (objects.waterMaterial?.map) {
      objects.waterMaterial.map.offset.x += delta * 0.012;
      objects.waterMaterial.map.offset.y += delta * 0.008;
    }

    // Animate log rolling
    const anim = logAnimRef.current;
    if (anim) {
      const elapsed = performance.now() - anim.startTime;
      const t = Math.min(elapsed / anim.duration, 1);
      // Ease out
      const ease = 1 - (1 - t) * (1 - t);
      objects.log.position.z = anim.startZ + (anim.targetZ - anim.startZ) * ease;
      // Spin the log as it rolls — speed scales with impact
      objects.log.rotation.x = ease * Math.PI * (anim.spinMultiplier ?? 3);
      if (t >= 1) logAnimRef.current = null;
    }

    const px = camera.position.x;
    const pz = camera.position.z;

    // Proximity-based walk-through collection for mushrooms
    // Optimized: only check and call once per mushroom per frame (avoid redundant proximity checks)
    objects.mushrooms.forEach((m, i) => {
      if (!m.visible || collectedMushroomsRef.current.has(i)) return;
      const dx = px - m.position.x;
      const dz = pz - m.position.z;
      if (dx * dx + dz * dz < COLLECT_RADIUS_SQ) {
        collectMushroomRef.current?.(i);
      }
    });

    // Log — player walks into collision wall -> triggers roll with current speed
    if (allMushroomsFoundRef.current && !logRolledRef.current) {
      const box = objects.logCollision;
      const distToBoxZ = Math.max(0, box.minZ - pz, pz - box.maxZ);
      const distToBoxX = Math.max(0, box.minX - px, px - box.maxX);
      const distToBox = Math.sqrt(distToBoxX * distToBoxX + distToBoxZ * distToBoxZ);
      if (distToBox < 1.0) {
        const impactSpeed = controllerRef.current?.currentSpeed ?? 1;
        rollLogRef.current?.(impactSpeed);
      }
    }

    // Wobble animations for bumped trees — updates InstancedMesh matrices per wobbling tree
    wobbleMapRef.current.forEach((wobble, treeIdx) => {
      const t = (performance.now() - wobble.startTime) / 700;
      if (t >= 1) {
        applyTreeWobble(objects.treeMeshes, objects.treeTransforms, treeIdx, 0);
        wobbleMapRef.current.delete(treeIdx);
        return;
      }
      const wobbleZ = wobble.sign * Math.sin(t * Math.PI * 4) * 0.14 * (1 - t);
      applyTreeWobble(objects.treeMeshes, objects.treeTransforms, treeIdx, wobbleZ);
    });

    // Map fragment (only after log is rolled)
    if (logRolledRef.current && objects.mapFragment.visible) {
      const fx = px - objects.mapFragment.position.x;
      const fz = pz - objects.mapFragment.position.z;
      if (fx * fx + fz * fz < COLLECT_RADIUS_SQ) {
        pickupFragmentRef.current?.();
      }
    }
  }, []);

  // Touch handler callbacks
  const handleJoystick = useCallback((x, y) => {
    controllerRef.current?.setJoystick(x, y);
  }, []);

  const handleLook = useCallback((dx, dy) => {
    controllerRef.current?.addLookDelta(dx, dy);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0d2208' }}>
      {/* Three.js canvas fills entire screen */}
      <ThreeCanvas onReady={handleReady} onFrame={handleFrame} />

      {/* Crosshair */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 22,
          height: 22,
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        <div style={{ position: 'absolute', top: 9, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.55)', boxShadow: '0 0 4px rgba(0,0,0,0.8)' }} />
        <div style={{ position: 'absolute', left: 9, top: 0, bottom: 0, width: 2, background: 'rgba(255,255,255,0.55)', boxShadow: '0 0 4px rgba(0,0,0,0.8)' }} />
        <div style={{ position: 'absolute', top: 8, left: 8, width: 4, height: 4, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.7)' }} />
      </div>

      {/* Top-right collectables HUD */}
      <CollectableHUD
        mushroomCount={mushroomCount}
        totalMushrooms={TOTAL_MUSHROOMS}
        logRolled={logRolled}
      />

      {/* Title (top-center) */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(20, 12, 4, 0.55)',
          backdropFilter: 'blur(6px)',
          border: '1px solid rgba(160, 110, 50, 0.4)',
          borderRadius: 8,
          padding: '5px 18px',
          color: '#f0e0c0',
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 1,
          fontFamily: 'system-ui, sans-serif',
          pointerEvents: 'none',
          zIndex: 5,
          whiteSpace: 'nowrap',
          textShadow: '0 1px 4px rgba(0,0,0,0.8)',
        }}
      >
        🌲 Het Oude Woud
      </div>

      {/* Touch controls (joystick + look + action button) */}
      {/* Raise joystick when a bottom-bar dialogue is visible so it doesn't overlap */}
      <TouchControls
        onJoystick={handleJoystick}
        onLook={handleLook}
        onInteract={() => {}}
        actionLabel={null}
        onExit={onExit}
        joystickBottomOffset={dialogue && !dialogue.centered ? 115 : 50}
      />

      {/* Freek dialogue box */}
      {dialogue && (
        <DialogueBox
          line={dialogue.lines[dialogue.index]}
          onNext={advanceDialogue}
          isLast={dialogue.index === dialogue.lines.length - 1}
          centered={!!dialogue.centered}
        />
      )}
    </div>
  );
}
