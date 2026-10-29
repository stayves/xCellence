import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// Locale files are loaded on demand so a visitor only downloads the language they read.
const loaders: Record<string, () => Promise<[{ default: unknown }, { default: unknown }]>> = {
  en: () => Promise.all([import('./locales/en.json'), import('./locales/v2.en.json')]),
  ru: () => Promise.all([import('./locales/ru.json'), import('./locales/v2.ru.json')]),
  kk: () => Promise.all([import('./locales/kk.json'), import('./locales/v2.kk.json')]),
};

const STORAGE_KEY = 'xcellence-language';
const SUPPORTED_LANGUAGES = ['en', 'ru', 'kk'];

type Json = { [key: string]: unknown };
const isObject = (v: unknown): v is Json => typeof v === 'object' && v !== null && !Array.isArray(v);

/** Leaf-level merge: v2 strings override or extend the original locale. The original article subtrees
 *  (blog.posts, blog.articlesBySlug) are never present in v2, so they pass through untouched. */
const merge = (base: Json, extra: Json): Json => {
  const out: Json = { ...base };
  for (const [key, value] of Object.entries(extra)) {
    out[key] = isObject(value) && isObject(base[key]) ? merge(base[key] as Json, value) : value;
  }
  return out;
};

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

const loaded = new Set<string>();
const loadLanguage = async (lng: string) => {
  if (loaded.has(lng) || !loaders[lng]) return;
  const [base, v2] = await loaders[lng]();
  i18n.addResourceBundle(lng, 'translation', merge(base.default as Json, v2.default as Json), true, true);
  loaded.add(lng);
};

/** Switch language after its strings have arrived (avoids a flash of raw keys). */
export const changeLanguage = async (lng: string) => {
  await loadLanguage(lng);
  await i18n.changeLanguage(lng);
};

export const initI18n = async () => {
  const lng = getInitialLanguage();
  await i18n.use(initReactI18next).init({
    resources: {},
    lng,
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: { escapeValue: false },
  });
  await Promise.all([loadLanguage(lng), lng === 'en' ? undefined : loadLanguage('en')]);
  // re-emit so already-mounted consumers pick up the bundle (none are mounted yet, but this is cheap)
  await i18n.changeLanguage(lng);
};

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
