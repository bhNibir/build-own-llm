'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DataLabel, FlowConnector, SketchBox, StepDots } from './diagram-ui';

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
      <StepDots total={LAYERS.length} current={active} onSelect={setActive} />
      <DataLabel bn="স্তর স্ট্যাক — নিউরন সংখ্যা" en="3 → 4 → 2 neurons" />
      <div className="flex items-end justify-center py-4" style={{ perspective: '500px' }}>
        <div
          className="flex items-end justify-center gap-4"
          style={{ transformStyle: 'preserve-3d', transform: 'rotateX(8deg)' }}
        >
          {LAYERS.map((layer, li) => (
            <div key={layer.label} className="flex items-end gap-3">
              <div
                className="flex flex-col-reverse items-center gap-2"
                style={{ transform: `translateZ(${li * 12}px)` }}
              >
                {Array.from({ length: layer.size }, (_, ni) => (
                  <motion.div
                    key={ni}
                    className="h-6 w-6 rounded-full border-2 shadow-sm"
                    animate={{
                      scale: active === li ? 1.15 : 1,
                      borderColor: active === li ? 'rgb(99 102 241)' : 'var(--color-fd-border)',
                      backgroundColor: active === li ? 'rgba(99,102,241,0.2)' : 'transparent',
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  />
                ))}
                <SketchBox
                  fillStyle={active === li ? 'hachure' : 'solid'}
                  palette={active === li ? 'blue' : 'neutral'}
                  className="mt-1 px-2 py-1 font-mono text-[10px] shadow"
                >
                  {layer.label}
                </SketchBox>
              </div>
              {li < LAYERS.length - 1 && <FlowConnector className="mb-8" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
