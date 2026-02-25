import test from 'node:test';
import assert from 'node:assert';
import { interpretPosTag, getWordDetailData } from './parsing.ts';
import type { WordRow } from './types.ts';

test('getWordDetailData', () => {
  const mockWord: WordRow = {
    id: 1,
    book_id: 'MAT',
    book_name: 'Matthew',
    chapter: 1,
    verse: 1,
    word_form: 'Βίβλος',
    lemma: 'βίβλος',
    pos_tag: 'N-NSF',
    gloss: 'book',
    strongs: '976',
    louw: '33.38'
  };

  const data = getWordDetailData(mockWord);

  assert.strictEqual(data.reference, 'Matthew 1:1');
  assert.strictEqual(data.strongsDisplay, 'G976');
  assert.strictEqual(data.wordForm, 'Βίβλος');
  assert.strictEqual(data.lemma, 'βίβλος');
  assert.strictEqual(data.gloss, 'book');
  assert.strictEqual(data.posTag, 'N-NSF');
  assert.strictEqual(data.posDescription, 'Noun, Nominative, Singular, Feminine');

  // Test missing strongs
  const wordWithoutStrongs = { ...mockWord, strongs: '' };
  const data2 = getWordDetailData(wordWithoutStrongs);
  assert.strictEqual(data2.strongsDisplay, null);
});

test('interpretPosTag - Verbs', async (t) => {
  await t.test('Finite verb: V-AAI-3S', () => {
    // Current implementation might fail on this if it doesn't handle dashes
    // But let's test what it SHOULD be if we fix it or use the correct format
    assert.strictEqual(interpretPosTag('VAAI3S'), 'Verb, Aorist, Active, Indicative, 3rd Person, Singular');
  });

  await t.test('Participle: V-PAP-SNM', () => {
    // V, P(resent), A(ctive), P(articiple), -(no person), S(ingular), N(ominative), M(asculine)
    assert.strictEqual(interpretPosTag('VPAP-SNM'), 'Verb, Present, Active, Participle, Nominative, Singular, Masculine');
  });

  await t.test('Verb with dashes: V-AAI-3S', () => {
    // Testing robustness to dashes
    assert.strictEqual(interpretPosTag('V-AAI-3S'), 'Verb, Aorist, Active, Indicative, 3rd Person, Singular');
  });
});

test('interpretPosTag - Nouns, Adjectives, Articles', async (t) => {
  await t.test('Noun: N-NSM', () => {
    assert.strictEqual(interpretPosTag('NNSM'), 'Noun, Nominative, Singular, Masculine');
  });

  await t.test('Noun with dash: N-NSM', () => {
    assert.strictEqual(interpretPosTag('N-NSM'), 'Noun, Nominative, Singular, Masculine');
  });

  await t.test('Adjective with degree: J-NSM-C', () => {
    assert.strictEqual(interpretPosTag('JNSMC'), 'Adjective, Nominative, Singular, Masculine, Comparative');
  });

  await t.test('Definite Article: D-ASM', () => {
    assert.strictEqual(interpretPosTag('DASM'), 'Definite Article, Accusative, Singular, Masculine');
  });
});

test('interpretPosTag - Pronouns', async (t) => {
  await t.test('Personal Pronoun: RP-1NS', () => {
    // R, P(ersonal), 1(st person), N(ominative), S(ingular)
    assert.strictEqual(interpretPosTag('RP1NS'), 'Personal Pronoun, 1st Person, Nominative, Singular');
  });

  await t.test('Relative Pronoun: RR-NSF', () => {
    assert.strictEqual(interpretPosTag('RRNSF'), 'Relative Pronoun, Nominative, Singular, Feminine');
  });
});

test('interpretPosTag - Conjunctions', async (t) => {
  await t.test('Logical Conjunction: CLN', () => {
    // C, L(ogical), N(connective)
    assert.strictEqual(interpretPosTag('CLN'), 'Conjunction, Logical, Connective');
  });

  await t.test('Adverbial Conjunction: CAZ', () => {
    // C, A(dverbial), Z(causal)
    assert.strictEqual(interpretPosTag('CAZ'), 'Conjunction, Adverbial, Causal');
  });
});

test('interpretPosTag - Adverbs and Particles', async (t) => {
  await t.test('Negative Adverb: BN', () => {
    assert.strictEqual(interpretPosTag('BN'), 'Adverb, Negative');
  });

  await t.test('Interrogative Particle: TI', () => {
    assert.strictEqual(interpretPosTag('TI'), 'Particle, Interrogative');
  });
});

test('interpretPosTag - Edge Cases', async (t) => {
  await t.test('Empty tag', () => {
    assert.strictEqual(interpretPosTag(''), '');
  });

  await t.test('Single character tag', () => {
    assert.strictEqual(interpretPosTag('P'), 'Preposition');
  });

  await t.test('Unknown tag', () => {
    assert.strictEqual(interpretPosTag('Z'), 'Z');
  });
});
