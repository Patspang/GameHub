// Builds the Three.js scene for De Zonnige Weide (island 2)
// Returns all relevant objects for game logic + collision data
//
// Open sunny meadow with three flower-butterfly pairs that the player must match.
// Edge trees only — open center. Bright golden lighting. Billboard butterflies.

import * as THREE from 'three';

// ─── PBR material helper ─────────────────────────────────────────────────────

function makeMat(color, roughness = 0.85, metalness = 0.0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

// ─── Procedural canvas textures ─────────────────────────────────────────────

function makeMeadowGrassTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Warm, sunlit grass base
  ctx.fillStyle = '#6aaa44';
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 350; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 5 + Math.random() * 25;
    ctx.globalAlpha = 0.15 + Math.random() * 0.15;
    ctx.fillStyle = Math.random() > 0.5 ? '#5a9a38' : '#7ec050';
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.6, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  // Tiny yellow wildflower dots
  ctx.globalAlpha = 0.3;
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    ctx.fillStyle = Math.random() > 0.5 ? '#ffe040' : '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, 2 + Math.random() * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(16, 16);
  return tex;
}

function makeMeadowGrassNormalMap() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgb(128,128,255)';
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 400; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const tiltR = 110 + Math.floor(Math.random() * 36);
    ctx.strokeStyle = `rgb(${tiltR},128,220)`;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.35 + Math.random() * 0.3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 4, y - 7);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(16, 16);
  return tex;
}

function makeWaterTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#1a6e9e');
  grad.addColorStop(0.5, '#1e7db5');
  grad.addColorStop(1, '#1560a0');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

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

function makeBarkNormalMap() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgb(128,128,255)';
  ctx.fillRect(0, 0, size, size);

  const ridgeCount = 18;
  for (let i = 0; i < ridgeCount; i++) {
    const x = (i / ridgeCount) * size;
    const w = size / ridgeCount;
    const grad = ctx.createLinearGradient(x, 0, x + w, 0);
    grad.addColorStop(0, 'rgba(90,128,210,0.6)');
    grad.addColorStop(0.45, 'rgba(180,128,210,0.6)');
    grad.addColorStop(1, 'rgba(128,128,255,0.2)');
    ctx.fillStyle = grad;
    ctx.fillRect(x, 0, w, size);
  }

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
  tex.repeat.set(2, 4);
  return tex;
}

// ─── Pine Tree (InstancedMesh) ─────────────────────────────────────────────

const LAYER_COLORS = [0x1a4a0e, 0x1f5512, 0x286618, 0x2e761e, 0x348424];
const LAYER_H      = [1.7,  2.65, 3.55, 4.35, 5.05];
const LAYER_R      = [1.25, 1.0,  0.76, 0.54, 0.36];

const _matA   = new THREE.Matrix4();
const _matB   = new THREE.Matrix4();
const _posV   = new THREE.Vector3();
const _quatQ  = new THREE.Quaternion();
const _scaleV = new THREE.Vector3();
const _eulerE = new THREE.Euler();
const _outM   = new THREE.Matrix4();

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

// ─── Large Flower (for matching mechanic) ─────────────────────────────────────

function createLargeFlower(x, z, color, petalCount) {
  const group = new THREE.Group();
  group.userData = { petalCount, color };

  // Thick green stem
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.10, 1.2, 8),
    makeMat(0x3a8c1e, 0.75)
  );
  stem.position.y = 0.6;
  stem.castShadow = true;
  group.add(stem);

  // Leaves on stem
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x4aa820, roughness: 0.8, side: THREE.DoubleSide });
  for (let side = -1; side <= 1; side += 2) {
    const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.18), leafMat);
    leaf.position.set(side * 0.15, 0.4, 0);
    leaf.rotation.z = side * 0.6;
    leaf.rotation.y = Math.random() * 0.5;
    group.add(leaf);
  }

  // Petals — arranged in a ring, each petal is a stretched sphere
  const petalMat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.5,
    emissive: color,
    emissiveIntensity: 0.1,
  });
  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * Math.PI * 2;
    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.15, 6, 4), petalMat);
    petal.position.set(Math.cos(angle) * 0.22, 1.25, Math.sin(angle) * 0.22);
    petal.scale.set(1, 0.6, 1.8);
    petal.rotation.y = -angle;
    group.add(petal);
  }

  // Center of flower
  const center = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 8, 8),
    makeMat(0xffe840, 0.45)
  );
  center.position.y = 1.25;
  group.add(center);

  // Glow light
  const glow = new THREE.PointLight(new THREE.Color(color).getHex(), 0.4, 4);
  glow.position.y = 1.5;
  group.add(glow);

  group.position.set(x, 0, z);
  return group;
}

// ─── Flower Sign (wooden board with color word) ──────────────────────────────

function createFlowerSign(x, z, word) {
  const group = new THREE.Group();

  // Wooden post
  const post = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.05, 0.8, 6),
    makeMat(0x7a5030, 0.9)
  );
  post.position.y = 0.4;
  group.add(post);

  // Sign board with canvas text
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Wooden board background
  const grad = ctx.createLinearGradient(0, 0, 0, 128);
  grad.addColorStop(0, '#c8935a');
  grad.addColorStop(0.5, '#d8a86a');
  grad.addColorStop(1, '#b87c44');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 128);

  // Border
  ctx.strokeStyle = '#6a3c1a';
  ctx.lineWidth = 5;
  ctx.strokeRect(4, 4, 248, 120);

  // Text
  ctx.font = 'bold 64px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#2a0e04';
  ctx.fillText(word, 128, 68);

  const signMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.6, 0.3),
    new THREE.MeshStandardMaterial({
      map: new THREE.CanvasTexture(canvas),
      roughness: 0.7,
      side: THREE.DoubleSide,
    })
  );
  signMesh.position.y = 0.85;
  signMesh.rotation.y = Math.PI / 6; // Angle slightly for visibility
  group.add(signMesh);

  group.position.set(x + 0.8, 0, z + 0.3);
  return group;
}

// ─── Butterfly (3D geometry — small, delicate) ──────────────────────────────

function createButterfly(x, z, color, dotCount) {
  const group = new THREE.Group();
  group.userData = { dotCount, color, baseX: x, baseZ: z };

  // Thin elongated body
  const bodyMat = makeMat(0x1a1a1a, 0.7);
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.008, 0.16, 5),
    bodyMat
  );
  body.rotation.x = Math.PI / 2;
  group.add(body);

  // Head
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.018, 5, 5),
    bodyMat
  );
  head.position.z = -0.09;
  group.add(head);

  // Antennae
  const antMat = makeMat(0x333333, 0.8);
  for (const side of [-1, 1]) {
    const ant = new THREE.Mesh(
      new THREE.CylinderGeometry(0.003, 0.002, 0.08, 3),
      antMat
    );
    ant.position.set(side * 0.015, 0.02, -0.1);
    ant.rotation.z = side * 0.5;
    ant.rotation.x = -0.4;
    group.add(ant);
    // Tip ball
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.006, 4, 4), antMat);
    tip.position.set(side * 0.045, 0.055, -0.12);
    group.add(tip);
  }

  // Wing material — colored, slightly translucent
  const wingColor = new THREE.Color(color);
  const wingMat = new THREE.MeshStandardMaterial({
    color: wingColor,
    roughness: 0.4,
    emissive: wingColor,
    emissiveIntensity: 0.2,
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide,
  });

  // Upper wings (larger, rounded shape using lathe or shaped plane)
  // We use a custom shape via ExtrudeGeometry for a nice butterfly wing silhouette
  const upperWingShape = new THREE.Shape();
  upperWingShape.moveTo(0, 0);
  upperWingShape.quadraticCurveTo(0.06, 0.08, 0.12, 0.06);
  upperWingShape.quadraticCurveTo(0.15, 0.02, 0.13, -0.02);
  upperWingShape.quadraticCurveTo(0.08, -0.04, 0, 0);

  const lowerWingShape = new THREE.Shape();
  lowerWingShape.moveTo(0, 0);
  lowerWingShape.quadraticCurveTo(0.05, -0.02, 0.09, -0.06);
  lowerWingShape.quadraticCurveTo(0.08, -0.10, 0.04, -0.09);
  lowerWingShape.quadraticCurveTo(0.01, -0.06, 0, 0);

  const wingGeoSettings = { depth: 0.002, bevelEnabled: false };

  // Left wings — group them for flapping
  const leftWingGroup = new THREE.Group();
  const leftUpper = new THREE.Mesh(
    new THREE.ExtrudeGeometry(upperWingShape, wingGeoSettings),
    wingMat
  );
  leftUpper.position.set(-0.01, 0.01, -0.02);
  leftUpper.rotation.y = Math.PI;
  leftWingGroup.add(leftUpper);

  const leftLower = new THREE.Mesh(
    new THREE.ExtrudeGeometry(lowerWingShape, wingGeoSettings),
    wingMat
  );
  leftLower.position.set(-0.01, 0.01, 0.02);
  leftLower.rotation.y = Math.PI;
  leftWingGroup.add(leftLower);
  group.add(leftWingGroup);

  // Right wings
  const rightWingGroup = new THREE.Group();
  const rightUpper = new THREE.Mesh(
    new THREE.ExtrudeGeometry(upperWingShape, wingGeoSettings),
    wingMat
  );
  rightUpper.position.set(0.01, 0.01, -0.02);
  rightWingGroup.add(rightUpper);

  const rightLower = new THREE.Mesh(
    new THREE.ExtrudeGeometry(lowerWingShape, wingGeoSettings),
    wingMat
  );
  rightLower.position.set(0.01, 0.01, 0.02);
  rightWingGroup.add(rightLower);
  group.add(rightWingGroup);

  // Dots on wings (small white spheres for counting)
  const dotMat = makeMat(0xffffff, 0.5);
  const dotR = 0.008;
  const dotsPerWing = Math.ceil(dotCount / 2);
  for (let i = 0; i < dotCount; i++) {
    const wingSide = i < dotsPerWing ? -1 : 1;
    const localIdx = i < dotsPerWing ? i : i - dotsPerWing;
    const t = (localIdx + 0.5) / dotsPerWing;
    const dot = new THREE.Mesh(new THREE.SphereGeometry(dotR, 4, 4), dotMat);
    dot.position.set(
      wingSide * (0.04 + t * 0.06),
      0.015,
      -0.02 + t * 0.02 - 0.01
    );
    // Add to the appropriate wing group
    if (wingSide < 0) leftWingGroup.add(dot);
    else rightWingGroup.add(dot);
  }

  group.userData.leftWing = leftWingGroup;
  group.userData.rightWing = rightWingGroup;

  group.position.set(x, 1.8, z);
  return group;
}

// ─── Small decorative wildflower ──────────────────────────────────────────────

function createSmallFlower(x, z, petalColor) {
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
    const angle = (i / count) * Math.PI * 2;
    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.065, 5, 3), petalMat);
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

// ─── Low rolling hill ─────────────────────────────────────────────────────────

function createHill(x, z, radius, height) {
  const geo = new THREE.SphereGeometry(radius, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  const hill = new THREE.Mesh(geo, makeMat(0x5a9a38, 0.92));
  hill.position.set(x, -0.1, z);
  hill.scale.y = height / radius;
  hill.receiveShadow = true;
  return hill;
}

// ─── Map Fragment (on ground, blocked by swarm butterflies) ──────────────────

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

  // Fragment sits on the ground from the start, visible
  group.position.set(x, 0, z);
  return group;
}

// ─── Swarm butterfly (small, no label — decorative blocker on the fragment) ──

function createSwarmButterfly(color) {
  const group = new THREE.Group();

  // Tiny body
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.008, 0.006, 0.10, 4),
    makeMat(0x1a1a1a, 0.7)
  );
  body.rotation.x = Math.PI / 2;
  group.add(body);

  // Wing material
  const wingColor = new THREE.Color(color);
  const wingMat = new THREE.MeshStandardMaterial({
    color: wingColor,
    roughness: 0.4,
    emissive: wingColor,
    emissiveIntensity: 0.25,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide,
  });

  const upperShape = new THREE.Shape();
  upperShape.moveTo(0, 0);
  upperShape.quadraticCurveTo(0.04, 0.06, 0.08, 0.04);
  upperShape.quadraticCurveTo(0.10, 0.01, 0.08, -0.01);
  upperShape.quadraticCurveTo(0.05, -0.03, 0, 0);

  const lowerShape = new THREE.Shape();
  lowerShape.moveTo(0, 0);
  lowerShape.quadraticCurveTo(0.03, -0.01, 0.06, -0.04);
  lowerShape.quadraticCurveTo(0.05, -0.07, 0.025, -0.06);
  lowerShape.quadraticCurveTo(0.005, -0.04, 0, 0);

  const geoSettings = { depth: 0.001, bevelEnabled: false };

  const leftWing = new THREE.Group();
  const lu = new THREE.Mesh(new THREE.ExtrudeGeometry(upperShape, geoSettings), wingMat);
  lu.position.set(-0.005, 0.005, -0.01);
  lu.rotation.y = Math.PI;
  leftWing.add(lu);
  const ll = new THREE.Mesh(new THREE.ExtrudeGeometry(lowerShape, geoSettings), wingMat);
  ll.position.set(-0.005, 0.005, 0.01);
  ll.rotation.y = Math.PI;
  leftWing.add(ll);
  group.add(leftWing);

  const rightWing = new THREE.Group();
  const ru = new THREE.Mesh(new THREE.ExtrudeGeometry(upperShape, geoSettings), wingMat);
  ru.position.set(0.005, 0.005, -0.01);
  rightWing.add(ru);
  const rl = new THREE.Mesh(new THREE.ExtrudeGeometry(lowerShape, geoSettings), wingMat);
  rl.position.set(0.005, 0.005, 0.01);
  rightWing.add(rl);
  group.add(rightWing);

  group.userData.leftWing = leftWing;
  group.userData.rightWing = rightWing;

  return group;
}

// ─── Entrance arch ──────────────────────────────────────────────────────

function createGate(scene) {
  const woodMat = makeMat(0x7a5030, 0.9, 0.05);
  const darkWoodMat = makeMat(0x5a3820, 0.95);

  const postGeo = new THREE.CylinderGeometry(0.20, 0.26, 4.5, 8);
  [{ x: -2.4, z: -2 }, { x: 2.4, z: -2 }].forEach(({ x, z }) => {
    const post = new THREE.Mesh(postGeo, woodMat);
    post.position.set(x, 2.25, z);
    post.castShadow = true;
    scene.add(post);

    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.25, 7, 5), darkWoodMat);
    cap.position.set(x, 4.7, z);
    scene.add(cap);
  });

  const beam = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.28, 0.25), woodMat);
  beam.position.set(0, 4.35, -2);
  beam.castShadow = true;
  scene.add(beam);

  // Sign board
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 1024; signCanvas.height = 224;
  const ctx = signCanvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, 224);
  grad.addColorStop(0, '#c8935a');
  grad.addColorStop(0.5, '#d8a86a');
  grad.addColorStop(1, '#b87c44');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 224);

  ctx.strokeStyle = '#6a3c1a';
  ctx.lineWidth = 7;
  ctx.strokeRect(6, 6, 1012, 212);

  ctx.font = 'bold 80px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(40, 15, 4, 0.5)';
  ctx.fillText('De Zonnige Weide', 516, 116);
  ctx.fillStyle = '#2a0e04';
  ctx.fillText('De Zonnige Weide', 512, 112);

  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(3.8, 0.85),
    new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(signCanvas), roughness: 0.7, side: THREE.DoubleSide })
  );
  sign.position.set(0, 3.65, -2.04);
  scene.add(sign);
}

// ─── Main Scene Builder ───────────────────────────────────────────────────────

export function buildZonnigeWeideScene(scene) {

  // ─── Island bounds ─────────────────────────────────────────────────────────
  // x: -25 → +25  (50 units wide)
  // z: -65 → +5   (70 units long)
  const ISLAND_W = 50, ISLAND_D = 70;
  const ISLAND_CX = 0, ISLAND_CZ = -30;
  const islandBounds = {
    minX: ISLAND_CX - ISLAND_W / 2,  // -25
    maxX: ISLAND_CX + ISLAND_W / 2,  // +25
    minZ: ISLAND_CZ - ISLAND_D / 2,  // -65
    maxZ: ISLAND_CZ + ISLAND_D / 2,  // +5
  };

  // ─── Ground ──────────────────────────────────────────────────────────────
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(ISLAND_W, ISLAND_D),
    new THREE.MeshStandardMaterial({
      map: makeMeadowGrassTexture(),
      normalMap: makeMeadowGrassNormalMap(),
      normalScale: new THREE.Vector2(0.5, 0.5),
      roughness: 0.92,
    })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(ISLAND_CX, 0, ISLAND_CZ);
  ground.receiveShadow = true;
  scene.add(ground);

  // ─── Water surrounding the island ────────────────────────────────────────
  const waterMaterial = new THREE.MeshStandardMaterial({ map: makeWaterTexture(), roughness: 0.28, metalness: 0.08 });
  const water = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), waterMaterial);
  water.rotation.x = -Math.PI / 2;
  water.position.y = -0.32;
  scene.add(water);

  // ─── Sandy cliff edges ──────────────────────────────────────────────────
  const cliffMat = makeMat(0xb89560, 0.95);
  const cliffH = 0.55;
  [
    [ISLAND_CX, ISLAND_CZ + ISLAND_D / 2 + 1.25, ISLAND_W + 6, 2.5],
    [ISLAND_CX, ISLAND_CZ - ISLAND_D / 2 - 1.25, ISLAND_W + 6, 2.5],
    [ISLAND_CX - ISLAND_W / 2 - 1.25, ISLAND_CZ, 2.5, ISLAND_D + 6],
    [ISLAND_CX + ISLAND_W / 2 + 1.25, ISLAND_CZ, 2.5, ISLAND_D + 6],
  ].forEach(([cx, cz, w, d]) => {
    const cliff = new THREE.Mesh(new THREE.BoxGeometry(w, cliffH, d), cliffMat);
    cliff.position.set(cx, -cliffH / 2, cz);
    cliff.receiveShadow = true;
    scene.add(cliff);
  });

  // ─── Low rolling hills ──────────────────────────────────────────────────
  const hillData = [
    { x: -10, z: -20, radius: 5, height: 0.6 },
    { x: 12,  z: -38, radius: 6, height: 0.8 },
    { x: -8,  z: -50, radius: 4, height: 0.5 },
    { x: 5,   z: -12, radius: 4, height: 0.4 },
  ];
  hillData.forEach(h => scene.add(createHill(h.x, h.z, h.radius, h.height)));

  // ─── Edge trees (only along perimeter) ──────────────────────────────────
  const treeData = [
    // West edge
    { x: -22, z: 0 }, { x: -21, z: -10 }, { x: -22, z: -20 },
    { x: -21, z: -30 }, { x: -22, z: -40 }, { x: -21, z: -50 },
    { x: -22, z: -60 },
    // East edge
    { x: 22, z: 0 }, { x: 21, z: -10 }, { x: 22, z: -20 },
    { x: 21, z: -30 }, { x: 22, z: -40 }, { x: 21, z: -50 },
    { x: 22, z: -60 },
    // South edge
    { x: -14, z: -62 }, { x: -5, z: -63 }, { x: 5, z: -62 },
    { x: 14, z: -63 },
    // North edge (near entrance, leaving gap for gate)
    { x: -12, z: 2 }, { x: -18, z: 1 }, { x: 12, z: 2 }, { x: 18, z: 1 },
    // Scattered edge fillers
    { x: -18, z: -5 }, { x: -19, z: -15 }, { x: -18, z: -25 },
    { x: -19, z: -35 }, { x: -18, z: -45 }, { x: -19, z: -55 },
    { x: 18, z: -5 }, { x: 19, z: -15 }, { x: 18, z: -25 },
    { x: 19, z: -35 }, { x: 18, z: -45 }, { x: 19, z: -55 },
  ];

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
    const yaw = Math.random() * Math.PI * 2;
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

  // ─── Three flower-butterfly pairs ──────────────────────────────────────

  // Pair config: { color hex, flower position, butterfly start position, petal count (=dot count), color word }
  const PAIR_DATA = [
    { color: 0xe03030, fx: -8,  fz: -15, bx: 5,   bz: -10, count: 4,  word: 'ROOD' },
    { color: 0x3060e0, fx: 10,  fz: -32, bx: -10, bz: -28, count: 6,  word: 'BLAUW' },
    { color: 0xe0c020, fx: -5,  fz: -48, bx: 12,  bz: -44, count: 8,  word: 'GEEL' },
    { color: 0x9040c0, fx: 12,  fz: -18, bx: -12, bz: -52, count: 10, word: 'PAARS' },
    { color: 0xe07020, fx: -12, fz: -38, bx: 8,   bz: -20, count: 12, word: 'ORANJE' },
  ];

  const flowers = [];
  const butterflies = [];
  const flowerSigns = [];

  PAIR_DATA.forEach(({ color, fx, fz, bx, bz, count, word }) => {
    const flower = createLargeFlower(fx, fz, color, count);
    scene.add(flower);
    flowers.push(flower);

    const sign = createFlowerSign(fx, fz, word);
    scene.add(sign);
    flowerSigns.push(sign);

    const butterfly = createButterfly(bx, bz, color, count);
    scene.add(butterfly);
    butterflies.push(butterfly);
  });

  // ─── Decorative wildflowers scattered densely over the meadow ──────────
  const fColors = [0xffe8f0, 0xffffff, 0xffd700, 0xc88cf0, 0x80c4ff, 0xff9090, 0xffb0d0, 0xff80a0, 0xa0e0ff, 0xf0c0ff];
  // Dense procedural scattering across the entire meadow
  for (let i = 0; i < 200; i++) {
    const fx = -20 + Math.random() * 40;
    const fz = -60 + Math.random() * 58;
    // Skip spots too close to water edge or gate
    if (fz > 2) continue;
    const color = fColors[Math.floor(Math.random() * fColors.length)];
    scene.add(createSmallFlower(fx, fz, color));
    // Add a second flower nearby ~60% of the time for natural clustering
    if (Math.random() > 0.4) {
      scene.add(createSmallFlower(fx + (Math.random() - 0.5) * 1.5, fz + (Math.random() - 0.5) * 1.5, fColors[Math.floor(Math.random() * fColors.length)]));
    }
  }

  // ─── Map fragment (on the ground, visible from start) ───────────────────
  const mapFragment = createMapFragment(0, -30);
  scene.add(mapFragment);

  // ─── Swarm butterflies covering the fragment ────────────────────────────
  const swarmColors = [0xe03030, 0x3060e0, 0xe0c020, 0xd060b0, 0x40c080, 0xe09020, 0x7060e0, 0xe05050];
  const SWARM_COUNT = 24;
  const swarmButterflies = [];
  for (let i = 0; i < SWARM_COUNT; i++) {
    const color = swarmColors[i % swarmColors.length];
    const sb = createSwarmButterfly(color);
    // Position in a cluster around the fragment (x=0, z=-30)
    const angle = (i / SWARM_COUNT) * Math.PI * 2 + Math.random() * 0.4;
    const radius = 0.3 + Math.random() * 1.0;
    sb.position.set(
      Math.cos(angle) * radius,
      0.15 + Math.random() * 0.25,
      -30 + Math.sin(angle) * radius
    );
    sb.rotation.y = Math.random() * Math.PI * 2;
    sb.userData.idleAngle = angle;
    sb.userData.idleRadius = radius;
    sb.userData.idleY = sb.position.y;
    scene.add(sb);
    swarmButterflies.push(sb);
  }

  // ─── Gate ────────────────────────────────────────────────────────────────
  createGate(scene);

  return {
    flowers,          // [red, blue, yellow] — Three.js Groups
    butterflies,      // [red, blue, yellow] — Three.js Groups with userData
    flowerSigns,
    mapFragment,
    swarmButterflies, // decorative butterflies covering the fragment
    pairData: PAIR_DATA,
    hillData,         // for player Y elevation
    collisionCircles,
    treeMeshes,
    treeTransforms,
    waterMaterial,
    islandBounds,
    startPosition: new THREE.Vector3(0, 1.7, 3),
  };
}
