'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import SectionWrapper, { SectionHead } from './SectionWrapper';
import TiltCard from './TiltCard';
import { useReveal } from './useReveal';
import { getDisplaySkills } from '../data/skillStore';
import { MonitorIcon } from './Icons';

/**
 * CSS-3D tag sphere: names are spread over a sphere (Fibonacci lattice) and
 * rotated every frame. Pointer position steers the spin direction and speed.
 */
function SkillSphere({ names }) {
  const wrapRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || names.length === 0) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const n = names.length;
    const points = names.map((_, i) => {
      const y = 1 - (i / Math.max(n - 1, 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = Math.PI * (3 - Math.sqrt(5)) * i;
      return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r };
    });

    let ax = 0.0018, ay = 0.0032;        // current angular velocity
    let tx = ax, ty = ay;                // target velocity
    let rotX = 0, rotY = 0;
    let rafId;

    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      ty = dx * 0.03;
      tx = -dy * 0.03;
    };
    const onLeave = () => { tx = 0.0018; ty = 0.0032; };
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);

    const render = () => {
      const radius = wrap.clientWidth * 0.38;
      const cx = Math.cos(rotX), sx = Math.sin(rotX);
      const cy = Math.cos(rotY), sy = Math.sin(rotY);
      points.forEach((p, i) => {
        const el = itemRefs.current[i];
        if (!el) return;
        // rotate around Y then X
        const x1 = p.x * cy + p.z * sy;
        const z1 = -p.x * sy + p.z * cy;
        const y2 = p.y * cx - z1 * sx;
        const z2 = p.y * sx + z1 * cx;
        const depth = (z2 + 1) / 2; // 0 = back, 1 = front
        el.style.transform = `translate(-50%, -50%) translate3d(${x1 * radius}px, ${y2 * radius}px, 0) scale(${0.6 + depth * 0.65})`;
        el.style.opacity = String(0.18 + depth * 0.82);
        el.style.zIndex = String(Math.round(depth * 100));
        el.style.filter = depth < 0.35 ? 'blur(1px)' : 'none';
      });
    };

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      ax += (tx - ax) * 0.05;
      ay += (ty - ay) * 0.05;
      rotX += ax;
      rotY += ay;
      render();
    };

    if (reduced) render();
    else tick();

    return () => {
      cancelAnimationFrame(rafId);
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
    };
  }, [names]);

  return (
    <div ref={wrapRef} className="sphere" aria-hidden="true">
      <div className="sphere-ring" />
      {names.map((name, i) => (
        <span key={name + i} ref={(el) => { itemRefs.current[i] = el; }} className={`sphere-item ${i % 3 === 0 ? 'hot' : ''}`}>
          {name}
        </span>
      ))}
    </div>
  );
}

function SkillCard({ skill, visible, delay }) {
  return (
    <div className={`reveal ${visible ? 'is-visible' : ''}`} style={{ '--d': `${delay}ms` }}>
      <TiltCard className="glass-card skill-card" max={6}>
        <div className="skill-icon">{skill.icon}</div>
        <div>
          <div className="skill-top">
            <span className="skill-name">{skill.name}</span>
            <span className="skill-cat">{skill.category}</span>
          </div>
          <div className="skill-bar">
            <div
              className="skill-bar-fill"
              style={{ transform: `scaleX(${visible ? (skill.level || 0) / 100 : 0})`, transitionDelay: `${delay + 300}ms` }}
            />
          </div>
        </div>
        <div className="skill-level">{skill.level}%</div>
      </TiltCard>
    </div>
  );
}

export default function Skills() {
  const { ref, visible } = useReveal(0.1);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    getDisplaySkills().then(setSkills);
  }, []);

  const names = useMemo(() => skills.map((s) => s.name), [skills]);

  return (
    <SectionWrapper id="skills" title="System Monitor — Skills" app="System Monitor" Icon={MonitorIcon}>
      <SectionHead index="02" label="skills" title={<>The <span className="grad-text">stack</span> I think in.</>} />
      <div className="skills-layout">
        <SkillSphere names={names} />
        <div ref={ref} className="skills-grid">
          {skills.map((skill, i) => (
            <SkillCard key={skill.id || skill.name} skill={skill} visible={visible} delay={i * 40} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
