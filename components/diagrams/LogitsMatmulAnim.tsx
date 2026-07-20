'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, FlowConnector } from './diagram-ui';

const E = [0.3, 0.5, 0.2];
const W = [
  [0.4, 0.1, 0.3],
  [0.2, 0.6, 0.1],
  [0.5, 0.2, 0.4],
];
const LABELS = ['apple', 'banana', 'mango'];

export function LogitsMatmulAnim({ paused }: { paused?: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setStep((s) => (s + 1) % (W[0].length + 2)), 900);
    return () => clearInterval(t);
  }, [paused]);

  const logits = W[0].map((_, j) =>
    E.reduce((sum, e, i) => sum + e * W[i][j], 0),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <div className="text-center">
          <p className="mb-1 text-xs font-semibold">E (1×d)</p>
          <div className="flex flex-col gap-0.5">
            {E.map((v, i) => (
              <motion.div
                key={i}
                className={`rounded border px-3 py-1 font-mono text-xs ${
                  step === 0 ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40' : 'border-fd-border bg-fd-muted/30'
                }`}
              >
                {v.toFixed(1)}
              </motion.div>
            ))}
          </div>
        </div>

        <span className="font-mono text-lg text-fd-muted-foreground">×</span>

        <div className="text-center">
          <p className="mb-1 text-xs font-semibold">W (d×V)</p>
          <div className="grid grid-cols-3 gap-0.5">
            {W.flatMap((row, r) =>
              row.map((v, c) => (
                <motion.div
                  key={`${r}-${c}`}
                  className={`flex h-7 w-9 items-center justify-center font-mono text-[10px] ${
                    step > 0 && step - 1 === c
                      ? 'bg-emerald-500 text-white'
                      : 'border border-fd-border bg-fd-muted/30'
                  }`}
                >
                  {v.toFixed(1)}
                </motion.div>
              )),
            )}
          </div>
        </div>

        <FlowConnector />

        <div className="text-center">
          <p className="mb-1 text-xs font-semibold">logits</p>
          <div className="flex flex-col gap-0.5">
            {logits.map((z, i) => (
              <motion.div
                key={LABELS[i]}
                className={`rounded border px-3 py-1 font-mono text-xs ${
                  step > 0 && step - 1 === i
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/40'
                    : 'border-fd-border bg-fd-muted/30'
                }`}
                animate={step > 0 && step - 1 === i ? { scale: 1.06 } : { scale: 1 }}
              >
                {z.toFixed(2)}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <DataLabel bn="embedding × weight matrix = প্রতিটি token-এর score" en="E @ W" />
    </div>
  );
}
