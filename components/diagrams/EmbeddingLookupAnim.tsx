'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, SketchBox } from './diagram-ui';
import { VOCAB } from './shared-data';

const ROWS = 4;
const COLS = 5;
const HIGHLIGHT_ID = 0; // apple

function cellValue(r: number, c: number) {
  return ((r + 1) * 0.1 + c * 0.07).toFixed(2);
}

export function EmbeddingLookupAnim({ paused }: { paused?: boolean }) {
  const [pulse, setPulse] = useState(false);
  const apple = VOCAB.find((v) => v.id === HIGHLIGHT_ID)?.word ?? 'apple';

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setPulse((p) => !p), 1400);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-center gap-4">
        <SketchBox fillStyle="solid" palette="blue" active className="text-center">
          <span className="text-xs text-fd-muted-foreground">token ID</span>
          <div className="text-lg font-bold text-indigo-600">{HIGHLIGHT_ID}</div>
          <div className="font-mono text-sm">{apple}</div>
        </SketchBox>

        <div className="self-center text-fd-muted-foreground">→ row</div>

        <div className="overflow-x-auto">
          <p className="mb-1 text-center text-xs font-semibold">E (embedding matrix)</p>
          <div className="inline-grid gap-0.5" style={{ gridTemplateColumns: `repeat(${COLS + 1}, minmax(0, 1fr))` }}>
            <div className="h-6" />
            {Array.from({ length: COLS }, (_, c) => (
              <div key={`h-${c}`} className="flex h-6 items-center justify-center text-[10px] text-fd-muted-foreground">
                d{c}
              </div>
            ))}
            {Array.from({ length: ROWS }, (_, r) => (
              <div key={`row-${r}`} className="contents">
                <div
                  className={`flex h-7 items-center justify-center rounded-l font-mono text-[10px] ${
                    r === HIGHLIGHT_ID ? 'bg-indigo-100 font-bold text-indigo-700 dark:bg-indigo-950' : 'text-fd-muted-foreground'
                  }`}
                >
                  {r}
                </div>
                {Array.from({ length: COLS }, (_, c) => (
                  <motion.div
                    key={`${r}-${c}`}
                    animate={r === HIGHLIGHT_ID && pulse ? { scale: 1.08 } : { scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <SketchBox
                      fillStyle="solid"
                      palette={r === HIGHLIGHT_ID ? 'blue' : 'neutral'}
                      className="flex h-7 items-center justify-center px-1 py-0 font-mono text-[10px]"
                    >
                      {cellValue(r, c)}
                    </SketchBox>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <DataLabel bn="ID দিয়ে matrix-এর এক row বের করি" en="E[id]" />
    </div>
  );
}
