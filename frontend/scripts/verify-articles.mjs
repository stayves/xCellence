// Fails if blog.posts / blog.articlesBySlug differ from the committed baseline in any locale.
// Usage: node scripts/verify-articles.mjs [--update]
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SNAP = path.join(dir, 'scripts', 'articles.snapshot.json');
const stable = (v) => JSON.stringify(v, (_, x) => (x && typeof x === 'object' && !Array.isArray(x)
  ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, x[k]])) : x));
const hash = (v) => createHash('sha256').update(stable(v)).digest('hex');

const current = {};
for (const lng of ['en', 'ru', 'kk']) {
  const j = JSON.parse(await readFile(path.join(dir, 'src', 'locales', `${lng}.json`), 'utf8'));
  current[lng] = { posts: hash(j.blog.posts), articlesBySlug: hash(j.blog.articlesBySlug) };
}
if (process.argv.includes('--update')) {
  await writeFile(SNAP, JSON.stringify(current, null, 2));
  console.log('snapshot written');
} else {
  const base = JSON.parse(await readFile(SNAP, 'utf8'));
  let bad = 0;
  for (const lng of Object.keys(current)) for (const k of Object.keys(current[lng]))
    if (base[lng]?.[k] !== current[lng][k]) { console.error(`CHANGED: ${lng}.blog.${k}`); bad++; }
  if (bad) process.exit(1);
  console.log('articles byte-identical in en/ru/kk');
}
