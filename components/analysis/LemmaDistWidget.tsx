'use client';

import { useEffect, useState } from 'react';
import { useDatabase } from '@/hooks/useDatabase';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { interpretPosTag } from '@/lib/parsing';
import { Maximize2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import LemmaDistDetailed from './LemmaDistDetailed';

export default function LemmaDistWidget({ lemma }: { lemma: string }) {
  const { query } = useDatabase();
  const [data, setData] = useState<{ pos_tag: string; count: number }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!lemma) { setData([]); return; }
    const rows = query<{ pos_tag: string; count: number }>(
      'SELECT pos_tag, COUNT(id) as count FROM words WHERE lemma = ? GROUP BY pos_tag ORDER BY count DESC LIMIT 15',
      [lemma]
    );
    setData(rows);
  }, [lemma, query]);

  if (data.length === 0) return null;

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="bg-card border border-border rounded-xl p-5 shadow-sm group hover:ring-2 hover:ring-primary/40 transition-all cursor-pointer relative"
      >
        <div className="absolute top-4 right-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="w-4 h-4" />
        </div>
        <div className="flex items-center justify-between mb-4 pr-6">
          <div>
            <h3 className="text-sm font-bold text-foreground">Form Distribution</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Frequency by grammatical form</p>
          </div>
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="pos_tag"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={false}
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                formatter={(v: any, n: any, p: any) => [v, interpretPosTag(p.payload.pos_tag)]}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'hsl(var(--foreground))',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
                labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '0.25rem' }}
              />
              <Bar
                dataKey="count"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Detailed Form Distribution">
        <LemmaDistDetailed lemma={lemma} />
      </Modal>
    </>
  );
}
