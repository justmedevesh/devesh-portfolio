'use client';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p>© {new Date().getFullYear()} <span>Devesh Kumar Mandal</span> — Data Scientist</p>
        <p>Built with Next.js, Three.js &amp; an unreasonable amount of coffee</p>
        <button className="footer-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
