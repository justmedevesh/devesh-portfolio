'use client';

import dynamic from 'next/dynamic';

const NeuralCanvas = dynamic(() => import('./NeuralCanvas'), { ssr: false });
const Cursor = dynamic(() => import('./Cursor'), { ssr: false });

export default function ClientProviders() {
  return (
    <>
      <Cursor />
      <NeuralCanvas />
    </>
  );
}
