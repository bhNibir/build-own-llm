'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel } from './diagram-ui';

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
      <p className="text-center text-xs font-mono text-indigo-600">position = {POS}</p>
      <div className="flex flex-wrap justify-center gap-4">
        {[
          { label: 'token embed', vals: embed, show: phase >= 0 },
          { label: 'pos encode', vals: posEnc, show: phase >= 1 },
          { label: 'sum', vals: combined, show: phase >= 2 },
        ].map((block) => (
          <motion.div
            key={block.label}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: block.show ? 1 : 0.35, scale: block.show ? 1 : 0.97 }}
            className="text-center"
          >
            <p className="mb-1 text-xs font-semibold">{block.label}</p>
            <div className="flex h-16 items-end gap-0.5">
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
      <DataLabel bn="sine/cosine wave position তথ্য যোগ করে" en="PE(pos)" />
    </div>
  );
}
