const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

export const setTimerDisplay = (str) => {
  const el = $('timer-display');
  if (el) el.textContent = str;
};

export const setLiveStats = (wpm, acc) => {
  const w = $('live-wpm');
  const a = $('live-accuracy');
  if (w) w.textContent = wpm;
  if (a) a.textContent = acc + '%';
};

export const setProgress = (fraction) => {
  const bar = $('progress-bar');
  if (bar) bar.style.width = `${Math.round(fraction * 100)}%`;
};

export const setModeTab = (mode) => {
  $$('.mode-tab').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.mode === mode);
    tab.setAttribute('aria-selected', tab.dataset.mode === mode);
  });
};

export const setSubOptions = (mode) => {
  $$('.options-group').forEach((g) => g.classList.add('hidden'));
  const active = $(`options-${mode}`);
  if (active) active.classList.remove('hidden');
};

export const setActiveOption = (value) => {
  $$('.mode-option').forEach((opt) => {
    opt.classList.toggle('active', opt.dataset.value === String(value));
  });
};

export const resetTextarea = () => {
  const el = $('text-input');
  if (el) { el.value = ''; el.disabled = false; }
};

export const focusTextarea = () => {
  const el = $('text-input');
  if (el) el.focus();
};

export const disableTextarea = () => {
  const el = $('text-input');
  if (el) el.disabled = true;
};

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

export const hideResultsPanel = () => {
  $('results-panel')?.classList.remove('visible');
  $('typing-area')?.classList.remove('hidden');
};

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
