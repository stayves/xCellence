# xCellence Robotics Lab website

React 19 + Vite + TypeScript, three languages (en / ru / kk).

## Run
```bash
cd frontend
npm install
npm run dev            # http://localhost:5173/xCellence/
```

## Build and checks
```bash
npm run build          # optimizes images, verifies articles, builds to ../docs (GitHub Pages, base /xCellence/)
VERCEL=1 npm run build # builds to ./dist with base /  (what Vercel does)
npm run budget         # performance budget gate on ./dist  (add --docs for ../docs)
npm run verify:articles
```
`npm run build` fails if the article text in `src/locales/{en,ru,kk}.json` (`blog.posts`, `blog.articlesBySlug`) differs from `scripts/articles.snapshot.json`. After an intentional article edit run `node scripts/verify-articles.mjs --update`.

## Where things live
- `assets-src/`: full-size photos and brand files (see its README). Never put big images in `frontend/public`.
- `src/styles/tokens.css`: colours, type, radii, light/dark themes and the two team skins (`data-team="xcellence" | "xception"`). Use `--team-*` tokens, not hard-coded colours.
- `src/components/Picture.tsx`: use it for every photo (responsive AVIF/WebP, blur-up, no layout shift).
- `src/locales/{en,ru,kk}.json`: original strings. `src/locales/v2.*.json`: refactor strings that override or extend them. Kazakh in `v2.kk.json` needs native review.
- Pages: `src/pages/` (Home, Teams, Partners are new; the rest were restyled).
- Team numbers, award lists and partner packages come from the sponsorship PDF and business deck; edit them in `v2.*.json`.

## Deploy
GitHub Pages serves `docs/` (commit the build output); `404.html` is generated so deep links work. Vercel builds `frontend` with `VERCEL=1`.
