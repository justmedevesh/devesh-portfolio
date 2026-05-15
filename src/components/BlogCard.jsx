export default function BlogCard({ blog, index, visible = true }) {
  const isFeatured = blog.featured;

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
    <div
      className="blog-card"
      style={{
        background: 'var(--card)',
        border: `1px solid ${isFeatured ? 'var(--cyan)' : 'var(--border)'}`,
        borderRadius: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        position: 'relative',
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(28px)',
        transition: `opacity 0.6s ${index * 0.12}s, transform 0.6s ${index * 0.12}s, border-color 0.3s, box-shadow 0.3s`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--cyan)';
        e.currentTarget.style.boxShadow = '0 0 30px rgba(0,229,255,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isFeatured ? 'var(--cyan)' : 'var(--border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Featured indicator */}
      {isFeatured && (
        <div
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, var(--cyan), var(--blue), transparent)',
            zIndex: 2,
          }}
        />
      )}

      {/* Cover Image */}
      {blog.coverImage && blog.coverImage.startsWith('http') && (
        <div style={{
          width: '100%', height: 160, overflow: 'hidden',
          borderBottom: '1px solid var(--border)',
        }}>
          <img
            src={blog.coverImage}
            alt={blog.title}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              display: 'block',
              transition: 'transform 0.4s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          />
        </div>
      )}

      {/* Content area */}
      <div style={{ padding: '1.8rem 1.6rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1 }}>
        {/* Meta row */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: '1.4rem', opacity: 0.7 }}>📝</span>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: '0.56rem',
            color: 'var(--muted)', letterSpacing: '0.08em',
          }}>
            {dateStr} · {readTime} min read
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '1.1rem', fontWeight: 700,
          lineHeight: 1.3, color: 'var(--text)',
        }}>
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p style={{
          fontFamily: 'var(--mono)', fontSize: '0.72rem',
          color: 'var(--muted)', lineHeight: 1.85, flex: 1,
        }}>
          {blog.excerpt || (blog.content?.substring(0, 150) + '...')}
        </p>

        {/* Tags */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: 'auto',
        }}>
          {blog.tags?.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: 'var(--mono)', fontSize: '0.56rem',
                padding: '0.2rem 0.55rem',
                border: '1px solid var(--border)',
                color: 'var(--muted)', letterSpacing: '0.06em',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
