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
    <div className="border rounded p-3 space-y-2">
      <div className="flex items-center gap-2">
        <div className="text-sm">Filter POS:</div>
        <input value={selectedPos} onChange={(e) => setSelectedPos(e.target.value)} className="border px-2 py-1 rounded text-sm" placeholder="e.g., NNSM" />
        <div className="text-xs text-gray-500">{rows.length} hits</div>
      </div>
      <div className="max-h-64 overflow-auto divide-y">
        {rows.map((r) => (
          <ConcordanceRow key={r.id} id={r.id} heading={`${r.book_name} ${r.chapter}:${r.verse}`} />
        ))}
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
    <div className="py-2 text-sm">
      <div className="font-medium mb-1">{heading}</div>
      <div className="whitespace-pre-wrap">
        {context.map((w) => (
          <span key={w.id} className={w.id === id ? 'bg-yellow-200 px-0.5 rounded' : ''}>
            {w.word_form}{' '}
          </span>
        ))}
      </div>
    </div>
  );
}


