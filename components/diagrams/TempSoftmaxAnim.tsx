'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, PlotFrame, SketchBox, StepDots } from './diagram-ui';

function softmax(logits: number[], T: number) {
  const scaled = logits.map((z) => z / T);
  const max = Math.max(...scaled);
  const exps = scaled.map((z) => Math.exp(z - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

const LOGITS = [2.0, 1.0, 0.0];
const LABELS = ['apple', 'banana', 'mango'];
const TEMPS = [0.5, 1.0, 2.0];

/** Temperature reshapes the distribution */
export function TempSoftmaxAnim({ paused }: { paused?: boolean }) {
  const [ti, setTi] = useState(1);
  const T = TEMPS[ti];
  const probs = softmax(LOGITS, T);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setTi((i) => (i + 1) % TEMPS.length), 2400);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-4">
      <StepDots total={3} current={ti} onSelect={setTi} />
      <DataLabel
        bn={
          T < 1
            ? 'T < 1 — বেশি peaky (নিরাপদ)'
            : T > 1
              ? 'T > 1 — আরও flat (creative)'
              : 'T = 1 — স্বাভাবিক softmax'
        }
        en={`temperature = ${T}`}
      />
      <PlotFrame xLabel="token" yLabel="P">
        {LABELS.map((label, i) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <div className="flex h-32 w-14 items-end justify-center">
              <motion.div
                className="w-10 rounded-t-md bg-violet-500"
                animate={{ height: `${probs[i] * 100}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              />
            </div>
            <SketchBox fillStyle="solid" palette="violet" className="px-2 py-0.5 font-mono text-[11px]">
              {(probs[i] * 100).toFixed(0)}%
            </SketchBox>
            <span className="font-mono text-xs">{label}</span>
          </div>
        ))}
      </PlotFrame>
    </div>
  );
}
