'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, SketchBox, StepDots } from './diagram-ui';

const STEPS = ['LayerNorm', 'Attention', '+ Residual', 'LayerNorm', 'FFN', '+ Residual'];
const PALETTES = ['blue', 'violet', 'green', 'blue', 'amber', 'green'] as const;

export function TransformerBlockAnim({ paused }: { paused?: boolean }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % STEPS.length), 1100);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-4">
      <StepDots total={STEPS.length} current={active} onSelect={setActive} />
      <DataLabel bn="এক block = Norm → Attn → Res → FFN → Res" en="TransformerBlock" />
      <div className="mx-auto max-w-[220px] py-2" style={{ perspective: '600px' }}>
        <div
          className="flex flex-col gap-2 rounded-xl border border-dashed border-fd-border bg-fd-muted/20 p-4"
          style={{ transformStyle: 'preserve-3d', transform: 'rotateY(-8deg) rotateX(6deg)' }}
        >
          {STEPS.map((label, i) => (
            <motion.div
              key={label + i}
              animate={active === i ? { x: 6, scale: 1.03 } : { x: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="relative"
              style={{ transform: `translateZ(${(STEPS.length - i) * 6}px)` }}
            >
              <SketchBox
                fillStyle={active === i ? 'hachure' : 'solid'}
                palette={active === i ? PALETTES[i] : 'neutral'}
                active={active === i}
                className="px-3 py-2.5 text-center text-xs font-medium shadow-md"
              >
                {label}
              </SketchBox>
              {label.startsWith('+') && (
                <span className="absolute -left-3 top-1/2 h-0.5 w-3 -translate-y-1/2 bg-indigo-400" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
