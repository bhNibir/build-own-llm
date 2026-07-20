'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, FlowConnector, SketchBox } from './diagram-ui';

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
      <DataLabel bn="একটা একটা করে token তৈরি" en="autoregressive generation" />
      <div className="flex flex-wrap items-center justify-center gap-1">
        {visible.map((w, i) => {
          const isLast = i === visible.length - 1;
          const isDone = i < visible.length - 1;
          return (
            <div key={`${w}-${i}`} className="flex items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              >
                <SketchBox
                  fillStyle={isLast ? 'hachure' : 'solid'}
                  palette={isLast ? 'blue' : isDone ? 'green' : 'neutral'}
                  active={isLast}
                  className="px-3 py-1.5 font-mono text-sm font-medium"
                >
                  {w}
                </SketchBox>
              </motion.div>
              {i < visible.length - 1 && <FlowConnector />}
            </div>
          );
        })}
        {len < CHAIN.length && (
          <>
            <FlowConnector />
            <SketchBox fillStyle="solid" palette="neutral" className="px-3 py-1.5 font-mono text-sm">
              ...
            </SketchBox>
          </>
        )}
      </div>
      <DataLabel bn="context → model → next → append → repeat" en="generation loop" />
    </div>
  );
}
