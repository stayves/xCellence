// Reads masters from ../assets-src/images, writes AVIF/WebP/JPEG at several widths to public/img,
// plus src/generated/image-manifest.json (intrinsic size, dominant color, tiny blur placeholder).
// Incremental: skips an image when its outputs are newer than the master.
import sharp from 'sharp';
import { readdir, mkdir, stat, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, '..', 'assets-src', 'images');
const OUT = path.join(root, 'public', 'img');
const MANIFEST = path.join(root, 'src', 'generated', 'image-manifest.json');
const WIDTHS = [480, 960, 1600];
const FALLBACK_W = 960;
const EXT = /\.(jpe?g|png|webp)$/i;

await mkdir(OUT, { recursive: true });
await mkdir(path.dirname(MANIFEST), { recursive: true });

let prev = {};
try { prev = JSON.parse(await readFile(MANIFEST, 'utf8')); } catch { /* first run */ }

const files = (await readdir(SRC)).filter((f) => EXT.test(f)).sort();
const seen = new Map(); // content hash -> first name (drop exact duplicates)
const manifest = {};
const key = (f) => f.replace(/\.[^.]+$/, '');
const slug = (f) => key(f).replace(/[^A-Za-z0-9_-]+/g, '-').toLowerCase();

async function work(file) {
  const abs = path.join(SRC, file);
  const buf = await readFile(abs);
  const hash = createHash('md5').update(buf).digest('hex');
  if (seen.has(hash)) { manifest[file] = { alias: seen.get(hash) }; return; }
  seen.set(hash, file);

  const s = slug(file);
  const st = await stat(abs);
  const old = prev[file];
  if (old && old.mtime === st.mtimeMs && old.slug === s) { manifest[file] = old; return; }

  const img = sharp(buf, { failOn: 'none' }).rotate();
  const meta = await img.metadata();
  const w0 = meta.width, h0 = meta.height;
  let hasAlpha = Boolean(meta.hasAlpha);
  if (hasAlpha) { const st2 = await img.stats(); hasAlpha = st2.channels[3]?.min < 250; } // opaque PNGs are photos
  const widths = WIDTHS.filter((w) => w < w0);
  if (!widths.includes(Math.min(w0, WIDTHS.at(-1)))) widths.push(Math.min(w0, WIDTHS.at(-1)));
  widths.sort((a, b) => a - b);

  for (const w of widths) {
    const base = sharp(buf, { failOn: 'none' }).rotate().resize({ width: w, withoutEnlargement: true });
    await Promise.all([
      base.clone().avif({ quality: 50, effort: 3 }).toFile(path.join(OUT, `${s}-${w}.avif`)),
      base.clone().webp({ quality: 66, effort: 4 }).toFile(path.join(OUT, `${s}-${w}.webp`)),
    ]);
  }
  const fw = hasAlpha ? widths[0] : widths.reduce((a, w) => (Math.abs(w - FALLBACK_W) < Math.abs(a - FALLBACK_W) ? w : a), widths[0]);
  const fb = sharp(buf, { failOn: 'none' }).rotate().resize({ width: fw, withoutEnlargement: true });
  await (hasAlpha ? fb.png({ palette: true, quality: 80 }) : fb.jpeg({ quality: 68, mozjpeg: true }))
    .toFile(path.join(OUT, `${s}-fallback.${hasAlpha ? 'png' : 'jpg'}`));

  const tiny = await sharp(buf, { failOn: 'none' }).rotate().resize(16).webp({ quality: 40 }).toBuffer();
  const { dominant } = await sharp(buf, { failOn: 'none' }).rotate().resize(64).stats();
  manifest[file] = {
    slug: s, mtime: st.mtimeMs, w: w0, h: h0, alpha: hasAlpha, widths, fallback: hasAlpha ? 'png' : 'jpg',
    color: `#${[dominant.r, dominant.g, dominant.b].map((c) => c.toString(16).padStart(2, '0')).join('')}`,
    blur: `data:image/webp;base64,${tiny.toString('base64')}`,
  };
}

// small concurrency pool
const queue = [...files];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (queue.length) {
    const f = queue.shift();
    try { await work(f); process.stdout.write('.'); } catch (e) { console.error(`\n! ${f}: ${e.message}`); }
  }
}));

// resolve aliases (exact duplicates) to their canonical manifest entry
for (const [f, v] of Object.entries(manifest)) if (v.alias) manifest[f] = manifest[v.alias];
await writeFile(MANIFEST, JSON.stringify(manifest));
console.log(`\n${Object.keys(manifest).length} images -> ${OUT}`);
