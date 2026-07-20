'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, SketchBox, StepDots } from './diagram-ui';

const V = [1, 2];
const SCALE = 28;
const ORIGIN = { x: 40, y: 120 };

export function VectorAxisAnim({ paused }: { paused?: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (paused) return;
    setShow(true);
    const t = setInterval(() => setShow((s) => !s), 2400);
    return () => clearInterval(t);
  }, [paused]);

  const tip = { x: ORIGIN.x + V[0] * SCALE, y: ORIGIN.y - V[1] * SCALE };

  return (
    <div className="space-y-3">
      <StepDots total={2} current={show ? 1 : 0} onSelect={(i) => setShow(i === 1)} />
      <DataLabel bn="ভেক্টর ২D গ্রিডে" en="v = [1, 2]" />
      <svg viewBox="0 0 200 140" className="mx-auto h-36 w-full max-w-xs rounded-lg border border-fd-border bg-fd-muted/10">
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <line x1={ORIGIN.x + i * SCALE} y1={ORIGIN.y} x2={ORIGIN.x + i * SCALE} y2={20} stroke="currentColor" className="text-fd-border" strokeWidth={0.5} />
            <line x1={ORIGIN.x} y1={ORIGIN.y - i * SCALE} x2={180} y2={ORIGIN.y - i * SCALE} stroke="currentColor" className="text-fd-border" strokeWidth={0.5} />
          </g>
        ))}
        <line x1={ORIGIN.x} y1={ORIGIN.y} x2={180} y2={ORIGIN.y} stroke="currentColor" className="text-fd-muted-foreground" strokeWidth={1.5} markerEnd="url(#arrow)" />
        <line x1={ORIGIN.x} y1={ORIGIN.y} x2={ORIGIN.x} y2={20} stroke="currentColor" className="text-fd-muted-foreground" strokeWidth={1.5} markerEnd="url(#arrow)" />
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="currentColor" className="text-fd-muted-foreground" />
          </marker>
        </defs>
        <motion.line
          x1={ORIGIN.x} y1={ORIGIN.y} x2={tip.x} y2={tip.y}
          stroke="currentColor" className="text-indigo-500" strokeWidth={2.5}
          initial={{ pathLength: 0 }} animate={{ pathLength: show ? 1 : 0 }}
          transition={{ duration: 0.8 }}
        />
        <circle cx={tip.x} cy={tip.y} r={3} className="fill-indigo-500" />
      </svg>
      <div className="flex justify-center">
        <SketchBox fillStyle="solid" palette={show ? 'blue' : 'neutral'} active={show} className="font-semibold">
          v = [{V.join(', ')}]
        </SketchBox>
      </div>
    </div>
  );
}
