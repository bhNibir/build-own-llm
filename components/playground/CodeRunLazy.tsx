'use client';

import dynamic from 'next/dynamic';
import type { CodeRunProps } from './CodeRun';

const CodeRunClient = dynamic(
  () => import('./CodeRun').then((mod) => mod.CodeRun),
  { ssr: false, loading: () => <div className="my-4 h-32 animate-pulse rounded-xl bg-fd-muted/30" /> },
);

export function CodeRun(props: CodeRunProps) {
  return <CodeRunClient {...props} />;
}
