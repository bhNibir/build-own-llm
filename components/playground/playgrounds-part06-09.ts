export type PlaygroundEntry = {
  files: Record<string, string>;
  template: 'vanilla-ts';
  activeFile: string;
};

export const playgroundsPart06to09: Record<string, PlaygroundEntry> = {
  'part-06/embedding': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `// Embedding matrix: each row = one token's vector
const vocab = ['i', 'like', 'apple', 'fruit'];
const embedDim = 4;

// Rows indexed by token ID (hand-set for demo)
const E: number[][] = [
  [0.12, 0.05, -0.08, 0.21], // id 0: "i"
  [0.34, -0.11, 0.19, 0.07], // id 1: "like"
  [0.55, 0.22, -0.03, 0.41], // id 2: "apple"
  [-0.09, 0.31, 0.14, -0.17], // id 3: "fruit"
];

function lookup(tokenId: number): number[] {
  return E[tokenId];
}

console.log('=== Embedding Lookup ===\\n');
console.log('Vocab: [' + vocab.map((w, i) => i + '="' + w + '"').join(', ') + ']');
console.log('Embedding dim: ' + embedDim + '\\n');

for (const [id, word] of vocab.entries()) {
  const vec = lookup(id);
  console.log('ID ' + id + ' ("' + word + '") → [' + vec.map((v) => v.toFixed(2)).join(', ') + ']');
}

console.log('\\n--- Sentence "i like apple" as vectors ---');
const sentence = [0, 1, 2];
for (const id of sentence) {
  const vec = lookup(id);
  console.log('  ' + vocab[id] + ' → [' + vec.map((v) => v.toFixed(2)).join(', ') + ']');
}
`,
    },
  },

  'part-06/weight-matrix': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `// Char-level bigram: W[current][next] = logit for next char
const chars = ['.', 'a', 'b', 'c'];
const stoi: Record<string, number> = { '.': 0, a: 1, b: 2, c: 3 };
const itos: Record<number, string> = { 0: '.', 1: 'a', 2: 'b', 3: 'c' };
const V = chars.length;

// Small weight matrix (rows = current char, cols = next char logits)
const W: number[][] = [
  [0.1, 0.8, 0.3, 0.2], // after "."
  [0.2, 0.1, 0.6, 0.4], // after "a"
  [0.3, 0.5, 0.1, 0.7], // after "b"
  [0.4, 0.2, 0.3, 0.1], // after "c"
];

function softmax(logits: number[]): number[] {
  const max = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

function forward(currentId: number): { logits: number[]; probs: number[] } {
  const logits = W[currentId].slice();
  const probs = softmax(logits);
  return { logits, probs };
}

console.log('=== Weight Matrix → Logits → Probs ===\\n');
console.log('Vocab: ' + chars.join(' ') + '\\n');

for (const ch of ['.', 'a', 'b']) {
  const id = stoi[ch];
  const { logits, probs } = forward(id);
  console.log('Current char "' + ch + '" (id=' + id + '):');
  console.log('  logits: [' + logits.map((l) => l.toFixed(2)).join(', ') + ']');
  console.log('  probs:  [' + probs.map((p) => p.toFixed(3)).join(', ') + ']');
  const best = probs.indexOf(Math.max(...probs));
  console.log('  argmax next: "' + itos[best] + '"\\n');
}
`,
    },
  },

  'part-06/loss': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `// Cross-entropy loss: -log(P(correct token))
function softmax(logits: number[]): number[] {
  const max = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

function crossEntropy(logits: number[], targetId: number): number {
  const probs = softmax(logits);
  return -Math.log(probs[targetId] + 1e-9);
}

const vocab = ['.', 'a', 'b', 'c'];

console.log('=== Cross-Entropy Loss ===\\n');
console.log('Loss = -log(P(correct next token))\\n');

const examples: [number[], number, string][] = [
  [[2.0, 0.5, 0.1, 0.3], 0, 'good prediction (target prob high)'],
  [[0.1, 0.2, 0.3, 2.5], 3, 'good prediction'],
  [[0.0, 0.0, 0.0, 0.0], 1, 'uniform (uncertain)'],
  [[2.0, 0.1, 0.1, 0.1], 2, 'bad prediction (target prob low)'],
];

for (const [logits, target, label] of examples) {
  const probs = softmax(logits);
  const loss = crossEntropy(logits, target);
  console.log(label + ':');
  console.log('  logits:  [' + logits.join(', ') + ']');
  console.log('  target:  "' + vocab[target] + '" (id=' + target + ')');
  console.log('  P(target): ' + probs[target].toFixed(4));
  console.log('  loss:      ' + loss.toFixed(4) + '\\n');
}

console.log('Lower loss = model more confident on correct token.');
`,
    },
  },

  'part-06/train': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `// Tiny char bigram neural LM — train from scratch
const words = ['ab', 'abc', 'cab'];
const chars = Array.from(new Set(words.join(''))).sort();
const vocab = ['.'].concat(chars);
const stoi: Record<string, number> = {};
const itos: Record<number, string> = {};
vocab.forEach((c, i) => { stoi[c] = i; itos[i] = c; });
const V = vocab.length;

type Pair = [number, number];
const pairs: Pair[] = [];
for (const w of words) {
  const chs = ['.'].concat(w.split('')).concat(['.']);
  for (let i = 0; i < chs.length - 1; i++) pairs.push([stoi[chs[i]], stoi[chs[i + 1]]]);
}

function randMatrix(rows: number, cols: number): number[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (Math.random() * 2 - 1) * 0.1)
  );
}

function softmax(logits: number[]): number[] {
  const max = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

const W = randMatrix(V, V);
const epochs = 50;
const lr = 5;

console.log('=== Training Loop (50 epochs) ===\\n');
console.log('Vocab: ' + vocab.join(' '));
console.log('Pairs: ' + pairs.length + '\\n');

for (let epoch = 0; epoch < epochs; epoch++) {
  let totalLoss = 0;
  const dW = Array.from({ length: V }, () => new Array(V).fill(0));

  for (const [xi, yi] of pairs) {
    const logits = W[xi];
    const probs = softmax(logits);
    totalLoss += -Math.log(probs[yi] + 1e-9);
    for (let j = 0; j < V; j++) dW[xi][j] += probs[j] - (j === yi ? 1 : 0);
  }

  const n = pairs.length;
  for (let i = 0; i < V; i++) {
    for (let j = 0; j < V; j++) W[i][j] -= (lr * dW[i][j]) / n;
  }

  if (epoch % 10 === 0 || epoch === epochs - 1) {
    console.log('Epoch ' + epoch + ': avg loss = ' + (totalLoss / n).toFixed(4));
  }
}
`,
    },
  },

  'part-06/generate': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `// Train tiny model, then sample next chars autoregressively
const words = ['ab', 'abc', 'cab', 'ab'];
const chars = Array.from(new Set(words.join(''))).sort();
const vocab = ['.'].concat(chars);
const stoi: Record<string, number> = {};
const itos: Record<number, string> = {};
vocab.forEach((c, i) => { stoi[c] = i; itos[i] = c; });
const V = vocab.length;

type Pair = [number, number];
const pairs: Pair[] = [];
for (const w of words) {
  const chs = ['.'].concat(w.split('')).concat(['.']);
  for (let i = 0; i < chs.length - 1; i++) pairs.push([stoi[chs[i]], stoi[chs[i + 1]]]);
}

function randMatrix(rows: number, cols: number): number[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (Math.random() * 2 - 1) * 0.1)
  );
}

function softmax(logits: number[]): number[] {
  const max = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

const W = randMatrix(V, V);
const lr = 5;

for (let epoch = 0; epoch < 80; epoch++) {
  const dW = Array.from({ length: V }, () => new Array(V).fill(0));
  for (const [xi, yi] of pairs) {
    const probs = softmax(W[xi]);
    for (let j = 0; j < V; j++) dW[xi][j] += probs[j] - (j === yi ? 1 : 0);
  }
  const n = pairs.length;
  for (let i = 0; i < V; i++) {
    for (let j = 0; j < V; j++) W[i][j] -= (lr * dW[i][j]) / n;
  }
}

function sample(probs: number[]): number {
  const r = Math.random();
  let cum = 0;
  for (let i = 0; i < probs.length; i++) {
    cum += probs[i];
    if (r < cum) return i;
  }
  return probs.length - 1;
}

function generate(maxLen = 8): string {
  let idx = stoi['.'];
  let out = '';
  for (let i = 0; i < maxLen; i++) {
    idx = sample(softmax(W[idx]));
    if (itos[idx] === '.') break;
    out += itos[idx];
  }
  return out;
}

console.log('=== Generate from Trained Weights ===\\n');
console.log('Training data: ' + words.join(', '));
console.log('Vocab: ' + vocab.join(' ') + '\\n');
console.log('Sampled strings (each run differs):');
for (let i = 0; i < 5; i++) console.log('  ' + generate());
`,
    },
  },

  'part-07/qkv': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `// Q, K, V = embedding × projection matrix
const words = ['i', 'like', 'apple'];
const dModel = 4;

const X: number[][] = [
  [1, 0, 0, 0], // "i"
  [0, 1, 0, 0], // "like"
  [0, 0, 1, 0], // "apple"
];

const Wq: number[][] = [
  [0.5, 0.1, 0.0, 0.2],
  [0.0, 0.4, 0.3, 0.1],
  [0.2, 0.0, 0.5, 0.0],
  [0.1, 0.2, 0.1, 0.4],
];
const Wk: number[][] = [
  [0.3, 0.0, 0.2, 0.1],
  [0.1, 0.5, 0.0, 0.2],
  [0.0, 0.2, 0.4, 0.1],
  [0.2, 0.1, 0.0, 0.5],
];
const Wv: number[][] = [
  [0.4, 0.2, 0.0, 0.0],
  [0.0, 0.3, 0.2, 0.1],
  [0.1, 0.0, 0.4, 0.2],
  [0.0, 0.1, 0.1, 0.3],
];

function matVec(M: number[][], x: number[]): number[] {
  return M.map((row) => row.reduce((s, v, j) => s + v * x[j], 0));
}

function matMul(A: number[][], B: number[][]): number[][] {
  const rows = A.length, cols = B[0].length, inner = B.length;
  const out = Array.from({ length: rows }, () => new Array(cols).fill(0));
  for (let i = 0; i < rows; i++) {
    for (let k = 0; k < inner; k++) {
      for (let j = 0; j < cols; j++) out[i][j] += A[i][k] * B[k][j];
    }
  }
  return out;
}

function transpose(M: number[][]): number[][] {
  return M[0].map((_, j) => M.map((row) => row[j]));
}

const WqT = transpose(Wq);
const WkT = transpose(Wk);
const WvT = transpose(Wv);

const Q = matMul(X, WqT);
const K = matMul(X, WkT);
const V = matMul(X, WvT);

function fmt(v: number[]): string {
  return '[' + v.map((x) => x.toFixed(2)).join(', ') + ']';
}

console.log('=== Query, Key, Value ===\\n');
console.log('Sentence: "' + words.join(' ') + '"');
console.log('d_model = ' + dModel + '\\n');

for (let i = 0; i < words.length; i++) {
  console.log('Token "' + words[i] + '":');
  console.log('  x  = ' + fmt(X[i]));
  console.log('  Q  = x·Wq = ' + fmt(Q[i]));
  console.log('  K  = x·Wk = ' + fmt(K[i]));
  console.log('  V  = x·Wv = ' + fmt(V[i]));
  console.log('');
}
`,
    },
  },

  'part-07/scaled-dot-product': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `// Attention(Q,K,V) = softmax(QK^T / sqrt(d_k)) · V
const dK = 3;

const Q: number[][] = [
  [1.0, 0.0, 0.5],
  [0.2, 0.8, 0.1],
];
const K: number[][] = [
  [1.0, 0.0, 0.5],
  [0.2, 0.8, 0.1],
  [0.5, 0.5, 0.0],
];
const V: number[][] = [
  [1.0, 0.0],
  [0.0, 1.0],
  [0.5, 0.5],
];

function dot(a: number[], b: number[]): number {
  return a.reduce((s, v, i) => s + v * b[i], 0);
}

function softmax(row: number[]): number[] {
  const max = Math.max(...row);
  const exps = row.map((x) => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

function matVec(M: number[][], x: number[]): number[] {
  return M.map((row) => dot(row, x));
}

const scale = Math.sqrt(dK);
console.log('=== Scaled Dot-Product Attention ===\\n');
console.log('d_k = ' + dK + ', scale = sqrt(d_k) = ' + scale.toFixed(3) + '\\n');

for (let i = 0; i < Q.length; i++) {
  const rawScores = K.map((k) => dot(Q[i], k));
  const scaledScores = rawScores.map((s) => s / scale);
  const weights = softmax(scaledScores);
  const out = matVec(V, weights);

  console.log('Query row ' + i + ':');
  console.log('  Q·K^T (raw):     [' + rawScores.map((s) => s.toFixed(2)).join(', ') + ']');
  console.log('  scaled /√d_k:    [' + scaledScores.map((s) => s.toFixed(2)).join(', ') + ']');
  console.log('  softmax weights: [' + weights.map((w) => w.toFixed(3)).join(', ') + ']');
  console.log('  output = Σ w·V:  [' + out.map((v) => v.toFixed(3)).join(', ') + ']\\n');
}
`,
    },
  },

  'part-07/self-attention': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `// Self-attention on 3-word sentence
const words = ['i', 'like', 'apple'];
const d = 4;

const X: number[][] = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
];

// Shared projection (simplified — same W for Q,K,V demo)
const W: number[][] = [
  [0.5, 0.1, 0.0, 0.2],
  [0.0, 0.5, 0.2, 0.0],
  [0.2, 0.0, 0.5, 0.1],
  [0.1, 0.2, 0.1, 0.4],
];

function matMul(A: number[][], B: number[][]): number[][] {
  const rows = A.length, cols = B[0].length, inner = B.length;
  const out = Array.from({ length: rows }, () => new Array(cols).fill(0));
  for (let i = 0; i < rows; i++) {
    for (let k = 0; k < inner; k++) {
      for (let j = 0; j < cols; j++) out[i][j] += A[i][k] * B[k][j];
    }
  }
  return out;
}

function transpose(M: number[][]): number[][] {
  return M[0].map((_, j) => M.map((row) => row[j]));
}

function softmaxRows(M: number[][]): number[][] {
  return M.map((row) => {
    const max = Math.max(...row);
    const exps = row.map((x) => Math.exp(x - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map((e) => e / sum);
  });
}

const WT = transpose(W);
const Q = matMul(X, WT);
const K = matMul(X, WT);
const V = matMul(X, WT);

const scores = matMul(Q, transpose(K));
const scale = Math.sqrt(d);
for (let i = 0; i < scores.length; i++) {
  for (let j = 0; j < scores[i].length; j++) scores[i][j] /= scale;
}
const attn = softmaxRows(scores);
const out = matMul(attn, V);

console.log('=== Self-Attention (3 words) ===\\n');
console.log('Sentence: "' + words.join(' ') + '"\\n');

console.log('Attention weights (rows attend to cols):');
console.log('       ' + words.map((w) => w.padStart(6)).join(''));
for (let i = 0; i < words.length; i++) {
  const row = attn[i].map((w) => w.toFixed(3).padStart(6)).join('');
  console.log(words[i].padEnd(6) + row);
}

console.log('\\nOutput vectors (context-aware):');
for (let i = 0; i < words.length; i++) {
  console.log('  "' + words[i] + '" → [' + out[i].map((v) => v.toFixed(2)).join(', ') + ']');
}
`,
    },
  },

  'part-07/multi-head': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `// 2-head attention (simplified, d_model=4, head_dim=2)
const words = ['i', 'eat', 'apple'];
const numHeads = 2;
const headDim = 2;

const X: number[][] = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
];

// Each head has its own Q/K/V slice (first 2 dims = head 0, last 2 = head 1)
function sliceHead(M: number[][], h: number): number[][] {
  const start = h * headDim;
  return M.map((row) => row.slice(start, start + headDim));
}

function dot(a: number[], b: number[]): number {
  return a.reduce((s, v, i) => s + v * b[i], 0);
}

function softmax(row: number[]): number[] {
  const max = Math.max(...row);
  const exps = row.map((x) => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

function attentionHead(Q: number[][], K: number[][], V: number[][]): number[][] {
  const scale = Math.sqrt(headDim);
  const out: number[][] = [];
  for (let i = 0; i < Q.length; i++) {
    const scores = K.map((k) => dot(Q[i], k) / scale);
    const w = softmax(scores);
    const vec = new Array(headDim).fill(0);
    for (let j = 0; j < V.length; j++) {
      for (let d = 0; d < headDim; d++) vec[d] += w[j] * V[j][d];
    }
    out.push(vec);
  }
  return out;
}

console.log('=== Multi-Head Attention (2 heads) ===\\n');
console.log('Sentence: "' + words.join(' ') + '"\\n');

const headOutputs: number[][][] = [];
for (let h = 0; h < numHeads; h++) {
  const Q = sliceHead(X, h);
  const K = sliceHead(X, h);
  const V = sliceHead(X, h);
  const out = attentionHead(Q, K, V);
  headOutputs.push(out);

  console.log('Head ' + h + ' attention weights:');
  for (let i = 0; i < words.length; i++) {
    const scores = K.map((k) => dot(Q[i], k) / Math.sqrt(headDim));
    const w = softmax(scores);
    console.log('  "' + words[i] + '" → [' + w.map((x) => x.toFixed(3)).join(', ') + ']');
  }
  console.log('');
}

// Concatenate heads
const concat = X.map((_, i) => headOutputs[0][i].concat(headOutputs[1][i]));
console.log('Concatenated output (head0 || head1):');
for (let i = 0; i < words.length; i++) {
  console.log('  "' + words[i] + '" → [' + concat[i].map((v) => v.toFixed(2)).join(', ') + ']');
}
`,
    },
  },

  'part-08/positional': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `// Sinusoidal positional encoding: PE(pos, 2i)=sin, PE(pos, 2i+1)=cos
const maxLen = 4;
const dModel = 8;

function positionalEncoding(pos: number, dim: number): number[] {
  const pe = new Array(dim).fill(0);
  for (let i = 0; i < dim; i += 2) {
    const angle = pos / Math.pow(10000, i / dim);
    pe[i] = Math.sin(angle);
    if (i + 1 < dim) pe[i + 1] = Math.cos(angle);
  }
  return pe;
}

function add(a: number[], b: number[]): number[] {
  return a.map((v, i) => v + b[i]);
}

const tokenEmbed: number[][] = [
  [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
  [0.2, 0.1, 0.4, 0.3, 0.6, 0.5, 0.8, 0.7],
  [0.3, 0.4, 0.1, 0.2, 0.7, 0.8, 0.5, 0.6],
  [0.4, 0.3, 0.2, 0.1, 0.8, 0.7, 0.6, 0.5],
];
const words = ['i', 'like', 'apple', 'fruit'];

console.log('=== Positional Encoding (sin/cos) ===\\n');
console.log('max_len=' + maxLen + ', d_model=' + dModel + '\\n');

for (let pos = 0; pos < maxLen; pos++) {
  const pe = positionalEncoding(pos, dModel);
  const combined = add(tokenEmbed[pos], pe);
  console.log('pos ' + pos + ' ("' + words[pos] + '"):');
  console.log('  token:    [' + tokenEmbed[pos].map((v) => v.toFixed(2)).join(', ') + ']');
  console.log('  + PE:     [' + pe.map((v) => v.toFixed(3)).join(', ') + ']');
  console.log('  = input:  [' + combined.map((v) => v.toFixed(3)).join(', ') + ']\\n');
}
`,
    },
  },

  'part-08/layer-norm': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `// LayerNorm: (x - mean) / sqrt(var + eps) * gamma + beta
const eps = 1e-5;
const gamma = [1.0, 1.0, 1.0, 1.0];
const beta = [0.0, 0.0, 0.0, 0.0];

function layerNorm(x: number[], g: number[], b: number[]): number[] {
  const mean = x.reduce((a, v) => a + v, 0) / x.length;
  const variance = x.reduce((a, v) => a + (v - mean) ** 2, 0) / x.length;
  const std = Math.sqrt(variance + eps);
  return x.map((v, i) => ((v - mean) / std) * g[i] + b[i]);
}

const vectors: [string, number[]][] = [
  ['small spread', [1.0, 1.1, 0.9, 1.05]],
  ['large spread', [10.0, 2.0, -5.0, 8.0]],
  ['already centered', [-1.0, 0.0, 1.0, 0.0]],
];

console.log('=== Layer Normalization ===\\n');
console.log('Formula: (x - μ) / σ · γ + β\\n');

for (const [label, x] of vectors) {
  const mean = x.reduce((a, v) => a + v, 0) / x.length;
  const variance = x.reduce((a, v) => a + (v - mean) ** 2, 0) / x.length;
  const y = layerNorm(x, gamma, beta);
  const outMean = y.reduce((a, v) => a + v, 0) / y.length;
  const outVar = y.reduce((a, v) => a + (v - outMean) ** 2, 0) / y.length;

  console.log(label + ':');
  console.log('  input:  [' + x.map((v) => v.toFixed(2)).join(', ') + ']');
  console.log('  μ=' + mean.toFixed(3) + ', σ²=' + variance.toFixed(3));
  console.log('  output: [' + y.map((v) => v.toFixed(3)).join(', ') + ']');
  console.log('  out μ≈' + outMean.toFixed(3) + ', out σ²≈' + outVar.toFixed(3) + '\\n');
}
`,
    },
  },

  'part-08/ffn': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `// Position-wise FFN: Linear → ReLU → Linear
function relu(x: number): number {
  return x > 0 ? x : 0;
}

function matVec(M: number[][], x: number[]): number[] {
  return M.map((row) => row.reduce((s, v, j) => s + v * x[j], 0));
}

const dModel = 4;
const dFF = 8;

const W1: number[][] = [
  [0.2, -0.1, 0.3, 0.0],
  [0.1, 0.4, -0.2, 0.1],
  [0.0, 0.2, 0.5, -0.1],
  [0.3, 0.0, 0.1, 0.2],
  [-0.1, 0.3, 0.0, 0.4],
  [0.2, 0.1, -0.1, 0.3],
  [0.1, -0.2, 0.2, 0.0],
  [0.0, 0.3, 0.1, -0.2],
];
const b1 = new Array(dFF).fill(0.1);
const W2: number[][] = Array.from({ length: dModel }, (_, i) =>
  Array.from({ length: dFF }, (_, j) => ((i + j) % 5) * 0.05 - 0.1)
);
const b2 = new Array(dModel).fill(0.0);

function ffn(x: number[]): number[] {
  const h = matVec(W1, x).map((v, i) => relu(v + b1[i]));
  return matVec(W2, h).map((v, i) => v + b2[i]);
}

const tokens = [
  { word: 'i', x: [1, 0, 0, 0] },
  { word: 'like', x: [0, 1, 0, 0] },
  { word: 'apple', x: [0, 0, 1, 0] },
];

console.log('=== Feed-Forward Network ===\\n');
console.log('d_model=' + dModel + ' → d_ff=' + dFF + ' → d_model=' + dModel + '\\n');

for (const { word, x } of tokens) {
  const hidden = matVec(W1, x).map((v, i) => relu(v + b1[i]));
  const out = ffn(x);
  console.log('Token "' + word + '":');
  console.log('  input:   [' + x.join(', ') + ']');
  console.log('  hidden:  [' + hidden.map((v) => v.toFixed(2)).join(', ') + ']  (after ReLU)');
  console.log('  output:  [' + out.map((v) => v.toFixed(3)).join(', ') + ']\\n');
}
`,
    },
  },

  'part-08/residual': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `// Residual connection: output = x + sublayer(x)
function add(a: number[], b: number[]): number[] {
  return a.map((v, i) => v + b[i]);
}

function fakeAttention(x: number[]): number[] {
  // Simplified sublayer — mixes dimensions slightly
  return [0.1 * x[0] + 0.2 * x[1], 0.1 * x[1] + 0.2 * x[2], 0.1 * x[2] + 0.2 * x[3], 0.1 * x[3]];
}

function fakeFFN(x: number[]): number[] {
  return x.map((v) => Math.max(0, v * 0.5 + 0.1));
}

const x = [0.5, -0.3, 0.8, 0.1];
const words = ['like'];

console.log('=== Residual Connections ===\\n');
console.log('Skip connection: y = x + F(x)\\n');

console.log('Input x: [' + x.map((v) => v.toFixed(2)).join(', ') + ']\\n');

const attnOut = fakeAttention(x);
const afterAttn = add(x, attnOut);
console.log('After attention sublayer:');
console.log('  F_attn(x) = [' + attnOut.map((v) => v.toFixed(3)).join(', ') + ']');
console.log('  x + F_attn(x) = [' + afterAttn.map((v) => v.toFixed(3)).join(', ') + ']\\n');

const ffnOut = fakeFFN(afterAttn);
const afterFFN = add(afterAttn, ffnOut);
console.log('After FFN sublayer:');
console.log('  F_ffn(h) = [' + ffnOut.map((v) => v.toFixed(3)).join(', ') + ']');
console.log('  h + F_ffn(h) = [' + afterFFN.map((v) => v.toFixed(3)).join(', ') + ']\\n');

console.log('Gradients flow through the + path directly — easier to train deep nets.');
`,
    },
  },

  'part-08/block': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `// Mini transformer block: Norm→Attn→Res→Norm→FFN→Res
function add(a: number[], b: number[]): number[] {
  return a.map((v, i) => v + b[i]);
}

function layerNorm(x: number[]): number[] {
  const mean = x.reduce((s, v) => s + v, 0) / x.length;
  const var_ = x.reduce((s, v) => s + (v - mean) ** 2, 0) / x.length;
  const std = Math.sqrt(var_ + 1e-5);
  return x.map((v) => (v - mean) / std);
}

function selfAttention(X: number[][]): number[][] {
  const d = X[0].length;
  const scale = Math.sqrt(d);
  const out: number[][] = [];
  for (let i = 0; i < X.length; i++) {
    const scores = X.map((k) => {
      const dot = X[i].reduce((s, v, j) => s + v * k[j], 0);
      return dot / scale;
    });
    const max = Math.max(...scores);
    const exps = scores.map((s) => Math.exp(s - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    const w = exps.map((e) => e / sum);
    const vec = new Array(d).fill(0);
    for (let j = 0; j < X.length; j++) {
      for (let k = 0; k < d; k++) vec[k] += w[j] * X[j][k];
    }
    out.push(vec);
  }
  return out;
}

function relu(x: number): number { return x > 0 ? x : 0; }

function ffn(x: number[]): number[] {
  const h = x.map((v) => relu(v * 1.5 + 0.1));
  return h.map((v) => v * 0.8 + 0.05);
}

function transformerBlock(X: number[][]): number[][] {
  console.log('Step 1: LayerNorm before attention');
  const norm1 = X.map(layerNorm);
  console.log('  norm1[0] = [' + norm1[0].map((v) => v.toFixed(3)).join(', ') + ']');

  console.log('Step 2: Self-attention');
  const attn = selfAttention(norm1);
  console.log('  attn[0]  = [' + attn[0].map((v) => v.toFixed(3)).join(', ') + ']');

  console.log('Step 3: Residual add (x + attn)');
  const res1 = X.map((row, i) => add(row, attn[i]));
  console.log('  res1[0]  = [' + res1[0].map((v) => v.toFixed(3)).join(', ') + ']');

  console.log('Step 4: LayerNorm before FFN');
  const norm2 = res1.map(layerNorm);
  console.log('  norm2[0] = [' + norm2[0].map((v) => v.toFixed(3)).join(', ') + ']');

  console.log('Step 5: Feed-forward');
  const ff = norm2.map(ffn);
  console.log('  ff[0]    = [' + ff[0].map((v) => v.toFixed(3)).join(', ') + ']');

  console.log('Step 6: Residual add (h + ff)');
  const out = res1.map((row, i) => add(row, ff[i]));
  console.log('  out[0]   = [' + out[0].map((v) => v.toFixed(3)).join(', ') + ']');

  return out;
}

const words = ['i', 'like', 'apple'];
const X: number[][] = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
];

console.log('=== Transformer Block ===\\n');
console.log('Input: "' + words.join(' ') + '"\\n');

const out = transformerBlock(X);

console.log('\\nFinal block output:');
for (let i = 0; i < words.length; i++) {
  console.log('  "' + words[i] + '" → [' + out[i].map((v) => v.toFixed(3)).join(', ') + ']');
}
`,
    },
  },

  'part-09/train': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `// Simplified word-level GPT-style training on fruit sentences
const dataset = [
  'i like apple', 'i like banana', 'i like mango',
  'you like apple', 'you eat mango', 'he eats banana',
  'apple is fruit', 'banana is fruit', 'mango is fruit', 'fruit is healthy',
];

function tokenize(s: string): string[] {
  return s.toLowerCase().trim().split(/\\s+/);
}

const words = new Set<string>();
for (const s of dataset) for (const w of tokenize(s)) words.add(w);
const sorted = Array.from(words).sort();
const stoi: Record<string, number> = {};
const itos: Record<number, string> = {};
sorted.forEach((w, i) => { stoi[w] = i; itos[i] = w; });
const V = sorted.length;

type Pair = [number, number];
const pairs: Pair[] = [];
for (const s of dataset) {
  const toks = tokenize(s);
  for (let i = 0; i < toks.length - 1; i++) pairs.push([stoi[toks[i]], stoi[toks[i + 1]]]);
}

function randMatrix(rows: number, cols: number): number[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (Math.random() * 2 - 1) * 0.08)
  );
}

function softmax(logits: number[]): number[] {
  const max = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

const W = randMatrix(V, V);
const epochs = 30;
const lr = 3;

console.log('=== Mini GPT Training (30 epochs) ===\\n');
console.log('Vocab size: ' + V);
console.log('Training pairs: ' + pairs.length + '\\n');

for (let epoch = 0; epoch < epochs; epoch++) {
  let totalLoss = 0;
  const dW = Array.from({ length: V }, () => new Array(V).fill(0));

  for (const [xi, yi] of pairs) {
    const probs = softmax(W[xi]);
    totalLoss += -Math.log(probs[yi] + 1e-9);
    for (let j = 0; j < V; j++) dW[xi][j] += probs[j] - (j === yi ? 1 : 0);
  }

  const n = pairs.length;
  for (let i = 0; i < V; i++) {
    for (let j = 0; j < V; j++) W[i][j] -= (lr * dW[i][j]) / n;
  }

  if (epoch % 5 === 0 || epoch === epochs - 1) {
    console.log('Epoch ' + epoch + ': avg loss = ' + (totalLoss / n).toFixed(4));
  }
}
`,
    },
  },

  'part-09/generate': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `// Train word bigram model, then autoregressively generate
const dataset = [
  'i like apple', 'i like banana', 'i like mango',
  'you like apple', 'you eat mango', 'he eats banana',
  'apple is fruit', 'banana is fruit', 'mango is fruit', 'fruit is healthy',
];

function tokenize(s: string): string[] {
  return s.toLowerCase().trim().split(/\\s+/);
}

const words = new Set<string>();
for (const s of dataset) for (const w of tokenize(s)) words.add(w);
const sorted = Array.from(words).sort();
const stoi: Record<string, number> = {};
const itos: Record<number, string> = {};
sorted.forEach((w, i) => { stoi[w] = i; itos[i] = w; });
const V = sorted.length;

type Pair = [number, number];
const pairs: Pair[] = [];
for (const s of dataset) {
  const toks = tokenize(s);
  for (let i = 0; i < toks.length - 1; i++) pairs.push([stoi[toks[i]], stoi[toks[i + 1]]]);
}

function randMatrix(rows: number, cols: number): number[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (Math.random() * 2 - 1) * 0.08)
  );
}

function softmax(logits: number[]): number[] {
  const max = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

const W = randMatrix(V, V);
const lr = 3;

for (let epoch = 0; epoch < 50; epoch++) {
  const dW = Array.from({ length: V }, () => new Array(V).fill(0));
  for (const [xi, yi] of pairs) {
    const probs = softmax(W[xi]);
    for (let j = 0; j < V; j++) dW[xi][j] += probs[j] - (j === yi ? 1 : 0);
  }
  const n = pairs.length;
  for (let i = 0; i < V; i++) {
    for (let j = 0; j < V; j++) W[i][j] -= (lr * dW[i][j]) / n;
  }
}

function sample(probs: number[]): number {
  const r = Math.random();
  let cum = 0;
  for (let i = 0; i < probs.length; i++) {
    cum += probs[i];
    if (r < cum) return i;
  }
  return probs.length - 1;
}

function generate(startWord: string, maxLen = 8): string {
  const out = [startWord];
  let idx = stoi[startWord];
  for (let i = 0; i < maxLen; i++) {
    idx = sample(softmax(W[idx]));
    out.push(itos[idx]);
  }
  return out.join(' ');
}

console.log('=== Autoregressive Generation ===\\n');
console.log('Start word → predict next → repeat\\n');

for (const start of ['i', 'you', 'fruit']) {
  console.log('From "' + start + '":');
  for (let n = 0; n < 3; n++) console.log('  ' + generate(start));
  console.log('');
}
`,
    },
  },

  'part-09/temperature': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `// Temperature scales logits before softmax: logits / T
function softmax(logits: number[]): number[] {
  const max = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

function softmaxWithTemp(logits: number[], temp: number): number[] {
  return softmax(logits.map((l) => l / temp));
}

function sample(probs: number[]): number {
  const r = Math.random();
  let cum = 0;
  for (let i = 0; i < probs.length; i++) {
    cum += probs[i];
    if (r < cum) return i;
  }
  return probs.length - 1;
}

const vocab = ['like', 'eat', 'eats', 'is'];
const logits = [2.0, 0.5, 0.3, 0.1]; // "like" is strongest after "i"

console.log('=== Temperature Sampling ===\\n');
console.log('Context: "i" → next word logits:');
for (let i = 0; i < vocab.length; i++) {
  console.log('  ' + vocab[i] + ': ' + logits[i]);
}

console.log('\\nBase probs (T=1.0): [' + softmax(logits).map((p) => p.toFixed(3)).join(', ') + ']');

for (const temp of [0.5, 1.0, 2.0]) {
  const probs = softmaxWithTemp(logits, temp);
  console.log('\\nT=' + temp + ' → probs: [' + probs.map((p) => p.toFixed(3)).join(', ') + ']');
  console.log('  5 samples from "i":');
  const counts: Record<string, number> = {};
  for (let i = 0; i < 5; i++) {
    const idx = sample(probs);
    const word = vocab[idx];
    counts[word] = (counts[word] ?? 0) + 1;
  }
  for (const [word, count] of Object.entries(counts)) {
    console.log('    ' + word + ' ×' + count);
  }
}

console.log('\\nT<1 = sharper (more deterministic), T>1 = flatter (more random)');
`,
    },
  },

  'part-09/top-k': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `// Top-k sampling: zero out all but k highest logits, then sample
function softmax(logits: number[]): number[] {
  const max = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

function topKFilter(logits: number[], k: number): number[] {
  const indexed = logits.map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v);
  const keep = new Set(indexed.slice(0, k).map((x) => x.i));
  return logits.map((v, i) => (keep.has(i) ? v : -Infinity));
}

function sample(probs: number[]): number {
  const r = Math.random();
  let cum = 0;
  for (let i = 0; i < probs.length; i++) {
    cum += probs[i];
    if (r < cum) return i;
  }
  return probs.length - 1;
}

const vocab = ['like', 'eat', 'eats', 'is', 'apple', 'banana'];
const logits = [2.5, 1.8, 0.4, 0.3, 0.2, 0.1];

console.log('=== Top-k Sampling ===\\n');
console.log('Context: "i" → logits:');
for (let i = 0; i < vocab.length; i++) {
  console.log('  ' + vocab[i].padEnd(8) + logits[i]);
}

console.log('\\nFull softmax: [' + softmax(logits).map((p) => p.toFixed(3)).join(', ') + ']');

for (const k of [1, 2, 3]) {
  const filtered = topKFilter(logits, k);
  const probs = softmax(filtered);
  const allowed = vocab.filter((_, i) => filtered[i] !== -Infinity);
  console.log('\\nTop-k=' + k + ' (only ' + allowed.join(', ') + '):');
  console.log('  probs: [' + probs.map((p) => (p > 0 ? p.toFixed(3) : '0.000')).join(', ') + ']');
  console.log('  5 samples:');
  const counts: Record<string, number> = {};
  for (let i = 0; i < 5; i++) {
    const idx = sample(probs);
    const word = vocab[idx];
    counts[word] = (counts[word] ?? 0) + 1;
  }
  for (const [word, count] of Object.entries(counts)) {
    console.log('    ' + word + ' ×' + count);
  }
}

console.log('\\nTop-k removes unlikely tokens — less nonsense, still some variety.');
`,
    },
  },
};
