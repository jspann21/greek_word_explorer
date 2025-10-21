'use client';

import { useState } from 'react';
import type { Paragraph } from '@/lib/types';
import { useSelection } from '@/components/providers/SelectionProvider';

export default function TextPanel({ paragraphs }: { paragraphs: Paragraph[] }) {
  const [currentVerse, setCurrentVerse] = useState<string>('');
  const { selectedWordId, setSelectedWordId } = useSelection();
  
  return (
    <div className="flex-1 bg-white border-r shadow-sm overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-12">
        <div className="greek-text space-y-6">
          {paragraphs.map((paragraph, pIdx) => (
            <p key={pIdx} className="text-justify leading-relaxed">
              {paragraph.map((word) => {
                const isSelected = selectedWordId === word.word_id;
                const showVerse = word.verse !== currentVerse;
                
                return (
                  <span key={word.word_id} className="inline-block">
                    {showVerse && (
                      <sup 
                        className="verse-number"
                        onMouseEnter={() => setCurrentVerse(word.verse)}
                      >
                        {word.verse}
                      </sup>
                    )}
                    <span
                      onClick={() => setSelectedWordId(word.word_id)}
                      className={`greek-word ${isSelected ? 'greek-word-selected' : ''}`}
                    >
                      {word.text}
                    </span>
                    {' '}
                  </span>
                );
              })}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}


