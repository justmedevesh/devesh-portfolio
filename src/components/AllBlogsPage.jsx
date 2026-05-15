import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPublishedBlogs } from '../data/blogStore';
import BlogCard from './BlogCard';
import NeuralCanvas from './NeuralCanvas';
import Navbar from './Navbar';

export default function AllBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getPublishedBlogs().then(setBlogs).catch(console.error);
    window.scrollTo(0, 0);
  }, []);

  // Collect all unique tags
  const allTags = [...new Set(blogs.flatMap((b) => b.tags || []))].sort();

  // Filter blogs
  const filtered =
    filter === 'all'
      ? blogs
      : filter === 'featured'
        ? blogs.filter((b) => b.featured)
        : blogs.filter((b) => b.tags?.includes(filter));

  return (
    <>
      <NeuralCanvas />
      <Navbar />
      <div className="all-projects-page">
        {/* Header */}
        <motion.div
          className="all-projects-header"
          style={{ paddingTop: '6rem' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="all-projects-label">// all_blogs.md</div>
          <h1 className="all-projects-title">All Blog Posts</h1>
          <p className="all-projects-subtitle">
            <span className="all-projects-count">{blogs.length}</span> posts published
            &nbsp;·&nbsp;
            showing <span className="all-projects-count">{filtered.length}</span>
          </p>
        </motion.div>

        {/* Filter tags */}
        <motion.div
          className="all-projects-filters"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button
            className={`filter-tag ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-tag ${filter === 'featured' ? 'active' : ''}`}
            onClick={() => setFilter('featured')}
          >
            ⭐ Featured
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`filter-tag ${filter === tag ? 'active' : ''}`}
              onClick={() => setFilter(filter === tag ? 'all' : tag)}
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {/* Blog grid */}
        <div className="projects-grid all-projects-grid">
          {filtered.map((blog, i) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <BlogCard blog={blog} index={i} visible={true} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="all-projects-empty">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.5 }}>📭</div>
            <h3>No blog posts match this filter</h3>
            <p>Try selecting a different tag or view all posts.</p>
            <button className="filter-tag active" onClick={() => setFilter('all')} style={{ marginTop: '1rem' }}>
              Show All
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="all-projects-footer">
          <p>
            © 2026 <span style={{ color: 'var(--cyan)' }}>Devesh Kumar Mandal</span> — Data Scientist
          </p>
        </div>
      </div>
    </>
  );
}
