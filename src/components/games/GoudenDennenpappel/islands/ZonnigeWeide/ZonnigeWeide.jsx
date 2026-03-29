// De Zonnige Weide — Island 2
// Player matches 3 butterfly-flower pairs by color/petal count, then collects map fragment
// All game logic lives here; Three.js objects are in ZonnigeWeideScene.js

import { useState, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { ThreeCanvas } from '../../engine/ThreeCanvas';
import { FirstPersonController } from '../../engine/FirstPersonController';
import { buildZonnigeWeideScene, applyTreeWobble } from './ZonnigeWeideScene';
import { DialogueBox } from '../../ui/DialogueBox';
import { TouchControls } from '../../ui/TouchControls';
import { ZONNIGE_WEIDE_DIALOGUES } from '../../data/freek-dialogues';

// GDP-003: Sky env map for PBR surfaces
function buildSkyEnvMap(renderer) {
  const w = 64, h = 32;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');

  // Brighter, warmer sky for the sunny meadow
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#2e8acc');
  grad.addColorStop(0.35, '#6ec8e8');
  grad.addColorStop(0.48, '#ffe8a0');
  grad.addColorStop(1, '#8b7020');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  const srcTex = new THREE.CanvasTexture(canvas);
  srcTex.mapping = THREE.EquirectangularReflectionMapping;
  srcTex.colorSpace = THREE.SRGBColorSpace;

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const rt = pmrem.fromEquirectangular(srcTex);
  srcTex.dispose();
  pmrem.dispose();
  return rt;
}

const BUTTERFLY_APPROACH_RADIUS = 3.0;
const BUTTERFLY_APPROACH_SQ = BUTTERFLY_APPROACH_RADIUS * BUTTERFLY_APPROACH_RADIUS;
const FLOWER_MATCH_RADIUS = 2.5;
const FLOWER_MATCH_SQ = FLOWER_MATCH_RADIUS * FLOWER_MATCH_RADIUS;
const FRAGMENT_COLLECT_RADIUS = 1.8;
const FRAGMENT_COLLECT_SQ = FRAGMENT_COLLECT_RADIUS * FRAGMENT_COLLECT_RADIUS;
const TOTAL_PAIRS = 5;

export function ZonnigeWeide({ playerName, onComplete, onExit }) {
  // React state (drives UI re-renders)
  const [matchCount, setMatchCount] = useState(0);
  const [dialogue, setDialogue] = useState(null);
  const [activeButterfly, setActiveButterfly] = useState(-1); // index of butterfly following player

  // Three.js refs (no re-renders)
  const controllerRef = useRef(null);
  const sceneObjectsRef = useRef(null);
  const wobbleMapRef = useRef(new Map());

  // Game state refs
  const matchedPairsRef = useRef(new Set()); // indices of matched pairs
  const activeButterflyRef = useRef(-1);     // which butterfly is following
  const allMatchedRef = useRef(false);
  const swarmDepartingRef = useRef(null);    // animation state for swarm flying away
  const fragmentCollectedRef = useRef(false);
  const fragmentBoxIndexRef = useRef(-1);    // collision box blocking access to fragment

  // Butterfly animation state
  const butterflyTimeRef = useRef(0);

  // Dialogue helpers
  const showDialogue = useCallback((lines, onDone, centered = false) => {
    setDialogue({ lines, index: 0, onDone: onDone ?? null, centered });
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

  // Auto-close dialogue
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

  // --- Callback refs ---

  // Pick up butterfly (player approaches idle butterfly)
  const pickupButterflyRef = useRef(null);
  pickupButterflyRef.current = (index) => {
    if (matchedPairsRef.current.has(index)) return;
    if (activeButterflyRef.current >= 0) return; // already carrying one

    activeButterflyRef.current = index;
    setActiveButterfly(index);

    // First butterfly dialogue
    if (matchedPairsRef.current.size === 0) {
      setDialogue({
        lines: ZONNIGE_WEIDE_DIALOGUES.butterflyApproached,
        index: 0,
        onDone: null,
        autoClose: 5000,
      });
    }
  };

  // Try to match butterfly with flower
  const tryMatchRef = useRef(null);
  tryMatchRef.current = (flowerIndex) => {
    const bIdx = activeButterflyRef.current;
    if (bIdx < 0) return;

    const objects = sceneObjectsRef.current;
    if (!objects) return;

    // Check if it's the correct pair (same index = same color)
    if (bIdx === flowerIndex) {
      // Correct match!
      matchedPairsRef.current.add(bIdx);
      activeButterflyRef.current = -1;
      setActiveButterfly(-1);

      // Land butterfly on flower
      const flower = objects.flowers[flowerIndex];
      const butterfly = objects.butterflies[bIdx];
      butterfly.position.set(flower.position.x, 1.8, flower.position.z);
      butterfly.userData.landed = true;

      const count = matchedPairsRef.current.size;
      setMatchCount(count);

      if (count === TOTAL_PAIRS) {
        allMatchedRef.current = true;
        // All matched — show dialogue, then trigger swarm departure
        setDialogue({
          lines: ZONNIGE_WEIDE_DIALOGUES.allMatched,
          index: 0,
          centered: true,
          onDone: () => {
            // Remove collision box so player can reach the fragment
            controllerRef.current?.removeCollisionBox(fragmentBoxIndexRef.current);
            // Start swarm departure animation
            swarmDepartingRef.current = {
              startTime: performance.now(),
              duration: 2500,
            };
          },
        });
      } else if (count === 1) {
        setDialogue({
          lines: ZONNIGE_WEIDE_DIALOGUES.firstMatch(playerName),
          index: 0,
          onDone: null,
          autoClose: 5000,
        });
      }
    } else {
      // Wrong match — butterfly shakes
      const butterfly = objects.butterflies[bIdx];
      butterfly.userData.shakeStart = performance.now();

      setDialogue({
        lines: ZONNIGE_WEIDE_DIALOGUES.wrongMatch,
        index: 0,
        onDone: null,
        autoClose: 4000,
      });
    }
  };

  // Fragment pickup callback
  const pickupFragmentRef = useRef(null);
  pickupFragmentRef.current = () => {
    if (fragmentCollectedRef.current) return;
    fragmentCollectedRef.current = true;
    const frag = sceneObjectsRef.current?.mapFragment;
    if (frag) frag.visible = false;
    setDialogue({
      lines: ZONNIGE_WEIDE_DIALOGUES.complete,
      index: 0,
      onDone: onComplete,
      centered: true,
    });
  };

  // --- Three.js setup ---
  const handleReady = useCallback(
    ({ scene, camera, renderer }) => {
      // No fog for bright meadow — clear blue sky
      scene.fog = new THREE.FogExp2(0xa8d8e8, 0.012);
      scene.background = new THREE.Color(0x88c8ec);

      const objects = buildZonnigeWeideScene(scene);
      sceneObjectsRef.current = objects;

      // Warmer, brighter sky env map
      const envRT = buildSkyEnvMap(renderer);
      scene.environment = envRT.texture;

      camera.position.copy(objects.startPosition);

      // First-person controller with collision
      const controller = new FirstPersonController(camera);
      objects.collisionCircles.forEach((c, i) => {
        c.onHit = (relX) => {
          if (!wobbleMapRef.current.has(i)) {
            wobbleMapRef.current.set(i, { startTime: performance.now(), sign: relX >= 0 ? 1 : -1 });
          }
        };
        controller.addCollisionCircle(c.x, c.z, c.r);
        const entry = controller.collisionCircles[controller.collisionCircles.length - 1];
        entry.onHit = c.onHit;
      });

      // Island boundary walls
      const b = objects.islandBounds;
      controller.addCollisionBox(-500, b.minX, -500, 500);
      controller.addCollisionBox(b.maxX, 500, -500, 500);
      controller.addCollisionBox(-500, 500, b.maxZ, 500);
      controller.addCollisionBox(-500, 500, -500, b.minZ);

      controllerRef.current = controller;

      // Collision box around the fragment to block player while swarm is present
      // Fragment is at (0, -30), block a small area around it
      fragmentBoxIndexRef.current = controller.addCollisionBox(-1.5, 1.5, -31.5, -28.5);

      // Intro dialogue
      setDialogue({
        lines: ZONNIGE_WEIDE_DIALOGUES.intro(playerName),
        index: 0,
        onDone: null,
        centered: true,
      });
    },
    [playerName]
  );

  // --- Frame update ---
  const handleFrame = useCallback(({ delta, camera }) => {
    controllerRef.current?.update(delta);

    const objects = sceneObjectsRef.current;
    if (!objects || !camera) return;

    const px = camera.position.x;
    const pz = camera.position.z;

    // Hill elevation — adjust player Y based on proximity to hills
    if (objects.hillData) {
      let groundY = 0;
      for (const h of objects.hillData) {
        const dx = px - h.x;
        const dz = pz - h.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < h.radius) {
          // Inside hill circle — use hemisphere profile
          const t = dist / h.radius;
          const hillY = h.height * Math.sqrt(1 - t * t);
          if (hillY > groundY) groundY = hillY;
        }
      }
      camera.position.y = 1.7 + groundY;
    }

    // Animate water
    if (objects.waterMaterial?.map) {
      objects.waterMaterial.map.offset.x += delta * 0.012;
      objects.waterMaterial.map.offset.y += delta * 0.008;
    }

    // Track time for butterfly animations
    butterflyTimeRef.current += delta;
    const bTime = butterflyTimeRef.current;

    // Animate butterflies
    objects.butterflies.forEach((b, i) => {
      if (matchedPairsRef.current.has(i)) {
        // Landed on flower — gentle wing flap only
        if (b.userData.leftWing) {
          const flap = Math.sin(bTime * 2 + i) * 0.15;
          b.userData.leftWing.rotation.z = 0.1 + flap;
          b.userData.rightWing.rotation.z = -0.1 - flap;
        }
        return;
      }

      // Shake animation (wrong match feedback)
      if (b.userData.shakeStart) {
        const elapsed = (performance.now() - b.userData.shakeStart) / 600;
        if (elapsed < 1) {
          const shake = Math.sin(elapsed * Math.PI * 6) * 0.15 * (1 - elapsed);
          b.position.x += shake;
        } else {
          b.userData.shakeStart = null;
        }
      }

      if (activeButterflyRef.current === i) {
        // Following player — move towards player position (behind them)
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(camera.quaternion);
        const targetX = px - forward.x * 1.2;
        const targetZ = pz - forward.z * 1.2;
        b.position.x += (targetX - b.position.x) * 0.06;
        b.position.z += (targetZ - b.position.z) * 0.06;
        b.position.y = 1.6 + Math.sin(bTime * 3) * 0.15;

        // Wing flapping faster when following
        if (b.userData.leftWing) {
          const flap = Math.sin(bTime * 8) * 0.6;
          b.userData.leftWing.rotation.z = 0.3 + flap;
          b.userData.rightWing.rotation.z = -0.3 - flap;
        }
      } else {
        // Random waypoint flight across the island
        if (!b.userData.waypoint) {
          // Assign initial random waypoint within island grass area
          b.userData.waypoint = {
            x: -18 + Math.random() * 36,
            z: -60 + Math.random() * 60,
          };
          b.userData.waypointSpeed = 1.5 + Math.random() * 1.5;
        }
        const wp = b.userData.waypoint;
        const dxW = wp.x - b.position.x;
        const dzW = wp.z - b.position.z;
        const distW = Math.sqrt(dxW * dxW + dzW * dzW);

        if (distW < 1.5) {
          // Pick a new random waypoint
          b.userData.waypoint = {
            x: -18 + Math.random() * 36,
            z: -60 + Math.random() * 60,
          };
          b.userData.waypointSpeed = 1.5 + Math.random() * 1.5;
        } else {
          // Move towards waypoint
          const moveSpeed = b.userData.waypointSpeed * delta;
          b.position.x += (dxW / distW) * moveSpeed;
          b.position.z += (dzW / distW) * moveSpeed;
        }
        b.position.y = 1.5 + Math.sin(bTime * 1.2 + i * 3.0) * 0.5;

        // Wing flapping
        if (b.userData.leftWing) {
          const flap = Math.sin(bTime * 5 + i) * 0.5;
          b.userData.leftWing.rotation.z = 0.2 + flap;
          b.userData.rightWing.rotation.z = -0.2 - flap;
        }
      }

      // Billboard: make butterfly face camera (Y-axis only)
      b.lookAt(camera.position.x, b.position.y, camera.position.z);
    });

    // Proximity: pick up idle butterfly if player is near
    if (activeButterflyRef.current < 0) {
      objects.butterflies.forEach((b, i) => {
        if (matchedPairsRef.current.has(i)) return;
        const dx = px - b.position.x;
        const dz = pz - b.position.z;
        if (dx * dx + dz * dz < BUTTERFLY_APPROACH_SQ) {
          pickupButterflyRef.current?.(i);
        }
      });
    }

    // Proximity: match butterfly with flower (while carrying)
    if (activeButterflyRef.current >= 0) {
      objects.flowers.forEach((f, i) => {
        if (matchedPairsRef.current.has(i)) return;
        const dx = px - f.position.x;
        const dz = pz - f.position.z;
        if (dx * dx + dz * dz < FLOWER_MATCH_SQ) {
          // Flower proximity glow effect
          const glowLight = f.children.find(c => c.isPointLight);
          if (glowLight) glowLight.intensity = 1.0;
          tryMatchRef.current?.(i);
        } else {
          // Reset glow
          const glowLight = f.children.find(c => c.isPointLight);
          if (glowLight) glowLight.intensity = 0.4;
        }
      });
    }

    // Animate swarm butterflies (idle or departing)
    const swarmAnim = swarmDepartingRef.current;
    if (objects.swarmButterflies) {
      objects.swarmButterflies.forEach((sb, i) => {
        if (swarmAnim) {
          // Departing: fly upward and scatter
          const elapsed = performance.now() - swarmAnim.startTime;
          const t = Math.min(elapsed / swarmAnim.duration, 1);
          const ease = t * t;
          const scatterAngle = sb.userData.idleAngle + i * 0.8;
          sb.position.x = Math.cos(scatterAngle) * (sb.userData.idleRadius + ease * 8);
          sb.position.y = sb.userData.idleY + ease * 12;
          sb.position.z = -30 + Math.sin(scatterAngle) * (sb.userData.idleRadius + ease * 8);
          // Fast flapping
          const flap = Math.sin(bTime * 12 + i * 2) * 0.8;
          sb.userData.leftWing.rotation.z = 0.3 + flap;
          sb.userData.rightWing.rotation.z = -0.3 - flap;
          // Hide when high enough
          if (t >= 1) sb.visible = false;
        } else {
          // Idle: gentle wing flapping, slight bobbing on the fragment
          const flap = Math.sin(bTime * 3 + i * 1.3) * 0.4;
          sb.userData.leftWing.rotation.z = 0.15 + flap;
          sb.userData.rightWing.rotation.z = -0.15 - flap;
          // Subtle hover bob
          sb.position.y = sb.userData.idleY + Math.sin(bTime * 1.5 + i * 0.9) * 0.04;
        }
      });
    }

    // Fragment collection (swarm must be gone)
    if (allMatchedRef.current && !fragmentCollectedRef.current && (!swarmAnim || (performance.now() - swarmAnim.startTime) > swarmAnim.duration)) {
      const fx = px - objects.mapFragment.position.x;
      const fz = pz - objects.mapFragment.position.z;
      if (fx * fx + fz * fz < FRAGMENT_COLLECT_SQ) {
        pickupFragmentRef.current?.();
      }
    }

    // Tree wobble animations
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
  }, []);

  // Touch handlers
  const handleJoystick = useCallback((x, y) => {
    controllerRef.current?.setJoystick(x, y);
  }, []);

  const handleLook = useCallback((dx, dy) => {
    controllerRef.current?.addLookDelta(dx, dy);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#1a3a0f' }}>
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

      {/* Butterfly match HUD (top-right) */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          background: 'linear-gradient(180deg, #2e1e0a 0%, #1a0e05 100%)',
          border: '2px solid #7a5a2e',
          borderRadius: 12,
          overflow: 'hidden',
          minWidth: 160,
          boxShadow: '0 4px 18px rgba(0,0,0,0.55)',
          zIndex: 10,
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(90deg, #3d2510, #2e1808)',
            borderBottom: '2px solid #7a5a2e',
            padding: '7px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
          }}
        >
          <span style={{ fontSize: 14 }}>📜</span>
          <span
            style={{
              color: '#f0d060',
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Opdracht
          </span>
        </div>

        <div style={{ padding: '10px 14px 12px', display: 'flex', flexDirection: 'column', gap: 9 }}>
          {/* Butterfly pair progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ fontSize: 20, lineHeight: 1 }}>🦋</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {[0xe03030, 0x3060e0, 0xe0c020, 0x9040c0, 0xe07020].map((color, i) => {
                const matched = i < matchCount;
                const hex = `#${color.toString(16).padStart(6, '0')}`;
                return (
                  <div
                    key={i}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: matched
                        ? `radial-gradient(circle at 35% 35%, ${hex}, ${hex}88)`
                        : 'rgba(255,255,255,0.1)',
                      border: '2px solid',
                      borderColor: matched ? hex : 'rgba(255,255,255,0.2)',
                      transition: 'all 0.3s',
                      transform: matched ? 'scale(1.12)' : 'scale(1)',
                      boxShadow: matched ? `0 0 6px ${hex}88` : 'none',
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Current status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ fontSize: 16, lineHeight: 1 }}>
              {activeButterfly >= 0 ? '✨' : '👀'}
            </span>
            <span
              style={{
                color: activeButterfly >= 0 ? '#8ccc5c' : 'rgba(255,255,255,0.4)',
                fontSize: 11,
                fontWeight: 700,
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              {activeButterfly >= 0 ? 'Vlinder volgt jou!' : 'Zoek een vlinder'}
            </span>
          </div>
        </div>
      </div>

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
        🌻 De Zonnige Weide
      </div>

      {/* Touch controls */}
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
