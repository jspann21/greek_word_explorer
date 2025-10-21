export function interpretPosTag(tag: string): string {
  if (!tag) return '';
  // Very lightweight placeholder; expand with full grammar later
  const map: Record<string, string> = {
    NNSM: 'Noun, Nominative Singular Masculine',
    NGSM: 'Noun, Genitive Singular Masculine',
    NASF: 'Noun, Accusative Singular Feminine',
    P: 'Preposition',
    CLN: 'Conjunction',
  };
  return map[tag] ?? tag;
}


