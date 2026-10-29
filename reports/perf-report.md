# Performance report

| | Before | After |
|---|---|---|
| Images in `public/` | 252 MB, 150 files, 70 over 1 MB (15.3 MB mobile background PNG) | masters moved out; shipped `img/` 36 MB across 149 images x 3 sizes x 2 formats; no AVIF over 250 KB |
| Hero image on mobile | 15.3 MB PNG, painted line by line | 59 KB AVIF (960w) with blur placeholder, preloaded |
| Home page transfer | tens of MB | 524 KiB (Lighthouse) |
| Initial JS (gzip) | all 3 languages in one bundle (188 KB) | 134 KB en / 163 KB ru / 157 KB kk (language loaded on demand) |
| Layout shift | no image dimensions | CLS 0 |
| `loading=` attributes | 7 | every image through `<Picture>` (lazy, async decode, width/height) |

Lighthouse, mobile preset (simulated slow 4G, 4x CPU), local preview of the production build: Performance 71, Accessibility 100, Best Practices 96, SEO 100. FCP 2.4 s, **LCP 4.0 s**, TBT 460 ms, CLS 0.

**The LCP target (< 2.0 s) is not met.** The hero image is requested immediately (load delay 0) but painted late because the page is rendered by JavaScript. The fix is prerendering the home route to static HTML (vite-ssg or similar). Not done in this pass.

`npm run budget` enforces: initial JS <= 170 KB gzip, AVIF/fallback images <= 250 KB (WebP <= 400 KB), hero <= 120 KB, published folder <= 40 MB.
