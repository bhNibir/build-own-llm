'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { DataLabel, FlowConnector, SketchBox, StepDots } from './diagram-ui';

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
  const stepIndex = (dir === 'encode' ? 0 : PAIRS.length) + idx;

  return (
    <div className="space-y-4">
      <StepDots
        total={PAIRS.length * 2}
        current={stepIndex}
        onSelect={(i) => {
          if (i < PAIRS.length) {
            setDir('encode');
            setIdx(i);
          } else {
            setDir('decode');
            setIdx(i - PAIRS.length);
          }
        }}
      />
      <DataLabel
        bn={dir === 'encode' ? 'Encode: শব্দ → ID' : 'Decode: ID → শব্দ'}
        en={dir === 'encode' ? 'word → ID' : 'ID → word'}
      />
      <p className="flex items-center justify-center gap-2 text-xs font-medium text-fd-muted-foreground">
        <ArrowLeftRight className="h-3.5 w-3.5" />
        bidirectional map
      </p>
      <div className="flex items-center justify-center gap-3">
        <motion.div
          key={`left-${dir}-${idx}`}
          initial={{ opacity: 0, x: dir === 'encode' ? -6 : 6 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <SketchBox fillStyle="solid" strokeStyle="solid" palette="blue" active className="font-mono text-sm">
            {dir === 'encode' ? `"${pair.word}"` : pair.id}
          </SketchBox>
        </motion.div>
        <FlowConnector />
        <motion.div
          key={`right-${dir}-${idx}`}
          initial={{ opacity: 0, x: dir === 'encode' ? 6 : -6 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <SketchBox fillStyle="solid" strokeStyle="solid" palette="green" className="font-mono text-sm">
            {dir === 'encode' ? pair.id : `"${pair.word}"`}
          </SketchBox>
        </motion.div>
      </div>
      <DataLabel bn='পূর্ণ বাক্য: "i like apple" ↔ [7, 9, 0]' en="sentence ↔ ids" />
    </div>
  );
}
