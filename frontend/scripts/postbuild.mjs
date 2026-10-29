// GitHub Pages has no SPA fallback: serve index.html for unknown paths by shipping it as 404.html too.
import { copyFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
for (const out of [path.join(root, '..', 'docs'), path.join(root, 'dist')]) {
  try {
    await access(path.join(out, 'index.html'));
    await copyFile(path.join(out, 'index.html'), path.join(out, '404.html'));
    console.log('404.html written to', path.basename(out));
  } catch { /* that target was not built */ }
}
