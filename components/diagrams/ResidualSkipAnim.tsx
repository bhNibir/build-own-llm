'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, SketchBox, StepDots } from './diagram-ui';

export function ResidualSkipAnim({ paused }: { paused?: boolean }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setPhase((p) => (p + 1) % 3), 1500);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-4">
      <StepDots total={3} current={phase} onSelect={setPhase} />
      <DataLabel bn="মূল signal skip করে যোগ হয় — gradient flow সহজ" en="residual" />
      <div className="relative mx-auto flex max-w-xs flex-col items-center gap-2">
        <SketchBox
          fillStyle={phase === 0 ? 'hachure' : 'solid'}
          palette={phase === 0 ? 'blue' : 'neutral'}
          active={phase === 0}
          className="px-6 py-2 font-mono text-sm"
        >
          x
        </SketchBox>

        <div className="relative flex w-full justify-center">
          <motion.div
            className="absolute -left-2 top-0 h-full w-8 rounded-l-full border-l-2 border-t-2 border-indigo-400"
            animate={{ opacity: phase >= 2 ? 1 : 0.3 }}
          />
          <motion.div animate={phase === 1 ? { scale: 1.04 } : { scale: 1 }}>
            <SketchBox
              fillStyle={phase === 1 ? 'hachure' : 'solid'}
              palette={phase === 1 ? 'green' : 'neutral'}
              active={phase === 1}
              className="z-10 px-6 py-2 font-mono text-sm"
            >
              sublayer(x)
            </SketchBox>
          </motion.div>
        </div>

        <motion.div
          className="text-lg text-fd-muted-foreground"
          animate={{ opacity: phase >= 2 ? 1 : 0.3, scale: phase >= 2 ? 1.1 : 1 }}
        >
          +
        </motion.div>

        <SketchBox
          fillStyle={phase >= 2 ? 'hachure' : 'solid'}
          palette={phase >= 2 ? 'violet' : 'neutral'}
          active={phase >= 2}
          className="px-6 py-2 font-mono text-sm font-semibold"
        >
          x + sublayer(x)
        </SketchBox>
      </div>
    </div>
  );
}
