'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import type { ConceptExample } from './lesson-concepts';
import { ActiveRing, DataLabel, FlowConnector, SketchBox, StepDots } from './diagram-ui';

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
  const stepBn = ['ইনপুট', 'lowercase', 'ভাগ'][step];
  const stepEn = ['Input', 'lowercase', 'split'][step];

  return (
    <div className="space-y-4">
      <StepDots total={3} current={step} onSelect={setStep} />
      <DataLabel bn={`ধাপ ${step + 1}/3: ${stepBn}`} en={stepEn} />
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <div className="relative">
          <ActiveRing active={step <= 1} />
          <SketchBox
            fillStyle="solid"
            strokeStyle="solid"
            palette="blue"
            active={step <= 1}
            className="font-mono text-sm"
          >
            {text}
          </SketchBox>
        </div>
        <FlowConnector />
        <SketchBox
          fillStyle={step >= 2 ? 'hachure' : 'solid'}
          strokeStyle="solid"
          palette="green"
          className="flex min-h-[48px] min-w-[140px] flex-wrap justify-center gap-2"
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
