'use client';

import { motion } from 'motion/react';
import { Type, List, Hash, Brain, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { DataLabel, SketchBox } from './diagram-ui';
import type { SketchFillStyle, SketchStrokeStyle } from './sketch-styles';
import type { ConceptExample } from './lesson-concepts';

const NODES: {
  label: string;
  icon: LucideIcon;
  fill: SketchFillStyle;
  stroke: SketchStrokeStyle;
  palette: 'blue' | 'green' | 'amber' | 'violet' | 'rose';
}[] = [
  { label: 'Text', icon: Type, fill: 'solid', stroke: 'solid', palette: 'blue' },
  { label: 'Tokenizer', icon: Type, fill: 'solid', stroke: 'solid', palette: 'green' },
  { label: 'Vocab', icon: List, fill: 'solid', stroke: 'solid', palette: 'violet' },
  { label: 'Encode', icon: Hash, fill: 'solid', stroke: 'solid', palette: 'amber' },
  { label: 'Model', icon: Brain, fill: 'solid', stroke: 'solid', palette: 'rose' },
  { label: 'Predict', icon: Target, fill: 'solid', stroke: 'solid', palette: 'green' },
];

export function PipelineAnim({
  paused,
  example,
}: {
  paused?: boolean;
  example?: ConceptExample;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % NODES.length), 1200);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="space-y-3 overflow-x-auto pb-1">
      <DataLabel bn="LLM pipeline — ধাপে ধাপে" en="text → predict" />
      {example?.input && (
        <p className="text-center font-mono text-sm text-fd-muted-foreground">
          Input: &quot;{example.input}&quot;
        </p>
      )}
      <div className="flex min-w-max items-center justify-center gap-1 px-2">
        {NODES.map((node, i) => {
          const Icon = node.icon;
          const isActive = active === i;
          const isDone = active > i;
          return (
            <div key={node.label} className="flex items-center">
              <motion.div animate={isActive ? { scale: 1.05 } : { scale: 1 }}>
                <SketchBox
                  fillStyle={isActive ? 'hachure' : 'solid'}
                  strokeStyle="solid"
                  palette={isDone ? 'green' : node.palette}
                  active={isActive}
                  className="flex flex-col items-center px-2.5 py-2 sm:px-3"
                >
                  <Icon className="h-4 w-4" />
                  <span className="mt-1 text-[10px] font-medium">{node.label}</span>
                </SketchBox>
              </motion.div>
              {i < NODES.length - 1 && (
                <div
                  className={`mx-0.5 h-px w-4 sm:w-6 ${isDone ? 'border-t-2 border-solid border-emerald-500' : 'border-t-2 border-dashed border-fd-border'}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
