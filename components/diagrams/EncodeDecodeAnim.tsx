'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { FlowConnector, SketchBox } from './diagram-ui';

const PAIRS = [
  { word: 'i', id: 7 },
  { word: 'like', id: 9 },
  { word: 'apple', id: 0 },
];

export function EncodeDecodeAnim({ paused }: { paused?: boolean }) {
  const [dir, setDir] = useState<'encode' | 'decode'>('encode');
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setIdx((i) => {
        if (i < PAIRS.length - 1) return i + 1;
        setDir((d) => (d === 'encode' ? 'decode' : 'encode'));
        return 0;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [paused]);

  const pair = PAIRS[idx];

  return (
    <div className="space-y-4">
      <p className="flex items-center justify-center gap-1 text-xs font-medium">
        <ArrowLeftRight className="h-3.5 w-3.5" />
        {dir === 'encode' ? 'Encode: word → ID' : 'Decode: ID → word'}
      </p>
      <div className="flex items-center justify-center gap-3">
        <motion.div
          key={`left-${dir}-${idx}`}
          initial={{ opacity: 0, x: dir === 'encode' ? -6 : 6 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <SketchBox fillStyle="hachure" strokeStyle="solid" palette="blue" active className="font-mono text-sm">
            {dir === 'encode' ? `"${pair.word}"` : pair.id}
          </SketchBox>
        </motion.div>
        <FlowConnector />
        <motion.div
          key={`right-${dir}-${idx}`}
          initial={{ opacity: 0, x: dir === 'encode' ? 6 : -6 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <SketchBox fillStyle="cross-hatch" strokeStyle="dashed" palette="green" className="font-mono text-sm">
            {dir === 'encode' ? pair.id : `"${pair.word}"`}
          </SketchBox>
        </motion.div>
      </div>
      <p className="text-center text-[10px] text-fd-muted-foreground">
        Full sentence: &quot;i like apple&quot; ↔ [7, 9, 0]
      </p>
    </div>
  );
}
