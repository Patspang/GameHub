import * as THREE from 'three';

function makeMat(color, roughness = 0.85, metalness = 0.0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function makeGroundTexture(base = '#6a9c48', accentA = '#5b8e3d', accentB = '#7bb458') {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 280; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 6 + Math.random() * 26;
    ctx.globalAlpha = 0.1 + Math.random() * 0.2;
    ctx.fillStyle = Math.random() > 0.5 ? accentA : accentB;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.6, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(14, 20);
  return tex;
}

function makeWaterTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#1a6e9e');
  grad.addColorStop(0.5, '#1f80b8');
  grad.addColorStop(1, '#166090');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 24; i++) {
    const y = (i / 24) * 512;
    ctx.strokeStyle = `rgba(170, 225, 255, ${0.08 + Math.random() * 0.2})`;
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(0, y + Math.random() * 8);
    for (let x = 0; x <= 512; x += 18) {
      ctx.lineTo(x, y + Math.sin(x * 0.05 + i * 0.8) * 5);
    }
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2.5, 20);
  return tex;
}

function makeNumberTexture(text, bg = '#9b9b9b') {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 256, 256);
  grad.addColorStop(0, bg);
  grad.addColorStop(1, '#6e6e6e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 8;
  ctx.strokeRect(6, 6, 244, 244);

  ctx.fillStyle = '#23170f';
  ctx.font = 'bold 150px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 132);

  return new THREE.CanvasTexture(canvas);
}

function createStone(number, x, z) {
  const group = new THREE.Group();

  const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.8, 0), makeMat(0x8c8c8c, 0.95));
  rock.castShadow = true;
  rock.receiveShadow = true;
  group.add(rock);

  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(0.9, 0.9),
    new THREE.MeshStandardMaterial({
      map: makeNumberTexture(String(number)),
      roughness: 0.7,
      metalness: 0,
    })
  );
  label.position.set(0, 0.72, 0);
  label.rotation.x = -Math.PI * 0.48;
  group.add(label);

  const glow = new THREE.PointLight(0xaad6ff, 0.22, 2.6);
  glow.position.y = 1;
  group.add(glow);

  group.position.set(x, 0.7, z);
  group.userData = { number, placed: false, startX: x, startZ: z, shakeStart: null };
  return group;
}

function createWordStone(word, x, z) {
  const group = new THREE.Group();

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.95, 0.35, 10), makeMat(0x7f756f, 0.95));
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#d2b48c';
  ctx.fillRect(0, 0, 512, 128);
  ctx.strokeStyle = '#734f2d';
  ctx.lineWidth = 8;
  ctx.strokeRect(6, 6, 500, 116);
  ctx.fillStyle = '#2b1508';
  ctx.font = 'bold 74px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(word, 256, 70);

  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 0.55),
    new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(canvas), side: THREE.DoubleSide, roughness: 0.75 })
  );
  sign.position.y = 0.55;
  group.add(sign);

  group.position.set(x, 0.2, z);
  group.visible = false;
  group.userData = { word };
  return group;
}

function createMapFragment(x, z) {
  const group = new THREE.Group();

  const frag = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshStandardMaterial({
      color: 0xf0d060,
      emissive: 0xa07010,
      emissiveIntensity: 0.7,
      roughness: 0.5,
      metalness: 0.1,
      side: THREE.DoubleSide,
    })
  );
  frag.rotation.x = -Math.PI / 2;
  frag.castShadow = true;
  group.add(frag);

  const light = new THREE.PointLight(0xf8d66a, 1.2, 6);
  light.position.y = 1.5;
  group.add(light);

  group.position.set(x, 0.03, z);
  group.visible = false;
  return group;
}

export function buildBeekjeScene(scene) {
  const ISLAND = { minX: -22, maxX: 23, minZ: -70, maxZ: 5 };

  const grassTex = makeGroundTexture();
  const grass = new THREE.Mesh(
    new THREE.PlaneGeometry(ISLAND.maxX - ISLAND.minX, ISLAND.maxZ - ISLAND.minZ),
    new THREE.MeshStandardMaterial({ map: grassTex, roughness: 0.95, metalness: 0 })
  );
  grass.rotation.x = -Math.PI / 2;
  grass.position.set((ISLAND.minX + ISLAND.maxX) / 2, 0, (ISLAND.minZ + ISLAND.maxZ) / 2);
  grass.receiveShadow = true;
  scene.add(grass);

  const dryBedTex = makeGroundTexture('#8a6b47', '#7a5d3f', '#9a7a52');
  const creekBed = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 56),
    new THREE.MeshStandardMaterial({ map: dryBedTex, roughness: 0.97 })
  );
  creekBed.rotation.x = -Math.PI / 2;
  creekBed.position.set(0, 0.02, -33);
  creekBed.receiveShadow = true;
  scene.add(creekBed);

  const waterMaterial = new THREE.MeshStandardMaterial({
    map: makeWaterTexture(),
    color: 0x9bd8ff,
    transparent: true,
    opacity: 0.85,
    roughness: 0.2,
    metalness: 0.05,
  });
  const flowingWater = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 56), waterMaterial);
  flowingWater.rotation.x = -Math.PI / 2;
  flowingWater.position.set(0, 0.06, -33);
  flowingWater.visible = false;
  flowingWater.receiveShadow = true;
  scene.add(flowingWater);

  // Tiny waterfall at the north source
  const waterfall = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 3.2), waterMaterial.clone());
  waterfall.position.set(0, 1.7, -55);
  waterfall.visible = false;
  scene.add(waterfall);

  const pond = new THREE.Mesh(
    new THREE.CircleGeometry(5.2, 32),
    new THREE.MeshStandardMaterial({ map: makeWaterTexture(), color: 0x73bfe6, transparent: true, opacity: 0.8 })
  );
  pond.rotation.x = -Math.PI / 2;
  pond.position.set(0, 0.05, -10);
  pond.visible = false;
  scene.add(pond);

  const stoneDefs = [
    { n: 5, x: -1, z: -20 },
    { n: 2, x: 3, z: -28 },
    { n: 8, x: -2, z: -35 },
    { n: 1, x: 2, z: -18 },
    { n: 4, x: -3, z: -42 },
  ];
  const stones = stoneDefs.map((d) => {
    const s = createStone(d.n, d.x, d.z);
    scene.add(s);
    return s;
  });

  const slotDefs = [
    { number: 1, x: 0, z: -18 },
    { number: 2, x: 0, z: -26 },
    { number: 4, x: 0, z: -33 },
    { number: 5, x: 0, z: -40 },
    { number: 8, x: 0, z: -48 },
  ];

  const slotMarkers = slotDefs.map((slot) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.9, 0.08, 8, 20),
      new THREE.MeshStandardMaterial({ color: 0x6f5b45, roughness: 0.9, metalness: 0 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.set(slot.x, 0.08, slot.z);
    ring.receiveShadow = true;
    ring.userData = { expected: slot.number, occupied: false, slotX: slot.x, slotZ: slot.z };
    scene.add(ring);
    return ring;
  });

  const wordOptions = [
    createWordStone('LINKS', -6, -26),
    createWordStone('RECHTS', 6, -26),
    createWordStone('BENEDEN', 0, -52),
  ];
  wordOptions.forEach((o) => scene.add(o));

  const mapFragment = createMapFragment(0, -33);
  scene.add(mapFragment);

  const bankLeft = new THREE.Mesh(new THREE.PlaneGeometry(14, 56), makeMat(0x7cb252, 0.94));
  bankLeft.rotation.x = -Math.PI / 2;
  bankLeft.position.set(-8.5, 0.04, -33);
  bankLeft.receiveShadow = true;
  scene.add(bankLeft);

  const bankRight = bankLeft.clone();
  bankRight.position.x = 8.5;
  scene.add(bankRight);

  const startPosition = new THREE.Vector3(0, 1.7, 3);

  return {
    startPosition,
    islandBounds: ISLAND,
    stones,
    slotMarkers,
    wordOptions,
    flowingWater,
    waterfall,
    pond,
    mapFragment,
    waterMaterial,
  };
}
