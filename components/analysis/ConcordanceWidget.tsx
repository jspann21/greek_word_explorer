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
    <div className="bg-card border rounded-lg p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground mb-1">Concordance</h3>
      <p className="text-xs text-muted-foreground mb-4">All occurrences of this lemma in context</p>
      <div className="flex items-center gap-3 mb-4">
        <input 
          value={selectedPos} 
          onChange={(e) => setSelectedPos(e.target.value)} 
          className="flex-1 h-9 rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" 
          placeholder="Filter by POS (e.g., NNSM)" 
        />
        <div className="text-xs px-3 py-1.5 bg-primary/10 text-primary font-medium rounded-md whitespace-nowrap">
          {rows.length} {rows.length === 1 ? 'occurrence' : 'occurrences'}
        </div>
      </div>
      <div className="max-h-96 overflow-auto space-y-3">
        {rows.slice(0, 50).map((r) => (
          <ConcordanceRow key={r.id} id={r.id} heading={`${r.book_name} ${r.chapter}:${r.verse}`} />
        ))}
        {rows.length > 50 && (
          <div className="text-xs text-center text-muted-foreground py-2 border-t">
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
    <div className="py-3 px-3 rounded-md hover:bg-muted/30 transition-colors">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{heading}</div>
      <div className="text-sm leading-relaxed font-serif" style={{ fontFamily: "'Gentium Plus', 'Times New Roman', serif" }}>
        {context.map((w) => (
          <span key={w.id} className={w.id === id ? 'bg-primary/20 px-1 py-0.5 rounded font-semibold' : ''}>
            {w.word_form}{' '}
          </span>
        ))}
      </div>
    </div>
  );
}


