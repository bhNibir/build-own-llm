import { dataset } from '../shared/data';
import { tokenize } from './tokenizer';

export type Vocabulary = {
  stoi: Record<string, number>;
  itos: Record<number, string>;
  size: number;
};

export function buildVocab(): Vocabulary {
  const words = new Set<string>();

  for (const sentence of dataset) {
    for (const word of tokenize(sentence)) {
      words.add(word);
    }
  }

  const sorted = Array.from(words).sort();
  const stoi: Record<string, number> = {};
  const itos: Record<number, string> = {};

  sorted.forEach((word, index) => {
    stoi[word] = index;
    itos[index] = word;
  });

  return { stoi, itos, size: sorted.length };
}

export function encode(sentence: string, vocab: Vocabulary): number[] {
  return tokenize(sentence).map((word) => vocab.stoi[word]);
}

export function decode(ids: number[], vocab: Vocabulary): string {
  return ids.map((id) => vocab.itos[id]).join(' ');
}

export type TrainingPair = [string, string];

export function buildTrainingPairs(): TrainingPair[] {
  const pairs: TrainingPair[] = [];

  for (const sentence of dataset) {
    const words = tokenize(sentence);
    for (let i = 0; i < words.length - 1; i++) {
      pairs.push([words[i], words[i + 1]]);
    }
  }

  return pairs;
}
