'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import type { ConceptExample } from './lesson-concepts';
import { ActivePulse, FlowArrow } from './ConceptAnim';

const DEFAULT = {
  input: 'I Like Apple',
  tokens: ['i', 'like', 'apple'],
};

export function TokenizerSplitAnim({
  paused,
  example,
}: {
  paused?: boolean;
  example?: ConceptExample;
}) {
  const input = example?.input ?? DEFAULT.input;
  const tokens = example?.tokens ?? DEFAULT.tokens;
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setStep((s) => (s + 1) % 3), 2200);
    return () => clearInterval(t);
  }, [paused]);

  const text = step === 0 ? `"${input}"` : `"${input.toLowerCase()}"`;

  return (
    <div className="space-y-4">
      <p className="text-center text-sm font-medium">
        ধাপ {step + 1}/3:{' '}
        <span className="text-indigo-600 dark:text-indigo-400">
          {step === 0 ? 'Input' : step === 1 ? 'lowercase' : 'split → tokens'}
        </span>
      </p>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <motion.div
          key={text}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative rounded-xl border-2 border-indigo-400 bg-white px-5 py-4 font-mono text-lg dark:bg-slate-800"
        >
          <ActivePulse active={step <= 1} />
          {text}
        </motion.div>
        <FlowArrow />
        <div className="relative flex min-h-[72px] flex-wrap justify-center gap-2 rounded-xl border-2 border-emerald-400 bg-emerald-50 px-4 py-3 dark:bg-emerald-950/30">
          {step < 2 ? (
            <span className="animate-pulse text-sm text-fd-muted-foreground">অপেক্ষা…</span>
          ) : (
            tokens.map((tok, i) => (
              <motion.span
                key={tok}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.15, type: 'spring' }}
                className="rounded-lg bg-emerald-500 px-3 py-1.5 font-mono text-sm font-bold text-white"
              >
                {tok}
              </motion.span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
