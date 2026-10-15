'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const LINES = [
  'Booting DKM-OS v26.10 kernel',
  'Mounting /dev/neural_core',
  'Loading model weights ........ 2.4 GB',
  'Calibrating gradient descent',
  'Linking uplink → kathmandu.np',
  'Injecting caffeine ........... 100%',
];
const STEP_MS = 240;
const SESSION_KEY = 'dkm-booted';

function finishBoot() {
  window.__dkmBooted = true;
  window.dispatchEvent(new Event('dkm:booted'));
}

/** Plymouth-style boot splash shown once per browser session. Click or any key skips it. */
export default function BootLoader() {
  const pathname = usePathname();
  const [show, setShow] = useState(!pathname?.startsWith('/admin'));
  const [count, setCount] = useState(0);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(SESSION_KEY) === '1'; } catch {}
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!show || seen || reduced) {
      setShow(false);
      finishBoot();
      return;
    }

    document.documentElement.style.overflow = 'hidden';
    const skip = () => setCount(LINES.length + 2);
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    return () => {
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
    // Runs once on mount — `show` is only read for its initial value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!show) return;
    if (count <= LINES.length + 1) {
      const t = setTimeout(() => setCount((c) => c + 1), count === LINES.length ? 420 : STEP_MS);
      return () => clearTimeout(t);
    }
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch {}
    document.documentElement.style.overflow = '';
    setShow(false);
    finishBoot();
  }, [count, show]);

  const current = count > LINES.length ? 'Starting session…' : LINES[Math.max(0, count - 1)];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="boot"
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          <span className="boot-skip">click to skip</span>
          <div className="boot-mark">DKM <b>OS</b></div>
          <div className="boot-dots"><i /><i /><i /><i /><i /></div>
          <div className="boot-log">{current}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
