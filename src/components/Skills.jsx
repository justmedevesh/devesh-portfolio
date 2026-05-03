import { useRef, useEffect, useState } from 'react';
import SectionWrapper, { SectionLabel, SectionTitle } from './SectionWrapper';
import { useReveal } from './useReveal';
import { skills } from '../data/portfolio';

function SkillCard({ skill, visible, delay }) {
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setBarWidth(skill.level), delay + 200);
      return () => clearTimeout(t);
    }
  }, [visible]);

  return (
    <div
      className="skill-card"
      style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        padding: '1.1rem 0.9rem', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
        transition: 'border-color 0.3s, transform 0.2s',
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(20px)',
        transitionDelay: `${delay}ms`,
        transitionProperty: 'opacity, transform, border-color',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--cyan)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.transform = 'none';
      }}
    >
      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{skill.icon}</div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.66rem', color: 'var(--text)', letterSpacing: '0.04em' }}>
        {skill.name}
      </div>
      <div style={{
        marginTop: '0.6rem', height: 2,
        background: 'var(--border)', borderRadius: 1, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', borderRadius: 1,
          background: 'linear-gradient(90deg, var(--blue2), var(--cyan))',
          width: barWidth + '%',
          transition: 'width 1s ease',
        }} />
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.55rem', color: 'var(--muted)', marginTop: '0.3rem' }}>
        {skill.category}
      </div>
    </div>
  );
}

export default function Skills() {
  const { ref, visible } = useReveal();

  return (
    <SectionWrapper id="skills" bg="var(--bg2)">
      <SectionLabel>// 02 — skills.json</SectionLabel>
      <SectionTitle>Tech Stack</SectionTitle>
      <div ref={ref} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
        gap: '1rem',
      }}>
        {skills.map((skill, i) => (
          <SkillCard key={skill.name} skill={skill} visible={visible} delay={i * 50} />
        ))}
      </div>
    </SectionWrapper>
  );
}
