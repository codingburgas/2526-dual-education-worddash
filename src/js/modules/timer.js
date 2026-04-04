// timer.js — pure timer logic, no DOM, no imports.
// Uses callback pattern exclusively.

let _interval     = null;
let _startTime    = null;
let _duration     = null;   // null = stopwatch, number = countdown seconds
let _onTick       = null;
let _onEnd        = null;

/**
 * Start the timer.
 * @param {boolean}  isCountdown  true → countdown, false → stopwatch
 * @param {number}   duration     seconds (countdown only; ignored for stopwatch)
 * @param {Function} onTick       (displayValue: string, elapsedSeconds: number) => void
 * @param {Function} onEnd        () => void  (countdown only)
 */
export const start = (isCountdown, duration, onTick, onEnd) => {
  stop(); // clear any existing interval

  _startTime = Date.now();
  _duration  = isCountdown ? duration : null;
  _onTick    = onTick;
  _onEnd     = onEnd;

  _tick(); // fire immediately
  _interval = setInterval(_tick, 1000);
};

export const stop = () => {
  clearInterval(_interval);
  _interval = null;
};

export const reset = () => {
  stop();
  _startTime = null;
  _duration  = null;
  _onTick    = null;
  _onEnd     = null;
};

export const getElapsedSeconds = () => {
  if (!_startTime) return 0;
  return (Date.now() - _startTime) / 1000;
};

export const isRunning = () => _interval !== null;

// ── Private ──────────────────────────────────────────────────

const _tick = () => {
  const elapsed = getElapsedSeconds();

  if (_duration !== null) {
    // Countdown
    const remaining = Math.max(0, _duration - Math.floor(elapsed));
    _onTick?.(remaining, elapsed);

    if (remaining <= 0) {
      stop();
      _onEnd?.();
    }
  } else {
    // Stopwatch
    _onTick?.(null, elapsed);
  }
};
