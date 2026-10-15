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
const STEP_MS = 190;
const SESSION_KEY = 'dkm-booted';

function finishBoot() {
  window.__dkmBooted = true;
  window.dispatchEvent(new Event('dkm:booted'));
}

/** Terminal-style intro shown once per browser session. Click or any key skips it. */
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

  const pct = Math.min(100, Math.round((count / (LINES.length + 1)) * 100));

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="boot"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          <div className="boot-inner">
            <div className="boot-head">
              <span>dkm://init</span>
              <span>secure shell</span>
            </div>
            <div className="boot-lines">
              {LINES.slice(0, count).map((line) => (
                <div key={line} className="boot-line">
                  <span className="ok">[ OK ]</span> {line}
                </div>
              ))}
              {count > LINES.length && (
                <div className="boot-line final">&gt; ACCESS GRANTED — welcome, human.</div>
              )}
            </div>
            <div className="boot-bar">
              <motion.div className="boot-bar-fill" animate={{ width: `${pct}%` }} transition={{ ease: 'easeOut', duration: 0.2 }} />
            </div>
            <div className="boot-foot">
              <span>click / any key to skip</span>
              <span className="boot-pct">{String(pct).padStart(3, '0')}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
