import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ru from './locales/ru.json';
import kk from './locales/kk.json';

const STORAGE_KEY = 'xcellence-language';
const SUPPORTED_LANGUAGES = ['en', 'ru', 'kk'];

const getInitialLanguage = () => {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
    return stored;
  }

  const browser = window.navigator.language?.slice(0, 2);
  if (browser && SUPPORTED_LANGUAGES.includes(browser)) {
    return browser;
  }

  return 'en';
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
    kk: { translation: kk },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  supportedLngs: SUPPORTED_LANGUAGES,
  interpolation: { escapeValue: false },
});

if (typeof window !== 'undefined') {
  i18n.on('languageChanged', (lng) => {
    window.localStorage.setItem(STORAGE_KEY, lng);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lng;
    }
  });

  if (typeof document !== 'undefined') {
    document.documentElement.lang = i18n.language;
  }
}

export default i18n;
