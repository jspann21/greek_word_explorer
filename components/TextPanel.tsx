'use client';

import { useState } from 'react';
import type { Paragraph } from '@/lib/types';
import { useSelection } from '@/components/providers/SelectionProvider';

export default function TextPanel({ paragraphs }: { paragraphs: Paragraph[] }) {
  const [currentVerse, setCurrentVerse] = useState<string>('');
  const { setSelectedWordId } = useSelection();
  return (
    <section className="prose max-w-none">
      {paragraphs.map((paragraph, pIdx) => (
        <p key={pIdx} className="mb-4 leading-8">
          {paragraph.map((word) => (
            <span
              key={word.word_id}
              onClick={() => setSelectedWordId(word.word_id)}
              className="cursor-pointer hover:bg-yellow-200 rounded px-0.5"
            >
              {word.verse !== currentVerse && (
                <sup className="mr-1" onMouseEnter={() => setCurrentVerse(word.verse)}>{word.verse}</sup>
              )}
              {word.text}{' '}
            </span>
          ))}
        </p>
      ))}
    </section>
  );
}


