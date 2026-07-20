'use client';

import { LossChart } from '@/components/visualizer/LossChart';
import { AttentionHeatmap } from '@/components/visualizer/AttentionHeatmap';
import { SoftmaxBarsAnim } from '@/components/diagrams/SoftmaxBarsAnim';
import type { ParsedViz } from './runtime';

export function LiveVizPanel({ viz }: { viz: ParsedViz | null }) {
  if (!viz) return null;

  if (viz.type === 'loss') {
    return (
      <div className="border-t border-fd-border bg-fd-muted/20 p-3">
        <LossChart data={viz.data} title="Live training loss" />
      </div>
    );
  }

  if (viz.type === 'softmax') {
    return (
      <div className="border-t border-fd-border bg-fd-muted/20 p-3">
        <SoftmaxBarsAnim paused probs={viz.probs} labels={viz.labels} />
      </div>
    );
  }

  if (viz.type === 'attention') {
    return (
      <div className="border-t border-fd-border bg-fd-muted/20 p-3">
        <AttentionHeatmap tokens={viz.tokens} weights={viz.weights} title="Live attention" />
      </div>
    );
  }

  return null;
}
