export const dynamic = 'force-dynamic';

import BlogPostClient from '../../../components/BlogPostPage';

const BASE_URL = 'https://deveshmandal.com.np';

// Dynamic SEO per blog post — runs on server
export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    // Import firebase server-side to fetch post metadata
    const { getPublishedBlogs } = await import('../../../data/blogStore');
    const blogs = await getPublishedBlogs();
    const blog = blogs.find((b) => b.id === id);

    if (!blog) {
      return {
        title: 'Post Not Found',
        description: 'This blog post does not exist.',
      };
    }

    const keywords = [
      ...(blog.seoKeywords ? blog.seoKeywords.split(',').map((k) => k.trim()) : []),
      ...(blog.tags || []),
      'Devesh Kumar Mandal',
      'Data Science Blog',
      'Machine Learning Nepal',
    ].join(', ');

    return {
      title: blog.title,
      description: blog.seoDescription || blog.excerpt || blog.title,
      keywords,
      openGraph: {
        type: 'article',
        url: `${BASE_URL}/blog/${id}`,
        title: blog.title,
        description: blog.seoDescription || blog.excerpt || blog.title,
        images: [{ url: blog.coverImage || `${BASE_URL}/logo.png` }],
        publishedTime: blog.createdAt?.toDate?.()?.toISOString() || '',
        tags: blog.tags || [],
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.title,
        description: blog.seoDescription || blog.excerpt || blog.title,
        images: [blog.coverImage || `${BASE_URL}/logo.png`],
      },
    };
  } catch {
    return {
      title: 'Blog Post',
      description: 'Read blog posts by Devesh Kumar Mandal.',
    };
  }
}

export default function BlogPostPage() {
  return <BlogPostClient />;
}
