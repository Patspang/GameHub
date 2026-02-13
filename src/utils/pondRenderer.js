// PixiJS drawing factories for Cijfer Vissen pond scene
// All functions return PixiJS display objects — no React dependency

import { Container, Graphics, Text, TextStyle, Ellipse } from 'pixi.js';

// Colors
const GRASS_GREEN = 0x7CB342;
const GRASS_DARK = 0x558B2F;
const WATER_LIGHT = 0x7BB3E8;
const WATER_MID = 0x4A90E2;
const WATER_DARK = 0x3B7DD0;
const BOAT_BROWN = 0x8D6E63;
const BOAT_DECK = 0xBCAAA4;
const FISH_COLORS = [0xFF7043, 0xFFB74D, 0x4FC3F7];
const FISH_EYE = 0xFFFFFF;
const FISH_PUPIL = 0x2D3748;

// Draw the complete pond background (grass + water ellipse layers)
export function drawPondBackground(width, height) {
  const container = new Container();
  container.label = 'pondBackground';

  const cx = width / 2;
  const cy = height / 2;
  const rx = width * 0.44;
  const ry = height * 0.44;

  // Grass background
  const grass = new Graphics();
  grass.rect(0, 0, width, height);
  grass.fill({ color: GRASS_GREEN });
  container.addChild(grass);

  // Single water ellipse with uniform color
  const water = new Graphics();
  water.ellipse(cx, cy, rx, ry);
  water.fill({ color: WATER_LIGHT });
  container.addChild(water);

  return { container, bounds: { centerX: cx, centerY: cy, radiusX: rx, radiusY: ry } };
}

// Draw the boat in the center with a problem text area
export function drawBoat(cx, cy) {
  const container = new Container();
  container.label = 'boat';
  container.x = cx;
  container.y = cy;

  const boatW = 110;
  const boatH = 70;

  // Boat hull
  const hull = new Graphics();
  hull.roundRect(-boatW / 2, -boatH / 2, boatW, boatH, 16);
  hull.fill({ color: BOAT_BROWN });
  container.addChild(hull);

  // Deck
  const deck = new Graphics();
  deck.roundRect(-boatW / 2 + 6, -boatH / 2 + 6, boatW - 12, boatH - 12, 12);
  deck.fill({ color: BOAT_DECK });
  container.addChild(deck);

  // Problem text
  const style = new TextStyle({
    fontFamily: 'Fredoka, Comic Sans MS, cursive',
    fontSize: 28,
    fontWeight: 'bold',
    fill: 0x2D3748,
    align: 'center',
  });
  const problemText = new Text({ text: '', style });
  problemText.label = 'problemText';
  problemText.anchor.set(0.5);
  problemText.y = -2;
  container.addChild(problemText);

  return container;
}

// Update the math problem displayed on the boat
export function updateBoatProblem(boatContainer, text) {
  const problemText = boatContainer.getChildByLabel('problemText');
  if (problemText) {
    problemText.text = text;
  }
}

// Create a single fish with a number on it
export function createFish(answer, x, y, colorIndex = 0) {
  const container = new Container();
  container.label = 'fish';
  container.x = x;
  container.y = y;

  const color = FISH_COLORS[colorIndex % FISH_COLORS.length];
  const bodyW = 50;
  const bodyH = 30;

  // Fish body (ellipse)
  const body = new Graphics();
  body.ellipse(0, 0, bodyW / 2, bodyH / 2);
  body.fill({ color });
  container.addChild(body);

  // Tail (triangle)
  const tail = new Graphics();
  tail.moveTo(-bodyW / 2 - 2, 0);
  tail.lineTo(-bodyW / 2 - 18, -14);
  tail.lineTo(-bodyW / 2 - 18, 14);
  tail.closePath();
  tail.fill({ color });
  container.addChild(tail);

  // Eye (white circle + pupil)
  const eye = new Graphics();
  eye.circle(bodyW / 4, -bodyH / 6, 6);
  eye.fill({ color: FISH_EYE });
  eye.circle(bodyW / 4 + 1.5, -bodyH / 6, 3);
  eye.fill({ color: FISH_PUPIL });
  container.addChild(eye);

  // Number text on the fish body
  const numStyle = new TextStyle({
    fontFamily: 'Fredoka, Comic Sans MS, cursive',
    fontSize: 22,
    fontWeight: 'bold',
    fill: 0xFFFFFF,
    stroke: { color: 0x2D3748, width: 2 },
    align: 'center',
  });
  const numText = new Text({ text: String(answer), style: numStyle });
  numText.label = 'numberText';
  numText.anchor.set(0.5);
  numText.y = 2;
  container.addChild(numText);

  // Make interactive with enlarged hit area for children
  container.eventMode = 'static';
  container.cursor = 'pointer';
  container.hitArea = new Ellipse(0, 0, bodyW / 2 + 12, bodyH / 2 + 12);

  return container;
}

// Draw a fishing line from boat to fish
export function drawFishingLine(fromX, fromY, toX, toY) {
  const line = new Graphics();
  line.label = 'fishingLine';
  line.moveTo(fromX, fromY);
  line.lineTo(toX, toY);
  line.stroke({ color: 0x5D4037, width: 2.5 });
  return line;
}

// Create subtle water ripple circles (decorative)
export function createRipple(x, y) {
  const ripple = new Graphics();
  ripple.label = 'ripple';
  ripple.circle(x, y, 8);
  ripple.stroke({ color: 0xFFFFFF, width: 1, alpha: 0.3 });
  return ripple;
}
