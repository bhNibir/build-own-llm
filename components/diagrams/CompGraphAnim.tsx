'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, FlowConnector, SketchBox } from './diagram-ui';

const NODES = ['a', 'b', 'c'];
const HINTS = [
  { bn: 'ইনপুট', en: 'input' },
  { bn: 'লুকানো', en: 'hidden' },
  { bn: 'আউটপুট', en: 'output' },
];

export function CompGraphAnim({ paused }: { paused?: boolean }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % (NODES.length + 1)), 1400);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-4">
      <DataLabel bn="কম্পিউটেশনাল গ্রাফ — সামনে এগোয়" en="forward pass" />
      <div className="flex items-center justify-center">
        {NODES.map((n, i) => (
          <div key={n} className="flex items-center">
            <motion.div animate={{ scale: active === i ? 1.1 : 1 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
              <SketchBox
                fillStyle={active === i ? 'hachure' : 'solid'}
                palette={active === i ? 'blue' : active > i ? 'green' : 'neutral'}
                active={active === i}
                className="px-3 py-1.5 font-mono text-sm font-medium"
              >
                {n}
              </SketchBox>
            </motion.div>
            {i < NODES.length - 1 && (
              <motion.div animate={{ opacity: active > i ? 1 : 0.35 }}>
                <FlowConnector />
              </motion.div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4">
        {HINTS.map((h, i) => (
          <motion.div key={h.en} animate={{ opacity: active >= i ? 1 : 0.3 }}>
            <SketchBox fillStyle="solid" palette="neutral" className="px-2 py-0.5 font-mono text-xs">
              {h.bn}
              <span className="ml-1 text-indigo-600 dark:text-indigo-400">({h.en})</span>
            </SketchBox>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
