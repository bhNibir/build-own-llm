'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel } from './diagram-ui';

const N_BLOCKS = 4;

export function GptStackAnim({ paused }: { paused?: boolean }) {
  const [signal, setSignal] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setSignal((s) => (s + 1) % (N_BLOCKS + 2)), 900);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-1">
        <motion.div
          className={`rounded-lg border px-4 py-1.5 text-xs font-mono ${
            signal === 0 ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40' : 'border-fd-border bg-fd-muted/30'
          }`}
        >
          token + pos embed
        </motion.div>

        <span className="text-fd-muted-foreground">↓</span>

        {Array.from({ length: N_BLOCKS }, (_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <motion.div
              className={`w-36 rounded-lg border py-2 text-center text-xs font-medium ${
                signal === i + 1
                  ? 'border-indigo-500 bg-indigo-500 text-white'
                  : signal > i + 1
                    ? 'border-emerald-400/60 bg-emerald-50/60 dark:bg-emerald-950/30'
                    : 'border-fd-border bg-fd-muted/20'
              }`}
              animate={signal === i + 1 ? { scale: 1.03 } : { scale: 1 }}
            >
              Block {i + 1}
            </motion.div>
            {i < N_BLOCKS - 1 && <span className="text-fd-muted-foreground">↓</span>}
          </div>
        ))}

        <span className="text-fd-muted-foreground">↓</span>

        <motion.div
          className={`rounded-lg border px-4 py-1.5 text-xs font-mono ${
            signal === N_BLOCKS + 1 ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/40' : 'border-fd-border bg-fd-muted/30'
          }`}
        >
          lm_head → logits
        </motion.div>
      </div>
      <DataLabel bn="Nটি block stack — signal উপরে উঠে" en="n_layer" />
    </div>
  );
}
