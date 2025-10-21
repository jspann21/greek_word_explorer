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
    <div className="border rounded p-3 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="font-medium mb-2">Top 10 Preceding Words</div>
        <ul className="text-sm space-y-1">
          {prevs.map((c) => (
            <li key={`p-${c.lemma}`} className="flex justify-between"><span>{c.lemma}</span><span className="text-gray-500">{c.count}</span></li>
          ))}
        </ul>
      </div>
      <div>
        <div className="font-medium mb-2">Top 10 Following Words</div>
        <ul className="text-sm space-y-1">
          {nexts.map((c) => (
            <li key={`n-${c.lemma}`} className="flex justify-between"><span>{c.lemma}</span><span className="text-gray-500">{c.count}</span></li>
          ))}
        </ul>
      </div>
    </div>
  );
}


