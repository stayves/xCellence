import { useEffect, useRef } from 'react';
import Picture from './Picture';
import './AmbientBackground.css';

/** Fixed, decorative page backdrop: drifting team-colour aurora over a faint graffiti wall and a dot grid. */
const AmbientBackground = () => {
  const ref = useRef<HTMLDivElement>(null);

  // No point animating a hidden tab.
  useEffect(() => {
    const sync = () => ref.current?.toggleAttribute('data-paused', document.hidden);
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  return (
    <div ref={ref} className="ambient" aria-hidden="true">
      <div className="ambient__wall">
        <Picture src="graffiti-cover.png" alt="" fill sizes="50vw" />
      </div>
      <span className="ambient__blob ambient__blob--blue" />
      <span className="ambient__blob ambient__blob--orange" />
      <span className="ambient__blob ambient__blob--violet" />
      <div className="ambient__grid" />
    </div>
  );
};

export default AmbientBackground;
