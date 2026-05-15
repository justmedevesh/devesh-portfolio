import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SectionWrapper, { SectionLabel, SectionTitle } from './SectionWrapper';
import { useReveal } from './useReveal';
import { getAllProjects } from '../data/projectStore';
import ProjectCard from './ProjectCard';

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
        className="projects-grid"
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

      <div className="projects-view-all">
        <Link to="/projects" className="view-all-btn">
          Load More →
        </Link>
      </div>
    </SectionWrapper>
  );
}
