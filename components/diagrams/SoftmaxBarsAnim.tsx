'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

export type SoftmaxBarsProps = {
  paused?: boolean;
  probs?: number[];
  labels?: string[];
};

const DEFAULT_LOGITS = [
  { label: 'apple', z: 2.0 },
  { label: 'banana', z: 1.0 },
  { label: 'mango', z: 0.0 },
];
const DEFAULT_PROBS = [0.665, 0.245, 0.09];

export function SoftmaxBarsAnim({ paused, probs, labels }: SoftmaxBarsProps) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(probs ? 1 : 0);
  const items = DEFAULT_LOGITS.map((l, i) => ({
    label: labels?.[i] ?? l.label,
    z: l.z,
    p: probs?.[i] ?? DEFAULT_PROBS[i],
  }));

  useEffect(() => {
    if (paused || reduced || probs) return;
    const t = setInterval(() => setPhase((p) => (p + 1) % 3), 2000);
    return () => clearInterval(t);
  }, [paused, reduced, probs]);

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-6">
        {items.map((item, i) => (
          <div key={item.label} className="flex flex-col items-center gap-2">
            <span className="font-mono text-sm font-medium">{item.label}</span>
            <div className="flex h-32 w-14 flex-col-reverse items-stretch gap-1">
              <motion.div
                className="rounded-t-md bg-violet-500"
                initial={{ height: 0 }}
                animate={{ height: `${(item.z / 2) * 100}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              />
              {(phase >= 1 || probs) && (
                <motion.div
                  className="rounded-t-md bg-emerald-500"
                  initial={{ height: 0 }}
                  animate={{ height: `${item.p * 100}%` }}
                  transition={{ delay: i * 0.1, type: 'spring' }}
                />
              )}
            </div>
            <span className="text-xs text-fd-muted-foreground">
              {phase >= 1 || probs ? `${(item.p * 100).toFixed(1)}%` : `z=${item.z}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
