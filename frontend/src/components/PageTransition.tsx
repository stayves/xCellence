import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RobotLogo from './RobotLogo';
import { PAGE_TRANSITION as CFG } from './pageTransition.config.ts';
import { PageTransitionContext } from '../hooks/usePageTransition.ts';
import { basename, isPageRoute, preloadRoute } from '../routes.ts';
import { blink, prefersReducedMotion } from '../utils/motion.ts';
import './PageTransition.css';

/**
 * Branded page transition.
 *
 * One capture-phase click listener on the document catches every in-app <a> (all React Router <Link>s
 * included) before the router sees it, so no link needs changing. On the click itself the overlay starts and
 * the destination chunk begins downloading. Once the orange disc covers the screen the router navigates;
 * because React Router wraps updates in startTransition, the old page stays mounted under the overlay until
 * the new one has fully rendered, and that commit is the "ready" signal that lets the blue disc shrink away.
 *
 * Not intercepted: modified/middle clicks, target="_blank", download, external origins, non-route files
 * (PDFs, simulators), same-page and hash-only links, and anything inside [data-no-transition].
 * Back/forward are left to the browser and router untouched.
 */

type Els = {
  root: HTMLDivElement;
  orangeLead: HTMLDivElement;
  orange: HTMLDivElement;
  blueLead: HTMLDivElement;
  blue: HTMLDivElement;
  mark: HTMLDivElement;
  spin: HTMLDivElement;
  logoA: HTMLDivElement;
  logoB: HTMLDivElement;
  label: HTMLParagraphElement;
};

type Timeline = {
  /** Resolves when the old page is fully hidden: safe to navigate. */
  covered: Promise<unknown>;
  /** Resolves when the shortest coherent version of the sequence has played. */
  minimum: Promise<unknown>;
  /** Loop shown while the page is still loading after `minimum`. */
  hold: () => void;
  exit: () => Promise<unknown>;
};

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));
const nextPaint = () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
const done = (a: Animation) => a.finished.catch(() => undefined);

const play = (el: Element, frames: Keyframe[], opts: KeyframeAnimationOptions) => el.animate(frames, { fill: 'both', ...opts });

const GROW = [{ transform: 'scale(0)' }, { transform: 'scale(1)' }];

const fullTimeline = (els: Els): Timeline => {
  const { timing: T, easing: E } = CFG;
  const grow = (el: Element, delay: number) => play(el, GROW, { duration: T.expand, delay, easing: E.expand });

  grow(els.orangeLead, 0);
  const orange = grow(els.orange, T.layerLag);

  play(els.mark, [
    { opacity: 0, transform: 'scale(0.55) rotate(-18deg)' },
    { opacity: 1, transform: 'scale(1) rotate(0deg)' },
  ], { duration: T.logoIn, delay: T.logoInAt, easing: E.pop });
  play(els.label, [
    { opacity: 0, transform: 'translateY(8px)' },
    { opacity: 1, transform: 'translateY(0)' },
  ], { duration: 360, delay: T.labelAt, easing: E.out });

  // One deliberate turn; the marks swap while the logo is edge-on-ish, so the morph reads as part of the spin.
  const spin = play(els.spin, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], {
    duration: T.spin, delay: T.spinAt, easing: E.inOut,
  });
  play(els.logoA, [
    { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' },
    { opacity: 0, transform: 'scale(0.7)', filter: 'blur(6px)' },
  ], { duration: T.spin * 0.3, delay: T.spinAt + T.spin * 0.32, easing: E.inOut });
  const logoB = play(els.logoB, [
    { opacity: 0, transform: 'scale(0.7)', filter: 'blur(6px)' },
    { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' },
  ], { duration: T.spin * 0.4, delay: T.spinAt + T.spin * 0.46, easing: E.pop });
  logoB.finished.then(() => blink(els.logoB.querySelector('.robot-logo__eye polygon')), () => undefined);

  // Blue arrives as the same centred wave, so orange-to-blue is one continuous motion.
  grow(els.blueLead, T.blueAt);
  const blue = grow(els.blue, T.blueAt + T.layerLag);

  return {
    covered: done(orange),
    minimum: Promise.all([done(spin), done(logoB), done(blue)]),
    hold: () => {
      play(els.mark, [{ scale: '1' }, { scale: '1.05' }], {
        duration: 900, iterations: Infinity, direction: 'alternate', easing: E.inOut, fill: 'none',
      });
    },
    exit: () => {
      els.orangeLead.style.visibility = 'hidden';
      els.orange.style.visibility = 'hidden';
      els.blueLead.style.visibility = 'hidden';
      els.mark.getAnimations().forEach((a) => a.commitStyles?.());
      els.mark.getAnimations().forEach((a) => a.cancel());
      play(els.mark, [
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(0.4)' },
      ], { duration: T.exit * 0.55, easing: E.inOut });
      play(els.label, [{ opacity: 1 }, { opacity: 0 }], { duration: T.exit * 0.35, easing: E.out });
      // Iris close: a tiny settle outwards, then an accelerating shrink to a point.
      const shrink = play(els.blue, [
        { transform: 'scale(1)' },
        { transform: 'scale(1.03)', offset: 0.12, easing: E.exit },
        { transform: 'scale(0)' },
      ], { duration: T.exit });
      return done(shrink);
    },
  };
};

/** prefers-reduced-motion: a short fade to the finished blue card and back. No growth, spin or wipe. */
const reducedTimeline = (els: Els): Timeline => {
  const { reducedFade } = CFG.timing;
  for (const el of [els.orangeLead, els.orange, els.blueLead]) el.style.visibility = 'hidden';
  els.blue.style.transform = 'scale(1)';
  els.mark.style.opacity = '1';
  els.logoA.style.opacity = '0';
  els.logoB.style.opacity = '1';
  els.label.style.opacity = '1';
  const fadeIn = play(els.root, [{ opacity: 0 }, { opacity: 1 }], { duration: reducedFade, easing: 'linear' });
  return {
    covered: done(fadeIn),
    minimum: Promise.all([done(fadeIn), wait(reducedFade)]),
    hold: () => undefined,
    exit: () => done(play(els.root, [{ opacity: 1 }, { opacity: 0 }], { duration: reducedFade, easing: 'linear' })),
  };
};

/** In-app destination for this anchor, or null when the browser should handle the click normally. */
const transitionTarget = (a: HTMLAnchorElement): string | null => {
  if (a.target && a.target !== '_self') return null;
  if (a.hasAttribute('download') || a.closest('[data-no-transition]')) return null;
  if (/\bexternal\b/.test(a.rel)) return null;

  const url = new URL(a.href, window.location.href);
  if (url.origin !== window.location.origin || !/^https?:$/.test(url.protocol)) return null;
  // Same page (including hash-only jumps): let the router/browser scroll as usual.
  if (url.pathname === window.location.pathname && url.search === window.location.search) return null;

  let path = url.pathname;
  if (basename) {
    if (path !== basename && !path.startsWith(`${basename}/`)) return null;
    path = path.slice(basename.length) || '/';
  }
  if (!isPageRoute(path)) return null;
  return `${path}${url.search}${url.hash}`;
};

const labelOf = (a: HTMLAnchorElement) => {
  // innerText skips visually hidden helper text; closed menus have no rendered text, so fall back to textContent.
  const raw = a.dataset.transitionLabel ?? a.getAttribute('aria-label') ?? (a.innerText.trim() || a.textContent || '');
  const first = raw.split('\n').map((s) => s.trim()).find(Boolean) ?? '';
  return first.length <= 40 ? first : '';
};

const logoSize = () => Math.round(Math.min(132, Math.max(88, window.innerWidth * 0.22)));

type Props = { children: ReactNode };

const PageTransitionProvider = ({ children }: Props) => {
  const routerNavigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [label, setLabel] = useState('');
  const [status, setStatus] = useState('');
  const [size, setSize] = useState(120);

  const refs = useRef<Partial<Els>>({});
  const bind = <K extends keyof Els>(key: K) => (el: Els[K] | null) => {
    refs.current[key] = el ?? undefined;
  };
  const activeRef = useRef(false);
  const locationKeyRef = useRef(location.key);
  const onCommitRef = useRef<(() => void) | null>(null);

  // The router commits the new location only once the destination has rendered (startTransition + Suspense).
  useLayoutEffect(() => {
    locationKeyRef.current = location.key;
    onCommitRef.current?.();
  }, [location.key]);

  const run = useCallback(async (to: string, destination: string) => {
    const els = refs.current as Els;
    if (activeRef.current || !els.root) return;
    activeRef.current = true;

    const startedAt = performance.now();
    const fromKey = locationKeyRef.current;
    const layout = document.querySelector<HTMLElement>('.layout');
    const returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const page = destination || t('transition.page');
    // Settled right away so a failed chunk never surfaces as an unhandled rejection while the cover plays.
    const preloaded = preloadRoute(to.split(/[?#]/)[0]).then(() => true, () => false);

    // Same tick as the click: show the overlay and mark the page busy.
    setLabel(destination || t('brand.lab'));
    setStatus(t('transition.loading', { page }));
    setSize(logoSize());
    els.root.style.setProperty('--pt-d', `${Math.ceil(Math.hypot(window.innerWidth, window.innerHeight) * 1.04)}px`);
    els.root.hidden = false;
    layout?.setAttribute('aria-busy', 'true');
    layout?.setAttribute('inert', '');

    const timeline = (prefersReducedMotion() ? reducedTimeline : fullTimeline)(els);
    // Slow loads: once the minimum sequence is over, the mark breathes until the page is ready.
    let ready = false;
    void timeline.minimum.then(() => {
      if (!ready) timeline.hold();
    });
    const remaining = () => Math.max(0, CFG.timing.maxWait - (performance.now() - startedAt));
    const finish = async (failed = false) => {
      ready = true;
      layout?.removeAttribute('aria-busy');
      layout?.removeAttribute('inert');
      // New page: focus its main landmark (skip-link target). Failed: back to whatever was focused before.
      (failed ? returnFocus : document.getElementById('main'))?.focus({ preventScroll: true });
      setStatus(failed ? t('transition.failed') : t('transition.loaded', { page: destination || document.title }));
      await timeline.exit();
      els.root.hidden = true;
      els.root.getAnimations({ subtree: true }).forEach((a) => a.cancel());
      els.root.querySelectorAll<HTMLElement>('[style]').forEach((el) => {
        el.style.removeProperty('visibility');
        el.style.removeProperty('opacity');
        el.style.removeProperty('transform');
        el.style.removeProperty('scale');
      });
      activeRef.current = false;
    };

    await timeline.covered;

    const loaded = await Promise.race([
      preloaded,
      wait(remaining()).then(() => false),
    ]);
    if (!loaded) {
      // Chunk failed or stalled. Online: let the browser do a real page load. Offline: stay put, page usable.
      if (navigator.onLine) {
        window.location.assign(`${basename ?? ''}${to}`);
        return;
      }
      await finish(true);
      return;
    }

    // Back/forward during the cover already moved the user; don't push on top of their choice.
    if (locationKeyRef.current === fromKey) {
      const committed = new Promise<void>((resolve) => {
        onCommitRef.current = () => {
          if (locationKeyRef.current !== fromKey) resolve();
        };
      });
      routerNavigate(to);
      await Promise.race([committed.then(nextPaint), wait(remaining())]);
      onCommitRef.current = null;
    }

    // Fast loads still get the full short sequence instead of a one-frame flash.
    ready = true;
    await timeline.minimum;
    await finish();
  }, [routerNavigate, t]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href]');
      if (!(a instanceof HTMLAnchorElement)) return;
      const to = transitionTarget(a);
      if (!to) return;
      // Stops the router's own handler; duplicate clicks during a run are swallowed.
      e.preventDefault();
      void run(to, labelOf(a));
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [run]);

  const api = useMemo(() => ({ navigate: (to: string, destination = '') => void run(to, destination) }), [run]);

  const colorVars = {
    '--pt-orange-lead': CFG.colors.orangeLead,
    '--pt-orange': CFG.colors.orange,
    '--pt-blue-lead': CFG.colors.blueLead,
    '--pt-blue': CFG.colors.blue,
    '--pt-blue-deep': CFG.colors.blueDeep,
  } as CSSProperties;

  return (
    <PageTransitionContext.Provider value={api}>
      {children}
      {createPortal(
        <>
          <div ref={bind('root')} className="pt" style={colorVars} hidden aria-hidden="true">
            <div ref={bind('orangeLead')} className="pt__disc pt__disc--orange-lead" />
            <div ref={bind('orange')} className="pt__disc pt__disc--orange" />
            <div ref={bind('blueLead')} className="pt__disc pt__disc--blue-lead" />
            <div ref={bind('blue')} className="pt__disc pt__disc--blue" />
            <div className="pt__stage">
              <div ref={bind('mark')} className="pt__mark" style={{ width: size }}>
                <div ref={bind('spin')} className="pt__spin">
                  <div ref={bind('logoA')} className="pt__logo pt__logo--a">
                    <RobotLogo team={CFG.logos.from} size={size} />
                  </div>
                  <div ref={bind('logoB')} className="pt__logo pt__logo--b">
                    <RobotLogo team={CFG.logos.to} size={size} />
                  </div>
                </div>
              </div>
              <p ref={bind('label')} className="pt__label">{label}</p>
            </div>
          </div>
          <p className="visually-hidden" role="status" aria-live="polite">{status}</p>
        </>,
        document.body,
      )}
    </PageTransitionContext.Provider>
  );
};

export default PageTransitionProvider;
