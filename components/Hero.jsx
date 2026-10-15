'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { personal, skills } from '../data/portfolio';
import ScrambleText from './ScrambleText';
import { useBooted } from './useBooted';

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

const ROLES = [
  'machine learning models',
  'NLP pipelines',
  'data-driven web apps',
  'systems that think',
];

const fadeUp = (delay, booted) => ({
  initial: { opacity: 0, y: 30, filter: 'blur(8px)' },
  animate: booted ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined,
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
});

const scrollToId = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

/** Types and deletes each role in turn. */
function RoleTyper({ active }) {
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

  return (
    <p className="hero-role">
      <span className="prompt">~/devesh $</span> I build <span className="typed">{text}</span>
      <span className="caret" />
    </p>
  );
}

/** Fake-but-alive training readout floating next to the 3D core. */
function TrainingHud() {
  const [epoch, setEpoch] = useState(1);
  useEffect(() => {
    const t = setInterval(() => setEpoch((e) => (e % 512) + 1), 140);
    return () => clearInterval(t);
  }, []);
  const loss = (0.9 * Math.exp(-epoch / 90) + 0.0021).toFixed(4);
  const acc = (99.4 - 60 * Math.exp(-epoch / 70)).toFixed(2);

  return (
    <>
      <div className="hero-hud hud-a">
        <div>model.fit(<b>X_train</b>, <b>y_train</b>)</div>
        <div>epoch <b>{String(epoch).padStart(3, '0')}</b>/512</div>
        <div>loss <b>{loss}</b> · acc <span className="hot">{acc}%</span></div>
      </div>
      <div className="hero-hud hud-b">
        <div>core.temp <b>36.6°C</b></div>
        <div>neurons <b>1.2e6</b> · <span className="hot">online</span></div>
      </div>
    </>
  );
}

export default function Hero() {
  const booted = useBooted();
  const [first, ...rest] = personal.name.split(' ');
  const line1 = [first, rest.slice(0, -1).join(' ')].filter(Boolean).join(' ');
  const line2 = rest[rest.length - 1] || '';
  const marquee = [...skills.map((s) => s.name), 'NLP', 'Streamlit', 'Data Viz'];

  return (
    <section id="hero" className="hero-section">
      <div className="hero-grid-bg" />
      <HeroScene />
      <TrainingHud />

      <div className="hero-content">
        <motion.div {...fadeUp(0.05, booted)} className="hero-chip">
          <span className="status-dot" /> System online · {personal.location}
        </motion.div>

        <motion.h1 {...fadeUp(0.15, booted)} className="hero-title">
          <span className="line"><ScrambleText text={line1} trigger={booted} delay={150} duration={800} /></span>
          <span className="line">
            <span className="grad-text glitch" data-text={line2}>
              <ScrambleText text={line2} trigger={booted} delay={450} duration={700} />
            </span>
          </span>
        </motion.h1>

        <motion.div {...fadeUp(0.35, booted)}>
          <RoleTyper active={booted} />
        </motion.div>

        <motion.p {...fadeUp(0.45, booted)} className="hero-tagline">
          {personal.title} — {personal.tagline}
        </motion.p>

        <motion.div {...fadeUp(0.55, booted)} className="hero-buttons">
          <button className="btn btn-primary" onClick={() => scrollToId('contact')}>
            Get in touch <span className="arrow">→</span>
          </button>
          <button className="btn btn-ghost" onClick={() => scrollToId('projects')}>
            View my work
          </button>
        </motion.div>

        <motion.div {...fadeUp(0.7, booted)} className="hero-stats">
          {personal.stats.map((s) => (
            <div key={s.label}>
              <div className="hero-stat-num grad-text">{s.num}</div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <button className="scroll-cue" onClick={() => scrollToId('about')} aria-label="Scroll to About">
        Scroll <span className="scroll-cue-track" />
      </button>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...marquee, ...marquee].map((item, i) => (
            <span key={i} className="marquee-item">{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
