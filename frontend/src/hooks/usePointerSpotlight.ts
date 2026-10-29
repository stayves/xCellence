import { useEffect } from 'react';

/**
 * One delegated pointer listener for two effects (mouse only, never under reduced motion):
 * - `[data-spotlight]` gets `--px` / `--py` (pointer position inside it) for a cursor-following glow.
 * - `[data-magnetic]` drifts up to 6px toward the cursor while hovered.
 */
export const usePointerSpotlight = () => {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let magnet: HTMLElement | null = null;

    const release = () => {
      if (magnet) magnet.style.translate = '';
      magnet = null;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const target = e.target as Element | null;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const spot = target?.closest<HTMLElement>('[data-spotlight]');
        if (spot) {
          const r = spot.getBoundingClientRect();
          spot.style.setProperty('--px', `${e.clientX - r.left}px`);
          spot.style.setProperty('--py', `${e.clientY - r.top}px`);
        }
        const mag = target?.closest<HTMLElement>('[data-magnetic]') ?? null;
        if (mag !== magnet) release();
        if (mag) {
          magnet = mag;
          const r = mag.getBoundingClientRect();
          const dx = ((e.clientX - r.left) / r.width - 0.5) * 12;
          const dy = ((e.clientY - r.top) / r.height - 0.5) * 12;
          mag.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
        }
      });
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', release);
    return () => {
      cancelAnimationFrame(raf);
      release();
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', release);
    };
  }, []);
};
