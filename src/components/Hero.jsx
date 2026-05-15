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
      className="orbital-rings"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 1 }}
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
    <section id="hero" className="hero-section">
      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />

      <motion.div {...fadeUp(0.3)} className="hero-init-text">
        ⬡ Initializing portfolio... [ready]
      </motion.div>

      <motion.h1 {...fadeUp(0.5)} className="hero-title">
        {personal.name.split(' ').slice(0, 2).join(' ')}<br />
        <span style={{ color: 'var(--cyan)' }}>{personal.name.split(' ').slice(2).join(' ')}</span>
      </motion.h1>

      <motion.p {...fadeUp(0.7)} className="hero-tagline">
        <span style={{ color: 'var(--cyan)' }}>{personal.title}</span>&nbsp;&nbsp;//&nbsp;
        {personal.tagline}
      </motion.p>

      <motion.div {...fadeUp(0.9)} className="hero-buttons">
        <button
          className="hero-btn-primary"
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Get In Touch
        </button>
        <button
          className="hero-btn-outline"
          onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}
        >
          View Work
        </button>
      </motion.div>

      {/* Stats row */}
      <motion.div {...fadeUp(1.1)} className="hero-stats">
        {personal.stats.map((s) => (
          <div key={s.label} className="hero-stat-item">
            <div className="hero-stat-num">{s.num}</div>
            <div className="hero-stat-label">{s.label}</div>
          </div>
        ))}
      </motion.div>

      <OrbitalRings />
    </section>
  );
}
