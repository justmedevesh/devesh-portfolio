'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import SectionWrapper, { SectionLabel, SectionTitle } from './SectionWrapper';
import { getPublishedBlogs } from '../data/blogStore';
import BlogCard from './BlogCard';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    getPublishedBlogs()
      .then(setBlogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Set up IntersectionObserver AFTER blogs load and DOM updates
  useEffect(() => {
    if (blogs.length === 0 || !ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [blogs.length]);

  return (
    <SectionWrapper id="blog" bg="var(--bg)">
      <SectionLabel>// 06 — blog.md</SectionLabel>
      <SectionTitle>Blog</SectionTitle>

      {loading ? (
        /* Loading skeleton */
        <div className="projects-grid">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                height: 280,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            >
              <span style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.15em' }}>
                loading...
              </span>
            </div>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        /* No blogs published yet */
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div style={{ fontSize: '2rem', opacity: 0.4, marginBottom: '0.8rem' }}>📝</div>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--muted)' }}>
            No blog posts published yet. Check back soon!
          </p>
        </div>
      ) : (
        /* Blog cards */
        <div ref={ref} className="projects-grid">
          {blogs.map((blog, i) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              index={i}
              visible={visible}
            />
          ))}
        </div>
      )}

      <div className="projects-view-all">
        <Link href="/blogs" className="view-all-btn">
          Load More →
        </Link>
      </div>
    </SectionWrapper>
  );
}

