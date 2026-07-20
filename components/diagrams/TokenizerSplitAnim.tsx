'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import type { ConceptExample } from './lesson-concepts';
import { ActiveRing, FlowConnector } from './diagram-ui';

const DEFAULT = { input: 'I Like Apple', tokens: ['i', 'like', 'apple'] };

export function TokenizerSplitAnim({
  paused,
  example,
}: {
  paused?: boolean;
  example?: ConceptExample;
}) {
  const input = example?.input ?? DEFAULT.input;
  const tokens = example?.tokens ?? DEFAULT.tokens;
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setStep((s) => (s + 1) % 3), 2200);
    return () => clearInterval(t);
  }, [paused]);

  const text = step === 0 ? `"${input}"` : `"${input.toLowerCase()}"`;

  return (
    <div className="space-y-4">
      <p className="text-center text-xs text-fd-muted-foreground">
        Step {step + 1}/3: {['Input', 'lowercase', 'split'][step]}
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <div className="relative rounded-lg border border-fd-border bg-fd-muted/30 px-4 py-2 font-mono text-sm">
          <ActiveRing active={step <= 1} />
          {text}
        </div>
        <FlowConnector />
        <div className="flex min-h-[48px] flex-wrap justify-center gap-1.5 rounded-lg border border-fd-border bg-fd-muted/20 px-3 py-2">
          {step < 2 ? (
            <span className="text-xs text-fd-muted-foreground">…</span>
          ) : (
            tokens.map((tok, i) => (
              <motion.span
                key={tok}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="rounded border border-emerald-400/60 bg-emerald-50 px-2 py-0.5 font-mono text-xs dark:bg-emerald-950/30"
              >
                {tok}
              </motion.span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
