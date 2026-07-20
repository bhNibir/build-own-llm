'use client';

import { motion } from 'motion/react';
import { Type, List, Hash, Brain, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { ConceptExample } from './lesson-concepts';

const NODES: { label: string; icon: LucideIcon }[] = [
  { label: 'Text', icon: Type },
  { label: 'Tokenizer', icon: Type },
  { label: 'Vocab', icon: List },
  { label: 'Encode', icon: Hash },
  { label: 'Model', icon: Brain },
  { label: 'Predict', icon: Target },
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

  return (
    <div className="space-y-3 overflow-x-auto pb-1">
      {example?.input && (
        <p className="text-center font-mono text-sm text-fd-muted-foreground">
          Input: &quot;{example.input}&quot;
        </p>
      )}
      <div className="flex min-w-max items-center justify-center gap-1 px-2">
        {NODES.map((node, i) => {
          const Icon = node.icon;
          return (
            <div key={node.label} className="flex items-center">
              <motion.div
                className={`flex flex-col items-center rounded-lg border px-2.5 py-2 sm:px-3 ${
                  active === i
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40'
                    : active > i
                      ? 'border-emerald-400/60 bg-emerald-50/50 dark:bg-emerald-950/20'
                      : 'border-fd-border bg-fd-muted/20'
                }`}
                animate={active === i ? { scale: 1.04 } : { scale: 1 }}
              >
                <Icon className="h-4 w-4 text-fd-foreground" />
                <span className="mt-1 text-[10px] font-medium">{node.label}</span>
              </motion.div>
              {i < NODES.length - 1 && (
                <div className="mx-0.5 h-px w-4 bg-fd-border sm:w-6" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
