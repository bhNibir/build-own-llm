'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import type { ConceptExample } from './lesson-concepts';

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
  const [activeCol, setActiveCol] = useState(-1);

  const tokens = example?.tokens ?? DEFAULT_TOKENS;
  const matrix =
    Array.isArray(example?.probs) &&
    example.probs.length === tokens.length &&
    tokens.length >= 2
      ? // single attention row provided — repeat as demo matrix fallback
        DEFAULT_WEIGHTS.map((row, i) =>
          i === 0 ? example.probs! : row.slice(0, tokens.length),
        )
      : DEFAULT_WEIGHTS.map((row) => row.slice(0, tokens.length));

  useEffect(() => {
    if (paused) return;
    let col = -1;
    const tick = () => {
      col += 1;
      if (col > tokens.length - 1) {
        setActiveRow((r) => (r + 1) % tokens.length);
        col = 0;
      }
      setActiveCol(col);
    };
    tick();
    const t = setInterval(tick, 900);
    return () => clearInterval(t);
  }, [paused, tokens.length]);

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-8">
        <div className="text-center">
          <p className="mb-2 text-xs font-semibold text-violet-600">Query</p>
          {tokens.map((t, i) => (
            <motion.div
              key={t + i}
              layout
              className={`mb-1 rounded px-3 py-1 font-mono text-sm ${
                activeRow === i ? 'bg-violet-500 text-white' : 'bg-fd-muted'
              }`}
              animate={activeRow === i ? { scale: 1.05 } : { scale: 1 }}
            >
              {t}
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center gap-1 text-2xl text-indigo-500">
          <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.2 }}>
            →
          </motion.span>
          <span className="text-xs font-normal text-fd-muted-foreground">scores</span>
        </div>

        <div className="text-center">
          <p className="mb-2 text-xs font-semibold text-emerald-600">Keys</p>
          {tokens.map((t, i) => (
            <motion.div
              key={t + i}
              layout
              className={`mb-1 rounded px-3 py-1 font-mono text-sm ${
                activeCol === i ? 'bg-emerald-500 text-white' : 'bg-fd-muted'
              }`}
              animate={activeCol === i ? { scale: 1.05 } : { scale: 1 }}
            >
              {t}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[240px]">
        <p className="mb-2 text-center text-xs font-semibold">Attention weights</p>
        <div className="grid grid-cols-3 gap-1">
          {matrix.flatMap((row, r) =>
            row.map((w, c) => (
              <motion.div
                key={`${r}-${c}`}
                className="flex h-12 items-center justify-center rounded font-mono text-xs text-white"
                style={{
                  backgroundColor: `rgba(79, 70, 229, ${Math.max(w, 0.15)})`,
                }}
                animate={
                  activeRow === r && activeCol === c
                    ? { scale: 1.1, boxShadow: '0 0 0 2px rgb(251 191 36)' }
                    : { scale: 1, boxShadow: '0 0 0 0px transparent' }
                }
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                {w.toFixed(1)}
              </motion.div>
            )),
          )}
        </div>
      </div>
      <p className="text-center text-xs text-fd-muted-foreground">
        প্রতিটা Query সব Key-এর সাথে compare → weight বেশি = বেশি focus
      </p>
    </div>
  );
}
