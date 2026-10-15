'use client';

import ScrambleText from './ScrambleText';
import { useReveal } from './useReveal';

export default function SectionWrapper({ id, children, className = '' }) {
  return (
    <section id={id} className={`section ${className}`}>
      <div className="section-inner">{children}</div>
    </section>
  );
}

/** Numbered label + title that decodes itself when it scrolls into view. */
export function SectionHead({ index, label, title }) {
  const { ref, visible } = useReveal(0.4);
  return (
    <div ref={ref} className={`section-head reveal ${visible ? 'is-visible' : ''}`}>
      <div className="section-label">
        {index} / <ScrambleText text={label} trigger={visible} duration={600} />
      </div>
      <h2 className="section-title">{title}</h2>
    </div>
  );
}
