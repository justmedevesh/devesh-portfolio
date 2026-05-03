import SectionWrapper, { SectionLabel, SectionTitle } from './SectionWrapper';
import { useReveal } from './useReveal';
import { education } from '../data/portfolio';

function EduCard({ item, index, visible }) {
  return (
    <div
      className="edu-card"
      style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        padding: '1.6rem', position: 'relative',
        transition: `border-color 0.3s, transform 0.2s, opacity 0.6s ${index * 0.12}s, box-shadow 0.3s`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(20px)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--cyan)';
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,229,255,0.08)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, var(--blue2), var(--cyan))',
      }} />

      <div style={{
        fontFamily: 'var(--mono)', fontSize: '0.62rem',
        color: 'var(--cyan)', letterSpacing: '0.12em',
        textTransform: 'uppercase', marginBottom: '0.5rem',
      }}>
        {item.degree}
      </div>

      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem', lineHeight: 1.3 }}>
        {item.school}
      </h3>

      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>
        {item.period}
      </div>

      {item.current && (
        <div style={{
          marginTop: '0.7rem', fontFamily: 'var(--mono)',
          fontSize: '0.62rem', color: 'var(--neon)',
        }}>
          ● IN PROGRESS
        </div>
      )}
    </div>
  );
}

export default function Education() {
  const { ref, visible } = useReveal();

  return (
    <SectionWrapper id="education" bg="var(--bg2)">
      <SectionLabel>// 04 — education.csv</SectionLabel>
      <SectionTitle>Education</SectionTitle>
      <div
        ref={ref}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1.4rem',
        }}
      >
        {education.map((item, i) => (
          <EduCard key={item.school} item={item} index={i} visible={visible} />
        ))}
      </div>
    </SectionWrapper>
  );
}
