import { Link, useLocation } from 'react-router-dom';
import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import RobotLogo from './RobotLogo';
import { changeLanguage } from '../i18n';
import './Header.css';

type HeaderProps = {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
};

const SunIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
const MoonIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

const Header = ({ theme, onToggleTheme }: HeaderProps) => {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const location = useLocation();
  const navId = useId();
  const exploreId = useId();
  const exploreRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setExploreOpen(false);
  }, [location.pathname]);

  // Escape closes menus; clicking outside closes the Explore popover.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setExploreOpen(false);
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) setExploreOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, []);

  const primary = [
    { path: '/', label: t('header.nav.home') },
    { path: '/teams', label: t('header.nav.teams') },
    { path: '/events', label: t('header.nav.events') },
    { path: '/blog', label: t('header.nav.blog') },
    { path: '/contact', label: t('header.nav.contact') },
  ];
  const explore = [
    { path: '/team', label: t('header.nav.people') },
    { path: '/calendar', label: t('header.nav.calendar') },
    { path: '/resources', label: t('header.nav.resources') },
    { path: '/trainer', label: t('header.nav.trainer') },
    { path: '/hall-of-fame', label: t('header.nav.hallOfFame') },
  ];

  const languageOptions = [
    { code: 'en', short: t('language.short.en'), label: t('language.options.en') },
    { code: 'ru', short: t('language.short.ru'), label: t('language.options.ru') },
    { code: 'kk', short: t('language.short.kk'), label: t('language.options.kk') },
  ];

  const isActive = (target: string) =>
    target === '/'
      ? location.pathname === '/' || location.pathname === ''
      : location.pathname === target || location.pathname.startsWith(`${target}/`);
  const exploreActive = explore.some((item) => isActive(item.path));

  return (
    <header className={`header ${scrolled || menuOpen ? 'scrolled' : ''} ${location.pathname === '/' && !scrolled && !menuOpen ? 'over-hero' : ''}`}>
      <div className="header-container">
        <Link to="/" className="brand" viewTransition>
          <RobotLogo team="xcellence" size={40} className="brand-mark" />
          <span className="brand-text">
            <span className="brand-name">xCellence</span>
            <span className="brand-sub">Robotics Lab</span>
          </span>
          <span className="visually-hidden">{t('brand.lab')}</span>
        </Link>

        <nav id={navId} className={`nav ${menuOpen ? 'open' : ''}`} aria-label="Main">
          <ul className="nav-list">
            {primary.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                  viewTransition
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li ref={exploreRef} className="nav-explore">
              <button
                type="button"
                className={`nav-link nav-link--button ${exploreActive ? 'active' : ''}`}
                aria-expanded={exploreOpen}
                aria-controls={exploreId}
                onClick={() => setExploreOpen((v) => !v)}
              >
                {t('header.nav.explore')}
                <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <ul id={exploreId} className={`explore-menu ${exploreOpen ? 'open' : ''}`} aria-label={t('header.exploreLabel')}>
                {explore.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={isActive(item.path) ? 'active' : ''}
                      aria-current={isActive(item.path) ? 'page' : undefined}
                      tabIndex={exploreOpen || menuOpen ? 0 : -1}
                      viewTransition
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>

        <div className="header-tools">
          <Link to="/partners" className="btn header-cta" viewTransition>
            {t('header.partnerCta')}
          </Link>

          <div className="language-switch" role="group" aria-label={t('language.label')}>
            {languageOptions.map((option) => (
              <button
                key={option.code}
                type="button"
                className={`language-btn ${i18n.language === option.code ? 'active' : ''}`}
                onClick={() => void changeLanguage(option.code)}
                aria-pressed={i18n.language === option.code}
                lang={option.code}
                title={option.label}
              >
                {option.short}
                <span className="visually-hidden"> ({option.label})</span>
              </button>
            ))}
          </div>

          <button
            className="icon-btn"
            type="button"
            onClick={onToggleTheme}
            aria-label={t('header.themeToggle', {
              theme: theme === 'dark' ? t('header.theme.light') : t('header.theme.dark'),
            })}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          <button
            className={`icon-btn menu-toggle ${menuOpen ? 'open' : ''}`}
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls={navId}
            aria-label={t('header.toggleMenu')}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
