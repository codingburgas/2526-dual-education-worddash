const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

// Updates the timer display element with the given formatted time string
export const setTimerDisplay = (str) => {
  const el = $('timer-display');
  if (el) el.textContent = str;
};

// Updates the live WPM and accuracy readouts shown during typing
export const setLiveStats = (wpm, acc) => {
  const w = $('live-wpm');
  const a = $('live-accuracy');
  if (w) w.textContent = wpm;
  if (a) a.textContent = acc + '%';
};

// Sets the progress bar width as a percentage of the given 0–1 fraction
export const setProgress = (fraction) => {
  const bar = $('progress-bar');
  if (bar) bar.style.width = `${Math.round(fraction * 100)}%`;
};

// Marks the matching mode tab as active and updates its aria-selected attribute
export const setModeTab = (mode) => {
  $$('.mode-tab').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.mode === mode);
    tab.setAttribute('aria-selected', tab.dataset.mode === mode);
  });
};

// Hides all option groups and reveals only the one matching the current mode
export const setSubOptions = (mode) => {
  $$('.options-group').forEach((g) => g.classList.add('hidden'));
  const active = $(`options-${mode}`);
  if (active) active.classList.remove('hidden');
};

// Highlights the option button whose data-value matches the given selection
export const setActiveOption = (value) => {
  $$('.mode-option').forEach((opt) => {
    opt.classList.toggle('active', opt.dataset.value === String(value));
  });
};

// Clears and re-enables the typing textarea
export const resetTextarea = () => {
  const el = $('text-input');
  if (el) { el.value = ''; el.disabled = false; }
};

// Moves keyboard focus to the typing textarea
export const focusTextarea = () => {
  const el = $('text-input');
  if (el) el.focus();
};

// Disables the typing textarea to prevent further input after a test ends
export const disableTextarea = () => {
  const el = $('text-input');
  if (el) el.disabled = true;
};

// Populates the results panel with all stats and makes it visible, hiding the typing area
export const showResultsPanel = (data) => {
  const panel = $('results-panel');
  const area  = $('typing-area');
  if (!panel) return;

  const fill = (id, val) => { const e = $(id); if (e) e.textContent = val; };

  fill('result-wpm',      data.grossWpm);
  fill('result-net-wpm',  data.netWpm);
  fill('result-accuracy', data.accuracy + '%');
  fill('result-chars',    `${data.charsCorrect} / ${data.charsCorrect + data.charsIncorrect}`);
  fill('result-time',     data.duration + 's');
  fill('result-mode',     data.mode);
  fill('result-lang',     (data.language || 'en').toUpperCase());

  area?.classList.add('hidden');
  panel.classList.add('visible');
};

// Hides the results panel and restores the typing area
export const hideResultsPanel = () => {
  $('results-panel')?.classList.remove('visible');
  $('typing-area')?.classList.remove('hidden');
};

// Shows the save-score prompt and wires its button and Enter key to call onSave with the entered name
export const showSavePrompt = (onSave) => {
  const prompt = $('save-prompt');
  if (!prompt) return;
  prompt.style.display = 'flex';

  const btn   = $('save-score-btn');
  const input = $('player-name-input');
  if (!btn || !input) return;

  const freshBtn = btn.cloneNode(true);
  btn.replaceWith(freshBtn);

  freshBtn.addEventListener('click', () => {
    const name = input.value.trim() || 'Anonymous';
    onSave(name);
    prompt.style.display = 'none';
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') freshBtn.click();
  });
};
