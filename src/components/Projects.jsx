import { useState, useEffect } from 'react';
import SectionWrapper, { SectionLabel, SectionTitle } from './SectionWrapper';
import { useReveal } from './useReveal';
import { getAllProjects } from '../data/projectStore';

function ProjectCard({ project, index, visible }) {
  const isFeatured = project.featured;

  return (
    <div
      className="project-card"
      style={{
        background: 'var(--card)',
        border: `1px solid ${isFeatured ? 'var(--cyan)' : 'var(--border)'}`,
        borderRadius: 0,
        padding: '1.8rem 1.6rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.9rem',
        position: 'relative',
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(28px)',
        transition: `opacity 0.6s ${index * 0.12}s, transform 0.6s ${index * 0.12}s, border-color 0.3s, box-shadow 0.3s`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--cyan)';
        e.currentTarget.style.boxShadow = '0 0 30px rgba(0,229,255,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isFeatured
          ? 'var(--cyan)'
          : 'var(--border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Featured indicator */}
      {isFeatured && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background:
              'linear-gradient(90deg, var(--cyan), var(--blue), transparent)',
          }}
        />
      )}

      {/* Header row: folder icon + links */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '1.6rem', opacity: 0.7 }}>📂</span>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '0.62rem',
                color: 'var(--muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--cyan)')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--muted)')}
            >
              GitHub ↗
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '0.62rem',
                color: 'var(--cyan)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--neon)')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--cyan)')}
            >
              Live ↗
            </a>
          )}
        </div>
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          lineHeight: 1.3,
          color: 'var(--text)',
        }}
      >
        {project.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: 'var(--mono)',
          fontSize: '0.72rem',
          color: 'var(--muted)',
          lineHeight: 1.85,
          flex: 1,
        }}
      >
        {project.description}
      </p>

      {/* Tags */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.4rem',
          marginTop: 'auto',
        }}
      >
        {project.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.56rem',
              padding: '0.2rem 0.55rem',
              border: '1px solid var(--border)',
              color: 'var(--muted)',
              letterSpacing: '0.06em',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Projects() {
  const { ref, visible } = useReveal();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Initial fetch from Firestore
    getAllProjects().then(setProjects).catch(console.error);

    // Re-fetch when storage changes (e.g. from admin in another tab)
    function onStorage() {
      getAllProjects().then(setProjects).catch(console.error);
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <SectionWrapper id="projects" bg="var(--bg2)">
      <SectionLabel>// 05 — projects.dir</SectionLabel>
      <SectionTitle>Projects</SectionTitle>
      <div
        ref={ref}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id || project.title}
            project={project}
            index={i}
            visible={visible}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
