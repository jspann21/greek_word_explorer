# SBL Greek Text Explorer ("Logos Engine")

High-performance, fully static explorer for the SBL Greek New Testament. The app preprocesses the entire corpus into a single SQLite DB and queries it on the client via `sql.js` (WASM) for instant analysis.

- Demo (after deploy): `https://jspann21.github.io/greek-word-explorer/Matthew/1`
- Stack: Next.js 14+ (App Router), TypeScript, React 18+, Tailwind CSS, sql.js (WASM), recharts
- Build tools: better-sqlite3 (Node), GitHub Pages (static export)

## Features
- Text panel per book/chapter with paragraph boundaries
- Click any word to view:
  - Word details (lemma, gloss, parsing, Strong’s)
  - Lemma distribution by POS (bar chart)
  - Concordance with context (±5 words)
  - Collocation: top 10 preceding/following lemmas

## Requirements
- Node.js 18+ locally (CI uses Node 22 LTS)
- The `sblgnt_json/` source directory (included in this repo)

## Quick start (local)
```bash
# Install deps
npm ci

# Prepare runtime assets (copy wasm + build DB + text JSON)
node scripts/copy-sql-wasm.mjs
node scripts/preprocess.mjs

# Dev server (Next.js)
npm run dev
# Open http://localhost:3000/Matthew/1
```

Alternatively, a full build (runs preprocess automatically):
```bash
npm run build
```
Outputs a static site to `out/`.

## NPM scripts
- dev: start Next dev server
- preprocess: build `public/sblgnt.db` and `public/text/*.json`
- prebuild: copy `sql-wasm.wasm` into `public/`
- build: runs preprocess + Next build (static export)

## Data preprocessing
Script: `scripts/preprocess.mjs` (Node ESM + better-sqlite3)
- Creates `public/sblgnt.db` with table `words`:
  ```sql
  CREATE TABLE words (
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
  ```
- Iterates `sblgnt_json/<Book>.json` and paragraph files in `sblgnt_json/paragraphs/<Book>/`.
- Emits per-book render JSONs: `public/text/<Book>.json` with paragraphized chapter arrays.

## Client database (sql.js)
- `SqlProvider` loads `public/sblgnt.db` into a `sql.js` Database on the client.
- `useDatabase()` exposes `query(sql, params)` returning typed rows.

### Example queries
- Word detail:
  ```sql
  SELECT * FROM words WHERE id = ?
  ```
- Lemma distribution:
  ```sql
  SELECT pos_tag, COUNT(id) AS count
  FROM words
  WHERE lemma = ?
  GROUP BY pos_tag
  ORDER BY count DESC
  ```
- Collocation (preceding):
  ```sql
  SELECT T2.lemma, COUNT(T1.id) AS count
  FROM words AS T1
  JOIN words AS T2 ON T1.id = T2.id + 1
  WHERE T1.lemma = ?
  GROUP BY T2.lemma
  ORDER BY count DESC
  LIMIT 10
  ```

## Routing & basePath
- The site is exported statically with `basePath: '/greek-word-explorer'`.
- Client fetches and `sql.js` wasm loading respect `NEXT_PUBLIC_BASE_PATH` (set to `/greek-word-explorer` in `next.config.mjs`).

## Deploy (GitHub Pages)
- Workflow: `.github/workflows/deploy.yml` (native Pages actions)
- One-time repo setting: Settings → Pages → Build and deployment → Source: GitHub Actions
- Deploy: push to `main` (build → upload artifact → deploy)

## Project structure
```
.
├─ app/
│  ├─ [book]/
│  │  ├─ [chapter]/page.tsx        # SSG: reads preprocessed JSON from public/text
│  │  └─ layout.tsx                # 2‑panel shell + providers
│  ├─ layout.tsx
│  └─ page.tsx                     # redirects to /Matthew/1
├─ components/
│  ├─ layout/                      # Header, BookChapterSelector
│  ├─ providers/                   # SqlProvider, SelectionProvider
│  ├─ analysis/                    # WordDetail, LemmaDist, Concordance, Collocation
│  └─ TextPanel.tsx
├─ hooks/
│  └─ useDatabase.ts
├─ lib/
│  ├─ parsing.ts
│  └─ types.ts
├─ public/                         # Generated at build/preprocess
│  ├─ sblgnt.db
│  ├─ sql-wasm.wasm
│  └─ text/<Book>.json
├─ scripts/
│  ├─ preprocess.mjs
│  └─ copy-sql-wasm.mjs
└─ sblgnt_json/                    # Source corpus + paragraphs
```

## Notes
- The repo intentionally ignores generated assets (`public/sblgnt.db`, `public/text/*`, `sql-wasm.wasm`); CI builds them.
- Paragraph boundaries come from `sblgnt_json/paragraphs/<Book>/*.json`. If missing, fallback is 1 verse = 1 paragraph.
