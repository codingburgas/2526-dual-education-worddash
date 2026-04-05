let _interval     = null;
let _startTime    = null;
let _duration     = null;
let _onTick       = null;
let _onEnd        = null;

// Starts the timer in countdown or count-up mode, firing onTick each second and onEnd when done
export const start = (isCountdown, duration, onTick, onEnd) => {
  stop();

  _startTime = Date.now();
  _duration  = isCountdown ? duration : null;
  _onTick    = onTick;
  _onEnd     = onEnd;

  _tick();
  _interval = setInterval(_tick, 1000);
};

// Clears the interval to halt the timer without wiping state
export const stop = () => {
  clearInterval(_interval);
  _interval = null;
};

// Stops the timer and wipes all state, preparing it for a fresh start
export const reset = () => {
  stop();
  _startTime = null;
  _duration  = null;
  _onTick    = null;
  _onEnd     = null;
};

// Returns seconds elapsed since start, or 0 if the timer has not been started
export const getElapsedSeconds = () => {
  if (!_startTime) return 0;
  return (Date.now() - _startTime) / 1000;
};

// Returns true while the interval is active
export const isRunning = () => _interval !== null;

// Fires the tick callback with remaining/elapsed values, and triggers onEnd when countdown reaches 0
const _tick = () => {
  const elapsed = getElapsedSeconds();

  if (_duration !== null) {
    const remaining = Math.max(0, _duration - Math.floor(elapsed));
    _onTick?.(remaining, elapsed);

    if (remaining <= 0) {
      stop();
      _onEnd?.();
    }
  } else {
    _onTick?.(null, elapsed);
  }
};
