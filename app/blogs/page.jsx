export const dynamic = 'force-dynamic';

// Server component — metadata exported here
export const metadata = {
  title: 'Blog',
  description: 'Read blog posts by Devesh Kumar Mandal on data science, machine learning, and Python.',
};

import BlogsClient from './BlogsClient';

export default function BlogsPage() {
  return <BlogsClient />;
}
