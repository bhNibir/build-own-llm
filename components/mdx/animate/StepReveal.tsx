'use client';

import { cn } from '@/lib/cn';
import { useEffect, useState } from 'react';

type Step = { emoji?: string; title: string; body?: string };

export function StepReveal({
  steps,
  interval = 800,
}: {
  steps: Step[];
  interval?: number;
}) {
  const [visible, setVisible] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setVisible(steps.length);
      return;
    }

    if (visible >= steps.length) return;

    const timer = setTimeout(() => setVisible((v) => v + 1), interval);
    return () => clearTimeout(timer);
  }, [visible, steps.length, interval, reducedMotion]);

  return (
    <div className="my-6 not-prose space-y-3">
      {steps.map((step, i) => (
        <div
          key={step.title}
          className={cn(
            'flex gap-3 rounded-lg border border-fd-border px-4 py-3 transition-all duration-500',
            i < visible
              ? 'translate-x-0 opacity-100 bg-fd-muted/30'
              : 'translate-x-4 opacity-0 pointer-events-none h-0 overflow-hidden py-0 border-0',
          )}
          style={{ transitionDelay: reducedMotion ? '0ms' : `${i * 100}ms` }}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fd-primary text-sm font-bold text-fd-primary-foreground">
            {step.emoji ?? i + 1}
          </span>
          <div>
            <p className="font-medium text-fd-foreground">{step.title}</p>
            {step.body && (
              <p className="mt-1 text-sm text-fd-muted-foreground">{step.body}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TokenFlow() {
  return (
    <div className="my-4 not-prose flex items-center justify-center gap-2 overflow-x-auto py-4">
      {['📝 Text', '🔤 Tokens', '🔢 IDs', '🎯 Predict'].map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <span
            className="animate-token-flow rounded-lg border border-fd-border bg-fd-muted/50 px-3 py-2 text-sm font-medium whitespace-nowrap"
            style={{ animationDelay: `${i * 400}ms` }}
          >
            {label}
          </span>
          {i < 3 && (
            <span className="text-fd-muted-foreground animate-pulse">→</span>
          )}
        </div>
      ))}
    </div>
  );
}
