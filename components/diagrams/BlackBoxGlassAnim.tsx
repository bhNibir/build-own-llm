'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Box, Eye } from 'lucide-react';
import { DataLabel, FlowConnector, SketchBox } from './diagram-ui';

export function BlackBoxGlassAnim({ paused }: { paused?: boolean }) {
  const [side, setSide] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setSide((s) => (s + 1) % 2), 3000);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-3">
      <DataLabel bn="কালো বাক্স বনাম স্বচ্ছ বাক্স" en="black box vs glass box" />
      <div className="grid gap-4 sm:grid-cols-2">
        <motion.div animate={side === 0 ? { scale: 1.02 } : { scale: 1, opacity: 0.88 }}>
          <SketchBox
            fillStyle="solid"
            strokeStyle="solid"
            palette="amber"
            active={side === 0}
            className="p-4"
          >
            <p className="mb-2 flex items-center gap-1 text-xs font-semibold">
              <Box className="h-3.5 w-3.5" /> API (black box)
            </p>
            <div className="flex items-center justify-center gap-1 text-xs font-mono">
              <SketchBox fillStyle="solid" palette="neutral" className="px-2 py-1 text-xs">
                App
              </SketchBox>
              <FlowConnector />
              <SketchBox fillStyle="hachure" palette="rose" className="px-2 py-1 text-xs">
                ???
              </SketchBox>
              <FlowConnector />
              <SketchBox fillStyle="solid" palette="neutral" className="px-2 py-1 text-xs">
                Output
              </SketchBox>
            </div>
          </SketchBox>
        </motion.div>
        <motion.div animate={side === 1 ? { scale: 1.02 } : { scale: 1, opacity: 0.88 }}>
          <SketchBox
            fillStyle="solid"
            strokeStyle="solid"
            palette="blue"
            active={side === 1}
            className="p-4"
          >
            <p className="mb-2 flex items-center gap-1 text-xs font-semibold">
              <Eye className="h-3.5 w-3.5" /> From scratch (glass box)
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1 text-[10px] font-mono">
              {['Tokenizer', 'Embed', 'Attn', 'Predict'].map((s, i) => (
                <span key={s} className="flex items-center gap-1">
                  <SketchBox fillStyle="solid" palette="violet" className="px-1.5 py-0.5 text-[10px]">
                    {s}
                  </SketchBox>
                  {i < 3 && <span>→</span>}
                </span>
              ))}
            </div>
          </SketchBox>
        </motion.div>
      </div>
    </div>
  );
}
