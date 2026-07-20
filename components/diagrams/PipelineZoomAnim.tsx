'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Type, List, Hash, Link2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const PART1_STEPS: { label: string; icon: LucideIcon }[] = [
  { label: 'Tokenizer', icon: Type },
  { label: 'Vocab', icon: List },
  { label: 'Encode', icon: Hash },
  { label: 'Pairs', icon: Link2 },
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
      <p className="text-center text-xs text-fd-muted-foreground">Module 1 focus — বাকি steps পরে</p>
      <div className="flex flex-wrap justify-center gap-2">
        {PART1_STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              className={`flex flex-col items-center rounded-lg border px-3 py-2 ${
                active === i
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40'
                  : 'border-fd-border bg-fd-muted/20 opacity-50'
              }`}
              animate={active === i ? { scale: 1.05 } : { scale: 1 }}
            >
              <Icon className="h-4 w-4" />
              <span className="mt-1 text-[10px] font-medium">{s.label}</span>
            </motion.div>
          );
        })}
        <span className="flex items-center text-xs text-fd-muted-foreground">… Model → Predict</span>
      </div>
    </div>
  );
}
