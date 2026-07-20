export type PlaygroundEntry = {
  files: Record<string, string>;
  template: 'vanilla-ts';
  activeFile: string;
  runtime?: 'esbuild' | 'nodepod';
};

export const playgroundsPart03to05: Record<string, PlaygroundEntry> = {
  'part-03/scalar-vector': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `// Vectors are ordered lists of numbers — the building blocks of ML math.
class Vector {
  constructor(readonly data: number[]) {}

  add(other: Vector): Vector {
    const out = this.data.map((v, i) => v + other.data[i]);
    return new Vector(out);
  }

  dot(other: Vector): number {
    return this.data.reduce((sum, v, i) => sum + v * other.data[i], 0);
  }

  toString(): string {
    return '[' + this.data.join(', ') + ']';
  }
}

console.log('=== Scalar vs Vector ===\\n');

const a = new Vector([1, 2, 3]);
const b = new Vector([4, 5, 6]);

console.log('a = ' + a);
console.log('b = ' + b);
console.log('a + b = ' + a.add(b));
console.log('a · b (dot) = ' + a.dot(b));
console.log('\\nDot product = sum of element-wise products');
console.log('  1×4 + 2×5 + 3×6 = ' + a.dot(b));
`,
    },
  },

  'part-03/matrix': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `// A matrix stores numbers in rows and columns.
class Matrix {
  constructor(readonly rows: number, readonly cols: number, readonly data: number[]) {}

  get(r: number, c: number): number {
    return this.data[r * this.cols + c];
  }

  set(r: number, c: number, value: number): void {
    this.data[r * this.cols + c] = value;
  }

  toString(): string {
    const lines: string[] = [];
    for (let r = 0; r < this.rows; r++) {
      const row = Array.from({ length: this.cols }, (_, c) => this.get(r, c));
      lines.push('  [' + row.join(', ') + ']');
    }
    return lines.join('\\n');
  }
}

console.log('=== 2×2 Matrix ===\\n');

const m = new Matrix(2, 2, [1, 2, 3, 4]);
console.log('Initial matrix:\\n' + m);

console.log('\\nget(0, 1) = ' + m.get(0, 1));
m.set(1, 0, 99);
console.log('After set(1, 0, 99):\\n' + m);
`,
    },
  },

  'part-03/dot-product': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `function dot(a: number[], b: number[]): number {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}

const a = [1, 2, 3];
const b = [4, 5, 6];

console.log('=== Dot Product ===\\n');
console.log('a = [' + a.join(', ') + ']');
console.log('b = [' + b.join(', ') + ']');
console.log('\\nStep by step:');
for (let i = 0; i < a.length; i++) {
  console.log('  a[' + i + '] × b[' + i + '] = ' + a[i] + ' × ' + b[i] + ' = ' + (a[i] * b[i]));
}
console.log('\\na · b = ' + dot(a, b));
`,
    },
  },

  'part-03/matmul': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `function matmul(A: number[][], B: number[][]): number[][] {
  const rows = A.length;
  const cols = B[0].length;
  const inner = B.length;
  const C = Array.from({ length: rows }, () => new Array(cols).fill(0));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      for (let k = 0; k < inner; k++) {
        C[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return C;
}

function printMatrix(name: string, M: number[][]): void {
  console.log(name + ':');
  for (const row of M) {
    console.log('  [' + row.join(', ') + ']');
  }
}

const A = [[1, 2], [3, 4]];
const B = [[5, 6], [7, 8]];

console.log('=== Matrix Multiply (2×2) ===\\n');
printMatrix('A', A);
console.log('');
printMatrix('B', B);

const C = matmul(A, B);
console.log('\\nA × B =');
printMatrix('C', C);

console.log('\\nC[0][0] = 1×5 + 2×7 = ' + C[0][0]);
console.log('C[0][1] = 1×6 + 2×8 = ' + C[0][1]);
console.log('C[1][0] = 3×5 + 4×7 = ' + C[1][0]);
console.log('C[1][1] = 3×6 + 4×8 = ' + C[1][1]);
`,
    },
  },

  'part-03/softmax': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `function softmax(logits: number[]): number[] {
  const max = Math.max(...logits);
  const exps = logits.map((x) => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

const logits = [2, 1, 0];

console.log('=== Softmax ===\\n');
console.log('Input logits: [' + logits.join(', ') + ']');
console.log('\\nSoftmax converts raw scores into probabilities (sum = 1):\\n');

const probs = softmax(logits);
for (let i = 0; i < logits.length; i++) {
  console.log('  class ' + i + ': exp(' + logits[i] + ') / sum → ' + probs[i].toFixed(4));
}

const total = probs.reduce((a, b) => a + b, 0);
console.log('\\nProbabilities: [' + probs.map((p) => p.toFixed(4)).join(', ') + ']');
console.log('Sum = ' + total.toFixed(4));
`,
    },
  },

  'part-04/value': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    runtime: 'nodepod',
    files: {
      '/index.ts': `// micrograd-style autograd: each Value tracks how it was computed.
class Value {
  data: number;
  grad = 0;
  _children: Value[] = [];
  _op = '';

  constructor(data: number, children: Value[] = [], op = '') {
    this.data = data;
    this._children = children;
    this._op = op;
  }

  add(other: Value): Value {
    return new Value(this.data + other.data, [this, other], '+');
  }

  mul(other: Value): Value {
    return new Value(this.data * other.data, [this, other], '*');
  }
}

console.log('=== Value (Forward Pass) ===\\n');

const a = new Value(2);
const b = new Value(3);
const c = a.mul(b).add(new Value(1));

console.log('a = ' + a.data);
console.log('b = ' + b.data);
console.log('c = a * b + 1 = ' + c.data);
console.log('\\nComputation graph:');
console.log('  c (' + c.data + ') ← ' + c._op);
console.log('    ├─ left  (' + c._children[0].data + ') ← ' + c._children[0]._op);
console.log('    │    ├─ a (' + a.data + ')');
console.log('    │    └─ b (' + b.data + ')');
console.log('    └─ right (1) ← +');
`,
    },
  },

  'part-04/backprop': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    runtime: 'nodepod',
    files: {
      '/index.ts': `class Value {
  data: number;
  grad = 0;
  _backward: () => void = () => {};
  _children: Value[] = [];
  _op = '';

  constructor(data: number, children: Value[] = [], op = '') {
    this.data = data;
    this._children = children;
    this._op = op;
  }

  add(other: Value): Value {
    const out = new Value(this.data + other.data, [this, other], '+');
    out._backward = () => {
      this.grad += out.grad;
      other.grad += out.grad;
    };
    return out;
  }

  mul(other: Value): Value {
    const out = new Value(this.data * other.data, [this, other], '*');
    out._backward = () => {
      this.grad += other.data * out.grad;
      other.grad += this.data * out.grad;
    };
    return out;
  }

  backward(): void {
    const topo: Value[] = [];
    const visited = new Set<Value>();
    const build = (v: Value) => {
      if (visited.has(v)) return;
      visited.add(v);
      for (const child of v._children) build(child);
      topo.push(v);
    };
    build(this);
    this.grad = 1;
    for (let i = topo.length - 1; i >= 0; i--) topo[i]._backward();
  }
}

console.log('=== Backpropagation ===\\n');

const a = new Value(2);
const b = new Value(3);
const c = a.mul(b);
const d = c.add(new Value(1));

console.log('Forward: d = a*b + 1 = ' + d.data);

d.backward();

console.log('\\nGradients (∂L/∂x where L = d):');
console.log('  ∂d/∂a = ' + a.grad + '  (chain rule: b × 1 = ' + b.data + ')');
console.log('  ∂d/∂b = ' + b.grad + '  (chain rule: a × 1 = ' + a.data + ')');
console.log('  ∂d/∂c = ' + c.grad + '  (add passes grad through)');
console.log('  ∂d/∂d = ' + d.grad);
`,
    },
  },

  'part-04/gradient-descent': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    runtime: 'nodepod',
    files: {
      '/index.ts': `// Minimize f(x) = x² using gradient descent.
// f'(x) = 2x, so we step: x ← x - lr * 2x

function f(x: number): number {
  return x * x;
}

function df(x: number): number {
  return 2 * x;
}

console.log('=== Gradient Descent on x² ===\\n');
console.log('Goal: find x that minimizes f(x) = x²\\n');

let x = 4.0;
const lr = 0.1;
const steps = 10;

console.log('Start: x = ' + x + ', f(x) = ' + f(x));
console.log('Learning rate: ' + lr + '\\n');

for (let i = 1; i <= steps; i++) {
  const grad = df(x);
  x = x - lr * grad;
  console.log(
    'Step ' + i + ': grad = ' + grad.toFixed(4) +
    ' → x = ' + x.toFixed(4) +
    ', f(x) = ' + f(x).toFixed(6)
  );
}

console.log('\\nConverged near x = 0 (minimum of x²)');
`,
    },
  },

  'part-05/neuron': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    runtime: 'nodepod',
    files: {
      '/index.ts': `function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function neuron(inputs: number[], weights: number[], bias: number): number {
  let z = bias;
  for (let i = 0; i < inputs.length; i++) {
    z += inputs[i] * weights[i];
  }
  return sigmoid(z);
}

console.log('=== Single Neuron ===\\n');

const inputs = [0.5, 0.8, 0.2];
const weights = [0.4, -0.6, 0.9];
const bias = -0.1;

console.log('Inputs:  [' + inputs.join(', ') + ']');
console.log('Weights: [' + weights.join(', ') + ']');
console.log('Bias:    ' + bias);

let z = bias;
console.log('\\nWeighted sum z = bias + Σ(wᵢ × xᵢ):');
for (let i = 0; i < inputs.length; i++) {
  const term = weights[i] * inputs[i];
  console.log('  w' + i + '×x' + i + ' = ' + weights[i] + ' × ' + inputs[i] + ' = ' + term.toFixed(4));
  z += term;
}
console.log('  z = ' + z.toFixed(4));

const output = sigmoid(z);
console.log('\\nOutput = sigmoid(z) = ' + output.toFixed(4));
console.log('(squashes z into range (0, 1))');
`,
    },
  },

  'part-05/layer': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    runtime: 'nodepod',
    files: {
      '/index.ts': `function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function dot(a: number[], b: number[]): number {
  return a.reduce((s, v, i) => s + v * b[i], 0);
}

function layer(inputs: number[], weightMatrix: number[][], biases: number[]): number[] {
  return weightMatrix.map((weights, i) => sigmoid(dot(inputs, weights) + biases[i]));
}

console.log('=== Layer of 3 Neurons ===\\n');

const inputs = [0.5, 0.8, 0.2];
const W = [
  [0.4, -0.6, 0.9],   // neuron 0 weights
  [-0.3, 0.7, 0.1],   // neuron 1 weights
  [0.2, 0.2, -0.5],   // neuron 2 weights
];
const biases = [-0.1, 0.3, -0.2];

console.log('Input vector: [' + inputs.join(', ') + ']');
console.log('3 neurons, each with ' + inputs.length + ' weights\\n');

const outputs = layer(inputs, W, biases);

for (let i = 0; i < outputs.length; i++) {
  const z = dot(inputs, W[i]) + biases[i];
  console.log('Neuron ' + i + ': z = ' + z.toFixed(4) + ' → sigmoid = ' + outputs[i].toFixed(4));
}

console.log('\\nLayer output: [' + outputs.map((o) => o.toFixed(4)).join(', ') + ']');
`,
    },
  },

  'part-05/mlp': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    runtime: 'nodepod',
    files: {
      '/index.ts': `function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function dot(a: number[], b: number[]): number {
  return a.reduce((s, v, i) => s + v * b[i], 0);
}

function layer(inputs: number[], W: number[][], b: number[]): number[] {
  return W.map((w, i) => sigmoid(dot(inputs, w) + b[i]));
}

console.log('=== 2-Layer MLP Forward Pass ===\\n');

const x = [0.5, 0.8];

// Layer 1: 2 inputs → 3 hidden neurons
const W1 = [[0.4, -0.6], [0.3, 0.7], [-0.2, 0.5]];
const b1 = [-0.1, 0.2, -0.3];
const h = layer(x, W1, b1);

console.log('Input:  [' + x.join(', ') + ']');
console.log('Hidden: [' + h.map((v) => v.toFixed(4)).join(', ') + ']  (3 neurons)');

// Layer 2: 3 hidden → 1 output neuron
const W2 = [[0.5], [-0.4], [0.6]];
const b2 = [0.1];
const y = layer(h, W2, b2);

console.log('Output: ' + y[0].toFixed(4) + '  (1 neuron)');
console.log('\\nData flow: input → hidden (sigmoid) → output (sigmoid)');
`,
    },
  },

  'part-05/xor': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    runtime: 'nodepod',
    files: {
      '/index.ts': `function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function dsigmoid(y: number): number {
  return y * (1 - y);
}

function randn(): number {
  return (Math.random() * 2 - 1) * 0.5;
}

// XOR dataset
const X = [[0, 0], [0, 1], [1, 0], [1, 1]];
const Y = [0, 1, 1, 0];

// 2 → 4 → 1 MLP weights
let W1 = Array.from({ length: 4 }, () => [randn(), randn()]);
let b1 = Array.from({ length: 4 }, () => randn());
let W2 = Array.from({ length: 1 }, () => Array.from({ length: 4 }, () => randn()));
let b2 = [randn()];

const lr = 0.5;
const epochs = 100;

console.log('=== Train XOR (~100 epochs) ===\\n');

for (let epoch = 0; epoch < epochs; epoch++) {
  let totalLoss = 0;

  for (let n = 0; n < X.length; n++) {
    const x = X[n];
    const target = Y[n];

    // Forward
    const h = W1.map((w, i) => sigmoid(w[0] * x[0] + w[1] * x[1] + b1[i]));
    const y = sigmoid(W2[0].reduce((s, w, i) => s + w * h[i], 0) + b2[0]);

    // Loss (MSE)
    const loss = (y - target) ** 2;
    totalLoss += loss;

    // Backward
    const dy = 2 * (y - target) * dsigmoid(y);
    for (let i = 0; i < 4; i++) {
      W2[0][i] -= lr * dy * h[i];
    }
    b2[0] -= lr * dy;

    for (let i = 0; i < 4; i++) {
      const dh = dy * W2[0][i] * dsigmoid(h[i]);
      W1[i][0] -= lr * dh * x[0];
      W1[i][1] -= lr * dh * x[1];
      b1[i] -= lr * dh;
    }
  }

  if (epoch % 20 === 0 || epoch === epochs - 1) {
    console.log('Epoch ' + epoch + ': avg loss = ' + (totalLoss / X.length).toFixed(4));
  }
}

console.log('\\n--- Predictions ---');
for (let i = 0; i < X.length; i++) {
  const x = X[i];
  const h = W1.map((w, j) => sigmoid(w[0] * x[0] + w[1] * x[1] + b1[j]));
  const y = sigmoid(W2[0].reduce((s, w, j) => s + w * h[j], 0) + b2[0]);
  console.log('  [' + x.join(', ') + '] → ' + y.toFixed(4) + '  (target: ' + Y[i] + ')');
}
`,
    },
  },
};
