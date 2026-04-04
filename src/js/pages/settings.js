/**
 * pages/settings.js — settings.html logic
 * Depends on: worddash.js (WD global)
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var s = WD.settings.load();
    WD.settings.apply(s);
    WD.i18n.applyTranslations();
    WD.nav.render('settings');

    var form = document.getElementById('settings-form');
    if (!form) return;

    // Mark the current settings in the form
    ['theme', 'font', 'caret', 'difficulty'].forEach(function (key) {
      var radio = form.querySelector('[name="' + key + '"][value="' + s[key] + '"]');
      if (radio) radio.checked = true;
    });

    _updateCaretPreview(s.caret);

    // Auto-save and apply on every change
    form.addEventListener('change', function () {
      var updated = {};
      new FormData(form).forEach(function (val, key) { updated[key] = val; });
      WD.settings.save(updated);
      WD.settings.apply(updated);
      if (updated.caret) _updateCaretPreview(updated.caret);
    });
  });

  function _updateCaretPreview(caret) {
    document.querySelectorAll('.caret-char').forEach(function (el) {
      el.className = 'caret-char preview-' + caret;
    });
  }

})();
