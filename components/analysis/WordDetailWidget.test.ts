import test from 'node:test';
import assert from 'node:assert';
import { getWordDetailData } from '../../lib/parsing.ts';
import type { WordRow } from '../../lib/types.ts';

const baseWord: WordRow = {
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

test('WordDetailWidget display model includes all core fields', () => {
  const data = getWordDetailData(baseWord);

  assert.strictEqual(data.reference, 'Matthew 1:1');
  assert.strictEqual(data.strongsDisplay, 'G976');
  assert.strictEqual(data.wordForm, 'Βίβλος');
  assert.strictEqual(data.lemma, 'βίβλος');
  assert.strictEqual(data.gloss, 'book');
  assert.strictEqual(data.posTag, 'N-NSF');
  assert.strictEqual(data.posDescription, 'Noun, Nominative, Singular, Feminine');
});

test('WordDetailWidget display model handles missing strongs values', () => {
  const noStrongs = { ...baseWord, strongs: '' };
  const whitespaceStrongs = { ...baseWord, strongs: '   ' };

  assert.strictEqual(getWordDetailData(noStrongs).strongsDisplay, null);
  assert.strictEqual(getWordDetailData(whitespaceStrongs).strongsDisplay, null);
});
