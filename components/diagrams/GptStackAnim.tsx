'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, SketchBox } from './diagram-ui';

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
        <SketchBox
          fillStyle="solid"
          palette={signal === 0 ? 'blue' : 'neutral'}
          active={signal === 0}
          className="px-4 py-1.5 font-mono text-xs"
        >
          token + pos embed
        </SketchBox>

        <span className="text-fd-muted-foreground">↓</span>

        {Array.from({ length: N_BLOCKS }, (_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <motion.div animate={signal === i + 1 ? { scale: 1.03 } : { scale: 1 }}>
              <SketchBox
                fillStyle={signal === i + 1 ? 'hachure' : 'solid'}
                palette={
                  signal === i + 1 ? 'blue' : signal > i + 1 ? 'green' : 'neutral'
                }
                active={signal === i + 1}
                className="w-36 py-2 text-center text-xs font-medium"
              >
                Block {i + 1}
              </SketchBox>
            </motion.div>
            {i < N_BLOCKS - 1 && <span className="text-fd-muted-foreground">↓</span>}
          </div>
        ))}

        <span className="text-fd-muted-foreground">↓</span>

        <SketchBox
          fillStyle="solid"
          palette={signal === N_BLOCKS + 1 ? 'violet' : 'neutral'}
          active={signal === N_BLOCKS + 1}
          className="px-4 py-1.5 font-mono text-xs"
        >
          lm_head → logits
        </SketchBox>
      </div>
      <DataLabel bn="Nটি block stack — signal উপরে উঠে" en="n_layer" />
    </div>
  );
}
