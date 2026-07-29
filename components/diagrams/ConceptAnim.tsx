'use client';

import { cn } from '@/lib/cn';
import { useReducedMotion } from 'motion/react';
import type { ComponentType } from 'react';
import { TokenizerSplitAnim } from './TokenizerSplitAnim';
import { NextTokenAnim } from './NextTokenAnim';
import { BigramScanAnim } from './BigramScanAnim';
import { SoftmaxBarsAnim } from './SoftmaxBarsAnim';
import { AttentionFlowAnim } from './AttentionFlowAnim';
import { TrainLoopAnim } from './TrainLoopAnim';
import { PipelineAnim } from './PipelineAnim';
import type { ConceptExample } from './lesson-concepts';

type AnimProps = { paused?: boolean; example?: ConceptExample; probs?: number[]; labels?: string[] };

const concepts: Record<string, ComponentType<AnimProps>> = {
  'tokenizer-split': TokenizerSplitAnim,
  'next-token': NextTokenAnim,
  'bigram-scan': BigramScanAnim,
  'softmax-bars': SoftmaxBarsAnim,
  'attention-flow': AttentionFlowAnim,
  'train-loop': TrainLoopAnim,
  'llm-pipeline': PipelineAnim,
};

export type ConceptAnimName = keyof typeof concepts;

export function ConceptAnim({
  name,
  caption,
  example,
  probs,
  labels,
}: {
  name: ConceptAnimName;
  caption?: string;
  example?: ConceptExample;
  probs?: number[];
  labels?: string[];
}) {
  const Component = concepts[name];
  const reducedMotion = useReducedMotion();

  if (!Component) {
    return (
      <div className="my-4 rounded-lg border border-red-300 p-4 text-sm text-red-600">
        Unknown animation: {name}
      </div>
    );
  }

  return (
    <figure
      className={cn(
        'my-8 not-prose overflow-hidden rounded-2xl border-2 border-indigo-200/70',
        'bg-gradient-to-br from-slate-50 to-indigo-50/80 shadow-md',
        'dark:border-indigo-700/50 dark:from-slate-900 dark:to-indigo-950/40',
      )}
    >
      <div className="border-b border-indigo-200/60 bg-indigo-600/10 px-4 py-2 dark:border-indigo-800/60">
        <span className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
          Live concept — বাস্তব উদাহরণ
        </span>
      </div>
      <div className="p-4 sm:p-6">
        <Component
          paused={reducedMotion ?? false}
          example={example}
          probs={probs ?? example?.probs}
          labels={labels ?? example?.labels}
        />
      </div>
      {caption && (
        <figcaption className="border-t border-indigo-200/60 px-4 py-3 text-center text-sm text-fd-muted-foreground dark:border-indigo-800/60">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function FlowArrow({ className }: { className?: string }) {
  return (
    <div className={cn('relative flex items-center justify-center px-1', className)}>
      <div className="h-0.5 w-8 bg-indigo-400 dark:bg-indigo-500" />
      <span className="absolute animate-flow-dot text-indigo-600 dark:text-indigo-400" aria-hidden>
        ▶
      </span>
    </div>
  );
}

export function ActivePulse({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <span
      className="pointer-events-none absolute inset-0 animate-pulse-ring rounded-lg ring-2 ring-emerald-500 ring-offset-2 ring-offset-transparent"
      aria-hidden
    />
  );
}
