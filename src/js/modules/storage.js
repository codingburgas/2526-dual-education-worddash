export const SCORES_KEY   = 'wds_scores';
export const SETTINGS_KEY = 'wds_settings';
export const LANG_KEY     = 'wds_lang';

// Parses and returns the stored JSON value for the given key, or null on failure
export const get = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Serializes and writes a value to localStorage under the given key
export const set = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
}
};

// Removes the entry for the given key from localStorage
export const remove = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {}
};
