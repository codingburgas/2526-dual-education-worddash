/**
 * script.js — index.html logic
 * Depends on: worddash.js (WD global) + all data files
 */
(function () {
  'use strict';

  // ── State ──────────────────────────────────────────────────────
  var _mode    = 'time';
  var _option  = 60;
  var _running = false;
  var _started = false;
  var _text    = '';

  var DEFAULTS = { time: 60, words: 25, quote: 'short', zen: null };

  // ── Init ───────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    WD.settings.apply();
    WD.i18n.applyTranslations();
    WD.nav.render('home');
    WD.db.init();
    WD.highlighter.init(document.getElementById('paragraph-display'));

    // Language switch reloads content
    document.addEventListener('wdlangchange', function () {
      if (!_running) _loadContent();
    });

    // Initial content load
    _setMode('time', 60);

    // Mode tab buttons
    document.querySelectorAll('.mode-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        if (_running) return;
        _setMode(tab.dataset.mode);
      });
    });

    // Mode option buttons
    document.querySelectorAll('.mode-option').forEach(function (opt) {
      opt.addEventListener('click', function () {
        if (_running) return;
        var raw = opt.dataset.value;
        var val = (_mode === 'time' || _mode === 'words') ? Number(raw) : raw;
        _setMode(_mode, val);
      });
    });

    // Typing input
    var textarea = document.getElementById('text-input');
    if (textarea) {
      textarea.addEventListener('input', function () {
        var typed = textarea.value;

        if (!_started && typed.length > 0) _startTest();

        WD.highlighter.update(typed);
        WD.ui.setProgress(WD.highlighter.progress(typed));

        // Auto-end for words / quote modes
        if (_started && _mode !== 'time' && _mode !== 'zen') {
          if (typed.length >= _text.length) _endTest();
        }
      });
    }

    // Restart / Stop buttons
    var restartBtn = document.getElementById('restart-btn');
    if (restartBtn) restartBtn.addEventListener('click', _restartTest);

    var stopBtn = document.getElementById('stop-btn');
    if (stopBtn) stopBtn.addEventListener('click', function () {
      if (_started) _endTest();
    });

    // Results panel buttons
    var tryAgainBtn = document.getElementById('try-again-btn');
    if (tryAgainBtn) tryAgainBtn.addEventListener('click', function () {
      WD.ui.hideResults();
      WD.ui.hideSavePrompt();
      _setMode(_mode, _option);
    });

    var newTestBtn = document.getElementById('new-test-btn');
    if (newTestBtn) newTestBtn.addEventListener('click', function () {
      WD.ui.hideResults();
      WD.ui.hideSavePrompt();
      _setMode(_mode, _option);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') { e.preventDefault(); _restartTest(); }
      if (e.key === 'Escape' && _started) _endTest();
    });
  });

  // ── Mode management ────────────────────────────────────────────

  function _setMode(mode, option) {
    _mode   = mode;
    _option = (option !== undefined && option !== null) ? option : DEFAULTS[mode];

    WD.ui.setModeTab(mode);
    WD.ui.setSubOptions(mode);
    WD.ui.setActiveOption(_option);

    _loadContent();
  }

  function _loadContent() {
    var lang = WD.i18n.getLanguage();
    var s    = WD.settings.load();
    var diff = s.difficulty || 'mixed';

    var opts = {};
    if      (_mode === 'words') opts = { count: _option, difficulty: diff };
    else if (_mode === 'quote') opts = { length: _option };
    else                        opts = { difficulty: diff };

    _text = WD.paragraph.getContent(_mode, opts, lang);

    WD.highlighter.render(_text);
    WD.ui.resetInput();
    WD.ui.setProgress(0);
    WD.ui.setStats(0, 100);
    _resetTimer();
    WD.ui.focusInput();
  }

  // ── Test lifecycle ─────────────────────────────────────────────

  function _startTest() {
    _started = true;
    _running = true;

    if (_mode === 'time') {
      WD.timer.start(true, _option, _onTick, _endTest);
    } else {
      WD.timer.start(false, null, _onTick, null);
    }
  }

  function _onTick(remaining, elapsed) {
    var ta    = document.getElementById('text-input');
    var typed = ta ? ta.value : '';

    // Update timer display
    if (_mode === 'time') {
      WD.ui.setTimer(WD.calc.formatTime(remaining != null ? remaining : 0));
    } else {
      WD.ui.setTimer(WD.calc.formatTime(elapsed));
    }

    // Update live stats after half a second
    if (_started && elapsed > 0.5) {
      var words  = WD.calc.wordCount(typed);
      var stats  = WD.calc.charStats(typed, _text);
      var wpm    = WD.calc.grossWPM(words, elapsed);
      var acc    = WD.calc.accuracy(typed.length, stats.correct);
      WD.ui.setStats(wpm, acc);
    }
  }

  function _endTest() {
    if (!_started || !_running) return;

    WD.timer.stop();
    _running = false;
    _started = false;

    var ta    = document.getElementById('text-input');
    var typed = ta ? ta.value : '';
    WD.ui.disableInput();

    // Compile results
    var elapsed = WD.timer.getElapsed();
    var lang    = WD.i18n.getLanguage();
    var words   = WD.calc.wordCount(typed);
    var correct = WD.calc.correctWordCount(typed, _text);
    var stats   = WD.calc.charStats(typed, _text);

    var modeStr = _mode === 'time'  ? 'time-'  + _option :
                  _mode === 'words' ? 'words-' + _option :
                  _mode === 'quote' ? 'quote-' + _option : 'zen';

    var results = {
      grossWpm:       WD.calc.grossWPM(words, elapsed),
      netWpm:         WD.calc.netWPM(correct, elapsed),
      accuracy:       WD.calc.accuracy(typed.length, stats.correct),
      charsCorrect:   stats.correct,
      charsIncorrect: stats.incorrect,
      duration:       Math.round(elapsed),
      mode:           modeStr,
      language:       lang
    };

    WD.ui.showResults(results);

    var cap = results;
    WD.ui.showSavePrompt(function (name) {
      WD.db.add({
        name:           name,
        wpm:            cap.grossWpm,
        netWpm:         cap.netWpm,
        accuracy:       cap.accuracy,
        mode:           cap.mode,
        language:       cap.language,
        duration:       cap.duration,
        charsCorrect:   cap.charsCorrect,
        charsIncorrect: cap.charsIncorrect
      });
    });
  }

  function _restartTest() {
    WD.timer.stop();
    _running = false;
    _started = false;
    WD.ui.hideResults();
    WD.ui.hideSavePrompt();
    _setMode(_mode, _option);
  }

  function _resetTimer() {
    if (_mode === 'time') {
      WD.ui.setTimer(WD.calc.formatTime(_option));
    } else {
      WD.ui.setTimer('00:00');
    }
  }

})();
