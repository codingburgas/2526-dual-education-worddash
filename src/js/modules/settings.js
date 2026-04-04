import { get, set, SETTINGS_KEY } from './storage.js';
import { applyTheme } from './theme.js';

const DEFAULTS = {
  theme:      'dark',
  font:       'mono',
  caret:      'line',
  difficulty: 'mixed',
};

export const loadSettings = () => ({ ...DEFAULTS, ...get(SETTINGS_KEY) });

export const saveSettings = (partial) => {
  set(SETTINGS_KEY, { ...loadSettings(), ...partial });
};

export const applySettings = (settings = loadSettings()) => {
  applyTheme(settings.theme);
  document.documentElement.dataset.font  = settings.font;
  document.documentElement.dataset.caret = settings.caret;
};
