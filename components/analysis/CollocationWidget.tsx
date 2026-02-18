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
      LIMIT 8`;
    const sqlNext = `
      SELECT T2.lemma AS lemma, COUNT(T1.id) AS count
      FROM words AS T1
      JOIN words AS T2 ON T1.id = T2.id - 1
      WHERE T1.lemma = ?
      GROUP BY T2.lemma
      ORDER BY count DESC
      LIMIT 8`;
    setPrevs(query<Colloc>(sqlPrev, [lemma]));
    setNexts(query<Colloc>(sqlNext, [lemma]));
  }, [lemma, query]);

  if (prevs.length === 0 && nexts.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-foreground">Common Collocations</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Words appearing frequently nearby</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="h-1 w-1 bg-primary rounded-full"></span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Preceding</span>
          </div>
          <ul className="space-y-1">
            {prevs.map((c) => (
              <li key={`p-${c.lemma}`} className="flex justify-between items-center group py-1 border-b border-border/50 last:border-0">
                <span className="font-serif text-foreground group-hover:text-primary transition-colors">{c.lemma}</span>
                <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full font-medium">{c.count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="h-1 w-1 bg-primary rounded-full"></span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Following</span>
          </div>
          <ul className="space-y-1">
            {nexts.map((c) => (
              <li key={`n-${c.lemma}`} className="flex justify-between items-center group py-1 border-b border-border/50 last:border-0">
                <span className="font-serif text-foreground group-hover:text-primary transition-colors">{c.lemma}</span>
                <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full font-medium">{c.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
