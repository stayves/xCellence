# xCellence Robotics: Full Website Refactor Prompt

> Paste this whole file into a fresh Claude Code session opened in `C:\deuwxjsk\xCellence`.
> Order is deliberate: stable context first, phase tasks last (cache-friendly for long sessions).

---

## ROLE

You are a senior brand-and-frontend lead with the combined skills of an art director, motion designer, performance engineer and accessibility specialist. You are refactoring the website of a student robotics lab. You make decisions, you do not hand back menus of options. Where a decision is genuinely the team's (listed under OPEN DECISIONS), pick the stated default, mark it `TODO(confirm)` in code, and keep going.

## OBJECTIVE

Fully refactor the site so that it:
1. Looks authentic, professional and premium: the kind of site a sponsor, a school director or a ministry representative opens and thinks "these people are serious".
2. Does its real jobs: (a) win sponsors and partners, (b) recruit students, (c) show the lab's results and social impact, (d) share knowledge (articles, resources, calendar).
3. Repositions the brand from "an FTC team site" to **a general robotics lab** that competes in FTC and also FLL and WRO.
4. Loads fast, with no visible top-to-bottom or left-to-right image painting.
5. Is accessible (WCAG 2.2 AA) and works in English, Russian and Kazakh.

## WHO WE ARE (verified from the project files, do not invent beyond this)

- A robotics lab at Nazarbayev Intellectual School (NIS), Astana-Nura, Kazakhstan. The sponsorship PDF calls it "NIS Nura Robotics Lab". The team flag in the pitch deck reads "xCellence Robotics".
- **Two FTC teams:**
  - **xCellence**: orange / black / white. Mascot: **red panda**. Handle `@xcellence_ftc`. Logo: black monoline robot-"X" with antenna and diamond eyes (`frontend/public/xCellence.png`, black only, so you must produce orange and white variants).
  - **xCeption**: blue / black / white. Mascot: **regular (giant) panda**. Handle `@xception.ftc`. Logo exists only inside the PDF; extract it.
- Programs beyond FTC, confirmed by articles and the calendar page: FLL (the `xAct` framework), WRO RoboSport, WRO RoboMission Senior (international prize at Singapore).
- Results (from the sponsorship PDF, page 3):
  - xCeption: Finalist Alliance Captain 2x · Innovate Award · Control Award 2nd Place · Control Award Winner · Ladies FIRST Regional winner · Winning Alliance Captain 2x · Inspire Award 2nd place · **Think Award 3rd place at the FIRST World Championship**.
  - xCellence: Winning Alliance Captain 2x · Inspire Award 3rd place · Inspire Award 2nd place · Think Award winner · Design Award winner · Think Award 2nd place.
- Social impact (pitch deck, slide with polaroids): mentoring 90+ people across FTC and FLL teams · meeting with the Chairman of the Senate · presentation to President Tokayev · Astana Innovation Forum (150 participants, 100 guests, 130+ startups) · kindergarten robotics, 2x/week, 15 kids, 35 hours delivered · WRO UTC (45 participants from 7 cities, 7 days).
- Current hero stats on the site: 190 people engaged offline · 29,000 online · 105+ event hours. Keep unless the deck contradicts them.
- Voice from the sponsorship PDF: confident, warm, team-first. Tagline energy: "Our success is built together!"

## WHAT IS WRONG TODAY (measured, not guessed)

Stack: Vite 7 + React 19 + TypeScript + react-router 7 + i18next (en/ru/kk) + Vercel Analytics. Routes: `/`, `/team`, `/events`, `/trainer` (mecanum driver simulator, 915 lines), `/calendar`, `/resources`, `/blog`, `/blog/:slug`, `/hall-of-fame`, `/contact`. Light/dark theme stored under `xcellence-theme`. Builds to `../docs` with base `/xCellence/` (GitHub Pages) or `dist` with base `/` (Vercel).

| Problem | Evidence |
|---|---|
| Images are enormous | `frontend/public` = **252 MB / 150 images; 70 are over 1 MB.** Worst: `Background1-mobile.png` 15.3 MB (5646x9249), `Background2-mobile.png` 10.8 MB, `Arduino.png` 9.3 MB, `1.png`..`18.png` ~4.5 MB each (1480x2100), team photos up to 5712x4284, headshots ~3 MB each. |
| That is why images paint line by line | Big PNG/JPEG decoded progressively, no `width`/`height`, no placeholder, no `srcset`, no WebP/AVIF, only ~7 `loading=` attributes across all pages. The hero carousel swaps 3-5 MB photos with `key={src}` every 5 s. |
| The mobile background is a 15 MB PNG set from `main.tsx` via CSS variables | `applyBaseAssets()` in `src/main.tsx`. |
| Build output is committed and triplicated | `public/` (252 MB), `frontend/dist` (97 MB), `docs/` (174 MB). Duplicates such as `arnur copy.jpg`, `vagiz - Copy.jpg`, `deti 2 copy.jpg`, `vite copy.svg`, `.HEIC` files, and `.docx` files inside `public/`. |
| Font never loads | CSS names `Inter` but there is no `@import` or `<link>`; everyone sees the system fallback. `index.html` has no description, OG tags, theme-color or favicon sizes. |
| Brand is FTC-only | ~40 FTC/FIRST-Tech mentions in `en.json`; footer says "xCellence FTC Team"; hero subtitle "Robotics Team"; events hero "journey through the FTC season". |
| One brand, one color | A single orange-on-black system. There is no xCeption identity and no use of the mascots anywhere. |
| Partner materials never reach the site | The sponsorship proposal and pitch deck contain the best visuals and strongest numbers; the site shows none of them. |

## HARD CONSTRAINTS (violating any of these fails the task)

1. **Do not change the text of the articles.** In all three locale files, the subtrees `blog.posts` and `blog.articlesBySlug` (and everything they contain, including image captions and alt text) must stay **byte-identical**. Before touching anything, write `scripts/verify-articles.mjs` that hashes those subtrees for en/ru/kk and compares against a committed snapshot. Run it after every phase. Also leave `docs/*.txt` and `docs/*.docx` content alone. You may restyle how articles render (typography, layout, images). You may not edit their words.
2. **No invented facts.** Every number, award, partner and claim on the site must trace to a file in this repo (PDF, PPTX, locale files, articles). If something is missing, leave a visible `TODO(confirm)` in code, never a plausible fake.
3. **Official FIRST assets follow FIRST rules.** `first-biobuzz-*.zip` and `ftc-biobuzz-social-media-toolkit.pptx` are the 2026-27 FTC season kit (BIOBUZZ presented by RTX, `#BIOBUZZ #FIRSTCANOPY`). Use them only where the site talks about the FTC season: BIOBUZZ is always in caps, TM on first mention, "presented by RTX" on first body mention, logos never recolored, distorted or separated, use the supplied white/black wordmark files unmodified. Keep the existing FIRST trademark lines in the footer.
4. **Do not rebuild or re-draw the mascots or logos from scratch.** Extract the existing art from the PDF/PPTX and vectorize or clean it. Generated art may support them (backgrounds, textures, extra poses derived from the originals) but never replace them.
5. **No fake photography.** People, robots, venues and events are shown only with real photos from the repo. Image generation is for textures, gradient fields, pattern plates, icon-scale illustrations and mascot poses, never for "team photos".
6. **Trilingual.** Every new string goes through `i18next` with keys in `en.json`, `ru.json` and `kk.json`. Kazakh Cyrillic glyphs (Ә Ғ Қ Ң Ө Ұ Ү Һ І) must render in every font you choose; verify them, not assume. Mark machine-written Kazakh as `TODO(native-review)`.
7. Keep working: both deploy targets (GitHub Pages base `/xCellence/` and Vercel base `/`), the `/trainer` simulator, the calendar logic, and the light/dark preference.
8. Work on a branch (`refactor/brand-v2`). Commit per phase. Never delete original masters; move them out of `public/` to `assets-src/` (add to `.gitignore` or Git LFS, ask which).

## BRAND SYSTEM TO BUILD

**Architecture: one lab master brand, two team "skins."**

- **Master (lab):** neutral black / off-white with *both* accents, used on shared pages (Home, Events, Calendar, Resources, Blog, Hall of Fame, Contact). Wordmark: `xCellence` + descriptor "Robotics Lab". Open decision #1 sets the final name.
- **Team skins:** implement as CSS custom properties switched by `data-team="xcellence" | "xception"` on a section or page root.
  - xCellence: orange `#FF5A1F` family, black, white. Sample the exact orange from `XLNCpitchdec.pptx` media (`image2.png`, `image7.png`) rather than trusting this hex.
  - xCeption: electric blue family, black, white. Sample from the PDF cover render.
  - Tokens: `--team-accent`, `--team-accent-ink`, `--team-glow`, `--team-surface`, `--team-gradient`, plus mascot and texture URLs. No hard-coded team colors in component CSS.
- **Visual language (taken from the partner materials, not invented):**
  - From the PDF: spray-paint / graffiti texture, glowing blue-to-orange gradient fields, hand-lettered display headings, mascots peeking in from the corners.
  - From the pitch deck: black canvas, large orange quarter-circle and blob shapes, bold white sans headlines, **polaroid-style photo cards** with slight rotation, big numbers.
  - Combine into one disciplined system: graffiti energy for display moments, a clean grotesque for everything readable. Do not let the texture touch body copy.
- **Typography:** one display face with personality plus one variable text face, both self-hosted (WOFF2, subsetted for Latin + Cyrillic + Kazakh, `font-display: swap`, preloaded). Fix the dead `Inter` reference. Test all three languages' longest headings at 320 px width.
- **Logo set:** produce SVG (trace the PNG) of the xCellence logo in orange, white and black; extract and clean xCeption's logo; produce lockups (lab, xCellence, xCeption, both side by side) and a favicon/app-icon set. Add OG images (1200x630) per team plus one for the lab.

## INFORMATION ARCHITECTURE

Keep the existing routes working; reorganize what's on them.

1. **Home:** *Split hero* as the signature moment: diagonal split, blue left / orange right, xCeption panda and xCellence red panda peeking from opposite corners (as on the PDF cover). Hover/focus/tap a side and it expands, re-skins the page accent and reveals that team's one-line pitch and CTA. Default (no interaction) shows the lab headline and both teams equally. Below: animated stats strip, "What we do" (FTC / FLL / WRO as three program cards), results highlights, social-impact polaroid wall, latest articles (title and excerpt only, text unchanged), partners marquee, one clear sponsor/recruit CTA pair.
2. **Teams:** new `/teams` overview with `/teams/xcellence` and `/teams/xception` sub-pages, each in its own skin: story, achievements timeline, robot, members. Keep `/team` redirecting. Which member belongs to which team is unknown from the repo, so see open decision #2 and do not guess.
3. **Partners / Sponsor** (`/partners`, new): rebuild the sponsorship proposal as a web page: about, what FIRST is, achievements, social impact, "our success is built together," how to support, contact. Add a "Download proposal (PDF)" button using a compressed copy of the PDF.
4. **Events, Calendar, Resources, Blog, Hall of Fame, Contact, Trainer:** restyle in the master system; rewrite only the UI chrome copy (heroes, labels, buttons, footer) to drop FTC-only wording while keeping FTC where it is factually FTC (awards, FTC season, FIRST trademark lines).
5. Header: logo, 6 or fewer top-level items (group the rest), language switch, theme switch, persistent "Partner with us" button. Footer: both teams' handles, lab description, FIRST trademark text. Remove or relocate the "Want to make your own website?" credit.

## MOTION AND VISUALS

Motion should explain and reward, never block. Target a "signature moments, quiet everywhere else" rhythm.

- **Hero:** panda mascots slide/peek in on load, blink and track the pointer slightly (Rive or layered SVG/CSS; choose whichever keeps JS under budget). Spray-paint reveal masks and a circuit-trace line that draws across the split.
- **Stats:** count-up once on enter, tabular numbers, no re-trigger.
- **Scroll:** subtle parallax on polaroid cards (rotate -3° to +3°, settle to level on hover), CSS scroll-driven animations where supported with an IntersectionObserver fallback.
- **Page transitions:** View Transitions API between routes, team-color wipe when switching between team pages.
- **Robot page:** exploded-view or line-draw animation of the robot, driven by real photos and specs, not a made-up diagram.
- **Micro-interactions:** buttons, cards, nav, focus rings, theme toggle. Apply the `make-interfaces-feel-better` principles: concentric radii, optical alignment, layered shadows, image outlines, tabular numbers, no `transition: all`.
- **Rules:** animate only `transform`, `opacity`, `filter` (sparingly); pause when off-screen; honor `prefers-reduced-motion` with a calm static equivalent (every animated moment must have one); no autoplay audio; no motion that carries essential information.

## IMAGE PIPELINE AND PERFORMANCE (this fixes the "paints left to right" problem)

Build `scripts/optimize-images.mjs` (sharp) that reads masters from `assets-src/` and emits to `public/img/`:
- AVIF + WebP + a JPEG fallback at widths 480 / 768 / 1280 / 1920 (portraits and cards: only sizes actually used).
- A tiny placeholder per image (ThumbHash or 24px blurred WebP inlined as `data:` URI) plus the dominant color.
- A generated manifest (`image-manifest.ts`) with intrinsic width/height, so layout never shifts.

Build one `<Picture>` component: `<picture>` with `srcset`/`sizes`, explicit `width`/`height`, `decoding="async"`, `loading="lazy"` (never on the LCP image), `fetchpriority="high"` + preload for the hero image, placeholder visible instantly and cross-faded to the real image on `load`/`decode()` so progressive painting is never seen. Use it everywhere; add a lint rule or test that fails on a raw `<img>` in `src/pages`.

Specific fixes:
- Replace the 15 MB and 10 MB mobile backgrounds with CSS gradients, an SVG/noise texture, or a <150 KB AVIF.
- Hero carousel: preload only the next slide, crossfade with opacity, first slide is the LCP element (<=120 KB AVIF at 1280 wide).
- Convert `1.png`..`18.png` (resource pages, ~80 MB total) to responsive WebP/AVIF plus lazy lightbox.
- Convert HEIC, delete true duplicates (`* copy.*`, `* - Copy.*`), remove `.docx`/`.txt` source files from `public/` (move to `assets-src/docs/`).
- Stop committing build output twice (`frontend/dist` and `docs/`). Ask which deploy target is canonical, then ignore the other.

**Budgets (enforce in CI or a `npm run budget` script):**
LCP < 2.0 s and CLS < 0.05 on throttled Slow-4G mobile · initial route JS < 170 KB gzip · no shipped image > 250 KB (hero <= 120 KB) · total `public/` < 40 MB · Lighthouse mobile Performance >= 90 on `/`.

## IMAGE GENERATION PLAN (use `imagegen` / `image-studio`; get approval before spending on batches)

Generate, then optimize through the same pipeline. Always feed the existing mascot/logo art as a reference to keep the style, and keep prompts and outputs in `assets-src/generated/PROMPTS.md`.
1. Spray-paint wall textures in the two palettes (tileable, dark, low contrast for text safety).
2. Gradient-field plates (blue→orange for the lab, single-color for team skins).
3. Circuit / blueprint line patterns for section dividers.
4. Mascot poses *derived from the originals*: wave, peek, thumbs-up, holding a wrench, asleep (for the 404 page and empty states). Transparent background, same linework as the source art. Show me the first set before generating more.
5. Icon-scale illustrations for FTC / FLL / WRO cards.
Do **not** generate: people, robots, venues, award certificates, sponsor logos, or anything labeled as a real event.

## SKILLS TO USE (invoke them at the matching phase)

`ui-skills` (interface constraints, used throughout) · `landing-page-design` (home and partners structure/copy) · `awwwards` (art direction and motion bar) · `make-interfaces-feel-better` (polish pass) · `frontend-design` and `baseline-ui` (component quality) · `better-icons` (icon set, consistent stroke) · `imagegen` / `image-studio` (assets above) · `web-performance-optimization`, `fixing-motion-performance` (budgets and animation cost) · `i18n-localization` (ru/kk handling) · `no-ai-slop`, `humanizer`, `anti-ai-slop-writing` (**only for new UI copy**, never for articles) · `fixing-accessibility`, `wcag-audit-patterns`, `screen-reader-testing` (a11y gate) · `fixing-metadata`, `seo-technical` (meta, OG, sitemap, structured data) · `playwright-skill` (screenshots, flows) · `jury` (independent final score; fix everything under 7/10). Also use the connected **inspo** MCP once (`recommend`, then one or two `search_screens`, then `get_screen` on 3-5 keepers) for composition references: dark robotics/engineering showcases and sports-team/sponsor pages. Take composition, not compliance.

## ACCESSIBILITY GATE (run `screen-reader-testing` against these)

- Landmarks, one `h1` per page, logical heading order, skip link, visible 3:1 focus rings in both skins.
- The split hero must be fully operable by keyboard and screen reader: the two halves are real `button`s or links with labels ("Explore team xCellence"), expanded state exposed via `aria-expanded`, no hover-only content.
- Contrast: AA for text on every skin, light and dark; orange-on-white and blue-on-black combos are the risky ones, so check each.
- Carousels: pause control, no auto-advance under reduced motion, announcements not spammy.
- Language: set `<html lang>` on change (`en`, `ru`, `kk`), `lang` on mixed-language fragments.
- Every informative image has real alt text (written from the photo or caption, not "image"); decorative ones `alt=""`.
- Test with NVDA + Firefox/Chrome and VoiceOver if available; record findings in `docs/a11y-report.md`.

## PHASES (stop at the end of each for a short checkpoint: what changed, evidence, what's next)

0. **Baseline.** Branch, snapshot articles hash, capture Lighthouse + screenshots of every route in all 3 languages, light and dark. Write `scripts/verify-articles.mjs`. Extract mascots/logos from the PDF/PPTX (`fitz`/zip) into `assets-src/brand/`.
1. **Foundation.** Image pipeline, `<Picture>`, fonts, tokens (master + two skins), repo hygiene (move masters, remove duplicates, fix ignore rules), meta/OG/favicons. Re-measure.
2. **Brand + shell.** Logo set, header/footer, theme/skin switching, copy rebrand of UI chrome in en/ru/kk (articles untouched).
3. **Home.** Split hero, stats, program cards, results, impact wall, articles teaser, partners, CTAs.
4. **Teams + Partners pages.**
5. **Remaining pages** (Events, Calendar, Resources, Blog, Hall of Fame, Contact, Trainer restyle).
6. **Motion + generated assets pass.** Add signature moments, mascot poses, page transitions, reduced-motion equivalents.
7. **Hardening.** Budgets, a11y gate, cross-browser (Chrome, Firefox, Safari/iOS), 320 / 768 / 1280 / 1920 widths, keyboard-only run-through, `jury` score, fix list.

## DEFINITION OF DONE

- `verify-articles.mjs` passes for en/ru/kk: article text is byte-identical to baseline.
- Budgets met on a throttled mobile run, with before/after numbers in `docs/perf-report.md`.
- No raw `<img>` in pages; no image > 250 KB shipped; hero has no visible progressive paint.
- Both team skins and the master skin pass AA contrast; reduced-motion mode is complete.
- Both deploy targets build and work (`/xCellence/` and `/`).
- `jury` returns >= 7/10 on every category, or the remaining gaps are listed with reasons.
- Final report: what changed, measured before/after, remaining `TODO(confirm)` and `TODO(native-review)` items.

## OPEN DECISIONS (use the default, mark `TODO(confirm)`, ask in the first checkpoint)

1. **Master-brand name.** The user calls the lab "xCellence" and one team is also "xCellence"; the PDF says "NIS Nura Robotics Lab"; the flag says "xCellence Robotics". *Default:* lab = **xCellence Robotics Lab**, teams = **xCellence** (orange) and **xCeption** (blue), with "NIS Nura Robotics Lab" as the descriptor in about/partner copy.
2. **Member-to-team mapping** for the Team pages is not in the repo. *Default:* one shared members grid on `/teams`, no per-team split until the team provides a list.
3. **Deploy target.** GitHub Pages (`docs/`) vs Vercel. *Default:* keep both building, but commit only one build output.
4. **Is it OK to put the President/Senate photos on the public site?** They are already in the pitch deck. *Default:* include them in the impact wall with the deck's captions.

## OUTPUT FORMAT

Work in the repo, commit per phase with clear messages, and at each checkpoint reply with: **Done · Evidence (numbers/screenshots) · Risks · Next**. No marketing language, no emojis, no explanations of your methodology.
