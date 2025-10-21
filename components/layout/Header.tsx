'use client';

import Link from 'next/link';
import BookChapterSelector from './BookChapterSelector';

export default function Header() {
  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link href="/Matthew/1" className="text-lg font-semibold">SBLGNT Logos Engine</Link>
        <BookChapterSelector />
      </div>
    </header>
  );
}


