'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel } from './diagram-ui';

const RUNGS = [
  { name: 'Fruit Mini GPT', params: '~270K', tokens: '30 words', active: true },
  { name: 'nanoGPT small', params: '~10M', tokens: 'Shakespeare', active: false },
  { name: 'GPT-2', params: '124M', tokens: 'WebText', active: false },
  { name: 'GPT-3', params: '175B', tokens: 'internet', active: false },
];

export function ScaleLadderAnim({ paused }: { paused?: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setStep((s) => (s + 1) % RUNGS.length), 1800);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-4">
      <div className="mx-auto flex max-w-sm flex-col gap-1">
        {RUNGS.map((rung, i) => (
          <motion.div
            key={rung.name}
            className={`flex items-center gap-3 rounded-lg border py-2 pl-3 pr-4 ${
              step === i
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40'
                : i === 0
                  ? 'border-emerald-400/50 bg-emerald-50/50 dark:bg-emerald-950/20'
                  : 'border-fd-border bg-fd-muted/20'
            }`}
            style={{ marginLeft: `${i * 12}px` }}
            animate={step === i ? { scale: 1.02 } : { scale: 1 }}
          >
            <div className="flex-1">
              <p className="text-sm font-medium">{rung.name}</p>
              <p className="text-[10px] text-fd-muted-foreground">{rung.tokens}</p>
            </div>
            <span className="font-mono text-xs font-semibold text-indigo-600">{rung.params}</span>
          </motion.div>
        ))}
      </div>
      <DataLabel bn="একই architecture — data ও params বড় হলে শক্তি বাড়ে" en="scale" />
    </div>
  );
}
