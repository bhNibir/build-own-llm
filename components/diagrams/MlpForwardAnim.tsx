'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, FlowConnector, SketchBox, StepDots } from './diagram-ui';

const LAYERS = ['input', 'hidden', 'output'];

export function MlpForwardAnim({ paused }: { paused?: boolean }) {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setPulse((p) => (p + 1) % (LAYERS.length + 1)), 1300);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-4">
      <StepDots total={LAYERS.length + 1} current={pulse} onSelect={setPulse} />
      <DataLabel bn="MLP ফরওয়ার্ড পাস — সিগন্যাল এগোয়" en="signal propagates" />
      <div className="flex items-center justify-center">
        {LAYERS.map((l, i) => (
          <div key={l} className="flex items-center">
            <motion.div
              animate={{
                scale: pulse === i ? 1.12 : 1,
                opacity: pulse >= i ? 1 : 0.4,
              }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            >
              <SketchBox
                fillStyle={pulse === i ? 'hachure' : 'solid'}
                palette={pulse === i ? 'blue' : pulse > i ? 'green' : 'neutral'}
                active={pulse === i}
                className="px-3 py-1.5 font-mono text-sm font-medium"
              >
                {l}
              </SketchBox>
            </motion.div>
            {i < LAYERS.length - 1 && (
              <motion.div className="relative" animate={{ opacity: pulse > i ? 1 : 0.3 }}>
                <FlowConnector />
              </motion.div>
            )}
          </div>
        ))}
      </div>
      <div className="mx-auto flex h-2 max-w-xs overflow-hidden rounded-full border border-fd-border">
        <motion.div
          className="h-full bg-indigo-500/70"
          animate={{ width: `${(pulse / LAYERS.length) * 100}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 24 }}
        />
      </div>
    </div>
  );
}
