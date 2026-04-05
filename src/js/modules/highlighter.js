let _el   = null;
let _text = '';

export const init = (el) => { _el = el; };

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

export const reset = () => {
  if (!_el) return;
  _el.querySelectorAll('.char').forEach((s) => {
    s.className = 'char pending';
  });
};

export const progressFraction = (typed) => {
  if (!_text.length) return 0;
  return Math.min(1, typed.length / _text.length);
};
