'use client';

import { useEffect, useState } from 'react';
import { FlowArrow } from './ConceptAnim';

const NODES = [
  { emoji: '📝', label: 'Text', color: 'bg-indigo-500' },
  { emoji: '🔤', label: 'Tokenizer', color: 'bg-violet-500' },
  { emoji: '📖', label: 'Vocab', color: 'bg-purple-500' },
  { emoji: '🔢', label: 'Encode', color: 'bg-fuchsia-500' },
  { emoji: '🧠', label: 'Model', color: 'bg-pink-500' },
  { emoji: '🎯', label: 'Predict', color: 'bg-rose-500' },
];

export function PipelineAnim({ paused }: { paused?: boolean }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % NODES.length), 1200);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max items-center justify-center gap-0 px-2">
        {NODES.map((node, i) => (
          <div key={node.label} className="flex items-center">
            <div
              className={`relative flex flex-col items-center rounded-xl px-3 py-3 transition-all duration-500 sm:px-4 ${
                active === i
                  ? `${node.color} scale-110 text-white shadow-xl ring-4 ring-white/30`
                  : active > i
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
                    : 'bg-fd-muted text-fd-muted-foreground'
              }`}
            >
              <span className="text-2xl">{node.emoji}</span>
              <span className="mt-1 text-xs font-semibold">{node.label}</span>
              {active === i && (
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-indigo-600 dark:text-indigo-400">
                  processing…
                </span>
              )}
            </div>
            {i < NODES.length - 1 && (
              <div className="relative mx-0.5 flex w-6 items-center sm:w-10">
                <div
                  className={`h-1 w-full rounded transition-colors duration-300 ${
                    active > i ? 'bg-emerald-400' : 'bg-fd-border'
                  }`}
                />
                {active === i && (
                  <span className="absolute animate-flow-dot text-indigo-500">▶</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
