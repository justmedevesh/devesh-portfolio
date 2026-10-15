'use client';

import TiltCard from './TiltCard';
import { FolderIcon } from './Icons';

export default function ProjectCard({ project, index = 0, visible = true }) {
  return (
    <div className={`reveal ${visible ? 'is-visible' : ''}`} style={{ '--d': `${index * 110}ms`, height: '100%' }}>
      <TiltCard className={`glass-card project-card ${project.featured ? 'featured' : ''}`}>
        <div className="card-top pop-sm">
          <div className="card-icon"><FolderIcon /></div>
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
