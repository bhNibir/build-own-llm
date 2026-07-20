'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { StepChip, StepDots } from './diagram-ui';

const BANDS = [
  { id: 'M0', label: 'Intro', modules: '0' },
  { id: 'M1-2', label: 'Data', modules: '1–2' },
  { id: 'M3-5', label: 'Foundations', modules: '3–5' },
  { id: 'M6-9', label: 'Architecture', modules: '6–9' },
  { id: 'M10', label: 'Bridge', modules: '10' },
];

export function RoadmapSpineAnim({ paused }: { paused?: boolean }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % BANDS.length), 2000);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-4">
      <StepDots total={BANDS.length} current={active} onSelect={setActive} />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:justify-center">
        {BANDS.map((b, i) => (
          <div key={b.id} className="flex items-center gap-2 sm:flex-col sm:gap-1">
            <motion.div
              className={`flex flex-1 flex-col items-center rounded-xl border px-4 py-3 text-center ${
                active === i
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40'
                  : 'border-fd-border bg-fd-muted/20'
              }`}
              animate={active === i ? { scale: 1.02 } : { scale: 1 }}
            >
              <span className="text-xs font-semibold text-fd-muted-foreground">{b.id}</span>
              <span className="text-sm font-medium">{b.label}</span>
              <span className="text-[10px] text-fd-muted-foreground">Module {b.modules}</span>
            </motion.div>
            {i < BANDS.length - 1 && (
              <span className="hidden text-fd-muted-foreground sm:block">→</span>
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-fd-muted-foreground">
        শেখার ক্রম: Intro → Tokenizer/Bigram → Math/Autograd/NN → LM/Attention/Transformer/GPT → Production
      </p>
    </div>
  );
}
