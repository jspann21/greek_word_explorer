import { readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');

export async function getValidBookNames(): Promise<string[]> {
  try {
    const raw = await readFile(path.join(PUBLIC_DIR, 'books.json'), 'utf8');
    const books: { name: string; chapters: number }[] = JSON.parse(raw);
    return books.map((b) => b.name);
  } catch (error) {
    console.error('Error reading books.json:', error);
    return [];
  }
}

export async function isValidBook(book: string): Promise<boolean> {
  const validBooks = await getValidBookNames();
  return validBooks.includes(book);
}
