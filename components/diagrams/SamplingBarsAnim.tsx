'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, PlotFrame, SketchBox, StepDots } from './diagram-ui';

/** Sampling vs always picking argmax — dice vs trophy */
export function SamplingBarsAnim({
  paused,
  probs = [0.72, 0.18, 0.1],
  labels = ['apple', 'banana', 'mango'],
}: {
  paused?: boolean;
  probs?: number[];
  labels?: string[];
}) {
  const [mode, setMode] = useState(0); // 0 = argmax, 1 = sample
  const [picked, setPicked] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setMode((m) => {
        const next = m === 0 ? 1 : 0;
        if (next === 1) {
          const r = Math.random();
          let cum = 0;
          let idx = 0;
          for (let i = 0; i < probs.length; i++) {
            cum += probs[i];
            if (r <= cum) {
              idx = i;
              break;
            }
          }
          setPicked(idx);
        } else {
          setPicked(0); // argmax = apple
        }
        return next;
      });
    }, 2800);
    return () => clearInterval(t);
  }, [paused, probs]);

  return (
    <div className="space-y-4">
      <StepDots total={2} current={mode} onSelect={setMode} />
      <DataLabel
        bn={mode === 0 ? 'Argmax — সবসময় সবচেয়ে বড়' : 'Sampling — probability অনুযায়ী লটারি'}
        en={mode === 0 ? 'always max' : 'random draw'}
      />
      <PlotFrame xLabel="token" yLabel="P">
        {labels.map((label, i) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <div className="flex h-32 w-14 items-end justify-center">
              <motion.div
                className={cnBar(i === picked)}
                animate={{ height: `${probs[i] * 100}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              />
            </div>
            <SketchBox
              fillStyle="solid"
              palette={i === picked ? 'green' : 'neutral'}
              active={i === picked}
              className="px-2 py-0.5 font-mono text-[11px]"
            >
              {label}
            </SketchBox>
          </div>
        ))}
      </PlotFrame>
      <p className="text-center font-mono text-xs text-fd-muted-foreground">
        pick → <strong className="text-indigo-600 dark:text-indigo-300">{labels[picked]}</strong>
      </p>
    </div>
  );
}

function cnBar(active: boolean) {
  return active
    ? 'w-10 rounded-t-md bg-emerald-500 ring-2 ring-indigo-400'
    : 'w-10 rounded-t-md bg-violet-400/70';
}
