'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDatabase } from '@/hooks/useDatabase';

interface Row { id: number; book_name: string; chapter: number; verse: number; }

const CANONICAL_ORDER = [
    "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1Corinthians", "2Corinthians",
    "Galatians", "Ephesians", "Philippians", "Colossians", "1Thessalonians", "2Thessalonians",
    "1Timothy", "2Timothy", "Titus", "Philemon", "Hebrews", "James", "1Peter", "2Peter",
    "1John", "2John", "3John", "Jude", "Revelation"
];

export default function ConcordanceDetailed({ lemma, pos_tag }: { lemma: string; pos_tag?: string }) {
    const { query } = useDatabase();
    const [rows, setRows] = useState<Row[]>([]);

    useEffect(() => {
        if (!lemma) { setRows([]); return; }
        const args: any[] = [lemma];
        let sql = 'SELECT id, book_name, chapter, verse FROM words WHERE lemma = ?';
        if (pos_tag) { sql += ' AND pos_tag = ?'; args.push(pos_tag); }
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
    }, [lemma, pos_tag, query]);

    const groupedRows = useMemo(() => {
        const map = new Map<string, Row[]>();
        rows.forEach(r => {
            const g = r.book_name;
            if (!map.has(g)) map.set(g, []);
            map.get(g)!.push(r);
        });
        return Array.from(map.entries());
    }, [rows]);

    if (rows.length === 0) return <p className="text-muted-foreground text-sm">No occurrences found.</p>;

    return (
        <div className="space-y-8">
            {groupedRows.map(([book, bookRows]) => (
                <div key={book}>
                    <div className="flex items-center gap-3 mb-4 pb-2 border-b border-border">
                        <span className="h-2 w-2 bg-primary rounded-full"></span>
                        <h3 className="text-lg font-bold text-foreground uppercase tracking-widest">{book}</h3>
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium ml-2">{bookRows.length} occurrences</span>
                    </div>
                    <div className="space-y-3">
                        {bookRows.map(r => (
                            <DetailedConcordanceRow key={r.id} id={r.id} heading={`${r.book_name} ${r.chapter}:${r.verse}`} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function DetailedConcordanceRow({ id, heading }: { id: number; heading: string }) {
    const { query } = useDatabase();
    const context = useMemo(() => {
        // Show a wider context window in the detailed view
        const window = 8;
        const minId = id - window;
        const maxId = id + window;
        const words = query<{ id: number; word_form: string; lemma: string }>('SELECT id, word_form, lemma FROM words WHERE id BETWEEN ? AND ? ORDER BY id', [minId, maxId]);
        return words;
    }, [id, query]);

    return (
        <div className="py-4 px-5 rounded-lg bg-muted/20 border border-border/50 hover:bg-muted/40 transition-colors">
            <div className="mb-2 flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{heading}</span>
            </div>
            <div className="text-base leading-relaxed font-serif text-foreground/90" style={{ fontFamily: "var(--font-serif)" }}>
                {context.map((w) => (
                    <span
                        key={w.id}
                        title={w.lemma}
                        className={w.id === id ? 'bg-primary text-primary-foreground font-bold px-1.5 py-0.5 rounded shadow-sm mx-0.5' : 'mx-0.5 hover:text-primary transition-colors cursor-help'}
                    >
                        {w.word_form}
                    </span>
                ))}
            </div>
        </div>
    );
}
