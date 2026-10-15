'use client';

import dynamic from 'next/dynamic';
import BootLoader from './BootLoader';
import ScrollProgress from './ScrollProgress';

const NeuralCanvas = dynamic(() => import('./NeuralCanvas'), { ssr: false });
const Cursor = dynamic(() => import('./Cursor'), { ssr: false });

export default function ClientProviders() {
  return (
    <>
      <BootLoader />
      <ScrollProgress />
      <Cursor />
      <NeuralCanvas />
    </>
  );
}
