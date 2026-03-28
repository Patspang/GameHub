// Three.js canvas wrapper — mounts renderer once, runs game loop
// onReady(refs) is called once when scene is ready
// onFrame(refs) is called every animation frame (via ref to prevent stale closures)

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ThreeCanvas({ onReady, onFrame }) {
  const mountRef = useRef(null);
  const onReadyRef = useRef(onReady);
  const onFrameRef = useRef(onFrame);

  // Keep refs updated without triggering re-init
  onReadyRef.current = onReady;
  onFrameRef.current = onFrame;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = mount.clientWidth || window.innerWidth;
    const h = mount.clientHeight || window.innerHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x7ab0cc);
    scene.fog = new THREE.FogExp2(0x8abcce, 0.022);

    // Camera
    const camera = new THREE.PerspectiveCamera(72, w / h, 0.1, 200);
    camera.position.set(0, 1.7, 4);

    // Renderer — high-quality settings
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // Lighting — sky/ground hemisphere for natural ambient bounce
    const hemi = new THREE.HemisphereLight(0x90c8e8, 0x6b8844, 0.8);
    scene.add(hemi);

    // Warm ambient fill
    const ambient = new THREE.AmbientLight(0xfff5e0, 0.35);
    scene.add(ambient);

    // Main sun — warm golden, high angle
    const sun = new THREE.DirectionalLight(0xffd070, 1.8);
    sun.position.set(15, 35, 15);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 120;
    sun.shadow.camera.left = -50;
    sun.shadow.camera.right = 50;
    sun.shadow.camera.top = 50;
    sun.shadow.camera.bottom = -50;
    sun.shadow.bias = -0.0005;
    scene.add(sun);

    // Soft fill from opposite side
    const fill = new THREE.DirectionalLight(0xc8e0f0, 0.4);
    fill.position.set(-10, 10, -10);
    scene.add(fill);

    // Notify game that scene is ready
    onReadyRef.current?.({ scene, camera, renderer });

    // Game loop
    let animId;
    let lastTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      onFrameRef.current?.({ scene, camera, renderer, delta });
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []); // Mount once only

  return (
    <div
      ref={mountRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  );
}
