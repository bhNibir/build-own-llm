'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, SketchBox, StepDots } from './diagram-ui';

const POINTS = [
  { x: 20, y: 80, label: '0,0', out: 0 },
  { x: 80, y: 20, label: '1,1', out: 0 },
  { x: 20, y: 20, label: '0,1', out: 1 },
  { x: 80, y: 80, label: '1,0', out: 1 },
];
const LOSSES = [0.69, 0.45, 0.28, 0.12];

export function XorPlotAnim({ paused }: { paused?: boolean }) {
  const [epoch, setEpoch] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setEpoch((e) => (e + 1) % LOSSES.length), 1600);
    return () => clearInterval(t);
  }, [paused]);

  const loss = LOSSES[epoch];
  const boundary = 20 + epoch * 12;

  return (
    <div className="space-y-3">
      <StepDots total={LOSSES.length} current={epoch} onSelect={setEpoch} />
      <DataLabel bn="XOR সমস্যা — নন-লিনিয়ার সীমানা" en="non-linear boundary" />
      <div className="flex flex-wrap items-start justify-center gap-6">
        <svg viewBox="0 0 100 100" className="h-36 w-36 rounded-lg border border-fd-border bg-fd-muted/10">
          {/* grid + axes */}
          {[20, 40, 60, 80].map((v) => (
            <g key={v}>
              <line x1={v} y1={0} x2={v} y2={100} stroke="currentColor" className="text-fd-border" strokeWidth={0.4} />
              <line x1={0} y1={v} x2={100} y2={v} stroke="currentColor" className="text-fd-border" strokeWidth={0.4} />
            </g>
          ))}
          <line x1={0} y1={100} x2={100} y2={100} stroke="currentColor" className="text-fd-muted-foreground" strokeWidth={1.2} />
          <line x1={0} y1={0} x2={0} y2={100} stroke="currentColor" className="text-fd-muted-foreground" strokeWidth={1.2} />
          <motion.line
            x1={boundary} y1={0} x2={100 - boundary} y2={100}
            stroke="currentColor" className="text-indigo-400" strokeWidth={1.5} strokeDasharray="4 3"
            animate={{ x1: boundary, x2: 100 - boundary }}
          />
          {POINTS.map((p) => (
            <circle key={p.label} cx={p.x} cy={p.y} r={7}
              className={p.out ? 'fill-indigo-500' : 'fill-fd-muted stroke-fd-border stroke-2'} />
          ))}
        </svg>
        <div className="space-y-2">
          <div className="flex h-24 items-end gap-2">
            {LOSSES.map((l, i) => (
              <motion.div
                key={i}
                className="w-5 rounded-t border border-fd-border bg-indigo-500/60"
                animate={{ height: `${(l / 0.7) * 100}%`, opacity: i <= epoch ? 1 : 0.25 }}
                transition={{ type: 'spring', stiffness: 180, damping: 20 }}
              />
            ))}
          </div>
          <SketchBox fillStyle="solid" palette="blue" active className="text-center text-sm">
            loss = {loss.toFixed(2)}
          </SketchBox>
        </div>
      </div>
      <div className="flex justify-center gap-2">
        {POINTS.map((p) => (
          <SketchBox key={p.label} fillStyle="solid" palette={p.out ? 'green' : 'neutral'} className="text-[10px]">
            {p.label}→{p.out}
          </SketchBox>
        ))}
      </div>
    </div>
  );
}
