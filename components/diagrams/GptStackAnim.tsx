'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, SketchBox, StepDots } from './diagram-ui';

const N_BLOCKS = 4;

export function GptStackAnim({ paused }: { paused?: boolean }) {
  const [signal, setSignal] = useState(0);
  const total = N_BLOCKS + 2;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setSignal((s) => (s + 1) % total), 900);
    return () => clearInterval(t);
  }, [paused, total]);

  return (
    <div className="space-y-4">
      <StepDots total={total} current={signal} onSelect={setSignal} />
      <DataLabel bn="Nটি block stack — signal উপরে উঠে" en="n_layer" />
      <div className="mx-auto flex max-w-sm flex-col items-center py-2" style={{ perspective: '700px' }}>
        <div
          className="flex w-full flex-col items-center gap-2"
          style={{ transformStyle: 'preserve-3d', transform: 'rotateX(12deg)' }}
        >
          <SketchBox
            fillStyle="solid"
            palette={signal === 0 ? 'blue' : 'neutral'}
            active={signal === 0}
            className="px-4 py-2 font-mono text-xs shadow-md"
          >
            token + pos embed
          </SketchBox>

          <span className="text-fd-muted-foreground">↓</span>

          {Array.from({ length: N_BLOCKS }, (_, i) => (
            <div key={i} className="flex w-full flex-col items-center gap-2">
              <motion.div
                className="w-44"
                animate={signal === i + 1 ? { scale: 1.04 } : { scale: 1 }}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `translateZ(${(N_BLOCKS - i) * 10}px)`,
                }}
              >
                <SketchBox
                  fillStyle={signal === i + 1 ? 'hachure' : 'solid'}
                  palette={
                    signal === i + 1 ? 'blue' : signal > i + 1 ? 'green' : 'neutral'
                  }
                  active={signal === i + 1}
                  className="w-full py-2.5 text-center text-xs font-medium shadow-lg"
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
            className="px-4 py-2 font-mono text-xs shadow-md"
          >
            lm_head → logits
          </SketchBox>
        </div>
      </div>
    </div>
  );
}
