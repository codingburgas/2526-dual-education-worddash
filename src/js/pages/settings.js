(function () {
  'use strict';

  // Initializes the settings page: applies saved settings, pre-selects radio inputs, and wires the form
  document.addEventListener('DOMContentLoaded', function () {
    var s = WD.settings.load();
    WD.settings.apply(s);
    WD.i18n.applyTranslations();
    WD.nav.render('settings');

    var form = document.getElementById('settings-form');
    if (!form) return;

    ['theme', 'font', 'caret', 'difficulty'].forEach(function (key) {
      var radio = form.querySelector('[name="' + key + '"][value="' + s[key] + '"]');
      if (radio) radio.checked = true;
    });

    _updateCaretPreview(s.caret);

    form.addEventListener('change', function () {
      var updated = {};
      new FormData(form).forEach(function (val, key) { updated[key] = val; });
      WD.settings.save(updated);
      WD.settings.apply(updated);
      if (updated.caret) _updateCaretPreview(updated.caret);
    });
  });

  // Updates the caret preview element's class to reflect the selected caret style
  function _updateCaretPreview(caret) {
    document.querySelectorAll('.caret-char').forEach(function (el) {
      el.className = 'caret-char preview-' + caret;
    });
  }

})();
