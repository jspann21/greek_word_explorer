'use client';

import { useSelection } from '@/components/providers/SelectionProvider';
import type { Paragraph } from '@/lib/types';

export default function TextPanel({ paragraphs }: { paragraphs: Paragraph[] }) {
  const { selectedWordId, setSelectedWordId } = useSelection();
  
  // We use a local variable to track the last seen verse number during render.
  // This ensures verse numbers are only displayed when they change.
  let lastVerse = '';

  return (
    <div className="flex-1 bg-background border-r border-border overflow-y-auto">
      <div className="w-full max-w-3xl mx-auto px-6 py-12 sm:px-10 sm:py-16">
        <div className="greek-text space-y-8">
          {paragraphs.map((paragraph, pIdx) => (
            <p key={pIdx} className="text-justify leading-loose">
              {paragraph.map((word) => {
                const isSelected = selectedWordId === word.word_id;
                const showVerse = word.verse !== lastVerse;
                if (showVerse) {
                  lastVerse = word.verse;
                }
                
                return (
                  <span key={word.word_id} className="inline-block">
                    {showVerse && (
                      <sup className="verse-number select-none text-[0.65em] font-bold text-muted-foreground/60 mr-1 align-top tracking-tighter">
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
