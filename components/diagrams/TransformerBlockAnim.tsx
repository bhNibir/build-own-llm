'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, SketchBox } from './diagram-ui';

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
      <div className="mx-auto flex max-w-[180px] flex-col gap-1 rounded-xl border border-dashed border-fd-border p-3">
        {STEPS.map((label, i) => (
          <motion.div
            key={label + i}
            animate={active === i ? { x: 4, scale: 1.02 } : { x: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="relative"
          >
            <SketchBox
              fillStyle={active === i ? 'hachure' : 'solid'}
              palette={active === i ? PALETTES[i] : 'neutral'}
              active={active === i}
              className="px-3 py-2 text-center text-xs font-medium"
            >
              {label}
            </SketchBox>
            {label.startsWith('+') && (
              <span className="absolute -left-3 top-1/2 h-0.5 w-3 -translate-y-1/2 bg-indigo-400" />
            )}
          </motion.div>
        ))}
      </div>
      <DataLabel bn="এক block = Norm → Attn → Res → FFN → Res" en="TransformerBlock" />
    </div>
  );
}
