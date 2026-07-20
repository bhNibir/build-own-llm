export {};

console.log('=== Part 8: Transformer Block ===\n');

const steps = ['LayerNorm', 'Self-Attention', 'Residual', 'FFN', 'Residual'];
console.log('Block sublayers:');
for (const s of steps) console.log('  →', s);

console.log('\nResidual: output = x + sublayer(x)');
console.log('Pre-LN: normalize before each sublayer');
