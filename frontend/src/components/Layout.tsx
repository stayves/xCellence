import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';

type ThemeMode = 'light' | 'dark';

const getPreferredTheme = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const stored = window.localStorage.getItem('xcellence-theme');
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
};

function Layout() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const preferred = getPreferredTheme();

    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', preferred);
      document.documentElement.style.setProperty('color-scheme', preferred);
    }

    return preferred;
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.style.setProperty('color-scheme', theme);
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('xcellence-theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="layout">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;