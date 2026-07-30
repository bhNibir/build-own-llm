'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, SketchBox, StepDots } from './diagram-ui';

const ROWS = [
  { id: 0, word: 'apple', vec: [0.1, 0.3, -0.2, 0.5] },
  { id: 1, word: 'like', vec: [0.4, -0.1, 0.6, 0.2] },
  { id: 2, word: 'i', vec: [0.7, 0.2, -0.3, 0.1] },
  { id: 3, word: 'mango', vec: [0.15, 0.28, -0.18, 0.45] },
];

/** Token ID → embedding row lookup (matches Module 6 CodeRun numbers) */
export function EmbeddingLookupAnim({ paused }: { paused?: boolean }) {
  const [hi, setHi] = useState(0);
  const [pulse, setPulse] = useState(false);
  const selected = ROWS[hi];

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setHi((h) => (h + 1) % ROWS.length);
      setPulse((p) => !p);
    }, 1800);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-4">
      <StepDots total={ROWS.length} current={hi} onSelect={setHi} />
      <div className="flex flex-wrap items-start justify-center gap-4">
        <div className="flex flex-col gap-2">
          {ROWS.map((row, i) => (
            <button key={row.id} type="button" onClick={() => setHi(i)}>
              <SketchBox
                fillStyle="solid"
                palette={i === hi ? 'blue' : 'neutral'}
                active={i === hi}
                className="min-w-[5.5rem] text-center"
              >
                <span className="text-[10px] text-fd-muted-foreground">ID {row.id}</span>
                <div className="font-mono text-sm font-semibold">{row.word}</div>
              </SketchBox>
            </button>
          ))}
        </div>

        <div className="self-center text-fd-muted-foreground">→ row</div>

        <div className="overflow-x-auto">
          <p className="mb-1 text-center text-xs font-semibold">E (embedding matrix)</p>
          <div className="space-y-1">
            {ROWS.map((row, r) => (
              <div key={row.id} className="flex items-center gap-1">
                <span
                  className={`w-6 text-center font-mono text-[10px] ${
                    r === hi ? 'font-bold text-sky-700 dark:text-sky-300' : 'text-fd-muted-foreground'
                  }`}
                >
                  {row.id}
                </span>
                {row.vec.map((v, c) => (
                  <motion.div
                    key={`${r}-${c}`}
                    animate={r === hi && pulse ? { scale: 1.08 } : { scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <SketchBox
                      fillStyle="solid"
                      palette={r === hi ? 'blue' : 'neutral'}
                      className="flex h-7 min-w-[2.6rem] items-center justify-center px-1 py-0 font-mono text-[10px]"
                    >
                      {v.toFixed(2)}
                    </SketchBox>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <DataLabel
        bn={`"${selected.word}" → E[${selected.id}] = [${selected.vec.join(', ')}]`}
        en="row lookup"
      />
    </div>
  );
}
