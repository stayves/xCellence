// Performance budget gate. Run after `npm run build` (reads ./dist, or ../docs with --docs).
// Fails (exit 1) when a budget is exceeded, so it can run in CI.
import { readdir, stat, readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = process.argv.includes('--docs') ? path.join(root, '..', 'docs') : path.join(root, 'dist');
const KB = 1024;
const BUDGET = {
  initialJsGzipKB: 170, // entry chunk + first language bundle
  maxImageKB: 250, // AVIF (served to ~95% of browsers) and fallbacks stay under this
  maxWebpKB: 400, // WebP is only the second tier for browsers without AVIF
  heroImageKB: 120, // graffiti hero wall at its largest served width on mobile (960w) must stay small
  publicTotalMB: 40,
};

const walk = async (d) => {
  const out = [];
  for (const e of await readdir(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
};

const files = await walk(dir);
const sizes = await Promise.all(files.map(async (f) => ({ f, size: (await stat(f)).size })));
const rel = (f) => path.relative(dir, f).replaceAll('\\', '/');
const fails = [];
const rows = [];

// 1. Initial JS: the entry chunk plus the English bundle (worst case Russian is larger; both are checked)
const html = await readFile(path.join(dir, 'index.html'), 'utf8');
const entry = html.match(/assets\/index-[\w-]+\.js/)?.[0];
const gz = async (name) => gzipSync(await readFile(path.join(dir, name))).length / KB;
if (entry) {
  const entryKB = await gz(entry);
  const langs = files.map(rel).filter((n) => /assets\/(en|ru|kk)-[\w-]+\.js$/.test(n));
  const v2 = files.map(rel).filter((n) => /assets\/v2\.(en|ru|kk)-[\w-]+\.js$/.test(n));
  for (const code of ['en', 'ru', 'kk']) {
    const base = langs.find((n) => n.includes(`/${code}-`));
    const extra = v2.find((n) => n.includes(`/v2.${code}-`));
    const total = entryKB + (base ? await gz(base) : 0) + (extra ? await gz(extra) : 0) + (code === 'en' ? 0 : (await gz(langs.find((n) => n.includes('/en-')))) + (await gz(v2.find((n) => n.includes('/v2.en-')))));
    rows.push([`initial JS gzip (${code})`, `${total.toFixed(0)} KB`, `<= ${BUDGET.initialJsGzipKB} KB`]);
    if (total > BUDGET.initialJsGzipKB) fails.push(`initial JS (${code}) ${total.toFixed(0)} KB > ${BUDGET.initialJsGzipKB} KB`);
  }
}

// 2. Images
const imgs = sizes.filter(({ f }) => /\.(avif|webp|jpe?g|png)$/i.test(f) && !/(favicon|apple-touch|icon-512|og-)/.test(f));
const heavy = imgs.filter(({ f, size }) => size > (/\.webp$/i.test(f) ? BUDGET.maxWebpKB : BUDGET.maxImageKB) * KB);
rows.push(['images over budget (AVIF/fallback 250 KB, WebP 400 KB)', String(heavy.length), '0']);
heavy.slice(0, 8).forEach(({ f, size }) => rows.push([`  ${rel(f)}`, `${(size / KB).toFixed(0)} KB`, '']));
if (heavy.length) fails.push(`${heavy.length} image(s) over budget`);

const hero = sizes.find(({ f }) => /graffiti-cover-960\.avif$/.test(f));
if (hero) {
  rows.push(['hero wall (960w AVIF)', `${(hero.size / KB).toFixed(0)} KB`, `<= ${BUDGET.heroImageKB} KB`]);
  if (hero.size > BUDGET.heroImageKB * KB) fails.push(`hero wall ${(hero.size / KB).toFixed(0)} KB > ${BUDGET.heroImageKB} KB`);
}

// 3. Whole publish folder
const total = sizes.reduce((a, b) => a + b.size, 0) / (KB * KB);
rows.push(['published folder', `${total.toFixed(1)} MB`, `<= ${BUDGET.publicTotalMB} MB`]);
if (total > BUDGET.publicTotalMB) fails.push(`published folder ${total.toFixed(1)} MB > ${BUDGET.publicTotalMB} MB`);

console.table(rows.map(([name, value, limit]) => ({ check: name, value, budget: limit })));
if (fails.length) {
  console.error('\nBUDGET FAILED:\n - ' + fails.join('\n - '));
  process.exit(1);
}
console.log('\nAll budgets met.');
