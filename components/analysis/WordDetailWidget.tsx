'use client';

import type { WordRow } from '@/lib/types';
import { interpretPosTag } from '@/lib/parsing';

export default function WordDetailWidget({ word }: { word: WordRow }) {
  return (
    <div className="bg-gradient-to-br from-primary/5 to-blue-50 border border-primary/20 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {word.book_name} {word.chapter}:{word.verse}
        </div>
        {word.strongs && (
          <div className="px-2 py-1 bg-white/70 rounded text-xs font-mono text-muted-foreground">
            G{word.strongs}
          </div>
        )}
      </div>
      
      <div className="text-4xl font-serif mb-6 text-foreground" style={{ fontFamily: "'Gentium Plus', 'Times New Roman', serif" }}>
        {word.word_form}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[60px]">Lemma</span>
          <span className="text-lg font-medium text-foreground" style={{ fontFamily: "'Gentium Plus', 'Times New Roman', serif" }}>
            {word.lemma}
          </span>
        </div>
        
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[60px]">Gloss</span>
          <span className="text-sm text-foreground/80">{word.gloss}</span>
        </div>
        
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[60px]">Parse</span>
          <span className="text-sm text-foreground/80">{interpretPosTag(word.pos_tag)}</span>
        </div>
      </div>
    </div>
  );
}


