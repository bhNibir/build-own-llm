'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, PlotFrame, SketchBox, StepDots } from './diagram-ui';
import { NEXT_AFTER_I_LIKE } from './shared-data';

function sampleIndex(probs: number[]): number {
  const r = Math.random();
  let cum = 0;
  for (let i = 0; i < probs.length; i++) {
    cum += probs[i];
    if (r <= cum) return i;
  }
  return probs.length - 1;
}

/** Sampling vs always picking argmax — dice vs trophy */
export function SamplingBarsAnim({
  paused,
  probs = NEXT_AFTER_I_LIKE.probs,
  labels = NEXT_AFTER_I_LIKE.labels,
}: {
  paused?: boolean;
  probs?: number[];
  labels?: string[];
}) {
  const [mode, setMode] = useState(0); // 0 = argmax, 1 = sample
  const [picked, setPicked] = useState(0);
  const [roll, setRoll] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setMode((m) => {
        const next = m === 0 ? 1 : 0;
        if (next === 1) {
          setPicked(sampleIndex(probs));
          setRoll((r) => r + 1);
        } else {
          setPicked(0); // argmax = apple
        }
        return next;
      });
    }, 2800);
    return () => clearInterval(t);
  }, [paused, probs]);

  const runSample = () => {
    setMode(1);
    setPicked(sampleIndex(probs));
    setRoll((r) => r + 1);
  };

  return (
    <div className="space-y-4">
      <StepDots
        total={2}
        current={mode}
        onSelect={(i) => {
          setMode(i);
          if (i === 0) setPicked(0);
          else {
            setPicked(sampleIndex(probs));
            setRoll((r) => r + 1);
          }
        }}
      />
      <DataLabel
        bn={mode === 0 ? 'Argmax — সবসময় সবচেয়ে বড় (৫০% apple)' : 'Sampling — probability অনুযায়ী লটারি'}
        en={mode === 0 ? 'always max' : 'random draw'}
      />
      <PlotFrame xLabel="token" yLabel="P">
        {labels.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => {
              setMode(1);
              setPicked(i);
              setRoll((r) => r + 1);
            }}
            className="flex flex-col items-center gap-2"
          >
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
            <span className="font-mono text-[10px] text-fd-muted-foreground">
              {(probs[i] * 100).toFixed(0)}%
            </span>
          </button>
        ))}
      </PlotFrame>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <motion.p
          key={roll}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center font-mono text-xs text-fd-muted-foreground"
        >
          pick → <strong className="text-emerald-600 dark:text-emerald-300">{labels[picked]}</strong>
        </motion.p>
        <button
          type="button"
          onClick={runSample}
          className="rounded-lg border-2 border-amber-400 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900 transition hover:bg-amber-100 dark:border-amber-600 dark:bg-amber-950/40 dark:text-amber-100"
        >
          🎲 আবার sample করো
        </button>
      </div>
    </div>
  );
}

function cnBar(active: boolean) {
  return active
    ? 'w-10 rounded-t-md bg-emerald-500 ring-2 ring-indigo-400'
    : 'w-10 rounded-t-md bg-sky-400/80';
}
