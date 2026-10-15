'use client';

import TiltCard from './TiltCard';

function ChipIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
      <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
    </svg>
  );
}

export default function ProjectCard({ project, index = 0, visible = true }) {
  return (
    <div className={`reveal ${visible ? 'is-visible' : ''}`} style={{ '--d': `${index * 110}ms`, height: '100%' }}>
      <TiltCard className={`glass-card project-card ${project.featured ? 'featured' : ''}`}>
        <div className="card-top pop-sm">
          <div className="card-icon"><ChipIcon /></div>
          <div className="card-links">
            {project.featured && <span className="chip chip-cyan">★ Featured</span>}
            {project.github && (
              <a className="card-link" href={project.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            )}
            {project.live && (
              <a className="card-link" href={project.live} target="_blank" rel="noopener noreferrer">Live ↗</a>
            )}
          </div>
        </div>
        <h3 className="card-title pop-sm">{project.title}</h3>
        <p className="card-desc">{project.description}</p>
        <div className="card-tags">
          {(project.tags || []).map((tag) => <span key={tag} className="chip">{tag}</span>)}
        </div>
      </TiltCard>
    </div>
  );
}
