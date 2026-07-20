'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Box, Eye } from 'lucide-react';
import { FlowConnector, SketchBox } from './diagram-ui';

export function BlackBoxGlassAnim({ paused }: { paused?: boolean }) {
  const [side, setSide] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setSide((s) => (s + 1) % 2), 3000);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <motion.div animate={side === 0 ? { scale: 1.01 } : { scale: 1, opacity: 0.65 }}>
        <SketchBox
          fillStyle="solid"
          strokeStyle="dotted"
          palette="amber"
          active={side === 0}
          className="p-4"
        >
          <p className="mb-2 flex items-center gap-1 text-xs font-semibold">
            <Box className="h-3.5 w-3.5" /> API (black box)
          </p>
          <div className="flex items-center justify-center gap-1 text-xs font-mono">
            <span className="rounded border border-solid px-2 py-1">App</span>
            <FlowConnector />
            <span className="rounded border border-dotted px-2 py-1">???</span>
            <FlowConnector />
            <span className="rounded border border-solid px-2 py-1">Output</span>
          </div>
        </SketchBox>
      </motion.div>
      <motion.div animate={side === 1 ? { scale: 1.01 } : { scale: 1, opacity: 0.65 }}>
        <SketchBox
          fillStyle="hachure"
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
                <span className="rounded border border-dashed px-1.5 py-0.5">{s}</span>
                {i < 3 && <span>→</span>}
              </span>
            ))}
          </div>
        </SketchBox>
      </motion.div>
    </div>
  );
}
