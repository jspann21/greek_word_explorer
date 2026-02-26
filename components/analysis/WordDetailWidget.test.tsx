/**
 * @file WordDetailWidget.test.tsx
 *
 * This component test file demonstrates how to test WordDetailWidget.
 *
 * Note: Full component rendering tests (using React Testing Library) are currently
 * skipped in this environment due to the absence of a DOM environment and
 * JSX support in the built-in node:test runner.
 *
 * However, the core rendering logic of this component has been extracted to
 * `getWordDetailData` in `lib/parsing.ts` and is fully covered by unit tests
 * in `lib/parsing.test.ts`.
 */

import test from 'node:test';
import assert from 'node:assert';
import { getWordDetailData } from '../../lib/parsing.ts';
import type { WordRow } from '../../lib/types.ts';

test('WordDetailWidget Logic (via getWordDetailData)', () => {
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

  // Verifying the data that the component will display
  assert.strictEqual(data.reference, 'Matthew 1:1');
  assert.strictEqual(data.strongsDisplay, 'G976');
  assert.strictEqual(data.wordForm, 'Βίβλος');
  assert.strictEqual(data.posDescription, 'Noun, Nominative, Singular, Feminine');
});

/*
// Example of what a full component test would look like with the right environment:

import { render, screen } from '@testing-library/react';
import WordDetailWidget from './WordDetailWidget';

describe('WordDetailWidget Component', () => {
  it('renders all word details correctly', () => {
    render(<WordDetailWidget word={mockWord} />);
    expect(screen.getByText('Βίβλος')).toBeInTheDocument();
    expect(screen.getByText('Matthew 1:1')).toBeInTheDocument();
    expect(screen.getByText('Noun, Nominative, Singular, Feminine')).toBeInTheDocument();
  });
});
*/
