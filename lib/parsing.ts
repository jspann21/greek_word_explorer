export function interpretPosTag(tag: string): string {
  if (!tag) return '';

  // Hardcoded broad classes
  if (tag === 'P') return 'Preposition';
  if (tag.startsWith('C')) return 'Conjunction';
  if (tag.startsWith('T')) return 'Particle';
  if (tag.startsWith('I')) return 'Interjection';

  let result = [];

  // POS
  const posIndicator = tag.substring(0, 1);
  const isVerb = posIndicator === 'V';
  let isNounAdjectiveArticle = false;

  if (posIndicator === 'N') { result.push('Noun'); isNounAdjectiveArticle = true; }
  else if (posIndicator === 'J' || posIndicator === 'A') { result.push('Adjective'); isNounAdjectiveArticle = true; }
  else if (posIndicator === 'D') { result.push('Definite Article'); isNounAdjectiveArticle = true; }
  else if (posIndicator === 'V') { result.push('Verb'); }
  else if (posIndicator === 'R') {
    const pronounType = tag.substring(1, 2);
    if (pronounType === 'P') result.push('Personal Pronoun');
    else if (pronounType === 'R') result.push('Relative Pronoun');
    else if (pronounType === 'D') result.push('Demonstrative Pronoun');
    else if (pronounType === 'I') result.push('Interrogative Pronoun');
    else if (pronounType === 'X') result.push('Indefinite Pronoun');
    else result.push('Pronoun');
    isNounAdjectiveArticle = true;
  }

  // Verb processing
  if (isVerb && tag.length >= 4) {
    const tense = tag.charAt(1);
    const voice = tag.charAt(2);
    const mood = tag.charAt(3);

    const tenseMap: Record<string, string> = { P: 'Present', I: 'Imperfect', F: 'Future', A: 'Aorist', X: 'Perfect', Y: 'Pluperfect' };
    const voiceMap: Record<string, string> = { A: 'Active', M: 'Middle', P: 'Passive', D: 'Deponent', E: 'Middle/Passive' };
    const moodMap: Record<string, string> = { I: 'Indicative', D: 'Imperative', S: 'Subjunctive', O: 'Optative', N: 'Infinitive', P: 'Participle' };

    if (tenseMap[tense]) result.push(tenseMap[tense]);
    if (voiceMap[voice]) result.push(voiceMap[voice]);
    if (moodMap[mood]) result.push(moodMap[mood]);

    if (mood === 'P' && tag.length >= 7) {
      // Participle has case, number, gender
      const caseCode = tag.charAt(4);
      const numCode = tag.charAt(5);
      const genCode = tag.charAt(6);
      isNounAdjectiveArticle = true;
      tag = 'V' + tag.substring(1, 4) + caseCode + numCode + genCode; // normalize for logic below
    } else if (tag.length >= 6) {
      // finite verb
      const person = tag.charAt(4);
      const number = tag.charAt(5);
      if (['1', '2', '3'].includes(person)) result.push(person + (person === '1' ? 'st' : person === '2' ? 'nd' : 'rd') + ' Person');
      if (number === 'S') result.push('Singular');
      else if (number === 'P') result.push('Plural');
    }
  }

  // Noun, Adjective, Article, Pronoun, Participle processing
  // These all end with Case, Number, Gender (usually last 3 chars or after prefix)
  if (isNounAdjectiveArticle) {
    let suffix = tag;
    if (posIndicator === 'R' && tag.length > 2) suffix = tag.substring(3); // e.g. RR-ASF (wait, RR-ASF has a dash)
    if (tag.includes('-')) suffix = tag.split('-')[1];
    else if (posIndicator === 'R') suffix = tag.substring(2);
    else if (posIndicator === 'N' || posIndicator === 'J' || posIndicator === 'A' || posIndicator === 'D') suffix = tag.substring(1);
    else if (isVerb && tag.length >= 7) suffix = tag.substring(4); // from participle logic above

    if (suffix && suffix.length >= 3) {
      const caseCode = suffix.charAt(0);
      const numCode = suffix.charAt(1);
      const genCode = suffix.charAt(2);

      const caseMap: Record<string, string> = { N: 'Nominative', G: 'Genitive', D: 'Dative', A: 'Accusative', V: 'Vocative' };
      const numMap: Record<string, string> = { S: 'Singular', P: 'Plural' };
      const genMap: Record<string, string> = { M: 'Masculine', F: 'Feminine', N: 'Neuter' };

      if (caseMap[caseCode]) result.push(caseMap[caseCode]);
      if (numMap[numCode]) result.push(numMap[numCode]);
      if (genMap[genCode]) result.push(genMap[genCode]);
    }
  }

  return result.length > 0 ? result.join(', ') : tag;
}


