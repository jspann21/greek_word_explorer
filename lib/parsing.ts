import type { WordRow } from './types';

const P_TYPE_MAP: Record<string, string> = {
  R: 'Relative Pronoun',
  C: 'Reciprocal Pronoun',
  D: 'Demonstrative Pronoun',
  K: 'Correlative Pronoun',
  I: 'Interrogative Pronoun',
  X: 'Indefinite Pronoun',
  F: 'Reflexive Pronoun',
  S: 'Possessive Pronoun',
  P: 'Personal Pronoun'
};

const L_MAP: Record<string, string> = {
  A: 'Ascensive',
  N: 'Connective',
  C: 'Contrastive',
  K: 'Correlative',
  D: 'Disjunctive',
  M: 'Emphatic',
  X: 'Explanatory',
  I: 'Inferential',
  T: 'Transitional'
};

const A_MAP: Record<string, string> = {
  Z: 'Causal',
  M: 'Comparative',
  N: 'Concessive',
  C: 'Conditional',
  D: 'Declarative',
  L: 'Local',
  P: 'Purpose',
  R: 'Result',
  T: 'Temporal'
};

const S_MAP: Record<string, string> = {
  C: 'Content',
  E: 'Epexegetical'
};

const SUB_MAP: Record<string, string> = {
  C: 'Conditional',
  K: 'Correlative',
  E: 'Emphatic',
  X: 'Indefinite',
  I: 'Interrogative',
  N: 'Negative',
  P: 'Place',
  S: 'Superlative'
};

const X_MAP: Record<string, string> = {
  L: 'Letter',
  P: 'Proper Noun',
  N: 'Numeral',
  F: 'Foreign Word',
  O: 'Other'
};

const TENSE_MAP: Record<string, string> = {
  P: 'Present',
  I: 'Imperfect',
  F: 'Future',
  T: 'Future-Perfect',
  A: 'Aorist',
  R: 'Perfect',
  L: 'Pluperfect'
};

const VOICE_MAP: Record<string, string> = {
  A: 'Active',
  M: 'Middle',
  P: 'Passive',
  U: 'Middle or Passive'
};

const MOOD_MAP: Record<string, string> = {
  I: 'Indicative',
  M: 'Imperative',
  S: 'Subjunctive',
  O: 'Optative',
  N: 'Infinitive',
  P: 'Participle'
};

const CASE_MAP: Record<string, string> = {
  N: 'Nominative',
  G: 'Genitive',
  D: 'Dative',
  A: 'Accusative',
  V: 'Vocative'
};

const NUM_MAP: Record<string, string> = {
  S: 'Singular',
  P: 'Plural',
  D: 'Dual'
};

const GEN_MAP: Record<string, string> = {
  M: 'Masculine',
  F: 'Feminine',
  N: 'Neuter'
};

const PERSON_VALUES: string[] = ['1', '2', '3'];

export function getWordDetailData(word: WordRow) {
  const strongs = word.strongs.trim();

  return {
    reference: `${word.book_name} ${word.chapter}:${word.verse}`,
    strongsDisplay: strongs ? `G${strongs}` : null,
    wordForm: word.word_form,
    lemma: word.lemma,
    gloss: word.gloss,
    posTag: word.pos_tag,
    posDescription: interpretPosTag(word.pos_tag)
  };
}

export function interpretPosTag(rawTag: string): string {
  if (!rawTag.trim()) return '';

  return rawTag
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map(interpretSingleTag)
    .filter(Boolean)
    .join('; ');
}

function interpretSingleTag(rawTag: string): string {
  const trimmedTag = rawTag.trim();
  if (!trimmedTag) return '';

  // Normalize by removing dashes
  const tag = trimmedTag.toUpperCase().replace(/-/g, '');
  if (!tag) return trimmedTag;

  const posIndicator = tag.charAt(0);

  if (posIndicator === 'P' && tag.length === 1) return 'Preposition';
  if (posIndicator === 'I' && tag.length === 1) return 'Interjection';

  let result: string[] = [];
  let caseCode = '', numCode = '', genCode = '', degree = '';

  // POS Identification
  let isVerb = false;
  let isNounAdjectiveArticle = false;

  if (posIndicator === 'N') { result.push('Noun'); isNounAdjectiveArticle = true; }
  else if (posIndicator === 'J' || posIndicator === 'A') { result.push('Adjective'); isNounAdjectiveArticle = true; }
  else if (posIndicator === 'D') { result.push('Definite Article'); isNounAdjectiveArticle = true; }
  else if (posIndicator === 'V') { result.push('Verb'); isVerb = true; }
  else if (posIndicator === 'R') {
    const pronounType = tag.charAt(1);
    result.push(P_TYPE_MAP[pronounType] || 'Pronoun');

    let nextIdx = 2;
    if (tag.length > nextIdx) {
      const person = tag.charAt(nextIdx);
      if (PERSON_VALUES.includes(person)) {
        result.push(person + (person === '1' ? 'st' : person === '2' ? 'nd' : 'rd') + ' Person');
        nextIdx++;
      }
    }
    if (tag.length > nextIdx) caseCode = tag.charAt(nextIdx++);
    if (tag.length > nextIdx) numCode = tag.charAt(nextIdx++);
    if (tag.length > nextIdx) genCode = tag.charAt(nextIdx++);

    if (pronounType === 'P' && tag.length > nextIdx) {
      const subType = tag.charAt(nextIdx);
      if (subType === 'A') result.push('intensive Attributive');
      else if (subType === 'P') result.push('intensive Predicative');
    }
  }
  else if (posIndicator === 'C') {
    result.push('Conjunction');
    if (tag.length >= 3) {
      const type = tag.charAt(1);
      const subType = tag.charAt(2);

      if (type === 'L') {
        result.push('Logical');
        if (L_MAP[subType]) result.push(L_MAP[subType]);
      } else if (type === 'A') {
        result.push('Adverbial');
        if (A_MAP[subType]) result.push(A_MAP[subType]);
      } else if (type === 'S') {
        result.push('Substantival');
        if (S_MAP[subType]) result.push(S_MAP[subType]);
      }
    }
  }
  else if (posIndicator === 'B' || posIndicator === 'T') {
    result.push(posIndicator === 'B' ? 'Adverb' : 'Particle');
    if (tag.length >= 2) {
      const subType = tag.charAt(1);
      if (SUB_MAP[subType]) result.push(SUB_MAP[subType]);
    }
  }
  else if (posIndicator === 'X') {
    result.push('Indeclinable');
    if (tag.length >= 2) {
      const subType = tag.charAt(1);
      if (X_MAP[subType]) result.push(X_MAP[subType]);
    }
  }

  // Verb processing
  if (isVerb && tag.length >= 4) {
    const tense = tag.charAt(1);
    const voice = tag.charAt(2);
    const mood = tag.charAt(3);

    if (TENSE_MAP[tense]) result.push(TENSE_MAP[tense]);
    if (VOICE_MAP[voice]) result.push(VOICE_MAP[voice]);
    if (MOOD_MAP[mood]) result.push(MOOD_MAP[mood]);

    let nextIdx = 4;
    if (tag.length > nextIdx) {
      const person = tag.charAt(nextIdx);
      if (PERSON_VALUES.includes(person)) {
        result.push(person + (person === '1' ? 'st' : person === '2' ? 'nd' : 'rd') + ' Person');
        nextIdx++;
      }
    }
    if (tag.length > nextIdx) numCode = tag.charAt(nextIdx++);
    if (tag.length > nextIdx) caseCode = tag.charAt(nextIdx++);
    if (tag.length > nextIdx) genCode = tag.charAt(nextIdx++);
  }

  // Noun, Adjective, Article processing
  if (isNounAdjectiveArticle) {
    if (tag.length >= 4) {
      caseCode = tag.charAt(1);
      numCode = tag.charAt(2);
      genCode = tag.charAt(3);
    }
    if ((posIndicator === 'J' || posIndicator === 'A') && tag.length >= 5) {
      const degreeCode = tag.charAt(4);
      const degreeMap: Record<string, string> = { C: 'Comparative', S: 'Superlative', O: 'Other' };
      degree = degreeMap[degreeCode] || '';
    }
  }

  // Common mapping for case, number, and gender
  if (caseCode) {
    if (CASE_MAP[caseCode]) result.push(CASE_MAP[caseCode]);
  }
  if (numCode) {
    if (NUM_MAP[numCode]) result.push(NUM_MAP[numCode]);
  }
  if (genCode) {
    if (GEN_MAP[genCode]) result.push(GEN_MAP[genCode]);
  }
  if (degree) {
    result.push(degree);
  }

  return result.length > 0 ? result.join(', ') : trimmedTag;
}
