'use client';

import { useReveal } from './useReveal';

/** Fades + lifts its children into view the first time they scroll on screen. */
export default function Reveal({ children, delay = 0, className = '', as: Tag = 'div', style }) {
  const { ref, visible } = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--d': `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}
