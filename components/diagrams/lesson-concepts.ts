import { NEXT_AFTER_I_LIKE } from './shared-data';

export type ConceptExample = {
  input?: string;
  tokens?: string[];
  sentence?: string[];
  probs?: number[];
  labels?: string[];
};

export type ConceptConfig = {
  name: string;
  caption: string;
  example?: ConceptExample;
};

const FRUIT_NEXT: ConceptExample = {
  tokens: ['i', 'like'],
  labels: NEXT_AFTER_I_LIKE.labels,
  probs: NEXT_AFTER_I_LIKE.probs,
};

/** Single source of truth: lesson slug → concept animation */
export const LESSON_CONCEPTS: Record<string, ConceptConfig> = {
  // Module 0
  'part-00-intro/01-what-is-llm': {
    name: 'next-token',
    caption: 'P(apple | i like) ≈ 72% — next-token prediction',
    example: FRUIT_NEXT,
  },
  'part-00-intro/02-why-from-scratch': {
    name: 'blackbox-vs-glass',
    caption: 'API black box vs transparent pipeline',
  },
  'part-00-intro/03-roadmap': {
    name: 'roadmap-spine',
    caption: '10-module path: Intro → Data → Foundations → Architecture → Bridge',
  },
  // Module 1
  'part-01-tokenizer/01-llm-kivabe-kaj-kore': {
    name: 'next-token',
    caption: 'Context দেখে পরের token-এর probability',
    example: FRUIT_NEXT,
  },
  'part-01-tokenizer/02-dataset': {
    name: 'corpus-cards',
    caption: '10 fruit sentences — training corpus',
  },
  'part-01-tokenizer/03-tokenizer': {
    name: 'tokenizer-split',
    caption: '"I Like Apple" → ["i", "like", "apple"]',
    example: { input: 'I Like Apple', tokens: ['i', 'like', 'apple'] },
  },
  'part-01-tokenizer/04-vocabulary': {
    name: 'vocab-map',
    caption: '12 unique words → sorted → ID mapping',
  },
  'part-01-tokenizer/05-encoding': {
    name: 'encode-decode',
    caption: '"i like apple" ↔ [7, 9, 0]',
  },
  'part-01-tokenizer/06-training-pairs': {
    name: 'bigram-scan',
    caption: 'Pairs: (i→like), (like→apple), … — 20 total',
    example: { tokens: ['i', 'like', 'apple'] },
  },
  // Module 2
  'part-02-bigram/01-bigram-concept': {
    name: 'context-window',
    caption: 'Context window = 1 word',
  },
  'part-02-bigram/02-count-model': {
    name: 'count-table',
    caption: 'Count: like→apple appears 2 times',
  },
  'part-02-bigram/03-predict': {
    name: 'next-token',
    caption: 'Argmax from count table',
    example: FRUIT_NEXT,
  },
  'part-02-bigram/04-generate': {
    name: 'generate-chain',
    caption: 'Autoregressive: i → like → apple',
  },
  'part-02-bigram/05-sampling-vs-argmax': {
    name: 'softmax-bars',
    caption: 'Sampling vs always picking max',
    example: { probs: NEXT_AFTER_I_LIKE.probs, labels: NEXT_AFTER_I_LIKE.labels },
  },
  // Module 3
  'part-03-math/01-scalar-vector': { name: 'vector-axis', caption: 'Vectors = building blocks of embeddings' },
  'part-03-math/02-matrix': { name: 'matrix-grid', caption: 'Matrix stores weights (rows × cols)' },
  'part-03-math/03-dot-product': { name: 'dot-geometry', caption: 'Dot product = similarity / projection' },
  'part-03-math/04-matmul': { name: 'matmul-visual', caption: 'Matmul: row × column sweep' },
  'part-03-math/05-softmax': {
    name: 'softmax-bars',
    caption: 'z=[2,1,0] → P≈[66%, 24%, 9%]',
    example: { probs: [0.665, 0.245, 0.09], labels: ['apple', 'banana', 'mango'] },
  },
  // Module 4
  'part-04-autograd/01-computational-graph': { name: 'comp-graph', caption: 'Forward computational graph' },
  'part-04-autograd/02-value': { name: 'value-tape', caption: 'Value tracks data + gradient' },
  'part-04-autograd/03-backprop': { name: 'backprop-flow', caption: 'Chain rule — backward pass' },
  'part-04-autograd/04-gradient-descent': { name: 'gd-step', caption: 'W ← W − η∇L' },
  // Module 5
  'part-05-neural-network/01-neuron': { name: 'neuron-sum', caption: 'Neuron: weighted sum + activation' },
  'part-05-neural-network/02-layer': { name: 'layer-stack', caption: 'Layer = matrix of neurons' },
  'part-05-neural-network/03-mlp': { name: 'mlp-forward', caption: 'Signal through stacked layers' },
  'part-05-neural-network/04-xor': { name: 'xor-plot', caption: 'XOR: decision boundary + loss' },
  // Module 6
  'part-06-neural-lm/01-embedding': { name: 'embedding-lookup', caption: 'Word ID → embedding row lookup' },
  'part-06-neural-lm/02-weight-matrix': { name: 'logits-matmul', caption: 'E × W → logits' },
  'part-06-neural-lm/03-loss': {
    name: 'softmax-bars',
    caption: 'Cross-entropy measures prediction error',
    example: { probs: [0.665, 0.245, 0.09], labels: ['apple', 'banana', 'mango'] },
  },
  'part-06-neural-lm/04-train': { name: 'train-loop', caption: '200 epochs — loss decreases' },
  'part-06-neural-lm/05-generate': { name: 'generate-chain', caption: 'Sample from trained LM' },
  // Module 7
  'part-07-attention/01-why-attention': { name: 'dependency-lines', caption: 'Long-range token dependencies' },
  'part-07-attention/02-qkv': { name: 'qkv-split', caption: 'Embedding → Query, Key, Value' },
  'part-07-attention/03-scaled-dot-product': { name: 'attention-scores', caption: 'Q·Kᵀ scores → softmax' },
  'part-07-attention/04-self-attention': {
    name: 'attention-flow',
    caption: '"i like apple" attention weights',
    example: { tokens: ['i', 'like', 'apple'] },
  },
  'part-07-attention/05-multi-head': { name: 'multi-head-parallel', caption: 'Parallel attention heads' },
  // Module 8
  'part-08-transformer/01-positional': { name: 'positional-sine', caption: 'Position encoding added to embed' },
  'part-08-transformer/02-layer-norm': { name: 'layernorm-scale', caption: 'LayerNorm: mean/var normalize' },
  'part-08-transformer/03-ffn': { name: 'ffn-expand', caption: 'FFN: d → 4d → d' },
  'part-08-transformer/04-residual': { name: 'residual-skip', caption: 'Residual: x + sublayer(x)' },
  'part-08-transformer/05-block': { name: 'transformer-block', caption: 'Full transformer block' },
  // Module 9
  'part-09-mini-gpt/01-gpt-architecture': { name: 'gpt-stack', caption: 'Stack N transformer blocks' },
  'part-09-mini-gpt/02-train': { name: 'train-loop', caption: 'Train Mini GPT on fruit corpus' },
  'part-09-mini-gpt/03-generate': { name: 'generate-chain', caption: 'Autoregressive generation' },
  'part-09-mini-gpt/04-temperature': {
    name: 'softmax-bars',
    caption: 'Temperature widens/narrows distribution',
    example: { probs: NEXT_AFTER_I_LIKE.probs, labels: NEXT_AFTER_I_LIKE.labels },
  },
  'part-09-mini-gpt/05-top-k': { name: 'topk-filter', caption: 'Top-k filters low-probability tokens' },
  // Module 10
  'part-10-bridge/01-reading-nanogpt': { name: 'code-map', caption: 'Course modules → nanoGPT files' },
  'part-10-bridge/02-whats-next': { name: 'scale-ladder', caption: 'Fruit model → production LLM scale' },
};

export function getLessonConcept(slug: string): ConceptConfig | undefined {
  return LESSON_CONCEPTS[slug];
}
