import { get, set, SCORES_KEY } from './storage.js';

let _cache = [];

export const init = () => {
  _cache = get(SCORES_KEY) || [];
};

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

export const clear = () => {
  _cache = [];
  _persist();
};

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

const _persist = () => set(SCORES_KEY, _cache);

const _validate = (entry) =>
  entry != null &&
  typeof entry.name     === 'string' &&
  typeof entry.wpm      === 'number' &&
  typeof entry.accuracy === 'number' &&
  typeof entry.mode     === 'string';
