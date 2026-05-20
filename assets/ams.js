// =================================================================
// ZAOWUYUN · shared scripts  v2 (i18n + reveal + theme + lang)
// =================================================================

(function () {
  // ----- Scroll Reveal -----
  // Supports: [data-reveal], [data-reveal-slow], [data-reveal-clip], [data-reveal-zoom], .word-reveal
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    const sel = '[data-reveal], [data-reveal-slow], [data-reveal-clip], [data-reveal-zoom], .word-reveal';
    document.querySelectorAll(sel).forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('[data-reveal], [data-reveal-slow], [data-reveal-clip], [data-reveal-zoom], .word-reveal').forEach(el => el.classList.add('in'));
  }

  // ----- Theme Toggle -----
  const tBtn = document.getElementById('theme-toggle');
  if (tBtn) {
    tBtn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('zwy-theme', next); } catch (e) {}
    });
  }

  // ----- i18n Loader (stub) -----
  // Default: zh-CN. Multi-language ready via data-i18n attributes.
  // Each translatable element should carry data-i18n="path.to.key".
  // To add English later: drop assets/i18n/en-US.json with the same key shape,
  //                       and call window.zwyI18n.setLang('en-US').
  const I18N = {
    lang: 'zh-CN',
    dict: {},      // loaded translations
    fallback: {},  // page-default text (rendered HTML — Chinese)
  };

  function snapshotFallbacks() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (!(key in I18N.fallback)) I18N.fallback[key] = el.innerHTML;
    });
  }

  function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = (I18N.lang === 'zh-CN') ? I18N.fallback[key] : (I18N.dict[key] || I18N.fallback[key]);
      if (val !== undefined && val !== null) el.innerHTML = val;
    });
  }

  async function setLang(lang) {
    if (lang === I18N.lang) return;
    if (lang === 'zh-CN') {
      I18N.lang = 'zh-CN';
      I18N.dict = {};
      applyI18n();
      document.documentElement.setAttribute('lang', 'zh-CN');
      try { localStorage.setItem('zwy-lang', 'zh-CN'); } catch(e) {}
      return;
    }
    try {
      const res = await fetch(`assets/i18n/${lang}.json`);
      if (!res.ok) throw new Error('lang file missing');
      I18N.dict = await res.json();
      I18N.lang = lang;
      applyI18n();
      document.documentElement.setAttribute('lang', lang);
      try { localStorage.setItem('zwy-lang', lang); } catch(e) {}
    } catch (e) {
      console.warn('[zwy-i18n] failed to load', lang, e);
    }
  }

  snapshotFallbacks();
  window.zwyI18n = { setLang, current: () => I18N.lang };

  // restore previously chosen language (if any)
  try {
    const saved = localStorage.getItem('zwy-lang');
    if (saved && saved !== 'zh-CN') setLang(saved);
  } catch(e) {}

  // ----- Lang Switch button (optional) -----
  const lBtn = document.getElementById('lang-switch');
  if (lBtn) {
    lBtn.addEventListener('click', () => {
      const next = I18N.lang === 'zh-CN' ? 'en-US' : 'zh-CN';
      setLang(next);
      lBtn.textContent = next === 'zh-CN' ? 'EN' : '中';
    });
  }
})();
