'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import type { ConceptExample } from './lesson-concepts';

const NODES = [
  { emoji: '📝', label: 'Text', color: 'bg-indigo-500' },
  { emoji: '🔤', label: 'Tokenizer', color: 'bg-violet-500' },
  { emoji: '📖', label: 'Vocab', color: 'bg-purple-500' },
  { emoji: '🔢', label: 'Encode', color: 'bg-fuchsia-500' },
  { emoji: '🧠', label: 'Model', color: 'bg-pink-500' },
  { emoji: '🎯', label: 'Predict', color: 'bg-rose-500' },
];

export function PipelineAnim({
  paused,
  example,
}: {
  paused?: boolean;
  example?: ConceptExample;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % NODES.length), 1200);
    return () => clearInterval(t);
  }, [paused]);

  const inputHint = example?.input ? `"${example.input}"` : null;

  return (
    <div className="overflow-x-auto pb-2">
      {inputHint && (
        <p className="mb-3 text-center font-mono text-sm text-indigo-600 dark:text-indigo-400">
          Input: {inputHint}
        </p>
      )}
      <div className="flex min-w-max items-center justify-center gap-0 px-2">
        {NODES.map((node, i) => (
          <div key={node.label} className="flex items-center">
            <motion.div
              layout
              className={`relative flex flex-col items-center rounded-xl px-3 py-3 sm:px-4 ${
                active === i
                  ? `${node.color} text-white shadow-xl ring-4 ring-white/30`
                  : active > i
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
                    : 'bg-fd-muted text-fd-muted-foreground'
              }`}
              animate={active === i ? { scale: 1.1 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            >
              <span className="text-2xl">{node.emoji}</span>
              <span className="mt-1 text-xs font-semibold">{node.label}</span>
              <AnimatePresence>
                {active === i && (
                  <motion.span
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-indigo-600 dark:text-indigo-400"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    processing…
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
            {i < NODES.length - 1 && (
              <div className="relative mx-0.5 flex w-6 items-center sm:w-10">
                <motion.div
                  className="h-1 w-full rounded"
                  animate={{
                    backgroundColor: active > i ? 'rgb(52 211 153)' : 'var(--color-fd-border)',
                  }}
                />
                {active === i && (
                  <motion.span
                    className="absolute text-indigo-500"
                    animate={{ x: [0, 12, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    ▶
                  </motion.span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
