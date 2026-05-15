import { useState, useEffect } from 'react';
import SectionWrapper, { SectionLabel, SectionTitle } from './SectionWrapper';
import { useReveal } from './useReveal';
import { personal } from '../data/portfolio';

const HIGHLIGHTS = ["Master's in Data Science", 'tech-focused', 'initiative'];

function HighlightText({ text }) {
  const parts = text.split(new RegExp(`(${HIGHLIGHTS.join('|')})`, 'g'));
  return (
    <p style={{
      fontFamily: 'var(--mono)', fontSize: '0.8rem',
      color: 'var(--muted)', lineHeight: 2, marginBottom: '1.1rem',
    }}>
      {parts.map((part, j) =>
        HIGHLIGHTS.includes(part)
          ? <span key={j} style={{ color: 'var(--cyan)' }}>{part}</span>
          : part
      )}
    </p>
  );
}

function Terminal() {
  const lines = [
    { cmd: 'whoami', out: personal.name },
    { cmd: 'cat bio.txt', out: '"' + personal.bio + '"' },
    { cmd: 'echo $LOCATION', out: personal.location },
    { cmd: 'python --version', out: 'Python 3.x — installed' },
    { cmd: 'status', out: 'OPEN TO OPPORTUNITIES', neon: true },
  ];

  const totalLines = lines.length;
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (shown < totalLines) {
      const t = setTimeout(() => setShown(s => s + 1), 600);
      return () => clearTimeout(t);
    }
  }, [shown, totalLines]);

  return (
    <div style={{
      background: '#000', border: '1px solid var(--border)',
      padding: '1.4rem', borderRadius: 4,
      fontFamily: 'var(--mono)', fontSize: '0.74rem', lineHeight: 2,
    }}>
      <div style={{ display: 'flex', gap: '0.45rem', marginBottom: '1rem', paddingBottom: '0.7rem', borderBottom: '1px solid var(--border)' }}>
        {['#ff5f57','#febc2e','#28c840'].map(c => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
        ))}
        <span style={{ fontSize: '0.62rem', color: 'var(--muted)', marginLeft: '0.4rem' }}>devesh@ds:~</span>
      </div>
      {lines.slice(0, shown).map((line, i) => (
        <div key={i}>
          <div>
            <span style={{ color: 'var(--cyan)' }}>{'> '}</span>
            <span style={{ color: '#39ff14' }}>{line.cmd}</span>
          </div>
          <div style={{ color: line.neon ? '#39ff14' : 'var(--muted)', marginBottom: '0.2rem' }}>
            {line.out}
          </div>
        </div>
      ))}
      {shown >= lines.length && (
        <div style={{ color: 'var(--cyan)' }}>
          {'> '}<span style={{ animation: 'blink 1s infinite' }}>_</span>
        </div>
      )}
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
}

export default function About() {
  const { ref, visible } = useReveal();

  return (
    <SectionWrapper id="about" bg="linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%)">
      <SectionLabel>// 01 --- about.md</SectionLabel>
      <SectionTitle>About Me</SectionTitle>
      <div
        ref={ref}
        className="about-grid"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateY(30px)',
          transition: 'opacity 0.7s, transform 0.7s',
        }}
      >
        <div>
          {personal.about.map((p, i) => (
            <HighlightText key={i} text={p} />
          ))}
        </div>
        <Terminal />
      </div>
    </SectionWrapper>
  );
}
