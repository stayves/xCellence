import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Header.css';

type HeaderProps = {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
};

const Header = ({ theme, onToggleTheme }: HeaderProps) => {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
  
  

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: '/', label: t('header.nav.home') },
    { path: '/team', label: t('header.nav.team') },
    { path: '/events', label: t('header.nav.events') },
    { path: '/trainer', label: t('header.nav.trainer') },
    { path: '/calendar', label: t('header.nav.calendar') },
    { path: '/resources', label: t('header.nav.resources') },
    { path: '/blog', label: t('header.nav.blog') },
    { path: '/hall-of-fame', label: t('header.nav.hallOfFame') },
    { path: '/contact', label: t('header.nav.contact') },
  ];

  const languageOptions = [
    { code: 'en', short: t('language.short.en'), label: t('language.options.en') },
    { code: 'ru', short: t('language.short.ru'), label: t('language.options.ru') },
    { code: 'kk', short: t('language.short.kk'), label: t('language.options.kk') },
  ];

  const isActive = (targetPath: string) => {
    if (targetPath === '/') {
      return location.pathname === '/' || location.pathname === '';
    }

    return location.pathname.startsWith(targetPath);
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <Link to="/" className="logo-link">
          <div className="logo">
            <img src="/xCellence/xCellence.png" alt={t('header.logoAlt')} className="logo-image" />
            <span className="logo-text">xCellence</span>
          </div>
        </Link>

        <nav className={`nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="language-switch" role="group" aria-label={t('language.label')}>
          {languageOptions.map((option) => (
            <button
              key={option.code}
              type="button"
              className={`language-btn ${i18n.language === option.code ? 'active' : ''}`}
              onClick={() => i18n.changeLanguage(option.code)}
              aria-pressed={i18n.language === option.code}
              aria-label={option.label}
              title={option.label}
            >
              {option.short}
            </button>
          ))}
        </div>

        <button
          className="theme-toggle"
          type="button"
          onClick={onToggleTheme}
          aria-label={t('header.themeToggle', {
            theme: theme === 'dark' ? t('header.theme.light') : t('header.theme.dark'),
          })}
        >
          <span aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
        </button>

        <button
          className={`mobile-menu-toggle ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={t('header.toggleMenu')}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;

