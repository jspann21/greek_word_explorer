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
    <div className="bg-card border rounded-lg p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground mb-1">Form Distribution</h3>
      <p className="text-xs text-muted-foreground mb-4">How this lemma appears across different grammatical forms</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="pos_tag" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
          <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
          <Tooltip 
            formatter={(v: any, n: any, p: any) => n === 'count' ? v : interpretPosTag(p.payload.pos_tag)}
            contentStyle={{ background: 'white', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
          />
          <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


