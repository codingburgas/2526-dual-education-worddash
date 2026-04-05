import { get, set, SETTINGS_KEY } from './storage.js';
import { applyTheme } from './theme.js';

const DEFAULTS = {
  theme:      'dark',
  font:       'mono',
  caret:      'line',
  difficulty: 'mixed',
};

// Returns stored settings merged over the hardcoded defaults
export const loadSettings = () => ({ ...DEFAULTS, ...get(SETTINGS_KEY) });

// Merges a partial update into the persisted settings object
export const saveSettings = (partial) => {
  set(SETTINGS_KEY, { ...loadSettings(), ...partial });
};

// Applies the active settings to the document via theme, font, and caret data-attributes
export const applySettings = (settings = loadSettings()) => {
  applyTheme(settings.theme);
  document.documentElement.dataset.font  = settings.font;
  document.documentElement.dataset.caret = settings.caret;
};
