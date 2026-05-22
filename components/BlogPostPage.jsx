'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPublishedBlogs } from '../data/blogStore';
import Navbar from './Navbar';
import Footer from './Footer';

function formatDate(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    getPublishedBlogs()
      .then((blogs) => {
        const found = blogs.find((b) => b.id === id);
        if (found) {
          setBlog(found);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'var(--mono)', color: 'var(--cyan)', fontSize: '0.8rem', letterSpacing: '0.2em' }}>
            loading post...
          </div>
        </div>
      </>
    );
  }

  if (notFound || !blog) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
          <div style={{ fontSize: '3rem' }}>📭</div>
          <h1 style={{ fontFamily: 'var(--mono)', fontSize: '1rem', color: 'var(--muted)' }}>Blog post not found</h1>
          <Link href="/blogs" style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--cyan)', border: '1px solid var(--cyan)', padding: '0.6rem 1.5rem', textDecoration: 'none' }}>
            ← Back to Blogs
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <article style={{ position: 'relative', zIndex: 2, minHeight: '100vh', background: 'var(--bg)' }}>

        {/* Cover image */}
        {blog.coverImage && (
          <div style={{ width: '100%', maxHeight: 420, overflow: 'hidden' }}>
            <img
              src={blog.coverImage}
              alt={blog.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
            />
          </div>
        )}

        {/* Content */}
        <div style={{ maxWidth: 780, margin: '0 auto', padding: blog.coverImage ? '3rem 1.5rem 5rem' : '8rem 1.5rem 5rem' }}>

          {/* Back link */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <Link
              href="/blogs"
              style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.1em', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2rem', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--cyan)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
            >
              ← BACK TO BLOGS
            </Link>
          </motion.div>

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.2rem' }}>
              {blog.tags.map(tag => (
                <span key={tag} style={{ fontFamily: 'var(--mono)', fontSize: '0.56rem', padding: '0.2rem 0.6rem', border: '1px solid var(--cyan)', color: 'var(--cyan)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {tag}
                </span>
              ))}
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}
            style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1rem' }}
          >
            {blog.title}
          </motion.h1>

          {/* Meta */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
            style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--muted)', marginBottom: '3rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
            <span>✍ {blog.author || 'Devesh Kumar Mandal'}</span>
            {blog.createdAt && <span>📅 {formatDate(blog.createdAt)}</span>}
            {blog.featured && <span style={{ color: 'var(--neon)' }}>⭐ Featured</span>}
          </motion.div>

          {/* Markdown Content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="blog-post-content"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {blog.content || '*No content yet.*'}
            </ReactMarkdown>
          </motion.div>

          {/* Bottom nav */}
          <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <Link href="/blogs" style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--cyan)', border: '1px solid var(--cyan)', padding: '0.6rem 1.5rem', textDecoration: 'none', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,229,255,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              ← All Blogs
            </Link>
            <button onClick={() => router.push('/')} style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--muted)', background: 'none', border: '1px solid var(--border)', padding: '0.6rem 1.5rem', cursor: 'pointer' }}>
              Home →
            </button>
          </div>
        </div>
      </article>
      <Footer />
    </>
  );
}
