export {};

console.log('=== Part 5: Neural Network ===\n');

function relu(x: number): number {
  return x > 0 ? x : 0;
}

function dot(a: number[], b: number[]): number {
  return a.reduce((s, v, i) => s + v * b[i], 0);
}

const inputs = [0, 1];
const w1 = [0.5, -0.5];
const b1 = 0.1;
const h = relu(dot(inputs, w1) + b1);
console.log('XOR-ish neuron: inputs', inputs, '→ hidden', h.toFixed(3));

const w2 = [1.2];
const out = dot([h], w2);
console.log('Output logit:', out.toFixed(3));
