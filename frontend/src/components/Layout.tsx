import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';

type ThemeMode = 'light' | 'dark';

const getPreferredTheme = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const stored = window.localStorage.getItem('xcellence-theme');
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }

  return 'dark';
};

/** The page skin follows the route: team pages use their team's colours, everything else is the lab brand. */
const teamForPath = (pathname: string): 'xcellence' | 'xception' | 'lab' => {
  if (/\/teams\/xcellence\/?$/.test(pathname)) return 'xcellence';
  if (/\/teams\/xception\/?$/.test(pathname)) return 'xception';
  return 'lab';
};

function Layout() {
  const location = useLocation();
  const { t } = useTranslation();
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const preferred = getPreferredTheme();

    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', preferred);
    }

    return preferred;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem('xcellence-theme', theme);
    } catch {
      /* storage can be blocked; the theme still applies for this visit */
    }
  }, [theme]);

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'auto' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname, location.hash]);

  useRevealOnScroll(location.pathname);

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="layout" data-team={teamForPath(location.pathname)}>
      <a className="skip-link" href="#main">{t('header.skip')}</a>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main id="main" className="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
