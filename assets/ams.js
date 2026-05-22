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

  // ----- Mobile Menu Toggle -----
  const mBtn = document.getElementById('mobile-menu-btn');
  const mMenu = document.getElementById('mobile-menu');
  if (mBtn && mMenu) {
    function closeMobileMenu() {
      mMenu.classList.remove('is-open');
      mBtn.setAttribute('aria-expanded', 'false');
      mMenu.setAttribute('aria-hidden', 'true');
      mBtn.classList.remove('menu-is-open');
    }
    function openMobileMenu() {
      mMenu.classList.add('is-open');
      mBtn.setAttribute('aria-expanded', 'true');
      mMenu.setAttribute('aria-hidden', 'false');
      mBtn.classList.add('menu-is-open');
    }
    mBtn.addEventListener('click', () => {
      mMenu.classList.contains('is-open') ? closeMobileMenu() : openMobileMenu();
    });
    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileMenu();
    });
    // Close when clicking a link inside the menu
    mMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMobileMenu);
    });
  }

  // ----- Framework Page Tabs (article / method / theory) -----
  const tablist = document.querySelector('.fw-tabs');
  if (tablist) {
    const tabs = Array.from(tablist.querySelectorAll('.fw-tab'));
    const panels = Array.from(document.querySelectorAll('.tab-panel'));
    const validNames = tabs.map(t => t.dataset.tab);

    function activate(name) {
      if (!validNames.includes(name)) name = validNames[0];
      tabs.forEach(t => {
        const on = t.dataset.tab === name;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      panels.forEach(p => {
        const on = p.dataset.panel === name;
        p.classList.toggle('is-active', on);
        if (on) p.removeAttribute('hidden'); else p.setAttribute('hidden', '');
      });
      try { sessionStorage.setItem('ams-tab', name); } catch(e) {}
      // sync URL hash without scrolling
      if (window.history && history.replaceState) {
        const anchor = name === 'article' ? 'article' : name;
        history.replaceState(null, '', '#' + anchor);
      }
    }

    tabs.forEach(t => {
      t.addEventListener('click', (ev) => {
        ev.preventDefault();
        activate(t.dataset.tab);
      });
    });

    // Init from hash → sessionStorage → HTML default (is-active) → first tab
    let initial = (location.hash || '').replace('#', '').toLowerCase();
    if (!validNames.includes(initial)) {
      try {
        const saved = sessionStorage.getItem('ams-tab');
        if (validNames.includes(saved)) initial = saved;
      } catch(e) {}
    }
    if (!validNames.includes(initial)) {
      // Fall back to whichever tab has is-active in HTML markup, else first
      const htmlActive = tabs.find(t => t.classList.contains('is-active'));
      initial = htmlActive ? htmlActive.dataset.tab : validNames[0];
    }
    activate(initial);
  }

  // ----- TTS Audio Tour (Web Speech API) -----
  if ('speechSynthesis' in window) {
    let activeTtsBtn = null;

    function stopTts() {
      window.speechSynthesis.cancel();
      if (activeTtsBtn) {
        activeTtsBtn.classList.remove('is-speaking');
        activeTtsBtn.setAttribute('aria-label', activeTtsBtn.getAttribute('data-tts-label') || '播放导览');
        activeTtsBtn = null;
      }
    }

    document.querySelectorAll('.tts-btn').forEach(btn => {
      // Store original label
      if (!btn.getAttribute('data-tts-label')) {
        btn.setAttribute('data-tts-label', btn.textContent.trim());
      }

      btn.addEventListener('click', () => {
        // If this button is already speaking, stop
        if (btn === activeTtsBtn && window.speechSynthesis.speaking) {
          stopTts();
          return;
        }
        // Stop any current speech
        stopTts();

        const text = btn.getAttribute('data-tts') || '';
        if (!text) return;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = 0.88;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Try to pick a Chinese voice if available
        const voices = window.speechSynthesis.getVoices();
        const zhVoice = voices.find(v => v.lang.startsWith('zh') && !v.name.includes('Google')) ||
                        voices.find(v => v.lang.startsWith('zh'));
        if (zhVoice) utterance.voice = zhVoice;

        activeTtsBtn = btn;
        btn.classList.add('is-speaking');

        utterance.onend = () => {
          btn.classList.remove('is-speaking');
          if (activeTtsBtn === btn) activeTtsBtn = null;
        };
        utterance.onerror = () => {
          btn.classList.remove('is-speaking');
          if (activeTtsBtn === btn) activeTtsBtn = null;
        };

        // Chrome workaround: voices may load async
        if (window.speechSynthesis.getVoices().length === 0) {
          window.speechSynthesis.onvoiceschanged = () => {
            const v2 = window.speechSynthesis.getVoices();
            const zh2 = v2.find(v => v.lang.startsWith('zh'));
            if (zh2) utterance.voice = zh2;
          };
        }

        window.speechSynthesis.speak(utterance);
      });
    });

    // Stop TTS when user navigates away
    window.addEventListener('beforeunload', stopTts);
    window.addEventListener('pagehide', stopTts);
  }
})();
