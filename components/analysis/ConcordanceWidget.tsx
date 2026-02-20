'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDatabase } from '@/hooks/useDatabase';
import { Maximize2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import ConcordanceDetailed from './ConcordanceDetailed';
import { interpretPosTag } from '@/lib/parsing';

interface Row { id: number; book_name: string; chapter: number; verse: number; }

export default function ConcordanceWidget({ lemma, pos_tag }: { lemma: string; pos_tag?: string }) {
  const { query } = useDatabase();
  const [rows, setRows] = useState<Row[]>([]);
  const [selectedPos, setSelectedPos] = useState<string>(pos_tag || '');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => setSelectedPos(pos_tag || ''), [pos_tag]);

  const CANONICAL_ORDER = [
    "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1Corinthians", "2Corinthians",
    "Galatians", "Ephesians", "Philippians", "Colossians", "1Thessalonians", "2Thessalonians",
    "1Timothy", "2Timothy", "Titus", "Philemon", "Hebrews", "James", "1Peter", "2Peter",
    "1John", "2John", "3John", "Jude", "Revelation"
  ];

  useEffect(() => {
    if (!lemma) { setRows([]); return; }
    const args: any[] = [lemma];
    let sql = 'SELECT id, book_name, chapter, verse FROM words WHERE lemma = ?';
    if (selectedPos) { sql += ' AND pos_tag = ?'; args.push(selectedPos); }
    sql += ' ORDER BY book_name, chapter, verse, id';

    const result = query<Row>(sql, args);
    result.sort((a, b) => {
      const aIdx = CANONICAL_ORDER.indexOf(a.book_name);
      const bIdx = CANONICAL_ORDER.indexOf(b.book_name);
      const aNum = aIdx === -1 ? 999 : aIdx;
      const bNum = bIdx === -1 ? 999 : bIdx;
      if (aNum !== bNum) return aNum - bNum;
      return 0;
    });

    setRows(result);
  }, [lemma, selectedPos, query]);

  return (
    <>
      <div
        className="bg-card border border-border rounded-xl p-5 shadow-sm group hover:ring-2 hover:ring-primary/40 transition-all cursor-pointer relative"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="absolute top-4 right-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="w-4 h-4" />
        </div>
        <div className="flex items-center justify-between mb-4 pr-6">
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
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setSelectedPos(e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            placeholder="Filter by POS (e.g., NNSM)"
          />
          {selectedPos && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">Filtering for: </span>
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] uppercase tracking-wider font-bold rounded">
                {interpretPosTag(selectedPos)}
              </span>
            </div>
          )}
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Detailed Concordance">
        <ConcordanceDetailed lemma={lemma} pos_tag={selectedPos} />
      </Modal>
    </>
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
