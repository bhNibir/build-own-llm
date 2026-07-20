'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, SketchBox, StepDots } from './diagram-ui';

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
  const [phase, setPhase] = useState(probs ? 1 : 0);
  const items = DEFAULT_LOGITS.map((l, i) => ({
    label: labels?.[i] ?? l.label,
    z: l.z,
    p: probs?.[i] ?? DEFAULT_PROBS[i],
  }));

  useEffect(() => {
    if (paused || probs) return;
    const t = setInterval(() => setPhase((p) => (p === 0 ? 1 : 0)), 2800);
    return () => clearInterval(t);
  }, [paused, probs]);

  const showProbs = phase >= 1 || !!probs;

  return (
    <div className="space-y-4">
      <StepDots total={2} current={showProbs ? 1 : 0} onSelect={(i) => !probs && setPhase(i)} />
      <DataLabel
        bn={showProbs ? 'Softmax → probability (যোগফল = ১)' : 'Logits = raw scores'}
        en={showProbs ? 'probabilities' : 'logits'}
      />
      <div className="flex justify-center gap-4 sm:gap-8">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-2">
            <span className="font-mono text-sm font-medium">{item.label}</span>
            <div className="flex h-36 w-16 items-end justify-center">
              {showProbs ? (
                <motion.div
                  className="w-12 rounded-t-md bg-emerald-500"
                  initial={{ height: 0 }}
                  animate={{ height: `${item.p * 100}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                />
              ) : (
                <motion.div
                  className="w-12 rounded-t-md bg-violet-500"
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.z / 2) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                />
              )}
            </div>
            <SketchBox
              fillStyle="solid"
              palette={showProbs ? 'green' : 'violet'}
              strokeStyle="solid"
              className="px-2 py-0.5 font-mono text-[11px]"
            >
              {showProbs ? `${(item.p * 100).toFixed(1)}%` : `z=${item.z}`}
            </SketchBox>
          </div>
        ))}
      </div>
    </div>
  );
}
