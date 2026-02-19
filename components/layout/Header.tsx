'use client';

import Link from 'next/link';
import BookChapterSelector from './BookChapterSelector';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Header() {
  return (
    <header className="sticky top-0 w-full border-b bg-background/80 backdrop-blur-sm z-10 transition-colors">
      <div className="w-full px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/Matthew/1" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-md group-hover:shadow-primary/20 transition-all">
              <span className="text-primary-foreground font-bold text-xl">Λ</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                SBLGNT Explorer
              </div>
              <div className="text-xs text-muted-foreground">Greek New Testament</div>
            </div>
          </Link>
          <BookChapterSelector />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
