/** Small Web Animations helpers. No dependencies; every effect is skipped or reduced under prefers-reduced-motion. */

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/** Springy hop with a squash on landing. */
export const bounce = (el: Element | null) => {
  if (!el || prefersReducedMotion() || !('animate' in el)) return;
  el.animate(
    [
      { transform: 'translateY(0) scale(1, 1)' },
      { transform: 'translateY(4%) scale(1.1, 0.88)', offset: 0.14 },
      { transform: 'translateY(-14%) scale(0.94, 1.08)', offset: 0.42 },
      { transform: 'translateY(0) scale(1.08, 0.92)', offset: 0.7 },
      { transform: 'translateY(0) scale(0.98, 1.02)', offset: 0.85 },
      { transform: 'translateY(0) scale(1, 1)' },
    ],
    { duration: 640, easing: 'ease-out' },
  );
};

/** One eyelid close-and-open. `twice` plays a double blink. */
export const blink = (eye: Element | null, twice = false) => {
  if (!eye || !('animate' in eye)) return;
  const shut = { transform: 'scaleY(0.08)' };
  const open = { transform: 'scaleY(1)' };
  const frames = twice
    ? [open, { ...shut, offset: 0.18 }, { ...open, offset: 0.42 }, { ...shut, offset: 0.6 }, open]
    : [open, { ...shut, offset: 0.4 }, open];
  eye.animate(frames, { duration: twice ? 420 : 200, easing: 'ease-in-out' });
};

let layer: HTMLDivElement | null = null;
const getLayer = () => {
  if (layer?.isConnected) return layer;
  layer = document.createElement('div');
  layer.className = 'spray-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);
  return layer;
};

/** Burst of spray-paint droplets from a viewport point. DOM only, nodes remove themselves when done. */
export const sprayBurst = (x: number, y: number, color: string, count = 12) => {
  if (prefersReducedMotion()) return;
  const host = getLayer();
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    const size = 4 + Math.random() * 7;
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.6;
    const dist = 36 + Math.random() * 54;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    dot.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;background:${color}`;
    host.appendChild(dot);
    dot
      .animate(
        [
          { transform: 'translate(-50%, -50%) scale(0.4)', opacity: 1 },
          { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1)`, opacity: 0.95, offset: 0.55 },
          { transform: `translate(calc(-50% + ${dx * 1.1}px), calc(-50% + ${dy + 26}px)) scale(0.6)`, opacity: 0 },
        ],
        { duration: 620 + Math.random() * 280, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      )
      .finished.catch(() => undefined)
      .finally(() => dot.remove());
  }
};

/** Team accent colour read from the element's skin tokens. */
export const accentOf = (el: Element) =>
  getComputedStyle(el).getPropertyValue('--team-accent').trim() || '#ff5a1f';
