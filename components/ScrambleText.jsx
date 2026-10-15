'use client';

import { useEffect, useState } from 'react';

const GLYPHS = '!<>-_\\/[]{}=+*^?#01ABCDEFXZ';

/** Decodes `text` from random glyphs, left to right, once `trigger` is true. */
export default function ScrambleText({ text, trigger = true, delay = 0, duration = 900 }) {
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (!trigger) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOut(text);
      return;
    }

    let raf;
    let start;
    const scramble = (revealed) =>
      text
        .split('')
        .map((ch, i) => (i < revealed || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
        .join('');

    setOut(scramble(0));
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      setOut(scramble(Math.floor(p * text.length)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    const timer = setTimeout(() => { raf = requestAnimationFrame(step); }, delay);

    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [text, trigger, delay, duration]);

  return (
    <>
      <span aria-hidden="true">{out}</span>
      <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{text}</span>
    </>
  );
}
