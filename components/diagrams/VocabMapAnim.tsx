'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { FlowConnector, StepDots } from './diagram-ui';
import { VOCAB } from './shared-data';

const STEPS = ['Collect unique words', 'Sort alphabetically', 'Assign ID numbers'];

export function VocabMapAnim({ paused }: { paused?: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setStep((s) => (s + 1) % 3), 2800);
    return () => clearInterval(t);
  }, [paused]);

  const words = VOCAB.map((v) => v.word);

  return (
    <div className="space-y-4">
      <StepDots total={3} current={step} onSelect={setStep} />
      <p className="text-center text-xs font-medium text-fd-foreground">
        {STEPS[step]}
      </p>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`words-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex max-w-[280px] flex-wrap justify-center gap-1"
          >
            {(step === 0 ? words.slice(0, 6) : words).map((w) => (
              <span
                key={w}
                className="rounded border-2 border-dashed border-fd-border bg-fd-muted/30 px-2 py-0.5 font-mono text-xs"
              >
                {w}
              </span>
            ))}
            {step === 0 && (
              <span className="px-1 text-xs text-fd-muted-foreground">+{words.length - 6} more…</span>
            )}
          </motion.div>
        </AnimatePresence>

        {step >= 2 && (
          <>
            <FlowConnector />
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid max-h-[140px] grid-cols-3 gap-1 overflow-y-auto sm:grid-cols-4"
            >
              {VOCAB.map((v) => (
                <div
                  key={v.word}
                  className="flex items-center gap-1 rounded border-2 border-indigo-300/60 bg-indigo-50/80 px-1.5 py-1 font-mono text-[10px] dark:bg-indigo-950/40"
                >
                  <span className="rounded bg-indigo-200 px-1 font-bold text-indigo-900 dark:bg-indigo-800 dark:text-indigo-100">
                    {v.id}
                  </span>
                  {v.word}
                </div>
              ))}
            </motion.div>
          </>
        )}
      </div>
      <p className="text-center text-xs text-fd-muted-foreground">Vocab size = {VOCAB.length} words</p>
    </div>
  );
}
