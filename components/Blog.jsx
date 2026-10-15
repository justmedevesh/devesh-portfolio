'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import SectionWrapper, { SectionHead } from './SectionWrapper';
import { getPublishedBlogs } from '../data/blogStore';
import BlogCard from './BlogCard';
import { DocIcon } from './Icons';

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
      { threshold: 0.05 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [blogs.length]);

  return (
    <SectionWrapper id="blog" title="~/Documents/Blog" app="Files" Icon={DocIcon}>
      <SectionHead index="07" label="blog" title={<>Notes from the <span className="grad-text">lab.</span></>} />

      {loading ? (
        <div className="projects-grid">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton" />)}
        </div>
      ) : blogs.length === 0 ? (
        <p className="empty-state">{'// no posts published yet — the model is still writing'}</p>
      ) : (
        <div ref={ref} className="projects-grid">
          {blogs.map((blog, i) => (
            <BlogCard key={blog.id} blog={blog} index={i} visible={visible} />
          ))}
        </div>
      )}

      <div className="projects-view-all">
        <Link href="/blogs" className="btn btn-ghost">
          Read all posts <span className="arrow">→</span>
        </Link>
      </div>
    </SectionWrapper>
  );
}
