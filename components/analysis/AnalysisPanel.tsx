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
      <aside className="border rounded p-4">Select a word to see analysis.</aside>
    );
  }

  return (
    <aside className="space-y-4">
      <WordDetailWidget word={word} />
      <LemmaDistWidget lemma={word.lemma} />
      <ConcordanceWidget lemma={word.lemma} pos_tag={word.pos_tag} />
      <CollocationWidget lemma={word.lemma} />
    </aside>
  );
}


