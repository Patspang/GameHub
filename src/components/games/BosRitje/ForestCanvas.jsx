// PixiJS canvas for Bos Ritje forest scene
// Renders: grid (grass/path), obstacles (trees/rocks/water), car, goal
// Exposes animation methods to parent via actionsRef

import { useRef, useEffect, useCallback } from 'react';
import { Application, Container } from 'pixi.js';
import { BOS_RITJE_CONFIG } from '../../../constants/gameConfig';
import {
  drawGrassTile, drawPathTile, drawTree, drawRock,
  drawWater, drawGoal, drawCar, getDirectionAngle,
  createDustParticle, createImpactStar, drawTreeTopView,
} from './forestRenderer';

const { MOVE_DURATION, TURN_DURATION } = BOS_RITJE_CONFIG;

// Ease-out cubic
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function ForestCanvas({ levelData, actionsRef }) {
  const containerRef = useRef(null);
  const appRef = useRef(null);
  const carRef = useRef(null);
  const gridContainerRef = useRef(null);
  const entityContainerRef = useRef(null);
  const particleContainerRef = useRef(null);
  const tileSizeRef = useRef(64);
  const initedRef = useRef(false);

  // Build the grid scene when levelData changes
  const buildScene = useCallback((app, level) => {
    // Clear stage
    app.stage.removeChildren();

    const { gridSize, grid, startX, startY, startDirection } = level;
    const { rows, cols } = gridSize;

    // Resize canvas to fit the grid with proper aspect ratio
    const el = containerRef.current;
    if (el) {
      const containerW = el.clientWidth;
      // Calculate tile size from container width
      const tileSize = Math.floor(containerW / cols);
      tileSizeRef.current = tileSize;
      const canvasW = cols * tileSize;
      const canvasH = rows * tileSize;

      app.renderer.resize(canvasW, canvasH);
      app.canvas.style.width = canvasW + 'px';
      app.canvas.style.height = canvasH + 'px';
    }

    const tileSize = tileSizeRef.current;

    // Grid container
    const gridContainer = new Container();
    gridContainer.label = 'grid';
    gridContainerRef.current = gridContainer;
    app.stage.addChild(gridContainer);

    // Decoration container (top-view trees, between grid and entities)
    const decoContainer = new Container();
    decoContainer.label = 'decorations';
    app.stage.addChild(decoContainer);

    // Entity container (car, obstacles above grid)
    const entityContainer = new Container();
    entityContainer.label = 'entities';
    entityContainerRef.current = entityContainer;
    app.stage.addChild(entityContainer);

    // Particle container (on top)
    const particleContainer = new Container();
    particleContainer.label = 'particles';
    particleContainerRef.current = particleContainer;
    app.stage.addChild(particleContainer);

    // Draw grid tiles and obstacles
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cellType = grid[r][c];
        const x = c * tileSize;
        const y = r * tileSize;

        // Base tile
        let tile;
        if (cellType === 'path' || cellType === 'start' || cellType === 'goal') {
          tile = drawPathTile(tileSize);
        } else {
          tile = drawGrassTile(tileSize);
        }
        tile.x = x;
        tile.y = y;
        gridContainer.addChild(tile);

        // Random decorative top-view trees on grass tiles (~40% chance)
        // Positioned from tile center so canopy naturally overflows into neighbors
        if (cellType === 'grass') {
          const seed = (r * 31 + c * 17 + (level.id || 0) * 7) % 100;
          if (seed < 40) {
            const treeTop = drawTreeTopView(tileSize, seed);
            treeTop.x = x + tileSize / 2;
            treeTop.y = y + tileSize / 2;
            decoContainer.addChild(treeTop);
          }
        }

        // Obstacles / goal on entity layer
        if (cellType === 'tree') {
          const tree = drawTree(tileSize);
          tree.x = x;
          tree.y = y;
          entityContainer.addChild(tree);
        } else if (cellType === 'rock') {
          const rock = drawRock(tileSize);
          rock.x = x;
          rock.y = y;
          entityContainer.addChild(rock);
        } else if (cellType === 'water') {
          const water = drawWater(tileSize);
          water.x = x;
          water.y = y;
          entityContainer.addChild(water);
        } else if (cellType === 'goal') {
          const goal = drawGoal(tileSize);
          goal.x = x;
          goal.y = y;
          entityContainer.addChild(goal);
        }
      }
    }

    // Draw car
    const car = drawCar(tileSize);
    car.x = startX * tileSize + tileSize / 2;
    car.y = startY * tileSize + tileSize / 2;
    car.rotation = getDirectionAngle(startDirection);
    carRef.current = car;
    entityContainer.addChild(car);
  }, []);

  // Initialize PixiJS application
  useEffect(() => {
    const el = containerRef.current;
    if (!el || initedRef.current) return;
    initedRef.current = true;

    let destroyed = false;
    const app = new Application();

    (async () => {
      // Start with a small default size; buildScene will resize
      await app.init({
        background: 0xE8F5E9,
        width: 300,
        height: 300,
        antialias: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        autoDensity: true,
      });

      if (destroyed) { app.destroy(true); return; }

      el.appendChild(app.canvas);
      appRef.current = app;

      if (levelData) {
        buildScene(app, levelData);
      }
    })();

    return () => {
      destroyed = true;
      initedRef.current = false;
      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
        appRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rebuild scene when level changes
  useEffect(() => {
    if (appRef.current && levelData) {
      buildScene(appRef.current, levelData);
    }
  }, [levelData, buildScene]);

  // Animate forward movement
  const executeForward = useCallback((fromCol, fromRow, toCol, toRow, onComplete) => {
    const app = appRef.current;
    const car = carRef.current;
    const tileSize = tileSizeRef.current;
    if (!app || !car) { onComplete?.(); return; }

    const startX = fromCol * tileSize + tileSize / 2;
    const startY = fromRow * tileSize + tileSize / 2;
    const endX = toCol * tileSize + tileSize / 2;
    const endY = toRow * tileSize + tileSize / 2;
    const startTime = performance.now();

    const moveTicker = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / MOVE_DURATION, 1);
      const eased = easeOutCubic(progress);

      car.x = startX + (endX - startX) * eased;
      car.y = startY + (endY - startY) * eased;

      // Emit dust particles at 25% progress
      if (progress > 0.2 && progress < 0.3) {
        emitDust(car.x, car.y);
      }

      if (progress >= 1) {
        app.ticker.remove(moveTicker);
        car.x = endX;
        car.y = endY;
        onComplete?.();
      }
    };

    app.ticker.add(moveTicker);
  }, []);

  // Animate turn (rotation)
  const executeTurn = useCallback((newDirection, onComplete) => {
    const app = appRef.current;
    const car = carRef.current;
    if (!app || !car) { onComplete?.(); return; }

    const startAngle = car.rotation;
    const targetAngle = getDirectionAngle(newDirection);

    // Compute shortest rotation path
    let diff = targetAngle - startAngle;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    const endAngle = startAngle + diff;
    const startTime = performance.now();

    const turnTicker = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / TURN_DURATION, 1);
      const eased = easeOutCubic(progress);

      car.rotation = startAngle + (endAngle - startAngle) * eased;

      if (progress >= 1) {
        app.ticker.remove(turnTicker);
        car.rotation = endAngle;
        onComplete?.();
      }
    };

    app.ticker.add(turnTicker);
  }, []);

  // Emit dust particles
  const emitDust = useCallback((x, y) => {
    const app = appRef.current;
    const container = particleContainerRef.current;
    if (!app || !container) return;

    for (let i = 0; i < 3; i++) {
      const dust = createDustParticle(
        x + (Math.random() - 0.5) * 10,
        y + (Math.random() - 0.5) * 10
      );
      container.addChild(dust);
      const startTime = performance.now();
      const angle = Math.random() * Math.PI * 2;
      const speed = 15 + Math.random() * 15;
      const startX = dust.x;
      const startY = dust.y;

      const dustTick = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / 400, 1);
        dust.x = startX + Math.cos(angle) * speed * progress;
        dust.y = startY + Math.sin(angle) * speed * progress;
        dust.alpha = 0.6 * (1 - progress);
        dust.scale.set(1 + progress * 0.5);

        if (progress >= 1) {
          app.ticker.remove(dustTick);
          if (dust.parent) dust.parent.removeChild(dust);
        }
      };
      app.ticker.add(dustTick);
    }
  }, []);

  // Collision shake effect
  const showCollision = useCallback(() => {
    const app = appRef.current;
    const car = carRef.current;
    const container = particleContainerRef.current;
    if (!app || !car) return;

    const origX = car.x;
    const origY = car.y;
    const shakeStart = performance.now();

    // Impact stars
    if (container) {
      for (let i = 0; i < 5; i++) {
        const star = createImpactStar(car.x, car.y);
        container.addChild(star);
        const angle = (i / 5) * Math.PI * 2;
        const dist = 25;
        const sx = star.x;
        const sy = star.y;
        const starStart = performance.now();

        const starTick = () => {
          const elapsed = performance.now() - starStart;
          const progress = Math.min(elapsed / 500, 1);
          star.x = sx + Math.cos(angle) * dist * progress;
          star.y = sy + Math.sin(angle) * dist * progress;
          star.alpha = 1 - progress;
          star.rotation = progress * Math.PI * 2;

          if (progress >= 1) {
            app.ticker.remove(starTick);
            if (star.parent) star.parent.removeChild(star);
          }
        };
        app.ticker.add(starTick);
      }
    }

    // Shake car
    const shakeTick = () => {
      const elapsed = performance.now() - shakeStart;
      if (elapsed < 300) {
        car.x = origX + (Math.random() - 0.5) * 8;
        car.y = origY + (Math.random() - 0.5) * 8;
      } else {
        car.x = origX;
        car.y = origY;
        app.ticker.remove(shakeTick);
      }
    };
    app.ticker.add(shakeTick);
  }, []);

  // Reset car to start position
  const resetCar = useCallback((startCol, startRow, direction) => {
    const car = carRef.current;
    const tileSize = tileSizeRef.current;
    if (!car) return;
    car.x = startCol * tileSize + tileSize / 2;
    car.y = startRow * tileSize + tileSize / 2;
    car.rotation = getDirectionAngle(direction);
  }, []);

  // Highlight current executing command on grid (show path preview)
  const highlightTile = useCallback(() => {
    // Simple highlight — we just rely on car position for now
  }, []);

  // Expose animation methods to parent
  useEffect(() => {
    if (actionsRef) {
      actionsRef.current = {
        executeForward,
        executeTurn,
        showCollision,
        resetCar,
        highlightTile,
      };
    }
  }, [actionsRef, executeForward, executeTurn, showCollision, resetCar, highlightTile]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-2xl overflow-hidden shadow-lg bg-[#E8F5E9] flex items-center justify-center"
      style={{
        touchAction: 'none',
        maxWidth: 600,
      }}
    />
  );
}
