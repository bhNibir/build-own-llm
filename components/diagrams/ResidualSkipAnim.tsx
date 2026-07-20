'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel } from './diagram-ui';

export function ResidualSkipAnim({ paused }: { paused?: boolean }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setPhase((p) => (p + 1) % 3), 1500);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-4">
      <div className="relative mx-auto flex max-w-xs flex-col items-center gap-2">
        <motion.div
          className={`rounded-lg border px-6 py-2 font-mono text-sm ${
            phase === 0 ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40' : 'border-fd-border bg-fd-muted/30'
          }`}
        >
          x
        </motion.div>

        <div className="relative flex w-full justify-center">
          <motion.div
            className="absolute -left-2 top-0 h-full w-8 rounded-l-full border-l-2 border-t-2 border-indigo-400"
            animate={{ opacity: phase >= 2 ? 1 : 0.3 }}
          />
          <motion.div
            className={`z-10 rounded-lg border px-6 py-2 font-mono text-sm ${
              phase === 1 ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' : 'border-fd-border bg-fd-muted/30'
            }`}
            animate={phase === 1 ? { scale: 1.04 } : { scale: 1 }}
          >
            sublayer(x)
          </motion.div>
        </div>

        <motion.div
          className="text-lg text-fd-muted-foreground"
          animate={{ opacity: phase >= 2 ? 1 : 0.3, scale: phase >= 2 ? 1.1 : 1 }}
        >
          +
        </motion.div>

        <motion.div
          className={`rounded-lg border px-6 py-2 font-mono text-sm font-semibold ${
            phase >= 2 ? 'border-violet-500 bg-violet-500 text-white' : 'border-fd-border bg-fd-muted/30'
          }`}
        >
          x + sublayer(x)
        </motion.div>
      </div>
      <DataLabel bn="মূল signal skip করে যোগ হয় — gradient flow সহজ" en="residual" />
    </div>
  );
}
