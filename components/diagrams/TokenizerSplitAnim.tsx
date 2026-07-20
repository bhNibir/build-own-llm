'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import type { ConceptExample } from './lesson-concepts';
import { ActiveRing, FlowConnector, SketchBox } from './diagram-ui';

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
  const fills = ['solid', 'hachure', 'cross-hatch'] as const;
  const strokes = ['solid', 'dashed', 'dotted'] as const;

  return (
    <div className="space-y-4">
      <p className="text-center text-xs text-fd-muted-foreground">
        Step {step + 1}/3: {['Input', 'lowercase', 'split'][step]}
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <div className="relative">
          <ActiveRing active={step <= 1} />
          <SketchBox
            fillStyle={fills[step]}
            strokeStyle={strokes[step]}
            palette="blue"
            active={step <= 1}
            className="font-mono text-sm"
          >
            {text}
          </SketchBox>
        </div>
        <FlowConnector />
        <SketchBox
          fillStyle={step >= 2 ? 'cross-hatch' : 'solid'}
          strokeStyle={step >= 2 ? 'solid' : 'dotted'}
          palette="green"
          className="flex min-h-[48px] min-w-[140px] flex-wrap justify-center gap-1.5"
        >
          {step < 2 ? (
            <span className="text-xs text-fd-muted-foreground">…</span>
          ) : (
            tokens.map((tok, i) => (
              <motion.span
                key={tok}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="font-mono text-xs"
              >
                {tok}
              </motion.span>
            ))
          )}
        </SketchBox>
      </div>
    </div>
  );
}
