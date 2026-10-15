'use client';

import SectionWrapper, { SectionHead } from './SectionWrapper';
import TiltCard from './TiltCard';
import Reveal from './Reveal';
import { DocIcon } from './Icons';
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

/** about.md rendered like a gedit buffer with line numbers. */
function Editor() {
  const lines = [
    <span key="h" className="h"># {personal.name}</span>,
    <span key="r"><span className="k">**role**</span>: {personal.title}</span>,
    '',
    ...personal.about.flatMap((p, i) => [<HighlightText key={`p${i}`} text={p} />, '']),
    <span key="s"><span className="k">&gt;</span> {personal.bio}</span>,
  ];

  // One row per line so wrapped text keeps its line number aligned
  return (
    <div className="editor">
      {lines.map((line, i) => (
        <div key={i} className="editor-row">
          <span className="editor-ln" aria-hidden="true">{i + 1}</span>
          <div className="editor-line">{line || '\u00a0'}</div>
        </div>
      ))}
    </div>
  );
}

const FACTS = [
  { k: 'Location', v: personal.location },
  { k: 'Focus', v: 'Machine Learning · NLP · Data' },
  { k: 'Currently', v: "Master's in Data Science" },
  { k: 'Status', v: 'Open to opportunities', hot: true },
];

export default function About() {
  return (
    <SectionWrapper id="about" title="about.md" app="Text Editor" Icon={DocIcon}>
      <SectionHead index="01" label="about" title={<>Turning noise into <span className="grad-text">signal.</span></>} />
      <div className="about-grid">
        <Reveal><Editor /></Reveal>
        <div className="about-facts">
          {FACTS.map((f, i) => (
            <Reveal key={f.k} delay={i * 90}>
              <TiltCard className="glass-card fact" max={8}>
                <div className="fact-k">{f.k}</div>
                <div className={`fact-v ${f.hot ? 'hot' : ''}`}>{f.v}</div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
