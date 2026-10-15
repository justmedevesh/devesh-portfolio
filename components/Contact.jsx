'use client';

import { useEffect, useState } from 'react';
import SectionWrapper, { SectionHead } from './SectionWrapper';
import TiltCard from './TiltCard';
import Reveal from './Reveal';
import { personal } from '../data/portfolio';
import { TerminalIcon, SOCIAL_PLATFORMS, socialIcon } from './Icons';
import { getSocials, DEFAULT_SOCIALS } from '../data/socialStore';

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

/** "https://github.com/x" → "github.com/x", "mailto:a@b.c" → "a@b.c" */
const prettyUrl = (url) => url.replace(/^(https?:\/\/(www\.)?|mailto:|tel:)/i, '').replace(/\/$/, '');

export default function Contact() {
  const [socials, setSocials] = useState(DEFAULT_SOCIALS);

  useEffect(() => {
    getSocials().then(setSocials).catch(() => {});
  }, []);

  return (
    <SectionWrapper id="contact" title="ssh devesh@contact" app="Terminal" Icon={TerminalIcon}>
      <SectionHead index="08" label="contact" title={<>Let&apos;s build something <span className="grad-text">intelligent.</span></>} />

      <div className="contact-grid">
        <div className="contact-list">
          <ContactItem icon="☎" label="Phone" delay={0}>
            {personal.phone.map((p) => (
              <div key={p}><a href={`tel:${p.replace(/[^+\d]/g, '')}`}>{p}</a></div>
            ))}
          </ContactItem>
          {socials.map((link, i) => {
            const Icon = socialIcon(link.platform);
            const external = /^https?:/i.test(link.url);
            return (
              <ContactItem
                key={link.id || link.url}
                icon={<span style={{ width: 20, height: 20, display: 'block' }}><Icon /></span>}
                label={link.label || SOCIAL_PLATFORMS[link.platform]?.label || 'Link'}
                delay={80 + i * 80}
              >
                <a href={link.url} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
                  {prettyUrl(link.url)}
                </a>
              </ContactItem>
            );
          })}
          <ContactItem icon="◎" label="Location" delay={80 + socials.length * 80}>
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
