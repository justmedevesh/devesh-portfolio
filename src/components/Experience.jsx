import SectionWrapper, { SectionLabel, SectionTitle } from './SectionWrapper';
import { useReveal } from './useReveal';
import { experience } from '../data/portfolio';

function ExpItem({ item, index, visible }) {
  return (
    <div
      style={{
        position: 'relative', marginBottom: '3rem', paddingLeft: '2rem',
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateX(-20px)',
        transition: `opacity 0.6s ${index * 0.15}s, transform 0.6s ${index * 0.15}s`,
      }}
    >
      {/* Timeline dot */}
      <div style={{
        position: 'absolute', left: '-0.55rem', top: '0.3rem',
        width: 10, height: 10, borderRadius: '50%',
        background: item.current ? 'var(--cyan)' : 'var(--muted)',
        boxShadow: item.current ? '0 0 12px var(--cyan)' : 'none',
      }} />

      <div style={{
        fontFamily: 'var(--mono)', fontSize: '0.63rem',
        color: 'var(--cyan)', letterSpacing: '0.1em',
        textTransform: 'uppercase', marginBottom: '0.35rem',
      }}>
        {item.period} · {item.duration}
      </div>

      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.2rem' }}>
        {item.role}
      </h3>

      <div style={{
        fontFamily: 'var(--mono)', fontSize: '0.72rem',
        color: 'var(--muted)', marginBottom: '0.8rem',
      }}>
        {item.company} &nbsp;·&nbsp; {item.type} &nbsp;·&nbsp; {item.location}
      </div>

      <p style={{
        fontFamily: 'var(--mono)', fontSize: '0.73rem',
        color: 'var(--muted)', lineHeight: 1.9, maxWidth: 620,
      }}>
        {item.description}
      </p>

      <div style={{ marginTop: '0.8rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {item.current && (
          <span style={{
            fontFamily: 'var(--mono)', fontSize: '0.58rem',
            padding: '0.2rem 0.6rem',
            border: '1px solid var(--cyan)', color: 'var(--cyan)',
            letterSpacing: '0.08em',
          }}>
            ● Current
          </span>
        )}
        {item.tags.map(tag => (
          <span key={tag} style={{
            fontFamily: 'var(--mono)', fontSize: '0.58rem',
            padding: '0.2rem 0.6rem',
            border: '1px solid var(--border)', color: 'var(--muted)',
            letterSpacing: '0.06em',
          }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Experience() {
  const { ref, visible } = useReveal();

  return (
    <SectionWrapper id="experience" bg="var(--bg)">
      <SectionLabel>// 03 — experience.log</SectionLabel>
      <SectionTitle>Experience</SectionTitle>
      <div
        ref={ref}
        style={{
          position: 'relative', paddingLeft: '1.5rem',
          borderLeft: '1px solid',
          borderImage: 'linear-gradient(180deg, var(--cyan), var(--blue2), transparent) 1',
        }}
      >
        {experience.map((item, i) => (
          <ExpItem key={item.company} item={item} index={i} visible={visible} />
        ))}
      </div>
    </SectionWrapper>
  );
}
