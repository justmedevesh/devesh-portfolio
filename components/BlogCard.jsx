'use client';

import Link from 'next/link';
import TiltCard from './TiltCard';

export default function BlogCard({ blog, index = 0, visible = true }) {
  // Format date from Firestore timestamp
  const dateStr = blog.createdAt?.seconds
    ? new Date(blog.createdAt.seconds * 1000).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    : 'Just now';

  // Estimate reading time (~200 words per minute)
  const words = (blog.content || blog.excerpt || '').split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(words / 200));

  return (
    <div className={`reveal ${visible ? 'is-visible' : ''}`} style={{ '--d': `${index * 110}ms`, height: '100%' }}>
      <Link href={`/blog/${blog.id}`} className="blog-card-link">
        <TiltCard className={`glass-card blog-card ${blog.featured ? 'featured' : ''}`} max={6}>
          {blog.coverImage && blog.coverImage.startsWith('http') && (
            <div className="blog-cover">
              <img src={blog.coverImage} alt={blog.title} />
            </div>
          )}
          <div className="blog-body">
            <div className="blog-meta">
              {dateStr} · {readTime} min read
              {blog.featured && <span style={{ color: 'var(--cyan)' }}> · ★ Featured</span>}
            </div>
            <h3 className="card-title pop-sm">{blog.title}</h3>
            <p className="card-desc">{blog.excerpt || (blog.content?.substring(0, 150) + '...')}</p>
            {blog.tags?.length > 0 && (
              <div className="card-tags">
                {blog.tags.map((tag) => <span key={tag} className="chip">{tag}</span>)}
              </div>
            )}
            <div className="card-cta">Read post <span className="arrow">→</span></div>
          </div>
        </TiltCard>
      </Link>
    </div>
  );
}
