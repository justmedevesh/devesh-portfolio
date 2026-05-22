'use client';

// dynamic with ssr:false MUST be used inside a 'use client' component
import dynamic from 'next/dynamic';

const AdminPanel = dynamic(() => import('../../components/AdminPanel'), { ssr: false });

export default function AdminClient() {
  return <AdminPanel />;
}
