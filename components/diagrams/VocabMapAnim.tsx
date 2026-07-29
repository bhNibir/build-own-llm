'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, FlowConnector, SketchBox, StepDots } from './diagram-ui';
import { VOCAB } from './shared-data';

const STEPS_BN = ['অনন্য শব্দ সংগ্রহ', 'বর্ণানুক্রমে সাজাও', 'ID নম্বর দাও'];
const STEPS_EN = ['Collect unique words', 'Sort alphabetically', 'Assign ID numbers'];

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
      <DataLabel bn={STEPS_BN[step]} en={STEPS_EN[step]} />

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`words-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex max-w-[280px] flex-wrap justify-center gap-1"
          >
            {(step === 0 ? words.slice(0, 6) : words).map((w) => (
              <SketchBox
                key={w}
                fillStyle="solid"
                palette="neutral"
                strokeStyle="solid"
                className="px-2 py-0.5 font-mono text-xs"
              >
                {w}
              </SketchBox>
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
                <SketchBox
                  key={v.word}
                  fillStyle="solid"
                  palette="blue"
                  className="flex items-center gap-1 px-1.5 py-1 font-mono text-[10px]"
                >
                  <span className="rounded bg-indigo-200 px-1 font-bold text-indigo-900 dark:bg-indigo-800 dark:text-indigo-100">
                    {v.id}
                  </span>
                  {v.word}
                </SketchBox>
              ))}
            </motion.div>
          </>
        )}
      </div>
      <DataLabel bn={`Vocab size = ${VOCAB.length} শব্দ`} en="vocabulary" />
    </div>
  );
}
