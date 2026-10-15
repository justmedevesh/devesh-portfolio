'use client';

import SectionWrapper, { SectionHead } from './SectionWrapper';
import TiltCard from './TiltCard';
import Reveal from './Reveal';
import { personal } from '../data/portfolio';

/** Pure-CSS 3D wireframe globe: meridians rotated around Y, latitudes stacked on Z. */
function Globe() {
  const meridians = [0, 30, 60, 90, 120, 150];
  const latitudes = [-60, -30, 0, 30, 60];
  return (
    <div className="globe" aria-hidden="true">
      <div className="globe-spin">
        {meridians.map((deg) => (
          <div key={deg} className="globe-ring" style={{ transform: `rotateY(${deg}deg)` }} />
        ))}
        {latitudes.map((lat) => {
          const size = Math.cos((lat * Math.PI) / 180) * 190;
          const y = Math.sin((lat * Math.PI) / 180) * 95;
          return (
            <div
              key={lat}
              className="globe-lat"
              style={{
                width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2,
                transform: `translateY(${-y}px) rotateX(90deg)`,
              }}
            />
          );
        })}
      </div>
      <div className="globe-core" />
    </div>
  );
}

function ContactItem({ icon, label, children, delay }) {
  return (
    <Reveal delay={delay}>
      <TiltCard className="glass-card contact-item" max={6}>
        <div className="contact-icon">{icon}</div>
        <div>
          <div className="contact-label">{label}</div>
          <div className="contact-value">{children}</div>
        </div>
      </TiltCard>
    </Reveal>
  );
}

export default function Contact() {
  return (
    <SectionWrapper id="contact">
      <SectionHead index="07" label="contact.sh" title={<>Let&apos;s build something <span className="grad-text">intelligent.</span></>} />

      <div className="contact-grid">
        <div className="contact-list">
          <ContactItem icon="☎" label="Phone" delay={0}>
            {personal.phone.map((p) => (
              <div key={p}><a href={`tel:${p.replace(/[^+\d]/g, '')}`}>{p}</a></div>
            ))}
          </ContactItem>
          <ContactItem icon="⌥" label="GitHub" delay={80}>
            <a href={personal.github} target="_blank" rel="noreferrer">github.com/justmedevesh</a>
          </ContactItem>
          <ContactItem icon="in" label="LinkedIn" delay={160}>
            <a href={personal.linkedin} target="_blank" rel="noreferrer">devesh-kumar-mandal</a>
          </ContactItem>
          <ContactItem icon="◎" label="Location" delay={240}>
            {personal.location}
          </ContactItem>
        </div>

        <Reveal delay={200} style={{ height: '100%' }}>
          <TiltCard className="glass-card ping-card" max={6} style={{ height: '100%' }}>
            <Globe />
            <div className="ping-readout pop-sm">
              <span className="c">$ ping devesh.np</span><br />
              64 bytes from kathmandu: time=<span className="c">0.42ms</span><br />
              availability: <span className="hot">online</span><br />
              status: <span className="c">open to opportunities</span>
            </div>
          </TiltCard>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
