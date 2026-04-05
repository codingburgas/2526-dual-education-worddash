import * as calc from './calculator.js';
import * as db   from './database.js';
import * as ui   from './ui.js';
import { getMode, getOption } from './modes.js';

// Computes all end-of-test statistics from raw typing data and the active mode context
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

// Hands the compiled results object off to the UI for display
export const render = (resultsObj) => {
  ui.showResultsPanel(resultsObj);
};

// Persists a named results entry to the score database
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
