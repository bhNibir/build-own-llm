'use client';

import { useEffect, useState } from 'react';
import { ActivePulse } from './ConceptAnim';

const SENTENCE = ['i', 'like', 'apple'];
const PAIRS = [
  { from: 'i', to: 'like' },
  { from: 'like', to: 'apple' },
];

export function BigramScanAnim({ paused }: { paused?: boolean }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % (PAIRS.length + 1)), 1800);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        {SENTENCE.map((w, i) => (
          <span
            key={i}
            className={`rounded-xl px-4 py-2 font-mono font-semibold transition-all duration-300 ${
              idx < PAIRS.length && (i === idx || i === idx + 1)
                ? 'scale-110 bg-indigo-500 text-white shadow-lg'
                : 'bg-fd-muted text-fd-foreground'
            }`}
          >
            {w}
          </span>
        ))}
      </div>

      <div className="relative mx-auto max-w-xs">
        <div
          className="absolute top-1/2 h-1 bg-emerald-400 transition-all duration-500 dark:bg-emerald-600"
          style={{
            left: idx < PAIRS.length ? `${idx * 33 + 8}%` : '8%',
            width: idx < PAIRS.length ? '28%' : '0%',
            opacity: idx < PAIRS.length ? 1 : 0,
          }}
        />
        <span
          className="absolute top-1/2 -translate-y-1/2 animate-flow-dot text-emerald-600"
          style={{ left: idx < PAIRS.length ? `${idx * 33 + 20}%` : '-10%' }}
        >
          ●
        </span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {PAIRS.map((p, i) => (
          <div
            key={p.from + p.to}
            className={`relative flex items-center justify-between rounded-lg border-2 px-3 py-2 font-mono text-sm transition-all ${
              idx === i
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                : 'border-fd-border opacity-50'
            }`}
          >
            <ActivePulse active={idx === i} />
            <span>
              {p.from} → {p.to}
            </span>
            <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-xs text-white">
              +1
            </span>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-fd-muted-foreground">
        Scanner বাম থেকে ডানে যায় — প্রতিটি pair-এর count +1
      </p>
    </div>
  );
}
