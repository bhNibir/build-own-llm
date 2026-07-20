'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import type { ConceptExample } from './lesson-concepts';
import { DataLabel } from './diagram-ui';

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
  const matrix = DEFAULT_WEIGHTS;

  useEffect(() => {
    if (paused) return;
    let col = 0;
    let row = 0;
    const tick = () => {
      col += 1;
      if (col >= tokens.length) {
        col = 0;
        row = (row + 1) % tokens.length;
        setActiveRow(row);
      }
      setActiveCol(col);
    };
    const t = setInterval(tick, 900);
    return () => clearInterval(t);
  }, [paused, tokens.length]);

  return (
    <div className="space-y-4">
      <DataLabel bn="Query × Key = attention score" en="scaled dot-product" />
      <div className="flex justify-center gap-6">
        <div className="text-center">
          <p className="mb-2 text-xs font-semibold text-fd-muted-foreground">Query</p>
          {tokens.map((t, i) => (
            <div
              key={t + i}
              className={`mb-1 rounded border-2 px-3 py-1 font-mono text-sm ${
                activeRow === i
                  ? 'border-violet-500 bg-violet-50 text-violet-900 dark:bg-violet-950/40 dark:text-violet-100'
                  : 'border-dashed border-fd-border'
              }`}
            >
              {t}
            </div>
          ))}
        </div>
        <div className="flex items-center text-fd-muted-foreground">×</div>
        <div className="text-center">
          <p className="mb-2 text-xs font-semibold text-fd-muted-foreground">Key</p>
          {tokens.map((t, i) => (
            <div
              key={t + i}
              className={`mb-1 rounded border-2 px-3 py-1 font-mono text-sm ${
                activeCol === i
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100'
                  : 'border-dashed border-fd-border'
              }`}
            >
              {t}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[220px]">
        <p className="mb-2 text-center text-xs font-medium">Attention weights</p>
        <div className="grid grid-cols-3 gap-1">
          {matrix.flatMap((row, r) =>
            row.map((w, c) => (
              <motion.div
                key={`${r}-${c}`}
                className={`flex h-11 items-center justify-center rounded border-2 font-mono text-xs ${
                  activeRow === r && activeCol === c
                    ? 'border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950/40'
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
