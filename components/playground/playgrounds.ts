import { playgroundsPart03to05 } from './playgrounds-part03-05';
import { playgroundsPart06to09 } from './playgrounds-part06-09';

export type PlaygroundEntry = {
  files: Record<string, string>;
  template: 'vanilla-ts';
  activeFile: string;
};

export const playgrounds: Record<string, PlaygroundEntry> = {
  'part-01/tokenizer': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `// Dataset — 10 fruit sentences
const dataset = [
  'i like apple',
  'i like banana',
  'i like mango',
  'you like apple',
  'you eat mango',
  'he eats banana',
  'apple is fruit',
  'banana is fruit',
  'mango is fruit',
  'fruit is healthy',
];

// Tokenizer — whitespace split + lowercase
function tokenize(sentence: string): string[] {
  return sentence.toLowerCase().trim().split(/\\s+/);
}

log.step('Tokenizer Demo');

const example = 'I Like Apple';
log.data('Input', example);
const tokens = tokenize(example);
log.data('Tokens', tokens);
log.ok('lowercase + split সম্পন্ন');

log.step('Sample sentences');
for (const sentence of dataset.slice(0, 4)) {
  log.data(sentence, tokenize(sentence));
}
`,
    },
  },

  'part-01/vocabulary': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `const dataset = [
  'i like apple', 'i like banana', 'i like mango',
  'you like apple', 'you eat mango', 'he eats banana',
  'apple is fruit', 'banana is fruit', 'mango is fruit', 'fruit is healthy',
];

function tokenize(s: string): string[] {
  return s.toLowerCase().trim().split(/\\s+/);
}

function buildVocab(): { stoi: Record<string, number>; size: number } {
  const words = new Set<string>();
  for (const sentence of dataset) {
    for (const word of tokenize(sentence)) words.add(word);
  }
  const sorted = Array.from(words).sort();
  const stoi: Record<string, number> = {};
  sorted.forEach((word, i) => { stoi[word] = i; });
  return { stoi, size: sorted.length };
}

log.step('Vocabulary Demo');

const vocab = buildVocab();
log.data('Vocab size', vocab.size);

log.step('Word → ID');
for (const [word, id] of Object.entries(vocab.stoi)) {
  log.data(word, id);
}
log.ok('12 unique words mapped');
`,
    },
  },

  'part-01/encoding': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `const dataset = [
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

function encode(sentence: string): number[] {
  return tokenize(sentence).map((w) => stoi[w]);
}

function decode(ids: number[]): string {
  return ids.map((id) => itos[id]).join(' ');
}

log.step('Encoding / Decoding Demo');

log.step('Encode');
for (const sentence of ['i like apple', 'fruit is healthy', 'you eat mango']) {
  const ids = encode(sentence);
  log.data(sentence, ids);
}

log.step('Decode back');
const ids = encode('fruit is healthy');
log.data('IDs', ids);
log.data('Decoded', decode(ids));
log.ok('encode ↔ decode round-trip OK');
`,
    },
  },

  'part-01/training-pairs': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `const dataset = [
  'i like apple', 'i like banana', 'i like mango',
  'you like apple', 'you eat mango', 'he eats banana',
  'apple is fruit', 'banana is fruit', 'mango is fruit', 'fruit is healthy',
];

function tokenize(s: string): string[] {
  return s.toLowerCase().trim().split(/\\s+/);
}

log.step('Training Pairs Demo');
log.data('Rule', 'current word → next word');

const pairs: [string, string][] = [];
for (const sentence of dataset) {
  const words = tokenize(sentence);
  for (let i = 0; i < words.length - 1; i++) {
    pairs.push([words[i], words[i + 1]]);
  }
}

log.data('Total pairs', pairs.length);

log.step('All pairs');
for (const [current, next] of pairs) {
  log.data(current, next);
}

log.step('Pattern summary');
const counts: Record<string, Record<string, number>> = {};
for (const [a, b] of pairs) {
  if (!counts[a]) counts[a] = {};
  counts[a][b] = (counts[a][b] ?? 0) + 1;
}
for (const [word, nexts] of Object.entries(counts)) {
  log.data(word, nexts);
}
log.ok(pairs.length + ' bigram pairs built');
`,
    },
  },

  'part-02/count-model': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `const dataset = [
  'i like apple', 'i like banana', 'i like mango',
  'you like apple', 'you eat mango', 'he eats banana',
  'apple is fruit', 'banana is fruit', 'mango is fruit', 'fruit is healthy',
];

function tokenize(s: string): string[] {
  return s.toLowerCase().trim().split(/\\s+/);
}

class BigramModel {
  table = new Map<string, Map<string, number>>();

  train() {
    for (const sentence of dataset) {
      const words = tokenize(sentence);
      for (let i = 0; i < words.length - 1; i++) {
        const current = words[i];
        const next = words[i + 1];
        if (!this.table.has(current)) this.table.set(current, new Map());
        const row = this.table.get(current)!;
        row.set(next, (row.get(next) ?? 0) + 1);
      }
    }
  }
}

log.step('Bigram Count Model');

const model = new BigramModel();
model.train();

log.step('Trained count table');
for (const [word, row] of model.table) {
  const entries: Record<string, number> = {};
  for (const [next, count] of row) entries[next] = count;
  log.data(word, entries);
}
log.ok('count table ready');
`,
    },
  },

  'part-02/predict': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `const dataset = [
  'i like apple', 'i like banana', 'i like mango',
  'you like apple', 'you eat mango', 'he eats banana',
  'apple is fruit', 'banana is fruit', 'mango is fruit', 'fruit is healthy',
];

function tokenize(s: string): string[] {
  return s.toLowerCase().trim().split(/\\s+/);
}

class BigramModel {
  table = new Map<string, Map<string, number>>();

  train() {
    for (const sentence of dataset) {
      const words = tokenize(sentence);
      for (let i = 0; i < words.length - 1; i++) {
        const c = words[i], n = words[i + 1];
        if (!this.table.has(c)) this.table.set(c, new Map());
        const row = this.table.get(c)!;
        row.set(n, (row.get(n) ?? 0) + 1);
      }
    }
  }

  predict(word: string): string | null {
    const row = this.table.get(word);
    if (!row) return null;
    let best = '', bestCount = -1;
    for (const [next, count] of row) {
      if (count > bestCount) { best = next; bestCount = count; }
    }
    return best;
  }

  probabilities(word: string): Map<string, number> {
    const row = this.table.get(word);
    const result = new Map<string, number>();
    if (!row) return result;
    const total = Array.from(row.values()).reduce((s, c) => s + c, 0);
    for (const [next, count] of row) result.set(next, count / total);
    return result;
  }
}

log.step('Predict (argmax)');

const model = new BigramModel();
model.train();

log.step('Next-word predictions');
for (const word of ['i', 'like', 'apple', 'fruit', 'is']) {
  const next = model.predict(word);
  const probs = model.probabilities(word);
  const prob = next ? probs.get(next) : undefined;
  log.data(word, next + ' (P=' + (prob?.toFixed(2) ?? 'N/A') + ')');
}
log.ok('argmax predictions done');
`,
    },
  },

  'part-02/generate': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `const dataset = [
  'i like apple', 'i like banana', 'i like mango',
  'you like apple', 'you eat mango', 'he eats banana',
  'apple is fruit', 'banana is fruit', 'mango is fruit', 'fruit is healthy',
];

function tokenize(s: string): string[] {
  return s.toLowerCase().trim().split(/\\s+/);
}

class BigramModel {
  table = new Map<string, Map<string, number>>();

  train() {
    for (const sentence of dataset) {
      const words = tokenize(sentence);
      for (let i = 0; i < words.length - 1; i++) {
        const c = words[i], n = words[i + 1];
        if (!this.table.has(c)) this.table.set(c, new Map());
        this.table.get(c)!.set(n, (this.table.get(c)!.get(n) ?? 0) + 1);
      }
    }
  }

  predict(word: string): string | null {
    const row = this.table.get(word);
    if (!row) return null;
    let best = '', bestCount = -1;
    for (const [next, count] of row) {
      if (count > bestCount) { best = next; bestCount = count; }
    }
    return best;
  }

  generate(start: string, maxLen = 10): string {
    const words = [start];
    for (let i = 0; i < maxLen; i++) {
      const next = this.predict(words.at(-1)!);
      if (!next) break;
      words.push(next);
    }
    return words.join(' ');
  }
}

log.step('Generate (autoregressive)');

const model = new BigramModel();
model.train();

log.step('Start from "i"');
for (let i = 0; i < 3; i++) {
  log.data('run ' + (i + 1), model.generate('i'));
}

log.step('Start from "you"');
log.data('run 1', model.generate('you'));
log.ok('autoregressive generation done');
`,
    },
  },

  'part-02/sampling': {
    template: 'vanilla-ts',
    activeFile: '/index.ts',
    files: {
      '/index.ts': `const dataset = [
  'i like apple', 'i like banana', 'i like mango',
  'you like apple', 'you eat mango', 'he eats banana',
  'apple is fruit', 'banana is fruit', 'mango is fruit', 'fruit is healthy',
];

function tokenize(s: string): string[] {
  return s.toLowerCase().trim().split(/\\s+/);
}

class BigramModel {
  table = new Map<string, Map<string, number>>();

  train() {
    for (const sentence of dataset) {
      const words = tokenize(sentence);
      for (let i = 0; i < words.length - 1; i++) {
        const c = words[i], n = words[i + 1];
        if (!this.table.has(c)) this.table.set(c, new Map());
        this.table.get(c)!.set(n, (this.table.get(c)!.get(n) ?? 0) + 1);
      }
    }
  }

  predict(word: string): string | null {
    const row = this.table.get(word);
    if (!row) return null;
    let best = '', bestCount = -1;
    for (const [next, count] of row) {
      if (count > bestCount) { best = next; bestCount = count; }
    }
    return best;
  }

  sample(word: string): string | null {
    const row = this.table.get(word);
    if (!row) return null;
    const total = Array.from(row.values()).reduce((s, c) => s + c, 0);
    const r = Math.random();
    let cum = 0;
    for (const [next, count] of row) {
      cum += count / total;
      if (r < cum) return next;
    }
    return Array.from(row.keys()).at(-1) ?? null;
  }

  generateArgmax(start: string, maxLen = 10): string {
    const words = [start];
    for (let i = 0; i < maxLen; i++) {
      const next = this.predict(words.at(-1)!);
      if (!next) break;
      words.push(next);
    }
    return words.join(' ');
  }

  generateSample(start: string, maxLen = 10): string {
    const words = [start];
    for (let i = 0; i < maxLen; i++) {
      const next = this.sample(words.at(-1)!);
      if (!next) break;
      words.push(next);
    }
    return words.join(' ');
  }
}

log.step('Argmax vs Sampling');

const model = new BigramModel();
model.train();

log.data('like →', 'apple 50%, banana 25%, mango 25%');

log.step('Argmax (always same)');
for (let i = 0; i < 3; i++) {
  log.data('run ' + (i + 1), model.generateArgmax('i'));
}

log.step('Sampling (different each run)');
for (let i = 0; i < 5; i++) {
  log.data('run ' + (i + 1), model.generateSample('i'));
}
log.ok('argmax vs sampling compared');
`,
    },
  },

  ...playgroundsPart03to05,
  ...playgroundsPart06to09,
};

export function getPlayground(id: string): PlaygroundEntry | undefined {
  return playgrounds[id];
}

export function getPlaygroundCode(id: string): string | undefined {
  const entry = playgrounds[id];
  if (!entry) return undefined;
  return entry.files[entry.activeFile];
}
