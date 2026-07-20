export {};

console.log('=== Part 7: Self-Attention ===\n');

const tokens = ['i', 'like', 'apple'];
const Q = tokens.map((_, i) => [i + 1, 0.5]);
const K = tokens.map((_, i) => [0.5, i + 1]);

function dot(a: number[], b: number[]): number {
  return a[0] * b[0] + a[1] * b[1];
}

function softmax(row: number[]): number[] {
  const max = Math.max(...row);
  const ex = row.map((x) => Math.exp(x - max));
  const s = ex.reduce((a, b) => a + b, 0);
  return ex.map((e) => e / s);
}

console.log('Tokens:', tokens.join(' | '));
for (let i = 0; i < tokens.length; i++) {
  const scores = K.map((k) => dot(Q[i], k) / Math.sqrt(2));
  const weights = softmax(scores);
  console.log(`Q(${tokens[i]}) weights:`, weights.map((w) => w.toFixed(2)).join(', '));
}
