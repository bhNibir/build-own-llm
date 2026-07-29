'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, PlotFrame, SketchBox, StepDots } from './diagram-ui';

/** Cross-entropy: highlight true token vs predicted mass */
export function LossBarsAnim({
  paused,
  probs = [0.5, 0.3, 0.2],
  labels = ['apple', 'banana', 'mango'],
  trueIndex = 0,
}: {
  paused?: boolean;
  probs?: number[];
  labels?: string[];
  trueIndex?: number;
}) {
  const [step, setStep] = useState(0);
  const pTrue = probs[trueIndex] ?? 0.5;
  const loss = -Math.log(Math.max(pTrue, 1e-6));

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setStep((s) => (s + 1) % 3), 2200);
    return () => clearInterval(t);
  }, [paused]);

  const captions = [
    { bn: 'Model probability দেখাও', en: 'predicted P' },
    { bn: 'সঠিক token হাইলাইট', en: 'true label' },
    { bn: `Loss = −log(P) ≈ ${loss.toFixed(2)}`, en: 'cross-entropy' },
  ];

  return (
    <div className="space-y-4">
      <StepDots total={3} current={step} onSelect={setStep} />
      <DataLabel bn={captions[step].bn} en={captions[step].en} />
      <PlotFrame xLabel="vocab" yLabel="P">
        {labels.map((label, i) => {
          const isTrue = i === trueIndex;
          const dim = step >= 1 && !isTrue;
          return (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="flex h-32 w-14 items-end justify-center">
                <motion.div
                  className={
                    isTrue && step >= 1
                      ? 'w-10 rounded-t-md bg-rose-500'
                      : 'w-10 rounded-t-md bg-emerald-500'
                  }
                  animate={{
                    height: `${probs[i] * 100}%`,
                    opacity: dim ? 0.35 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                />
              </div>
              <SketchBox
                fillStyle="solid"
                palette={isTrue && step >= 1 ? 'rose' : 'green'}
                className="px-2 py-0.5 font-mono text-[11px]"
              >
                {label}
              </SketchBox>
            </div>
          );
        })}
      </PlotFrame>
      {step >= 2 && (
        <SketchBox fillStyle="solid" palette="amber" className="mx-auto w-fit font-mono text-sm">
          L = −log({pTrue.toFixed(2)}) ≈ {loss.toFixed(2)}
        </SketchBox>
      )}
    </div>
  );
}
