import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animate);
    };

    const onEnter = () => {
      ring.style.width = '52px';
      ring.style.height = '52px';
      ring.style.borderColor = 'var(--cyan)';
      dot.style.transform = 'translate(-50%,-50%) scale(1.6)';
    };
    const onLeave = () => {
      ring.style.width = '36px';
      ring.style.height = '36px';
      dot.style.transform = 'translate(-50%,-50%) scale(1)';
    };

    document.addEventListener('mousemove', onMove);
    const interactives = document.querySelectorAll('button, a, .skill-card, .edu-card, .contact-item, .nav-link');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    const raf = requestAnimationFrame(animate);
    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{
        position: 'fixed', width: 10, height: 10,
        background: 'var(--cyan)', borderRadius: '50%',
        pointerEvents: 'none', zIndex: 9999,
        transform: 'translate(-50%,-50%)',
        transition: 'transform 0.15s',
        mixBlendMode: 'screen', top: 0, left: 0,
      }} />
      <div ref={ringRef} style={{
        position: 'fixed', width: 36, height: 36,
        border: '1px solid var(--cyan)', borderRadius: '50%',
        pointerEvents: 'none', zIndex: 9998,
        transform: 'translate(-50%,-50%)',
        transition: 'width 0.2s, height 0.2s, border-color 0.2s',
        opacity: 0.5, top: 0, left: 0,
      }} />
    </>
  );
}
