# Accessibility report

Automated: axe-core 4 (WCAG 2.0/2.1/2.2 A and AA rule sets) on 14 routes (home, teams, both team pages, partners, events, blog, one article, members, calendar, resources, hall of fame, contact, trainer), in dark en/ru/kk and light en, against the GitHub Pages build. **0 violations.** Lighthouse accessibility: 100.

Before fixes the audit found only colour-contrast failures (white on orange chips, legacy orange text on white in light theme, xCeption blue 4.38:1). Fixed by: blue `#2563eb` (white text 5.2:1), light-theme text orange `#b9380b` (5.8:1 on white), accessible text/fill pairs from `--team-on-accent`, neutral text on tinted chips, decorative numbers moved into CSS `content`.

Behaviour checked by script: skip link, one `h1` per page, `<html lang>` follows the language switch, keyboard focus on a hero team button expands that side (no hover-only content), `prefers-reduced-motion` shows every reveal at once, stops the marquee and the hero split animation.

NOT done: a manual NVDA / VoiceOver pass. Automated tools find roughly a third of real issues. Do a screen-reader run on the home split hero, the Explore menu and the Resources flipbook before relying on this.
