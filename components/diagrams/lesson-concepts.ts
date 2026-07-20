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

/** Default concept animation per lesson slug (path without .mdx) */
export const LESSON_CONCEPTS: Record<string, ConceptConfig> = {
  'part-00-intro/01-what-is-llm': {
    name: 'next-token',
    caption: 'Example: "i like" → predict apple (50%)',
  },
  'part-00-intro/02-why-from-scratch': {
    name: 'llm-pipeline',
    caption: 'Transparent pipeline vs black-box API',
  },
  'part-00-intro/03-roadmap': { name: 'llm-pipeline', caption: '10-module learning path' },
  'part-01-tokenizer/01-llm-kivabe-kaj-kore': {
    name: 'next-token',
    caption: 'Fruit dataset: P(apple | i like) = 72%',
  },
  'part-01-tokenizer/02-dataset': {
    name: 'llm-pipeline',
    caption: '10 fruit sentences → tokenizer → model',
  },
  'part-01-tokenizer/03-tokenizer': {
    name: 'tokenizer-split',
    caption: '"I Like Apple" → ["i", "like", "apple"]',
    example: { input: 'I Like Apple', tokens: ['i', 'like', 'apple'] },
  },
  'part-01-tokenizer/04-vocabulary': {
    name: 'tokenizer-split',
    caption: '12 unique words in fruit corpus',
  },
  'part-01-tokenizer/05-encoding': {
    name: 'llm-pipeline',
    caption: 'Word → ID mapping from vocabulary',
  },
  'part-01-tokenizer/06-training-pairs': {
    name: 'bigram-scan',
    caption: 'Pairs: (i→like), (like→apple), …',
  },
  'part-02-bigram/01-bigram-concept': {
    name: 'bigram-scan',
    caption: 'Context window = 1 word',
  },
  'part-02-bigram/02-count-model': {
    name: 'bigram-scan',
    caption: 'Count: like→apple appears 2 times',
    example: { tokens: ['i', 'like', 'apple'] },
  },
  'part-02-bigram/03-predict': { name: 'next-token', caption: 'Argmax from count table' },
  'part-02-bigram/04-generate': { name: 'next-token', caption: 'Autoregressive: i → like → apple' },
  'part-02-bigram/05-sampling-vs-argmax': {
    name: 'softmax-bars',
    caption: 'Temperature changes bar heights',
  },
  'part-03-math/01-scalar-vector': { name: 'llm-pipeline', caption: 'Vectors = foundation of embeddings' },
  'part-03-math/02-matrix': { name: 'llm-pipeline', caption: 'Matrix stores embedding weights' },
  'part-03-math/03-dot-product': { name: 'attention-flow', caption: 'Dot product = similarity score' },
  'part-03-math/04-matmul': { name: 'llm-pipeline', caption: 'Matmul powers attention and FFN' },
  'part-03-math/05-softmax': {
    name: 'softmax-bars',
    caption: 'z=[2,1,0] → P≈[66%,24%,9%]',
    example: { probs: [0.665, 0.245, 0.09], labels: ['apple', 'banana', 'mango'] },
  },
  'part-04-autograd/01-computational-graph': { name: 'train-loop', caption: 'Forward → backward graph' },
  'part-04-autograd/02-value': { name: 'train-loop', caption: 'Value tracks gradients' },
  'part-04-autograd/03-backprop': { name: 'train-loop', caption: 'Chain rule backward pass' },
  'part-04-autograd/04-gradient-descent': { name: 'train-loop', caption: 'W ← W − η∇L' },
  'part-05-neural-network/01-neuron': { name: 'llm-pipeline', caption: 'Neuron: weighted sum + activation' },
  'part-05-neural-network/02-layer': { name: 'llm-pipeline', caption: 'Layer = matrix of neurons' },
  'part-05-neural-network/03-mlp': { name: 'llm-pipeline', caption: 'Stack layers → MLP' },
  'part-05-neural-network/04-xor': { name: 'train-loop', caption: 'XOR: loss drops over epochs' },
  'part-06-neural-lm/01-embedding': { name: 'llm-pipeline', caption: 'Word ID → vector lookup' },
  'part-06-neural-lm/02-weight-matrix': { name: 'next-token', caption: 'W × embedding → logits' },
  'part-06-neural-lm/03-loss': { name: 'softmax-bars', caption: 'Cross-entropy measures error' },
  'part-06-neural-lm/04-train': { name: 'train-loop', caption: '200 epochs on fruit data' },
  'part-06-neural-lm/05-generate': { name: 'next-token', caption: 'Sample from trained LM' },
  'part-07-attention/01-why-attention': { name: 'attention-flow', caption: 'Long-range dependencies' },
  'part-07-attention/02-qkv': { name: 'attention-flow', caption: 'Q·K = relevance score' },
  'part-07-attention/03-scaled-dot-product': { name: 'attention-flow', caption: 'Softmax(QK^T/√d)' },
  'part-07-attention/04-self-attention': {
    name: 'attention-flow',
    caption: '"i like apple" attention weights',
    example: { tokens: ['i', 'like', 'apple'] },
  },
  'part-07-attention/05-multi-head': { name: 'attention-flow', caption: 'Parallel attention heads' },
  'part-08-transformer/01-positional': { name: 'llm-pipeline', caption: 'Position encoding added' },
  'part-08-transformer/02-layer-norm': { name: 'train-loop', caption: 'Normalize activations' },
  'part-08-transformer/03-ffn': { name: 'llm-pipeline', caption: 'Position-wise MLP' },
  'part-08-transformer/04-residual': { name: 'train-loop', caption: 'x + sublayer(x)' },
  'part-08-transformer/05-block': { name: 'llm-pipeline', caption: 'Full transformer block' },
  'part-09-mini-gpt/01-gpt-architecture': { name: 'llm-pipeline', caption: 'Stack N transformer blocks' },
  'part-09-mini-gpt/02-train': { name: 'train-loop', caption: 'Train Mini GPT on fruit corpus' },
  'part-09-mini-gpt/03-generate': { name: 'next-token', caption: 'Generate fruit sentences' },
  'part-09-mini-gpt/04-temperature': { name: 'softmax-bars', caption: 'Temperature widens/narrows bars' },
  'part-09-mini-gpt/05-top-k': { name: 'softmax-bars', caption: 'Top-k filters low prob tokens' },
  'part-10-bridge/01-reading-nanogpt': { name: 'llm-pipeline', caption: 'Map course → nanoGPT code' },
  'part-10-bridge/02-whats-next': { name: 'llm-pipeline', caption: 'Scale to production LLM' },
};
