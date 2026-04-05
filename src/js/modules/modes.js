import { getContent } from './paragraph.js';
import { get, SETTINGS_KEY } from './storage.js';
import * as ui from './ui.js';

let _mode    = 'time';
let _option  = 60;
let _text    = '';
let _running = false;
let _onEnd   = null;

const DEFAULTS = { time: 60, words: 25, quote: 'short', zen: null };

export const init = (onEnd) => {
  _onEnd = onEnd;

  document.addEventListener('languagechange', () => {
    if (!_running) _loadContent();
  });

  setMode('time', 60);
};

export const setMode = (mode, option) => {
  _mode   = mode;
  _option = option !== undefined ? option : DEFAULTS[mode];

  ui.setModeTab(mode);
  ui.setSubOptions(mode);
  ui.setActiveOption(_option);

  _loadContent();
};

export const getMode    = () => _mode;
export const getOption  = () => _option;
export const getText    = () => _text;
export const isRunning  = () => _running;
export const setRunning = (v) => { _running = v; };
export const getOnEnd   = () => _onEnd;

const _loadContent = () => {
  const lang = document.documentElement.dataset.lang || 'en';

  const difficulty = get(SETTINGS_KEY)?.difficulty || 'mixed';
  const options    = _buildOptions(difficulty);

  _text = getContent(_mode, options, lang);

  document.dispatchEvent(
    new CustomEvent('contentloaded', { detail: { text: _text } })
  );
};

const _buildOptions = (difficulty) => {
  switch (_mode) {
    case 'words': return { count: _option, difficulty };
    case 'quote': return { length: _option };
    default:      return { difficulty };
  }
};
