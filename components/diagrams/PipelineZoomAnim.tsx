'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Type, List, Hash, Link2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { DataLabel, SketchBox } from './diagram-ui';

const PART1_STEPS: { label: string; icon: LucideIcon; palette: 'blue' | 'green' | 'amber' | 'violet' }[] = [
  { label: 'Tokenizer', icon: Type, palette: 'blue' },
  { label: 'Vocab', icon: List, palette: 'green' },
  { label: 'Encode', icon: Hash, palette: 'amber' },
  { label: 'Pairs', icon: Link2, palette: 'violet' },
];

export function PipelineZoomAnim({ paused }: { paused?: boolean }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % PART1_STEPS.length), 1500);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-4">
      <DataLabel bn="Module 1 focus — বাকি steps পরে" en="tokenizer → pairs" />
      <div className="flex flex-wrap justify-center gap-2">
        {PART1_STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              animate={active === i ? { scale: 1.05 } : { scale: 1 }}
              className={active !== i ? 'opacity-50' : undefined}
            >
              <SketchBox
                fillStyle={active === i ? 'hachure' : 'solid'}
                palette={active === i ? s.palette : 'neutral'}
                active={active === i}
                className="flex flex-col items-center px-3 py-2"
              >
                <Icon className="h-4 w-4" />
                <span className="mt-1 text-[10px] font-medium">{s.label}</span>
              </SketchBox>
            </motion.div>
          );
        })}
        <span className="flex items-center text-xs text-fd-muted-foreground">… Model → Predict</span>
      </div>
    </div>
  );
}
