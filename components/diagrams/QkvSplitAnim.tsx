'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, FlowConnector, SketchBox, StepDots } from './diagram-ui';

const PROJ = [
  { key: 'Q', palette: 'blue' as const, label: 'Query' },
  { key: 'K', palette: 'green' as const, label: 'Key' },
  { key: 'V', palette: 'violet' as const, label: 'Value' },
];

export function QkvSplitAnim({ paused }: { paused?: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setStep((s) => (s + 1) % 4), 1200);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-4">
      <StepDots total={4} current={step} onSelect={setStep} />
      <DataLabel bn="এক embedding তিন projection-এ ভাগ" en="x → Q, K, V" />
      <div className="flex flex-wrap items-center justify-center gap-3">
        <motion.div animate={step === 0 ? { scale: 1.04 } : { scale: 1 }}>
          <SketchBox
            fillStyle={step === 0 ? 'hachure' : 'solid'}
            palette={step === 0 ? 'blue' : 'neutral'}
            active={step === 0}
            className="px-4 py-3 text-center font-mono text-sm"
          >
            <span className="text-xs text-fd-muted-foreground">embed</span>
            <div className="font-semibold">x</div>
          </SketchBox>
        </motion.div>

        {step >= 1 && <FlowConnector />}

        <div className="flex gap-2">
          {PROJ.map((p, i) => (
            <motion.div
              key={p.key}
              initial={{ opacity: 0, x: -8 }}
              animate={
                step >= 1
                  ? { opacity: step === 0 ? 0 : 1, x: 0, scale: step === i + 1 ? 1.06 : 1 }
                  : { opacity: 0, x: -8 }
              }
            >
              <SketchBox
                fillStyle={step === i + 1 ? 'hachure' : 'solid'}
                palette={p.palette}
                active={step === i + 1}
                className="px-3 py-2 text-center font-mono text-sm"
              >
                <div className="text-xs text-fd-muted-foreground">W{p.key}</div>
                <div className="font-bold">{p.key}</div>
                <div className="text-[10px]">{p.label}</div>
              </SketchBox>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
