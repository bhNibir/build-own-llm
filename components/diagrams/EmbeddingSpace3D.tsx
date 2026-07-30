'use client';

import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
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
  const [rot, setRot] = useState(25);
  const [selected, setSelected] = useState<string | null>('apple');
  const dragging = useRef(false);
  const lastX = useRef(0);

  useEffect(() => {
    if (paused || dragging.current) return;
    const t = setInterval(() => setRot((r) => (r + 0.6) % 360), 40);
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
      size: 10 + scale * 2.2,
      depth: rz,
    };
  };

  const ordered = [...POINTS]
    .map((p) => ({ ...p, pos: project(p.x, p.y, p.z) }))
    .sort((a, b) => a.pos.depth - b.pos.depth);

  const selectedPoint = POINTS.find((p) => p.word === selected);

  return (
    <div className="space-y-3">
      <DataLabel bn="Similar word কাছাকাছি — ৩D embedding space" en="drag to rotate" />
      <div
        className="relative mx-auto h-56 w-full max-w-md cursor-grab overflow-hidden rounded-2xl border-2 border-sky-200/70 bg-gradient-to-br from-cyan-50 via-white to-amber-50 active:cursor-grabbing dark:border-sky-800/40 dark:from-slate-900 dark:via-slate-950 dark:to-amber-950/40"
        style={{ perspective: '700px' }}
        onPointerDown={(e) => {
          dragging.current = true;
          lastX.current = e.clientX;
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!dragging.current) return;
          const dx = e.clientX - lastX.current;
          lastX.current = e.clientX;
          setRot((r) => (r + dx * 0.6 + 360) % 360);
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
      >
        {/* soft orbit rings */}
        <div className="pointer-events-none absolute inset-6 rounded-full border border-dashed border-sky-300/50 dark:border-sky-700/40" />
        <div className="pointer-events-none absolute inset-14 rounded-full border border-dotted border-amber-300/40 dark:border-amber-700/30" />
        <div className="pointer-events-none absolute inset-0 opacity-25">
          <div className="absolute left-1/2 top-0 h-full w-px bg-sky-400" />
          <div className="absolute left-0 top-1/2 h-px w-full bg-sky-400" />
        </div>
        {ordered.map((p) => {
          const active = selected === p.word;
          return (
            <motion.button
              key={p.word}
              type="button"
              className="absolute flex flex-col items-center"
              style={{
                left: `${p.pos.left}%`,
                top: `${p.pos.top}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: Math.round(50 + p.pos.depth),
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelected(p.word);
              }}
              animate={{ scale: active ? 1.15 : 1 }}
              whileHover={{ scale: 1.2 }}
            >
              <span
                className="rounded-full shadow-lg"
                style={{
                  width: p.pos.size,
                  height: p.pos.size,
                  backgroundColor: p.color,
                  boxShadow: active ? `0 0 0 3px ${p.color}55` : undefined,
                }}
              />
              <SketchBox
                fillStyle="solid"
                palette={p.palette}
                active={active}
                className="mt-0.5 px-1.5 py-0 font-mono text-[10px] font-medium"
              >
                {p.word}
              </SketchBox>
            </motion.button>
          );
        })}
      </div>
      <DataLabel
        bn={
          selectedPoint
            ? selectedPoint.word === 'like' || selectedPoint.word === 'i'
              ? `"${selected}" আলাদা cluster — fruit words থেকে দূরে`
              : `"${selected}" fruit cluster-এ — similar meaning কাছাকাছি`
            : 'একটা word-এ ক্লিক করো'
        }
        en="vector neighborhood"
      />
    </div>
  );
}
