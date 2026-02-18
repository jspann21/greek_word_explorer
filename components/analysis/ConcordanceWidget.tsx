'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDatabase } from '@/hooks/useDatabase';

interface Row { id: number; book_name: string; chapter: number; verse: number; }

export default function ConcordanceWidget({ lemma, pos_tag }: { lemma: string; pos_tag?: string }) {
  const { query } = useDatabase();
  const [rows, setRows] = useState<Row[]>([]);
  const [selectedPos, setSelectedPos] = useState<string>(pos_tag || '');

  useEffect(() => setSelectedPos(pos_tag || ''), [pos_tag]);

  useEffect(() => {
    if (!lemma) { setRows([]); return; }
    const args: any[] = [lemma];
    let sql = 'SELECT id, book_name, chapter, verse FROM words WHERE lemma = ?';
    if (selectedPos) { sql += ' AND pos_tag = ?'; args.push(selectedPos); }
    sql += ' ORDER BY book_name, chapter, verse, id';
    setRows(query<Row>(sql, args));
  }, [lemma, selectedPos, query]);

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Concordance</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Occurrences in context</p>
        </div>
        <div className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
          {rows.length} hits
        </div>
      </div>

      <div className="mb-4">
        <input 
          value={selectedPos} 
          onChange={(e) => setSelectedPos(e.target.value)} 
          className="w-full h-9 rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          placeholder="Filter by POS (e.g., NNSM)" 
        />
      </div>

      <div className="max-h-[400px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {rows.slice(0, 50).map((r) => (
          <ConcordanceRow key={r.id} id={r.id} heading={`${r.book_name} ${r.chapter}:${r.verse}`} />
        ))}
        {rows.length > 50 && (
          <div className="text-xs text-center text-muted-foreground py-3 border-t border-border">
            Showing first 50 of {rows.length} occurrences
          </div>
        )}
      </div>
    </div>
  );
}

function ConcordanceRow({ id, heading }: { id: number; heading: string }) {
  const { query } = useDatabase();
  const context = useMemo(() => {
    const window = 5;
    const minId = id - window;
    const maxId = id + window;
    const words = query<{ id: number; word_form: string }>('SELECT id, word_form FROM words WHERE id BETWEEN ? AND ? ORDER BY id', [minId, maxId]);
    return words;
  }, [id, query]);

  return (
    <div className="group py-3 px-3 rounded-lg bg-muted/20 hover:bg-muted/40 border border-transparent hover:border-border/50 transition-all cursor-default">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{heading}</span>
      </div>
      <div className="text-sm leading-relaxed font-serif text-foreground/90" style={{ fontFamily: "var(--font-serif)" }}>
        {context.map((w) => (
          <span
            key={w.id}
            className={w.id === id ? 'bg-primary/20 text-foreground font-bold px-1 rounded mx-0.5' : 'mx-0.5'}
          >
            {w.word_form}
          </span>
        ))}
      </div>
    </div>
  );
}
