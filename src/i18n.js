import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './locales/en';
import { te } from './locales/te';
import { hi } from './locales/hi';
import { ta } from './locales/ta';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', fontClass: 'font-sans' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', fontClass: 'font-telugu' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', fontClass: 'font-hindi' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', fontClass: 'font-tamil' },
];

const STORAGE_KEY = 'legalbharosa_lang';

// Retrieve saved language preference or default to English ('en')
const getSavedLanguage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.some((lang) => lang.code === saved)) {
      return saved;
    }
  } catch (err) {
    console.warn('[i18n] Could not read stored language preference:', err);
  }
  return 'en';
};

const initialLang = getSavedLanguage();

// Ensure HTML document has correct initial lang attribute
if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLang;
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      te: { translation: te },
      hi: { translation: hi },
      ta: { translation: ta },
    },
    lng: initialLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safeguards against XSS
    },
    react: {
      useSuspense: false, // Avoid layout shifts during client hydration
    },
  });

// Keep <html> lang attribute and localStorage synchronized on language change
i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch (err) {
    console.warn('[i18n] Could not persist language preference:', err);
  }
});

export default i18n;
// Final submission update
