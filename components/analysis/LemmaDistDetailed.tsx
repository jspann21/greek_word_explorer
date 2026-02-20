'use client';

import { useEffect, useState } from 'react';
import { useDatabase } from '@/hooks/useDatabase';
import { interpretPosTag } from '@/lib/parsing';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface FormDetail {
    pos_tag: string;
    word_form: string;
    count: number;
}

interface PosGroup {
    pos_tag: string;
    description: string;
    total: number;
    forms: { word_form: string; count: number }[];
}

export default function LemmaDistDetailed({ lemma }: { lemma: string }) {
    const { query } = useDatabase();
    const [data, setData] = useState<PosGroup[]>([]);

    useEffect(() => {
        if (!lemma) return;
        const sql = `
      SELECT pos_tag, word_form, COUNT(id) as count 
      FROM words 
      WHERE lemma = ? 
      GROUP BY pos_tag, word_form 
      ORDER BY count DESC
    `;
        const rows = query<FormDetail>(sql, [lemma]);

        const groupsMap = new Map<string, PosGroup>();
        rows.forEach(r => {
            if (!groupsMap.has(r.pos_tag)) {
                groupsMap.set(r.pos_tag, {
                    pos_tag: r.pos_tag,
                    description: interpretPosTag(r.pos_tag),
                    total: 0,
                    forms: []
                });
            }
            const group = groupsMap.get(r.pos_tag)!;
            group.total += r.count;
            group.forms.push({ word_form: r.word_form, count: r.count });
        });

        const groups = Array.from(groupsMap.values()).sort((a, b) => b.total - a.total);
        setData(groups);
    }, [lemma, query]);

    if (data.length === 0) return null;

    return (
        <div className="space-y-8">
            <div className="h-[250px] w-full border-b border-border pb-8 mb-8">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis
                            dataKey="pos_tag"
                            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                            axisLine={{ stroke: 'hsl(var(--border))' }}
                            tickLine={false}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                        />
                        <YAxis
                            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                            formatter={(v: any, n: any, p: any) => [v, p.payload.description]}
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
                            dataKey="total"
                            fill="hsl(var(--primary))"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={60}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((g) => (
                    <div key={g.pos_tag} className="bg-muted/10 border border-border/50 rounded-xl p-5">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold text-foreground text-sm cursor-help w-fit" title={g.description}>
                                    {g.pos_tag}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1 max-w-[200px] leading-relaxed">
                                    {g.description}
                                </p>
                            </div>
                            <div className="px-2 py-0.5 bg-primary/10 text-primary font-bold rounded-full text-xs">
                                {g.total}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">Attested Forms</p>
                            {g.forms.map((f, i) => (
                                <div key={i} className="flex justify-between items-center py-1.5 border-b border-border/30 last:border-0 relative group">
                                    <span className="font-serif text-[15px]">{f.word_form}</span>
                                    <span className="text-xs font-medium text-muted-foreground">{f.count}</span>
                                    {/* Subtle bar background to show proportion within POS category */}
                                    <div
                                        className="absolute inset-y-1 left-[-4px] bg-primary/5 rounded z-[-1] transition-all group-hover:bg-primary/10"
                                        style={{ width: `calc(${(f.count / g.total) * 100}% + 8px)` }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
