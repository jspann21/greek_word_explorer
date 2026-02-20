'use client';

import { useEffect, useState } from 'react';
import { useDatabase } from '@/hooks/useDatabase';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Colloc {
    lemma: string;
    count: number;
}

interface FormCount {
    word_form: string;
    count: number;
}

export default function CollocationDetailed({ lemma }: { lemma: string }) {
    const { query } = useDatabase();
    const [prevs, setPrevs] = useState<Colloc[]>([]);
    const [nexts, setNexts] = useState<Colloc[]>([]);

    useEffect(() => {
        if (!lemma) return;
        const sqlPrev = `
      SELECT T2.lemma AS lemma, COUNT(T1.id) AS count
      FROM words AS T1
      JOIN words AS T2 ON T1.id = T2.id + 1
      WHERE T1.lemma = ?
      GROUP BY T2.lemma
      ORDER BY count DESC`;
        const sqlNext = `
      SELECT T2.lemma AS lemma, COUNT(T1.id) AS count
      FROM words AS T1
      JOIN words AS T2 ON T1.id = T2.id - 1
      WHERE T1.lemma = ?
      GROUP BY T2.lemma
      ORDER BY count DESC`;
        setPrevs(query<Colloc>(sqlPrev, [lemma]));
        setNexts(query<Colloc>(sqlNext, [lemma]));
    }, [lemma, query]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div>
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-border">
                    <span className="h-2 w-2 bg-primary rounded-full"></span>
                    <h3 className="text-lg font-bold text-foreground uppercase tracking-widest">Preceding Lemmas</h3>
                </div>
                <div className="space-y-2">
                    {prevs.map((c) => (
                        <ExpandableLemmaRow key={`p-${c.lemma}`} baseLemma={lemma} targetLemma={c.lemma} count={c.count} type="prev" />
                    ))}
                    {prevs.length === 0 && <p className="text-muted-foreground text-sm">No preceding collocations found.</p>}
                </div>
            </div>
            <div>
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-border">
                    <span className="h-2 w-2 bg-primary rounded-full"></span>
                    <h3 className="text-lg font-bold text-foreground uppercase tracking-widest">Following Lemmas</h3>
                </div>
                <div className="space-y-2">
                    {nexts.map((c) => (
                        <ExpandableLemmaRow key={`n-${c.lemma}`} baseLemma={lemma} targetLemma={c.lemma} count={c.count} type="next" />
                    ))}
                    {nexts.length === 0 && <p className="text-muted-foreground text-sm">No following collocations found.</p>}
                </div>
            </div>
        </div>
    );
}

function ExpandableLemmaRow({ baseLemma, targetLemma, count, type }: { baseLemma: string, targetLemma: string, count: number, type: 'prev' | 'next' }) {
    const { query } = useDatabase();
    const [expanded, setExpanded] = useState(false);
    const [forms, setForms] = useState<FormCount[]>([]);

    const handleExpand = () => {
        if (!expanded && forms.length === 0) {
            const sqlDiff = type === 'prev' ? '+ 1' : '- 1';
            const sql = `
        SELECT T2.word_form, COUNT(T1.id) AS count
        FROM words AS T1
        JOIN words AS T2 ON T1.id = T2.id ${sqlDiff}
        WHERE T1.lemma = ? AND T2.lemma = ?
        GROUP BY T2.word_form
        ORDER BY count DESC
      `;
            setForms(query<FormCount>(sql, [baseLemma, targetLemma]));
        }
        setExpanded(!expanded);
    };

    return (
        <div className="rounded-lg border border-border/50 bg-card overflow-hidden">
            <button
                onClick={handleExpand}
                className="w-full flex justify-between items-center px-4 py-3 hover:bg-muted/30 transition-colors text-left"
            >
                <div className="flex items-center gap-3">
                    <div className="text-muted-foreground">
                        {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                    <span className="font-serif text-lg text-foreground">{targetLemma}</span>
                </div>
                <span className="text-xs px-2.5 py-1 bg-primary/10 text-primary font-bold rounded-full">{count}</span>
            </button>

            {expanded && forms.length > 0 && (
                <div className="px-5 py-3 bg-muted/20 border-t border-border/50 flex flex-col gap-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-semibold">Different Forms Attested</p>
                    {forms.map((f, i) => (
                        <div key={i} className="flex justify-between items-center pb-2 border-b border-border/30 last:border-0 last:pb-0">
                            <span className="font-serif text-foreground/90">{f.word_form}</span>
                            <span className="text-xs text-muted-foreground font-medium">{f.count}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
