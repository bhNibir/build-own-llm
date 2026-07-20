'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, FlowConnector, StepChip } from './diagram-ui';

const NODES = ['a', 'b', 'c'];

export function CompGraphAnim({ paused }: { paused?: boolean }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % (NODES.length + 1)), 1400);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-4">
      <DataLabel bn="Computational graph" en="forward pass" />
      <div className="flex items-center justify-center">
        {NODES.map((n, i) => (
          <div key={n} className="flex items-center">
            <motion.div animate={{ scale: active === i ? 1.1 : 1 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
              <StepChip label={n} active={active === i} done={active > i} />
            </motion.div>
            {i < NODES.length - 1 && (
              <motion.div animate={{ opacity: active > i ? 1 : 0.35 }}>
                <FlowConnector />
              </motion.div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 text-xs text-fd-muted-foreground">
        <MonoHint label="input" show={active >= 0} />
        <MonoHint label="hidden" show={active >= 1} />
        <MonoHint label="output" show={active >= 2} />
      </div>
    </div>
  );
}

function MonoHint({ label, show }: { label: string; show: boolean }) {
  return (
    <motion.span
      className="rounded border border-fd-border px-2 py-0.5 font-mono"
      animate={{ opacity: show ? 1 : 0.3 }}
    >
      {label}
    </motion.span>
  );
}
