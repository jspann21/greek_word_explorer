import TextPanel from '@/components/TextPanel';
import AnalysisPanel from '@/components/analysis/AnalysisPanel';
import type { BookTextFile } from '@/lib/types';
import { readFile } from 'node:fs/promises';
import { notFound } from 'next/navigation';
import path from 'node:path';

export const dynamic = 'force-static';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const TEXT_DIR = path.join(PUBLIC_DIR, 'text');

export default async function ChapterPage({ params }: { params: Promise<{ book: string; chapter: string }> }) {
  const p = await params;
  const decodedBook = decodeURIComponent(p.book);
  const bookPath = path.resolve(TEXT_DIR, `${decodedBook}.json`);

  // Ensure the resolved path is within TEXT_DIR to prevent path traversal
  if (!bookPath.startsWith(TEXT_DIR + path.sep)) {
    notFound();
  }

  try {
    const raw = await readFile(bookPath, 'utf8');
    const data = JSON.parse(raw) as BookTextFile;
    const chapterData = data.chapters[String(p.chapter)] ?? { paragraphs: [] };

    return (
      <>
        <TextPanel paragraphs={chapterData.paragraphs} />
        <AnalysisPanel />
      </>
    );
  } catch {
    notFound();
  }
}

export async function generateStaticParams(): Promise<{ book: string; chapter: string }[]> {
  try {
    const raw = await readFile(path.join(PUBLIC_DIR, 'books.json'), 'utf8');
    const books: { name: string; chapters: number }[] = JSON.parse(raw);
    const paths: { book: string; chapter: string }[] = [];
    for (const b of books) {
      for (let c = 1; c <= b.chapters; c++) {
        paths.push({ book: b.name, chapter: String(c) });
      }
    }
    return paths;
  } catch {
    return [{ book: 'Matthew', chapter: '1' }];
  }
}


