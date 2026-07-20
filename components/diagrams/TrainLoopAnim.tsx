'use client';

import { motion } from 'motion/react';
import { Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DataLabel, FlowConnector, PlotFrame, SketchBox, StepDots } from './diagram-ui';

const STEPS = ['Forward', 'Loss', 'Backward', 'Update'];
const PALETTES = ['blue', 'amber', 'violet', 'green'] as const;

export function TrainLoopAnim({
  paused,
  mode = 'neural',
}: {
  paused?: boolean;
  mode?: 'bigram' | 'neural' | 'gpt';
}) {
  const [step, setStep] = useState(0);
  const kind = mode === 'gpt' ? 'gpt' : 'neural';
  const [epoch, setEpoch] = useState(1);
  const maxEpoch = kind === 'gpt' ? 30 : 50;
  const [loss, setLoss] = useState(kind === 'gpt' ? 2.8 : 2.4);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setStep((s) => {
        const next = (s + 1) % STEPS.length;
        if (next === 0) {
          setLoss((l) => Math.max(0.25, l - (kind === 'gpt' ? 0.28 : 0.35)));
          setEpoch((e) => (e >= maxEpoch ? 1 : e + Math.ceil(maxEpoch / 6)));
        }
        return next;
      });
    }, 1500);
    return () => clearInterval(t);
  }, [paused, kind, maxEpoch]);

  const lossBars =
    kind === 'gpt' ? [2.8, 2.1, 1.5, 1.0, 0.6, 0.35] : [2.4, 1.8, 1.2, 0.9, 0.6, 0.3];

  return (
    <div className="space-y-5">
      <StepDots total={4} current={step} onSelect={setStep} />
      <DataLabel
        bn={
          kind === 'gpt'
            ? `Mini GPT train — epoch ${epoch}/${maxEpoch}`
            : `Neural LM train — epoch ${epoch}/${maxEpoch}`
        }
        en="forward → update"
      />
      <div className="flex flex-wrap items-center justify-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-1">
            <motion.div
              layout
              animate={step === i ? { scale: 1.05 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            >
              <SketchBox
                fillStyle={step === i ? 'hachure' : 'solid'}
                palette={step === i ? PALETTES[i] : step > i ? 'green' : 'neutral'}
                active={step === i}
                className="relative px-3 py-2 text-sm font-semibold sm:px-4"
              >
                {step === i && <Activity className="mr-1 inline h-3.5 w-3.5 animate-pulse" />}
                {label}
              </SketchBox>
            </motion.div>
            {i < STEPS.length - 1 && <FlowConnector className="hidden sm:flex" />}
          </div>
        ))}
      </div>

      <PlotFrame xLabel="epoch" yLabel="loss">
        {lossBars.map((l, i) => (
          <motion.div
            key={i}
            className="w-8 rounded-t bg-emerald-500"
            initial={{ height: 0 }}
            animate={{
              height: `${(l / lossBars[0]) * 100}%`,
              opacity: loss <= l + 0.05 ? 1 : 0.3,
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 18, delay: i * 0.05 }}
            style={{ maxHeight: 120 }}
          />
        ))}
      </PlotFrame>
      <p className="text-center font-mono text-sm">
        Loss: <strong className="text-emerald-600">{loss.toFixed(2)}</strong>
        <span className="text-fd-muted-foreground">
          {' '}
          ({kind === 'gpt' ? 'transformer' : 'embedding LM'})
        </span>
      </p>
    </div>
  );
}
