import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import manifest from '../generated/image-manifest.json';
import { withBase } from '../utils/asset.ts';
import './Picture.css';

type Entry = {
  slug: string;
  w: number;
  h: number;
  widths: number[];
  fallback: 'jpg' | 'png';
  color: string;
  blur: string;
};

const entries = manifest as unknown as Record<string, Entry>;

/** Resolve any legacy image path ("/xact-1.png", "team.jpg", "/xCellence/news-1.jpg") to its manifest entry. */
export const resolveImage = (src: string): Entry | undefined => {
  if (!src) return undefined;
  let name = src.split('?')[0].split('/').pop() ?? '';
  try { name = decodeURIComponent(name); } catch { /* keep raw */ }
  return entries[name];
};

type PictureProps = {
  src: string;
  alt: string;
  /** CSS `sizes` hint; default assumes a full-width image. */
  sizes?: string;
  /** Above-the-fold / LCP image: eager, high priority, no lazy loading. */
  priority?: boolean;
  /** Visible on first paint but not the LCP: eager without high priority. */
  eager?: boolean;
  /** Fill the positioned parent (object-fit) instead of using the intrinsic aspect ratio. */
  fill?: boolean;
  fit?: 'cover' | 'contain';
  position?: string;
  className?: string;
  imgClassName?: string;
  style?: CSSProperties;
  onLoad?: () => void;
};

const Picture = ({
  src, alt, sizes = '100vw', priority = false, eager = false, fill = false, fit = 'cover', position,
  className = '', imgClassName, style, onLoad,
}: PictureProps) => {
  const entry = resolveImage(src);
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Cached images can finish before React attaches onLoad.
  useEffect(() => {
    setLoaded(false);
    const el = imgRef.current;
    if (el?.complete && el.naturalWidth > 0) {
      el.decode?.().catch(() => undefined).finally(() => setLoaded(true));
    }
  }, [src]);

  const done = () => { setLoaded(true); onLoad?.(); };

  // Unknown path (external URL, SVG, new upload): plain img, still lazy and async-decoded.
  if (!entry) {
    return (
      <img
        src={withBase(src)}
        alt={alt}
        className={imgClassName ?? className}
        loading={priority || eager ? 'eager' : 'lazy'}
        decoding="async"
        style={style}
      />
    );
  }

  const url = (w: number | string, ext: string) => withBase(`img/${entry.slug}-${w}.${ext}`);
  const srcSet = (ext: string) => entry.widths.map((w) => `${url(w, ext)} ${w}w`).join(', ');
  const fallbackSrc = withBase(`img/${entry.slug}-fallback.${entry.fallback}`);

  const wrapStyle: CSSProperties = {
    ['--pic-color' as string]: entry.color,
    ['--pic-blur' as string]: `url("${entry.blur}")`,
    ...(fill ? null : { aspectRatio: `${entry.w} / ${entry.h}` }),
    ...style,
  };

  return (
    <span
      className={`pic ${fill ? 'pic--fill' : ''} ${loaded || priority ? 'is-loaded' : ''} ${priority ? 'pic--priority' : ''} ${className}`.trim()}
      style={wrapStyle}
    >
      <picture>
        <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
        <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
        <img
          ref={imgRef}
          className={imgClassName}
          src={fallbackSrc}
          alt={alt}
          width={entry.w}
          height={entry.h}
          loading={priority || eager ? 'eager' : 'lazy'}
          decoding="async"
          // eslint-disable-next-line react/no-unknown-property
          {...(priority ? { fetchPriority: 'high' as const } : {})}
          onLoad={done}
          style={{ objectFit: fit, objectPosition: position }}
        />
      </picture>
    </span>
  );
};

export default Picture;
