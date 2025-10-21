'use client';

import { useEffect, useState } from 'react';
import { useDatabase } from '@/hooks/useDatabase';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { interpretPosTag } from '@/lib/parsing';

export default function LemmaDistWidget({ lemma }: { lemma: string }) {
  const { query } = useDatabase();
  const [data, setData] = useState<{ pos_tag: string; count: number }[]>([]);
  useEffect(() => {
    if (!lemma) { setData([]); return; }
    const rows = query<{ pos_tag: string; count: number }>(
      'SELECT pos_tag, COUNT(id) as count FROM words WHERE lemma = ? GROUP BY pos_tag ORDER BY count DESC',
      [lemma]
    );
    setData(rows);
  }, [lemma, query]);
  return (
    <div className="border rounded p-3">
      <div className="text-sm mb-2">Distribution by parsing for lemma: <span className="font-medium">{lemma}</span></div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="pos_tag" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip formatter={(v: any, n: any, p: any) => n === 'count' ? v : interpretPosTag(p.payload.pos_tag)} />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


