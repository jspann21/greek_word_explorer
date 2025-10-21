'use client';

import { useEffect, useState } from 'react';
import { useDatabase } from '@/hooks/useDatabase';

interface Colloc { lemma: string; count: number }

export default function CollocationWidget({ lemma }: { lemma: string }) {
  const { query } = useDatabase();
  const [prevs, setPrevs] = useState<Colloc[]>([]);
  const [nexts, setNexts] = useState<Colloc[]>([]);

  useEffect(() => {
    if (!lemma) { setPrevs([]); setNexts([]); return; }
    const sqlPrev = `
      SELECT T2.lemma AS lemma, COUNT(T1.id) AS count
      FROM words AS T1
      JOIN words AS T2 ON T1.id = T2.id + 1
      WHERE T1.lemma = ?
      GROUP BY T2.lemma
      ORDER BY count DESC
      LIMIT 10`;
    const sqlNext = `
      SELECT T2.lemma AS lemma, COUNT(T1.id) AS count
      FROM words AS T1
      JOIN words AS T2 ON T1.id = T2.id - 1
      WHERE T1.lemma = ?
      GROUP BY T2.lemma
      ORDER BY count DESC
      LIMIT 10`;
    setPrevs(query<Colloc>(sqlPrev, [lemma]));
    setNexts(query<Colloc>(sqlNext, [lemma]));
  }, [lemma, query]);

  return (
    <div className="bg-card border rounded-lg p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground mb-1">Word Collocations</h3>
      <p className="text-xs text-muted-foreground mb-4">Common words appearing before and after this lemma</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">← Preceding</div>
          <ul className="text-sm space-y-2">
            {prevs.map((c) => (
              <li key={`p-${c.lemma}`} className="flex justify-between items-center group">
                <span className="font-serif group-hover:text-primary transition-colors" style={{ fontFamily: "'Gentium Plus', 'Times New Roman', serif" }}>{c.lemma}</span>
                <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">{c.count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Following →</div>
          <ul className="text-sm space-y-2">
            {nexts.map((c) => (
              <li key={`n-${c.lemma}`} className="flex justify-between items-center group">
                <span className="font-serif group-hover:text-primary transition-colors" style={{ fontFamily: "'Gentium Plus', 'Times New Roman', serif" }}>{c.lemma}</span>
                <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">{c.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}


