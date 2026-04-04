/**
 * WordDash — Shared Library
 * All modules in one global WD object. No ES module imports.
 * Works on file:// and any server.
 */
(function () {
  'use strict';

  var WD = window.WD = {};

  // ══════════════════════════════════════════════════════════════
  //  STORAGE
  // ══════════════════════════════════════════════════════════════
  var SCORES_KEY   = 'wds_scores';
  var SETTINGS_KEY = 'wds_settings';
  var LANG_KEY     = 'wds_lang';

  WD.storage = {
    SCORES_KEY:   SCORES_KEY,
    SETTINGS_KEY: SETTINGS_KEY,
    LANG_KEY:     LANG_KEY,
    get: function (key) {
      try { var r = localStorage.getItem(key); return r !== null ? JSON.parse(r) : null; }
      catch (e) { return null; }
    },
    set: function (key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
    },
    remove: function (key) {
      try { localStorage.removeItem(key); } catch (e) {}
    }
  };

  // ══════════════════════════════════════════════════════════════
  //  SETTINGS
  // ══════════════════════════════════════════════════════════════
  var SETTING_DEFAULTS = { theme: 'dark', font: 'mono', caret: 'line', difficulty: 'mixed' };

  WD.settings = {
    load: function () {
      return Object.assign({}, SETTING_DEFAULTS, WD.storage.get(SETTINGS_KEY) || {});
    },
    save: function (partial) {
      WD.storage.set(SETTINGS_KEY, Object.assign(WD.settings.load(), partial));
    },
    apply: function (s) {
      s = s || WD.settings.load();
      document.documentElement.dataset.theme = s.theme || 'dark';
      document.documentElement.dataset.font  = s.font  || 'mono';
      document.documentElement.dataset.caret = s.caret || 'line';
    }
  };

  // ══════════════════════════════════════════════════════════════
  //  I18N
  // ══════════════════════════════════════════════════════════════
  var _lang = WD.storage.get(LANG_KEY) || 'en';
  var _tr   = window.WD_I18N || { en: {}, bg: {} };

  WD.i18n = {
    getLanguage: function () { return _lang; },
    setLanguage: function (lang) {
      if (lang !== 'en' && lang !== 'bg') return;
      _lang = lang;
      WD.storage.set(LANG_KEY, lang);
      document.documentElement.dataset.lang = lang;
      WD.i18n.applyTranslations();
      document.dispatchEvent(new CustomEvent('wdlangchange', { detail: { lang: lang } }));
    },
    t: function (key) {
      var d = _tr[_lang];
      if (d && d[key] !== undefined) return d[key];
      var en = _tr['en'];
      return (en && en[key] !== undefined) ? en[key] : key;
    },
    applyTranslations: function () {
      var t = WD.i18n.t.bind(WD.i18n);
      document.querySelectorAll('[data-i18n]').forEach(function (el) {
        el.textContent = t(el.dataset.i18n);
      });
      document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
        el.placeholder = t(el.dataset.i18nPlaceholder);
      });
      document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
        el.setAttribute('aria-label', t(el.dataset.i18nAria));
      });
    }
  };

  // ══════════════════════════════════════════════════════════════
  //  NAV
  // ══════════════════════════════════════════════════════════════
  var KB_SVG = '<svg class="nav-brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="6" y1="10" x2="6.01" y2="10"/><line x1="10" y1="10" x2="10.01" y2="10"/><line x1="14" y1="10" x2="14.01" y2="10"/><line x1="18" y1="10" x2="18.01" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/></svg>';

  WD.nav = {
    render: function (activePage) {
      activePage = activePage || 'home';
      var nav = document.getElementById('main-nav');
      if (!nav) return;
      var t   = WD.i18n.t.bind(WD.i18n);
      var lng = WD.i18n.getLanguage();

      nav.innerHTML =
        '<div class="nav-inner">' +
          '<a href="index.html" class="nav-brand" aria-label="' + t('nav.brand') + '">' +
            KB_SVG + '<span class="nav-brand-text">' + t('nav.brand') + '</span>' +
          '</a>' +
          '<ul class="nav-links" id="nav-links-list" role="list">' +
            '<li><a href="index.html" class="' + (activePage === 'home' ? 'active' : '') + '">' + t('nav.home') + '</a></li>' +
            '<li><a href="leaderboard.html" class="' + (activePage === 'leaderboard' ? 'active' : '') + '">' + t('nav.leaderboard') + '</a></li>' +
            '<li><a href="settings.html" class="' + (activePage === 'settings' ? 'active' : '') + '">' + t('nav.settings') + '</a></li>' +
          '</ul>' +
          '<button class="nav-hamburger" id="nav-hamburger" aria-label="Toggle menu" aria-expanded="false">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
          '<button class="lang-toggle" id="lang-btn" aria-label="Switch language">' +
            '<span class="' + (lng === 'en' ? 'lang-active' : '') + '">EN</span>' +
            '<span class="lang-sep">/</span>' +
            '<span class="' + (lng === 'bg' ? 'lang-active' : '') + '">BG</span>' +
          '</button>' +
        '</div>';

      document.getElementById('lang-btn').addEventListener('click', function () {
        WD.i18n.setLanguage(lng === 'en' ? 'bg' : 'en');
        WD.nav.render(activePage);
      });

      var ham   = document.getElementById('nav-hamburger');
      var links = document.getElementById('nav-links-list');
      ham.addEventListener('click', function () {
        var open = links.classList.toggle('open');
        ham.setAttribute('aria-expanded', String(open));
      });
    }
  };

  // ══════════════════════════════════════════════════════════════
  //  DATABASE
  // ══════════════════════════════════════════════════════════════
  var _cache = [];

  WD.db = {
    init: function () { _cache = WD.storage.get(SCORES_KEY) || []; },
    add: function (entry) {
      if (!_dbOk(entry)) return null;
      var saved = Object.assign({}, entry, { id: Date.now().toString(), date: new Date().toISOString() });
      _cache.push(saved);
      _dbSave();
      return saved;
    },
    getAll: function (filter) {
      filter = filter || {};
      var r = _cache.slice();
      if (filter.mode)     r = r.filter(function (s) { return s.mode === filter.mode; });
      if (filter.language) r = r.filter(function (s) { return s.language === filter.language; });
      return r.sort(function (a, b) { return b.wpm - a.wpm; });
    },
    remove: function (id) { _cache = _cache.filter(function (s) { return s.id !== id; }); _dbSave(); },
    clear:  function ()   { _cache = []; _dbSave(); },
    exportJSON: function () {
      var blob = new Blob([JSON.stringify({ version: 1, exported: new Date().toISOString(), scores: _cache }, null, 2)], { type: 'application/json' });
      var url  = URL.createObjectURL(blob);
      var a    = document.createElement('a');
      a.href = url; a.download = 'worddash-scores.json';
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    },
    importJSON: function (str) {
      try {
        var data = JSON.parse(str);
        if (!Array.isArray(data.scores)) return 0;
        var existing = new Set(_cache.map(function (s) { return s.id; }));
        var fresh = data.scores.filter(function (s) { return _dbOk(s) && s.id && !existing.has(s.id); });
        _cache = _cache.concat(fresh); _dbSave();
        return fresh.length;
      } catch (e) { return 0; }
    }
  };

  function _dbOk(e) {
    return e != null && typeof e.name === 'string' && typeof e.wpm === 'number' && typeof e.accuracy === 'number' && typeof e.mode === 'string';
  }
  function _dbSave() { WD.storage.set(SCORES_KEY, _cache); }

  // ══════════════════════════════════════════════════════════════
  //  PARAGRAPH CONTENT
  // ══════════════════════════════════════════════════════════════
  WD.paragraph = {
    getContent: function (mode, options, lang) {
      options = options || {};
      lang    = lang    || 'en';
      var difficulty = options.difficulty || 'mixed';
      var length     = options.length     || 'mixed';
      var count      = options.count      || 25;

      var paras  = window.WD_PARAGRAPHS || [];
      var quotes = window.WD_QUOTES     || [];
      var wPool  = (window.WD_WORDS || {})[lang] || (window.WD_WORDS || {}).en || [];

      function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

      if (mode === 'words') {
        var out = [];
        for (var i = 0; i < count; i++) out.push(wPool[Math.floor(Math.random() * wPool.length)]);
        return out.join(' ');
      }

      if (mode === 'quote') {
        var fq = quotes;
        if (length !== 'mixed') fq = quotes.filter(function (q) { return q.length === length; });
        if (!fq.length) fq = quotes;
        var eq = rand(fq);
        return (eq && (eq[lang] || eq.en)) || '';
      }

      // time / zen
      var fp = paras;
      if (difficulty !== 'mixed') fp = paras.filter(function (p) { return p.difficulty === difficulty; });
      if (!fp.length) fp = paras;
      var ep = rand(fp);
      return (ep && (ep[lang] || ep.en)) || '';
    }
  };

  // ══════════════════════════════════════════════════════════════
  //  CALCULATOR  (pure functions)
  // ══════════════════════════════════════════════════════════════
  WD.calc = {
    grossWPM: function (words, sec) {
      if (!sec || sec < 0.5) return 0;
      return Math.round((words / sec) * 60);
    },
    netWPM: function (correct, sec) {
      if (!sec || sec < 0.5) return 0;
      return Math.max(0, Math.round((correct / sec) * 60));
    },
    accuracy: function (total, correct) {
      if (!total) return 100;
      return Math.round((correct / total) * 100);
    },
    charStats: function (typed, original) {
      var c = 0, inc = 0, min = Math.min(typed.length, original.length);
      for (var i = 0; i < min; i++) { if (typed[i] === original[i]) c++; else inc++; }
      return { correct: c, incorrect: inc, extra: Math.max(0, typed.length - original.length), missing: Math.max(0, original.length - typed.length) };
    },
    wordCount: function (text) { return text.trim().split(/\s+/).filter(Boolean).length; },
    correctWordCount: function (typed, original) {
      var tw = typed.trim().split(/\s+/), ow = original.trim().split(/\s+/), c = 0;
      tw.forEach(function (w, i) { if (w === ow[i]) c++; });
      return c;
    },
    formatTime: function (totalSec) {
      var s = Math.floor(Math.abs(totalSec || 0));
      var m = Math.floor(s / 60), sec = s % 60;
      return String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
    }
  };

  // ══════════════════════════════════════════════════════════════
  //  TIMER
  // ══════════════════════════════════════════════════════════════
  var _ivl = null, _t0 = null, _dur = null, _tickCb = null, _endCb = null;

  function _doTick() {
    var el = (Date.now() - _t0) / 1000;
    if (_dur !== null) {
      var rem = Math.max(0, _dur - Math.floor(el));
      if (_tickCb) _tickCb(rem, el);
      if (rem <= 0) { clearInterval(_ivl); _ivl = null; if (_endCb) _endCb(); }
    } else {
      if (_tickCb) _tickCb(null, el);
    }
  }

  WD.timer = {
    start: function (countdown, duration, onTick, onEnd) {
      WD.timer.stop();
      _t0 = Date.now(); _dur = countdown ? duration : null;
      _tickCb = onTick; _endCb = onEnd;
      _doTick();
      _ivl = setInterval(_doTick, 1000);
    },
    stop:  function () { clearInterval(_ivl); _ivl = null; },
    reset: function () { WD.timer.stop(); _t0 = null; _dur = null; _tickCb = null; _endCb = null; },
    getElapsed: function () { return _t0 ? (Date.now() - _t0) / 1000 : 0; },
    isRunning:  function () { return _ivl !== null; }
  };

  // ══════════════════════════════════════════════════════════════
  //  HIGHLIGHTER  (owns #paragraph-display)
  // ══════════════════════════════════════════════════════════════
  var _hlEl = null, _hlText = '';

  WD.highlighter = {
    init: function (el) { _hlEl = el; },
    render: function (text) {
      if (!_hlEl) return;
      _hlText = text;
      _hlEl.innerHTML = text.split('').map(function (ch, i) {
        return '<span class="char pending" data-i="' + i + '">' + (ch === ' ' ? '\u00a0' : ch) + '</span>';
      }).join('');
    },
    update: function (typed) {
      if (!_hlEl || !_hlText) return;
      var spans = _hlEl.querySelectorAll('.char');
      spans.forEach(function (sp, i) {
        sp.className = 'char';
        if (i < typed.length) sp.classList.add(typed[i] === _hlText[i] ? 'correct' : 'incorrect');
        else                   sp.classList.add('pending');
        if (i === typed.length) sp.classList.add('caret');
      });
      if (typed.length >= _hlText.length && spans.length) spans[spans.length - 1].classList.add('caret');
    },
    progress: function (typed) { return _hlText.length ? Math.min(1, typed.length / _hlText.length) : 0; },
    getText:  function ()      { return _hlText; }
  };

  // ══════════════════════════════════════════════════════════════
  //  UI  (owns all other DOM elements)
  // ══════════════════════════════════════════════════════════════
  function $i(id) { return document.getElementById(id); }

  WD.ui = {
    setTimer:    function (str) { var e = $i('timer-display');  if (e) e.textContent = str; },
    setStats:    function (wpm, acc) {
      var w = $i('live-wpm'), a = $i('live-accuracy');
      if (w) w.textContent = wpm;
      if (a) a.textContent = acc + '%';
    },
    setProgress: function (frac) {
      var bar = $i('progress-bar');
      if (bar) bar.style.width = Math.round(frac * 100) + '%';
    },
    setModeTab:  function (mode) {
      document.querySelectorAll('.mode-tab').forEach(function (t) {
        var on = t.dataset.mode === mode;
        t.classList.toggle('active', on);
        t.setAttribute('aria-selected', on);
      });
    },
    setSubOptions: function (mode) {
      document.querySelectorAll('.options-group').forEach(function (g) { g.classList.add('hidden'); });
      var el = $i('options-' + mode);
      if (el) el.classList.remove('hidden');
    },
    setActiveOption: function (val) {
      document.querySelectorAll('.mode-option').forEach(function (o) {
        o.classList.toggle('active', o.dataset.value === String(val));
      });
    },
    resetInput:   function () { var e = $i('text-input'); if (e) { e.value = ''; e.disabled = false; } },
    focusInput:   function () { var e = $i('text-input'); if (e) e.focus(); },
    disableInput: function () { var e = $i('text-input'); if (e) e.disabled = true; },

    showResults: function (data) {
      var panel = $i('results-panel'), area = $i('typing-area');
      if (!panel) return;
      function f(id, v) { var e = $i(id); if (e) e.textContent = v; }
      f('result-wpm',      data.grossWpm);
      f('result-net-wpm',  data.netWpm);
      f('result-accuracy', data.accuracy + '%');
      f('result-chars',    data.charsCorrect + ' / ' + (data.charsCorrect + data.charsIncorrect));
      f('result-time',     data.duration + 's');
      f('result-mode',     data.mode);
      f('result-lang',     (data.language || 'en').toUpperCase());
      if (area) area.classList.add('hidden');
      panel.classList.add('visible');
    },
    hideResults: function () {
      var p = $i('results-panel'), a = $i('typing-area');
      if (p) p.classList.remove('visible');
      if (a) a.classList.remove('hidden');
    },
    showSavePrompt: function (onSave) {
      var prompt = $i('save-prompt');
      if (!prompt) return;
      prompt.style.display = 'flex';
      var btn   = $i('save-score-btn');
      var input = $i('player-name-input');
      if (!btn || !input) return;
      // Replace button to clear old listeners
      var fresh = btn.cloneNode(true);
      btn.parentNode.replaceChild(fresh, btn);
      fresh.addEventListener('click', function () {
        onSave(input.value.trim() || 'Anonymous');
        prompt.style.display = 'none';
      });
      input.onkeydown = function (e) { if (e.key === 'Enter') fresh.click(); };
    },
    hideSavePrompt: function () {
      var p = $i('save-prompt');
      if (p) p.style.display = 'none';
    }
  };

})();
