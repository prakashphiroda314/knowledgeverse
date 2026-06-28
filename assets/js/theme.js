/* =============================================
   KnowledgeVerse — Theme (Dark Mode)
   ============================================= */
(function () {
  'use strict';

  const STORAGE_KEY = 'kv-theme';
  const THEMES = { LIGHT: 'light', DARK: 'dark' };

  function getPreferred() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT;
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateButtons(theme);
  }

  function updateButtons(theme) {
    document.querySelectorAll('[data-theme-btn]').forEach(btn => {
      btn.setAttribute('aria-label', theme === THEMES.DARK ? 'Switch to light mode' : 'Switch to dark mode');
      btn.innerHTML = theme === THEMES.DARK ? '☀️' : '🌙';
    });
  }

  function toggle() {
    const current = document.documentElement.getAttribute('data-theme') || THEMES.LIGHT;
    applyTheme(current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK);
  }

  // Apply immediately to prevent flash
  applyTheme(getPreferred());

  // Expose globally
  window.KVTheme = { toggle, applyTheme, getPreferred };

  // Wire up buttons after DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-theme-btn]').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
    updateButtons(getPreferred());
  });

  // Listen for system preference change
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
    }
  });
})();
