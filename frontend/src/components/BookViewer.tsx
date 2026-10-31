import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import Picture from './Picture';
import { prefersReducedMotion } from '../utils/motion.ts';
import './BookViewer.css';

type Spread = [number | null, number | null];
type Flip = { dir: 'next' | 'prev'; from: number; to: number };
type Props = { pages: string[]; startPage?: number; onClose: () => void };

const FLIP_MS = 900;
// One `sizes` value for every page image, so preloaded neighbours hit the same srcset candidate.
const PAGE_SIZES = '(min-width: 900px) 40vw, 92vw';

/** Cover alone on the right, interior pages in pairs, back cover alone on the left. */
const buildSpreads = (n: number): Spread[] => {
  const spreads: Spread[] = [[null, 0]];
  for (let i = 1; i < n - 1; i += 2) spreads.push([i, i + 1 < n - 1 ? i + 1 : null]);
  if (n > 1) spreads.push([n - 1, null]);
  return spreads;
};

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
};

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

/**
 * Full-screen picture-book reader.
 * Wide screens: two-page spreads with a 3D page turn. Narrow screens: one page, swipe or tap the edges.
 */
const BookViewer = ({ pages, startPage = 0, onClose }: Props) => {
  const { t } = useTranslation();
  const spreadMode = useMediaQuery('(min-width: 900px) and (min-height: 560px)');
  const spreads = useMemo(() => buildSpreads(pages.length), [pages.length]);
  const [page, setPage] = useState(startPage);
  const [flip, setFlip] = useState<Flip | null>(null);
  const [enter, setEnter] = useState<'next' | 'prev' | null>(null);
  const [drag, setDrag] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const thumbsRef = useRef<HTMLOListElement>(null);
  const flipTimer = useRef(0);
  const dragStart = useRef<{ x: number; moved: boolean } | null>(null);

  const total = pages.length;
  const spreadIdx = Math.max(0, spreads.findIndex(([l, r]) => l === page || r === page));
  const visible = spreadMode ? spreads[spreadIdx].filter((p): p is number => p !== null) : [page];
  const atStart = spreadMode ? spreadIdx === 0 : page === 0;
  const atEnd = spreadMode ? spreadIdx === spreads.length - 1 : page === total - 1;
  const pageAlt = (i: number) => t('resources.book.pageAlt', { current: i + 1 });

  const go = useCallback((dir: 'next' | 'prev') => {
    const step = dir === 'next' ? 1 : -1;
    if (!spreadMode) {
      const target = page + step;
      if (target < 0 || target >= total) return;
      setEnter(dir);
      setPage(target);
      return;
    }
    if (flip) return;
    const target = spreadIdx + step;
    if (target < 0 || target >= spreads.length) return;
    const [l, r] = spreads[target];
    const targetPage = (l ?? r) as number;
    if (prefersReducedMotion()) { setPage(targetPage); return; }
    setFlip({ dir, from: spreadIdx, to: target });
    flipTimer.current = window.setTimeout(() => {
      setPage(targetPage);
      setFlip(null);
    }, FLIP_MS);
  }, [flip, page, spreadIdx, spreadMode, spreads, total]);

  const goTo = (target: number) => {
    window.clearTimeout(flipTimer.current);
    setFlip(null);
    setEnter(target > page ? 'next' : 'prev');
    setPage(target);
  };

  // Lock page scroll, move focus into the dialog, give it back on close.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      window.clearTimeout(flipTimer.current);
      opener?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go('next');
      else if (e.key === 'ArrowLeft') go('prev');
      else if (e.key === 'Tab') {
        // Keep focus inside the dialog
        const items = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled])');
        if (!items?.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, onClose]);

  // Keep the current thumbnail in view
  useEffect(() => {
    thumbsRef.current?.querySelector('[aria-current="true"]')?.scrollIntoView({
      inline: 'center', block: 'nearest', behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }, [page]);

  // Single-page mode: drag to turn, tap the outer thirds to step.
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragStart.current = { x: e.clientX, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    if (Math.abs(dx) > 6) dragStart.current.moved = true;
    const blocked = (dx > 0 && page === 0) || (dx < 0 && page === total - 1);
    setDrag(blocked ? dx * 0.25 : dx);
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const start = dragStart.current;
    dragStart.current = null;
    setDrag(0);
    if (!start) return;
    const dx = e.clientX - start.x;
    if (start.moved) {
      if (dx < -60) go('next');
      else if (dx > 60) go('prev');
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    const at = (e.clientX - r.left) / r.width;
    if (at < 0.35) go('prev');
    else if (at > 0.65) go('next');
  };

  // `priority` skips Picture's fade-in, so a page doesn't flash when it moves between slots after a turn.
  const pageImage = (i: number) => <Picture key={pages[i]} src={pages[i]} alt={pageAlt(i)} fill priority sizes={PAGE_SIZES} />;

  const renderSpread = () => {
    let [left, right] = spreads[spreadIdx];
    let flipper: { front: number | null; back: number | null; side: 'left' | 'right' } | null = null;
    if (flip) {
      const [fl, fr] = spreads[flip.from];
      const [tl, tr] = spreads[flip.to];
      if (flip.dir === 'next') { left = fl; right = tr; flipper = { front: fr, back: tl, side: 'right' }; }
      else { left = tl; right = fr; flipper = { front: fl, back: tr, side: 'left' }; }
    }
    // A lone cover sits centred, like a closed book
    const [sl, sr] = spreads[flip ? flip.to : spreadIdx];
    const shift = sl === null ? '-25%' : sr === null ? '25%' : '0%';

    return (
      <div className="bv-book" style={{ ['--shift' as string]: shift, ['--flip-ms' as string]: `${FLIP_MS}ms` }} data-single={sl === null || sr === null}>
        <div className={`bv-page bv-page--left ${left === null ? 'is-blank' : ''}`} onClick={() => go('prev')}>
          {left !== null && pageImage(left)}
        </div>
        <div className={`bv-page bv-page--right ${right === null ? 'is-blank' : ''}`} onClick={() => go('next')}>
          {right !== null && pageImage(right)}
        </div>
        {flipper && (
          <div key={`${flip?.from}-${flip?.to}`} className={`bv-flip bv-flip--${flipper.side}`} aria-hidden="true">
            <div className={`bv-flip__face bv-flip__face--front ${flipper.front === null ? 'is-blank' : ''}`}>
              {flipper.front !== null && pageImage(flipper.front)}
            </div>
            <div className={`bv-flip__face bv-flip__face--back ${flipper.back === null ? 'is-blank' : ''}`}>
              {flipper.back !== null && pageImage(flipper.back)}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSingle = () => (
    <div
      className="bv-single"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => { dragStart.current = null; setDrag(0); }}
    >
      <div
        key={page}
        className={`bv-page bv-page--solo ${enter ? `bv-enter-${enter}` : ''}`}
        style={drag ? { transform: `translateX(${drag}px) rotateY(${drag * -0.04}deg)`, transition: 'none' } : undefined}
      >
        {pageImage(page)}
      </div>
    </div>
  );

  // Warm the cache for the pages one turn away in either direction
  const preload = spreadMode
    ? [spreads[spreadIdx - 1], spreads[spreadIdx + 1]].flat().filter((p): p is number => typeof p === 'number')
    : [page - 1, page + 1, page + 2].filter((p) => p >= 0 && p < total);

  const label = visible.length > 1 ? `${visible[0] + 1}–${visible[1] + 1}` : String(visible[0] + 1);

  // Portalled to <body>: a transformed ancestor (e.g. mid-reveal) would otherwise trap the fixed overlay.
  return createPortal(
    <div ref={dialogRef} className="bv" role="dialog" aria-modal="true" aria-label={t('resources.book.viewer')}>
      <div className="bv__backdrop" onClick={onClose} />

      <header className="bv__bar">
        <div className="bv__title">
          <strong>{t('resources.book.title')}</strong>
          <span aria-live="polite">{t('resources.book.pageLabel', { current: label, total })}</span>
        </div>
        <button ref={closeRef} type="button" className="bv__icon-btn" onClick={onClose} aria-label={t('resources.book.close')}>
          <Icon d="M6 6l12 12M18 6L6 18" />
        </button>
      </header>

      <div className="bv__stage">
        {spreadMode ? renderSpread() : renderSingle()}
        <button type="button" className="bv__icon-btn bv__arrow bv__arrow--prev" onClick={() => go('prev')} disabled={atStart} aria-label={t('resources.book.prev')}>
          <Icon d="M15 5l-7 7 7 7" />
        </button>
        <button type="button" className="bv__icon-btn bv__arrow bv__arrow--next" onClick={() => go('next')} disabled={atEnd} aria-label={t('resources.book.next')}>
          <Icon d="M9 5l7 7-7 7" />
        </button>
      </div>

      <footer className="bv__foot">
        <div className="bv__progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${(visible[visible.length - 1] + 1) / total})` }} />
        </div>
        <ol ref={thumbsRef} className="bv__thumbs" aria-label={t('resources.book.thumbs')}>
          {pages.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                className="bv__thumb"
                onClick={() => goTo(i)}
                aria-current={visible.includes(i) ? 'true' : undefined}
                aria-label={pageAlt(i)}
              >
                <Picture src={src} alt="" fill sizes="64px" />
                <span aria-hidden="true">{i + 1}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="bv__hint">{spreadMode ? t('resources.book.keys') : t('resources.book.swipe')}</p>
      </footer>

      <div className="bv__preload" aria-hidden="true">
        {preload.map((i) => (
          <div key={i}>{pageImage(i)}</div>
        ))}
      </div>
    </div>,
    document.body,
  );
};

export default BookViewer;
