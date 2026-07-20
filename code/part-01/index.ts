import { dataset } from '../shared/data';
import { tokenize } from './tokenizer';
import {
  buildTrainingPairs,
  buildVocab,
  decode,
  encode,
} from './vocabulary';

console.log('=== Part 1: Tokenizer + Vocabulary + Encoding ===\n');

console.log('Dataset:');
for (const sentence of dataset) {
  console.log(`  - ${sentence}`);
}

console.log('\n--- Tokenizer ---');
const example = dataset[0];
console.log(`Input:  "${example}"`);
console.log(`Tokens: [${tokenize(example).map((w) => `"${w}"`).join(', ')}]`);

console.log('\n--- Vocabulary ---');
const vocab = buildVocab();
console.log('Word → ID:');
for (const [word, id] of Object.entries(vocab.stoi)) {
  console.log(`  ${word} → ${id}`);
}
console.log(`Vocab size: ${vocab.size}`);

console.log('\n--- Encoding ---');
for (const sentence of dataset.slice(0, 3)) {
  const ids = encode(sentence, vocab);
  console.log(`"${sentence}" → [${ids.join(', ')}]`);
}

console.log('\n--- Decoding ---');
const encoded = encode('fruit is healthy', vocab);
console.log(`[${encoded.join(', ')}] → "${decode(encoded, vocab)}"`);

console.log('\n--- Training Pairs ---');
const pairs = buildTrainingPairs();
console.log(`Total pairs: ${pairs.length}`);
console.log('First 10 pairs:');
for (const [current, next] of pairs.slice(0, 10)) {
  console.log(`  "${current}" → "${next}"`);
}
