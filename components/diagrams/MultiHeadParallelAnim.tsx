'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, SketchBox, StepDots } from './diagram-ui';

const HEADS = 3;
const MINI = [
  [0.7, 0.2, 0.1],
  [0.1, 0.8, 0.1],
  [0.3, 0.3, 0.4],
];
const PALETTES = ['blue', 'green', 'violet'] as const;

export function MultiHeadParallelAnim({ paused }: { paused?: boolean }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % HEADS), 1400);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-4">
      <StepDots total={HEADS} current={active} onSelect={setActive} />
      <DataLabel bn="hটি head সমান্তরালে চলে, শেষে মিলিয়ে যায়" en="multi-head" />
      <div className="flex flex-wrap justify-center gap-3">
        {Array.from({ length: HEADS }, (_, h) => (
          <motion.div
            key={h}
            animate={active === h ? { scale: 1.03 } : { scale: 1 }}
          >
            <SketchBox
              fillStyle={active === h ? 'hachure' : 'solid'}
              palette={active === h ? PALETTES[h] : 'neutral'}
              active={active === h}
              className="p-3"
            >
              <p className="mb-2 text-center text-xs font-semibold">Head {h + 1}</p>
              <div className="grid grid-cols-3 gap-2">
                {MINI.flatMap((row, r) =>
                  row.map((w, c) => (
                    <div
                      key={`${h}-${r}-${c}`}
                      className="flex h-7 w-7 items-center justify-center rounded font-mono text-[9px] text-white"
                      style={{ backgroundColor: `rgba(79, 70, 229, ${Math.max(w, 0.2)})` }}
                    >
                      {w.toFixed(1)}
                    </div>
                  )),
                )}
              </div>
            </SketchBox>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-center">
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <SketchBox fillStyle="solid" palette="amber" className="px-4 py-2 font-mono text-xs">
            concat → linear
          </SketchBox>
        </motion.div>
      </div>
    </div>
  );
}
