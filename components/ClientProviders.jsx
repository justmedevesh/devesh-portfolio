'use client';

import dynamic from 'next/dynamic';

const NeuralCanvas = dynamic(() => import('./NeuralCanvas'), { ssr: false });

export default function ClientProviders() {
  return <NeuralCanvas />;
}
