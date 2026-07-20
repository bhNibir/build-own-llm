'use client';

import { useEffect, useState } from 'react';

const LOGITS = [
  { label: 'apple', z: 2.0 },
  { label: 'banana', z: 1.0 },
  { label: 'mango', z: 0.0 },
];
const PROBS = [0.665, 0.245, 0.09];

export function SoftmaxBarsAnim({ paused }: { paused?: boolean }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setPhase((p) => (p + 1) % 3), 2000);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-6">
        {LOGITS.map((item, i) => (
          <div key={item.label} className="flex flex-col items-center gap-2">
            <span className="font-mono text-sm font-medium">{item.label}</span>
            <div className="flex h-32 w-14 flex-col-reverse items-stretch gap-1">
              <div
                className="rounded-t-md bg-violet-400 transition-all duration-700 dark:bg-violet-600"
                style={{
                  height: phase >= 0 ? `${(item.z / 2) * 100}%` : '0%',
                }}
                title={`logit z=${item.z}`}
              />
              {phase >= 1 && (
                <div
                  className="animate-grow-up rounded-t-md bg-emerald-500"
                  style={{
                    height: `${PROBS[i] * 100}%`,
                    animationDelay: `${i * 150}ms`,
                  }}
                  title={`P=${PROBS[i]}`}
                />
              )}
            </div>
            <span className="text-xs text-fd-muted-foreground">
              {phase === 0 && `z=${item.z}`}
              {phase >= 1 && `${(PROBS[i] * 100).toFixed(1)}%`}
            </span>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-fd-muted-foreground">
        {phase === 0 && '① Raw logits (scores) — taller = more likely'}
        {phase === 1 && '② Softmax normalize — সব bar যোগ = 100%'}
        {phase === 2 && '③ Sample বা argmax দিয়ে একটা token pick'}
      </p>
    </div>
  );
}
