'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, SketchBox } from './diagram-ui';
import { FRUIT_DATASET } from './shared-data';

export function CorpusCardsAnim({ paused }: { paused?: boolean }) {
  const [highlight, setHighlight] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setHighlight((h) => (h + 1) % FRUIT_DATASET.length), 1400);
    return () => clearInterval(t);
  }, [paused]);

  const current = FRUIT_DATASET[highlight];

  return (
    <div className="space-y-4">
      <DataLabel bn="Corpus = সব training sentence" en="training dataset" />
      <AnimatePresence mode="wait">
        <motion.p
          key={highlight}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-center font-mono text-sm font-medium"
        >
          Reading {highlight + 1}/{FRUIT_DATASET.length}: &quot;{current}&quot;
        </motion.p>
      </AnimatePresence>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {FRUIT_DATASET.map((s, i) => (
          <motion.div key={s} animate={highlight === i ? { scale: 1.04 } : { scale: 1 }}>
            <SketchBox
              fillStyle={highlight === i ? 'hachure' : 'solid'}
              strokeStyle={highlight === i ? 'solid' : 'dotted'}
              palette={highlight === i ? 'blue' : 'neutral'}
              active={highlight === i}
              className="text-center font-mono text-[11px] leading-tight"
            >
              {s}
            </SketchBox>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
