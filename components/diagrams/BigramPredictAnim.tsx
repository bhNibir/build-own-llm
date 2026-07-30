'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, SketchBox, StepDots } from './diagram-ui';

const COUNTS = [
  { word: 'apple', count: 2, p: 0.72 },
  { word: 'banana', count: 1, p: 0.18 },
  { word: 'mango', count: 1, p: 0.1 },
];

/** Bigram predict: counts → argmax */
export function BigramPredictAnim({ paused }: { paused?: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setStep((s) => (s + 1) % 3), 2200);
    return () => clearInterval(t);
  }, [paused]);

  const captions = [
    { bn: 'Context = "like" — count দেখো', en: 'count row' },
    { bn: 'Count → probability', en: 'normalize' },
    { bn: 'Argmax = apple (সবচেয়ে বেশি)', en: 'predict' },
  ];

  return (
    <div className="space-y-4">
      <StepDots total={3} current={step} onSelect={setStep} />
      <DataLabel bn={captions[step].bn} en={captions[step].en} />
      <div className="flex flex-wrap justify-center gap-3">
        {COUNTS.map((row, i) => {
          const isMax = i === 0;
          const show = step >= (isMax && step >= 2 ? 0 : 0);
          return (
            <motion.div
              key={row.word}
              animate={{ scale: step >= 2 && isMax ? 1.08 : 1 }}
              className={!show ? 'opacity-40' : undefined}
            >
              <SketchBox
                fillStyle={step >= 2 && isMax ? 'hachure' : 'solid'}
                palette={step >= 2 && isMax ? 'green' : step >= 1 ? 'blue' : 'neutral'}
                active={step >= 2 && isMax}
                className="min-w-[7rem] space-y-1 text-center font-mono text-sm"
              >
                <div className="font-semibold">{row.word}</div>
                <div className="text-xs text-fd-muted-foreground">
                  {step === 0 ? `count=${row.count}` : `P≈${(row.p * 100).toFixed(0)}%`}
                </div>
              </SketchBox>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
