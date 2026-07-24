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

  /* ---------- i18n (KO/EN toggle) ---------- */
  var EN = (typeof PAGE_EN !== 'undefined') ? PAGE_EN : {};
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
    var dict = (lang === 'en') ? EN : KO;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-alt');
      if (lang === 'en' && EN[key] !== undefined) {
        el.setAttribute('alt', EN[key]);
      } else if (ALT_KO[key] !== undefined) {
        el.setAttribute('alt', ALT_KO[key]);
      }
    });
    document.title = (lang === 'en') ? (EN['page-title'] || TITLE_KO) : TITLE_KO;
    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'ko');
    document.querySelectorAll('.lang-btn').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-lang-btn') === lang);
    });
    try { localStorage.setItem('nextech-lang', lang); } catch (e) {}
  }

  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyLang(btn.getAttribute('data-lang-btn'));
    });
  });

  var saved = null;
  try { saved = localStorage.getItem('nextech-lang'); } catch (e) {}
  if (saved === 'en') applyLang('en');
});
