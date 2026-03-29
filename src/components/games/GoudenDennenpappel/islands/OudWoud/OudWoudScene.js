// Builds the Three.js scene for Het Oude Woud (island 1)
// Returns all relevant objects for game logic + collision data
//
// Visual quality: PBR materials, 5-layer pine trees, scattered flora,
// enhanced gate, canvas textures for ground and path.

import * as THREE from 'three';

// ─── PBR material helper ─────────────────────────────────────────────────────

function makeMat(color, roughness = 0.85, metalness = 0.0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

// ─── Procedural canvas textures ─────────────────────────────────────────────

function makeGrassTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#4e9244';
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 300; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 4 + Math.random() * 22;
    ctx.globalAlpha = 0.18 + Math.random() * 0.18;
    ctx.fillStyle = Math.random() > 0.5 ? '#3d7a34' : '#5faa50';
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.6, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 0.12;
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    ctx.strokeStyle = '#2a5c1e';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 6, y - 8);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(18, 18);
  return tex;
}

function makeWaterTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Deep water base
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#1a6e9e');
  grad.addColorStop(0.5, '#1e7db5');
  grad.addColorStop(1, '#1560a0');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Ripple lines
  for (let i = 0; i < 28; i++) {
    const y = (i / 28) * size + Math.random() * 10;
    ctx.strokeStyle = `rgba(120, 200, 240, ${0.07 + Math.random() * 0.12})`;
    ctx.lineWidth = 1.5 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= size; x += 18) {
      ctx.lineTo(x, y + Math.sin(x * 0.04 + i) * 6);
    }
    ctx.stroke();
  }

  // Sparkle dots
  ctx.globalAlpha = 0.25;
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 1 + Math.random() * 2.5;
    ctx.fillStyle = '#b8e4f8';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(14, 14);
  return tex;
}

function makeDirtPathTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#a07850';
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 250; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 3 + Math.random() * 18;
    ctx.globalAlpha = 0.15 + Math.random() * 0.2;
    ctx.fillStyle = Math.random() > 0.5 ? '#8a6640' : '#b89060';
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.5, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 0.1;
  for (let y = 0; y < size; y += 12) {
    ctx.strokeStyle = '#7a5830';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y + Math.sin(y * 0.05) * 4);
    ctx.lineTo(size, y + Math.sin(y * 0.05 + 2) * 4);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 8);
  return tex;
}

// ─── GDP-004: Canvas-generated normal maps ────────────────────────────────────
// Normal maps are painted directly as RGB, encoding surface normal direction:
//   R = +X tangent slope,  G = +Y tangent slope,  B = up (Z).
//   Flat surface = (128, 128, 255) = {0,0,1} normal.

function makeGrassNormalMap() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Flat base (pointing up)
  ctx.fillStyle = 'rgb(128,128,255)';
  ctx.fillRect(0, 0, size, size);

  // Blade edges: thin strokes tilting slightly left/right
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const tiltR = 108 + Math.floor(Math.random() * 40); // slight right lean
    const tiltG = 128;
    ctx.strokeStyle = `rgb(${tiltR},${tiltG},220)`;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4 + Math.random() * 0.3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 4, y - 7);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(18, 18); // match grass color texture
  return tex;
}

function makeDirtNormalMap() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Flat base
  ctx.fillStyle = 'rgb(128,128,255)';
  ctx.fillRect(0, 0, size, size);

  // Pebble bumps — small ellipses with raised-edge normals
  for (let i = 0; i < 180; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 3 + Math.random() * 10;
    // left half of ellipse: normal tilts +X (reddish), right half: -X (blueish)
    const grad = ctx.createRadialGradient(x - r * 0.3, y, 0, x, y, r);
    grad.addColorStop(0,   'rgba(180,128,200,0.7)');   // raised centre
    grad.addColorStop(0.6, 'rgba(100,128,240,0.4)');   // sloped edge
    grad.addColorStop(1,   'rgba(128,128,255,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.55, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  // Rut grooves — horizontal stripes dipping slightly
  ctx.globalAlpha = 0.25;
  for (let y = 0; y < size; y += 12) {
    ctx.strokeStyle = 'rgb(128,100,220)'; // slight downward slope
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y + Math.sin(y * 0.05) * 3);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 8); // match dirt path color texture
  return tex;
}

function makeBarkNormalMap() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Flat base
  ctx.fillStyle = 'rgb(128,128,255)';
  ctx.fillRect(0, 0, size, size);

  // Vertical bark ridges — alternating left/right slopes
  const ridgeCount = 18;
  for (let i = 0; i < ridgeCount; i++) {
    const x = (i / ridgeCount) * size;
    const w = size / ridgeCount;
    // Ridge crest: tilted right on left half, left on right half
    const grad = ctx.createLinearGradient(x, 0, x + w, 0);
    grad.addColorStop(0,    'rgba(90,128,210,0.6)');  // slopes left
    grad.addColorStop(0.45, 'rgba(180,128,210,0.6)'); // ridge crest (tilts +X)
    grad.addColorStop(1,    'rgba(128,128,255,0.2)');
    ctx.fillStyle = grad;
    ctx.fillRect(x, 0, w, size);
  }

  // Horizontal cracks — slight downward dip
  ctx.globalAlpha = 0.3;
  for (let y = 14; y < size; y += 14 + Math.random() * 10) {
    ctx.strokeStyle = 'rgb(128,100,220)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let xi = 0; xi <= size; xi += 16) {
      ctx.lineTo(xi, y + (Math.random() - 0.5) * 4);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  // Cylinder UVs repeat naturally; ~2 repeats around, 4 up the trunk
  tex.repeat.set(2, 4);
  return tex;
}

// ─── Pine Tree — InstancedMesh data & helpers ────────────────────────────────

const LAYER_COLORS = [0x1a4a0e, 0x1f5512, 0x286618, 0x2e761e, 0x348424];
const LAYER_H      = [1.7,  2.65, 3.55, 4.35, 5.05];
const LAYER_R      = [1.25, 1.0,  0.76, 0.54, 0.36];

// Reusable objects for zero-alloc matrix computation (used during init and wobble)
const _matA   = new THREE.Matrix4();
const _matB   = new THREE.Matrix4();
const _posV   = new THREE.Vector3();
const _quatQ  = new THREE.Quaternion();
const _scaleV = new THREE.Vector3();
const _eulerE = new THREE.Euler();
const _outM   = new THREE.Matrix4();

// Builds the world matrix for one mesh within a tree:
//   base: translate to (x,0,z), apply world-Z wobble tilt
//   local: lift to localY, rotate Y by rotY, uniform scale s
function buildTreeMemberMatrix(out, x, z, localY, rotY, s, wobbleZ) {
  _matA.makeRotationZ(wobbleZ);
  _matA.setPosition(x, 0, z);
  _posV.set(0, localY, 0);
  _eulerE.set(0, rotY, 0);
  _quatQ.setFromEuler(_eulerE);
  _scaleV.setScalar(s);
  _matB.compose(_posV, _quatQ, _scaleV);
  out.multiplyMatrices(_matA, _matB);
}

// Updates all 6 InstancedMesh matrices for a single tree index.
// wobbleZ = 0 for upright, non-zero during bump animation.
export function applyTreeWobble(treeMeshes, treeTransforms, treeIdx, wobbleZ) {
  const tf = treeTransforms[treeIdx];
  buildTreeMemberMatrix(_outM, tf.x, tf.z, 1.2 * tf.scale, tf.yaw, tf.scale, wobbleZ);
  treeMeshes[0].setMatrixAt(treeIdx, _outM);
  treeMeshes[0].instanceMatrix.needsUpdate = true;
  for (let i = 0; i < 5; i++) {
    buildTreeMemberMatrix(_outM, tf.x, tf.z, LAYER_H[i] * tf.scale, tf.coneYaws[i], tf.scale, wobbleZ);
    treeMeshes[i + 1].setMatrixAt(treeIdx, _outM);
    treeMeshes[i + 1].instanceMatrix.needsUpdate = true;
  }
}

// ─── Red Mushroom ─────────────────────────────────────────────────────────────

function createMushroom(x, z) {
  const group = new THREE.Group();

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.14, 0.42, 8),
    makeMat(0xf5edd8, 0.75)
  );
  stem.position.y = 0.21;
  group.add(stem);

  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.33, 10, 7, 0, Math.PI * 2, 0, Math.PI * 0.52),
    new THREE.MeshStandardMaterial({ color: 0xe01414, roughness: 0.55 })
  );
  cap.position.y = 0.42;
  group.add(cap);

  const spotMat = makeMat(0xffffff, 0.6);
  [[-0.12, 0.05], [0.12, 0.08], [0.0, -0.14], [-0.04, 0.17], [0.16, -0.05]].forEach(([sx, sz]) => {
    const spot = new THREE.Mesh(new THREE.SphereGeometry(0.042, 5, 5), spotMat);
    spot.position.set(sx, 0.55, sz);
    group.add(spot);
  });

  const glow = new THREE.PointLight(0xff4422, 0.6, 3.5);
  glow.position.y = 0.7;
  group.add(glow);

  group.position.set(x, 0, z);
  return group;
}

// ─── Fallen Log (with end-grain detail) ──────────────────────────────────────

function createLog(x, z) {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.44, 0.44, 5.6, 9),
    makeMat(0x7a4a28, 0.9)
  );
  body.rotation.z = Math.PI / 2;
  body.castShadow = true;
  group.add(body);

  const endMat = makeMat(0x5a3318, 0.9);
  for (const side of [-2.82, 2.82]) {
    const endCap = new THREE.Mesh(new THREE.CircleGeometry(0.44, 9), endMat);
    endCap.rotation.y = Math.PI / 2;
    endCap.position.x = side;
    group.add(endCap);
  }

  group.position.set(x, 0.44, z);
  return group;
}

// ─── Map Fragment ─────────────────────────────────────────────────────────────

function createMapFragment(x, z) {
  const group = new THREE.Group();
  const frag = new THREE.Mesh(
    new THREE.PlaneGeometry(0.75, 0.95),
    new THREE.MeshStandardMaterial({
      color: 0xe8d5a0, emissive: 0xffcc44, emissiveIntensity: 0.55,
      roughness: 0.6, side: THREE.DoubleSide,
    })
  );
  frag.position.y = 0.05;
  frag.rotation.x = -Math.PI / 2;
  group.add(frag);

  const glow = new THREE.PointLight(0xffcc44, 2.0, 5);
  glow.position.y = 0.8;
  group.add(glow);

  group.position.set(x, 0, z);
  return group;
}

// ─── Rock ─────────────────────────────────────────────────────────────────────

function createRock(x, z, scale = 1) {
  const col = new THREE.Color(0x888888);
  col.lerp(new THREE.Color(0x6a6a6a), Math.random() * 0.4);
  const size = (0.22 + Math.random() * 0.22) * scale;
  const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(size, 0), makeMat(col, 0.9));
  rock.position.set(x, size * 0.55, z);
  rock.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 0.8);
  rock.receiveShadow = true;
  return rock;
}

// ─── Flower ───────────────────────────────────────────────────────────────────

function createFlower(x, z, petalColor) {
  const group = new THREE.Group();

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.018, 0.022, 0.32, 4),
    makeMat(0x3a8c1e, 0.8)
  );
  stem.position.y = 0.16;
  group.add(stem);

  const petalMat = makeMat(petalColor, 0.6);
  const count = 5 + Math.floor(Math.random() * 2);
  for (let i = 0; i < count; i++) {
    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.065, 5, 3), petalMat);
    const angle = (i / count) * Math.PI * 2;
    petal.position.set(Math.cos(angle) * 0.1, 0.33, Math.sin(angle) * 0.1);
    petal.scale.z = 1.8;
    group.add(petal);
  }

  const center = new THREE.Mesh(new THREE.SphereGeometry(0.062, 6, 6), makeMat(0xffe840, 0.5));
  center.position.y = 0.33;
  group.add(center);

  group.position.set(x, 0, z);
  group.rotation.y = Math.random() * Math.PI * 2;
  return group;
}

// ─── Fern ─────────────────────────────────────────────────────────────────────

function createFern(x, z) {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x2a6b14, roughness: 0.85, side: THREE.DoubleSide });
  const frondCount = 5 + Math.floor(Math.random() * 3);
  for (let i = 0; i < frondCount; i++) {
    const frond = new THREE.Mesh(new THREE.PlaneGeometry(0.65, 0.22), mat);
    const angle = (i / frondCount) * Math.PI * 2 + Math.random() * 0.3;
    frond.rotation.y = angle;
    frond.rotation.z = 0.45 + Math.random() * 0.2;
    frond.position.set(Math.cos(angle) * 0.1, 0.14 + Math.random() * 0.05, Math.sin(angle) * 0.1);
    group.add(frond);
  }
  group.position.set(x, 0, z);
  return group;
}

// ─── Pine Cone ────────────────────────────────────────────────────────────────

function createPinecone(x, z) {
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.18, 6), makeMat(0x5a3318, 0.9));
  cone.position.set(x, 0.09, z);
  cone.rotation.y = Math.random() * Math.PI * 2;
  cone.rotation.z = Math.random() * 0.4 - 0.2;
  return cone;
}

// ─── Gate (large wooden entrance arch) ───────────────────────────────────────

function createGate(scene) {
  const woodMat    = makeMat(0x7a5030, 0.9, 0.05);
  const darkWoodMat = makeMat(0x5a3820, 0.95);

  // Thick Posts
  const postGeo = new THREE.CylinderGeometry(0.22, 0.28, 5.0, 8);
  [{ x: -2.6, z: 2 }, { x: 2.6, z: 2 }].forEach(({ x, z }) => {
    const post = new THREE.Mesh(postGeo, woodMat);
    post.position.set(x, 2.5, z);
    post.castShadow = true;
    post.receiveShadow = true;
    scene.add(post);

    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.27, 7, 5), darkWoodMat);
    cap.position.set(x, 5.2, z);
    scene.add(cap);
  });

  // Main crossbeam
  const beam = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.32, 0.28), woodMat);
  beam.position.set(0, 4.82, 2);
  beam.castShadow = true;
  scene.add(beam);

  // Corner bracket trim
  [-2.25, 2.25].forEach((bx) => {
    const bh = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.18, 0.18), darkWoodMat);
    bh.position.set(bx, 4.72, 2);
    scene.add(bh);
    const bv = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.55, 0.18), darkWoodMat);
    bv.position.set(bx + (bx < 0 ? -0.26 : 0.26), 4.5, 2);
    scene.add(bv);
  });

  // Rope rings
  const ropeGeo = new THREE.TorusGeometry(0.1, 0.035, 5, 8);
  const ropeMat = makeMat(0x6a4a20, 0.8);
  [-1.8, 1.8].forEach(rx => {
    const ring = new THREE.Mesh(ropeGeo, ropeMat);
    ring.position.set(rx, 3.7, 2);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);
  });

  // Sign board with canvas texture
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 1024; signCanvas.height = 224;
  const ctx = signCanvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, 224);
  grad.addColorStop(0, '#c8935a');
  grad.addColorStop(0.5, '#d8a86a');
  grad.addColorStop(1, '#b87c44');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 224);

  ctx.strokeStyle = 'rgba(90, 45, 12, 0.18)';
  ctx.lineWidth = 2.5;
  [22, 46, 74, 100, 128, 154, 178, 202].forEach(y => {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y + Math.sin(y * 0.1) * 6); ctx.stroke();
  });

  ctx.strokeStyle = '#6a3c1a';
  ctx.lineWidth = 7;
  ctx.strokeRect(6, 6, 1012, 212);

  ctx.strokeStyle = 'rgba(100, 60, 20, 0.5)';
  ctx.lineWidth = 3;
  ctx.strokeRect(16, 16, 992, 192);

  // Drop-shadow text
  ctx.font = 'bold 88px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(40, 15, 4, 0.5)';
  ctx.fillText('Het Oude Woud', 516, 116);
  ctx.fillStyle = '#2a0e04';
  ctx.fillText('Het Oude Woud', 512, 112);

  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(4.0, 0.9),
    new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(signCanvas), roughness: 0.7, side: THREE.DoubleSide })
  );
  sign.position.set(0, 4.1, 1.96);
  scene.add(sign);
}

// ─── Main Scene Builder ───────────────────────────────────────────────────────

export function buildOudWoudScene(scene) {

  // ─── Island bounds ─────────────────────────────────────────────────────────
  // x: -20 → +36  (56 units wide)
  // z: +19 → -73  (92 units long)
  const ISLAND_W = 56, ISLAND_D = 92;
  const ISLAND_CX = 8, ISLAND_CZ = -27;
  const islandBounds = {
    minX: ISLAND_CX - ISLAND_W / 2,  // -20
    maxX: ISLAND_CX + ISLAND_W / 2,  // +36
    minZ: ISLAND_CZ - ISLAND_D / 2,  // -73
    maxZ: ISLAND_CZ + ISLAND_D / 2,  // +19
  };

  // Island grass
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(ISLAND_W, ISLAND_D),
    new THREE.MeshStandardMaterial({
      map: makeGrassTexture(),
      normalMap: makeGrassNormalMap(),
      normalScale: new THREE.Vector2(0.6, 0.6),
      roughness: 0.92,
    })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(ISLAND_CX, 0, ISLAND_CZ);
  ground.receiveShadow = true;
  scene.add(ground);

  // Water plane surrounding the island
  const waterMaterial = new THREE.MeshStandardMaterial({ map: makeWaterTexture(), roughness: 0.28, metalness: 0.08 });
  const water = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), waterMaterial);
  water.rotation.x = -Math.PI / 2;
  water.position.y = -0.32;
  scene.add(water);

  // Sandy cliff-edge strips around island perimeter
  // BoxGeometry: top face flush with ground (y=0), extends down past water level
  const cliffMat = new THREE.MeshStandardMaterial({ color: 0xb89560, roughness: 0.95 });
  const cliffH = 0.55;
  [
    // [cx, cz, w, d]
    [ISLAND_CX,                       ISLAND_CZ + ISLAND_D / 2 + 1.25, ISLAND_W + 6, 2.5],   // north
    [ISLAND_CX,                       ISLAND_CZ - ISLAND_D / 2 - 1.25, ISLAND_W + 6, 2.5],   // south
    [ISLAND_CX - ISLAND_W / 2 - 1.25, ISLAND_CZ,                        2.5, ISLAND_D + 6],  // west
    [ISLAND_CX + ISLAND_W / 2 + 1.25, ISLAND_CZ,                        2.5, ISLAND_D + 6],  // east
  ].forEach(([cx, cz, w, d]) => {
    const cliff = new THREE.Mesh(new THREE.BoxGeometry(w, cliffH, d), cliffMat);
    cliff.position.set(cx, -cliffH / 2, cz);
    cliff.receiveShadow = true;
    scene.add(cliff);
  });

  // Textured dirt path
  const pathMat = new THREE.MeshStandardMaterial({
    map: makeDirtPathTexture(),
    normalMap: makeDirtNormalMap(),
    normalScale: new THREE.Vector2(0.8, 0.8),
    roughness: 0.88,
  });

  const path1 = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 33), pathMat);
  path1.rotation.x = -Math.PI / 2;
  path1.position.set(0, 0.012, -8.5);
  scene.add(path1);

  const bend = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 21), pathMat);
  bend.rotation.x = -Math.PI / 2;
  bend.rotation.z = -Math.atan2(14, 10);
  bend.position.set(7, 0.012, -27);
  scene.add(bend);

  const path2 = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 30), pathMat);
  path2.rotation.x = -Math.PI / 2;
  path2.position.set(14, 0.012, -43.5);
  scene.add(path2);

  // ─── Trees ──────────────────────────────────────────────────────────────
  const treeData = [
    // ── Original 46 trees ────────────────────────────────────────────────
    { x: -4.0, z: 2   }, { x: -5.2, z: -4  }, { x: -4.0, z: -10 },
    { x: -5.2, z: -16 }, { x: -4.0, z: -21 },
    { x:  4.0, z: 2   }, { x:  5.2, z: -4  }, { x:  4.0, z: -10 },
    { x:  5.2, z: -16 }, { x:  4.0, z: -21 },
    { x: 2, z: -25 }, { x: 12, z: -24 }, { x: 4, z: -31 }, { x: 13, z: -31 },
    { x: 10, z: -35 }, { x: 9,  z: -41 }, { x: 10, z: -47 }, { x: 9, z: -54 },
    { x: 18, z: -35 }, { x: 19, z: -41 }, { x: 18, z: -47 }, { x: 19, z: -54 },
    { x: -9, z: 0 }, { x: 9, z: 0 }, { x: -8, z: -8 }, { x: 8, z: -8 },
    { x: -11, z: -16 }, { x: -8, z: -24 },
    { x: -3, z: -29 }, { x: 17, z: -23 }, { x: -2, z: -35 },
    { x: 5, z: -38 }, { x: 24, z: -38 }, { x: 6, z: -46 }, { x: 23, z: -46 },
    { x: 5, z: -55 }, { x: 24, z: -55 },
    { x: -14, z: -5 }, { x: -13, z: -18 }, { x: -12, z: -30 },
    { x: 14, z: 2 }, { x: 27, z: -35 }, { x: 27, z: -48 },
    { x: -6, z: -40 }, { x: 0, z: -51 }, { x: 29, z: -42 },
    // ── GDP-007: Extra trees — fills perimeter and deep south ────────────
    // Far-left column (x ≈ -17 to -15)
    { x: -17, z:  5  }, { x: -17, z: -8  }, { x: -16, z: -20 },
    { x: -17, z: -32 }, { x: -16, z: -44 }, { x: -17, z: -55 },
    // Far-right column (x ≈ 31 to 34)
    { x: 32, z:  4  }, { x: 33, z: -12 }, { x: 32, z: -26 },
    { x: 33, z: -38 }, { x: 32, z: -50 },
    // Deep-south back wall (z ≈ -60 to -70)
    { x: -10, z: -61 }, { x: -2,  z: -62 }, { x:  7, z: -60 },
    { x:  15, z: -61 }, { x: 23,  z: -63 }, { x: 30, z: -61 },
    { x:  -7, z: -68 }, { x:  5,  z: -67 }, { x: 14, z: -68 },
    { x:  22, z: -66 },
    // Mid-forest gap fillers
    { x: -7,  z: -50 }, { x: -8,  z: -59 }, { x: 31, z: -23 },
  ];

  // 6 InstancedMeshes (trunk + 5 cone layers) — ~276 draw calls → 6
  const N = treeData.length;
  const trunkGeo = new THREE.CylinderGeometry(0.14, 0.30, 2.4, 7);
  const coneGeos = LAYER_R.map(r => new THREE.ConeGeometry(r, 1.65, 7));
  const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x5a3220,
    normalMap: makeBarkNormalMap(),
    normalScale: new THREE.Vector2(1.0, 1.0),
    roughness: 0.95,
  });
  const coneMats = LAYER_COLORS.map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.82 }));

  const trunkMesh = new THREE.InstancedMesh(trunkGeo, trunkMat, N);
  trunkMesh.castShadow = true;
  const coneMeshes = coneGeos.map((geo, i) => {
    const m = new THREE.InstancedMesh(geo, coneMats[i], N);
    m.castShadow = true;
    return m;
  });
  const treeMeshes = [trunkMesh, ...coneMeshes];
  treeMeshes.forEach(m => scene.add(m));

  const collisionCircles = [];
  const treeTransforms = [];

  treeData.forEach(({ x, z }, idx) => {
    const scale = 0.8 + Math.random() * 0.55;
    const yaw   = Math.random() * Math.PI * 2;
    const coneYaws = Array.from({ length: 5 }, (_, i) =>
      yaw + (i * Math.PI * 2) / 5 + Math.random() * 0.35
    );
    treeTransforms.push({ x, z, scale, yaw, coneYaws });

    buildTreeMemberMatrix(_outM, x, z, 1.2 * scale, yaw, scale, 0);
    trunkMesh.setMatrixAt(idx, _outM);
    coneYaws.forEach((cy, i) => {
      buildTreeMemberMatrix(_outM, x, z, LAYER_H[i] * scale, cy, scale, 0);
      coneMeshes[i].setMatrixAt(idx, _outM);
    });
    collisionCircles.push({ x, z, r: 0.58 * scale });
  });

  treeMeshes.forEach(m => {
    m.instanceMatrix.needsUpdate = true;
    m.computeBoundingSphere();
  });

  // ─── Mushrooms ──────────────────────────────────────────────────────────
  const mushroomPositions = [
    { x: 10.2,  z: -7.0  },
    { x: -9.8,  z: -30.0 },
    { x: 26.2,  z: -38.0 },
  ];
  const mushrooms = mushroomPositions.map(({ x, z }) => {
    const m = createMushroom(x, z);
    scene.add(m);
    return m;
  });

  // ─── Blocking log ────────────────────────────────────────────────────────
  const log = createLog(14, -50);
  scene.add(log);
  const logCollision = { minX: 11.0, maxX: 17.0, minZ: -51.4, maxZ: -48.6 };

  // ─── Map fragment ────────────────────────────────────────────────────────
  const mapFragment = createMapFragment(14, -53.5);
  scene.add(mapFragment);

  // ─── Rocks ──────────────────────────────────────────────────────────────
  const rockPositions = [
    [-2, -1], [3, -6], [-4, -13], [2, -18], [-1, -23],
    [6, -26], [11, -33], [16, -39], [12, -44],
    [11, -57], [16, -57], [8, -35], [20, -50],
  ];
  rockPositions.forEach(([x, z]) => {
    scene.add(createRock(x, z));
    if (Math.random() > 0.5) scene.add(createRock(x + 0.5, z + 0.4, 0.6));
  });

  // ─── Flowers along path edges ────────────────────────────────────────────
  const fColors = [0xffe8f0, 0xffffff, 0xffd700, 0xc88cf0, 0x80c4ff, 0xff9090];
  const flowerSpots = [
    [-3.0, 1], [-2.8, -5], [-3.2, -11], [-2.9, -17],
    [3.1, 1], [2.9, -5], [3.2, -11], [3.0, -17],
    [-1.5, -26], [6, -28], [5, -24],
    [9, -37], [9, -43], [9, -49], [19, -37], [19, -43], [19, -49],
    [-7, -8], [-8, -19], [-6, -38], [25, -40], [26, -52], [1, -52],
  ];
  flowerSpots.forEach(([x, z]) => {
    scene.add(createFlower(x + (Math.random() - 0.5), z + (Math.random() - 0.5), fColors[Math.floor(Math.random() * fColors.length)]));
    if (Math.random() > 0.5) scene.add(createFlower(x + Math.random() * 1.2 - 0.6, z + Math.random() * 1.2 - 0.6, fColors[Math.floor(Math.random() * fColors.length)]));
  });

  // ─── Ferns ──────────────────────────────────────────────────────────────
  [[-6, -3], [-7, -12], [-7, -20], [-5, -27],
   [7, -3], [7, -12], [7, -20],
   [-4, -35], [3, -40], [22, -37], [23, -50],
   [-9, -7], [-10, -22], [5, -57], [15, -58]].forEach(([x, z]) => scene.add(createFern(x, z)));

  // ─── Pine cones ──────────────────────────────────────────────────────────
  [[-4.5, 1.5], [4.5, 1.5], [-5, -4.5], [5, -4.5],
   [-4.5, -10.5], [4.5, -10.5], [-5, -16.5], [5, -16.5],
   [-4, -21.5], [4, -21.5], [10, -36], [18, -36],
   [10, -42], [18, -42], [10, -48], [18, -48],
   [-9.5, 0.5], [9.5, 0.5], [12, -24.5], [3, -31]].forEach(([x, z]) => scene.add(createPinecone(x, z)));

  // ─── Gate ────────────────────────────────────────────────────────────────
  createGate(scene);

  return {
    mushrooms,
    log,
    mapFragment,
    collisionCircles,
    treeMeshes,
    treeTransforms,
    waterMaterial,
    logCollision,
    rockPositions,
    islandBounds,
    startPosition: new THREE.Vector3(0, 1.7, 7),
  };
}
