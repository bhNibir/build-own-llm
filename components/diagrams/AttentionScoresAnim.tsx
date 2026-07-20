'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel } from './diagram-ui';

const TOKENS = ['i', 'like', 'apple'];
const SCORES = [
  [1.2, 0.3, 0.1],
  [0.2, 1.0, 0.4],
  [0.5, 0.6, 0.9],
];

export function AttentionScoresAnim({ paused }: { paused?: boolean }) {
  const [filled, setFilled] = useState(0);
  const total = TOKENS.length * TOKENS.length;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setFilled((f) => (f >= total ? 0 : f + 1)), 500);
    return () => clearInterval(t);
  }, [paused, total]);

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-6">
        <div className="text-center">
          <p className="mb-1 text-xs font-semibold text-indigo-600">Q</p>
          {TOKENS.map((t) => (
            <div key={t} className="mb-1 rounded border border-fd-border bg-fd-muted/30 px-2 py-0.5 font-mono text-xs">
              {t}
            </div>
          ))}
        </div>

        <div className="self-center font-mono text-fd-muted-foreground">· Kᵀ</div>

        <div>
          <p className="mb-1 text-center text-xs font-semibold">scores</p>
          <div className="grid grid-cols-3 gap-1">
            {SCORES.flatMap((row, r) =>
              row.map((s, c) => {
                const idx = r * TOKENS.length + c;
                const on = idx < filled;
                return (
                  <motion.div
                    key={`${r}-${c}`}
                    className={`flex h-10 w-10 items-center justify-center rounded font-mono text-xs ${
                      on ? 'bg-indigo-500 text-white' : 'border border-dashed border-fd-border bg-fd-muted/20 text-fd-muted-foreground'
                    }`}
                    animate={on && idx === filled - 1 ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {on ? s.toFixed(1) : '·'}
                  </motion.div>
                );
              }),
            )}
          </div>
        </div>
      </div>
      <DataLabel bn="প্রতিটি Q·K pair একটি score দেয়" en="Q @ Kᵀ / √d" />
    </div>
  );
}
