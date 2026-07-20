'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, FlowConnector, StepChip } from './diagram-ui';

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
      <DataLabel bn="Backpropagation" en="grad flows backward" />
      <div className="flex items-center justify-center">
        {NODES.map((n, i) => (
          <div key={n} className="flex items-center">
            <motion.div animate={{ scale: edge === i ? 1.1 : 1 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
              <StepChip label={n} active={edge === i} done={edge > i} />
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
      <p className="text-center text-xs text-fd-muted-foreground">loss at c → chain rule → update a</p>
    </div>
  );
}
