import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const links = ['About', 'Skills', 'Experience', 'Education', 'Projects', 'Contact'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.1rem 3rem',
        background: scrolled ? 'rgba(2,11,24,0.92)' : 'rgba(2,11,24,0.7)',
        backdropFilter: 'blur(14px)',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'background 0.4s, border-color 0.4s',
      }}
    >
      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.82rem', color: 'var(--cyan)', letterSpacing: '0.12em' }}>
        DKM <span style={{ color: 'var(--muted)' }}>// data_scientist.py</span>
      </div>
      <div style={{ display: 'flex', gap: '1.4rem', flexWrap: 'wrap' }}>
        {links.map((link) => (
          <button
            key={link}
            className="nav-link"
            onClick={() => scrollTo(link)}
            style={{
              fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--muted)',
              background: 'none', border: 'none', cursor: 'none',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              transition: 'color 0.2s', padding: '0.2rem 0',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--cyan)'}
            onMouseLeave={e => e.target.style.color = 'var(--muted)'}
          >
            {link}
          </button>
        ))}
      </div>
    </motion.nav>
  );
}
