'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { personal } from '../data/portfolio';
import ScrambleText from './ScrambleText';
import { useBooted } from './useBooted';
import { MinIcon, MaxIcon, CloseIcon } from './Icons';

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

const ROLES = [
  'machine learning models',
  'NLP pipelines',
  'data-driven web apps',
  'systems that think',
];

const fadeUp = (delay, booted) => ({
  initial: { opacity: 0, y: 26 },
  animate: booted ? { opacity: 1, y: 0 } : undefined,
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
});

const scrollToId = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

/** Types and deletes each role in turn. */
function useRoleTyper(active) {
  const [roleIdx, setRoleIdx] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!active) return;
    const full = ROLES[roleIdx];
    let delay = deleting ? 35 : 70;
    if (!deleting && text === full) delay = 1800;
    if (deleting && text === '') delay = 300;

    const t = setTimeout(() => {
      if (!deleting && text === full) setDeleting(true);
      else if (deleting && text === '') {
        setDeleting(false);
        setRoleIdx((i) => (i + 1) % ROLES.length);
      } else {
        setText(full.slice(0, text.length + (deleting ? -1 : 1)));
      }
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, roleIdx, active]);

  return text;
}

/** Ubuntu terminal floating over the 3D scene; tilts toward the pointer. */
function HeroTerminal({ booted }) {
  const typed = useRoleTyper(booted);
  const reduced = useReducedMotion();
  const rx = useMotionValue(8);
  const ry = useMotionValue(-14);
  const rotateX = useSpring(rx, { stiffness: 80, damping: 18 });
  const rotateY = useSpring(ry, { stiffness: 80, damping: 18 });
  const ref = useRef(null);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      ry.set(-14 + x * 16);
      rx.set(8 - y * 12);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced, rx, ry]);

  const prompt = <><span className="u">devesh@ubuntu</span><span className="p">:~$</span> </>;

  return (
    <motion.div {...fadeUp(0.6, booted)} className="hero-terminal-wrap">
      <motion.div ref={ref} className="hero-terminal" style={reduced ? undefined : { rotateX, rotateY }}>
        <div className="win-titlebar">
          <span className="win-title">devesh@ubuntu: ~</span>
          <div className="win-controls">
            <span className="win-btn"><MinIcon /></span>
            <span className="win-btn"><MaxIcon /></span>
            <span className="win-btn"><CloseIcon /></span>
          </div>
        </div>
        <div className="term-body">
          <div>{prompt}whoami</div>
          <div className="o">{personal.name}</div>
          <div>{prompt}cat role.txt</div>
          <div className="o">{personal.title} · {personal.location}</div>
          <div>{prompt}systemctl status career</div>
          <div className="o">● open-to-opportunities.service — <span className="u">active (running)</span></div>
          <div>{prompt}echo &quot;I build $WHAT&quot;</div>
          <div className="o">I build {typed}<span className="term-caret" /></div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const booted = useBooted();
  const [first, ...rest] = personal.name.split(' ');
  const line1 = [first, rest.slice(0, -1).join(' ')].filter(Boolean).join(' ');
  const line2 = rest[rest.length - 1] || '';

  return (
    <section id="hero" className="hero-section">
      <HeroScene />

      <div className="hero-content">
        <motion.div {...fadeUp(0.05, booted)} className="hero-chip">
          <span className="status-dot" /> available · {personal.location}
        </motion.div>

        <motion.h1 {...fadeUp(0.15, booted)} className="hero-title">
          <span className="line"><ScrambleText text={line1} trigger={booted} delay={150} duration={800} /></span>
          <span className="line"><ScrambleText text={line2} trigger={booted} delay={450} duration={700} /></span>
        </motion.h1>

        <motion.p {...fadeUp(0.35, booted)} className="hero-tagline">
          {personal.title} — {personal.tagline}
        </motion.p>

        <motion.div {...fadeUp(0.45, booted)} className="hero-buttons">
          <button className="btn btn-primary" onClick={() => scrollToId('contact')}>
            Get in touch <span className="arrow">→</span>
          </button>
          <button className="btn btn-ghost" onClick={() => scrollToId('projects')}>
            View my work
          </button>
        </motion.div>

        <motion.div {...fadeUp(0.6, booted)} className="hero-stats">
          {personal.stats.map((s) => (
            <div key={s.label}>
              <div className="hero-stat-num">{s.num}</div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <HeroTerminal booted={booted} />

      <button className="scroll-cue" onClick={() => scrollToId('about')} aria-label="Scroll to About">
        scroll <span className="scroll-cue-track" />
      </button>
    </section>
  );
}
