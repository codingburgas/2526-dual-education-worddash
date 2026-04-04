import en from '../data/i18n/en.js';
import bg from '../data/i18n/bg.js';
import { get, set, LANG_KEY } from './storage.js';

const translations = { en, bg };
let _lang = get(LANG_KEY) || 'en';

/** Returns the current language code ('en' | 'bg') */
export const getLanguage = () => _lang;

/**
 * Switch language: saves choice, updates DOM attribute,
 * runs a full translation pass, and fires the 'languagechange'
 * CustomEvent so other modules (modes.js) can react without
 * being directly coupled to i18n.
 */
export const setLanguage = (lang) => {
  if (lang !== 'en' && lang !== 'bg') return;
  _lang = lang;
  set(LANG_KEY, lang);
  document.documentElement.dataset.lang = lang;
  applyTranslations();
  document.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
};

/** Translate a key, falling back to English, then to the key itself */
export const t = (key) =>
  translations[_lang]?.[key] ?? translations.en?.[key] ?? key;

/**
 * One-pass DOM update:
 *   [data-i18n]             → textContent
 *   [data-i18n-placeholder] → placeholder attribute
 *   [data-i18n-aria]        → aria-label attribute
 */
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
