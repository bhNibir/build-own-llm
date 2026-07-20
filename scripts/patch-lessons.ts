#!/usr/bin/env bun
/**
 * Ensures each lesson has ConceptAnim; removes duplicate ```ts blocks when Playground exists.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const DOCS = join(dirname(fileURLToPath(import.meta.url)), '../content/docs');

const LESSON_CONCEPTS: Record<string, { name: string; caption: string }> = {
  'part-00-intro/01-what-is-llm': { name: 'next-token', caption: 'Example: i like → predict next token' },
  'part-00-intro/02-why-from-scratch': { name: 'llm-pipeline', caption: 'API black box vs transparent pipeline' },
  'part-00-intro/03-roadmap': { name: 'llm-pipeline', caption: '10-module path to Mini GPT' },
  'part-01-tokenizer/01-llm-kivabe-kaj-kore': { name: 'next-token', caption: 'P(apple | i like) from fruit data' },
  'part-01-tokenizer/02-dataset': { name: 'llm-pipeline', caption: '10 fruit sentences corpus' },
  'part-01-tokenizer/04-vocabulary': { name: 'tokenizer-split', caption: '12 words → unique vocab IDs' },
  'part-01-tokenizer/05-encoding': { name: 'llm-pipeline', caption: 'Encode sentence to number array' },
  'part-01-tokenizer/06-training-pairs': { name: 'bigram-scan', caption: 'Training pairs from fruit sentences' },
  'part-02-bigram/01-bigram-concept': { name: 'bigram-scan', caption: 'One word context window' },
  'part-02-bigram/03-predict': { name: 'next-token', caption: 'Argmax prediction from counts' },
  'part-02-bigram/04-generate': { name: 'next-token', caption: 'Generate: i like apple …' },
  'part-02-bigram/05-sampling-vs-argmax': { name: 'softmax-bars', caption: 'Sampling vs always picking max' },
  'part-03-math/01-scalar-vector': { name: 'llm-pipeline', caption: 'Vectors = building blocks' },
  'part-03-math/02-matrix': { name: 'llm-pipeline', caption: 'Matrix stores weights' },
  'part-03-math/03-dot-product': { name: 'attention-flow', caption: 'Dot product = similarity' },
  'part-03-math/04-matmul': { name: 'llm-pipeline', caption: 'Matmul in attention and FFN' },
  'part-04-autograd/01-computational-graph': { name: 'train-loop', caption: 'Computational graph' },
  'part-04-autograd/02-value': { name: 'train-loop', caption: 'Value + backward' },
  'part-04-autograd/03-backprop': { name: 'train-loop', caption: 'Backprop chain rule' },
  'part-04-autograd/04-gradient-descent': { name: 'train-loop', caption: 'Gradient descent update' },
  'part-05-neural-network/01-neuron': { name: 'llm-pipeline', caption: 'Single neuron forward pass' },
  'part-05-neural-network/02-layer': { name: 'llm-pipeline', caption: 'Layer of neurons' },
  'part-05-neural-network/03-mlp': { name: 'llm-pipeline', caption: 'Multi-layer perceptron' },
  'part-05-neural-network/04-xor': { name: 'train-loop', caption: 'XOR training loop' },
  'part-06-neural-lm/01-embedding': { name: 'llm-pipeline', caption: 'Embedding lookup table' },
  'part-06-neural-lm/02-weight-matrix': { name: 'next-token', caption: 'Weight matrix → logits' },
  'part-06-neural-lm/03-loss': { name: 'softmax-bars', caption: 'Cross-entropy loss' },
  'part-06-neural-lm/05-generate': { name: 'next-token', caption: 'Generate from neural LM' },
  'part-07-attention/01-why-attention': { name: 'attention-flow', caption: 'Long-range dependencies' },
  'part-07-attention/02-qkv': { name: 'attention-flow', caption: 'Query, Key, Value' },
  'part-07-attention/03-scaled-dot-product': { name: 'attention-flow', caption: 'Scaled dot-product attention' },
  'part-07-attention/05-multi-head': { name: 'attention-flow', caption: 'Multi-head attention' },
  'part-08-transformer/01-positional': { name: 'llm-pipeline', caption: 'Positional encoding' },
  'part-08-transformer/02-layer-norm': { name: 'train-loop', caption: 'Layer normalization' },
  'part-08-transformer/03-ffn': { name: 'llm-pipeline', caption: 'Feed-forward network' },
  'part-08-transformer/04-residual': { name: 'train-loop', caption: 'Residual connection' },
  'part-08-transformer/05-block': { name: 'llm-pipeline', caption: 'Transformer block assembly' },
  'part-09-mini-gpt/01-gpt-architecture': { name: 'llm-pipeline', caption: 'GPT = stack of blocks' },
  'part-09-mini-gpt/02-train': { name: 'train-loop', caption: 'Train Mini GPT' },
  'part-09-mini-gpt/03-generate': { name: 'next-token', caption: 'Autoregressive generation' },
  'part-09-mini-gpt/04-temperature': { name: 'softmax-bars', caption: 'Temperature sampling' },
  'part-09-mini-gpt/05-top-k': { name: 'softmax-bars', caption: 'Top-k sampling' },
  'part-10-bridge/01-reading-nanogpt': { name: 'llm-pipeline', caption: 'Course → nanoGPT map' },
  'part-10-bridge/02-whats-next': { name: 'llm-pipeline', caption: 'Scaling to production' },
};

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(p)));
    else if (e.name.endsWith('.mdx') && e.name !== 'index.mdx') files.push(p);
  }
  return files;
}

function removeTsBlocksWhenPlayground(content: string): string {
  if (!content.includes('<Playground')) return content;
  return content.replace(/```ts\n[\s\S]*?```\n\n/g, '');
}

function ensureConceptAnim(content: string, slug: string): string {
  if (content.includes('<ConceptAnim') || content.includes('index.mdx')) return content;
  const cfg = LESSON_CONCEPTS[slug];
  if (!cfg) return content;
  const tag = `<ConceptAnim name="${cfg.name}" caption="${cfg.caption}" />\n\n`;
  const h1 = content.match(/^# .+\n\n/m);
  if (h1) {
    const idx = content.indexOf(h1[0]) + h1[0].length;
    return content.slice(0, idx) + tag + content.slice(idx);
  }
  return tag + content;
}

const files = await walk(DOCS);
let updated = 0;
for (const file of files) {
  const slug = relative(DOCS, file).replace(/\.mdx$/, '');
  let content = await readFile(file, 'utf8');
  const next = ensureConceptAnim(removeTsBlocksWhenPlayground(content), slug);
  if (next !== content) {
    await writeFile(file, next);
    updated++;
  }
}
console.log(`Updated ${updated} MDX files`);
