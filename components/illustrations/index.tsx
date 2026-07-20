'use client';

import { BigramWindow } from './BigramWindow';
import { LlmPredict } from './LlmPredict';
import { MatrixGrid } from './MatrixGrid';
import { NeuronDiagram } from './NeuronDiagram';
import { AttentionMap } from './AttentionMap';
import { TokenPipeline } from './TokenPipeline';
import { TransformerBlock } from './TransformerBlock';

const illustrations = {
  'token-pipeline': TokenPipeline,
  'llm-predict': LlmPredict,
  'bigram-window': BigramWindow,
  'matrix-grid': MatrixGrid,
  'neuron-diagram': NeuronDiagram,
  'attention-map': AttentionMap,
  'transformer-block': TransformerBlock,
} as const;

export type IllustrationName = keyof typeof illustrations;

export function Illustration({ name }: { name: IllustrationName }) {
  const Component = illustrations[name];
  if (!Component) {
    return (
      <div className="my-4 rounded-lg border border-red-300 p-4 text-sm text-red-600">
        Unknown illustration: {name}
      </div>
    );
  }
  return (
    <div className="my-6 not-prose flex justify-center">
      <Component />
    </div>
  );
}
