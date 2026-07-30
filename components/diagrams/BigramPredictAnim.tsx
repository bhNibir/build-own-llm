'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, SketchBox, StepDots } from './diagram-ui';
import { NEXT_AFTER_I_LIKE } from './shared-data';

/** Counts for like → {apple, banana, mango} from fruit corpus */
const COUNTS = NEXT_AFTER_I_LIKE.labels.map((word, i) => ({
  word,
  count: word === 'apple' ? 2 : 1,
  p: NEXT_AFTER_I_LIKE.probs[i],
}));

/** Bigram predict: counts → normalize → argmax */
export function BigramPredictAnim({ paused }: { paused?: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setStep((s) => (s + 1) % 3), 2200);
    return () => clearInterval(t);
  }, [paused]);

  const captions = [
    { bn: 'Context = "like" — count দেখো', en: 'count row' },
    { bn: 'Count ÷ sum → probability', en: 'normalize' },
    { bn: 'Argmax = apple (৫০%)', en: 'predict' },
  ];

  return (
    <div className="space-y-4">
      <StepDots total={3} current={step} onSelect={setStep} />
      <DataLabel bn={captions[step].bn} en={captions[step].en} />
      <div className="flex flex-wrap justify-center gap-3">
        {COUNTS.map((row, i) => {
          const isMax = i === 0;
          return (
            <motion.button
              key={row.word}
              type="button"
              onClick={() => setStep(isMax ? 2 : step === 0 ? 1 : 2)}
              animate={{
                scale: step >= 2 && isMax ? 1.1 : 1,
                y: step >= 2 && isMax ? -4 : 0,
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className="cursor-pointer"
            >
              <SketchBox
                fillStyle={step >= 2 && isMax ? 'hachure' : 'solid'}
                palette={step >= 2 && isMax ? 'green' : step >= 1 ? 'blue' : 'neutral'}
                active={step >= 2 && isMax}
                className="min-w-[7rem] space-y-1 text-center font-mono text-sm"
              >
                <div className="font-semibold">{row.word}</div>
                <div className="text-xs text-fd-muted-foreground">
                  {step === 0
                    ? `count=${row.count}`
                    : `P=${(row.p * 100).toFixed(0)}%`}
                </div>
                {step >= 1 && (
                  <div className="mx-auto mt-1 h-1.5 w-16 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${row.p * 100}%` }}
                      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                    />
                  </div>
                )}
              </SketchBox>
            </motion.button>
          );
        })}
      </div>
      <p className="text-center text-[11px] text-fd-muted-foreground">
        টিপ: বক্সে ক্লিক করে step এগিয়ে যাও
      </p>
    </div>
  );
}
