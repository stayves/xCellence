import { useEffect, useRef } from 'react';
import type { MouseEvent as ReactMouseEvent, RefObject } from 'react';
import { withBase } from '../utils/asset.ts';
import { accentOf, blink, bounce, prefersReducedMotion, sprayBurst } from '../utils/motion.ts';
import './RobotLogo.css';

type Team = 'xcellence' | 'xception';
type Variant = 'white' | 'color';

/** Right-eye geometry in each PNG's own pixel space (measured from the alpha channel). */
const GEOMETRY: Record<Team, { w: number; h: number; cx: number; cy: number; r: number; hole: [number, number, number, number] }> = {
  xcellence: { w: 306, h: 339, cx: 187, cy: 171, r: 16.5, hole: [168, 152, 206, 190] },
  xception: { w: 266, h: 266, cx: 165, cy: 121, r: 14.5, hole: [148, 104, 182, 138] },
};
const FILES: Record<Team, Record<Variant, string>> = {
  xcellence: { white: 'brand/logo-xcellence-white.png', color: 'brand/logo-xcellence-orange.png' },
  xception: { white: 'brand/logo-xception-white.png', color: 'brand/logo-xception-blue.png' },
};
const COLORS: Record<Team, Record<Variant, string>> = {
  xcellence: { white: '#ffffff', color: '#ff5a1f' },
  xception: { white: '#ffffff', color: '#2e6eff' },
};

/** Mask that cuts the real right eye out of the bitmap, so the vector eye on top can blink. */
const maskFor = (team: Team) => {
  const { w, h, hole: [x0, y0, x1, y1] } = GEOMETRY[team];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}' preserveAspectRatio='none'><path fill-rule='evenodd' d='M0 0H${w}V${h}H0Z M${x0} ${y0}H${x1}V${y1}H${x0}Z'/></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
};

type Props = {
  team: Team;
  variant?: Variant;
  /** Rendered width in px; height follows the logo's aspect ratio. */
  size: number;
  /** Button that winks on click. Otherwise it winks when its closest link is hovered. */
  interactive?: boolean;
  label?: string;
  className?: string;
};

/** Team robot logo whose right eye winks: on click, on parent-link hover, and now and then on its own. */
const RobotLogo = ({ team, variant = 'white', size, interactive = false, label, className = '' }: Props) => {
  const rootRef = useRef<HTMLElement>(null);
  const eyeRef = useRef<SVGPolygonElement>(null);
  const g = GEOMETRY[team];
  const points = `${g.cx},${g.cy - g.r} ${g.cx + g.r},${g.cy} ${g.cx},${g.cy + g.r} ${g.cx - g.r},${g.cy}`;

  // Idle winks every 5-9 s while on screen and the tab is visible.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return;
    let timer = 0;
    let visible = false;
    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (visible && !document.hidden) blink(eyeRef.current, Math.random() < 0.25);
        schedule();
      }, 5000 + Math.random() * 4000);
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(root);
    schedule();
    return () => { io.disconnect(); window.clearTimeout(timer); };
  }, []);

  // Non-interactive logos live inside links: wink when the link is hovered.
  useEffect(() => {
    if (interactive) return;
    const link = rootRef.current?.closest('a');
    if (!link) return;
    const onEnter = () => blink(eyeRef.current);
    link.addEventListener('pointerenter', onEnter);
    return () => link.removeEventListener('pointerenter', onEnter);
  }, [interactive]);

  const onClick = (e: ReactMouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    blink(eyeRef.current);
    bounce(el.firstElementChild);
    const r = el.getBoundingClientRect();
    // Keyboard clicks have no pointer position: burst from the eye instead.
    const x = e.clientX || r.left + (r.width * g.cx) / g.w;
    const y = e.clientY || r.top + (r.height * g.cy) / g.h;
    sprayBurst(x, y, accentOf(el));
  };

  const body = (
    <span className="robot-logo__body" style={{ color: COLORS[team][variant] }}>
      <img
        src={withBase(FILES[team][variant])}
        alt=""
        width={size}
        height={Math.round((size * g.h) / g.w)}
        className="robot-logo__img"
        style={{ maskImage: maskFor(team), WebkitMaskImage: maskFor(team) }}
        draggable={false}
      />
      <svg className="robot-logo__eye" viewBox={`0 0 ${g.w} ${g.h}`} preserveAspectRatio="none" aria-hidden="true">
        <polygon ref={eyeRef} points={points} fill="currentColor" />
      </svg>
    </span>
  );

  const classes = `robot-logo robot-logo--${team} ${className}`.trim();
  const sizeVar = { ['--logo-w' as string]: `${size}px` };
  if (interactive) {
    return (
      <button
        ref={rootRef as RefObject<HTMLButtonElement>}
        type="button"
        className={`${classes} robot-logo--interactive`}
        aria-label={label}
        style={sizeVar}
        onClick={onClick}
      >
        {body}
      </button>
    );
  }
  return (
    <span ref={rootRef as RefObject<HTMLSpanElement>} className={classes} style={sizeVar} aria-hidden="true">
      {body}
    </span>
  );
};

export default RobotLogo;
