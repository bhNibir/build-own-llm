'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel } from './diagram-ui';
import { NEXT_AFTER_I_LIKE } from './shared-data';

const K = 2;

export function TopkFilterAnim({ paused }: { paused?: boolean }) {
  const [phase, setPhase] = useState(0);
  const items = NEXT_AFTER_I_LIKE.labels.map((label, i) => ({
    label,
    p: NEXT_AFTER_I_LIKE.probs[i],
  }));
  const sorted = [...items].sort((a, b) => b.p - a.p);
  const keep = new Set(sorted.slice(0, K).map((x) => x.label));

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setPhase((p) => (p + 1) % 2), 2200);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-4">
      <p className="text-center text-xs font-mono text-indigo-600">top-k = {K}</p>
      <div className="flex justify-center gap-5">
        {items.map((item) => {
          const filtered = phase === 1 && !keep.has(item.label);
          return (
            <div key={item.label} className="flex flex-col items-center gap-2">
              <span className="font-mono text-sm">{item.label}</span>
              <div className="flex h-28 w-12 flex-col-reverse">
                <motion.div
                  className={`rounded-t-md ${filtered ? 'bg-fd-muted' : 'bg-indigo-500'}`}
                  animate={{
                    height: `${item.p * 100}%`,
                    opacity: filtered ? 0.35 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                />
              </div>
              <span className={`text-xs ${filtered ? 'text-fd-muted-foreground line-through' : ''}`}>
                {(item.p * 100).toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>
      <DataLabel bn="নিচের token বাদ — শুধু top-k sample" en="top-k filter" />
    </div>
  );
}
