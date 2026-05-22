export const dynamic = 'force-dynamic';

// Server component — metadata is allowed here
export const metadata = {
  title: 'All Projects',
  description: 'Explore all data science and machine learning projects by Devesh Kumar Mandal.',
};

import ProjectsClient from './ProjectsClient';

export default function ProjectsPage() {
  return <ProjectsClient />;
}
