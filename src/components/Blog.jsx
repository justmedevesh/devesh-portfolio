import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SectionWrapper, { SectionLabel, SectionTitle } from './SectionWrapper';
import { getPublishedBlogs } from '../data/blogStore';
import BlogCard from './BlogCard';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    getPublishedBlogs().then(setBlogs).catch(console.error);
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

  if (blogs.length === 0) return null;

  return (
    <SectionWrapper id="blog" bg="var(--bg)">
      <SectionLabel>// 06 — blog.md</SectionLabel>
      <SectionTitle>Blog</SectionTitle>
      <div
        ref={ref}
        className="projects-grid"
      >
        {blogs.map((blog, i) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            index={i}
            visible={visible}
          />
        ))}
      </div>

      <div className="projects-view-all">
        <Link to="/blogs" className="view-all-btn">
          Load More →
        </Link>
      </div>
    </SectionWrapper>
  );
}
