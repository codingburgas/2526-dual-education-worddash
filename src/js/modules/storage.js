// storage.js — sole localStorage gatekeeper
// All values are JSON-serialised. Import key constants from here.

export const SCORES_KEY   = 'wds_scores';
export const SETTINGS_KEY = 'wds_settings';
export const LANG_KEY     = 'wds_lang';

export const get = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const set = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota exceeded or private-browsing restriction — fail silently
  }
};

export const remove = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {}
};
