// calculator.js — pure functions, zero imports, zero DOM, zero side-effects.
// All typing math lives here and nowhere else.

/** Words per minute (gross — all typed words) */
export const grossWPM = (wordCount, elapsedSeconds) => {
  if (!elapsedSeconds || elapsedSeconds < 0.5) return 0;
  return Math.round((wordCount / elapsedSeconds) * 60);
};

/** Words per minute (net — penalised for incorrect words) */
export const netWPM = (correctWords, elapsedSeconds) => {
  if (!elapsedSeconds || elapsedSeconds < 0.5) return 0;
  return Math.max(0, Math.round((correctWords / elapsedSeconds) * 60));
};

/** Accuracy as a percentage (0–100) */
export const accuracy = (totalTyped, correctChars) => {
  if (!totalTyped) return 100;
  return Math.round((correctChars / totalTyped) * 100);
};

/**
 * Character-level diff between typed and original strings.
 * Returns { correct, incorrect, extra, missing }
 */
export const charStats = (typed, original) => {
  let correct = 0;
  let incorrect = 0;
  const minLen = Math.min(typed.length, original.length);

  for (let i = 0; i < minLen; i++) {
    if (typed[i] === original[i]) correct++;
    else incorrect++;
  }

  const extra   = Math.max(0, typed.length   - original.length);
  const missing = Math.max(0, original.length - typed.length);

  return { correct, incorrect, extra, missing };
};

/** Number of words in a string */
export const wordCount = (text) =>
  text.trim().split(/\s+/).filter(Boolean).length;

/** Number of correctly typed words compared to original */
export const correctWordCount = (typed, original) => {
  const typedWords    = typed.trim().split(/\s+/);
  const originalWords = original.trim().split(/\s+/);
  let correct = 0;
  typedWords.forEach((w, i) => {
    if (w === originalWords[i]) correct++;
  });
  return correct;
};

/** Format seconds into MM:SS or HH:MM:SS */
export const formatTime = (totalSeconds) => {
  const s = Math.floor(Math.abs(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm  = String(m).padStart(2, '0');
  const ss  = String(sec).padStart(2, '0');
  if (h > 0) return `${String(h).padStart(2, '0')}:${mm}:${ss}`;
  return `${mm}:${ss}`;
};
