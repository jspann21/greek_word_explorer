import { test } from 'node:test';
import assert from 'node:assert';
import { interpretPosTag } from './parsing.ts';

test('interpretPosTag maps known tags', () => {
  assert.strictEqual(interpretPosTag('NNSM'), 'Noun, Nominative Singular Masculine');
  assert.strictEqual(interpretPosTag('NGSM'), 'Noun, Genitive Singular Masculine');
  assert.strictEqual(interpretPosTag('NASF'), 'Noun, Accusative Singular Feminine');
  assert.strictEqual(interpretPosTag('P'), 'Preposition');
  assert.strictEqual(interpretPosTag('CLN'), 'Conjunction');
});

test('interpretPosTag returns tag for unknown tags', () => {
  assert.strictEqual(interpretPosTag('XYZ'), 'XYZ');
});

test('interpretPosTag returns empty string for empty input', () => {
  assert.strictEqual(interpretPosTag(''), '');
});
