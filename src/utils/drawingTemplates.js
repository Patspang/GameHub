// Coloring page template definitions for Tekenen & Kleuren
// Each template draws a black outlined shape on a canvas context
// Coordinates are normalized to canvas width/height for scaling

const OUTLINE_COLOR = '#2D3748';

function getLineWidth(w) {
  return Math.max(3, w * 0.008);
}

function setupCtx(ctx, w) {
  ctx.strokeStyle = OUTLINE_COLOR;
  ctx.lineWidth = getLineWidth(w);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.fillStyle = 'transparent';
}

function drawHeart(ctx, w, h) {
  setupCtx(ctx, w);
  const cx = w * 0.5;
  const cy = h * 0.45;
  const size = Math.min(w, h) * 0.35;

  ctx.beginPath();
  ctx.moveTo(cx, cy + size * 0.7);
  // Left curve
  ctx.bezierCurveTo(
    cx - size * 1.2, cy - size * 0.2,
    cx - size * 0.6, cy - size * 1.0,
    cx, cy - size * 0.3
  );
  // Right curve
  ctx.bezierCurveTo(
    cx + size * 0.6, cy - size * 1.0,
    cx + size * 1.2, cy - size * 0.2,
    cx, cy + size * 0.7
  );
  ctx.stroke();
}

function drawStar(ctx, w, h) {
  setupCtx(ctx, w);
  const cx = w * 0.5;
  const cy = h * 0.48;
  const outerR = Math.min(w, h) * 0.35;
  const innerR = outerR * 0.4;
  const points = 5;

  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerR : innerR;
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
}

function drawHouse(ctx, w, h) {
  setupCtx(ctx, w);
  const s = Math.min(w, h);
  const left = w * 0.2;
  const right = w * 0.8;
  const top = h * 0.55;
  const bottom = h * 0.85;
  const roofPeak = h * 0.15;
  const midX = w * 0.5;

  // Walls
  ctx.beginPath();
  ctx.rect(left, top, right - left, bottom - top);
  ctx.stroke();

  // Roof
  ctx.beginPath();
  ctx.moveTo(left - s * 0.03, top);
  ctx.lineTo(midX, roofPeak);
  ctx.lineTo(right + s * 0.03, top);
  ctx.closePath();
  ctx.stroke();

  // Door
  const doorW = (right - left) * 0.22;
  const doorH = (bottom - top) * 0.45;
  ctx.beginPath();
  ctx.rect(midX - doorW / 2, bottom - doorH, doorW, doorH);
  ctx.stroke();

  // Door handle
  ctx.beginPath();
  ctx.arc(midX + doorW * 0.25, bottom - doorH * 0.45, s * 0.012, 0, Math.PI * 2);
  ctx.stroke();

  // Left window
  const winSize = (right - left) * 0.18;
  const winY = top + (bottom - top) * 0.2;
  ctx.beginPath();
  ctx.rect(left + (right - left) * 0.12, winY, winSize, winSize);
  ctx.stroke();
  // Window cross
  ctx.beginPath();
  ctx.moveTo(left + (right - left) * 0.12 + winSize / 2, winY);
  ctx.lineTo(left + (right - left) * 0.12 + winSize / 2, winY + winSize);
  ctx.moveTo(left + (right - left) * 0.12, winY + winSize / 2);
  ctx.lineTo(left + (right - left) * 0.12 + winSize, winY + winSize / 2);
  ctx.stroke();

  // Right window
  ctx.beginPath();
  ctx.rect(right - (right - left) * 0.12 - winSize, winY, winSize, winSize);
  ctx.stroke();
  // Window cross
  const rwLeft = right - (right - left) * 0.12 - winSize;
  ctx.beginPath();
  ctx.moveTo(rwLeft + winSize / 2, winY);
  ctx.lineTo(rwLeft + winSize / 2, winY + winSize);
  ctx.moveTo(rwLeft, winY + winSize / 2);
  ctx.lineTo(rwLeft + winSize, winY + winSize / 2);
  ctx.stroke();
}

function drawFlower(ctx, w, h) {
  setupCtx(ctx, w);
  const cx = w * 0.5;
  const cy = h * 0.38;
  const s = Math.min(w, h);
  const petalR = s * 0.1;
  const centerR = s * 0.07;
  const petalDist = s * 0.13;

  // Stem
  ctx.beginPath();
  ctx.moveTo(cx, cy + centerR);
  ctx.lineTo(cx, h * 0.85);
  ctx.stroke();

  // Leaves
  ctx.beginPath();
  ctx.ellipse(cx - s * 0.08, h * 0.65, s * 0.07, s * 0.03, -Math.PI / 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx + s * 0.08, h * 0.72, s * 0.07, s * 0.03, Math.PI / 6, 0, Math.PI * 2);
  ctx.stroke();

  // Petals
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6;
    const px = cx + Math.cos(angle) * petalDist;
    const py = cy + Math.sin(angle) * petalDist;
    ctx.beginPath();
    ctx.ellipse(px, py, petalR, petalR * 0.65, angle, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Center
  ctx.beginPath();
  ctx.arc(cx, cy, centerR, 0, Math.PI * 2);
  ctx.stroke();
}

function drawFish(ctx, w, h) {
  setupCtx(ctx, w);
  const cx = w * 0.45;
  const cy = h * 0.5;
  const s = Math.min(w, h);
  const bodyRx = s * 0.28;
  const bodyRy = s * 0.16;

  // Body
  ctx.beginPath();
  ctx.ellipse(cx, cy, bodyRx, bodyRy, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Tail
  const tailX = cx + bodyRx * 0.85;
  ctx.beginPath();
  ctx.moveTo(tailX, cy);
  ctx.lineTo(tailX + s * 0.15, cy - s * 0.12);
  ctx.lineTo(tailX + s * 0.15, cy + s * 0.12);
  ctx.closePath();
  ctx.stroke();

  // Eye
  ctx.beginPath();
  ctx.arc(cx - bodyRx * 0.45, cy - bodyRy * 0.15, s * 0.025, 0, Math.PI * 2);
  ctx.stroke();
  // Pupil
  ctx.beginPath();
  ctx.arc(cx - bodyRx * 0.47, cy - bodyRy * 0.15, s * 0.01, 0, Math.PI * 2);
  ctx.fillStyle = OUTLINE_COLOR;
  ctx.fill();
  ctx.fillStyle = 'transparent';

  // Mouth
  ctx.beginPath();
  ctx.arc(cx - bodyRx * 0.75, cy + bodyRy * 0.1, s * 0.03, -0.3, 0.8);
  ctx.stroke();

  // Fin
  ctx.beginPath();
  ctx.ellipse(cx + bodyRx * 0.1, cy - bodyRy * 0.8, s * 0.08, s * 0.04, -0.3, 0, Math.PI * 2);
  ctx.stroke();
}

function drawCat(ctx, w, h) {
  setupCtx(ctx, w);
  const cx = w * 0.5;
  const s = Math.min(w, h);
  const headR = s * 0.18;
  const headY = h * 0.35;

  // Head
  ctx.beginPath();
  ctx.arc(cx, headY, headR, 0, Math.PI * 2);
  ctx.stroke();

  // Left ear
  ctx.beginPath();
  ctx.moveTo(cx - headR * 0.75, headY - headR * 0.65);
  ctx.lineTo(cx - headR * 0.55, headY - headR * 1.4);
  ctx.lineTo(cx - headR * 0.05, headY - headR * 0.85);
  ctx.stroke();

  // Right ear
  ctx.beginPath();
  ctx.moveTo(cx + headR * 0.75, headY - headR * 0.65);
  ctx.lineTo(cx + headR * 0.55, headY - headR * 1.4);
  ctx.lineTo(cx + headR * 0.05, headY - headR * 0.85);
  ctx.stroke();

  // Eyes
  ctx.beginPath();
  ctx.ellipse(cx - headR * 0.35, headY - headR * 0.1, s * 0.025, s * 0.03, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx + headR * 0.35, headY - headR * 0.1, s * 0.025, s * 0.03, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Nose (small triangle)
  ctx.beginPath();
  ctx.moveTo(cx, headY + headR * 0.1);
  ctx.lineTo(cx - s * 0.02, headY + headR * 0.22);
  ctx.lineTo(cx + s * 0.02, headY + headR * 0.22);
  ctx.closePath();
  ctx.stroke();

  // Mouth
  ctx.beginPath();
  ctx.moveTo(cx, headY + headR * 0.22);
  ctx.lineTo(cx - s * 0.04, headY + headR * 0.38);
  ctx.moveTo(cx, headY + headR * 0.22);
  ctx.lineTo(cx + s * 0.04, headY + headR * 0.38);
  ctx.stroke();

  // Whiskers
  ctx.beginPath();
  ctx.moveTo(cx - headR * 0.2, headY + headR * 0.2);
  ctx.lineTo(cx - headR * 1.1, headY + headR * 0.05);
  ctx.moveTo(cx - headR * 0.2, headY + headR * 0.28);
  ctx.lineTo(cx - headR * 1.1, headY + headR * 0.3);
  ctx.moveTo(cx + headR * 0.2, headY + headR * 0.2);
  ctx.lineTo(cx + headR * 1.1, headY + headR * 0.05);
  ctx.moveTo(cx + headR * 0.2, headY + headR * 0.28);
  ctx.lineTo(cx + headR * 1.1, headY + headR * 0.3);
  ctx.stroke();

  // Body
  const bodyTop = headY + headR * 0.8;
  const bodyBottom = h * 0.82;
  ctx.beginPath();
  ctx.ellipse(cx, (bodyTop + bodyBottom) / 2, s * 0.15, (bodyBottom - bodyTop) / 2, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Tail
  ctx.beginPath();
  ctx.moveTo(cx + s * 0.12, bodyBottom - s * 0.05);
  ctx.quadraticCurveTo(cx + s * 0.3, bodyBottom - s * 0.15, cx + s * 0.25, bodyBottom - s * 0.3);
  ctx.stroke();
}

function drawButterfly(ctx, w, h) {
  setupCtx(ctx, w);
  const cx = w * 0.5;
  const cy = h * 0.5;
  const s = Math.min(w, h);

  // Body
  ctx.beginPath();
  ctx.ellipse(cx, cy, s * 0.02, s * 0.2, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Head
  ctx.beginPath();
  ctx.arc(cx, cy - s * 0.22, s * 0.035, 0, Math.PI * 2);
  ctx.stroke();

  // Antennae
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.02, cy - s * 0.25);
  ctx.quadraticCurveTo(cx - s * 0.1, cy - s * 0.38, cx - s * 0.15, cy - s * 0.35);
  ctx.moveTo(cx + s * 0.02, cy - s * 0.25);
  ctx.quadraticCurveTo(cx + s * 0.1, cy - s * 0.38, cx + s * 0.15, cy - s * 0.35);
  ctx.stroke();

  // Antenna tips
  ctx.beginPath();
  ctx.arc(cx - s * 0.15, cy - s * 0.35, s * 0.015, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + s * 0.15, cy - s * 0.35, s * 0.015, 0, Math.PI * 2);
  ctx.stroke();

  // Upper wings
  ctx.beginPath();
  ctx.ellipse(cx - s * 0.18, cy - s * 0.08, s * 0.17, s * 0.14, -0.3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx + s * 0.18, cy - s * 0.08, s * 0.17, s * 0.14, 0.3, 0, Math.PI * 2);
  ctx.stroke();

  // Lower wings
  ctx.beginPath();
  ctx.ellipse(cx - s * 0.14, cy + s * 0.12, s * 0.12, s * 0.1, 0.4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx + s * 0.14, cy + s * 0.12, s * 0.12, s * 0.1, -0.4, 0, Math.PI * 2);
  ctx.stroke();

  // Wing decorations (small circles)
  ctx.beginPath();
  ctx.arc(cx - s * 0.2, cy - s * 0.1, s * 0.04, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + s * 0.2, cy - s * 0.1, s * 0.04, 0, Math.PI * 2);
  ctx.stroke();
}

function drawRainbow(ctx, w, h) {
  setupCtx(ctx, w);
  const cx = w * 0.5;
  const baseY = h * 0.72;
  const s = Math.min(w, h);
  const outerR = s * 0.4;
  const bandWidth = s * 0.04;

  // Draw 7 rainbow arcs (outlines only)
  for (let i = 0; i < 7; i++) {
    const r = outerR - i * bandWidth;
    ctx.beginPath();
    ctx.arc(cx, baseY, r, Math.PI, 0);
    ctx.stroke();
  }

  // Ground line
  ctx.beginPath();
  ctx.moveTo(cx - outerR - s * 0.03, baseY);
  ctx.lineTo(cx + outerR + s * 0.03, baseY);
  ctx.stroke();

  // Small clouds at base
  const cloudR = s * 0.04;
  // Left cloud
  ctx.beginPath();
  ctx.arc(cx - outerR + cloudR, baseY, cloudR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx - outerR + cloudR * 2.2, baseY - cloudR * 0.3, cloudR * 0.8, 0, Math.PI * 2);
  ctx.stroke();
  // Right cloud
  ctx.beginPath();
  ctx.arc(cx + outerR - cloudR, baseY, cloudR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + outerR - cloudR * 2.2, baseY - cloudR * 0.3, cloudR * 0.8, 0, Math.PI * 2);
  ctx.stroke();
}

const TEMPLATE_DRAWERS = {
  heart: drawHeart,
  star: drawStar,
  house: drawHouse,
  flower: drawFlower,
  fish: drawFish,
  cat: drawCat,
  butterfly: drawButterfly,
  rainbow: drawRainbow,
};

export const TEMPLATES = [
  { id: 'heart', emoji: '\u2764\uFE0F' },
  { id: 'star', emoji: '\u2B50' },
  { id: 'house', emoji: '\uD83C\uDFE0' },
  { id: 'flower', emoji: '\uD83C\uDF38' },
  { id: 'fish', emoji: '\uD83D\uDC1F' },
  { id: 'cat', emoji: '\uD83D\uDC31' },
  { id: 'butterfly', emoji: '\uD83E\uDD8B' },
  { id: 'rainbow', emoji: '\uD83C\uDF08' },
];

export function drawTemplate(ctx, templateId, width, height) {
  const drawer = TEMPLATE_DRAWERS[templateId];
  if (drawer) {
    ctx.save();
    drawer(ctx, width, height);
    ctx.restore();
  }
}
