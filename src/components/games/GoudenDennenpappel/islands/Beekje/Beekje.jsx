import { useState, useRef, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import { ThreeCanvas } from '../../engine/ThreeCanvas';
import { FirstPersonController } from '../../engine/FirstPersonController';
import { InteractionSystem } from '../../engine/InteractionSystem';
import { buildBeekjeScene } from './BeekjeScene';
import { DialogueBox } from '../../ui/DialogueBox';
import { TouchControls } from '../../ui/TouchControls';
import { BEEKJE_DIALOGUES } from '../../data/freek-dialogues';

function buildSkyEnvMap(renderer) {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 32);
  grad.addColorStop(0, '#4b8bb6');
  grad.addColorStop(0.4, '#7fc0d8');
  grad.addColorStop(0.55, '#d9c28f');
  grad.addColorStop(1, '#7d5f38');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 32);

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

const STONE_PICKUP_RADIUS_SQ = 2.8 * 2.8;
const FRAGMENT_COLLECT_RADIUS_SQ = 1.9 * 1.9;

export function Beekje({ playerName, onComplete, onExit }) {
  const [dialogue, setDialogue] = useState(null);
  const [placedCount, setPlacedCount] = useState(0);
  const [heldStoneNumber, setHeldStoneNumber] = useState(null);
  const [actionLabel, setActionLabel] = useState(null);

  const sceneObjectsRef = useRef(null);
  const controllerRef = useRef(null);
  const interactionRef = useRef(null);
  const currentInteractionRef = useRef(null);

  const heldStoneRef = useRef(null);
  const firstPickupShownRef = useRef(false);
  const stonesCompleteRef = useRef(false);
  const languageSolvedRef = useRef(false);
  const fragmentCollectedRef = useRef(false);

  const tmpForwardRef = useRef(new THREE.Vector3());
  const actionLabelRef = useRef(null);

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

  const showAutoDialogue = useCallback((lines, autoClose = 4200) => {
    setDialogue({ lines, index: 0, autoClose });
  }, []);

  // auto-close short bottom dialogues
  const autoCloseTimerRef = useRef(null);
  useEffect(() => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    if (!dialogue?.autoClose) return undefined;

    autoCloseTimerRef.current = setTimeout(() => {
      setDialogue((d) => (d === dialogue ? null : d));
      autoCloseTimerRef.current = null;
    }, dialogue.autoClose);

    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
        autoCloseTimerRef.current = null;
      }
    };
  }, [dialogue]);

  const pickupStone = useCallback((stone) => {
    if (heldStoneRef.current || stone.userData.placed) return;

    const camera = controllerRef.current?.camera;
    if (!camera) return;
    const dx = camera.position.x - stone.position.x;
    const dz = camera.position.z - stone.position.z;
    if (dx * dx + dz * dz > STONE_PICKUP_RADIUS_SQ) return;

    heldStoneRef.current = stone;
    setHeldStoneNumber(stone.userData.number);

    if (!firstPickupShownRef.current) {
      firstPickupShownRef.current = true;
      showAutoDialogue(BEEKJE_DIALOGUES.firstStonePicked);
    }
  }, [showAutoDialogue]);

  const tryPlaceOnSlot = useCallback((slot) => {
    const stone = heldStoneRef.current;
    if (!stone || slot.userData.occupied) return;

    if (stone.userData.number === slot.userData.expected) {
      stone.position.set(slot.userData.slotX, 0.7, slot.userData.slotZ);
      stone.rotation.set(0, 0, 0);
      stone.userData.placed = true;
      slot.userData.occupied = true;
      heldStoneRef.current = null;
      setHeldStoneNumber(null);

      setPlacedCount((prev) => {
        const next = prev + 1;
        if (next === 5) {
          stonesCompleteRef.current = true;
          setDialogue({
            lines: BEEKJE_DIALOGUES.allStonesPlaced,
            index: 0,
            onDone: () => {
              const objects = sceneObjectsRef.current;
              if (!objects) return;
              objects.flowingWater.visible = true;
              objects.waterfall.visible = true;
              objects.pond.visible = true;
              objects.wordOptions.forEach((o) => {
                o.visible = true;
              });
            },
          });
        }
        return next;
      });
    } else {
      stone.userData.shakeStart = performance.now();
      showAutoDialogue(BEEKJE_DIALOGUES.wrongPlacement, 2800);
    }
  }, [showAutoDialogue]);

  const solveWord = useCallback((word) => {
    if (!stonesCompleteRef.current || languageSolvedRef.current) return;

    if (word === 'BENEDEN') {
      languageSolvedRef.current = true;
      const objects = sceneObjectsRef.current;
      if (objects) objects.mapFragment.visible = true;
      setDialogue({
        lines: BEEKJE_DIALOGUES.wordSolved,
        index: 0,
        autoClose: 5000,
      });
    } else {
      showAutoDialogue(BEEKJE_DIALOGUES.wrongPlacement, 2400);
    }
  }, [showAutoDialogue]);

  const handleReady = useCallback(({ scene, camera, renderer }) => {
    const objects = buildBeekjeScene(scene);
    sceneObjectsRef.current = objects;
    camera.position.copy(objects.startPosition);

    const envRT = buildSkyEnvMap(renderer);
    scene.environment = envRT.texture;

    const controller = new FirstPersonController(camera);
    const b = objects.islandBounds;
    controller.addCollisionBox(-500, b.minX, -500, 500);
    controller.addCollisionBox(b.maxX, 500, -500, 500);
    controller.addCollisionBox(-500, 500, b.maxZ, 500);
    controller.addCollisionBox(-500, 500, -500, b.minZ);
    controllerRef.current = controller;

    const interaction = new InteractionSystem(camera);
    objects.stones.forEach((stone) => {
      interaction.add(stone, () => pickupStone(stone), 'Pak steen');
    });
    objects.slotMarkers.forEach((slot) => {
      interaction.add(slot, () => tryPlaceOnSlot(slot), 'Leg steen neer');
    });
    objects.wordOptions.forEach((option) => {
      interaction.add(option, () => solveWord(option.userData.word), 'Kies woord');
    });
    interactionRef.current = interaction;

    setDialogue({ lines: BEEKJE_DIALOGUES.intro(playerName), index: 0, centered: true });
  }, [pickupStone, playerName, solveWord, tryPlaceOnSlot]);

  const handleFrame = useCallback(({ delta, camera }) => {
    controllerRef.current?.update(delta);

    const objects = sceneObjectsRef.current;
    if (!objects || !camera) return;

    if (objects.flowingWater.visible) {
      objects.waterMaterial.map.offset.x += delta * 0.012;
      objects.waterMaterial.map.offset.y += delta * 0.03;
    }

    const heldStone = heldStoneRef.current;
    if (heldStone && !heldStone.userData.placed) {
      const forward = tmpForwardRef.current;
      forward.set(0, 0, -1).applyQuaternion(camera.quaternion);
      heldStone.position.x += (camera.position.x + forward.x * 1.2 - heldStone.position.x) * 0.1;
      heldStone.position.z += (camera.position.z + forward.z * 1.2 - heldStone.position.z) * 0.1;
      heldStone.position.y += (1.25 - heldStone.position.y) * 0.16;
      heldStone.rotation.y += delta * 1.8;

      if (heldStone.userData.shakeStart) {
        const t = (performance.now() - heldStone.userData.shakeStart) / 400;
        if (t < 1) {
          heldStone.position.x += Math.sin(t * Math.PI * 6) * 0.12 * (1 - t);
        } else {
          heldStone.userData.shakeStart = null;
        }
      }
    }

    const current = interactionRef.current?.update() || null;
    currentInteractionRef.current = current;
    const nextLabel = current?.label ?? null;
    if (nextLabel !== actionLabelRef.current) {
      actionLabelRef.current = nextLabel;
      setActionLabel(nextLabel);
    }

    if (languageSolvedRef.current && !fragmentCollectedRef.current) {
      const dx = camera.position.x - objects.mapFragment.position.x;
      const dz = camera.position.z - objects.mapFragment.position.z;
      if (dx * dx + dz * dz < FRAGMENT_COLLECT_RADIUS_SQ) {
        fragmentCollectedRef.current = true;
        objects.mapFragment.visible = false;
        setDialogue({
          lines: [...BEEKJE_DIALOGUES.completeSecret(playerName), ...BEEKJE_DIALOGUES.toNext],
          index: 0,
          centered: true,
          onDone: onComplete,
        });
      }
    }
  }, [onComplete, playerName]);

  const handleJoystick = useCallback((x, y) => {
    controllerRef.current?.setJoystick(x, y);
  }, []);

  const handleLook = useCallback((dx, dy) => {
    controllerRef.current?.addLookDelta(dx, dy);
  }, []);

  const handleInteract = useCallback(() => {
    currentInteractionRef.current?.callback?.();
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#16331f' }}>
      <ThreeCanvas onReady={handleReady} onFrame={handleFrame} />

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 20,
          height: 20,
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        <div style={{ position: 'absolute', top: 9, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.6)' }} />
        <div style={{ position: 'absolute', left: 9, top: 0, bottom: 0, width: 2, background: 'rgba(255,255,255,0.6)' }} />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(20, 12, 4, 0.55)',
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
        }}
      >
        💧 Het Beekje
      </div>

      <div
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          background: 'linear-gradient(180deg, #2e1e0a 0%, #1a0e05 100%)',
          border: '2px solid #7a5a2e',
          borderRadius: 12,
          overflow: 'hidden',
          minWidth: 150,
          boxShadow: '0 4px 18px rgba(0,0,0,0.55)',
          zIndex: 10,
        }}
      >
        <div style={{ background: 'linear-gradient(90deg, #3d2510, #2e1808)', borderBottom: '2px solid #7a5a2e', padding: '7px 14px' }}>
          <span style={{ color: '#f0d060', fontSize: 12, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif' }}>
            Opdracht
          </span>
        </div>
        <div style={{ padding: '10px 14px 12px' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: i < placedCount ? 'radial-gradient(circle at 35% 35%, #8fc8ff, #4b7ca8)' : 'rgba(255,255,255,0.12)',
                  border: '2px solid rgba(255,255,255,0.25)',
                }}
              />
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: '#d8e8f8', fontFamily: 'system-ui, sans-serif', minHeight: 14 }}>
            {heldStoneNumber ? `Je draagt steen ${heldStoneNumber}` : 'Leg de stenen op volgorde'}
          </div>
        </div>
      </div>

      <TouchControls
        onJoystick={handleJoystick}
        onLook={handleLook}
        onInteract={handleInteract}
        actionLabel={actionLabel}
        onExit={onExit}
        joystickBottomOffset={dialogue && !dialogue.centered ? 115 : 50}
      />

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
