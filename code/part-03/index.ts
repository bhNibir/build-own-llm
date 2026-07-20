export {};

console.log('=== Part 3: Math Foundations ===\n');

function softmax(logits: number[]): number[] {
  const max = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

const z = [2, 1, 0];
const probs = softmax(z);
console.log('Logits:', z);
console.log('Softmax probs:', probs.map((p) => p.toFixed(3)));

const a = [1, 2, 3];
const b = [4, 5, 6];
const dot = a.reduce((s, v, i) => s + v * b[i], 0);
console.log('\nDot product [1,2,3]·[4,5,6] =', dot);

console.log('\nFor full char-level NN demo: bun code/part-03/neural-char.ts');
