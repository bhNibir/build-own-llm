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

/** Same logits as Module 9.4 MathPractical + playground */
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
      <div className="flex flex-wrap justify-center gap-2">
        {TEMPS.map((temp, i) => (
          <button
            key={temp}
            type="button"
            onClick={() => setTi(i)}
            className={`rounded-lg border-2 px-3 py-1 font-mono text-xs font-medium transition ${
              i === ti
                ? 'border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950/50 dark:text-amber-100'
                : 'border-fd-border bg-fd-muted/30 text-fd-muted-foreground hover:border-amber-300'
            }`}
          >
            T = {temp}
          </button>
        ))}
      </div>
      <DataLabel
        bn={
          T < 1
            ? 'T < 1 — বেশি peaky (নিরাপদ)'
            : T > 1
              ? 'T > 1 — আরও flat (creative)'
              : 'T = 1 — স্বাভাবিক softmax'
        }
        en={`z=[2,1,0] ÷ ${T}`}
      />
      <PlotFrame xLabel="token" yLabel="P">
        {LABELS.map((label, i) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <div className="flex h-32 w-14 items-end justify-center">
              <motion.div
                className="w-10 rounded-t-md bg-amber-500"
                animate={{ height: `${Math.max(probs[i] * 100, 2)}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              />
            </div>
            <SketchBox fillStyle="solid" palette="amber" className="px-2 py-0.5 font-mono text-[11px]">
              {(probs[i] * 100).toFixed(0)}%
            </SketchBox>
            <span className="font-mono text-xs">{label}</span>
          </div>
        ))}
      </PlotFrame>
    </div>
  );
}
