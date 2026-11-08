// ============================================================
// NexTech — 솔루션 드롭다운 메뉴 + 좌측 탭 (nav-extra)
//
//  ▶ 기존 화면으로 되돌리기:  아래 CONFIG 두 값을 false 로 바꾸고 저장하면 끝.
//  ▶ 비교해서 보기:  주소 뒤에 ?nav=old 를 붙이면 기존 메뉴로 보입니다.
//    예) solution.html?nav=old
// ============================================================
(function () {
  var CONFIG = {
    dropdown: true,   // 상단 '솔루션' 에 마우스를 올리면 3가지 메뉴 표시
    sideTabs: true    // 솔루션 페이지 왼쪽 탭 (3가지 메뉴)
  };
  if (/[?&]nav=old\b/.test(location.search)) return;

  var ITEMS = [
    { href: 'solution.html#problem', ids: ['problem', 'how', 'defects', 'features', 'algorithm'],
      ko: ['사출 불량 진단·최적화 AI', '10대 불량 진단과 역추론 최적화'],
      en: ['Defect Diagnosis & Optimization AI', '10-defect diagnosis and inverse optimization'],
      tab: { ko: '불량 진단', en: 'Diagnosis' } },
    { href: 'solution.html#edge-ai', ids: ['edge-ai'],
      ko: ['Edge AI 실시간 자율 제어', '위험 감지 즉시 공정 조건을 스스로 재설정'],
      en: ['Edge AI Real-Time Control', 'Resets process conditions the moment risk is detected'],
      tab: { ko: '실시간 제어', en: 'Edge AI' } },
    { href: 'solution.html#rag-ai', ids: ['rag-ai'],
      ko: ['사출 지식 RAG AI', '쌓일수록 똑똑해지는 지식 기반 처방'],
      en: ['Injection Knowledge RAG AI', 'Prescriptions that get smarter as knowledge grows'],
      tab: { ko: '지식 RAG', en: 'Knowledge RAG' } }
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
          a.addEventListener('click', function () {      // 같은 페이지 이동 시에도 메뉴를 닫음
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
    if (CONFIG.sideTabs && document.getElementById('edge-ai') && document.getElementById('rag-ai')) {
      var aside = el('aside', 'side-tabs');
      var tabs = ITEMS.map(function (it) {
        var a = el('a', 'side-tab');
        a.href = '#' + it.ids[0];
        aside.appendChild(a);
        labelUpdaters.push(function (l) { a.textContent = it.tab[l]; a.title = it[l][0]; });
        return a;
      });
      labelUpdaters.push(function (l) { aside.setAttribute('aria-label', ARIA[l]); });
      document.body.appendChild(aside);

      var ticking = false;
      function spy() {
        ticking = false;
        var probe = window.innerHeight * 0.35;
        tabs.forEach(function (tab, i) {
          var ids = ITEMS[i].ids;
          var first = document.getElementById(ids[0]);
          var last = document.getElementById(ids[ids.length - 1]);
          var on = false;
          if (first && last) {
            on = first.getBoundingClientRect().top <= probe && last.getBoundingClientRect().bottom > probe;
          }
          tab.classList.toggle('active', on);
          if (on) tab.setAttribute('aria-current', 'true'); else tab.removeAttribute('aria-current');
        });
      }
      function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      spy();
    }

    /* ---------- 3) KO/EN 전환에 맞춰 문구 갱신 ---------- */
    function render() { var l = lang(); labelUpdaters.forEach(function (f) { f(l); }); }
    render();
    new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
