'use client';

import { useEffect, useState } from 'react';
import SectionWrapper, { SectionHead } from './SectionWrapper';
import TiltCard from './TiltCard';
import Reveal from './Reveal';
import { getDisplayEducation } from '../data/educationStore';

function EduCard({ item, index }) {
  return (
    <Reveal delay={index * 100} style={{ height: '100%' }}>
      <TiltCard className="glass-card edu-card" max={10}>
        <div className="edu-idx">0x{String(index + 1).padStart(2, '0')}</div>
        <div className="edu-degree pop-sm">{item.degree}</div>
        <h3 className="edu-school pop-sm">{item.school}</h3>
        <div className="edu-period">
          {item.period}
          {item.current && <span className="chip chip-hot" style={{ marginLeft: '0.6rem' }}>● In progress</span>}
        </div>
      </TiltCard>
    </Reveal>
  );
}

export default function Education() {
  const [education, setEducation] = useState([]);

  useEffect(() => {
    getDisplayEducation().then(setEducation);
  }, []);

  return (
    <SectionWrapper id="education">
      <SectionHead index="04" label="education.csv" title={<>Training <span className="grad-text">data.</span></>} />
      <div className="edu-grid">
        {education.map((item, i) => (
          <EduCard key={item.id || item.school} item={item} index={i} />
        ))}
      </div>
    </SectionWrapper>
  );
}
