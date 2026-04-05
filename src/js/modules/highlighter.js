let _el   = null;
let _text = '';

// Stores a reference to the paragraph display element for all subsequent operations
export const init = (el) => { _el = el; };

// Renders the target text as individual character <span>s, each marked 'pending'
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

// Classifies each character span as correct/incorrect/pending and positions the caret
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

  if (typed.length >= _text.length && spans.length > 0) {
    spans[spans.length - 1].classList.add('caret');
  }
};

// Resets all character spans back to 'pending' without re-rendering the text
export const reset = () => {
  if (!_el) return;
  _el.querySelectorAll('.char').forEach((s) => {
    s.className = 'char pending';
  });
};

// Returns the fraction of text typed (0–1), capped at 1
export const progressFraction = (typed) => {
  if (!_text.length) return 0;
  return Math.min(1, typed.length / _text.length);
};
