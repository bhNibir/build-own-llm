'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, SketchBox } from './diagram-ui';

const POINTS = [
  { word: 'apple', x: 20, y: 30, z: 40, color: '#10b981', palette: 'green' as const },
  { word: 'banana', x: 28, y: 35, z: 45, color: '#f59e0b', palette: 'amber' as const },
  { word: 'mango', x: 25, y: 40, z: 38, color: '#ef4444', palette: 'rose' as const },
  { word: 'fruit', x: 35, y: 45, z: 50, color: '#8b5cf6', palette: 'violet' as const },
  { word: 'like', x: 70, y: 60, z: 20, color: '#6366f1', palette: 'blue' as const },
  { word: 'i', x: 75, y: 70, z: 15, color: '#64748b', palette: 'neutral' as const },
];

export function EmbeddingSpace3D({ paused }: { paused?: boolean }) {
  const [rot, setRot] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setRot((r) => (r + 1) % 360), 50);
    return () => clearInterval(t);
  }, [paused]);

  const rad = (rot * Math.PI) / 180;
  const project = (x: number, y: number, z: number) => {
    const cx = x - 50;
    const cz = z - 30;
    const rx = cx * Math.cos(rad) - cz * Math.sin(rad);
    const rz = cx * Math.sin(rad) + cz * Math.cos(rad);
    const scale = 180 / (120 + rz);
    return {
      left: 50 + rx * scale * 0.45,
      top: 50 + (y - 50) * scale * 0.4 - rz * 0.08,
      size: 8 + scale * 2,
    };
  };

  return (
    <div className="space-y-3">
      <DataLabel bn="Similar word কাছাকাছি — embedding space" en="3D intuition" />
      <div
        className="relative mx-auto h-52 w-full max-w-md overflow-hidden rounded-xl border-2 border-indigo-200/60 bg-gradient-to-br from-slate-50 to-indigo-50 dark:border-indigo-800/40 dark:from-slate-900 dark:to-indigo-950"
        style={{ perspective: '600px' }}
      >
        <div className="absolute inset-0 opacity-30">
          <div className="absolute left-1/2 top-0 h-full w-px bg-indigo-300" />
          <div className="absolute left-0 top-1/2 h-px w-full bg-indigo-300" />
        </div>
        {POINTS.map((p) => {
          const pos = project(p.x, p.y, p.z);
          return (
            <motion.div
              key={p.word}
              className="absolute flex flex-col items-center"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <span
                className="rounded-full shadow-md"
                style={{
                  width: pos.size,
                  height: pos.size,
                  backgroundColor: p.color,
                }}
              />
              <SketchBox
                fillStyle="solid"
                palette={p.palette}
                className="mt-0.5 px-1.5 py-0 font-mono text-[10px] font-medium"
              >
                {p.word}
              </SketchBox>
            </motion.div>
          );
        })}
      </div>
      <DataLabel bn="apple / banana / mango / fruit একসাথে · like / i আলাদা" en="clusters" />
    </div>
  );
}
