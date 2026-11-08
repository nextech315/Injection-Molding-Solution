// ============================================================
// NexTech — 솔루션 드롭다운 메뉴 + 좌측 탭 (nav-extra)
//
//  ▶ 기존 화면으로 되돌리기:  아래 CONFIG 두 값을 false 로 바꾸고 저장하면 끝.
//  ▶ 비교해서 보기:  주소 뒤에 ?nav=old 를 붙이면 기존 메뉴로 보입니다.
//    예) solution.html?nav=old
// ============================================================
(function () {
  var CONFIG = {
    dropdown: true,   // 상단 '솔루션' 에 마우스를 올리면 하위 메뉴 표시
    sideTabs: true    // 솔루션 페이지 왼쪽 탭
  };
  if (/[?&]nav=old\b/.test(location.search)) return;

  var ITEMS = [
    { href: 'index.html#modules', ids: ['modules'],
      ko: ['8대 모듈 통합 아키텍처', 'IM-SOLUTION 8대 핵심 시스템 상세'],
      en: ['8-Module Integrated Suite', 'Detailed specs of all 8 core modules'],
      tab: { ko: '8대 모듈', en: '8 Modules' } },
    { href: 'solution.html#moldflow-auto', ids: ['moldflow-auto'],
      ko: ['MOD-04 Moldflow 자동 최적화', 'LHS 30건 DoE 및 실시간 자동 루프'],
      en: ['MOD-04 Moldflow Auto-Opt', 'LHS 30-case DoE & real-time auto solver'],
      tab: { ko: 'Moldflow 최적화', en: 'Moldflow Opt' } },
    { href: 'solution.html#edge-ai', ids: ['edge-ai'],
      ko: ['Edge AI 실시간 자율 제어', '위험 감지 시 12초 내 SV 자동 재설정'],
      en: ['Edge AI Real-Time Control', 'Autonomously resets SV within 12s on risk'],
      tab: { ko: '실시간 제어', en: 'Edge AI' } },
    { href: 'solution.html#rag-ai', ids: ['rag-ai'],
      ko: ['사출 지식 특화 RAG AI', '심야 자율 크롤링 & 구체적 수치 처방'],
      en: ['Injection Knowledge RAG AI', 'Nightly crawling & numeric prescriptions'],
      tab: { ko: '지식 RAG', en: 'Knowledge RAG' } },
    { href: 'solution.html#problem', ids: ['problem', 'how', 'defects', 'features', 'algorithm'],
      ko: ['10대 불량 진단·역추론 AI', '10대 불량 동시 진단과 역추론 최적화'],
      en: ['10-Defect Diagnosis & Opt AI', 'Simultaneous diagnosis & inverse optimization'],
      tab: { ko: '불량 진단', en: 'Defect Diagnosis' } }
  ];
  var ARIA = { ko: '솔루션 바로가기', en: 'Solution shortcuts' };

  function lang() { return document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'ko'; }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function init() {
    var labelUpdaters = [];

    /* ---------- 1) 데스크톱 드롭다운 + 모바일 하위 메뉴 ---------- */
    if (CONFIG.dropdown) {
      var trigger = document.querySelector('.nav-links a[href="solution.html"]');
      if (trigger && trigger.parentNode) {
        var li = trigger.parentNode;
        li.classList.add('has-sub');
        trigger.setAttribute('aria-haspopup', 'true');
        var sub = el('div', 'nav-sub');
        var inner = el('div', 'nav-sub-inner');
        sub.appendChild(inner);
        ITEMS.forEach(function (it, i) {
          var a = el('a', 'nav-sub-item');
          a.href = it.href;
          var num = el('span', 'nav-sub-num', '0' + (i + 1));
          var box = el('span', 'nav-sub-text');
          var b = el('b'); var s = el('small');
          box.appendChild(b); box.appendChild(s);
          a.appendChild(num); a.appendChild(box);
          inner.appendChild(a);
          labelUpdaters.push(function (l) { b.textContent = it[l][0]; s.textContent = it[l][1]; });
        });
        li.appendChild(sub);
      }

      var mTrigger = document.querySelector('.mobile-menu a[href="solution.html"]');
      var mMenu = document.querySelector('.mobile-menu');
      if (mTrigger && mMenu) {
        var after = mTrigger.nextSibling;
        ITEMS.forEach(function (it) {
          var a = el('a', 'mobile-sub');
          a.href = it.href;
          mMenu.insertBefore(a, after);
          a.addEventListener('click', function () {
            mMenu.classList.remove('open');
            document.body.style.overflow = '';
            var t = document.querySelector('.nav-toggle');
            if (t) t.setAttribute('aria-expanded', 'false');
          });
          labelUpdaters.push(function (l) { a.textContent = it[l][0]; });
        });
      }
    }

    /* ---------- 2) 좌측 탭 (솔루션 페이지에서만) ---------- */
    if (CONFIG.sideTabs && (document.getElementById('edge-ai') || document.getElementById('moldflow-auto'))) {
      var aside = el('aside', 'side-tabs');
      var tabs = ITEMS.map(function (it) {
        var a = el('a', 'side-tab');
        a.href = it.href.indexOf('#') !== -1 ? ('#' + it.href.split('#')[1]) : it.href;
        aside.appendChild(a);
        labelUpdaters.push(function (l) { a.textContent = it.tab[l]; a.title = it[l][0]; });
        return a;
      });
      labelUpdaters.push(function (l) { aside.setAttribute('aria-label', ARIA[l]); });
      document.body.appendChild(aside);

      var ticking = false;
      function spy() {
        ticking = false;
        var top = window.scrollY + 140;
        var activeIdx = -1;
        ITEMS.forEach(function (it, idx) {
          (it.ids || []).forEach(function (id) {
            var el = document.getElementById(id);
            if (el && el.offsetTop <= top && el.offsetTop + el.offsetHeight > top) {
              activeIdx = idx;
            }
          });
        });
        tabs.forEach(function (t, idx) {
          t.classList.toggle('active', idx === activeIdx);
        });
      }
      window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(spy); }
      }, { passive: true });
      spy();
    }

    /* ---------- 3) 언어 변경 시 텍스트 갱신 ---------- */
    function refresh(l) {
      labelUpdaters.forEach(function (fn) { fn(l); });
    }
    refresh(lang());
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setTimeout(function () { refresh(lang()); }, 0);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
