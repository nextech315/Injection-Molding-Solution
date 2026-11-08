// ============================================================
// Admin mode — site logo changer
// Open any page with ?admin (e.g. index.html?admin) to show the panel.
// The new logo is committed to images/logo/logo-nav.png in the GitHub
// repository through the GitHub API, using a token the admin enters.
// The token never leaves the admin's browser except to api.github.com.
// ============================================================
(function () {
  'use strict';

  var params = new URLSearchParams(location.search);
  if (!params.has('admin') && location.hash !== '#admin') return;

  var LOGO_PATH = 'images/logo/logo-nav.png';
  var TOKEN_KEY = 'site-admin-gh-token';
  var MAX_W = 1200;

  function defaultRepo() {
    var h = location.hostname;
    if (/\.github\.io$/i.test(h)) {
      var seg = location.pathname.split('/').filter(Boolean)[0] || '';
      return { owner: h.split('.')[0], repo: seg && !/\.html$/i.test(seg) ? seg : h };
    }
    return { owner: 'nextech315', repo: 'Injection-Molding-Solution' };
  }

  function lsGet(k) { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } }
  function lsSet(k, v) { try { if (v) localStorage.setItem(k, v); else localStorage.removeItem(k); } catch (e) {} }

  var css = '' +
    '#adm-logo{position:fixed;right:20px;bottom:20px;z-index:9999;width:360px;max-width:calc(100vw - 32px);' +
    'max-height:calc(100vh - 40px);overflow:auto;background:#10121a;color:#e8eaf0;border:1px solid rgba(0,229,255,.35);' +
    'border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.6);font:14px/1.5 "Noto Sans KR",system-ui,sans-serif;padding:16px}' +
    '#adm-logo h3{margin:0 0 10px;font-size:15px;color:#00e5ff;display:flex;justify-content:space-between;align-items:center}' +
    '#adm-logo .x{background:none;border:0;color:#9aa;font-size:20px;cursor:pointer;line-height:1}' +
    '#adm-logo label{display:block;margin:10px 0 4px;font-size:12px;color:#9aa3b5}' +
    '#adm-logo input[type=text],#adm-logo input[type=password],#adm-logo input[type=url]{width:100%;box-sizing:border-box;' +
    'padding:7px 9px;background:#07080d;color:#e8eaf0;border:1px solid #2a2f3d;border-radius:6px;font:inherit}' +
    '#adm-logo input[type=file]{width:100%;font-size:12px;color:#9aa3b5}' +
    '#adm-logo .row{display:flex;gap:6px}#adm-logo .row input{flex:1;min-width:0}' +
    '#adm-logo .prev{margin-top:4px;background:#07080d;border:1px dashed #2a2f3d;border-radius:8px;padding:10px;text-align:center}' +
    '#adm-logo .prev img{max-width:100%;max-height:90px}' +
    '#adm-logo button.b{padding:7px 12px;border-radius:6px;border:1px solid #2a2f3d;background:#1a1e2a;color:#e8eaf0;cursor:pointer;font:inherit}' +
    '#adm-logo button.p{background:#00e5ff;color:#07080d;border-color:#00e5ff;font-weight:700;width:100%;margin-top:12px}' +
    '#adm-logo button:disabled{opacity:.5;cursor:default}' +
    '#adm-logo .chk{display:flex;gap:6px;align-items:center;margin-top:6px;font-size:12px;color:#9aa3b5}' +
    '#adm-logo .st{margin-top:10px;font-size:12px;white-space:pre-wrap}' +
    '#adm-logo .st.err{color:#ff6b6b}#adm-logo .st.ok{color:#5be38c}' +
    '#adm-logo details{margin-top:8px;font-size:12px;color:#9aa3b5}#adm-logo summary{cursor:pointer}';

  function el(html) { var d = document.createElement('div'); d.innerHTML = html; return d.firstChild; }

  function init() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var r = defaultRepo();
    var savedToken = lsGet(TOKEN_KEY);
    var panel = el(
      '<div id="adm-logo" role="dialog" aria-label="관리자 모드 — 로고 변경">' +
      '<h3>관리자 모드 · 로고 변경<button class="x" type="button" title="닫기" aria-label="닫기">×</button></h3>' +
      '<div class="prev"><img id="adm-prev" alt="로고 미리보기"></div>' +
      '<label for="adm-file">이미지 파일 업로드 (PNG·JPG·SVG·WEBP)</label>' +
      '<input id="adm-file" type="file" accept="image/*">' +
      '<label for="adm-url">또는 이미지 주소</label>' +
      '<div class="row"><input id="adm-url" type="url" placeholder="https://…/logo.png"><button class="b" id="adm-load" type="button">불러오기</button></div>' +
      '<label for="adm-token">GitHub 토큰 (저장소 Contents 쓰기 권한)</label>' +
      '<input id="adm-token" type="password" autocomplete="off" spellcheck="false">' +
      '<label class="chk"><input id="adm-remember" type="checkbox"> 이 브라우저에 토큰 기억</label>' +
      '<details><summary>저장소 설정</summary>' +
      '<label for="adm-owner">소유자</label><input id="adm-owner" type="text">' +
      '<label for="adm-repo">저장소</label><input id="adm-repo" type="text">' +
      '<label for="adm-branch">브랜치</label><input id="adm-branch" type="text" value="main">' +
      '</details>' +
      '<button class="b p" id="adm-save" type="button" disabled>저장 (사이트 로고에 반영)</button>' +
      '<div class="st" id="adm-st"></div>' +
      '</div>');
    document.body.appendChild(panel);

    var $ = function (id) { return document.getElementById(id); };
    var prev = $('adm-prev'), status = $('adm-st'), saveBtn = $('adm-save');
    var logoImg = document.querySelector('.nav-logo img');
    prev.src = logoImg ? logoImg.src : LOGO_PATH;
    $('adm-owner').value = r.owner; $('adm-repo').value = r.repo;
    if (savedToken) { $('adm-token').value = savedToken; $('adm-remember').checked = true; }

    var pendingDataUrl = null;

    function setStatus(msg, cls) { status.textContent = msg; status.className = 'st' + (cls ? ' ' + cls : ''); }

    function applyToPage(src) {
      document.querySelectorAll('.nav-logo img, .footer-logo img').forEach(function (i) { i.src = src; });
    }

    // Normalise any image to PNG via canvas so the file stays a valid logo-nav.png
    function useImage(src, crossOrigin) {
      setStatus('이미지를 불러오는 중…');
      var img = new Image();
      if (crossOrigin) img.crossOrigin = 'anonymous';
      img.onload = function () {
        var w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
        if (!w || !h) { w = 600; h = 200; }
        if (w > MAX_W) { h = Math.round(h * MAX_W / w); w = MAX_W; }
        var c = document.createElement('canvas'); c.width = w; c.height = h;
        try {
          c.getContext('2d').drawImage(img, 0, 0, w, h);
          pendingDataUrl = c.toDataURL('image/png');
        } catch (e) {
          pendingDataUrl = null; saveBtn.disabled = true;
          setStatus('이 주소의 이미지는 다른 사이트에서 읽기를 막고 있어 저장할 수 없습니다.\n파일로 내려받은 뒤 업로드해 주세요.', 'err');
          return;
        }
        prev.src = pendingDataUrl; applyToPage(pendingDataUrl);
        saveBtn.disabled = false;
        setStatus('미리보기에 반영했습니다 (' + w + '×' + h + 'px). 저장을 누르면 사이트에 반영됩니다.');
      };
      img.onerror = function () {
        pendingDataUrl = null; saveBtn.disabled = true;
        setStatus('이미지를 불러오지 못했습니다. 주소나 파일을 확인해 주세요.', 'err');
      };
      img.src = src;
    }

    $('adm-file').addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      var fr = new FileReader();
      fr.onload = function () { useImage(fr.result, false); };
      fr.readAsDataURL(f);
    });
    $('adm-load').addEventListener('click', function () {
      var u = $('adm-url').value.trim();
      if (!/^https?:\/\//i.test(u)) { setStatus('http:// 또는 https:// 로 시작하는 주소를 입력해 주세요.', 'err'); return; }
      useImage(u, true);
    });
    panel.querySelector('.x').addEventListener('click', function () { panel.remove(); });

    saveBtn.addEventListener('click', function () {
      var token = $('adm-token').value.trim();
      var owner = $('adm-owner').value.trim(), repo = $('adm-repo').value.trim();
      var branch = $('adm-branch').value.trim() || 'main';
      if (!pendingDataUrl) { setStatus('먼저 새 로고 이미지를 선택해 주세요.', 'err'); return; }
      if (!token) { setStatus('GitHub 토큰을 입력해 주세요.', 'err'); return; }
      lsSet(TOKEN_KEY, $('adm-remember').checked ? token : '');

      var api = 'https://api.github.com/repos/' + encodeURIComponent(owner) + '/' + encodeURIComponent(repo) +
                '/contents/' + LOGO_PATH;
      var headers = { 'Authorization': 'Bearer ' + token, 'Accept': 'application/vnd.github+json' };
      saveBtn.disabled = true; setStatus('GitHub에 저장하는 중…');

      fetch(api + '?ref=' + encodeURIComponent(branch), { headers: headers, cache: 'no-store' })
        .then(function (res) {
          if (res.status === 404) return null;
          if (!res.ok) throw res;
          return res.json();
        })
        .then(function (cur) {
          var body = {
            message: 'Update site logo (admin mode)',
            content: pendingDataUrl.split(',')[1],
            branch: branch
          };
          if (cur && cur.sha) body.sha = cur.sha;
          return fetch(api, { method: 'PUT', headers: headers, body: JSON.stringify(body) });
        })
        .then(function (res) {
          if (!res.ok) throw res;
          return res.json();
        })
        .then(function () {
          setStatus('저장했습니다. GitHub Pages가 다시 배포되면(보통 1~2분) 모든 방문자에게 새 로고가 보입니다.\n브라우저 캐시 때문에 최대 10분쯤 걸릴 수 있습니다.', 'ok');
          saveBtn.disabled = false;
        })
        .catch(function (err) {
          saveBtn.disabled = false;
          var code = err && err.status;
          var msg = code === 401 ? '토큰이 올바르지 않거나 만료되었습니다.'
                  : code === 403 ? '이 토큰에는 저장소 쓰기 권한이 없습니다 (Contents: Read and write 필요).'
                  : code === 404 ? '저장소나 브랜치를 찾을 수 없습니다. 저장소 설정을 확인해 주세요.'
                  : code === 409 || code === 422 ? '저장 중 충돌이 났습니다. 다시 저장해 주세요.'
                  : '저장하지 못했습니다' + (code ? ' (HTTP ' + code + ')' : ' (네트워크 오류)') + '.';
          setStatus(msg, 'err');
        });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
