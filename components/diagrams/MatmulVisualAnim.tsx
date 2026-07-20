'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, MonoBox } from './diagram-ui';

const A = [[1, 2], [3, 4]];
const B = [[5, 6], [7, 8]];
const C = [
  [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
  [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]],
];

export function MatmulVisualAnim({ paused }: { paused?: boolean }) {
  const [cell, setCell] = useState({ r: 0, c: 0 });

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setCell(({ r, c }) => {
        if (c + 1 < 2) return { r, c: c + 1 };
        if (r + 1 < 2) return { r: r + 1, c: 0 };
        return { r: 0, c: 0 };
      });
    }, 1500);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-3">
      <DataLabel bn="Matrix multiply" en="C = A × B" />
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
        <MatrixView m={A} highlightRow={cell.r} />
        <span className="font-mono text-fd-muted-foreground">×</span>
        <MatrixView m={B} highlightCol={cell.c} />
        <span className="font-mono text-fd-muted-foreground">=</span>
        <MatrixView m={C} highlightCell={cell} />
      </div>
      <p className="text-center font-mono text-xs text-fd-muted-foreground">
        C[{cell.r}][{cell.c}] = row·col dot product
      </p>
    </div>
  );
}

function MatrixView({
  m, highlightRow, highlightCol, highlightCell,
}: {
  m: number[][];
  highlightRow?: number;
  highlightCol?: number;
  highlightCell?: { r: number; c: number };
}) {
  return (
    <div className="flex flex-col gap-0.5">
      {m.map((row, r) => (
        <div key={r} className="flex gap-0.5">
          {row.map((v, c) => {
            const active = highlightCell ? highlightCell.r === r && highlightCell.c === c
              : highlightRow === r || highlightCol === c;
            return (
              <motion.div key={c} animate={{ scale: active ? 1.1 : 1 }}>
                <MonoBox active={active} className="min-w-[2rem] px-2 py-1 text-center text-xs">{v}</MonoBox>
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
