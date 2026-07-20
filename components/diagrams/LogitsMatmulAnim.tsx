'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, FlowConnector, SketchBox } from './diagram-ui';

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
              <SketchBox
                key={i}
                fillStyle="solid"
                palette={step === 0 ? 'blue' : 'neutral'}
                active={step === 0}
                className="px-3 py-1 font-mono text-xs"
              >
                {v.toFixed(1)}
              </SketchBox>
            ))}
          </div>
        </div>

        <span className="font-mono text-lg text-fd-muted-foreground">×</span>

        <div className="text-center">
          <p className="mb-1 text-xs font-semibold">W (d×V)</p>
          <div className="grid grid-cols-3 gap-0.5">
            {W.flatMap((row, r) =>
              row.map((v, c) => (
                <SketchBox
                  key={`${r}-${c}`}
                  fillStyle="solid"
                  palette={step > 0 && step - 1 === c ? 'green' : 'neutral'}
                  className="flex h-7 w-9 items-center justify-center px-0 py-0 font-mono text-[10px]"
                >
                  {v.toFixed(1)}
                </SketchBox>
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
                animate={step > 0 && step - 1 === i ? { scale: 1.06 } : { scale: 1 }}
              >
                <SketchBox
                  fillStyle="solid"
                  palette={step > 0 && step - 1 === i ? 'violet' : 'neutral'}
                  active={step > 0 && step - 1 === i}
                  className="px-3 py-1 font-mono text-xs"
                >
                  {z.toFixed(2)}
                </SketchBox>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <DataLabel bn="embedding × weight matrix = প্রতিটি token-এর score" en="E @ W" />
    </div>
  );
}
