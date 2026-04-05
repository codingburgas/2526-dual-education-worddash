(function () {
  'use strict';

  var MEDALS = ['\uD83E\uDD47', '\uD83E\uDD48', '\uD83E\uDD49'];

  document.addEventListener('DOMContentLoaded', function () {
    WD.settings.apply();
    WD.i18n.applyTranslations();
    WD.nav.render('leaderboard');
    WD.db.init();

    _renderTable(WD.db.getAll());
    _bindFilters();
    _bindActions();
  });

  function _renderTable(scores) {
    var tbody = document.querySelector('#scores-table tbody');
    if (!tbody) return;
    var t = WD.i18n.t.bind(WD.i18n);

    if (!scores.length) {
      tbody.innerHTML = '<tr><td colspan="8"><div class="lb-empty"><div class="lb-empty-icon">\uD83C\uDFC6</div><p>' + t('lb.empty') + '</p></div></td></tr>';
      return;
    }

    tbody.innerHTML = scores.slice(0, 20).map(function (score, i) {
      return '<tr class="' + (i < 3 ? 'rank-' + (i + 1) : '') + '">' +
        '<td class="rank-cell">'     + (MEDALS[i] || (i + 1)) + '</td>' +
        '<td class="name-cell">'     + _esc(score.name) + '</td>' +
        '<td class="wpm-cell num">'  + score.wpm + '</td>' +
        '<td class="net-wpm-cell num">' + (score.netWpm != null ? score.netWpm : '\u2014') + '</td>' +
        '<td class="accuracy-cell num">' + score.accuracy + '%</td>' +
        '<td class="mode-cell"><span class="mode-badge">' + _esc(score.mode) + '</span></td>' +
        '<td class="lang-cell"><span class="lang-badge">' + ((score.language || 'en').toUpperCase()) + '</span></td>' +
        '<td class="date-cell">' + _fmtDate(score.date) + '</td>' +
        '</tr>';
    }).join('');
  }

  function _bindFilters() {
    var modeEl = document.getElementById('filter-mode');
    var langEl = document.getElementById('filter-lang');

    function refresh() {
      var filter = {};
      if (modeEl && modeEl.value) filter.mode     = modeEl.value;
      if (langEl && langEl.value) filter.language = langEl.value;
      _renderTable(WD.db.getAll(filter));
    }

    if (modeEl) modeEl.addEventListener('change', refresh);
    if (langEl) langEl.addEventListener('change', refresh);
  }

  function _bindActions() {
    var t = WD.i18n.t.bind(WD.i18n);

    var exportBtn = document.getElementById('export-btn');
    if (exportBtn) exportBtn.addEventListener('click', function () { WD.db.exportJSON(); });

    var importInput = document.getElementById('import-input');
    if (importInput) importInput.addEventListener('change', function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        var count = WD.db.importJSON(ev.target.result);
        alert(t('lb.imported') + ' ' + count + ' ' + t('lb.scores'));
        _renderTable(WD.db.getAll());
        e.target.value = '';
      };
      reader.readAsText(file);
    });

    var clearBtn = document.getElementById('clear-btn');
    if (clearBtn) clearBtn.addEventListener('click', function () {
      if (window.confirm(t('lb.confirm-clear'))) {
        WD.db.clear();
        _renderTable([]);
      }
    });
  }

  function _esc(str) {
    return String(str || '').replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  function _fmtDate(iso) {
    try { return new Date(iso).toLocaleDateString(); } catch (e) { return '\u2014'; }
  }

})();
