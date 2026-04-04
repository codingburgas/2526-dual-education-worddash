import { get, SETTINGS_KEY } from './storage.js';

export const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
};

export const getTheme = () => {
  return get(SETTINGS_KEY)?.theme || 'dark';
};
