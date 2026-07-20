'use client';

import { useReducedMotion } from 'motion/react';
import type { ComponentType } from 'react';
import { ConceptFrame } from './diagram-ui';
import { getLessonConcept, type ConceptExample } from './lesson-concepts';
import { TokenizerSplitAnim } from './TokenizerSplitAnim';
import { NextTokenAnim } from './NextTokenAnim';
import { BigramScanAnim } from './BigramScanAnim';
import { SoftmaxBarsAnim } from './SoftmaxBarsAnim';
import { AttentionFlowAnim } from './AttentionFlowAnim';
import { TrainLoopAnim } from './TrainLoopAnim';
import { PipelineAnim } from './PipelineAnim';
import { RoadmapSpineAnim } from './RoadmapSpineAnim';
import { BlackBoxGlassAnim } from './BlackBoxGlassAnim';
import { CorpusCardsAnim } from './CorpusCardsAnim';
import { VocabMapAnim } from './VocabMapAnim';
import { EncodeDecodeAnim } from './EncodeDecodeAnim';
import { PipelineZoomAnim } from './PipelineZoomAnim';
import { ContextWindowAnim } from './ContextWindowAnim';
import { CountTableAnim } from './CountTableAnim';
import { GenerateChainAnim } from './GenerateChainAnim';
import { VectorAxisAnim } from './VectorAxisAnim';
import { MatrixGridAnim } from './MatrixGridAnim';
import { DotGeometryAnim } from './DotGeometryAnim';
import { MatmulVisualAnim } from './MatmulVisualAnim';
import { CompGraphAnim } from './CompGraphAnim';
import { ValueTapeAnim } from './ValueTapeAnim';
import { BackpropFlowAnim } from './BackpropFlowAnim';
import { GdStepAnim } from './GdStepAnim';
import { NeuronSumAnim } from './NeuronSumAnim';
import { LayerStackAnim } from './LayerStackAnim';
import { MlpForwardAnim } from './MlpForwardAnim';
import { XorPlotAnim } from './XorPlotAnim';
import { EmbeddingLookupAnim } from './EmbeddingLookupAnim';
import { LogitsMatmulAnim } from './LogitsMatmulAnim';
import { DependencyLinesAnim } from './DependencyLinesAnim';
import { QkvSplitAnim } from './QkvSplitAnim';
import { AttentionScoresAnim } from './AttentionScoresAnim';
import { MultiHeadParallelAnim } from './MultiHeadParallelAnim';
import { PositionalSineAnim } from './PositionalSineAnim';
import { LayernormScaleAnim } from './LayernormScaleAnim';
import { FfnExpandAnim } from './FfnExpandAnim';
import { ResidualSkipAnim } from './ResidualSkipAnim';
import { TransformerBlockAnim } from './TransformerBlockAnim';
import { GptStackAnim } from './GptStackAnim';
import { TopkFilterAnim } from './TopkFilterAnim';
import { CodeMapAnim } from './CodeMapAnim';
import { ScaleLadderAnim } from './ScaleLadderAnim';

type AnimProps = {
  paused?: boolean;
  example?: ConceptExample;
  probs?: number[];
  labels?: string[];
};

const concepts: Record<string, ComponentType<AnimProps>> = {
  'tokenizer-split': TokenizerSplitAnim,
  'next-token': NextTokenAnim,
  'bigram-scan': BigramScanAnim,
  'softmax-bars': SoftmaxBarsAnim,
  'attention-flow': AttentionFlowAnim,
  'train-loop': TrainLoopAnim,
  'llm-pipeline': PipelineAnim,
  'roadmap-spine': RoadmapSpineAnim,
  'blackbox-vs-glass': BlackBoxGlassAnim,
  'corpus-cards': CorpusCardsAnim,
  'vocab-map': VocabMapAnim,
  'encode-decode': EncodeDecodeAnim,
  'pipeline-zoom': PipelineZoomAnim,
  'context-window': ContextWindowAnim,
  'count-table': CountTableAnim,
  'generate-chain': GenerateChainAnim,
  'vector-axis': VectorAxisAnim,
  'matrix-grid': MatrixGridAnim,
  'dot-geometry': DotGeometryAnim,
  'matmul-visual': MatmulVisualAnim,
  'comp-graph': CompGraphAnim,
  'value-tape': ValueTapeAnim,
  'backprop-flow': BackpropFlowAnim,
  'gd-step': GdStepAnim,
  'neuron-sum': NeuronSumAnim,
  'layer-stack': LayerStackAnim,
  'mlp-forward': MlpForwardAnim,
  'xor-plot': XorPlotAnim,
  'embedding-lookup': EmbeddingLookupAnim,
  'logits-matmul': LogitsMatmulAnim,
  'dependency-lines': DependencyLinesAnim,
  'qkv-split': QkvSplitAnim,
  'attention-scores': AttentionScoresAnim,
  'multi-head-parallel': MultiHeadParallelAnim,
  'positional-sine': PositionalSineAnim,
  'layernorm-scale': LayernormScaleAnim,
  'ffn-expand': FfnExpandAnim,
  'residual-skip': ResidualSkipAnim,
  'transformer-block': TransformerBlockAnim,
  'gpt-stack': GptStackAnim,
  'topk-filter': TopkFilterAnim,
  'code-map': CodeMapAnim,
  'scale-ladder': ScaleLadderAnim,
};

export type ConceptAnimName = keyof typeof concepts;

export function ConceptAnim({
  slug,
  name: nameProp,
  caption: captionProp,
  example: exampleProp,
  probs: probsProp,
  labels: labelsProp,
}: {
  slug?: string;
  name?: ConceptAnimName;
  caption?: string;
  example?: ConceptExample;
  probs?: number[];
  labels?: string[];
}) {
  const lesson = slug ? getLessonConcept(slug) : undefined;
  const name = (nameProp ?? lesson?.name) as ConceptAnimName | undefined;
  const caption = captionProp ?? lesson?.caption;
  const example = exampleProp ?? lesson?.example;
  const probs = probsProp ?? example?.probs;
  const labels = labelsProp ?? example?.labels;

  const Component = name ? concepts[name] : undefined;
  const reducedMotion = useReducedMotion();

  if (!Component || !name) {
    return (
      <div className="my-4 rounded-lg border border-red-300 p-4 text-sm text-red-600">
        Unknown animation{slug ? ` for ${slug}` : ''}: {name ?? 'missing name'}
      </div>
    );
  }

  return (
    <ConceptFrame caption={caption}>
      <Component
        paused={reducedMotion ?? false}
        example={example}
        probs={probs}
        labels={labels}
      />
    </ConceptFrame>
  );
}

/** @deprecated use FlowConnector from diagram-ui */
export { FlowConnector as FlowArrow } from './diagram-ui';
export { ActiveRing as ActivePulse } from './diagram-ui';
