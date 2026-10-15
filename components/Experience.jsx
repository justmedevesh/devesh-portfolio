'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import SectionWrapper, { SectionHead } from './SectionWrapper';
import TiltCard from './TiltCard';
import Reveal from './Reveal';
import { getDisplayExperiences } from '../data/experienceStore';
import { BriefcaseIcon } from './Icons';

function ExpItem({ item, index }) {
  return (
    <Reveal className="exp-item" delay={index * 120}>
      <div className={`exp-node ${item.current ? 'current' : ''}`} />
      <TiltCard className="glass-card exp-card" max={4}>
        <div className="pop-sm">
          <div className="exp-meta">
            <span className="exp-period">{item.period} · {item.duration}</span>
            {item.current && <span className="chip chip-hot">● Current</span>}
          </div>
          <h3 className="exp-role">{item.role}</h3>
          <div className="exp-company">
            <strong>{item.company}</strong> · {item.type} · {item.location}
          </div>
          <p className="exp-desc">{item.description}</p>
          {(item.tags || []).length > 0 && (
            <div className="tag-row">
              {item.tags.map((tag) => <span key={tag} className="chip">{tag}</span>)}
            </div>
          )}
        </div>
      </TiltCard>
    </Reveal>
  );
}

export default function Experience() {
  const [experience, setExperience] = useState([]);
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start 75%', 'end 60%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    getDisplayExperiences().then(setExperience);
  }, []);

  return (
    <SectionWrapper id="experience" title="experience.log" app="Logs" Icon={BriefcaseIcon}>
      <SectionHead index="03" label="experience" title={<>Where I&apos;ve <span className="grad-text">shipped.</span></>} />
      <div ref={timelineRef} className="timeline">
        <div className="timeline-track">
          <motion.div className="timeline-fill" style={{ scaleY }} />
        </div>
        {experience.map((item, i) => (
          <ExpItem key={item.id || item.company} item={item} index={i} />
        ))}
      </div>
    </SectionWrapper>
  );
}
