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
  bigram: { bn: 'Bigram — শুধু শেষ word দেখে predict', en: 'context = last token' },
  neural: { bn: 'Neural LM — embedding + weights', en: 'learned P' },
  gpt: { bn: 'Mini GPT — পুরো context দেখে', en: 'attention context' },
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
  const contextWord = visible[visible.length - 1];
  const nextWord = len < chain.length ? chain[len] : null;

  return (
    <div className="space-y-4">
      <StepDots total={chain.length} current={len - 1} onSelect={(i) => setLen(i + 1)} />
      <DataLabel bn={stage.bn} en={stage.en} />
      <div className="flex flex-wrap items-center justify-center gap-2">
        {visible.map((w, i) => {
          const isLast = i === visible.length - 1;
          const isDone = i < visible.length - 1;
          const isContext = mode === 'bigram' ? isLast : true;
          return (
            <div key={`${w}-${i}`} className="flex items-center gap-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              >
                <SketchBox
                  fillStyle={isLast ? 'hachure' : 'solid'}
                  palette={isLast ? 'blue' : isDone ? 'green' : 'neutral'}
                  active={isLast}
                  className="px-3 py-2 font-mono text-sm font-medium"
                >
                  {w}
                  {mode === 'bigram' && isContext && nextWord && (
                    <div className="mt-1 text-[10px] font-sans text-fd-muted-foreground">context</div>
                  )}
                </SketchBox>
              </motion.div>
              {i < visible.length - 1 && <FlowConnector />}
            </div>
          );
        })}
        {nextWord && (
          <>
            <FlowConnector />
            <motion.div
              key={`next-${nextWord}-${len}`}
              initial={{ opacity: 0.4, scale: 0.9 }}
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1, 0.9] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            >
              <SketchBox fillStyle="solid" palette="amber" className="px-3 py-2 font-mono text-sm">
                {nextWord}?
              </SketchBox>
            </motion.div>
          </>
        )}
      </div>
      {mode === 'bigram' && nextWord && (
        <p className="text-center font-mono text-xs text-fd-muted-foreground">
          P({nextWord} | {contextWord}) → pick → add → repeat
        </p>
      )}
      <SketchBox fillStyle="solid" palette="amber" className="mx-auto w-fit text-xs">
        {mode === 'bigram' ? 'Module 2' : mode === 'neural' ? 'Module 6' : 'Module 9'}
      </SketchBox>
    </div>
  );
}
