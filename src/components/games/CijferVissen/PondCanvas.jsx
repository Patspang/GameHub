// PixiJS canvas for Cijfer Vissen pond scene
// Renders: grass, water, boat with math problem, 3 swimming fish
// Fish click detection, catch animation, wrong-fish shake + flee
// React controls what's shown via props; PixiJS handles rendering + physics

import { useRef, useEffect, useCallback } from 'react';
import { Application } from 'pixi.js';
import { CIJFER_VISSEN_CONFIG } from '../../../constants/gameConfig';
import {
  drawPondBackground,
  drawBoat,
  updateBoatProblem,
  createFish,
  drawFishingLine,
} from '../../../utils/pondRenderer';

const {
  FISH_MAX_SPEED,
  FISH_SCARED_SPEED_MULTIPLIER,
  FISH_SCARED_DURATION,
  BOAT_AVOIDANCE_RADIUS,
  POND_FISH_MARGIN,
  CATCH_ANIMATION_DURATION,
  SHAKE_DURATION,
} = CIJFER_VISSEN_CONFIG;

// Fish state object (not a React state — lives in refs for the ticker)
function makeFishState(container, answer, isCorrect, index) {
  const angle = (index * Math.PI * 2) / 3 + Math.random() * 0.5;
  return {
    container,
    answer,
    isCorrect,
    vx: Math.cos(angle) * FISH_MAX_SPEED * 0.5,
    vy: Math.sin(angle) * FISH_MAX_SPEED * 0.5,
    wobblePhase: Math.random() * Math.PI * 2,
    scared: false,
    frozen: false,
  };
}

export function PondCanvas({ problem, onFishClick, gamePhase, actionsRef }) {
  const containerRef = useRef(null);
  const appRef = useRef(null);
  const fishStatesRef = useRef([]);
  const pondBoundsRef = useRef(null);
  const boatRef = useRef(null);
  const lineRef = useRef(null);
  const onFishClickRef = useRef(onFishClick);
  const gamePhaseRef = useRef(gamePhase);

  // Keep callback ref current
  useEffect(() => { onFishClickRef.current = onFishClick; }, [onFishClick]);
  useEffect(() => { gamePhaseRef.current = gamePhase; }, [gamePhase]);

  // Initialize PixiJS application
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let destroyed = false;
    const app = new Application();

    (async () => {
      const rect = el.getBoundingClientRect();
      const w = rect.width || 600;
      const h = rect.height || 450;

      await app.init({
        background: 0x7CB342,
        width: w,
        height: h,
        antialias: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        autoDensity: true,
      });

      if (destroyed) { app.destroy(true); return; }

      el.appendChild(app.canvas);
      appRef.current = app;

      // Draw pond
      const { container: pondBg, bounds } = drawPondBackground(w, h);
      pondBoundsRef.current = bounds;
      app.stage.addChild(pondBg);

      // Draw boat
      const boat = drawBoat(bounds.centerX, bounds.centerY);
      boatRef.current = boat;
      app.stage.addChild(boat);

      // Fish swimming ticker
      app.ticker.add((ticker) => {
        const dt = ticker.deltaTime;
        const bounds = pondBoundsRef.current;
        if (!bounds) return;

        for (const fish of fishStatesRef.current) {
          if (!fish || fish.frozen) continue;

          // Random direction changes for organic swimming
          if (Math.random() < 0.02) {
            fish.vx += (Math.random() - 0.5) * 0.5;
            fish.vy += (Math.random() - 0.5) * 0.5;
          }

          // Sine-wave wobble
          fish.wobblePhase += 0.04 * dt;
          const wobble = Math.sin(fish.wobblePhase) * 0.25;

          // Speed limiting
          const maxSpeed = fish.scared ? FISH_MAX_SPEED * FISH_SCARED_SPEED_MULTIPLIER : FISH_MAX_SPEED;
          const speed = Math.sqrt(fish.vx * fish.vx + fish.vy * fish.vy);
          if (speed > maxSpeed) {
            fish.vx = (fish.vx / speed) * maxSpeed;
            fish.vy = (fish.vy / speed) * maxSpeed;
          }

          // Move
          fish.container.x += (fish.vx + wobble) * dt;
          fish.container.y += fish.vy * dt;

          // Flip fish based on direction (keep number readable)
          if (fish.vx < -0.1) {
            fish.container.scale.x = -1;
            const numText = fish.container.getChildByLabel('numberText');
            if (numText) numText.scale.x = -1;
          } else if (fish.vx > 0.1) {
            fish.container.scale.x = 1;
            const numText = fish.container.getChildByLabel('numberText');
            if (numText) numText.scale.x = 1;
          }

          // Ellipse boundary check
          const dx = fish.container.x - bounds.centerX;
          const dy = fish.container.y - bounds.centerY;
          const dist = Math.sqrt(
            (dx / bounds.radiusX) ** 2 + (dy / bounds.radiusY) ** 2
          );
          if (dist > POND_FISH_MARGIN) {
            fish.vx *= -0.8;
            fish.vy *= -0.8;
            const pushback = (POND_FISH_MARGIN - 0.03) / dist;
            fish.container.x = bounds.centerX + dx * pushback;
            fish.container.y = bounds.centerY + dy * pushback;
          }

          // Boat avoidance
          const boatDist = Math.sqrt(dx * dx + dy * dy);
          if (boatDist < BOAT_AVOIDANCE_RADIUS) {
            const angle = Math.atan2(dy, dx);
            fish.vx += Math.cos(angle) * 0.3 * dt;
            fish.vy += Math.sin(angle) * 0.3 * dt;
          }
        }
      });

      // Handle resize
      const ro = new ResizeObserver((entries) => {
        const { width: newW, height: newH } = entries[0].contentRect;
        if (newW > 0 && newH > 0 && appRef.current) {
          appRef.current.renderer.resize(newW, newH);
        }
      });
      ro.observe(el);

      // Store cleanup for ResizeObserver
      app._ro = ro;
    })();

    return () => {
      destroyed = true;
      if (appRef.current) {
        if (appRef.current._ro) appRef.current._ro.disconnect();
        appRef.current.destroy(true, { children: true });
        appRef.current = null;
      }
    };
  }, []);

  // Spawn / update fish when problem changes
  useEffect(() => {
    const app = appRef.current;
    const bounds = pondBoundsRef.current;
    if (!app || !bounds || !problem) return;

    // Remove old fish
    for (const fish of fishStatesRef.current) {
      if (fish?.container?.parent) {
        fish.container.parent.removeChild(fish.container);
      }
    }
    // Remove old fishing line
    if (lineRef.current?.parent) {
      lineRef.current.parent.removeChild(lineRef.current);
      lineRef.current = null;
    }

    // Update boat text
    updateBoatProblem(boatRef.current, `${problem.num1} ${problem.operator} ${problem.num2} = ?`);

    // Shuffle answers and create fish
    const answers = [
      { value: problem.correctAnswer, isCorrect: true },
      { value: problem.wrongAnswers[0], isCorrect: false },
      { value: problem.wrongAnswers[1], isCorrect: false },
    ];
    // Shuffle
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }

    const newFishStates = answers.map((ans, i) => {
      // Position fish evenly around the pond, away from boat
      const angle = (i * Math.PI * 2) / 3 + Math.random() * 0.4 - 0.2;
      const dist = bounds.radiusX * 0.6 + Math.random() * bounds.radiusX * 0.15;
      const x = bounds.centerX + Math.cos(angle) * dist;
      const y = bounds.centerY + Math.sin(angle) * (dist * bounds.radiusY / bounds.radiusX);

      const fishContainer = createFish(ans.value, x, y, i);

      // Click handler
      fishContainer.on('pointerdown', () => {
        if (gamePhaseRef.current !== 'playing') return;
        onFishClickRef.current(i, ans.isCorrect);
      });

      app.stage.addChild(fishContainer);
      return makeFishState(fishContainer, ans.value, ans.isCorrect, i);
    });

    fishStatesRef.current = newFishStates;
  }, [problem]);

  // Handle catch animation (correct fish)
  const animateCatch = useCallback((fishIndex) => {
    const fish = fishStatesRef.current[fishIndex];
    const bounds = pondBoundsRef.current;
    const app = appRef.current;
    if (!fish || !bounds || !app) return;

    fish.frozen = true;

    // Draw fishing line
    const line = drawFishingLine(
      bounds.centerX, bounds.centerY,
      fish.container.x, fish.container.y
    );
    lineRef.current = line;
    app.stage.addChild(line);

    // Animate fish toward boat
    const startX = fish.container.x;
    const startY = fish.container.y;
    const startTime = performance.now();

    const catchTicker = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / CATCH_ANIMATION_DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out

      fish.container.x = startX + (bounds.centerX - startX) * eased;
      fish.container.y = startY + (bounds.centerY - startY) * eased;
      fish.container.scale.set(1 - progress * 0.7);

      // Update line
      if (lineRef.current?.parent) {
        lineRef.current.parent.removeChild(lineRef.current);
      }
      const updatedLine = drawFishingLine(
        bounds.centerX, bounds.centerY,
        fish.container.x, fish.container.y
      );
      lineRef.current = updatedLine;
      app.stage.addChild(updatedLine);

      if (progress >= 1) {
        app.ticker.remove(catchTicker);
        // Remove fish and line
        if (fish.container.parent) fish.container.parent.removeChild(fish.container);
        if (lineRef.current?.parent) lineRef.current.parent.removeChild(lineRef.current);
        lineRef.current = null;
      }
    };

    app.ticker.add(catchTicker);
  }, []);

  // Handle wrong fish animation (shake + flee)
  const animateWrong = useCallback((fishIndex) => {
    const fish = fishStatesRef.current[fishIndex];
    if (!fish) return;

    // Shake phase
    fish.frozen = true;
    const origX = fish.container.x;
    const shakeStart = performance.now();
    const app = appRef.current;
    if (!app) return;

    const shakeTicker = () => {
      const elapsed = performance.now() - shakeStart;
      if (elapsed < SHAKE_DURATION) {
        fish.container.x = origX + (Math.random() - 0.5) * 10;
      } else {
        // End shake, start scared swim
        fish.container.x = origX;
        fish.frozen = false;
        fish.scared = true;

        // Swim away from center
        const dx = fish.container.x - pondBoundsRef.current.centerX;
        const dy = fish.container.y - pondBoundsRef.current.centerY;
        const angle = Math.atan2(dy, dx);
        fish.vx = Math.cos(angle) * FISH_MAX_SPEED * FISH_SCARED_SPEED_MULTIPLIER;
        fish.vy = Math.sin(angle) * FISH_MAX_SPEED * FISH_SCARED_SPEED_MULTIPLIER;

        // Return to normal after duration
        setTimeout(() => {
          fish.scared = false;
        }, FISH_SCARED_DURATION);

        app.ticker.remove(shakeTicker);
      }
    };

    app.ticker.add(shakeTicker);
  }, []);

  // Expose animation methods to parent via actionsRef
  useEffect(() => {
    if (actionsRef) {
      actionsRef.current = { animateCatch, animateWrong };
    }
  }, [actionsRef, animateCatch, animateWrong]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-2xl overflow-hidden shadow-lg"
      style={{
        touchAction: 'none',
        aspectRatio: '4 / 3',
        maxWidth: 700,
        maxHeight: 525,
      }}
    />
  );
}
