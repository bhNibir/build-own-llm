'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, SketchBox, StepDots } from './diagram-ui';

const TOKENS = ['i', 'like', 'apple'];

export function ContextWindowAnim({ paused }: { paused?: boolean }) {
  const [pos, setPos] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setPos((p) => (p + 1) % TOKENS.length), 1600);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-4">
      <StepDots total={TOKENS.length} current={pos} onSelect={setPos} />
      <DataLabel bn="১-শব্দ context window" en="context = 1" />
      <div className="flex justify-center gap-2">
        {TOKENS.map((w, i) => (
          <motion.div
            key={w}
            animate={{ scale: i === pos ? 1.06 : 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            <SketchBox
              fillStyle={i === pos ? 'hachure' : 'solid'}
              palette={i === pos ? 'blue' : 'neutral'}
              active={i === pos}
              className="min-w-[4rem] text-center font-semibold"
            >
              {w}
            </SketchBox>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2">
        <SketchBox fillStyle="solid" palette="blue" active className="text-center">
          {TOKENS[pos]}
        </SketchBox>
        <span className="text-xs text-fd-muted-foreground">→ predict next</span>
        <SketchBox fillStyle="solid" palette="neutral" className="text-center text-fd-muted-foreground">
          {TOKENS[pos + 1] ?? '?'}
        </SketchBox>
      </div>
    </div>
  );
}
