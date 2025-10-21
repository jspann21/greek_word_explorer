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
    <div className="flex items-center gap-2">
      <select
        className="border rounded px-2 py-1"
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
      <select
        className="border rounded px-2 py-1"
        value={chapter}
        onChange={(e) => router.push(`/${book}/${e.target.value}`)}
      >
        {Array.from({ length: chapterCount }, (_, i) => String(i + 1)).map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  );
}


