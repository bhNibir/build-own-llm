import { BigramModel } from './bigram';

console.log('=== Part 2: Bigram Language Model ===\n');

const model = new BigramModel();
model.train();

console.log('--- Trained Count Table ---');
for (const [word, row] of model.table) {
  const entries = Array.from(row.entries())
    .map(([next, count]) => `${next}=${count}`)
    .join(', ');
  console.log(`  ${word} → { ${entries} }`);
}

console.log('\n--- Predict (argmax) ---');
for (const word of ['i', 'like', 'apple', 'fruit']) {
  const next = model.predict(word);
  const probs = model.probabilities(word);
  const prob = next ? probs.get(next) : undefined;
  console.log(`  ${word} → ${next} (P=${prob?.toFixed(2) ?? 'N/A'})`);
}

console.log('\n--- Generate (argmax) ---');
for (let i = 0; i < 3; i++) {
  console.log(`  ${model.generate('i')}`);
}

console.log('\n--- Generate (sampling) ---');
for (let i = 0; i < 3; i++) {
  console.log(`  ${model.generateSample('i')}`);
}
