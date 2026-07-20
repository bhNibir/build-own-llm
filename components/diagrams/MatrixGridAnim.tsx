'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, SketchBox, StepDots } from './diagram-ui';

const MATRIX = [
  [1, 2, 3],
  [4, 5, 6],
];

export function MatrixGridAnim({ paused }: { paused?: boolean }) {
  const [mode, setMode] = useState<'row' | 'col'>('row');
  const [idx, setIdx] = useState(0);
  const rowCount = MATRIX.length;
  const colCount = MATRIX[0].length;
  const total = rowCount + colCount;
  const current = mode === 'row' ? idx : rowCount + idx;

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
      <StepDots
        total={total}
        current={current}
        onSelect={(i) => {
          if (i < rowCount) {
            setMode('row');
            setIdx(i);
          } else {
            setMode('col');
            setIdx(i - rowCount);
          }
        }}
      />
      <DataLabel bn="ম্যাট্রিক্স আকার ২×৩" en="rows × cols" />
      <div className="flex justify-center gap-2">
        {MATRIX.map((row, r) => (
          <div key={r} className="flex flex-col gap-2">
            {row.map((val, c) => {
              const active = mode === 'row' ? r === idx : c === idx;
              return (
                <motion.div key={c} animate={{ scale: active ? 1.08 : 1 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
                  <SketchBox
                    fillStyle="solid"
                    palette={active ? 'blue' : 'neutral'}
                    active={active}
                    className="min-w-[2.5rem] text-center font-mono"
                  >
                    {val}
                  </SketchBox>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
      <DataLabel bn={`Highlighting ${mode} ${idx}`} en={mode === 'row' ? 'row scan' : 'col scan'} />
    </div>
  );
}
