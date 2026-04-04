import * as calc from './calculator.js';
import * as db   from './database.js';
import * as ui   from './ui.js';
import { getMode, getOption } from './modes.js';

/**
 * Compile a results object from the finished test.
 * @param {string} typed       what the user typed
 * @param {string} original    the reference text
 * @param {number} elapsedMs   elapsed time in milliseconds
 * @param {string} lang        'en' | 'bg'
 */
export const compile = (typed, original, elapsedMs, lang = 'en') => {
  const elapsed = elapsedMs / 1000;
  const words   = calc.wordCount(typed);
  const correct = calc.correctWordCount(typed, original);
  const stats   = calc.charStats(typed, original);
  const mode    = getMode();
  const opt     = getOption();

  const modeStr =
    mode === 'time'  ? `time-${opt}`   :
    mode === 'words' ? `words-${opt}`  :
    mode === 'quote' ? `quote-${opt}`  : 'zen';

  return {
    grossWpm:       calc.grossWPM(words, elapsed),
    netWpm:         calc.netWPM(correct, elapsed),
    accuracy:       calc.accuracy(typed.length, stats.correct),
    charsCorrect:   stats.correct,
    charsIncorrect: stats.incorrect,
    charsExtra:     stats.extra,
    duration:       Math.round(elapsed),
    mode:           modeStr,
    language:       lang,
  };
};

/** Render the results panel (delegates to ui.js) */
export const render = (resultsObj) => {
  ui.showResultsPanel(resultsObj);
};

/**
 * Save a score to the database.
 * @param {string} name        player's name
 * @param {object} resultsObj  from compile()
 */
export const onSave = (name, resultsObj) => {
  db.add({
    name,
    wpm:            resultsObj.grossWpm,
    netWpm:         resultsObj.netWpm,
    accuracy:       resultsObj.accuracy,
    mode:           resultsObj.mode,
    language:       resultsObj.language,
    duration:       resultsObj.duration,
    charsCorrect:   resultsObj.charsCorrect,
    charsIncorrect: resultsObj.charsIncorrect,
  });
};
