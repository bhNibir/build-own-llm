'use client';

import { useEffect, useState } from 'react';
import { FlowArrow } from './ConceptAnim';

const STEPS = ['Forward', 'Loss', 'Backward', 'Update'];

export function TrainLoopAnim({ paused }: { paused?: boolean }) {
  const [step, setStep] = useState(0);
  const [loss, setLoss] = useState(2.4);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setStep((s) => {
        const next = (s + 1) % STEPS.length;
        if (next === 0) setLoss((l) => Math.max(0.3, l - 0.35));
        return next;
      });
    }, 1500);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center">
            <div
              className={`relative rounded-xl border-2 px-3 py-2 text-sm font-semibold transition-all duration-500 sm:px-4 ${
                step === i
                  ? 'scale-105 border-indigo-500 bg-indigo-500 text-white shadow-lg'
                  : step > i
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200'
                    : 'border-fd-border bg-white dark:bg-slate-800'
              }`}
            >
              {label}
              {step === i && (
                <span className="absolute -right-1 -top-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500" />
                </span>
              )}
            </div>
            {i < STEPS.length - 1 && <FlowArrow className="hidden sm:flex" />}
          </div>
        ))}
      </div>

      <div className="mx-auto flex max-w-xs items-end justify-center gap-1 h-20">
        {[2.4, 1.8, 1.2, 0.9, 0.6, 0.3].map((l, i) => (
          <div
            key={i}
            className="w-6 rounded-t bg-emerald-500 transition-all duration-500"
            style={{
              height: `${(l / 2.4) * 100}%`,
              opacity: loss <= l ? 1 : 0.25,
            }}
          />
        ))}
      </div>
      <p className="text-center font-mono text-sm">
        Loss: <strong className="text-emerald-600">{loss.toFixed(2)}</strong>
        <span className="text-fd-muted-foreground"> ↓ each epoch</span>
      </p>
    </div>
  );
}
