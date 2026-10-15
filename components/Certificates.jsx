'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionWrapper, { SectionHead } from './SectionWrapper';
import TiltCard from './TiltCard';
import { useReveal } from './useReveal';
import { getCertificates } from '../data/certificateStore';

const block = (e) => e.preventDefault();

/**
 * Watermarked preview image. Right-click / drag are disabled and a transparent
 * shield sits on top — the original certificate file is never sent to visitors.
 */
function Preview({ src, alt, className }) {
  return (
    <div className={`cert-preview ${className || ''}`} onContextMenu={block} onDragStart={block}>
      <img src={src} alt={alt} draggable={false} />
      <span className="cert-shield" />
    </div>
  );
}

function BadgeIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="9" r="6" />
      <path d="M9 14.5 7.5 22l4.5-2.5 4.5 2.5L15 14.5" />
      <path d="m9.5 9 1.7 1.7L14.5 7.5" />
    </svg>
  );
}

function CertCard({ cert, index, visible, onOpen }) {
  return (
    <div className={`reveal ${visible ? 'is-visible' : ''}`} style={{ '--d': `${index * 110}ms`, height: '100%' }}>
      <TiltCard className="glass-card cert-card" max={7}>
        {cert.preview ? (
          <button className="cert-thumb" onClick={() => onOpen(cert)} aria-label={`View ${cert.title}`}>
            <Preview src={cert.preview} alt={cert.title} />
            <span className="cert-zoom">View ↗</span>
          </button>
        ) : (
          <div className="cert-thumb cert-thumb-empty"><BadgeIcon /></div>
        )}
        <div className="cert-body">
          <div className="blog-meta">
            {cert.issuer}{cert.issueDate && ` · ${cert.issueDate}`}
          </div>
          <h3 className="card-title pop-sm">{cert.title}</h3>
          {cert.credentialId && <div className="cert-id">ID: {cert.credentialId}</div>}
          {cert.skills?.length > 0 && (
            <div className="card-tags">
              {cert.skills.map((s) => <span key={s} className="chip">{s}</span>)}
            </div>
          )}
          {cert.credentialUrl && (
            <a className="card-cta" href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
              Verify credential <span className="arrow">↗</span>
            </a>
          )}
        </div>
      </TiltCard>
    </div>
  );
}

function Lightbox({ cert, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      className="cert-lightbox"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="cert-lightbox-inner"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.92, rotateX: 12, y: 20 }}
        animate={{ scale: 1, rotateX: 0, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <Preview src={cert.preview} alt={cert.title} className="large" />
        <div className="cert-lightbox-bar">
          <div>
            <div className="card-title">{cert.title}</div>
            <div className="blog-meta">{cert.issuer}{cert.issueDate && ` · ${cert.issueDate}`}</div>
          </div>
          <button className="btn btn-ghost" onClick={onClose}>Close ✕</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Certificates() {
  const { ref, visible } = useReveal(0.05);
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    getCertificates().then(setCerts).finally(() => setLoading(false));
  }, []);

  return (
    <SectionWrapper id="certificates">
      <SectionHead index="05" label="certificates.pem" title={<>Verified <span className="grad-text">upgrades.</span></>} />
      <div ref={ref}>
        {loading ? (
          <div className="projects-grid">
            {[1, 2, 3].map((i) => <div key={i} className="skeleton" />)}
          </div>
        ) : certs.length === 0 ? (
          <p className="empty-state">{'// certificates are being verified — check back soon'}</p>
        ) : (
          <div className="projects-grid">
            {certs.map((cert, i) => (
              <CertCard key={cert.id} cert={cert} index={i} visible={visible} onOpen={setOpen} />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {open && <Lightbox cert={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </SectionWrapper>
  );
}
