'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel } from './diagram-ui';

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
              <motion.div
                key={i}
                className={`rounded border px-2 py-1 font-mono text-xs ${
                  step === 0 ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40' : 'border-fd-border bg-fd-muted/30'
                }`}
              >
                {v}
              </motion.div>
            ))}
          </div>
        </div>

        {step >= 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-xs">
            <p className="font-semibold text-emerald-600">μ = {mean.toFixed(2)}</p>
            {step >= 2 && <p className="font-semibold text-violet-600">σ² = {variance.toFixed(2)}</p>}
          </motion.div>
        )}

        {step >= 3 && (
          <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="text-center">
            <p className="mb-2 text-xs font-semibold">normalized</p>
            <div className="flex gap-1">
              {normed.map((v, i) => (
                <div key={i} className="rounded border border-indigo-500 bg-indigo-500 px-2 py-1 font-mono text-xs text-white">
                  {v.toFixed(2)}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      <DataLabel bn="mean বাদ, variance দিয়ে scale — stable training" en="LayerNorm" />
    </div>
  );
}
