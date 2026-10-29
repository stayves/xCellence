import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = { value: number; suffix?: string; duration?: number };

/** Counts up once when scrolled into view. Shows the final value immediately under reduced motion. */
const CountUp = ({ value, suffix = '', duration = 1400 }: Props) => {
  const { i18n } = useTranslation();
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') {
      setShown(value);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        setShown(Math.round(value * (1 - Math.pow(1 - p, 4))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, duration]);

  const lang = i18n.language === 'kk' ? 'kk-KZ' : i18n.language === 'ru' ? 'ru-RU' : 'en-US';
  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {new Intl.NumberFormat(lang).format(shown)}{suffix}
    </span>
  );
};

export default CountUp;
