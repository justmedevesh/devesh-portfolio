export default function SectionWrapper({ id, bg, children, style = {} }) {
  return (
    <section
      id={id}
      style={{
        position: 'relative',
        zIndex: 2,
        minHeight: '100vh',
        background: bg || 'var(--bg)',
        ...style,
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '7rem 3rem' }}>
        {children}
      </div>
    </section>
  );
}

export function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: 'var(--mono)', fontSize: '0.68rem',
      color: 'var(--cyan)', letterSpacing: '0.25em',
      textTransform: 'uppercase', marginBottom: '0.6rem',
    }}>
      {children}
    </div>
  );
}

export function SectionTitle({ children }) {
  return (
    <h2 style={{
      fontSize: 'clamp(1.8rem, 4vw, 3rem)',
      fontWeight: 800, marginBottom: '3rem', lineHeight: 1.1,
    }}>
      {children}
    </h2>
  );
}
