'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, FlowConnector } from './diagram-ui';

const PROJ = [
  { key: 'Q', color: 'indigo', label: 'Query' },
  { key: 'K', color: 'emerald', label: 'Key' },
  { key: 'V', color: 'violet', label: 'Value' },
] as const;

const COLOR: Record<string, string> = {
  indigo: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40',
  emerald: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
  violet: 'border-violet-500 bg-violet-50 dark:bg-violet-950/40',
};

export function QkvSplitAnim({ paused }: { paused?: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setStep((s) => (s + 1) % 4), 1200);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <motion.div
          className={`rounded-lg border px-4 py-3 font-mono text-sm ${
            step === 0 ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40' : 'border-fd-border bg-fd-muted/30'
          }`}
          animate={step === 0 ? { scale: 1.04 } : { scale: 1 }}
        >
          <span className="text-xs text-fd-muted-foreground">embed</span>
          <div className="font-semibold">x</div>
        </motion.div>

        {step >= 1 && <FlowConnector />}

        <div className="flex gap-2">
          {PROJ.map((p, i) => (
            <motion.div
              key={p.key}
              initial={{ opacity: 0, x: -8 }}
              animate={
                step >= 1
                  ? { opacity: step === 0 ? 0 : 1, x: 0, scale: step === i + 1 ? 1.06 : 1 }
                  : { opacity: 0, x: -8 }
              }
              className={`rounded-lg border px-3 py-2 text-center font-mono text-sm ${COLOR[p.color]}`}
            >
              <div className="text-xs text-fd-muted-foreground">W{p.key}</div>
              <div className="font-bold">{p.key}</div>
              <div className="text-[10px]">{p.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
      <DataLabel bn="এক embedding তিন projection-এ ভাগ" en="x → Q, K, V" />
    </div>
  );
}
