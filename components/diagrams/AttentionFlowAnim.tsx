'use client';

import { useEffect, useState } from 'react';

const TOKENS = ['i', 'like', 'apple'];
const WEIGHTS = [
  [0.7, 0.2, 0.1],
  [0.1, 0.8, 0.1],
  [0.2, 0.3, 0.5],
];

export function AttentionFlowAnim({ paused }: { paused?: boolean }) {
  const [activeRow, setActiveRow] = useState(0);
  const [activeCol, setActiveCol] = useState(-1);

  useEffect(() => {
    if (paused) return;
    let col = -1;
    const tick = () => {
      col += 1;
      if (col > 2) {
        setActiveRow((r) => (r + 1) % 3);
        col = 0;
      }
      setActiveCol(col);
    };
    tick();
    const t = setInterval(tick, 900);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-8">
        <div className="text-center">
          <p className="mb-2 text-xs font-semibold text-violet-600">Query</p>
          {TOKENS.map((t, i) => (
            <div
              key={t}
              className={`mb-1 rounded px-3 py-1 font-mono text-sm transition-all ${
                activeRow === i ? 'bg-violet-500 text-white scale-105' : 'bg-fd-muted'
              }`}
            >
              {t}
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center gap-1 text-2xl text-indigo-500">
          <span className="animate-pulse">→</span>
          <span className="text-xs font-normal text-fd-muted-foreground">scores</span>
        </div>

        <div className="text-center">
          <p className="mb-2 text-xs font-semibold text-emerald-600">Keys</p>
          {TOKENS.map((t, i) => (
            <div
              key={t}
              className={`mb-1 rounded px-3 py-1 font-mono text-sm transition-all ${
                activeCol === i ? 'bg-emerald-500 text-white scale-105' : 'bg-fd-muted'
              }`}
            >
              {t}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[240px]">
        <p className="mb-2 text-center text-xs font-semibold">Attention weights</p>
        <div className="grid grid-cols-3 gap-1">
          {WEIGHTS.flatMap((row, r) =>
            row.map((w, c) => (
              <div
                key={`${r}-${c}`}
                className={`flex h-12 items-center justify-center rounded font-mono text-xs text-white transition-all duration-300 ${
                  activeRow === r && activeCol === c ? 'ring-2 ring-amber-400 scale-110' : ''
                }`}
                style={{
                  backgroundColor: `rgba(79, 70, 229, ${Math.max(w, 0.15)})`,
                }}
              >
                {w.toFixed(1)}
              </div>
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
