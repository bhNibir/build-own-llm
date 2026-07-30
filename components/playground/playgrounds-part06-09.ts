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

log.step('Embedding Lookup');
log.data('Vocab', vocab.map((w, i) => i + '="' + w + '"'));
log.data('Embedding dim', embedDim);

log.step('ID → vector');
for (const [id, word] of vocab.entries()) {
  const vec = lookup(id);
  log.data('ID ' + id + ' ("' + word + '")', vec.map((v) => v.toFixed(2)));
}

log.step('Sentence "i like apple" as vectors');
const sentence = [0, 1, 2];
for (const id of sentence) {
  const vec = lookup(id);
  log.data(vocab[id], vec.map((v) => v.toFixed(2)));
}
log.ok('embedding lookup done');
`,
    },
  },

  'part-06/weight-matrix': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `// Word-level neural bigram: embed(word) → logits via W
const vocab = ['apple', 'banana', 'like', 'mango'];
const stoi: Record<string, number> = { apple: 0, banana: 1, like: 2, mango: 3 };
const D = 2;

// Embedding matrix E: each row = one word's vector
const E: number[][] = [
  [0.55, 0.22],  // apple
  [0.41, 0.18],  // banana
  [0.40, -0.10], // like (lesson example)
  [0.33, 0.25],  // mango
];

// Output weight W: V x D — logits[k] = dot(E[xi], W[k])
const W: number[][] = [
  [0.50, 0.20],
  [0.10, 0.80],
  [-0.30, 0.40],
  [0.25, -0.15],
];

function softmax(logits: number[]): number[] {
  const max = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

function forward(word: string): { embed: number[]; logits: number[]; probs: number[] } {
  const id = stoi[word];
  const embed = E[id];
  const logits = W.map((row) => row.reduce((s, w, d) => s + w * embed[d], 0));
  const probs = softmax(logits);
  return { embed, logits, probs };
}

log.step('Weight Matrix Forward Pass (word-level)');
log.data('Vocab', vocab.join(', '));
log.data('Embedding dim D', D);

for (const word of ['like', 'apple', 'mango']) {
  const { embed, logits, probs } = forward(word);
  log.step('Input "' + word + '"');
  log.data('embed', embed.map((v) => v.toFixed(2)));
  log.data('logits', logits.map((l) => l.toFixed(2)));
  log.data('probs', probs.map((p) => p.toFixed(3)));
  const best = probs.indexOf(Math.max(...probs));
  log.data('argmax next', vocab[best]);
}
log.ok('logits → probs via softmax');
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

log.step('Cross-Entropy Loss');
log.data('Formula', 'Loss = -log(P(correct next token))');

const examples: [number[], number, string][] = [
  [[2.0, 0.5, 0.1, 0.3], 0, 'good prediction (target prob high)'],
  [[0.1, 0.2, 0.3, 2.5], 3, 'good prediction'],
  [[0.0, 0.0, 0.0, 0.0], 1, 'uniform (uncertain)'],
  [[2.0, 0.1, 0.1, 0.1], 2, 'bad prediction (target prob low)'],
];

for (const [logits, target, label] of examples) {
  const probs = softmax(logits);
  const loss = crossEntropy(logits, target);
  log.step(label);
  log.data('logits', logits);
  log.data('target', '"' + vocab[target] + '" (id=' + target + ')');
  log.data('P(target)', probs[target].toFixed(4));
  log.data('loss', loss.toFixed(4));
}

log.ok('lower loss = more confident on correct token');
`,
    },
  },

  'part-06/train': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `// Word-level neural LM on fruit dataset — E (embed) + W (output)
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
const D = 8;

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

function forward(xi: number, E: number[][], W: number[][]): number[] {
  const embed = E[xi];
  return W.map((row) => row.reduce((s, w, d) => s + w * embed[d], 0));
}

const E = randMatrix(V, D);
const W = randMatrix(V, D);
const epochs = 200;
const lr = 0.5;

log.step('Neural LM Training (200 epochs)');
log.data('Vocab size', V);
log.data('Embed dim', D);
log.data('Training pairs', pairs.length);

for (let epoch = 0; epoch < epochs; epoch++) {
  let totalLoss = 0;
  const dE = Array.from({ length: V }, () => new Array(D).fill(0));
  const dW = Array.from({ length: V }, () => new Array(D).fill(0));

  for (const [xi, yi] of pairs) {
    const embed = E[xi];
    const logits = W.map((row) => row.reduce((s, w, d) => s + w * embed[d], 0));
    const probs = softmax(logits);
    totalLoss += -Math.log(probs[yi] + 1e-9);

    for (let k = 0; k < V; k++) {
      const grad = probs[k] - (k === yi ? 1 : 0);
      for (let d = 0; d < D; d++) {
        dW[k][d] += grad * embed[d];
        dE[xi][d] += grad * W[k][d];
      }
    }
  }

  const n = pairs.length;
  for (let i = 0; i < V; i++) {
    for (let d = 0; d < D; d++) {
      E[i][d] -= (lr * dE[i][d]) / n;
      W[i][d] -= (lr * dW[i][d]) / n;
    }
  }

  if (epoch % 40 === 0 || epoch === epochs - 1) {
    log.data('Epoch ' + epoch, 'avg loss = ' + (totalLoss / n).toFixed(4));
  }
}
log.ok('training complete');
`,
    },
  },

  'part-06/generate': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `// Train word-level neural LM on fruit data, then sample
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
const D = 8;

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

const E = randMatrix(V, D);
const W = randMatrix(V, D);
const lr = 0.5;

for (let epoch = 0; epoch < 120; epoch++) {
  const dE = Array.from({ length: V }, () => new Array(D).fill(0));
  const dW = Array.from({ length: V }, () => new Array(D).fill(0));
  for (const [xi, yi] of pairs) {
    const embed = E[xi];
    const logits = W.map((row) => row.reduce((s, w, d) => s + w * embed[d], 0));
    const probs = softmax(logits);
    for (let k = 0; k < V; k++) {
      const grad = probs[k] - (k === yi ? 1 : 0);
      for (let d = 0; d < D; d++) {
        dW[k][d] += grad * embed[d];
        dE[xi][d] += grad * W[k][d];
      }
    }
  }
  const n = pairs.length;
  for (let i = 0; i < V; i++) {
    for (let d = 0; d < D; d++) {
      E[i][d] -= (lr * dE[i][d]) / n;
      W[i][d] -= (lr * dW[i][d]) / n;
    }
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

function predictNext(xi: number): number[] {
  const embed = E[xi];
  return softmax(W.map((row) => row.reduce((s, w, d) => s + w * embed[d], 0)));
}

function generate(startWord: string, maxLen = 8): string {
  const out = [startWord];
  let idx = stoi[startWord];
  for (let i = 0; i < maxLen; i++) {
    idx = sample(predictNext(idx));
    out.push(itos[idx]);
  }
  return out.join(' ');
}

log.step('Neural LM Generation (fruit dataset)');
log.data('Vocab', sorted.join(', '));

for (const start of ['i', 'you', 'fruit']) {
  log.step('Seed "' + start + '"');
  for (let n = 0; n < 3; n++) log.data('sample ' + (n + 1), generate(start));
}
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

log.step('Query, Key, Value');
log.data('Sentence', words.join(' '));
log.data('d_model', dModel);

for (let i = 0; i < words.length; i++) {
  log.step('Token "' + words[i] + '"');
  log.data('x', fmt(X[i]));
  log.data('Q = x·Wq', fmt(Q[i]));
  log.data('K = x·Wk', fmt(K[i]));
  log.data('V = x·Wv', fmt(V[i]));
}
log.ok('Q, K, V computed');
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
log.step('Scaled Dot-Product Attention');
log.data('d_k', dK);
log.data('scale = sqrt(d_k)', scale.toFixed(3));

for (let i = 0; i < Q.length; i++) {
  const rawScores = K.map((k) => dot(Q[i], k));
  const scaledScores = rawScores.map((s) => s / scale);
  const weights = softmax(scaledScores);
  const out = matVec(V, weights);

  log.step('Query row ' + i);
  log.data('Q·K^T (raw)', rawScores.map((s) => s.toFixed(2)));
  log.data('scaled /√d_k', scaledScores.map((s) => s.toFixed(2)));
  log.data('softmax weights', weights.map((w) => w.toFixed(3)));
  log.data('output = Σ w·V', out.map((v) => v.toFixed(3)));
}
log.ok('scaled attention done');
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

log.step('Self-Attention (3 words)');
log.data('Sentence', words.join(' '));

log.step('Attention weights (rows attend to cols)');
console.log('       ' + words.map((w) => w.padStart(6)).join(''));
for (let i = 0; i < words.length; i++) {
  const row = attn[i].map((w) => w.toFixed(3).padStart(6)).join('');
  console.log(words[i].padEnd(6) + row);
}

log.step('Output vectors (context-aware)');
for (let i = 0; i < words.length; i++) {
  log.data(words[i], out[i].map((v) => v.toFixed(2)));
}
log.ok('self-attention done');
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

log.step('Multi-Head Attention (2 heads)');
log.data('Sentence', words.join(' '));

const headOutputs: number[][][] = [];
for (let h = 0; h < numHeads; h++) {
  const Q = sliceHead(X, h);
  const K = sliceHead(X, h);
  const V = sliceHead(X, h);
  const out = attentionHead(Q, K, V);
  headOutputs.push(out);

  log.step('Head ' + h + ' attention weights');
  for (let i = 0; i < words.length; i++) {
    const scores = K.map((k) => dot(Q[i], k) / Math.sqrt(headDim));
    const w = softmax(scores);
    log.data(words[i], w.map((x) => x.toFixed(3)));
  }
}

// Concatenate heads
const concat = X.map((_, i) => headOutputs[0][i].concat(headOutputs[1][i]));
log.step('Concatenated output (head0 || head1)');
for (let i = 0; i < words.length; i++) {
  log.data(words[i], concat[i].map((v) => v.toFixed(2)));
}
log.ok('multi-head concat done');
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

log.step('Positional Encoding (sin/cos)');
log.data('max_len', maxLen);
log.data('d_model', dModel);

for (let pos = 0; pos < maxLen; pos++) {
  const pe = positionalEncoding(pos, dModel);
  const combined = add(tokenEmbed[pos], pe);
  log.step('pos ' + pos + ' ("' + words[pos] + '")');
  log.data('token', tokenEmbed[pos].map((v) => v.toFixed(2)));
  log.data('+ PE', pe.map((v) => v.toFixed(3)));
  log.data('= input', combined.map((v) => v.toFixed(3)));
}
log.ok('positional encoding added');
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

log.step('Layer Normalization');
log.data('Formula', '(x - μ) / σ · γ + β');

for (const [label, x] of vectors) {
  const mean = x.reduce((a, v) => a + v, 0) / x.length;
  const variance = x.reduce((a, v) => a + (v - mean) ** 2, 0) / x.length;
  const y = layerNorm(x, gamma, beta);
  const outMean = y.reduce((a, v) => a + v, 0) / y.length;
  const outVar = y.reduce((a, v) => a + (v - outMean) ** 2, 0) / y.length;

  log.step(label);
  log.data('input', x.map((v) => v.toFixed(2)));
  log.data('μ', mean.toFixed(3));
  log.data('σ²', variance.toFixed(3));
  log.data('output', y.map((v) => v.toFixed(3)));
  log.data('out μ', outMean.toFixed(3));
  log.data('out σ²', outVar.toFixed(3));
}
log.ok('layer norm stabilizes activations');
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

log.step('Feed-Forward Network');
log.data('dims', dModel + ' → ' + dFF + ' → ' + dModel);

for (const { word, x } of tokens) {
  const hidden = matVec(W1, x).map((v, i) => relu(v + b1[i]));
  const out = ffn(x);
  log.step('Token "' + word + '"');
  log.data('input', x);
  log.data('hidden (ReLU)', hidden.map((v) => v.toFixed(2)));
  log.data('output', out.map((v) => v.toFixed(3)));
}
log.ok('FFN forward done');
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

log.step('Residual Connections');
log.data('Skip connection', 'y = x + F(x)');
log.data('Input x', x.map((v) => v.toFixed(2)));

const attnOut = fakeAttention(x);
const afterAttn = add(x, attnOut);
log.step('After attention sublayer');
log.data('F_attn(x)', attnOut.map((v) => v.toFixed(3)));
log.data('x + F_attn(x)', afterAttn.map((v) => v.toFixed(3)));

const ffnOut = fakeFFN(afterAttn);
const afterFFN = add(afterAttn, ffnOut);
log.step('After FFN sublayer');
log.data('F_ffn(h)', ffnOut.map((v) => v.toFixed(3)));
log.data('h + F_ffn(h)', afterFFN.map((v) => v.toFixed(3)));

log.ok('residuals help gradients flow');
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
  log.step('LayerNorm before attention');
  const norm1 = X.map(layerNorm);
  log.data('norm1[0]', norm1[0].map((v) => v.toFixed(3)));

  log.step('Self-attention');
  const attn = selfAttention(norm1);
  log.data('attn[0]', attn[0].map((v) => v.toFixed(3)));

  log.step('Residual add (x + attn)');
  const res1 = X.map((row, i) => add(row, attn[i]));
  log.data('res1[0]', res1[0].map((v) => v.toFixed(3)));

  log.step('LayerNorm before FFN');
  const norm2 = res1.map(layerNorm);
  log.data('norm2[0]', norm2[0].map((v) => v.toFixed(3)));

  log.step('Feed-forward');
  const ff = norm2.map(ffn);
  log.data('ff[0]', ff[0].map((v) => v.toFixed(3)));

  log.step('Residual add (h + ff)');
  const out = res1.map((row, i) => add(row, ff[i]));
  log.data('out[0]', out[0].map((v) => v.toFixed(3)));

  return out;
}

const words = ['i', 'like', 'apple'];
const X: number[][] = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
];

log.step('Transformer Block');
log.data('Input', words.join(' '));

const out = transformerBlock(X);

log.step('Final block output');
for (let i = 0; i < words.length; i++) {
  log.data(words[i], out[i].map((v) => v.toFixed(3)));
}
log.ok('transformer block forward done');
`,
    },
  },

  'part-09/train': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `// Simplified word-level neural LM — same loop as full Mini GPT
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
sorted.forEach((w, i) => { stoi[w] = i; });
const V = sorted.length;
const D = 8;

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

const E = randMatrix(V, D);
const W = randMatrix(V, D);
const epochs = 80;
const lr = 0.5;

log.step('Mini GPT Training (simplified word LM)');
log.data('Vocab size', V);
log.data('Embed dim', D);
log.data('Training pairs', pairs.length);

for (let epoch = 0; epoch < epochs; epoch++) {
  let totalLoss = 0;
  const dE = Array.from({ length: V }, () => new Array(D).fill(0));
  const dW = Array.from({ length: V }, () => new Array(D).fill(0));

  for (const [xi, yi] of pairs) {
    const embed = E[xi];
    const logits = W.map((row) => row.reduce((s, w, d) => s + w * embed[d], 0));
    const probs = softmax(logits);
    totalLoss += -Math.log(probs[yi] + 1e-9);
    for (let k = 0; k < V; k++) {
      const grad = probs[k] - (k === yi ? 1 : 0);
      for (let d = 0; d < D; d++) {
        dW[k][d] += grad * embed[d];
        dE[xi][d] += grad * W[k][d];
      }
    }
  }

  const n = pairs.length;
  for (let i = 0; i < V; i++) {
    for (let d = 0; d < D; d++) {
      E[i][d] -= (lr * dE[i][d]) / n;
      W[i][d] -= (lr * dW[i][d]) / n;
    }
  }

  if (epoch % 10 === 0 || epoch === epochs - 1) {
    log.data('Epoch ' + epoch, 'avg loss = ' + (totalLoss / n).toFixed(4));
  }
}
log.ok('mini GPT training done');
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

log.step('Autoregressive Generation');
log.data('Rule', 'start word → predict next → repeat');

for (const start of ['i', 'you', 'fruit']) {
  log.step('From "' + start + '"');
  for (let n = 0; n < 3; n++) log.data('run ' + (n + 1), generate(start));
}
log.ok('autoregressive samples ready');
`,
    },
  },

  'part-09/temperature': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `// Temperature scales logits before softmax: logits / T
// Same numbers as the lesson animation: z = [2, 1, 0]
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

const vocab = ['apple', 'banana', 'mango'];
const logits = [2, 1, 0]; // lesson + TempSoftmaxAnim

log.step('Temperature Sampling');
log.data('Context', 'like → next fruit logits');
for (let i = 0; i < vocab.length; i++) {
  log.data(vocab[i], logits[i]);
}

log.data('Base probs (T=1.0)', softmax(logits).map((p) => p.toFixed(3)));

for (const temp of [0.5, 1.0, 2.0]) {
  const probs = softmaxWithTemp(logits, temp);
  log.step('T=' + temp);
  log.data('probs', probs.map((p) => p.toFixed(3)));
  const counts: Record<string, number> = {};
  for (let i = 0; i < 5; i++) {
    const idx = sample(probs);
    const word = vocab[idx];
    counts[word] = (counts[word] ?? 0) + 1;
  }
  log.data('5 samples', counts);
}

log.ok('T<1 sharper, T>1 flatter');
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

log.step('Top-k Sampling');
log.data('Context', 'i → logits');
for (let i = 0; i < vocab.length; i++) {
  log.data(vocab[i], logits[i]);
}

log.data('Full softmax', softmax(logits).map((p) => p.toFixed(3)));

for (const k of [1, 2, 3]) {
  const filtered = topKFilter(logits, k);
  const probs = softmax(filtered);
  const allowed = vocab.filter((_, i) => filtered[i] !== -Infinity);
  log.step('Top-k=' + k);
  log.data('allowed', allowed.join(', '));
  log.data('probs', probs.map((p) => (p > 0 ? p.toFixed(3) : '0.000')));
  const counts: Record<string, number> = {};
  for (let i = 0; i < 5; i++) {
    const idx = sample(probs);
    const word = vocab[idx];
    counts[word] = (counts[word] ?? 0) + 1;
  }
  log.data('5 samples', counts);
}

log.ok('top-k cuts unlikely tokens');
`,
    },
  },
};
