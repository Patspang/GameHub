// Het Oude Woud — Island 1
// Player collects 3 mushrooms, rolls a log, picks up map fragment
// All game logic lives here; Three.js objects are in OudWoudScene.js

import { useState, useRef, useCallback } from 'react';
import { ThreeCanvas } from '../../engine/ThreeCanvas';
import { FirstPersonController } from '../../engine/FirstPersonController';
import { buildOudWoudScene } from './OudWoudScene';
import { DialogueBox } from '../../ui/DialogueBox';
import { CollectableHUD } from '../../ui/CollectableHUD';
import { TouchControls } from '../../ui/TouchControls';
import { OUD_WOUD_DIALOGUES } from '../../data/freek-dialogues';

const COLLECT_RADIUS = 1.8; // walk through to collect
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

    setMushroomCount((prev) => {
      const next = prev + 1;
      if (next === TOTAL_MUSHROOMS) {
        allMushroomsFoundRef.current = true;
        setTimeout(() => {
          setDialogue({
            lines: OUD_WOUD_DIALOGUES.allMushrooms,
            index: 0,
            onDone: null,
          });
        }, 0);
      } else {
        const lines = OUD_WOUD_DIALOGUES.mushroomFound(next);
        if (lines) {
          setTimeout(() => {
            setDialogue({
              lines,
              index: 0,
              onDone: null,
              autoClose: 5000,
            });
          }, 0);
        }
      }
      return next;
    });
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
    setDialogue({ lines: OUD_WOUD_DIALOGUES.logRolled, index: 0, onDone: null });
  };

  // Fragment pickup callback
  const fragmentCollectedRef = useRef(false);
  const pickupFragmentRef = useRef(null);
  pickupFragmentRef.current = () => {
    if (fragmentCollectedRef.current) return;
    fragmentCollectedRef.current = true;
    const frag = sceneObjectsRef.current?.mapFragment;
    if (frag) frag.visible = false;
    setDialogue({ lines: OUD_WOUD_DIALOGUES.complete, index: 0, onDone: onComplete });
  };

  // --- Three.js setup (called once when canvas is ready) ---
  const handleReady = useCallback(
    ({ scene, camera }) => {
      const objects = buildOudWoudScene(scene);
      sceneObjectsRef.current = objects;

      // Position camera at start
      camera.position.copy(objects.startPosition);

      // First-person controller with collision data
      const controller = new FirstPersonController(camera);
      objects.collisionCircles.forEach(({ x, z, r }) =>
        controller.addCollisionCircle(x, z, r)
      );
      const { minX, maxX, minZ, maxZ } = objects.logCollision;
      logBoxIndexRef.current = controller.addCollisionBox(minX, maxX, minZ, maxZ);
      controllerRef.current = controller;

      // Intro dialogue
      setDialogue({
        lines: OUD_WOUD_DIALOGUES.intro(playerName),
        index: 0,
        onDone: null,
      });
    },
    [playerName]
  );

  // --- Frame update (called every animation frame) ---
  const handleFrame = useCallback(({ delta, camera }) => {
    controllerRef.current?.update(delta);

    const objects = sceneObjectsRef.current;
    if (!objects || !camera) return;

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
    objects.mushrooms.forEach((m, i) => {
      if (!m.visible) return;
      const dx = px - m.position.x;
      const dz = pz - m.position.z;
      if (Math.sqrt(dx * dx + dz * dz) < COLLECT_RADIUS) {
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

    // Map fragment (only after log is rolled)
    if (logRolledRef.current && objects.mapFragment.visible) {
      const fx = px - objects.mapFragment.position.x;
      const fz = pz - objects.mapFragment.position.z;
      if (Math.sqrt(fx * fx + fz * fz) < COLLECT_RADIUS) {
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
      <TouchControls
        onJoystick={handleJoystick}
        onLook={handleLook}
        onInteract={() => {}}
        actionLabel={null}
        onExit={onExit}
      />

      {/* Freek dialogue box */}
      {dialogue && (
        <DialogueBox
          line={dialogue.lines[dialogue.index]}
          onNext={advanceDialogue}
          isLast={dialogue.index === dialogue.lines.length - 1}
        />
      )}
    </div>
  );
}
