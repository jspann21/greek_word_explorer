'use client';

import { useEffect, useState } from 'react';
import { useDatabase } from '@/hooks/useDatabase';
import type { WordRow } from '@/lib/types';
import WordDetailWidget from './WordDetailWidget';
import LemmaDistWidget from './LemmaDistWidget';
import ConcordanceWidget from './ConcordanceWidget';
import CollocationWidget from './CollocationWidget';
import { useSelection } from '@/components/providers/SelectionProvider';
import { MousePointerClick, X } from 'lucide-react';

export default function AnalysisPanel() {
  const { query } = useDatabase();
  const { selectedWordId, setSelectedWordId } = useSelection();
  const [word, setWord] = useState<WordRow | null>(null);

  useEffect(() => {
    if (!selectedWordId) { setWord(null); return; }
    const rows = query<WordRow>('SELECT * FROM words WHERE id = ?', [selectedWordId]);
    setWord(rows[0] ?? null);
  }, [selectedWordId, query]);

  if (!word) {
    return (
      <aside className="w-[350px] lg:w-[450px] bg-muted/10 border-l border-border overflow-y-auto hidden md:block h-full">
        <div className="flex flex-col items-center justify-center h-full text-center px-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 ring-1 ring-primary/20">
            <MousePointerClick className="w-8 h-8 text-primary/60" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">Select a Word</h3>
          <p className="text-sm text-muted-foreground max-w-[250px] leading-relaxed">
            Click on any Greek word in the text to view detailed grammatical analysis, charts, and usage statistics.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full h-[45vh] md:h-full md:w-[350px] lg:w-[450px] bg-background border-t md:border-t-0 md:border-l border-border overflow-y-auto shadow-[-10px_0_20px_-10px_rgba(0,0,0,0.05)] z-20 flex flex-col">
      <div className="p-6 space-y-6 relative flex-1">
        <button
          onClick={() => setSelectedWordId(null)}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground md:hidden bg-background/80 backdrop-blur-sm rounded-full border border-border/50 shadow-sm z-30"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <WordDetailWidget word={word} />
        <LemmaDistWidget lemma={word.lemma} />
        <CollocationWidget lemma={word.lemma} />
        <ConcordanceWidget lemma={word.lemma} pos_tag={word.pos_tag} />
      </div>
    </aside>
  );
}
