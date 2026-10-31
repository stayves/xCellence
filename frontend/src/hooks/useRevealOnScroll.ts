import { useEffect } from 'react';

/** Cards on the pre-refactor pages get the same reveal + cursor spotlight as the new pages, without touching their markup. */
const AUTO_CARDS = [
  '.blog-card', '.event-card', '.past-event-card', '.team-member-card', '.alumni-highlight-card', '.hall-card',
  '.metric-card', '.calendar-card', '.contact-info-card', '.contact-form-wrapper', '.info-card', '.resource-block', '.resource-item',
].join(',');
const AUTO_HEADERS = '.main-content .section-header';

const tag = (root: ParentNode) => {
  root.querySelectorAll<HTMLElement>(AUTO_CARDS).forEach((el, i) => {
    if (el.dataset.auto) return;
    el.dataset.auto = '1';
    el.classList.add('reveal');
    el.dataset.spotlight = '';
    // Stagger siblings in the same grid
    const index = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : i;
    el.style.setProperty('--d', `${Math.min(index, 6) * 70}ms`);
  });
  root.querySelectorAll<HTMLElement>(AUTO_HEADERS).forEach((el) => {
    if (el.dataset.auto) return;
    el.dataset.auto = '1';
    el.classList.add('reveal');
  });
};

/**
 * Adds `.in` to every `.reveal` element once it scrolls into view.
 * Watches the DOM, so lazily loaded pages (which mount after the route change) are covered too.
 */
export const useRevealOnScroll = (key: string) => {
  useEffect(() => {
    const main = document.getElementById('main');
    if (!main) return;
    const instant = typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const pending = new Set<Element>();
    const show = (el: Element) => { el.classList.add('in'); pending.delete(el); io?.unobserve(el); };
    const io = instant ? null : new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) show(e.target);
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });

    // A fast fling can carry an element from below the viewport to above it between two observer checks,
    // so it never "intersects". Anything already scrolled past is shown when scrolling settles.
    let raf = 0;
    const sweep = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        for (const el of pending) if (el.getBoundingClientRect().top < window.innerHeight) show(el);
      });
    };

    const scan = () => {
      tag(main);
      main.querySelectorAll<HTMLElement>('.reveal:not(.in):not([data-watched])').forEach((n) => {
        n.dataset.watched = '1';
        if (io) { pending.add(n); io.observe(n); } else n.classList.add('in');
      });
    };
    scan();
    // MutationObserver callbacks run before the next paint, so freshly tagged cards never flash visible first.
    const mo = new MutationObserver(scan);
    mo.observe(main, { childList: true, subtree: true });
    if (io) window.addEventListener('scroll', sweep, { passive: true });
    return () => {
      mo.disconnect();
      io?.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', sweep);
      main.querySelectorAll<HTMLElement>('[data-watched]').forEach((n) => delete n.dataset.watched);
    };
  }, [key]);
};
