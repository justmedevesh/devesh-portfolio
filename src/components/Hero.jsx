import { motion } from 'framer-motion';
import { personal } from '../data/portfolio';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: 'easeOut' },
});

function OrbitalRings() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 1 }}
      style={{
        position: 'absolute', right: '5rem', top: '50%',
        transform: 'translateY(-50%)', width: 320, height: 320,
      }}
    >
      {[
        { size: 320, border: 'rgba(0,229,255,0.18)', dur: '22s', normal: true },
        { size: 240, border: 'rgba(0,180,216,0.28)', dur: '15s', normal: false },
        { size: 160, border: 'rgba(0,229,255,0.5)', dur: '8s', normal: true },
      ].map((r, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: r.size, height: r.size,
            top: (320 - r.size) / 2, left: (320 - r.size) / 2,
            borderRadius: '50%',
            border: `1px solid ${r.border}`,
            animation: `spin ${r.dur} linear infinite ${r.normal ? '' : 'reverse'}`,
          }}
        >
          <div style={{
            position: 'absolute', top: -3, left: '50%',
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--cyan)',
            boxShadow: '0 0 10px var(--cyan)',
          }} />
        </div>
      ))}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        fontFamily: 'var(--mono)', fontSize: '0.58rem',
        color: 'var(--cyan)', textAlign: 'center', lineHeight: 2,
        opacity: 0.8,
      }}>
        model<br />training<br />⬡<br />predict<br />analyse
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        position: 'relative', zIndex: 2,
        minHeight: '100vh', display: 'flex',
        flexDirection: 'column', justifyContent: 'center',
        padding: '0 6rem',
      }}
    >
      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />

      <motion.div {...fadeUp(0.3)} style={{
        fontFamily: 'var(--mono)', fontSize: '0.72rem',
        color: 'var(--cyan)', letterSpacing: '0.22em',
        textTransform: 'uppercase', marginBottom: '1.4rem',
      }}>
        ⬡ Initializing portfolio... [ready]
      </motion.div>

      <motion.h1 {...fadeUp(0.5)} style={{
        fontSize: 'clamp(2.8rem, 7vw, 5.8rem)',
        fontWeight: 800, lineHeight: 1.05, marginBottom: '1rem',
      }}>
        {personal.name.split(' ').slice(0, 2).join(' ')}<br />
        <span style={{ color: 'var(--cyan)' }}>{personal.name.split(' ').slice(2).join(' ')}</span>
      </motion.h1>

      <motion.p {...fadeUp(0.7)} style={{
        fontFamily: 'var(--mono)', fontSize: '0.88rem',
        color: 'var(--muted)', maxWidth: 520, lineHeight: 1.9,
        marginBottom: '2.4rem',
      }}>
        <span style={{ color: 'var(--cyan)' }}>{personal.title}</span>&nbsp;&nbsp;//&nbsp;
        {personal.tagline}
      </motion.p>

      <motion.div {...fadeUp(0.9)} style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            fontFamily: 'var(--mono)', fontSize: '0.72rem',
            letterSpacing: '0.1em', padding: '0.85rem 2rem',
            background: 'var(--cyan)', color: 'var(--bg)',
            border: 'none', cursor: 'pointer', textTransform: 'uppercase',
            fontWeight: 700, transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 0 24px rgba(0,229,255,0.4)'; }}
          onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = 'none'; }}
        >
          Get In Touch
        </button>
        <button
          onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            fontFamily: 'var(--mono)', fontSize: '0.72rem',
            letterSpacing: '0.1em', padding: '0.85rem 2rem',
            background: 'transparent', color: 'var(--cyan)',
            border: '1px solid var(--cyan)', cursor: 'pointer',
            textTransform: 'uppercase', transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.target.style.background = 'rgba(0,229,255,0.08)'}
          onMouseLeave={e => e.target.style.background = 'transparent'}
        >
          View Work
        </button>
      </motion.div>

      {/* Stats row */}
      <motion.div
        {...fadeUp(1.1)}
        style={{
          position: 'absolute', bottom: '3rem', left: '6rem',
          display: 'flex', gap: '4rem',
        }}
      >
        {personal.stats.map((s) => (
          <div key={s.label} style={{ fontFamily: 'var(--mono)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--cyan)' }}>{s.num}</div>
            <div style={{ fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.2rem' }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      <OrbitalRings />
    </section>
  );
}
