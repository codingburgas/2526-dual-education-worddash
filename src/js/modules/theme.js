import { get, SETTINGS_KEY } from './storage.js';

// Sets the data-theme attribute on the root element to activate the corresponding CSS theme
export const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
};

// Reads the saved theme from settings, defaulting to 'dark'
export const getTheme = () => {
  return get(SETTINGS_KEY)?.theme || 'dark';
};
