export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg2)',
      borderTop: '1px solid var(--border)',
      padding: '1.8rem 3rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
      zIndex: 2,
    }}>
      <p style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>
        © 2026 <span style={{ color: 'var(--cyan)' }}>Devesh Kumar Mandal</span> — Data Scientist
      </p>
      <p style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>
        Built with <span style={{ color: 'var(--cyan)' }}>⬡</span> data &amp; deep space aesthetics
      </p>
    </footer>
  );
}
