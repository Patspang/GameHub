// PixiJS drawing factories for Bos Ritje forest scene
// All functions return PixiJS display objects — no React dependency

import { Container, Graphics, Text, TextStyle } from 'pixi.js';

// Colors
const GRASS_LIGHT = 0x8BC34A;
const GRASS_DARK = 0x689F38;
const PATH_BROWN = 0xD7CCC8;
const PATH_BROWN_DARK = 0xBCAAA4;
const TREE_GREEN = 0x2E7D32;
const TREE_GREEN_LIGHT = 0x43A047;
const TREE_TRUNK = 0x5D4037;
const ROCK_GRAY = 0x757575;
const ROCK_LIGHT = 0x9E9E9E;
const WATER_BLUE = 0x4FC3F7;
const WATER_DARK = 0x29B6F6;
const CAR_RED = 0xF44336;
const CAR_RED_DARK = 0xC62828;
const CAR_WINDOW = 0x64B5F6;
const CAR_WHEEL = 0x212121;
const GOAL_GREEN = 0x66BB6A;
const GOAL_WHITE = 0xFFFFFF;
const GRID_LINE = 0xA5D6A7;

export function drawGrassTile(size) {
  const g = new Graphics();
  g.rect(0, 0, size, size);
  g.fill({ color: GRASS_LIGHT });

  // Subtle grass dots for texture
  const dotCount = 4;
  for (let i = 0; i < dotCount; i++) {
    const dx = (size * 0.2) + Math.random() * (size * 0.6);
    const dy = (size * 0.2) + Math.random() * (size * 0.6);
    g.circle(dx, dy, size * 0.02);
    g.fill({ color: GRASS_DARK });
  }

  // Subtle grid border
  g.rect(0, 0, size, size);
  g.stroke({ color: GRID_LINE, width: 0.5 });

  return g;
}

export function drawPathTile(size) {
  const g = new Graphics();
  g.rect(0, 0, size, size);
  g.fill({ color: PATH_BROWN });

  // Subtle path texture dots
  for (let i = 0; i < 3; i++) {
    const dx = size * 0.15 + Math.random() * size * 0.7;
    const dy = size * 0.15 + Math.random() * size * 0.7;
    g.circle(dx, dy, size * 0.015);
    g.fill({ color: PATH_BROWN_DARK });
  }

  g.rect(0, 0, size, size);
  g.stroke({ color: GRID_LINE, width: 0.5 });

  return g;
}

export function drawTree(size) {
  const container = new Container();
  container.label = 'tree';

  // Shadow
  const shadow = new Graphics();
  shadow.ellipse(size * 0.5, size * 0.75, size * 0.3, size * 0.12);
  shadow.fill({ color: 0x000000, alpha: 0.15 });
  container.addChild(shadow);

  // Trunk
  const trunk = new Graphics();
  trunk.rect(size * 0.4, size * 0.45, size * 0.2, size * 0.35);
  trunk.fill({ color: TREE_TRUNK });
  container.addChild(trunk);

  // Crown (two overlapping circles for organic look)
  const crown = new Graphics();
  crown.circle(size * 0.5, size * 0.35, size * 0.3);
  crown.fill({ color: TREE_GREEN });
  crown.circle(size * 0.38, size * 0.32, size * 0.22);
  crown.fill({ color: TREE_GREEN_LIGHT });
  container.addChild(crown);

  return container;
}

export function drawRock(size) {
  const container = new Container();
  container.label = 'rock';

  // Shadow
  const shadow = new Graphics();
  shadow.ellipse(size * 0.52, size * 0.72, size * 0.28, size * 0.1);
  shadow.fill({ color: 0x000000, alpha: 0.15 });
  container.addChild(shadow);

  // Main rock body (irregular polygon)
  const rock = new Graphics();
  rock.moveTo(size * 0.25, size * 0.65);
  rock.lineTo(size * 0.15, size * 0.45);
  rock.lineTo(size * 0.3, size * 0.25);
  rock.lineTo(size * 0.55, size * 0.2);
  rock.lineTo(size * 0.75, size * 0.3);
  rock.lineTo(size * 0.8, size * 0.5);
  rock.lineTo(size * 0.7, size * 0.65);
  rock.closePath();
  rock.fill({ color: ROCK_GRAY });
  container.addChild(rock);

  // Highlight on rock
  const highlight = new Graphics();
  highlight.moveTo(size * 0.35, size * 0.35);
  highlight.lineTo(size * 0.5, size * 0.28);
  highlight.lineTo(size * 0.6, size * 0.35);
  highlight.lineTo(size * 0.5, size * 0.4);
  highlight.closePath();
  highlight.fill({ color: ROCK_LIGHT, alpha: 0.5 });
  container.addChild(highlight);

  return container;
}

export function drawWater(size) {
  const container = new Container();
  container.label = 'water';

  // Water base
  const water = new Graphics();
  water.rect(0, 0, size, size);
  water.fill({ color: WATER_BLUE });
  container.addChild(water);

  // Wave lines
  const waves = new Graphics();
  for (let i = 0; i < 3; i++) {
    const y = size * (0.25 + i * 0.25);
    waves.moveTo(size * 0.1, y);
    waves.quadraticCurveTo(size * 0.3, y - size * 0.06, size * 0.5, y);
    waves.quadraticCurveTo(size * 0.7, y + size * 0.06, size * 0.9, y);
    waves.stroke({ color: WATER_DARK, width: 1.5, alpha: 0.5 });
  }
  container.addChild(waves);

  return container;
}

export function drawGoal(size) {
  const container = new Container();
  container.label = 'goal';

  // No background — path tile is already drawn on the grid layer

  // Checkered flag pattern
  const flagW = size * 0.5;
  const flagH = size * 0.35;
  const flagX = size * 0.35;
  const flagY = size * 0.15;
  const cellSize = flagW / 4;

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      const color = (r + c) % 2 === 0 ? GOAL_WHITE : 0x2D3748;
      const cell = new Graphics();
      cell.rect(flagX + c * cellSize, flagY + r * cellSize, cellSize, cellSize);
      cell.fill({ color });
      container.addChild(cell);
    }
  }

  // Flag pole
  const pole = new Graphics();
  pole.rect(flagX - 2, flagY, 3, size * 0.65);
  pole.fill({ color: 0x5D4037 });
  container.addChild(pole);

  // "DOEL" label
  const style = new TextStyle({
    fontFamily: 'Fredoka, Comic Sans MS, cursive',
    fontSize: Math.max(10, size * 0.18),
    fontWeight: 'bold',
    fill: GOAL_GREEN,
  });
  const label = new Text({ text: '🏁', style });
  label.anchor.set(0.5);
  label.x = size * 0.65;
  label.y = size * 0.75;
  container.addChild(label);

  return container;
}

// Direction angles in radians: north=up, east=right, south=down, west=left
const DIR_ANGLES = {
  north: -Math.PI / 2,
  east: 0,
  south: Math.PI / 2,
  west: Math.PI,
};

export function drawCar(size) {
  // Car is drawn facing east (0 degrees), then rotated by direction
  const container = new Container();
  container.label = 'car';

  const w = size * 0.7;
  const h = size * 0.45;

  // Shadow
  const shadow = new Graphics();
  shadow.ellipse(0, size * 0.08, w * 0.5, h * 0.25);
  shadow.fill({ color: 0x000000, alpha: 0.15 });
  container.addChild(shadow);

  // Car body
  const body = new Graphics();
  body.roundRect(-w / 2, -h / 2, w, h, size * 0.08);
  body.fill({ color: CAR_RED });
  container.addChild(body);

  // Car roof / window area
  const roof = new Graphics();
  const roofW = w * 0.4;
  const roofH = h * 0.6;
  roof.roundRect(-roofW / 2, -roofH / 2, roofW, roofH, size * 0.04);
  roof.fill({ color: CAR_WINDOW });
  container.addChild(roof);

  // Front highlight (right side since facing east)
  const front = new Graphics();
  front.roundRect(w * 0.25, -h * 0.25, w * 0.12, h * 0.15, 2);
  front.fill({ color: 0xFFEB3B, alpha: 0.8 });
  front.roundRect(w * 0.25, h * 0.1, w * 0.12, h * 0.15, 2);
  front.fill({ color: 0xFFEB3B, alpha: 0.8 });
  container.addChild(front);

  // Wheels
  const wheelOffsets = [
    { x: -w * 0.28, y: -h * 0.45 },
    { x: -w * 0.28, y: h * 0.45 },
    { x: w * 0.28, y: -h * 0.45 },
    { x: w * 0.28, y: h * 0.45 },
  ];
  for (const off of wheelOffsets) {
    const wheel = new Graphics();
    wheel.roundRect(off.x - size * 0.05, off.y - size * 0.03, size * 0.1, size * 0.06, 2);
    wheel.fill({ color: CAR_WHEEL });
    container.addChild(wheel);
  }

  // Darker bottom edge for depth
  const edge = new Graphics();
  edge.roundRect(-w / 2, h * 0.1, w, h * 0.15, 4);
  edge.fill({ color: CAR_RED_DARK, alpha: 0.4 });
  container.addChild(edge);

  return container;
}

export function getDirectionAngle(direction) {
  return DIR_ANGLES[direction] || 0;
}

// Draw a small direction arrow for HUD/preview
export function drawDirectionArrow(size, direction) {
  const g = new Graphics();
  const r = size * 0.3;
  g.moveTo(0, -r);
  g.lineTo(r * 0.5, r * 0.4);
  g.lineTo(-r * 0.5, r * 0.4);
  g.closePath();
  g.fill({ color: CAR_RED });
  g.rotation = DIR_ANGLES[direction] + Math.PI / 2 || 0;
  return g;
}

// Top-view decorative tree for grass tiles (circle canopy with shadow)
// Draws relative to (0,0) = tile center so canopy naturally overflows tile edges
export function drawTreeTopView(size, variant = 0) {
  const container = new Container();
  container.label = 'tree-top';

  // Larger canopy that can overlap into neighboring tiles
  const scale = 0.38 + (variant % 4) * 0.05;
  const r = size * scale;

  // Offset from tile center for variety (-0.15 to +0.15 tile size)
  const ox = ((variant * 13) % 30 - 15) / 100 * size;
  const oy = ((variant * 19) % 30 - 15) / 100 * size;

  // Color palette — 4 shades for variety
  const greens = [0x2E7D32, 0x388E3C, 0x1B5E20, 0x33691E];
  const highlights = [0x43A047, 0x4CAF50, 0x2E7D32, 0x558B2F];
  const colorIdx = variant % greens.length;

  // Shadow (offset down-right)
  const shadow = new Graphics();
  shadow.circle(ox + 3, oy + 3, r);
  shadow.fill({ color: 0x000000, alpha: 0.1 });
  container.addChild(shadow);

  // Main canopy
  const canopy = new Graphics();
  canopy.circle(ox, oy, r);
  canopy.fill({ color: greens[colorIdx] });
  container.addChild(canopy);

  // Lighter inner highlight (offset up-left for sun effect)
  const highlight = new Graphics();
  highlight.circle(ox - r * 0.22, oy - r * 0.22, r * 0.55);
  highlight.fill({ color: highlights[colorIdx], alpha: 0.55 });
  container.addChild(highlight);

  // Tiny center dot for trunk peek-through
  const trunk = new Graphics();
  trunk.circle(ox, oy, r * 0.12);
  trunk.fill({ color: TREE_TRUNK, alpha: 0.4 });
  container.addChild(trunk);

  return container;
}

// Create dust particle (simple circle that fades)
export function createDustParticle(x, y) {
  const g = new Graphics();
  g.circle(0, 0, 3);
  g.fill({ color: PATH_BROWN_DARK, alpha: 0.6 });
  g.x = x;
  g.y = y;
  return g;
}

// Create impact star (small star shape)
export function createImpactStar(x, y) {
  const g = new Graphics();
  g.star(0, 0, 5, 8, 4);
  g.fill({ color: 0xFFD700 });
  g.x = x;
  g.y = y;
  return g;
}
