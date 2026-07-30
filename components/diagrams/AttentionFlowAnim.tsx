'use client';

import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import type { ConceptExample } from './lesson-concepts';
import { DataLabel, SketchBox, StepDots } from './diagram-ui';

const DEFAULT_TOKENS = ['i', 'like', 'apple'];
const DEFAULT_WEIGHTS = [
  [0.7, 0.2, 0.1],
  [0.1, 0.8, 0.1],
  [0.2, 0.3, 0.5],
];

export function AttentionFlowAnim({
  paused,
  example,
}: {
  paused?: boolean;
  example?: ConceptExample;
}) {
  const [activeRow, setActiveRow] = useState(0);
  const [activeCol, setActiveCol] = useState(0);
  const tokens = example?.tokens ?? DEFAULT_TOKENS;
  const matrix =
    Array.isArray(example?.probs) &&
    example.probs.length === tokens.length &&
    tokens.length >= 2
      ? DEFAULT_WEIGHTS.map((row, i) =>
          i === 0 ? example.probs! : row.slice(0, tokens.length),
        )
      : DEFAULT_WEIGHTS.map((row) => row.slice(0, tokens.length));
  const rowRef = useRef(0);
  const colRef = useRef(0);
  const cellTotal = tokens.length * tokens.length;
  const current = activeRow * tokens.length + activeCol;

  useEffect(() => {
    if (paused) return;
    rowRef.current = 0;
    colRef.current = 0;
    setActiveRow(0);
    setActiveCol(0);

    const tick = () => {
      let col = colRef.current + 1;
      let row = rowRef.current;
      if (col >= tokens.length) {
        col = 0;
        row = (row + 1) % tokens.length;
      }
      colRef.current = col;
      rowRef.current = row;
      setActiveCol(col);
      setActiveRow(row);
    };

    const t = setInterval(tick, 900);
    return () => clearInterval(t);
  }, [paused, tokens.length]);

  return (
    <div className="space-y-4">
      <StepDots
        total={cellTotal}
        current={current}
        onSelect={(i) => {
          const row = Math.floor(i / tokens.length);
          const col = i % tokens.length;
          rowRef.current = row;
          colRef.current = col;
          setActiveRow(row);
          setActiveCol(col);
        }}
      />
      <DataLabel bn="প্রতিটি Query সব Key-এর সাথে compare করে" en="attention scores" />
      <div className="flex justify-center gap-6">
        <div className="text-center">
          <p className="mb-2 text-xs font-semibold text-violet-600 dark:text-violet-300">Query</p>
          {tokens.map((t, i) => (
            <SketchBox
              key={t + i}
              fillStyle="solid"
              palette={activeRow === i ? 'violet' : 'neutral'}
              active={activeRow === i}
              className="mb-1 font-mono text-sm"
            >
              {t}
            </SketchBox>
          ))}
        </div>
        <div className="flex items-center text-fd-muted-foreground">×</div>
        <div className="text-center">
          <p className="mb-2 text-xs font-semibold text-emerald-600 dark:text-emerald-300">Key</p>
          {tokens.map((t, i) => (
            <SketchBox
              key={t + i}
              fillStyle="solid"
              palette={activeCol === i ? 'green' : 'neutral'}
              active={activeCol === i}
              className="mb-1 font-mono text-sm"
            >
              {t}
            </SketchBox>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[220px]">
        <p className="mb-2 text-center text-xs font-medium">Attention weights</p>
        <div className="grid grid-cols-3 gap-2">
          {matrix.flatMap((row, r) =>
            row.map((w, c) => (
              <motion.div
                key={`${r}-${c}`}
                className={`flex h-11 items-center justify-center rounded-lg border-2 font-mono text-xs ${
                  activeRow === r && activeCol === c
                    ? 'border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950/50 dark:text-amber-100'
                    : 'border-fd-border bg-fd-muted/30 text-fd-foreground'
                }`}
                animate={activeRow === r && activeCol === c ? { scale: 1.08 } : { scale: 1 }}
              >
                {w.toFixed(1)}
              </motion.div>
            )),
          )}
        </div>
      </div>
    </div>
  );
}
