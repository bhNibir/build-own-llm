export {};

import { dataset } from '../shared/data';

console.log('=== Part 6: Neural Language Model ===\n');

function tokenize(s: string): string[] {
  return s.toLowerCase().trim().split(/\s+/);
}

const words = new Set<string>();
for (const s of dataset) for (const w of tokenize(s)) words.add(w);
const vocab = Array.from(words).sort();
console.log('Vocab size:', vocab.length);
console.log('Sample:', vocab.slice(0, 6).join(', '));

console.log('\nTraining pairs (first 5):');
for (const s of dataset.slice(0, 3)) {
  const t = tokenize(s);
  for (let i = 0; i < t.length - 1; i++) {
    console.log(`  ${t[i]} → ${t[i + 1]}`);
  }
}

console.log('\nFull train loop: use Playground part-06/train in browser');
