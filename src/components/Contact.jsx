import SectionWrapper, { SectionLabel, SectionTitle } from './SectionWrapper';
import { useReveal } from './useReveal';
import { personal } from '../data/portfolio';

function GlobeSVG() {
  return (
    <svg
      width="140" height="140" viewBox="0 0 140 140"
      style={{ animation: 'float 4s ease-in-out infinite' }}
    >
      <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(0,229,255,0.15)" strokeWidth="1" />
      <ellipse cx="70" cy="70" rx="30" ry="60" fill="none" stroke="rgba(0,229,255,0.2)" strokeWidth="1" />
      <ellipse cx="70" cy="70" rx="60" ry="20" fill="none" stroke="rgba(0,229,255,0.2)" strokeWidth="1" />
      <ellipse cx="70" cy="70" rx="60" ry="40" fill="none" stroke="rgba(0,229,255,0.1)" strokeWidth="1" />
      <circle cx="70" cy="70" r="4" fill="#00e5ff" opacity="0.85" />
      <circle cx="70" cy="70" r="9" fill="none" stroke="#00e5ff" strokeWidth="1" opacity="0.35" />
      <line x1="70" y1="10" x2="70" y2="130" stroke="rgba(0,229,255,0.12)" strokeWidth="1" />
      <line x1="10" y1="70" x2="130" y2="70" stroke="rgba(0,229,255,0.12)" strokeWidth="1" />
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
    </svg>
  );
}

function ContactItem({ icon, label, children }) {
  return (
    <div
      className="contact-item"
      style={{
        display: 'flex', alignItems: 'center', gap: '1rem',
        marginBottom: '1rem', padding: '1rem 1.2rem',
        background: 'var(--card)', border: '1px solid var(--border)',
        transition: 'border-color 0.3s, transform 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--cyan)';
        e.currentTarget.style.transform = 'translateX(4px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.transform = 'none';
      }}
    >
      <div style={{ fontSize: '1.1rem', width: '2.2rem', textAlign: 'center' }}>{icon}</div>
      <div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {label}
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--text)', marginTop: '0.15rem' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Contact() {
  const { ref, visible } = useReveal();

  return (
    <SectionWrapper id="contact" bg="var(--bg)" style={{ minHeight: '70vh' }}>
      <SectionLabel>// 05 — contact.sh</SectionLabel>
      <SectionTitle>Get In Touch</SectionTitle>
      <div
        ref={ref}
        style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem',
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateY(30px)',
          transition: 'opacity 0.7s, transform 0.7s',
        }}
      >
        <div>
          <ContactItem icon="📱" label="Phone">
            <div>{personal.phone[0]}</div>
            <div>{personal.phone[1]}</div>
          </ContactItem>
          <ContactItem icon="⌥" label="GitHub">
            <a href={personal.github} target="_blank" rel="noreferrer">
              github.com/justmedevesh
            </a>
          </ContactItem>
          <ContactItem icon="◈" label="LinkedIn">
            <a href={personal.linkedin} target="_blank" rel="noreferrer">
              devesh-kumar-mandal
            </a>
          </ContactItem>
          <ContactItem icon="◎" label="Location">
            {personal.location}
          </ContactItem>
        </div>

        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          padding: '2.5rem', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '1.2rem',
          minHeight: 220,
        }}>
          <GlobeSVG />
          <div style={{
            fontFamily: 'var(--mono)', fontSize: '0.68rem',
            color: 'var(--muted)', textAlign: 'center', lineHeight: 1.9,
          }}>
            <span style={{ color: 'var(--cyan)' }}>$ ping devesh</span><br />
            Latency: near-zero<br />
            Availability: <span style={{ color: 'var(--neon)' }}>online</span><br />
            Status: <span style={{ color: 'var(--cyan)' }}>open to opportunities</span>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
