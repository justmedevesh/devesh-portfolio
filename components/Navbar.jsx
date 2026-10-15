'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { personal } from '../data/portfolio';
import { useTheme } from './useTheme';
import {
  HomeIcon, UserIcon, MonitorIcon, BriefcaseIcon, CapIcon, AwardIcon, FolderIcon,
  DocIcon, MailIcon, GridIcon, GithubIcon, LinkedinIcon, SunIcon, MoonIcon,
  WifiIcon, VolumeIcon, PowerIcon,
} from './Icons';

// `core` apps stay in the dock on phones; the rest live in the app grid
export const APPS = [
  { id: 'hero', label: 'Home', Icon: HomeIcon, core: true },
  { id: 'about', label: 'About', Icon: UserIcon, core: true },
  { id: 'skills', label: 'Skills', Icon: MonitorIcon },
  { id: 'experience', label: 'Experience', Icon: BriefcaseIcon },
  { id: 'education', label: 'Education', Icon: CapIcon },
  { id: 'certificates', label: 'Certificates', Icon: AwardIcon },
  { id: 'projects', label: 'Projects', Icon: FolderIcon, core: true },
  { id: 'blog', label: 'Blog', Icon: DocIcon },
  { id: 'contact', label: 'Contact', Icon: MailIcon, core: true },
];

/** GNOME-style "Wed Oct 15 14:32" in Kathmandu time. */
function Clock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kathmandu', weekday: 'short', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: false,
    });
    const update = () => setTime(fmt.format(new Date()).replace(/,/g, ''));
    update();
    const t = setInterval(update, 10_000);
    return () => clearInterval(t);
  }, []);
  return <div className="topbar-center">{time || ' '}</div>;
}

function DockItem({ app, active, onClick }) {
  const { Icon } = app;
  return (
    <button
      className={`dock-item ${active ? 'active' : ''} ${app.core ? '' : 'dock-hide-sm'}`}
      onClick={onClick}
      aria-label={app.label}
    >
      <span className="dock-tile"><Icon /></span>
      <span className="dock-label">{app.label}</span>
    </button>
  );
}

export default function Navbar() {
  const [gridOpen, setGridOpen] = useState(false);
  const [active, setActive] = useState('hero');
  const { theme, toggle } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  // Highlight the window currently in the middle of the viewport
  useEffect(() => {
    if (pathname !== '/') {
      setActive(pathname.startsWith('/blog') ? 'blog' : pathname.startsWith('/projects') ? 'projects' : '');
      return;
    }
    const sections = APPS.map((a) => document.getElementById(a.id)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [pathname]);

  // Close the app grid with Escape
  useEffect(() => {
    if (!gridOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setGridOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [gridOpen]);

  const open = (id) => {
    setGridOpen(false);
    // If we're not on the homepage, navigate home first then scroll
    if (pathname !== '/') {
      sessionStorage.setItem('scrollTo', id);
      router.push('/');
    } else if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
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
      {/* ── Top bar ── */}
      <header className="topbar">
        <div>
          <button className="topbar-btn" onClick={() => setGridOpen((o) => !o)} aria-label="Activities">
            <span className="ws-dots"><i /><i /><i /></span>
          </button>
        </div>
        <Clock />
        <div className="topbar-right">
          <button
            className="topbar-btn"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            <span className="tray">{theme === 'dark' ? <SunIcon /> : <MoonIcon />}</span>
          </button>
          <span className="topbar-btn" aria-hidden="true" style={{ cursor: 'default' }}>
            <span className="tray">
              <span className="tray tray-extra"><WifiIcon /><VolumeIcon /></span>
              <PowerIcon />
            </span>
          </span>
        </div>
      </header>

      {/* ── Dock ── */}
      <motion.nav
        className="dock"
        aria-label="Sections"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="dock-apps">
          {APPS.map((app) => (
            <DockItem key={app.id} app={app} active={active === app.id} onClick={() => open(app.id)} />
          ))}
        </div>
        <span className="dock-sep" />
        <a className="dock-item dock-ext" href={personal.github} target="_blank" rel="noreferrer" aria-label="GitHub">
          <span className="dock-tile"><GithubIcon /></span>
          <span className="dock-label">GitHub</span>
        </a>
        <a className="dock-item dock-ext" href={personal.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
          <span className="dock-tile"><LinkedinIcon /></span>
          <span className="dock-label">LinkedIn</span>
        </a>
        <span className="dock-spacer" />
        <button className="dock-item" onClick={() => setGridOpen((o) => !o)} aria-label="Show applications">
          <span className="dock-tile" style={{ background: 'none', border: 'none', boxShadow: 'none' }}><GridIcon /></span>
          <span className="dock-label">Show Applications</span>
        </button>
      </motion.nav>

      {/* ── App grid (Activities / Show Applications) ── */}
      <AnimatePresence>
        {gridOpen && (
          <motion.div
            className="app-grid"
            onClick={() => setGridOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="app-grid-inner" onClick={(e) => e.stopPropagation()}>
              {APPS.map((app, i) => (
                <motion.button
                  key={app.id}
                  className="app-grid-item"
                  onClick={() => open(app.id)}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="dock-tile"><app.Icon /></span>
                  {app.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
