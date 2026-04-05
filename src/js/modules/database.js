import { get, set, SCORES_KEY } from './storage.js';

let _cache = [];

// Loads the persisted scores array from localStorage into the in-memory cache
export const init = () => {
  _cache = get(SCORES_KEY) || [];
};

// Validates, timestamps, and appends a new score entry to the cache, then persists it
export const add = (entry) => {
  if (!_validate(entry)) return null;
  const saved = {
    ...entry,
    id:   Date.now().toString(),
    date: new Date().toISOString(),
  };
  _cache.push(saved);
  _persist();
  return saved;
};

// Returns all cached scores filtered by mode/language and sorted by WPM descending
export const getAll = (filter = {}) => {
  let result = [..._cache];
  if (filter.mode)     result = result.filter((s) => s.mode === filter.mode);
  if (filter.language) result = result.filter((s) => s.language === filter.language);
  return result.sort((a, b) => b.wpm - a.wpm);
};

// Removes the score with the given ID from the cache and persists
export const remove = (id) => {
  _cache = _cache.filter((s) => s.id !== id);
  _persist();
};

// Clears all scores from the in-memory cache and localStorage
export const clear = () => {
  _cache = [];
  _persist();
};

// Triggers a browser download of all scores as a formatted JSON file
export const exportJSON = () => {
  const data = {
    version:  1,
    exported: new Date().toISOString(),
    scores:   _cache,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), {
    href:     url,
    download: 'worddash-scores.json',
  });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

// Merges validated, non-duplicate scores from a JSON string into the cache; returns the count added
export const importJSON = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    if (!Array.isArray(data.scores)) return 0;

    const existing = new Set(_cache.map((s) => s.id));
    const fresh    = data.scores.filter(
      (s) => _validate(s) && s.id && !existing.has(s.id)
    );
    _cache.push(...fresh);
    _persist();
    return fresh.length;
  } catch {
    return 0;
  }
};

// Writes the current in-memory cache to localStorage
const _persist = () => set(SCORES_KEY, _cache);

// Checks that an entry has the required fields: name (string), wpm and accuracy (numbers), mode (string)
const _validate = (entry) =>
  entry != null &&
  typeof entry.name     === 'string' &&
  typeof entry.wpm      === 'number' &&
  typeof entry.accuracy === 'number' &&
  typeof entry.mode     === 'string';
