'use client';

import { useEffect, useRef } from 'react';

const INTERACTIVE_SELECTOR = 'button, a, input, textarea, select, .tilt, .sphere';

/** Dot + lagging ring cursor. Only active on devices with a fine pointer. */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    const onMove = (e) => {
      // Reveal only after the first real movement so nothing sits at (0,0)
      dot.style.display = ring.style.display = 'block';
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    };

    // Event delegation covers elements rendered later (e.g. Firestore content)
    const onOver = (e) => {
      const hot = e.target.closest?.(INTERACTIVE_SELECTOR);
      ring.classList.toggle('hot', Boolean(hot));
    };

    let rafId;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    animate();

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{
        display: 'none', position: 'fixed', top: 0, left: 0, width: 6, height: 6,
        background: '#fff', borderRadius: '50%', pointerEvents: 'none', zIndex: 10001,
        mixBlendMode: 'difference',
      }} />
      <div ref={ringRef} className="cursor-ring" style={{ display: 'none' }} />
      <style>{`
        .cursor-ring {
          position: fixed; top: 0; left: 0; width: 34px; height: 34px;
          border: 1px solid rgba(34, 230, 255, 0.6); border-radius: 50%;
          pointer-events: none; z-index: 10000;
          transition: width 0.25s var(--ease), height 0.25s var(--ease), background 0.25s, border-color 0.25s;
        }
        .cursor-ring.hot {
          width: 58px; height: 58px;
          border-color: var(--cyan);
          background: rgba(34, 230, 255, 0.08);
        }
      `}</style>
    </>
  );
}
