'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, FlowConnector } from './diagram-ui';

const LAYERS = [
  { label: 'input', size: 3 },
  { label: 'hidden', size: 4 },
  { label: 'output', size: 2 },
];

export function LayerStackAnim({ paused }: { paused?: boolean }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % LAYERS.length), 1600);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-4">
      <DataLabel bn="Layer stack" en="3 → 4 → 2 neurons" />
      <div className="flex items-end justify-center gap-4">
        {LAYERS.map((layer, li) => (
          <div key={layer.label} className="flex items-end gap-3">
            <div className="flex flex-col-reverse items-center gap-1.5">
              {Array.from({ length: layer.size }, (_, ni) => (
                <motion.div
                  key={ni}
                  className="h-5 w-5 rounded-full border-2"
                  animate={{
                    scale: active === li ? 1.15 : 1,
                    borderColor: active === li ? 'rgb(99 102 241)' : 'var(--color-fd-border)',
                    backgroundColor: active === li ? 'rgba(99,102,241,0.15)' : 'transparent',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                />
              ))}
              <span className="mt-1 text-[10px] font-mono text-fd-muted-foreground">{layer.label}</span>
            </div>
            {li < LAYERS.length - 1 && <FlowConnector className="mb-6" />}
          </div>
        ))}
      </div>
    </div>
  );
}
