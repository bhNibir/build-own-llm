'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { FRUIT_DATASET } from './shared-data';

export function CorpusCardsAnim({ paused }: { paused?: boolean }) {
  const [highlight, setHighlight] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setHighlight((h) => (h + 1) % FRUIT_DATASET.length), 1200);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {FRUIT_DATASET.map((s, i) => (
          <motion.div
            key={s}
            className={`rounded-lg border px-2 py-1.5 text-center font-mono text-[11px] ${
              highlight === i
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                : 'border-fd-border bg-fd-muted/20'
            }`}
            animate={highlight === i ? { scale: 1.03 } : { scale: 1 }}
          >
            {s}
          </motion.div>
        ))}
      </div>
      <p className="text-center text-xs text-fd-muted-foreground">
        Corpus = {FRUIT_DATASET.length} sentences — model এগুলো দেখে pattern শেখে
      </p>
    </div>
  );
}
