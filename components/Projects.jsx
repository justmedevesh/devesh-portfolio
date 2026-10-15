'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SectionWrapper, { SectionHead } from './SectionWrapper';
import { useReveal } from './useReveal';
import { getAllProjects } from '../data/projectStore';
import ProjectCard from './ProjectCard';

export default function Projects() {
  const { ref, visible } = useReveal(0.05);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () =>
      getAllProjects().then(setProjects).catch(console.error).finally(() => setLoading(false));
    load();

    // Re-fetch when storage changes (e.g. from admin in another tab)
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  return (
    <SectionWrapper id="projects">
      <SectionHead index="05" label="projects.dir" title={<>Things I&apos;ve <span className="grad-text">built.</span></>} />

      <div ref={ref}>
      {loading ? (
        <div className="projects-grid">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton" />)}
        </div>
      ) : projects.length === 0 ? (
        <p className="empty-state">{'// compiling new projects — check back soon'}</p>
      ) : (
        <div className="projects-grid">
          {projects.map((project, i) => (
            <ProjectCard key={project.id || project.title} project={project} index={i} visible={visible} />
          ))}
        </div>
      )}
      </div>

      <div className="projects-view-all">
        <Link href="/projects" className="btn btn-ghost">
          View all projects <span className="arrow">→</span>
        </Link>
      </div>
    </SectionWrapper>
  );
}
