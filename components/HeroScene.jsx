'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Window-level pointer so the core reacts even though the canvas ignores events
const pointer = { x: 0, y: 0 };

function OrbitRing({ radius, color, tilt, speed, satellites = 1 }) {
  const ref = useRef();
  useFrame((_, delta) => { ref.current.rotation.z += delta * speed; });
  return (
    <group rotation={tilt}>
      <group ref={ref}>
        <mesh>
          <torusGeometry args={[radius, 0.007, 12, 220]} />
          <meshBasicMaterial color={color} transparent opacity={0.55} />
        </mesh>
        {Array.from({ length: satellites }, (_, i) => {
          const a = (i / satellites) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * radius, Math.sin(a) * radius, 0]}>
              <sphereGeometry args={[0.055, 16, 16]} />
              <meshBasicMaterial color={color} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

function NeuralCore() {
  const group = useRef();
  const shell = useRef();
  const lattice = useRef();

  useFrame((state, delta) => {
    const g = group.current;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, pointer.x * 0.7, 2.5, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, pointer.y * 0.45, 2.5, delta);
    shell.current.rotation.y += delta * 0.18;
    shell.current.rotation.x += delta * 0.05;
    lattice.current.rotation.y -= delta * 0.08;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.6) * 0.025;
    shell.current.scale.setScalar(pulse);
  });

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.9}>
        {/* Liquid metal core */}
        <mesh>
          <icosahedronGeometry args={[1.1, 24]} />
          <MeshDistortMaterial
            color="#2a2370" emissive="#3b0f8a" emissiveIntensity={0.3}
            roughness={0.22} metalness={0.35} distort={0.42} speed={2.4}
          />
        </mesh>

        {/* Wireframe shell + glowing vertices */}
        <group ref={shell}>
          <mesh>
            <icosahedronGeometry args={[1.7, 1]} />
            <meshBasicMaterial color="#22e6ff" wireframe transparent opacity={0.32} />
          </mesh>
          <points>
            <icosahedronGeometry args={[1.7, 1]} />
            <pointsMaterial color="#22e6ff" size={0.07} sizeAttenuation transparent opacity={0.95} />
          </points>
        </group>

        {/* Outer faint lattice */}
        <mesh ref={lattice}>
          <icosahedronGeometry args={[2.15, 2]} />
          <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.07} />
        </mesh>
      </Float>

      <OrbitRing radius={2.6} color="#22e6ff" tilt={[Math.PI / 2.3, 0.25, 0]} speed={0.45} satellites={2} />
      <OrbitRing radius={3.05} color="#8b5cf6" tilt={[Math.PI / 1.75, -0.55, 0.3]} speed={-0.28} />
      <OrbitRing radius={3.45} color="#ff3d9a" tilt={[Math.PI / 2.8, 0.9, -0.2]} speed={0.18} />

      <Sparkles count={90} scale={[7, 7, 7]} size={2.2} speed={0.35} color="#9be9ff" opacity={0.8} />
    </group>
  );
}

export default function HeroScene() {
  const wrapRef = useRef(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const onMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    // Stop rendering when the hero is scrolled away
    const obs = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    if (wrapRef.current) obs.observe(wrapRef.current);

    return () => {
      window.removeEventListener('pointermove', onMove);
      obs.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className="hero-scene" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 7.2], fov: 45 }}
        frameloop={inView ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.35} />
        <pointLight position={[4, 3, 4]} intensity={80} color="#22e6ff" />
        <pointLight position={[-4, -2, 3]} intensity={70} color="#ff3d9a" />
        <pointLight position={[0, 4, -3]} intensity={40} color="#8b5cf6" />
        <NeuralCore />
      </Canvas>
    </div>
  );
}
