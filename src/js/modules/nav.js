import { t, getLanguage, setLanguage } from './i18n.js';

const KEYBOARD_SVG = `<svg class="nav-brand-icon" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
  aria-hidden="true">
  <rect x="2" y="6" width="20" height="12" rx="2" ry="2"/>
  <line x1="6"  y1="10" x2="6.01"  y2="10"/>
  <line x1="10" y1="10" x2="10.01" y2="10"/>
  <line x1="14" y1="10" x2="14.01" y2="10"/>
  <line x1="18" y1="10" x2="18.01" y2="10"/>
  <line x1="8"  y1="14" x2="16"    y2="14"/>
</svg>`;

// Builds and injects the full nav HTML, then wires the language toggle and hamburger button
export const renderNav = (activePage = 'home') => {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  const lang = getLanguage();

  nav.innerHTML = `
    <div class="nav-inner">
      <a href="index.html" class="nav-brand" aria-label="${t('nav.brand')}">
        ${KEYBOARD_SVG}
        <span class="nav-brand-text">${t('nav.brand')}</span>
      </a>

      <ul class="nav-links" id="nav-links-list" role="list">
        <li>
          <a href="index.html"
             class="${activePage === 'home' ? 'active' : ''}"
             data-i18n="nav.home">${t('nav.home')}</a>
        </li>
        <li>
          <a href="leaderboard.html"
             class="${activePage === 'leaderboard' ? 'active' : ''}"
             data-i18n="nav.leaderboard">${t('nav.leaderboard')}</a>
        </li>
        <li>
          <a href="settings.html"
             class="${activePage === 'settings' ? 'active' : ''}"
             data-i18n="nav.settings">${t('nav.settings')}</a>
        </li>
      </ul>

      <button class="nav-hamburger" id="nav-hamburger" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>

      <button class="lang-toggle" id="lang-btn" aria-label="Switch language">
        <span class="${lang === 'en' ? 'lang-active' : ''}">EN</span>
        <span class="lang-sep">/</span>
        <span class="${lang === 'bg' ? 'lang-active' : ''}">BG</span>
      </button>
    </div>
  `;

  document.getElementById('lang-btn')?.addEventListener('click', () => {
    setLanguage(lang === 'en' ? 'bg' : 'en');
    renderNav(activePage);
  });

  const hamburger = document.getElementById('nav-hamburger');
  const linksList = document.getElementById('nav-links-list');
  hamburger?.addEventListener('click', () => {
    const isOpen = linksList.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });
};
