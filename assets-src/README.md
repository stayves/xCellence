# assets-src

Full-resolution masters. Nothing here is shipped to visitors.

- `images/`: every photo and graphic used by the site, at original size. `npm run optimize:images` (also runs before every build) turns them into AVIF/WebP/JPEG at 480/960/1600 px in `frontend/public/img/` and writes `frontend/src/generated/image-manifest.json` (intrinsic size, dominant colour, blur placeholder).
- `brand/`: logo variants (white / orange / blue / black) and the raw images extracted from the sponsorship PDF in `brand/pdf/`.
- `docs/`: the source text of the articles (.txt/.docx). The live text is in `frontend/src/locales/*.json`.
- `generated/`: reserved for generated art and its prompts (none yet).

To add a photo: drop it in `images/`, run `npm run optimize:images`, reference it by file name (`<Picture src="my-photo.jpg" ... />`).
