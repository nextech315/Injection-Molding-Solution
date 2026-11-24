// ============================================================
// NexTech AI — Shared site script
// Expects a page-level `const PAGE_EN = {...}` dictionary to be
// defined before this script runs (or omitted if no i18n text).
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var mobileMenu = document.querySelector('.mobile-menu');
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Active nav link ---------- */
  var currentPage = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ---------- i18n (KO/EN/JA toggle) ---------- */
  var EN = (typeof PAGE_EN !== 'undefined') ? PAGE_EN : {};
  var JA = (typeof PAGE_JA !== 'undefined') ? PAGE_JA : {};
  var KO = {};
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    KO[el.getAttribute('data-i18n')] = el.innerHTML;
  });
  var ALT_KO = {};
  document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
    ALT_KO[el.getAttribute('data-i18n-alt')] = el.getAttribute('alt') || '';
  });
  var TITLE_KO = document.title;

  function applyLang(lang) {
    var dict = (lang === 'en') ? EN : (lang === 'ja') ? JA : KO;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-alt');
      if (lang === 'en' && EN[key] !== undefined) {
        el.setAttribute('alt', EN[key]);
      } else if (lang === 'ja' && JA[key] !== undefined) {
        el.setAttribute('alt', JA[key]);
      } else if (ALT_KO[key] !== undefined) {
        el.setAttribute('alt', ALT_KO[key]);
      }
    });
    document.title = (lang === 'en') ? (EN['page-title'] || TITLE_KO)
                   : (lang === 'ja') ? (JA['page-title'] || TITLE_KO) : TITLE_KO;
    document.documentElement.setAttribute('lang', (lang === 'en' || lang === 'ja') ? lang : 'ko');
    document.querySelectorAll('.lang-btn').forEach(function (b) {
      var on = b.getAttribute('data-lang-btn') === lang;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    document.querySelectorAll('.lang-current-code').forEach(function (c) {
      c.textContent = lang.toUpperCase();
    });
    try { localStorage.setItem('nextech-lang', lang); } catch (e) {}
  }

  /* ---------- Language dropdown open / close ---------- */
  function closeLangMenus(except) {
    document.querySelectorAll('.lang-select.open').forEach(function (s) {
      if (s === except) return;
      s.classList.remove('open');
      var t = s.querySelector('.lang-current');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }
  document.querySelectorAll('.lang-select').forEach(function (sel) {
    var cur = sel.querySelector('.lang-current');
    if (!cur) return;
    cur.addEventListener('click', function (e) {
      e.stopPropagation();
      closeLangMenus(sel);
      var open = sel.classList.toggle('open');
      cur.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function () { closeLangMenus(null); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLangMenus(null); });

  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      applyLang(btn.getAttribute('data-lang-btn'));
      closeLangMenus(null);
    });
  });

  var saved = null;
  try { saved = localStorage.getItem('nextech-lang'); } catch (e) {}
  if (saved === 'en' || saved === 'ja') applyLang(saved);
});
