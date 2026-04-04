// highlighter.js — owns #paragraph-display exclusively.
// No other module touches that element or its children.

let _el   = null;
let _text = '';

export const init = (el) => { _el = el; };

/**
 * Render the reference text as one <span class="char"> per character.
 * Spaces are rendered as non-breaking spaces to preserve layout.
 */
export const renderParagraph = (text) => {
  if (!_el) return;
  _text = text;

  _el.innerHTML = text
    .split('')
    .map((ch, i) =>
      `<span class="char pending" data-i="${i}">${ch === ' ' ? '\u00a0' : ch}</span>`
    )
    .join('');
};

/**
 * Compare typed string against _text and update span classes.
 * Also scrolls the caret span into view if the paragraph is tall.
 */
export const updateHighlight = (typed) => {
  if (!_el || !_text) return;

  const spans = _el.querySelectorAll('.char');
  spans.forEach((span, i) => {
    span.classList.remove('correct', 'incorrect', 'pending', 'caret');

    if (i < typed.length) {
      span.classList.add(typed[i] === _text[i] ? 'correct' : 'incorrect');
    } else {
      span.classList.add('pending');
    }

    if (i === typed.length) {
      span.classList.add('caret');
    }
  });

  // Caret at end of text
  if (typed.length >= _text.length && spans.length > 0) {
    spans[spans.length - 1].classList.add('caret');
  }
};

/** Reset all spans to .pending (used on restart) */
export const reset = () => {
  if (!_el) return;
  _el.querySelectorAll('.char').forEach((s) => {
    s.className = 'char pending';
  });
};

/** Progress 0–1 */
export const progressFraction = (typed) => {
  if (!_text.length) return 0;
  return Math.min(1, typed.length / _text.length);
};
