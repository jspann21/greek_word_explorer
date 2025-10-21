import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import Database from 'better-sqlite3';

const ROOT = process.cwd();
const SRC_DIR = join(ROOT, 'sblgnt_json');
const PAR_DIR = join(SRC_DIR, 'paragraphs');
const PUBLIC_DIR = join(ROOT, 'public');
const TEXT_DIR = join(PUBLIC_DIR, 'text');

await mkdir(PUBLIC_DIR, { recursive: true });
if (existsSync(TEXT_DIR)) {
  await rm(TEXT_DIR, { recursive: true, force: true });
}
await mkdir(TEXT_DIR, { recursive: true });

const booksList = JSON.parse(await readFile(join(SRC_DIR, 'books.json'), 'utf8'));

const dbPath = join(PUBLIC_DIR, 'sblgnt.db');
// Ensure a fresh DB each run
if (existsSync(dbPath)) {
  await rm(dbPath, { force: true });
}
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.exec(`
CREATE TABLE IF NOT EXISTS words (
  id INTEGER PRIMARY KEY,
  book_id TEXT,
  book_name TEXT,
  chapter INTEGER,
  verse INTEGER,
  word_form TEXT,
  lemma TEXT,
  pos_tag TEXT,
  gloss TEXT,
  strongs TEXT,
  louw TEXT
);
CREATE INDEX IF NOT EXISTS idx_words_lemma ON words(lemma);
CREATE INDEX IF NOT EXISTS idx_words_pos ON words(pos_tag);
CREATE INDEX IF NOT EXISTS idx_words_loc ON words(book_id, chapter, verse);
`);

const insertStmt = db.prepare(`INSERT INTO words (
  id, book_id, book_name, chapter, verse, word_form, lemma, pos_tag, gloss, strongs, louw
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

const bookInfos = [];
let nextId = 1;

function padChapter(n) { return String(n).padStart(3, '0'); }

for (const bookName of booksList) {
  const bookJsonPath = join(SRC_DIR, `${bookName}.json`);
  const bookData = JSON.parse(await readFile(bookJsonPath, 'utf8'));
  const book = bookData[bookName];
  const chapters = Object.keys(book).sort((a,b)=>Number(a)-Number(b));
  const perBookOutput = { book: bookName, chapters: {} };

  for (const chapter of chapters) {
    const verses = Object.keys(book[chapter]).sort((a,b)=>Number(a)-Number(b));
    const paragraphs = [];

    // Read paragraph boundaries
    const parFile = join(PAR_DIR, bookName, `${padChapter(chapter)}-paragraphs.json`);
    let paragraphVerses = [];
    if (existsSync(parFile)) {
      paragraphVerses = JSON.parse(await readFile(parFile, 'utf8'));
    } else {
      // fallback: each verse is its own paragraph
      paragraphVerses = verses.map(v => [v]);
    }

    // Build a map verse->words for quick consumption
    const verseToWords = new Map();
    for (const verse of verses) {
      const words = book[chapter][verse];
      verseToWords.set(verse, words);
    }

    for (const para of paragraphVerses) {
      const paraArr = [];
      for (const verse of para) {
        const words = verseToWords.get(verse) || [];
        for (const w of words) {
          const word_form = w.word_forms?.[0] ?? '';
          const lemma = w.word_forms?.[3] ?? '';
          const pos_tag = w.pos_tag ?? '';
          const gloss = w.gloss ?? '';
          const strongs = String(w.strong ?? '');
          const louw = w.louw ?? '';
          const bcv = String(w.book_chapter_verse || '');
          const book_id = bcv.slice(0, 2); // 01..27

          insertStmt.run(
            nextId,
            book_id,
            bookName,
            Number(chapter),
            Number(verse),
            word_form,
            lemma,
            pos_tag,
            gloss,
            strongs,
            louw
          );

          paraArr.push({ verse: String(verse), word_id: nextId, text: word_form });
          nextId++;
        }
      }
      paragraphs.push(paraArr);
    }

    perBookOutput.chapters[String(chapter)] = { paragraphs };
  }

  const bookOutPath = join(TEXT_DIR, `${bookName}.json`);
  await writeFile(bookOutPath, JSON.stringify(perBookOutput));
  bookInfos.push({ id: '', name: bookName, chapters: chapters.length });
}

await writeFile(join(PUBLIC_DIR, 'books.json'), JSON.stringify(bookInfos));

db.close();
console.log('Preprocess complete:', { words: nextId - 1 });


