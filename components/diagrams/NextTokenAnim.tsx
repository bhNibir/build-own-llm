'use client';

import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import type { ConceptExample } from './lesson-concepts';
import { ActiveRing, DataLabel, FlowConnector, ModelBadge, SketchBox, StepDots } from './diagram-ui';
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
  const options = useMemo(
    () =>
      lbl.map((word, i) => ({
        word,
        pct: Math.round(p[i] * 100),
      })),
    [lbl, p],
  );

  const firstWord = options[0]?.word ?? 'apple';
  const optionsKey = options.map((o) => `${o.word}:${o.pct}`).join('|');

  useEffect(() => {
    if (paused) return;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const cycle = () => {
      setPhase(0);
      setPicked(null);
      timeouts.push(setTimeout(() => setPhase(1), 800));
      timeouts.push(setTimeout(() => setPhase(2), 2000));
      timeouts.push(setTimeout(() => setPicked(firstWord), 2800));
    };
    cycle();
    const interval = setInterval(cycle, 4500);
    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, [paused, firstWord, optionsKey]);

  return (
    <div className="space-y-4">
      <StepDots
        total={3}
        current={phase}
        onSelect={(i) => {
          setPhase(i);
          setPicked(i >= 2 ? (options[0]?.word ?? 'apple') : null);
        }}
      />
      <DataLabel bn="Context দেখে probability → একটা token pick" en="next-token prediction" />
      <div className="flex flex-wrap items-center justify-center gap-2">
        {words.map((w, i) => (
          <div key={i} className="relative">
            <ActiveRing active={phase >= 1 && w === '???'} />
            <SketchBox
              fillStyle="solid"
              palette={w === '???' ? 'amber' : 'blue'}
              strokeStyle="solid"
              active={w === '???'}
              className="font-mono text-sm font-medium"
            >
              {w === '???' && picked ? picked : w}
            </SketchBox>
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
          <SketchBox
            key={opt.word}
            fillStyle="solid"
            palette={picked === opt.word ? 'green' : 'neutral'}
            strokeStyle="solid"
            active={picked === opt.word}
            className="min-w-[5.5rem]"
          >
            <span className="font-mono text-sm">{opt.word}</span>
            <div className="mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
              <motion.div
                className="h-full rounded-full bg-indigo-500"
                animate={{ width: phase >= 2 ? `${opt.pct}%` : '0%' }}
              />
            </div>
            <span className="text-[10px] opacity-70">{opt.pct}%</span>
          </SketchBox>
        ))}
      </div>
    </div>
  );
}
