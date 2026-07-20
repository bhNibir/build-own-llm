'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, FlowConnector, StepChip } from './diagram-ui';

const CHAIN = ['i', 'like', 'apple', 'i', 'like'];

export function GenerateChainAnim({ paused }: { paused?: boolean }) {
  const [len, setLen] = useState(1);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setLen((l) => (l >= CHAIN.length ? 1 : l + 1)), 1200);
    return () => clearInterval(t);
  }, [paused]);

  const visible = CHAIN.slice(0, len);

  return (
    <div className="space-y-4">
      <DataLabel bn="Autoregressive generation" en="one token at a time" />
      <div className="flex flex-wrap items-center justify-center gap-1">
        {visible.map((w, i) => (
          <div key={`${w}-${i}`} className="flex items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            >
              <StepChip label={w} active={i === visible.length - 1} done={i < visible.length - 1} />
            </motion.div>
            {i < visible.length - 1 && <FlowConnector />}
          </div>
        ))}
        {len < CHAIN.length && (
          <>
            <FlowConnector />
            <StepChip label="..." />
          </>
        )}
      </div>
      <p className="text-center font-mono text-xs text-fd-muted-foreground">
        context → model → next token → append → repeat
      </p>
    </div>
  );
}
