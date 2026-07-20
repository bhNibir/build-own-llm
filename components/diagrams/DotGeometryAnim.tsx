'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, SketchBox, StepDots } from './diagram-ui';

const A = [3, 1];
const B = [1, 2];
const DOT = A[0] * B[0] + A[1] * B[1];
const SCALE = 22;
const O = { x: 30, y: 110 };

export function DotGeometryAnim({ paused }: { paused?: boolean }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setPhase((p) => (p + 1) % 3), 2000);
    return () => clearInterval(t);
  }, [paused]);

  const proj = (A[0] * B[0] + A[1] * B[1]) / (B[0] ** 2 + B[1] ** 2);
  const px = O.x + B[0] * proj * SCALE;
  const py = O.y - B[1] * proj * SCALE;

  return (
    <div className="space-y-3">
      <StepDots total={3} current={phase} onSelect={setPhase} />
      <DataLabel bn="ডট প্রোডাক্ট = প্রজেকশন × দৈর্ঘ্য" en="a·b" />
      <svg viewBox="0 0 180 130" className="mx-auto h-32 w-full max-w-xs">
        {/* grid */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i}>
            <line x1={O.x + i * SCALE} y1={20} x2={O.x + i * SCALE} y2={O.y} stroke="currentColor" className="text-fd-border" strokeWidth={0.5} />
            <line x1={O.x} y1={O.y - i * SCALE} x2={160} y2={O.y - i * SCALE} stroke="currentColor" className="text-fd-border" strokeWidth={0.5} />
          </g>
        ))}
        <line x1={O.x} y1={O.y} x2={160} y2={O.y} stroke="currentColor" className="text-fd-muted-foreground" strokeWidth={1.5} />
        <line x1={O.x} y1={O.y} x2={O.x} y2={20} stroke="currentColor" className="text-fd-muted-foreground" strokeWidth={1.5} />
        <line x1={O.x} y1={O.y} x2={O.x + B[0] * SCALE} y2={O.y - B[1] * SCALE} stroke="currentColor" className="text-emerald-600" strokeWidth={2} strokeDasharray={phase >= 1 ? '0' : '4 3'} />
        <line x1={O.x} y1={O.y} x2={O.x + A[0] * SCALE} y2={O.y - A[1] * SCALE} stroke="currentColor" className="text-indigo-500" strokeWidth={2} />
        {phase >= 2 && (
          <motion.line x1={O.x + A[0] * SCALE} y1={O.y - A[1] * SCALE} x2={px} y2={py}
            stroke="currentColor" className="text-fd-muted-foreground" strokeWidth={1} strokeDasharray="3 2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
        )}
        <circle cx={O.x} cy={O.y} r={2.5} className="fill-fd-foreground" />
      </svg>
      <div className="flex flex-wrap justify-center gap-2">
        <SketchBox fillStyle="solid" palette={phase === 0 ? 'blue' : 'neutral'} active={phase === 0}>
          a = [{A.join(',')}]
        </SketchBox>
        <SketchBox fillStyle="solid" palette={phase === 1 ? 'green' : 'neutral'} active={phase === 1}>
          b = [{B.join(',')}]
        </SketchBox>
        <SketchBox fillStyle="solid" palette={phase === 2 ? 'violet' : 'neutral'} active={phase === 2}>
          a·b = {DOT}
        </SketchBox>
      </div>
    </div>
  );
}
