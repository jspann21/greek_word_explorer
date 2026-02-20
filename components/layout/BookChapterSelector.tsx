'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDown, BookOpen, Hash } from 'lucide-react';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function BookChapterSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const [books, setBooks] = useState<{ id: string; name: string; chapters: number }[]>([]);

  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isChapterOpen, setIsChapterOpen] = useState(false);

  const bookRef = useRef<HTMLDivElement>(null);
  const chapterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${basePath}/books.json`).then(r => r.json()).then(setBooks).catch(() => setBooks([]));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bookRef.current && !bookRef.current.contains(event.target as Node)) {
        setIsBookOpen(false);
      }
      if (chapterRef.current && !chapterRef.current.contains(event.target as Node)) {
        setIsChapterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [book, chapter] = useMemo(() => {
    const parts = (pathname || '/Matthew/1').split('/').filter(Boolean);
    return [parts[0] || 'Matthew', parts[1] || '1'];
  }, [pathname]);

  const selected = books.find(b => b.name === book) || books[0];
  const chapterCount = selected?.chapters ?? 1;

  // Add responsive sizing and glassmorphism styling
  return (
    <div className="flex items-center gap-2 sm:gap-4 relative z-[60]">

      {/* Book Selector */}
      <div className="relative" ref={bookRef}>
        <button
          onClick={() => { setIsBookOpen(!isBookOpen); setIsChapterOpen(false); }}
          className="flex items-center gap-2 sm:gap-3 h-10 px-3 sm:px-4 rounded-xl border border-border/50 bg-background/50 backdrop-blur-md hover:bg-muted/50 hover:border-primary/30 transition-all text-sm font-medium shadow-sm hover:shadow group"
        >
          <BookOpen className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-foreground truncate max-w-[120px] sm:max-w-none">{book}</span>
          <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform duration-200 ${isBookOpen ? 'rotate-180' : ''}`} />
        </button>

        {isBookOpen && (
          <div className="absolute top-12 left-0 w-48 max-h-[60vh] overflow-y-auto bg-card border border-border/50 rounded-xl shadow-xl shadow-black/5 flex flex-col p-1 animate-dropdown custom-scrollbar outline-none ring-1 ring-black/5">
            {books.map((b) => (
              <button
                key={b.name}
                className={`text-left px-3 py-2 text-sm rounded-lg transition-colors ${b.name === book ? 'bg-primary text-primary-foreground font-bold shadow-sm' : 'text-foreground/80 hover:bg-muted hover:text-foreground'}`}
                onClick={() => {
                  router.push(`/${b.name}/1`);
                  setIsBookOpen(false);
                }}
              >
                {b.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chapter Selector */}
      <div className="relative" ref={chapterRef}>
        <button
          onClick={() => { setIsChapterOpen(!isChapterOpen); setIsBookOpen(false); }}
          className="flex items-center gap-2 sm:gap-3 h-10 px-3 sm:px-4 rounded-xl border border-border/50 bg-background/50 backdrop-blur-md hover:bg-muted/50 hover:border-primary/30 transition-all text-sm font-medium shadow-sm hover:shadow group"
        >
          <Hash className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-foreground whitespace-nowrap">Ch. {chapter}</span>
          <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform duration-200 ${isChapterOpen ? 'rotate-180' : ''}`} />
        </button>

        {isChapterOpen && (
          <div className="absolute top-12 right-0 md:left-0 md:right-auto w-[280px] sm:w-[320px] p-4 bg-card border border-border/50 rounded-xl shadow-xl shadow-black/5 animate-dropdown ring-1 ring-black/5">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Select Chapter</div>
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
              {Array.from({ length: chapterCount }, (_, i) => String(i + 1)).map((c) => (
                <button
                  key={c}
                  className={`h-9 w-full flex items-center justify-center rounded-lg text-sm font-medium transition-all ${c === chapter ? 'bg-primary text-primary-foreground shadow-md scale-105' : 'bg-muted/30 text-foreground/80 hover:bg-muted hover:scale-105 border border-transparent hover:border-border/50'}`}
                  onClick={() => {
                    router.push(`/${book}/${c}`);
                    setIsChapterOpen(false);
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
