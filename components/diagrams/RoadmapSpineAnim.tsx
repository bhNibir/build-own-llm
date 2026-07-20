'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { SketchBox, StepDots } from './diagram-ui';
import type { SketchFillStyle, SketchStrokeStyle } from './sketch-styles';

const BANDS: {
  id: string;
  label: string;
  modules: string;
  fill: SketchFillStyle;
  stroke: SketchStrokeStyle;
  palette: 'blue' | 'green' | 'violet' | 'amber' | 'rose';
}[] = [
  { id: 'M0', label: 'Intro', modules: '0', fill: 'solid', stroke: 'solid', palette: 'blue' },
  { id: 'M1-2', label: 'Data', modules: '1–2', fill: 'hachure', stroke: 'dashed', palette: 'green' },
  { id: 'M3-5', label: 'Foundations', modules: '3–5', fill: 'cross-hatch', stroke: 'solid', palette: 'violet' },
  { id: 'M6-9', label: 'Architecture', modules: '6–9', fill: 'hachure', stroke: 'dotted', palette: 'amber' },
  { id: 'M10', label: 'Bridge', modules: '10', fill: 'solid', stroke: 'dashed', palette: 'rose' },
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
            <motion.div animate={active === i ? { scale: 1.02 } : { scale: 1 }} className="flex-1">
              <SketchBox
                fillStyle={b.fill}
                strokeStyle={b.stroke}
                palette={b.palette}
                active={active === i}
                className="flex flex-col items-center text-center"
              >
                <span className="text-xs font-semibold opacity-70">{b.id}</span>
                <span className="text-sm font-medium">{b.label}</span>
                <span className="text-[10px] opacity-60">Module {b.modules}</span>
              </SketchBox>
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
