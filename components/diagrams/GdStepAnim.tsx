'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, SketchBox, StepDots } from './diagram-ui';

const POINTS = [
  { w: 3.5, loss: 2.8 },
  { w: 2.8, loss: 1.6 },
  { w: 2.1, loss: 0.9 },
  { w: 1.5, loss: 0.4 },
  { w: 1.0, loss: 0.15 },
];

export function GdStepAnim({ paused }: { paused?: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setStep((s) => (s + 1) % POINTS.length), 1600);
    return () => clearInterval(t);
  }, [paused]);

  const pt = POINTS[step];
  const sx = 20 + (pt.w / 4) * 140;
  const sy = 20 + (pt.loss / 3) * 80;

  return (
    <div className="space-y-3">
      <StepDots total={POINTS.length} current={step} onSelect={setStep} />
      <DataLabel bn="গ্র্যাডিয়েন্ট ডিসেন্ট — ধাপে ধাপে নামে" en="W ← W − η∇L" />
      <svg viewBox="0 0 180 110" className="mx-auto h-32 w-full max-w-sm rounded-lg border border-fd-border bg-fd-muted/10">
        {/* grid + axes */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <line x1={20 + i * 35} y1={10} x2={20 + i * 35} y2={100} stroke="currentColor" className="text-fd-border" strokeWidth={0.5} />
            <line x1={15} y1={20 + i * 20} x2={170} y2={20 + i * 20} stroke="currentColor" className="text-fd-border" strokeWidth={0.5} />
          </g>
        ))}
        <line x1={15} y1={100} x2={170} y2={100} stroke="currentColor" className="text-fd-muted-foreground" strokeWidth={1.5} />
        <line x1={20} y1={10} x2={20} y2={100} stroke="currentColor" className="text-fd-muted-foreground" strokeWidth={1.5} />
        <text x={90} y={108} textAnchor="middle" className="fill-fd-muted-foreground text-[7px] font-mono">W →</text>
        <text x={8} y={55} textAnchor="middle" className="fill-fd-muted-foreground text-[7px] font-mono" transform="rotate(-90 8 55)">L</text>
        <path
          d={POINTS.map((p, i) => `${i === 0 ? 'M' : 'L'}${20 + (p.w / 4) * 140},${20 + (p.loss / 3) * 80}`).join(' ')}
          fill="none" stroke="currentColor" className="text-indigo-300 dark:text-indigo-700" strokeWidth={2}
        />
        {POINTS.map((p, i) => (
          <circle key={i} cx={20 + (p.w / 4) * 140} cy={20 + (p.loss / 3) * 80} r={3}
            className={i <= step ? 'fill-indigo-500' : 'fill-fd-muted'} />
        ))}
        <motion.circle
          cx={sx} cy={sy} r={6}
          className="fill-indigo-500 stroke-2 stroke-fd-card"
          animate={{ cx: sx, cy: sy }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        />
      </svg>
      <div className="flex justify-center gap-3">
        <SketchBox fillStyle="solid" palette="blue" active>
          W = {pt.w.toFixed(1)}
        </SketchBox>
        <SketchBox fillStyle="solid" palette="amber">
          L = {pt.loss.toFixed(2)}
        </SketchBox>
      </div>
    </div>
  );
}
