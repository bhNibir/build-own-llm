'use client';

import { motion } from 'motion/react';
import { Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FlowConnector } from './diagram-ui';

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

  const lossBars = [2.4, 1.8, 1.2, 0.9, 0.6, 0.3];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center">
            <motion.div
              layout
              className={`relative rounded-xl border-2 px-3 py-2 text-sm font-semibold sm:px-4 ${
                step === i
                  ? 'border-indigo-500 bg-indigo-500 text-white shadow-lg'
                  : step > i
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200'
                    : 'border-fd-border bg-white dark:bg-slate-800'
              }`}
              animate={step === i ? { scale: 1.05 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            >
              {step === i && (
                <Activity className="mr-1 inline h-3.5 w-3.5 animate-pulse" />
              )}
              {label}
              {step === i && (
                <motion.span
                  className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-amber-500"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              )}
            </motion.div>
            {i < STEPS.length - 1 && <FlowConnector className="hidden sm:flex" />}
          </div>
        ))}
      </div>

      <div className="mx-auto flex h-20 max-w-xs items-end justify-center gap-1">
        {lossBars.map((l, i) => (
          <motion.div
            key={i}
            className="w-6 rounded-t bg-emerald-500"
            initial={{ height: 0 }}
            animate={{
              height: `${(l / 2.4) * 100}%`,
              opacity: loss <= l ? 1 : 0.25,
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 18, delay: i * 0.05 }}
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
