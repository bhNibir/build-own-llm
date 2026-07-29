'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, FlowConnector, SketchBox, StepDots } from './diagram-ui';

const LAYERS = [
  { label: 'd', width: 48, nodes: 3 },
  { label: '4d', width: 120, nodes: 8 },
  { label: 'd', width: 48, nodes: 3 },
];

export function FfnExpandAnim({ paused }: { paused?: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setStep((s) => (s + 1) % 4), 1300);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-4">
      <StepDots total={4} current={step} onSelect={setStep} />
      <DataLabel bn="FFN প্রথমে expand (4d), তারপর compress" en="d → 4d → d" />
      <div className="flex items-end justify-center gap-2">
        {LAYERS.map((layer, i) => {
          const lit = step === i || (step === 3 && i === 2);
          return (
            <div key={layer.label + i} className="flex items-end gap-2">
              {i > 0 && <FlowConnector />}
              <motion.div
                className="flex flex-col items-center gap-2"
                animate={lit ? { scale: 1.04 } : { scale: 1 }}
              >
                <SketchBox
                  fillStyle={lit ? 'hachure' : 'solid'}
                  palette={lit ? (i === 1 ? 'amber' : 'blue') : 'neutral'}
                  active={lit}
                  className="flex items-end justify-center gap-2 p-2"
                >
                  <div className="flex items-end justify-center gap-2" style={{ minWidth: layer.width }}>
                    {Array.from({ length: layer.nodes }, (_, n) => (
                      <motion.div
                        key={n}
                        className="w-2 rounded-t bg-indigo-500/70"
                        animate={{
                          height: step >= i ? 12 + n * 4 : 8,
                        }}
                        transition={{ delay: n * 0.04 }}
                      />
                    ))}
                  </div>
                </SketchBox>
                <span className="font-mono text-xs font-semibold">{layer.label}</span>
                {i === 1 && <span className="text-[10px] text-fd-muted-foreground">ReLU</span>}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
