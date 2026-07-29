'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, SketchBox, StepDots } from './diagram-ui';

const MAP = [
  { module: 'M7 Attention', file: 'CausalSelfAttention' },
  { module: 'M8 Transformer', file: 'Block' },
  { module: 'M8 FFN', file: 'MLP' },
  { module: 'M9 Training', file: 'train.py' },
  { module: 'M9 Generate', file: 'sample.py' },
];

export function CodeMapAnim({ paused }: { paused?: boolean }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % MAP.length), 1400);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-4">
      <StepDots total={MAP.length} current={active} onSelect={setActive} />
      <DataLabel bn="course module সরাসরি nanoGPT code-এ map" en="code map" />
      <div className="mx-auto max-w-md space-y-2">
        {MAP.map((row, i) => (
          <motion.div
            key={row.module}
            animate={active === i ? { x: 4 } : { x: 0 }}
          >
            <SketchBox
              fillStyle={active === i ? 'hachure' : 'solid'}
              palette={active === i ? 'blue' : 'neutral'}
              active={active === i}
              className="flex items-center gap-2 px-3 py-2"
            >
              <span className="w-[110px] shrink-0 text-xs font-medium">{row.module}</span>
              <motion.span
                className="text-fd-muted-foreground"
                animate={active === i ? { opacity: 1 } : { opacity: 0.4 }}
              >
                →
              </motion.span>
              <span className="font-mono text-xs text-indigo-700 dark:text-indigo-300">
                model.py → {row.file}
              </span>
            </SketchBox>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
