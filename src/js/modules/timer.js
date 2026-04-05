let _interval     = null;
let _startTime    = null;
let _duration     = null;
let _onTick       = null;
let _onEnd        = null;

export const start = (isCountdown, duration, onTick, onEnd) => {
  stop();

  _startTime = Date.now();
  _duration  = isCountdown ? duration : null;
  _onTick    = onTick;
  _onEnd     = onEnd;

  _tick();
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
