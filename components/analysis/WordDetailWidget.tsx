'use client';

import type { WordRow } from '@/lib/types';
import { interpretPosTag } from '@/lib/parsing';

export default function WordDetailWidget({ word }: { word: WordRow }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-1 rounded-md">
          {word.book_name} {word.chapter}:{word.verse}
        </span>
        {word.strongs && (
          <span className="font-mono text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded border border-border">
            G{word.strongs}
          </span>
        )}
      </div>

      <div className="text-center mb-8">
        <div className="text-5xl font-serif text-foreground mb-2 leading-tight">
          {word.word_form}
        </div>
        <div className="text-lg text-muted-foreground font-serif italic">
          {word.lemma}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 bg-muted/30 rounded-lg p-3 border border-border/50">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Gloss</div>
          <div className="text-base font-medium text-foreground">{word.gloss}</div>
        </div>

        <div className="col-span-2 bg-muted/30 rounded-lg p-3 border border-border/50">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Morphology</div>
          <div className="flex items-center gap-3">
            <span
              className="px-2 py-1 bg-primary/10 text-primary font-bold text-xs rounded border border-primary/20 cursor-help"
              title={interpretPosTag(word.pos_tag)}
            >
              {word.pos_tag}
            </span>
            <span className="text-sm text-foreground/90">{interpretPosTag(word.pos_tag)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
