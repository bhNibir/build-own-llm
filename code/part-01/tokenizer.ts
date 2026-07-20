export function tokenize(sentence: string): string[] {
  return sentence.toLowerCase().trim().split(/\s+/);
}
