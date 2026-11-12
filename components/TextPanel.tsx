'use client';

import { Fragment, memo } from 'react';
import { useSelection } from '@/components/providers/SelectionProvider';
import type { Paragraph, TextWord } from '@/lib/types';

const GreekWord = memo(({
  word,
  showVerseNumber,
  isSelected,
  onClick
}: {
  word: TextWord;
  showVerseNumber: boolean;
  isSelected: boolean;
  onClick: (id: number) => void;
}) => {
  return (
    <span className="whitespace-nowrap">
      {showVerseNumber && word.verse && (
        <sup className="verse-number">
          {word.verse}
        </sup>
      )}
      <span
        onClick={() => onClick(word.word_id)}
        className={`greek-word ${isSelected ? 'greek-word-selected' : ''}`}
      >
        {word.text}
      </span>
    </span>
  );
});

GreekWord.displayName = 'GreekWord';

export default function TextPanel({ paragraphs }: { paragraphs: Paragraph[] }) {
  const { selectedWordId, setSelectedWordId } = useSelection();

  return (
    <div className="flex-1 min-w-0 bg-background border-r border-border overflow-y-auto">
      <div className="w-full max-w-3xl mx-auto px-6 py-12 sm:px-10 sm:py-16">
        <div className="greek-text space-y-6" lang="grc">
          {paragraphs.map((paragraph, pIdx) => (
            <p key={pIdx} className="greek-paragraph">
              {paragraph.map((word, wordIdx) => (
                <Fragment key={word.word_id}>
                  {wordIdx > 0 && ' '}
                  <GreekWord
                    word={word}
                    showVerseNumber={wordIdx === 0 || word.verse !== paragraph[wordIdx - 1].verse}
                    isSelected={selectedWordId === word.word_id}
                    onClick={setSelectedWordId}
                  />
                </Fragment>
              ))}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
