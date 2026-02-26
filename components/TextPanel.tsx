'use client';

import { memo } from 'react';
import { useSelection } from '@/components/providers/SelectionProvider';
import type { Paragraph, TextWord } from '@/lib/types';

const GreekWord = memo(({
  word,
  isSelected,
  onClick
}: {
  word: TextWord;
  isSelected: boolean;
  onClick: (id: number) => void;
}) => {
  return (
    <span className="inline-block">
      {word.verse && (
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
      {' '}
    </span>
  );
});

GreekWord.displayName = 'GreekWord';

export default function TextPanel({ paragraphs }: { paragraphs: Paragraph[] }) {
  const { selectedWordId, setSelectedWordId } = useSelection();

  return (
    <div className="flex-1 bg-background border-r border-border overflow-y-auto">
      <div className="w-full max-w-3xl mx-auto px-6 py-12 sm:px-10 sm:py-16">
        <div className="greek-text space-y-8">
          {paragraphs.map((paragraph, pIdx) => (
            <p key={pIdx} className="text-justify leading-loose">
              {paragraph.map((word) => (
                <GreekWord
                  key={word.word_id}
                  word={word}
                  isSelected={selectedWordId === word.word_id}
                  onClick={setSelectedWordId}
                />
              ))}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
