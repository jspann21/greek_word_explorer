'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function BookChapterSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const [books, setBooks] = useState<{ id: string; name: string; chapters: number }[]>([]);

  useEffect(() => {
    fetch(`${basePath}/books.json`).then(r => r.json()).then(setBooks).catch(() => setBooks([]));
  }, []);

  const [book, chapter] = useMemo(() => {
    const parts = (pathname || '/Matthew/1').split('/').filter(Boolean);
    return [parts[0] || 'Matthew', parts[1] || '1'];
  }, [pathname]);

  const selected = books.find(b => b.name === book) || books[0];
  const chapterCount = selected?.chapters ?? 1;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-muted-foreground">Book</label>
        <select
          className="h-10 rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          value={book}
          onChange={(e) => {
            const nextBook = e.target.value;
            router.push(`/${nextBook}/1`);
          }}
        >
          {books.map((b) => (
            <option key={b.name} value={b.name}>{b.name}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-muted-foreground">Chapter</label>
        <select
          className="h-10 rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          value={chapter}
          onChange={(e) => router.push(`/${book}/${e.target.value}`)}
        >
          {Array.from({ length: chapterCount }, (_, i) => String(i + 1)).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>
  );
}


