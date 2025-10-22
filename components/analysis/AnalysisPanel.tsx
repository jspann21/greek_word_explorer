'use client';

import { useEffect, useState } from 'react';
import { useDatabase } from '@/hooks/useDatabase';
import type { WordRow } from '@/lib/types';
import WordDetailWidget from './WordDetailWidget';
import LemmaDistWidget from './LemmaDistWidget';
import ConcordanceWidget from './ConcordanceWidget';
import CollocationWidget from './CollocationWidget';
import { useSelection } from '@/components/providers/SelectionProvider';

export default function AnalysisPanel() {
  const { query } = useDatabase();
  const { selectedWordId } = useSelection();
  const [word, setWord] = useState<WordRow | null>(null);

  useEffect(() => {
    if (!selectedWordId) { setWord(null); return; }
    const rows = query<WordRow>('SELECT * FROM words WHERE id = ?', [selectedWordId]);
    setWord(rows[0] ?? null);
  }, [selectedWordId, query]);

  if (!word) {
    return (
      <aside className="w-[520px] bg-gradient-to-br from-slate-50 to-blue-50 overflow-y-auto p-8">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-foreground/80 mb-2">Select a Word</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Click on any Greek word in the text to view detailed grammatical analysis and usage statistics.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-[520px] bg-white overflow-y-auto">
      <div className="p-6 space-y-6">
        <WordDetailWidget word={word} />
        <LemmaDistWidget lemma={word.lemma} />
        <CollocationWidget lemma={word.lemma} />
        <ConcordanceWidget lemma={word.lemma} pos_tag={word.pos_tag} />
      </div>
    </aside>
  );
}


