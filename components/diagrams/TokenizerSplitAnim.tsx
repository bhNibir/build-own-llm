'use client';

import { useEffect, useState } from 'react';
import { ActivePulse, FlowArrow } from './ConceptAnim';

const STEPS = [
  { label: 'Input', text: '"I Like Apple"', phase: 0 },
  { label: 'lowercase', text: '"i like apple"', phase: 1 },
  { label: 'split', tokens: ['i', 'like', 'apple'], phase: 2 },
];

export function TokenizerSplitAnim({ paused }: { paused?: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 2200);
    return () => clearInterval(t);
  }, [paused]);

  const current = STEPS[step];

  return (
    <div className="space-y-4">
      <p className="text-center text-sm font-medium text-fd-foreground">
        Step {step + 1}/3: <span className="text-indigo-600 dark:text-indigo-400">{current.label}</span>
      </p>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <div className="relative rounded-xl border-2 border-indigo-400 bg-white px-5 py-4 font-mono text-lg dark:bg-slate-800">
          <ActivePulse active={step === 0} />
          {current.text}
        </div>

        <FlowArrow />

        <div className="relative flex min-h-[72px] flex-wrap justify-center gap-2 rounded-xl border-2 border-emerald-400 bg-emerald-50 px-4 py-3 dark:bg-emerald-950/30">
          <ActivePulse active={step >= 2} />
          {step < 2 ? (
            <span className="text-sm text-fd-muted-foreground animate-pulse">waiting…</span>
          ) : (
            current.tokens?.map((tok, i) => (
              <span
                key={tok}
                className="animate-pop-in rounded-lg bg-emerald-500 px-3 py-1.5 font-mono text-sm font-bold text-white"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                {tok}
              </span>
            ))
          )}
        </div>
      </div>
      <p className="text-center text-xs text-fd-muted-foreground">
        {step === 0 && 'Raw sentence enters the Tokenizer'}
        {step === 1 && 'lowercase() — model treats "I" and "i" as same word'}
        {step === 2 && 'split on spaces → list of tokens'}
      </p>
    </div>
  );
}
