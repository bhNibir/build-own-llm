'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import type { ConceptExample } from './lesson-concepts';
import { ActivePulse } from './ConceptAnim';

const DEFAULT_SENTENCE = ['i', 'like', 'apple'];
const DEFAULT_PAIRS = [
  { from: 'i', to: 'like' },
  { from: 'like', to: 'apple' },
];

export function BigramScanAnim({
  paused,
  example,
}: {
  paused?: boolean;
  example?: ConceptExample;
}) {
  const [idx, setIdx] = useState(0);

  const sentence = example?.tokens ?? DEFAULT_SENTENCE;
  const pairs =
    example?.tokens && example.tokens.length >= 2
      ? example.tokens.slice(0, -1).map((from, i) => ({
          from,
          to: example.tokens![i + 1],
        }))
      : DEFAULT_PAIRS;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % (pairs.length + 1)), 1800);
    return () => clearInterval(t);
  }, [paused, pairs.length]);

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        {sentence.map((w, i) => (
          <motion.span
            key={i}
            layout
            className={`rounded-xl px-4 py-2 font-mono font-semibold ${
              idx < pairs.length && (i === idx || i === idx + 1)
                ? 'bg-indigo-500 text-white shadow-lg'
                : 'bg-fd-muted text-fd-foreground'
            }`}
            animate={
              idx < pairs.length && (i === idx || i === idx + 1)
                ? { scale: 1.1 }
                : { scale: 1 }
            }
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {w}
          </motion.span>
        ))}
      </div>

      <div className="relative mx-auto max-w-xs">
        <motion.div
          className="absolute top-1/2 h-1 bg-emerald-400 dark:bg-emerald-600"
          animate={{
            left: idx < pairs.length ? `${idx * 33 + 8}%` : '8%',
            width: idx < pairs.length ? '28%' : '0%',
            opacity: idx < pairs.length ? 1 : 0,
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        />
        <motion.span
          className="absolute top-1/2 -translate-y-1/2 text-emerald-600"
          animate={{ left: idx < pairs.length ? `${idx * 33 + 20}%` : '-10%' }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          ●
        </motion.span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {pairs.map((p, i) => (
          <motion.div
            key={p.from + p.to}
            layout
            className={`relative flex items-center justify-between rounded-lg border-2 px-3 py-2 font-mono text-sm ${
              idx === i
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                : 'border-fd-border opacity-50'
            }`}
            animate={idx === i ? { scale: 1.02 } : { scale: 1 }}
          >
            <ActivePulse active={idx === i} />
            <span>
              {p.from} → {p.to}
            </span>
            <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-xs text-white">
              +1
            </span>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-xs text-fd-muted-foreground">
        Scanner বাম থেকে ডানে যায় — প্রতিটি pair-এর count +1
      </p>
    </div>
  );
}
