'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import type { ConceptExample } from './lesson-concepts';
import { ActiveRing, FlowConnector, ModelBadge } from './diagram-ui';
import { NEXT_AFTER_I_LIKE } from './shared-data';

const DEFAULT_WORDS = ['i', 'like', '???'];

export function NextTokenAnim({
  paused,
  example,
  probs,
  labels,
}: {
  paused?: boolean;
  example?: ConceptExample;
  probs?: number[];
  labels?: string[];
}) {
  const [phase, setPhase] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  const words = example?.tokens?.length
    ? [...example.tokens.slice(0, 2), '???']
    : DEFAULT_WORDS;

  const p = probs ?? example?.probs ?? NEXT_AFTER_I_LIKE.probs;
  const lbl = labels ?? example?.labels ?? NEXT_AFTER_I_LIKE.labels;
  const options = lbl.map((word, i) => ({
    word,
    pct: Math.round(p[i] * 100),
  }));

  useEffect(() => {
    if (paused) return;
    const cycle = () => {
      setPhase(0);
      setPicked(null);
      setTimeout(() => setPhase(1), 800);
      setTimeout(() => setPhase(2), 2000);
      setTimeout(() => setPicked(options[0]?.word ?? 'apple'), 2800);
    };
    cycle();
    const t = setInterval(cycle, 4500);
    return () => clearInterval(t);
  }, [paused, options]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {words.map((w, i) => (
          <div key={i} className="relative">
            <ActiveRing active={phase >= 1 && w === '???'} />
            <span
              className={`inline-block rounded-lg border px-3 py-1.5 font-mono text-sm font-medium ${
                w === '???'
                  ? 'border-amber-400 bg-amber-50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200'
                  : 'border-fd-border bg-fd-muted/40'
              }`}
            >
              {w === '???' && picked ? picked : w}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2">
        <FlowConnector />
        <ModelBadge />
        <FlowConnector />
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {options.map((opt) => (
          <div
            key={opt.word}
            className={`rounded-lg border px-3 py-2 ${
              picked === opt.word ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/30' : 'border-fd-border'
            }`}
          >
            <span className="font-mono text-sm">{opt.word}</span>
            <div className="mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-fd-muted">
              <motion.div
                className="h-full rounded-full bg-indigo-500"
                animate={{ width: phase >= 2 ? `${opt.pct}%` : '0%' }}
              />
            </div>
            <span className="text-[10px] text-fd-muted-foreground">{opt.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
