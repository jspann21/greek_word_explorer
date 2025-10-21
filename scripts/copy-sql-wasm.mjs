import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = join(__dirname, '..', 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm');
const destDir = join(__dirname, '..', 'public');
const dest = join(destDir, 'sql-wasm.wasm');

await mkdir(destDir, { recursive: true });
await copyFile(src, dest);
console.log('Copied sql-wasm.wasm to public/');


