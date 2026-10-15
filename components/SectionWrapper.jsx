'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import ScrambleText from './ScrambleText';
import { useReveal } from './useReveal';
import { MinIcon, MaxIcon, CloseIcon } from './Icons';

/**
 * Ubuntu (Yaru) style app window. As it scrolls into view it swings up from a
 * tilted-back 3D position. Minimise/close fold the body, maximise widens it.
 */
export function Window({ title, app, Icon, children, className = '' }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.35'] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 });
  const rotateX = useTransform(p, [0, 1], [24, 0]);
  const scale = useTransform(p, [0, 1], [0.88, 1]);
  const y = useTransform(p, [0, 1], [90, 0]);
  const opacity = useTransform(p, [0, 0.5, 1], [0, 0.85, 1]);

  return (
    <motion.div
      ref={ref}
      className={`window ${minimized ? 'minimized' : ''} ${maximized ? 'maximized' : ''} ${className}`}
      style={reduced ? undefined : { rotateX, scale, y, opacity }}
    >
      <div className="win-titlebar" onDoubleClick={() => setMaximized((m) => !m)}>
        {app && <span className="win-app">{Icon && <Icon />}{app}</span>}
        <span className="win-title">{title}</span>
        <div className="win-controls">
          <button className="win-btn" onClick={() => setMinimized((m) => !m)} aria-label={minimized ? 'Restore' : 'Minimise'}><MinIcon /></button>
          <button className="win-btn" onClick={() => setMaximized((m) => !m)} aria-label={maximized ? 'Unmaximise' : 'Maximise'}><MaxIcon /></button>
          <button className="win-btn close" onClick={() => setMinimized(true)} aria-label="Close"><CloseIcon /></button>
        </div>
      </div>
      <div className="win-body">{children}</div>
    </motion.div>
  );
}

export default function SectionWrapper({ id, title, app, Icon, children }) {
  return (
    <section id={id} className="section">
      <Window title={title} app={app} Icon={Icon}>{children}</Window>
    </section>
  );
}

/** Path line + title that decodes itself when it scrolls into view. */
export function SectionHead({ index, label, title }) {
  const { ref, visible } = useReveal(0.4);
  return (
    <div ref={ref} className={`section-head reveal ${visible ? 'is-visible' : ''}`}>
      <div className="section-path">
        ~/portfolio/<b>{index}</b>-<ScrambleText text={label} trigger={visible} duration={600} />
      </div>
      <h2 className="section-title">{title}</h2>
    </div>
  );
}
