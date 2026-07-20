import { dataset } from '../shared/data';
import { tokenize } from '../part-01/tokenizer';

export class BigramModel {
  table = new Map<string, Map<string, number>>();

  train(): void {
    for (const sentence of dataset) {
      const words = tokenize(sentence);

      for (let i = 0; i < words.length - 1; i++) {
        const current = words[i];
        const next = words[i + 1];

        if (!this.table.has(current)) {
          this.table.set(current, new Map());
        }

        const row = this.table.get(current)!;
        row.set(next, (row.get(next) ?? 0) + 1);
      }
    }
  }

  probabilities(word: string): Map<string, number> {
    const row = this.table.get(word);
    const result = new Map<string, number>();

    if (!row) {
      return result;
    }

    const total = Array.from(row.values()).reduce((sum, count) => sum + count, 0);

    for (const [next, count] of row) {
      result.set(next, count / total);
    }

    return result;
  }

  predict(word: string): string | null {
    const row = this.table.get(word);
    if (!row) {
      return null;
    }

    let bestWord = '';
    let bestCount = -1;

    for (const [next, count] of row) {
      if (count > bestCount) {
        bestWord = next;
        bestCount = count;
      }
    }

    return bestWord;
  }

  sample(word: string): string | null {
    const probs = this.probabilities(word);
    if (probs.size === 0) {
      return null;
    }

    const r = Math.random();
    let cumulative = 0;

    for (const [next, prob] of probs) {
      cumulative += prob;
      if (r < cumulative) {
        return next;
      }
    }

    return Array.from(probs.keys()).at(-1) ?? null;
  }

  generate(start: string, maxLen = 10): string {
    const words = [start];

    for (let i = 0; i < maxLen; i++) {
      const current = words.at(-1)!;
      const next = this.predict(current);

      if (!next) {
        break;
      }

      words.push(next);
    }

    return words.join(' ');
  }

  generateSample(start: string, maxLen = 10): string {
    const words = [start];

    for (let i = 0; i < maxLen; i++) {
      const current = words.at(-1)!;
      const next = this.sample(current);

      if (!next) {
        break;
      }

      words.push(next);
    }

    return words.join(' ');
  }
}
