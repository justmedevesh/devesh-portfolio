/**
 * useSEO — Dynamically updates <head> meta tags for each page/blog post.
 * Call this at the top of any page component.
 *
 * @param {Object} config
 * @param {string} config.title        - Page title (shown in browser tab & Google)
 * @param {string} config.description  - 150-160 char summary for Google snippet
 * @param {string} config.keywords     - Comma-separated keywords for this page
 * @param {string} [config.image]      - OG image URL (defaults to logo)
 * @param {string} [config.url]        - Canonical URL for this page
 * @param {string} [config.type]       - OG type: 'article' for blogs, 'website' default
 * @param {string} [config.publishedAt]- ISO date for article published_time
 * @param {string[]} [config.tags]     - Article tags (for OG article:tag)
 */

const BASE_URL = 'https://deveshmandal.com.np';
const DEFAULT_IMAGE = `${BASE_URL}/logo.png`;
const SITE_NAME = 'Devesh Kumar Mandal';

export function useSEO({
  title,
  description,
  keywords,
  image = DEFAULT_IMAGE,
  url = BASE_URL,
  type = 'website',
  publishedAt,
  tags = [],
}) {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} — Data Scientist & ML Engineer`;

  // Helper: set or create a meta tag
  function setMeta(selector, attr, value) {
    if (!value) return;
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      const [attrName, attrVal] = selector.match(/\[(.+?)="(.+?)"\]/)?.slice(1) || [];
      if (attrName) el.setAttribute(attrName, attrVal);
      document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
  }

  function setLink(rel, value) {
    if (!value) return;
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      document.head.appendChild(el);
    }
    el.setAttribute('href', value);
  }

  // Title
  document.title = fullTitle;

  // Primary
  setMeta('meta[name="description"]', 'content', description);
  setMeta('meta[name="keywords"]', 'content', keywords);
  setLink('canonical', url);

  // Open Graph
  setMeta('meta[property="og:title"]', 'content', fullTitle);
  setMeta('meta[property="og:description"]', 'content', description);
  setMeta('meta[property="og:image"]', 'content', image);
  setMeta('meta[property="og:url"]', 'content', url);
  setMeta('meta[property="og:type"]', 'content', type);
  setMeta('meta[property="og:site_name"]', 'content', SITE_NAME);

  // Twitter
  setMeta('meta[name="twitter:title"]', 'content', fullTitle);
  setMeta('meta[name="twitter:description"]', 'content', description);
  setMeta('meta[name="twitter:image"]', 'content', image);
  setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
  setMeta('meta[name="twitter:url"]', 'content', url);

  // Article-specific (for blog posts)
  if (type === 'article') {
    setMeta('meta[property="article:published_time"]', 'content', publishedAt || '');
    setMeta('meta[property="article:author"]', 'content', SITE_NAME);
    // Add article:tag for each tag
    document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());
    tags.forEach(tag => {
      const el = document.createElement('meta');
      el.setAttribute('property', 'article:tag');
      el.setAttribute('content', tag);
      document.head.appendChild(el);
    });
  }
}
