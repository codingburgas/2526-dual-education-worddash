import { get, set, SCORES_KEY } from './storage.js';

let _cache = [];

export const init = () => {
  _cache = get(SCORES_KEY) || [];
};

/**
 * Add a score entry. Assigns id and date automatically.
 * Returns the saved entry, or null if validation fails.
 */
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

/**
 * Retrieve scores, optionally filtered.
 * @param {{ mode?: string, language?: string }} filter
 * @returns {object[]} sorted by wpm desc
 */
export const getAll = (filter = {}) => {
  let result = [..._cache];
  if (filter.mode)     result = result.filter((s) => s.mode === filter.mode);
  if (filter.language) result = result.filter((s) => s.language === filter.language);
  return result.sort((a, b) => b.wpm - a.wpm);
};

export const remove = (id) => {
  _cache = _cache.filter((s) => s.id !== id);
  _persist();
};

/** Clear all scores. No confirm() — that is the UI's responsibility. */
export const clear = () => {
  _cache = [];
  _persist();
};

/** Trigger a browser download of worddash-scores.json */
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

/**
 * Import and merge scores from a JSON string.
 * Skips entries whose id already exists in _cache.
 * @returns {number} count of newly added entries
 */
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

// ── Private ──────────────────────────────────────────────────

const _persist = () => set(SCORES_KEY, _cache);

const _validate = (entry) =>
  entry != null &&
  typeof entry.name     === 'string' &&
  typeof entry.wpm      === 'number' &&
  typeof entry.accuracy === 'number' &&
  typeof entry.mode     === 'string';
