export const dynamic = 'force-dynamic';

// Server component — robots metadata here
export const metadata = {
  title: 'Admin Panel',
  robots: { index: false, follow: false },
};

import AdminClient from './AdminClient';

export default function AdminPage() {
  return <AdminClient />;
}
