'use client';

import { useEffect, useState } from 'react';
import { ActivePulse, FlowArrow } from './ConceptAnim';

const WORDS = ['i', 'like', '???'];
const OPTIONS = [
  { word: 'apple', pct: 50 },
  { word: 'banana', pct: 25 },
  { word: 'mango', pct: 25 },
];

export function NextTokenAnim({ paused }: { paused?: boolean }) {
  const [phase, setPhase] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  useEffect(() => {
    if (paused) return;
    const cycle = () => {
      setPhase(0);
      setPicked(null);
      setTimeout(() => setPhase(1), 800);
      setTimeout(() => setPhase(2), 2000);
      setTimeout(() => setPicked('apple'), 2800);
    };
    cycle();
    const t = setInterval(cycle, 4500);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {WORDS.map((w, i) => (
          <div key={i} className="relative">
            <ActivePulse active={phase >= 1 && w === '???'} />
            <span
              className={`inline-block rounded-xl px-4 py-2 font-mono text-base font-semibold ${
                w === '???'
                  ? 'border-2 border-amber-400 bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100'
                  : 'bg-indigo-500 text-white'
              } ${phase >= 1 && w !== '???' ? 'opacity-100' : w === '???' ? 'animate-pulse' : ''}`}
            >
              {w === '???' && picked ? picked : w}
            </span>
            {i < WORDS.length - 1 && (
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
        {OPTIONS.map((opt) => (
          <div
            key={opt.word}
            className={`relative overflow-hidden rounded-xl border-2 px-3 py-2 transition-all duration-500 ${
              picked === opt.word
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                : 'border-fd-border bg-white dark:bg-slate-800'
            }`}
          >
            <span className="font-mono font-medium">{opt.word}</span>
            <div className="mt-1 h-2 w-24 overflow-hidden rounded-full bg-fd-muted">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                style={{
                  width: phase >= 2 ? `${opt.pct}%` : '0%',
                }}
              />
            </div>
            <span className="text-xs text-fd-muted-foreground">{opt.pct}%</span>
            {picked === opt.word && (
              <span className="absolute -right-1 -top-1 animate-pop-in text-lg">✓</span>
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-fd-muted-foreground">
        Context দেখে model probability বের করে → একটা token pick (autoregressive)
      </p>
    </div>
  );
}
