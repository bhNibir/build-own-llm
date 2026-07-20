'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, FlowConnector, SketchBox, StepDots } from './diagram-ui';

const CHAINS: Record<string, string[]> = {
  bigram: ['i', 'like', 'apple'],
  neural: ['i', 'like', 'banana', 'is'],
  gpt: ['i', 'like', 'mango', 'is', 'fruit'],
};

const STAGE: Record<string, { bn: string; en: string }> = {
  bigram: { bn: 'Bigram — শুধু আগের ১টা word', en: 'count table' },
  neural: { bn: 'Neural LM — embedding + weights', en: 'learned P' },
  gpt: { bn: 'Mini GPT — transformer stack', en: 'attention context' },
};

export function GenerateChainAnim({
  paused,
  mode = 'bigram',
}: {
  paused?: boolean;
  mode?: 'bigram' | 'neural' | 'gpt';
}) {
  const chain = CHAINS[mode] ?? CHAINS.bigram;
  const [len, setLen] = useState(1);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setLen((l) => (l >= chain.length ? 1 : l + 1)), 1200);
    return () => clearInterval(t);
  }, [paused, chain.length]);

  const visible = chain.slice(0, len);
  const stage = STAGE[mode];

  return (
    <div className="space-y-4">
      <StepDots total={chain.length} current={len - 1} onSelect={(i) => setLen(i + 1)} />
      <DataLabel bn={stage.bn} en={stage.en} />
      <div className="flex flex-wrap items-center justify-center gap-2">
        {visible.map((w, i) => {
          const isLast = i === visible.length - 1;
          const isDone = i < visible.length - 1;
          return (
            <div key={`${w}-${i}`} className="flex items-center gap-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              >
                <SketchBox
                  fillStyle={isLast ? 'hachure' : 'solid'}
                  palette={isLast ? 'blue' : isDone ? 'green' : 'neutral'}
                  active={isLast}
                  className="px-3 py-2 font-mono text-sm font-medium"
                >
                  {w}
                </SketchBox>
              </motion.div>
              {i < visible.length - 1 && <FlowConnector />}
            </div>
          );
        })}
        {len < chain.length && (
          <>
            <FlowConnector />
            <SketchBox fillStyle="solid" palette="neutral" className="px-3 py-2 font-mono text-sm">
              …
            </SketchBox>
          </>
        )}
      </div>
      <SketchBox fillStyle="solid" palette="amber" className="mx-auto w-fit text-xs">
        {mode === 'bigram' ? 'Module 2' : mode === 'neural' ? 'Module 6' : 'Module 9'}
      </SketchBox>
    </div>
  );
}
