'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const links = ['About', 'Skills', 'Experience', 'Education', 'Projects', 'Blog', 'Contact'];

/** Live Kathmandu time — a small "this machine is running" detail. */
function KtmClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kathmandu', hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="navbar-status">
      <span className="status-dot" /> KTM {time || '--:--:--'}
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 860) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Highlight the section currently in the middle of the viewport
  useEffect(() => {
    if (pathname !== '/') return;
    const sections = links.map((l) => document.getElementById(l.toLowerCase())).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [pathname]);

  const scrollTo = (id) => {
    setMenuOpen(false);
    // If we're not on the homepage, navigate home first then scroll
    if (pathname !== '/') {
      sessionStorage.setItem('scrollTo', id.toLowerCase());
      router.push('/');
    } else {
      document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle scroll-to after navigating back to homepage
  useEffect(() => {
    if (pathname === '/') {
      const target = sessionStorage.getItem('scrollTo');
      if (target) {
        sessionStorage.removeItem('scrollTo');
        setTimeout(() => {
          document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
        }, 400);
      }
    }
  }, [pathname]);

  return (
    <>
      <motion.nav
        className={`navbar ${scrolled || menuOpen ? 'scrolled' : ''}`}
        initial={{ y: -40, opacity: 0, x: '-50%' }}
        animate={{ y: 0, opacity: 1, x: '-50%' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          className="navbar-brand"
          onClick={() => { router.push('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          aria-label="Home"
        >
          <img src="/logo.png" alt="" />
          <span>DKM<span className="brand-caret">_</span> <span className="brand-sub">/ data_scientist</span></span>
        </button>

        <div className="navbar-links">
          {links.map((link) => (
            <button
              key={link}
              className={`nav-link ${active === link.toLowerCase() ? 'active' : ''}`}
              onClick={() => scrollTo(link)}
            >
              {link}
            </button>
          ))}
        </div>

        <KtmClock />

        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
        </button>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            {links.map((link, i) => (
              <motion.button
                key={link}
                className="mobile-menu-link"
                onClick={() => scrollTo(link)}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
              >
                <span className="mobile-link-index">0{i + 1}</span>
                {link}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
