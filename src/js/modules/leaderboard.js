import * as db from './database.js';
import { t }   from './i18n.js';

const MEDALS = ['🥇', '🥈', '🥉'];

// ── Bootstrap ────────────────────────────────────────────────

export const init = () => {
  db.init();
  renderTable(db.getAll());
  _bindFilters();
  _bindActions();
};

// ── Render ───────────────────────────────────────────────────

export const renderTable = (scores) => {
  const tbody = document.querySelector('#scores-table tbody');
  if (!tbody) return;

  if (!scores.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="lb-empty">
            <div class="lb-empty-icon">🏆</div>
            <p data-i18n="lb.empty">${t('lb.empty')}</p>
          </div>
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = scores.slice(0, 20).map((score, i) => `
    <tr class="${i < 3 ? `rank-${i + 1}` : ''}">
      <td class="rank-cell">${MEDALS[i] ?? i + 1}</td>
      <td class="name-cell">${_esc(score.name)}</td>
      <td class="wpm-cell num">${score.wpm}</td>
      <td class="net-wpm-cell num">${score.netWpm ?? '—'}</td>
      <td class="accuracy-cell num">${score.accuracy}%</td>
      <td class="mode-cell"><span class="mode-badge">${_esc(score.mode)}</span></td>
      <td class="lang-cell"><span class="lang-badge">${(score.language || 'en').toUpperCase()}</span></td>
      <td class="date-cell">${_fmtDate(score.date)}</td>
    </tr>
  `).join('');
};

// ── Private ──────────────────────────────────────────────────

const _bindFilters = () => {
  const modeEl = document.getElementById('filter-mode');
  const langEl = document.getElementById('filter-lang');

  const refresh = () => {
    const filter = {};
    if (modeEl?.value) filter.mode     = modeEl.value;
    if (langEl?.value) filter.language = langEl.value;
    renderTable(db.getAll(filter));
  };

  modeEl?.addEventListener('change', refresh);
  langEl?.addEventListener('change', refresh);
};

const _bindActions = () => {
  // Export
  document.getElementById('export-btn')?.addEventListener('click', () => {
    db.exportJSON();
  });

  // Import
  document.getElementById('import-input')?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const count = db.importJSON(ev.target.result);
      alert(`${t('lb.imported')} ${count} ${t('lb.scores')}`);
      renderTable(db.getAll());
      e.target.value = ''; // reset file input
    };
    reader.readAsText(file);
  });

  // Clear
  document.getElementById('clear-btn')?.addEventListener('click', () => {
    if (window.confirm(t('lb.confirm-clear'))) {
      db.clear();
      renderTable([]);
    }
  });
};

const _esc = (str = '') =>
  String(str).replace(/[&<>"']/g, (m) =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[m]
  );

const _fmtDate = (iso) => {
  try { return new Date(iso).toLocaleDateString(); }
  catch { return '—'; }
};
