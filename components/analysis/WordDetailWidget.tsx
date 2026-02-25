'use client';

import type { WordRow } from '@/lib/types';
import { getWordDetailData } from '@/lib/parsing';

export default function WordDetailWidget({ word }: { word: WordRow }) {
  const data = getWordDetailData(word);

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-1 rounded-md">
          {data.reference}
        </span>
        {data.strongsDisplay && (
          <span className="font-mono text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded border border-border">
            {data.strongsDisplay}
          </span>
        )}
      </div>

      <div className="text-center mb-8">
        <div className="text-5xl font-serif text-foreground mb-2 leading-tight">
          {data.wordForm}
        </div>
        <div className="text-lg text-muted-foreground font-serif italic">
          {data.lemma}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 bg-muted/30 rounded-lg p-3 border border-border/50">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Gloss</div>
          <div className="text-base font-medium text-foreground">{data.gloss}</div>
        </div>

        <div className="col-span-2 bg-muted/30 rounded-lg p-3 border border-border/50">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Morphology</div>
          <div className="flex items-center gap-3">
            <span
              className="px-2 py-1 bg-primary/10 text-primary font-bold text-xs rounded border border-primary/20 cursor-help"
              title={data.posDescription}
            >
              {data.posTag}
            </span>
            <span className="text-sm text-foreground/90">{data.posDescription}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
