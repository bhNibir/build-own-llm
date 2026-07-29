'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import type { ConceptExample } from './lesson-concepts';
import { ActivePulse, FlowArrow } from './ConceptAnim';

const DEFAULT_WORDS = ['i', 'like', '???'];
const DEFAULT_OPTIONS = [
  { word: 'apple', pct: 50 },
  { word: 'banana', pct: 25 },
  { word: 'mango', pct: 25 },
];

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

  const words = example?.tokens?.slice(0, 2)
    ? [...example.tokens.slice(0, 2), '???']
    : DEFAULT_WORDS;

  const options = labels?.length
    ? labels.map((word, i) => ({
        word,
        pct: Math.round((probs?.[i] ?? DEFAULT_OPTIONS[i]?.pct ?? 0) * (probs ? 100 : 1)),
      }))
    : DEFAULT_OPTIONS;

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
    const t = setInterval(cycle, 4500);
    return () => {
      clearInterval(t);
      for (const id of timeouts) clearTimeout(id);
    };
  }, [paused, firstWord, optionsKey]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {words.map((w, i) => (
          <div key={i} className="relative">
            <ActivePulse active={phase >= 1 && w === '???'} />
            <motion.span
              layout
              className={`inline-block rounded-xl px-4 py-2 font-mono text-base font-semibold ${
                w === '???'
                  ? 'border-2 border-amber-400 bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100'
                  : 'bg-indigo-500 text-white'
              }`}
              animate={w === '???' && phase >= 1 && !picked ? { scale: [1, 1.05, 1] } : { scale: 1 }}
              transition={{ repeat: w === '???' && !picked ? Infinity : 0, duration: 1 }}
            >
              {w === '???' && picked ? picked : w}
            </motion.span>
            {i < words.length - 1 && (
              <span className="mx-1 text-fd-muted-foreground">+</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <FlowArrow />
        <span className="rounded-full bg-violet-600 px-4 py-1.5 text-sm font-semibold text-white">
          🧠 Model
        </span>
        <FlowArrow />
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {options.map((opt) => (
          <motion.div
            key={opt.word}
            layout
            className={`relative overflow-hidden rounded-xl border-2 px-3 py-2 ${
              picked === opt.word
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                : 'border-fd-border bg-white dark:bg-slate-800'
            }`}
            animate={picked === opt.word ? { scale: 1.05 } : { scale: 1 }}
          >
            <span className="font-mono font-medium">{opt.word}</span>
            <div className="mt-1 h-2 w-24 overflow-hidden rounded-full bg-fd-muted">
              <motion.div
                className="h-full rounded-full bg-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: phase >= 2 ? `${opt.pct}%` : '0%' }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              />
            </div>
            <span className="text-xs text-fd-muted-foreground">{opt.pct}%</span>
            {picked === opt.word && (
              <motion.span
                className="absolute -right-1 -top-1 text-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                ✓
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
      <p className="text-center text-xs text-fd-muted-foreground">
        Context দেখে model probability বের করে → একটা token pick (autoregressive)
      </p>
    </div>
  );
}
