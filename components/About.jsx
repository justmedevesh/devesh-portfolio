'use client';

import { useState, useEffect } from 'react';
import SectionWrapper, { SectionHead } from './SectionWrapper';
import TiltCard from './TiltCard';
import Reveal from './Reveal';
import { useReveal } from './useReveal';
import { personal } from '../data/portfolio';

const HIGHLIGHTS = ["Master's in Data Science", 'Data Science Intern', 'tech-focused', 'initiative', 'real world'];

function HighlightText({ text }) {
  const parts = text.split(new RegExp(`(${HIGHLIGHTS.join('|')})`, 'g'));
  return (
    <p>
      {parts.map((part, j) =>
        HIGHLIGHTS.includes(part) ? <span key={j} className="hl">{part}</span> : part
      )}
    </p>
  );
}

function Terminal() {
  const lines = [
    { cmd: 'whoami', out: personal.name },
    { cmd: 'cat bio.txt', out: `"${personal.bio}"` },
    { cmd: 'echo $LOCATION', out: personal.location },
    { cmd: 'python -c "import ml; ml.status()"', out: 'models: trained · coffee: critical' },
    { cmd: 'status --hire', out: '✔ OPEN TO OPPORTUNITIES', hot: true },
  ];

  const { ref, visible } = useReveal(0.3);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (visible && shown < lines.length) {
      const t = setTimeout(() => setShown((s) => s + 1), shown === 0 ? 300 : 550);
      return () => clearTimeout(t);
    }
  }, [visible, shown, lines.length]);

  return (
    <div ref={ref}>
      <TiltCard className="glass-card terminal" max={6}>
        <div className="terminal-bar">
          <i style={{ background: '#ff5f57' }} />
          <i style={{ background: '#febc2e' }} />
          <i style={{ background: '#28c840' }} />
          <span>devesh@neural-core: ~</span>
        </div>
        <div className="terminal-body pop-sm">
          {lines.slice(0, shown).map((line) => (
            <div key={line.cmd}>
              <div><span className="p">❯ </span><span className="c">{line.cmd}</span></div>
              <div className={`o ${line.hot ? 'hot' : ''}`}>{line.out}</div>
            </div>
          ))}
          {shown >= lines.length && (
            <div><span className="p">❯ </span><span className="brand-caret">█</span></div>
          )}
        </div>
      </TiltCard>
    </div>
  );
}

export default function About() {
  return (
    <SectionWrapper id="about">
      <SectionHead index="01" label="about.md" title={<>Turning noise into <span className="grad-text">signal.</span></>} />
      <div className="about-grid">
        <Reveal className="about-text">
          {personal.about.map((p, i) => <HighlightText key={i} text={p} />)}
        </Reveal>
        <Reveal delay={150}>
          <Terminal />
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
