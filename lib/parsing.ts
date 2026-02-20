export function interpretPosTag(rawTag: string): string {
  if (!rawTag) return '';
  return rawTag.split(',').map(t => interpretSingleTag(t.trim())).join('; ');
}

function interpretSingleTag(tag: string): string {
  if (!tag) return '';
  if (tag === 'P') return 'Preposition';
  if (tag === 'I') return 'Interjection';

  let result = [];

  // POS
  const posIndicator = tag.charAt(0);
  const isVerb = posIndicator === 'V';
  let isNounAdjectiveArticle = false;
  let caseCode = '', numCode = '', genCode = '';

  if (posIndicator === 'N') { result.push('Noun'); isNounAdjectiveArticle = true; }
  else if (posIndicator === 'J' || posIndicator === 'A') { result.push('Adjective'); isNounAdjectiveArticle = true; }
  else if (posIndicator === 'D') { result.push('Definite Article'); isNounAdjectiveArticle = true; }
  else if (posIndicator === 'V') { result.push('Verb'); }
  else if (posIndicator === 'R') {
    const pronounType = tag.charAt(1);
    const pTypeMap: Record<string, string> = {
      'R': 'Relative Pronoun', 'C': 'Reciprocal Pronoun', 'D': 'Demonstrative Pronoun',
      'K': 'Correlative Pronoun', 'I': 'Interrogative Pronoun', 'X': 'Indefinite Pronoun',
      'F': 'Reflexive Pronoun', 'S': 'Possessive Pronoun', 'P': 'Personal Pronoun'
    };
    result.push(pTypeMap[pronounType] || 'Pronoun');

    if (tag.length >= 3) {
      const person = tag.charAt(2);
      if (['1', '2', '3'].includes(person)) result.push(person + (person === '1' ? 'st' : person === '2' ? 'nd' : 'rd') + ' Person');
    }
    if (tag.length >= 4) caseCode = tag.charAt(3);
    if (tag.length >= 5) numCode = tag.charAt(4);
    if (tag.length >= 6) genCode = tag.charAt(5);

    if (pronounType === 'P' && tag.length >= 7) {
      const subType = tag.charAt(6);
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
        const lMap: Record<string, string> = { 'A': 'Ascensive', 'N': 'Connective', 'C': 'Contrastive', 'K': 'Correlative', 'D': 'Disjunctive', 'M': 'Emphatic', 'X': 'Explanatory', 'I': 'Inferential', 'T': 'Transitional' };
        if (lMap[subType]) result.push(lMap[subType]);
      } else if (type === 'A') {
        result.push('Adverbial');
        const aMap: Record<string, string> = { 'Z': 'Causal', 'M': 'Comparative', 'N': 'Concessive', 'C': 'Conditional', 'D': 'Declarative', 'L': 'Local', 'P': 'Purpose', 'R': 'Result', 'T': 'Temporal' };
        if (aMap[subType]) result.push(aMap[subType]);
      } else if (type === 'S') {
        result.push('Substantival');
        const sMap: Record<string, string> = { 'C': 'Content', 'E': 'Epexegetical' };
        if (sMap[subType]) result.push(sMap[subType]);
      }
    }
  }
  else if (posIndicator === 'B' || posIndicator === 'T') {
    result.push(posIndicator === 'B' ? 'Adverb' : 'Particle');
    if (tag.length >= 2) {
      const subType = tag.charAt(1);
      const subMap: Record<string, string> = { 'C': 'Conditional', 'K': 'Correlative', 'E': 'Emphatic', 'X': 'Indefinite', 'I': 'Interrogative', 'N': 'Negative', 'P': 'Place', 'S': 'Superlative' };
      if (subMap[subType]) result.push(subMap[subType]);
    }
  }
  else if (posIndicator === 'X') {
    result.push('Indeclinable');
    if (tag.length >= 2) {
      const subType = tag.charAt(1);
      const xMap: Record<string, string> = { 'L': 'Letter', 'P': 'Proper Noun', 'N': 'Numeral', 'F': 'Foreign Word', 'O': 'Other' };
      if (xMap[subType]) result.push(xMap[subType]);
    }
  }

  // Verb processing
  if (isVerb && tag.length >= 4) {
    const tense = tag.charAt(1);
    const voice = tag.charAt(2);
    const mood = tag.charAt(3);

    const tenseMap: Record<string, string> = { P: 'Present', I: 'Imperfect', F: 'Future', T: 'Future-Perfect', A: 'Aorist', R: 'Perfect', L: 'Pluperfect' };
    const voiceMap: Record<string, string> = { A: 'Active', M: 'Middle', P: 'Passive', U: 'Middle or Passive' };
    const moodMap: Record<string, string> = { I: 'Indicative', M: 'Imperative', S: 'Subjunctive', O: 'Optative', N: 'Infinitive', P: 'Participle' };

    if (tenseMap[tense]) result.push(tenseMap[tense]);
    if (voiceMap[voice]) result.push(voiceMap[voice]);
    if (moodMap[mood]) result.push(moodMap[mood]);

    if (tag.length >= 5) {
      const person = tag.charAt(4);
      if (['1', '2', '3'].includes(person)) result.push(person + (person === '1' ? 'st' : person === '2' ? 'nd' : 'rd') + ' Person');
    }
    if (tag.length >= 6) {
      numCode = tag.charAt(5);
    }
    if (tag.length >= 7) {
      caseCode = tag.charAt(6);
    }
    if (tag.length >= 8) {
      genCode = tag.charAt(7);
    }
  }

  // Noun, Adjective, Article processing
  if (isNounAdjectiveArticle) {
    if (posIndicator === 'N' || posIndicator === 'J' || posIndicator === 'A' || posIndicator === 'D') {
      if (tag.length >= 4) {
        caseCode = tag.charAt(1);
        numCode = tag.charAt(2);
        genCode = tag.charAt(3);
      }
      if ((posIndicator === 'J' || posIndicator === 'A') && tag.length >= 5) {
        const degree = tag.charAt(4);
        if (degree === 'C') result.push('Comparative');
        else if (degree === 'S') result.push('Superlative');
        else if (degree === 'O') result.push('Other');
      }
    }
  }

  // Common mapping for case, number, and gender
  if (caseCode) {
    const caseMap: Record<string, string> = { N: 'Nominative', G: 'Genitive', D: 'Dative', A: 'Accusative', V: 'Vocative' };
    if (caseMap[caseCode]) result.push(caseMap[caseCode]);
  }
  if (numCode) {
    const numMap: Record<string, string> = { S: 'Singular', P: 'Plural', D: 'Dual' };
    if (numMap[numCode]) result.push(numMap[numCode]);
  }
  if (genCode) {
    const genMap: Record<string, string> = { M: 'Masculine', F: 'Feminine', N: 'Neuter' };
    if (genMap[genCode]) result.push(genMap[genCode]);
  }

  return result.length > 0 ? result.join(', ') : tag;
}
