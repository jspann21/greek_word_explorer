import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, 'out');

// Create .nojekyll to prevent GitHub Pages from ignoring _next folder
await writeFile(join(OUT_DIR, '.nojekyll'), '');
console.log('Created .nojekyll in out/');

