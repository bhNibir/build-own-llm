'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, PlotFrame, SketchBox, StepDots } from './diagram-ui';

const DIM = 8;
const POS = 2;

function sineVal(i: number, pos: number) {
  const freq = (i % 2 === 0 ? 1 : 2) * Math.PI / DIM;
  return Math.sin(pos * freq);
}

export function PositionalSineAnim({ paused }: { paused?: boolean }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setPhase((p) => (p + 1) % 3), 1600);
    return () => clearInterval(t);
  }, [paused]);

  const embed = Array.from({ length: DIM }, (_, i) => 0.3 + i * 0.05);
  const posEnc = Array.from({ length: DIM }, (_, i) => sineVal(i, POS));
  const combined = embed.map((e, i) => e + posEnc[i]);

  return (
    <div className="space-y-4">
      <StepDots total={3} current={phase} onSelect={setPhase} />
      <DataLabel bn={`পজিশন = ${POS}`} en="PE(pos)" />
      <PlotFrame xLabel="dim" yLabel="value" className="max-w-lg">
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { label: 'token embed', vals: embed, show: phase >= 0, palette: 'neutral' as const },
            { label: 'pos encode', vals: posEnc, show: phase >= 1, palette: 'green' as const },
            { label: 'sum', vals: combined, show: phase >= 2, palette: 'blue' as const },
          ].map((block) => (
            <motion.div
              key={block.label}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: block.show ? 1 : 0.35, scale: block.show ? 1 : 0.97 }}
              className="text-center"
            >
              <SketchBox
                fillStyle="solid"
                palette={block.show ? block.palette : 'neutral'}
                className="mb-1 px-2 py-0.5 text-xs font-semibold"
              >
                {block.label}
              </SketchBox>
              <div className="flex h-16 items-end gap-2">
                {block.vals.map((v, i) => (
                  <motion.div
                    key={i}
                    className={`w-2 rounded-t ${
                      block.label === 'sum' ? 'bg-indigo-500' : block.label === 'pos encode' ? 'bg-emerald-500' : 'bg-fd-muted-foreground/40'
                    }`}
                    animate={{ height: `${Math.abs(v) * 48 + 4}px` }}
                    transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </PlotFrame>
      <DataLabel bn="sine/cosine wave position তথ্য যোগ করে" en="PE(pos)" />
    </div>
  );
}
