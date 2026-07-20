'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { FlowConnector } from './diagram-ui';
import { VOCAB } from './shared-data';

export function VocabMapAnim({ paused }: { paused?: boolean }) {
  const [step, setStep] = useState(0);
  const words = VOCAB.map((v) => v.word);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setStep((s) => (s + 1) % 3), 2200);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-4">
      <p className="text-center text-xs text-fd-muted-foreground">
        Step {step + 1}/3: {['unique words', 'sorted', 'assign IDs'][step]}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <div className="flex flex-wrap justify-center gap-1 max-w-[200px]">
          {words.slice(0, step >= 1 ? 12 : 6).map((w) => (
            <span key={w} className="rounded border border-fd-border px-2 py-0.5 font-mono text-xs">
              {w}
            </span>
          ))}
        </div>
        {step >= 2 && (
          <>
            <FlowConnector />
            <div className="grid grid-cols-3 gap-1">
              {VOCAB.slice(0, 6).map((v) => (
                <motion.div
                  key={v.word}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 rounded border border-indigo-300 px-2 py-1 text-xs font-mono"
                >
                  <span className="rounded bg-indigo-100 px-1 dark:bg-indigo-900">{v.id}</span>
                  {v.word}
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
      <p className="text-center text-xs">Vocab size = {VOCAB.length}</p>
    </div>
  );
}
