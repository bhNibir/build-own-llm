'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, FlowConnector, SketchBox } from './diagram-ui';

const NODES = ['c', 'b', 'a'];

export function BackpropFlowAnim({ paused }: { paused?: boolean }) {
  const [edge, setEdge] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setEdge((e) => (e + 1) % NODES.length), 1500);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-4">
      <DataLabel bn="ব্যাকপ্রপ — গ্র্যাডিয়েন্ট পেছনে যায়" en="grad flows backward" />
      <div className="flex items-center justify-center">
        {NODES.map((n, i) => (
          <div key={n} className="flex items-center">
            <motion.div animate={{ scale: edge === i ? 1.1 : 1 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
              <SketchBox
                fillStyle={edge === i ? 'hachure' : 'solid'}
                palette={edge === i ? 'violet' : edge > i ? 'green' : 'neutral'}
                active={edge === i}
                className="px-3 py-1.5 font-mono text-sm font-medium"
              >
                {n}
              </SketchBox>
            </motion.div>
            {i < NODES.length - 1 && (
              <motion.div
                className="relative flex items-center px-1"
                animate={{ opacity: edge === i ? 1 : 0.3 }}
              >
                <FlowConnector />
                {edge === i && (
                  <motion.span
                    className="absolute left-1/2 -translate-x-1/2 font-mono text-[10px] text-indigo-600 dark:text-indigo-400"
                    animate={{ x: [-6, 6, -6] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    ∂L
                  </motion.span>
                )}
              </motion.div>
            )}
          </div>
        ))}
      </div>
      <DataLabel bn="loss at c → chain rule → update a" en="backprop" />
    </div>
  );
}
