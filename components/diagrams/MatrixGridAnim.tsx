'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, MonoBox } from './diagram-ui';

const MATRIX = [
  [1, 2, 3],
  [4, 5, 6],
];

export function MatrixGridAnim({ paused }: { paused?: boolean }) {
  const [mode, setMode] = useState<'row' | 'col'>('row');
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setIdx((i) => {
        const max = mode === 'row' ? MATRIX.length : MATRIX[0].length;
        if (i + 1 >= max) {
          setMode((m) => (m === 'row' ? 'col' : 'row'));
          return 0;
        }
        return i + 1;
      });
    }, 1400);
    return () => clearInterval(t);
  }, [paused, mode]);

  return (
    <div className="space-y-3">
      <DataLabel bn="Matrix shape 2×3" en="rows × cols" />
      <div className="flex justify-center gap-1">
        {MATRIX.map((row, r) => (
          <div key={r} className="flex flex-col gap-1">
            {row.map((val, c) => {
              const active = mode === 'row' ? r === idx : c === idx;
              return (
                <motion.div key={c} animate={{ scale: active ? 1.08 : 1 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
                  <MonoBox active={active} className="min-w-[2.5rem] text-center">{val}</MonoBox>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-fd-muted-foreground">
        Highlighting {mode} {idx}
      </p>
    </div>
  );
}
