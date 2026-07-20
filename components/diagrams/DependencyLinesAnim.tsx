'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel } from './diagram-ui';

const TOKENS = ['i', 'like', 'apple'];
const ARCS = [{ from: 0, to: 2, label: 'long-range' }];

export function DependencyLinesAnim({ paused }: { paused?: boolean }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % (ARCS.length + 1)), 1800);
    return () => clearInterval(t);
  }, [paused]);

  const arc = ARCS[0];
  const positions = [60, 160, 260];

  return (
    <div className="space-y-4">
      <div className="relative mx-auto h-36 w-full max-w-sm">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 320 120" aria-hidden>
          <motion.path
            d={`M ${positions[arc.from]} 70 Q 160 10 ${positions[arc.to]} 70`}
            fill="none"
            stroke="rgb(99 102 241)"
            strokeWidth={2}
            strokeDasharray="6 4"
            initial={{ pathLength: 0, opacity: 0.3 }}
            animate={
              active === 1
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: active === 0 ? 0.3 : 1, opacity: active === 0 ? 0.3 : 0.8 }
            }
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        </svg>

        <div className="absolute bottom-0 flex w-full justify-between px-6">
          {TOKENS.map((t, i) => (
            <motion.div
              key={t}
              className={`relative rounded-lg border px-4 py-2 font-mono text-sm ${
                active === 1 && (i === arc.from || i === arc.to)
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40'
                  : 'border-fd-border bg-fd-muted/30'
              }`}
              animate={
                active === 1 && (i === arc.from || i === arc.to) ? { y: -4 } : { y: 0 }
              }
            >
              {t}
            </motion.div>
          ))}
        </div>
      </div>
      <DataLabel bn="দূরের token-এর উপর নির্ভর — attention-এর মূল কারণ" en="dependency" />
    </div>
  );
}
