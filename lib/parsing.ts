const caseMap: Record<string, string> = { 'N': 'Nominative', 'G': 'Genitive', 'D': 'Dative', 'A': 'Accusative', 'V': 'Vocative' };
const numberMap: Record<string, string> = { 'S': 'Singular', 'P': 'Plural', 'D': 'Dual' };
const genderMap: Record<string, string> = { 'M': 'Masculine', 'F': 'Feminine', 'N': 'Neuter' };
const personMap: Record<string, string> = { '1': '1st Person', '2': '2nd Person', '3': '3rd Person' };

export function interpretPosTag(tag: string): string {
  if (!tag) return 'No POS data available';

  const partOfSpeech = tag.charAt(0);
  const details = tag.slice(1);

  let posDescription: string;
  let additionalInfo = '';

  switch (partOfSpeech) {
    case 'N': // Noun
      posDescription = 'Noun';
      additionalInfo = interpretCaseNumberGender(details);
      break;
    case 'V': // Verb
      posDescription = 'Verb';
      additionalInfo = interpretVerbDetails(details);
      break;
    case 'J': // Adjective
      posDescription = 'Adjective';
      additionalInfo = interpretAdjectiveDetails(details);
      break;
    case 'R': // Pronoun
      posDescription = 'Pronoun';
      additionalInfo = interpretPronounDetails(details);
      break;
    case 'D': // Definite article
      posDescription = 'Definite Article';
      additionalInfo = interpretCaseNumberGender(details);
      break;
    case 'C': // Conjunction
      posDescription = 'Conjunction';
      additionalInfo = interpretConjunctionDetails(details);
      break;
    case 'B': // Adverb
      posDescription = 'Adverb';
      additionalInfo = interpretAdverbDetails(details);
      break;
    case 'T': // Particle
      posDescription = 'Particle';
      additionalInfo = interpretParticleDetails(details);
      break;
    case 'P': // Preposition
      posDescription = 'Preposition';
      break;
    case 'I': // Interjection
      posDescription = 'Interjection';
      break;
    case 'X': // Indeclinable
      posDescription = 'Indeclinable';
      additionalInfo = interpretIndeclinableDetails(details);
      break;
    default:
      posDescription = 'Unknown Part of Speech';
  }

  return `${posDescription}${additionalInfo ? ' - ' + additionalInfo : ''}`;
}

function interpretCaseNumberGender(details: string): string {
  const caseValue = caseMap[details.charAt(0)] || '';
  const numberValue = numberMap[details.charAt(1)] || '';
  const genderValue = genderMap[details.charAt(2)] || '';

  return [caseValue, numberValue, genderValue].filter(Boolean).join(', ');
}

function interpretAdjectiveDetails(details: string): string {
  const caseNumberGender = interpretCaseNumberGender(details);
  const degreeMap: Record<string, string> = { 'C': 'Comparative', 'S': 'Superlative', 'O': 'Other' };

  const degree = degreeMap[details.charAt(3)] || '';

  return [caseNumberGender, degree].filter(Boolean).join(', ');
}

function interpretVerbDetails(details: string): string {
  const tenseMap: Record<string, string> = {
    'P': 'Present',
    'I': 'Imperfect',
    'F': 'Future',
    'T': 'Future-perfect',
    'A': 'Aorist',
    'R': 'Perfect',
    'L': 'Pluperfect'
  };
  const voiceMap: Record<string, string> = { 'A': 'Active', 'M': 'Middle', 'P': 'Passive', 'U': 'Middle-Passive' };
  const moodMap: Record<string, string> = {
    'I': 'Indicative',
    'S': 'Subjunctive',
    'O': 'Optative',
    'M': 'Imperative',
    'N': 'Infinitive',
    'P': 'Participle'
  };

  const tense = tenseMap[details.charAt(0)] || '';
  const voice = voiceMap[details.charAt(1)] || '';
  const mood = moodMap[details.charAt(2)] || '';
  const person = personMap[details.charAt(3)] || '';
  const number = numberMap[details.charAt(4)] || '';

  // For participles and other forms, Case and Gender can follow
  const caseValue = caseMap[details.charAt(5)] || '';
  const genderValue = genderMap[details.charAt(6)] || '';

  return [tense, voice, mood, person, number, caseValue, genderValue].filter(Boolean).join(', ');
}

function interpretPronounDetails(details: string): string {
  const pronounTypeMap: Record<string, string> = {
    'R': 'Relative', 'C': 'Reciprocal', 'D': 'Demonstrative', 'K': 'Correlative',
    'I': 'Interrogative', 'X': 'Indefinite', 'F': 'Reflexive', 'S': 'Possessive', 'P': 'Personal'
  };

  const pronounSubtypeMap: Record<string, string> = { 'A': 'Intensive Attributive', 'P': 'Intensive Predicative' };

  const pronounType = pronounTypeMap[details.charAt(0)] || '';
  const person = personMap[details.charAt(1)] || '';
  const caseNumberGender = interpretCaseNumberGender(details.slice(2));
  const pronounSubtype = pronounSubtypeMap[details.charAt(5)] || '';

  return [pronounType, person, caseNumberGender, pronounSubtype].filter(Boolean).join(', ');
}

function interpretConjunctionDetails(details: string): string {
  const conjunctionTypeMap: Record<string, string> = { 'L': 'Logical', 'A': 'Adverbial', 'S': 'Substantival' };

  const logicalSubtypeMap: Record<string, string> = {
    'A': 'Ascensive',
    'N': 'Connective',
    'C': 'Contrastive',
    'K': 'Correlative',
    'D': 'Disjunctive',
    'M': 'Emphatic',
    'X': 'Explanatory',
    'I': 'Inferential',
    'T': 'Transitional'
  };
  const adverbialSubtypeMap: Record<string, string> = {
    'Z': 'Causal',
    'M': 'Comparative',
    'N': 'Concessive',
    'C': 'Conditional',
    'D': 'Declarative',
    'L': 'Local',
    'P': 'Purpose',
    'R': 'Result',
    'T': 'Temporal'
  };
  const substantivalSubtypeMap: Record<string, string> = { 'C': 'Content', 'E': 'Epexegetical' };

  const conjunctionType = conjunctionTypeMap[details.charAt(0)] || '';
  let conjunctionSubtype = '';

  if (conjunctionType === 'Logical') {
    conjunctionSubtype = logicalSubtypeMap[details.charAt(1)] || '';
  } else if (conjunctionType === 'Adverbial') {
    conjunctionSubtype = adverbialSubtypeMap[details.charAt(1)] || '';
  } else if (conjunctionType === 'Substantival') {
    conjunctionSubtype = substantivalSubtypeMap[details.charAt(1)] || '';
  }

  return [conjunctionType, conjunctionSubtype].filter(Boolean).join(', ');
}

function interpretAdverbDetails(details: string): string {
  const adverbTypeMap: Record<string, string> = {
    'C': 'Conditional',
    'K': 'Correlative',
    'E': 'Emphatic',
    'X': 'Indefinite',
    'I': 'Interrogative',
    'N': 'Negative',
    'P': 'Place',
    'S': 'Superlative'
  };

  return adverbTypeMap[details.charAt(0)] || '';
}

function interpretParticleDetails(details: string): string {
  return interpretAdverbDetails(details);
}

function interpretIndeclinableDetails(details: string): string {
  const indeclinableTypeMap: Record<string, string> = { 'L': 'Letter', 'P': 'Proper Noun', 'N': 'Numeral', 'F': 'Foreign Word', 'O': 'Other' };

  return indeclinableTypeMap[details.charAt(0)] || '';
}
