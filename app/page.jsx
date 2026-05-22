// Prevent static prerender — Firebase runs client-side only
export const dynamic = 'force-dynamic';

// Server component — root metadata is in layout.jsx
import HomeClient from './HomeClient';

export default function HomePage() {
  return <HomeClient />;
}
