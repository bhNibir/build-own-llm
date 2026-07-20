'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, SketchBox } from './diagram-ui';

const VALUES = [
  { label: 'x', data: 2.0, grad: 0.0 },
  { label: 'w', data: 3.0, grad: 0.0 },
  { label: 'y', data: 6.0, grad: 1.0 },
];

export function ValueTapeAnim({ paused }: { paused?: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setStep((s) => (s + 1) % (VALUES.length + 1)), 1600);
    return () => clearInterval(t);
  }, [paused]);

  const rows = VALUES.map((v, i) =>
    step > i ? { ...v, grad: i === 2 ? 1.0 : v.grad + 0.5 * (step - i) } : v,
  );

  return (
    <div className="space-y-3">
      <DataLabel bn="Value টেপ — data ও grad একসাথে" en="data + grad" />
      <div className="mx-auto max-w-xs overflow-hidden rounded-lg border border-fd-border">
        <div className="grid grid-cols-3 border-b border-fd-border bg-fd-muted/40 text-xs font-semibold">
          <span className="px-3 py-1.5">name</span>
          <span className="border-l border-fd-border px-3 py-1.5">data</span>
          <span className="border-l border-fd-border px-3 py-1.5">grad</span>
        </div>
        {rows.map((v, i) => (
          <motion.div
            key={v.label}
            className="grid grid-cols-3 border-b border-fd-border last:border-b-0"
            animate={{ backgroundColor: step === i ? 'rgba(99,102,241,0.08)' : 'transparent' }}
          >
            <span className="px-3 py-2 font-mono text-sm">{v.label}</span>
            <SketchBox fillStyle="solid" palette="neutral" className="m-1 border-0 bg-transparent px-2 py-1 text-center font-mono text-sm">
              {v.data.toFixed(1)}
            </SketchBox>
            <SketchBox
              fillStyle="solid"
              palette={step > i ? 'violet' : 'neutral'}
              active={step > i}
              className="m-1 px-2 py-1 text-center font-mono text-sm"
            >
              {v.grad.toFixed(1)}
            </SketchBox>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
