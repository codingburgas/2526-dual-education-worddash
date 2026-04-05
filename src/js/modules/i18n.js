import en from '../data/i18n/en.js';
import bg from '../data/i18n/bg.js';
import { get, set, LANG_KEY } from './storage.js';

const translations = { en, bg };
let _lang = get(LANG_KEY) || 'en';

// Returns the currently active locale code
export const getLanguage = () => _lang;

// Persists and applies a new locale, then fires a 'languagechange' event
export const setLanguage = (lang) => {
  if (lang !== 'en' && lang !== 'bg') return;
  _lang = lang;
  set(LANG_KEY, lang);
  document.documentElement.dataset.lang = lang;
  applyTranslations();
  document.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
};

// Looks up a translation key in the current locale, falling back to English, then the key itself
export const t = (key) =>
  translations[_lang]?.[key] ?? translations.en?.[key] ?? key;

// Fills all [data-i18n], [data-i18n-placeholder], and [data-i18n-aria] elements with translated strings
export const applyTranslations = () => {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  });
};
