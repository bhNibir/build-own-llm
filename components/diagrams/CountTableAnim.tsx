'use client';

import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { DataLabel, SketchBox, StepDots } from './diagram-ui';

/** Fruit-corpus slice taught in Module 2: like → apple/banana/mango */
const SENTENCES = [
  { text: 'i like apple', pair: ['like', 'apple'] as const },
  { text: 'i like banana', pair: ['like', 'banana'] as const },
  { text: 'i like mango', pair: ['like', 'mango'] as const },
  { text: 'you like apple', pair: ['like', 'apple'] as const },
];

const COLS = ['apple', 'banana', 'mango'] as const;

export function CountTableAnim({ paused }: { paused?: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setStep((s) => (s + 1) % (SENTENCES.length + 1)), 1600);
    return () => clearInterval(t);
  }, [paused]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { apple: 0, banana: 0, mango: 0 };
    const limit = Math.min(step, SENTENCES.length);
    for (let i = 0; i < limit; i++) {
      const next = SENTENCES[i].pair[1];
      c[next] += 1;
    }
    return c;
  }, [step]);

  const active = step < SENTENCES.length ? SENTENCES[step] : null;
  const done = step >= SENTENCES.length;

  return (
    <div className="space-y-3">
      <StepDots total={SENTENCES.length + 1} current={step} onSelect={setStep} />
      <DataLabel
        bn={done ? 'Final: like → apple ২, banana ১, mango ১' : `"${active?.text}" → count +1`}
        en="C[like][next]"
      />
      {active && (
        <motion.div
          key={active.text}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <SketchBox fillStyle="solid" palette="amber" active className="font-mono text-sm">
            {active.text}
          </SketchBox>
        </motion.div>
      )}
      <div className="overflow-x-auto">
        <table className="mx-auto border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-fd-border px-2 py-1 text-fd-muted-foreground" />
              {COLS.map((c) => (
                <th key={c} className="border border-fd-border px-3 py-1 font-mono">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="border border-fd-border px-2 py-1 font-mono">like</th>
              {COLS.map((c) => {
                const justHit = active?.pair[1] === c;
                const val = counts[c];
                return (
                  <td key={c} className="border border-fd-border p-1">
                    <SketchBox
                      fillStyle="solid"
                      palette={justHit ? 'green' : val > 0 ? 'blue' : 'neutral'}
                      active={justHit || (done && c === 'apple')}
                      className="relative min-w-[2.5rem] text-center font-mono"
                    >
                      <motion.span
                        key={`${c}-${val}`}
                        initial={justHit ? { scale: 1.4 } : false}
                        animate={{ scale: 1 }}
                      >
                        {val}
                      </motion.span>
                      {justHit && (
                        <motion.span
                          className="absolute -right-1 -top-1 rounded border border-emerald-500 bg-emerald-50 px-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                          transition={{ duration: 0.4 }}
                        >
                          +1
                        </motion.span>
                      )}
                    </SketchBox>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
