'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, SketchBox } from './diagram-ui';

const RAW = [1.0, 3.0, 2.0, 8.0, 4.0];
const mean = RAW.reduce((a, b) => a + b, 0) / RAW.length;
const variance = RAW.reduce((a, v) => a + (v - mean) ** 2, 0) / RAW.length;
const normed = RAW.map((v) => (v - mean) / Math.sqrt(variance + 1e-6));

export function LayernormScaleAnim({ paused }: { paused?: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setStep((s) => (s + 1) % 4), 1500);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-center gap-6">
        <div className="text-center">
          <p className="mb-2 text-xs font-semibold">input x</p>
          <div className="flex gap-1">
            {RAW.map((v, i) => (
              <SketchBox
                key={i}
                fillStyle="solid"
                palette={step === 0 ? 'blue' : 'neutral'}
                active={step === 0}
                className="px-2 py-1 font-mono text-xs"
              >
                {v}
              </SketchBox>
            ))}
          </div>
        </div>

        {step >= 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col justify-center gap-1 text-center text-xs">
            <SketchBox fillStyle="solid" palette="green" className="px-2 py-1 font-semibold">
              μ = {mean.toFixed(2)}
            </SketchBox>
            {step >= 2 && (
              <SketchBox fillStyle="solid" palette="violet" className="px-2 py-1 font-semibold">
                σ² = {variance.toFixed(2)}
              </SketchBox>
            )}
          </motion.div>
        )}

        {step >= 3 && (
          <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="text-center">
            <p className="mb-2 text-xs font-semibold">normalized</p>
            <div className="flex gap-1">
              {normed.map((v, i) => (
                <SketchBox key={i} fillStyle="solid" palette="blue" active className="px-2 py-1 font-mono text-xs">
                  {v.toFixed(2)}
                </SketchBox>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      <DataLabel bn="mean বাদ, variance দিয়ে scale — stable training" en="LayerNorm" />
    </div>
  );
}
