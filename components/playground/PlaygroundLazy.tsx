'use client';

import dynamic from 'next/dynamic';
import type { PlaygroundProps } from './Playground';

const PlaygroundClient = dynamic(
  () => import('./Playground').then((mod) => mod.Playground),
  {
    ssr: false,
    loading: () => (
      <div className="my-6 h-64 animate-pulse rounded-xl border border-fd-border bg-fd-muted/30" />
    ),
  },
);

export function Playground(props: PlaygroundProps) {
  return <PlaygroundClient {...props} />;
}
