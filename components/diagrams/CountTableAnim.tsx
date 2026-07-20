'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, MonoBox } from './diagram-ui';

const ROWS = ['i', 'like', 'apple'];
const COLS = ['like', 'apple', 'i'];
const BASE: Record<string, Record<string, number>> = {
  i: { like: 1, apple: 0, i: 0 },
  like: { like: 0, apple: 1, i: 0 },
  apple: { like: 0, apple: 0, i: 0 },
};

export function CountTableAnim({ paused }: { paused?: boolean }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setPulse((p) => !p), 1800);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-3">
      <DataLabel bn="Bigram count table" en="C[from][to]" />
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
            {ROWS.map((r) => (
              <tr key={r}>
                <th className="border border-fd-border px-2 py-1 font-mono">{r}</th>
                {COLS.map((c) => {
                  const active = r === 'like' && c === 'apple';
                  const val = BASE[r][c];
                  return (
                    <td key={c} className="border border-fd-border p-1">
                      <MonoBox active={active && pulse} className="relative min-w-[2.5rem] text-center">
                        {val}
                        {active && pulse && (
                          <motion.span
                            className="absolute -right-1 -top-1 rounded border border-emerald-500 bg-emerald-50 px-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                            transition={{ duration: 0.4 }}
                          >
                            +1
                          </motion.span>
                        )}
                      </MonoBox>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
