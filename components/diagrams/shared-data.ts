/** Fruit corpus — single source for diagram examples */
export const FRUIT_DATASET = [
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

export const VOCAB: { word: string; id: number }[] = [
  { word: 'apple', id: 0 },
  { word: 'banana', id: 1 },
  { word: 'eat', id: 2 },
  { word: 'eats', id: 3 },
  { word: 'fruit', id: 4 },
  { word: 'he', id: 5 },
  { word: 'healthy', id: 6 },
  { word: 'i', id: 7 },
  { word: 'is', id: 8 },
  { word: 'like', id: 9 },
  { word: 'mango', id: 10 },
  { word: 'you', id: 11 },
];

/** P(next | "i like") from fruit bigram counts: 2/4, 1/4, 1/4 */
export const NEXT_AFTER_I_LIKE = {
  labels: ['apple', 'banana', 'mango'],
  probs: [0.5, 0.25, 0.25],
};

export type AnimBaseProps = {
  paused?: boolean;
  step?: number;
  onStepChange?: (step: number) => void;
};
