'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/** Soft round sprite so points render as glowing dots instead of squares. */
function makeDotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.3, 'rgba(255,255,255,0.6)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

/**
 * Fixed full-page 3D background: a drifting particle nebula above an endless
 * perspective grid. The camera follows the mouse and sinks as the page scrolls.
 */
export default function NeuralCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.innerWidth < 768;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !small, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05060b, 0.055);
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0.6, 8);

    /* ── Particle nebula ───────────────────────────── */
    const N = small ? 700 : 1600;
    const positions = new Float32Array(N * 3);
    const colors = new Float32Array(N * 3);
    const cA = new THREE.Color('#22e6ff');
    const cB = new THREE.Color('#8b5cf6');
    const cC = new THREE.Color('#ff3d9a');
    const tmp = new THREE.Color();
    for (let i = 0; i < N; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 34;
      positions[i * 3 + 1] = (Math.random() - 0.3) * 18;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 24;
      const t = Math.random();
      tmp.copy(t < 0.5 ? cA : cB).lerp(t < 0.5 ? cB : cC, Math.random() * 0.6);
      colors.set([tmp.r, tmp.g, tmp.b], i * 3);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const dot = makeDotTexture();
    const pMat = new THREE.PointsMaterial({
      size: 0.09, map: dot, vertexColors: true, transparent: true, opacity: 0.85,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
    });
    const nebula = new THREE.Points(pGeo, pMat);
    scene.add(nebula);

    /* ── Infinite grid floor ───────────────────────── */
    const grid = new THREE.GridHelper(80, 80, 0x8b5cf6, 0x22e6ff);
    grid.material.transparent = true;
    grid.material.opacity = 0.16;
    grid.material.depthWrite = false;
    grid.position.y = -3.2;
    scene.add(grid);

    /* ── Input ─────────────────────────────────────── */
    let mx = 0, my = 0, scrollY = window.scrollY;
    const onMouse = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onScroll = () => { scrollY = window.scrollY; };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (reduced) renderer.render(scene, camera);
    };
    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    /* ── Loop ──────────────────────────────────────── */
    const start = performance.now();
    let rafId;
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      if (document.hidden) return;
      const t = (performance.now() - start) / 1000;

      nebula.rotation.y = t * 0.012;
      grid.position.z = (t * 0.6) % 1; // grid cells are 1 unit: wrap for an endless glide

      const scrollDepth = Math.min(scrollY / 2500, 1.6);
      // Grid belongs to the hero; fade it so it doesn't stripe behind content
      grid.material.opacity = 0.16 * Math.max(0, 1 - scrollY / 900);
      camera.position.x += (mx * 0.9 - camera.position.x) * 0.03;
      camera.position.y += (0.6 - my * 0.5 - scrollDepth * 1.4 - camera.position.y) * 0.03;
      camera.lookAt(0, -scrollDepth * 1.2, 0);
      renderer.render(scene, camera);
    };

    if (reduced) renderer.render(scene, camera);
    else tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      pGeo.dispose(); pMat.dispose(); dot.dispose();
      grid.geometry.dispose(); grid.material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
