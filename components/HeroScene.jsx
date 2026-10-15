'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from './useTheme';

const ACCENT = '#e95420';

// Monochrome palettes — the accent is used for a single orbiting satellite only
const PALETTE = {
  dark: { core: '#6a6a6a', emissive: '#1c1c1c', wire: '#d8d8d8', ring: '#8a8a8a', lattice: '#ffffff' },
  light: { core: '#d9d9d9', emissive: '#bdbdbd', wire: '#3a3a3a', ring: '#7a7a7a', lattice: '#000000' },
};

// Window-level pointer so the core reacts even though the canvas ignores events
const pointer = { x: 0, y: 0 };

function OrbitRing({ radius, color, tilt, speed, satellite }) {
  const ref = useRef();
  useFrame((_, delta) => { ref.current.rotation.z += delta * speed; });
  return (
    <group rotation={tilt}>
      <group ref={ref}>
        <mesh>
          <torusGeometry args={[radius, 0.006, 12, 220]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} />
        </mesh>
        {satellite && (
          <mesh position={[radius, 0, 0]}>
            <sphereGeometry args={[0.07, 20, 20]} />
            <meshBasicMaterial color={satellite} />
          </mesh>
        )}
      </group>
    </group>
  );
}

function Core({ c }) {
  const group = useRef();
  const shell = useRef();
  const lattice = useRef();

  useFrame((state, delta) => {
    const g = group.current;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, pointer.x * 0.6, 2.5, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, pointer.y * 0.4, 2.5, delta);
    shell.current.rotation.y += delta * 0.16;
    shell.current.rotation.x += delta * 0.04;
    lattice.current.rotation.y -= delta * 0.06;
    shell.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.02);
  });

  return (
    <group ref={group}>
      <Float speed={1.3} rotationIntensity={0.3} floatIntensity={0.8}>
        <mesh>
          <icosahedronGeometry args={[1.05, 24]} />
          <MeshDistortMaterial color={c.core} emissive={c.emissive} emissiveIntensity={0.4} roughness={0.25} metalness={0.55} distort={0.38} speed={2} />
        </mesh>
        <group ref={shell}>
          <mesh>
            <icosahedronGeometry args={[1.65, 1]} />
            <meshBasicMaterial color={c.wire} wireframe transparent opacity={0.28} />
          </mesh>
          <points>
            <icosahedronGeometry args={[1.65, 1]} />
            <pointsMaterial color={c.wire} size={0.06} sizeAttenuation transparent opacity={0.9} />
          </points>
        </group>
        <mesh ref={lattice}>
          <icosahedronGeometry args={[2.1, 2]} />
          <meshBasicMaterial color={c.lattice} wireframe transparent opacity={0.05} />
        </mesh>
      </Float>
      <OrbitRing radius={2.55} color={c.ring} tilt={[Math.PI / 2.3, 0.25, 0]} speed={0.4} satellite={ACCENT} />
      <OrbitRing radius={3} color={c.ring} tilt={[Math.PI / 1.75, -0.55, 0.3]} speed={-0.25} />
    </group>
  );
}

export default function HeroScene() {
  const wrapRef = useRef(null);
  const [inView, setInView] = useState(true);
  const { theme } = useTheme();
  const c = PALETTE[theme];

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
        <ambientLight intensity={theme === 'dark' ? 0.5 : 1.1} />
        <pointLight position={[4, 3, 4]} intensity={110} color="#ffffff" />
        <pointLight position={[-3, 4, 5]} intensity={40} color="#ffffff" />
        <pointLight position={[-4, -2, 3]} intensity={30} color={ACCENT} />
        <Core c={c} />
      </Canvas>
    </div>
  );
}
