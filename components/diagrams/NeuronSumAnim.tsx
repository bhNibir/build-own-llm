'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, FlowConnector, SketchBox } from './diagram-ui';

const INPUTS = [
  { x: 0.8, w: 0.5 },
  { x: 0.3, w: -0.4 },
  { x: 0.6, w: 0.9 },
];
const BIAS = 0.1;

export function NeuronSumAnim({ paused }: { paused?: boolean }) {
  const [phase, setPhase] = useState(0);
  const sum = INPUTS.reduce((s, p) => s + p.x * p.w, BIAS);
  const out = Math.max(0, sum);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setPhase((p) => (p + 1) % 4), 1500);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-4">
      <DataLabel bn="নিউরন — ওয়েটেড যোগফল + ReLU" en="Σ xᵢwᵢ + b → ReLU" />
      <div className="flex flex-wrap items-center justify-center gap-2">
        {INPUTS.map((p, i) => (
          <div key={i} className="flex items-center gap-1">
            <SketchBox
              fillStyle="solid"
              palette={phase < 3 && phase === i ? 'blue' : 'neutral'}
              active={phase < 3 && phase === i}
              className="font-mono text-xs"
            >
              {p.x}×{p.w}
            </SketchBox>
            {i < INPUTS.length - 1 && <span className="text-fd-muted-foreground">+</span>}
          </div>
        ))}
        <span className="text-fd-muted-foreground">+ {BIAS}</span>
        <FlowConnector />
        <SketchBox fillStyle="solid" palette={phase === 1 ? 'amber' : 'neutral'} active={phase === 1}>
          {sum.toFixed(2)}
        </SketchBox>
        <FlowConnector />
        <SketchBox fillStyle="solid" palette={phase >= 2 ? 'green' : 'neutral'} active={phase >= 2}>
          {out.toFixed(2)}
        </SketchBox>
      </div>
      <motion.div animate={{ opacity: phase === 3 ? 1 : 0.5 }}>
        <DataLabel bn="ওয়েটেড যোগফল → অ্যাক্টিভেশন" en="weighted sum → activation" />
      </motion.div>
    </div>
  );
}
