'use client';

import Link from 'next/link';
import BookChapterSelector from './BookChapterSelector';

export default function Header() {
  return (
    <header className="w-full border-b bg-white/80 backdrop-blur-sm shadow-sm z-10">
      <div className="w-full px-6 py-4 flex items-center justify-between">
        <Link href="/Matthew/1" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <span className="text-white font-bold text-xl">Λ</span>
          </div>
          <div>
            <div className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              SBLGNT Explorer
            </div>
            <div className="text-xs text-muted-foreground">Greek New Testament</div>
          </div>
        </Link>
        <BookChapterSelector />
      </div>
    </header>
  );
}


