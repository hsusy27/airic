/* ==========================================================================
   AIRIC Portal — 程式邏輯
   一般維護不用改這個檔案；內容全部來自 assets/js/data.js
   ========================================================================== */
(() => {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-on'), 2200);
  }

  /* ---------- 1. Meta / Hero ---------- */
  function renderMeta() {
    const m = SITE.meta;
    $$('[data-bind="centerName"]').forEach(el => el.textContent = m.centerName);
    $$('[data-bind="centerShort"]').forEach(el => el.textContent = m.centerShort);
    $$('[data-bind="centerEn"]').forEach(el => el.textContent = m.centerEn);
    $$('[data-bind="updated"]').forEach(el => el.textContent = m.updated);
    $$('[data-bind="adminExt"]').forEach(el => el.textContent = m.adminExt);
    document.title = `${m.centerShort} ${m.centerName}｜內部入口`;

    $('#hero-stats').innerHTML = SITE.heroStats.map(s => `
      <div><dt>${esc(s.value)}</dt><dd>${esc(s.label)}</dd></div>`).join('');
  }

  /* ---------- 2. 諮詢窗口 ---------- */
  function renderContacts() {
    $('#contacts').innerHTML = SITE.contacts.map(c => `
      <div class="contact-row">
        <div class="contact-row__av">${esc(c.name.slice(0,1))}</div>
        <div>
          <div class="contact-row__name">${esc(c.name)}<span style="font-weight:400;color:var(--ink-45);font-size:12px"> · ${esc(c.role)}</span></div>
          <div class="contact-row__desc">${esc(c.desc)}</div>
        </div>
        <div class="contact-row__ext">#${esc(c.ext)}</div>
      </div>`).join('');
  }

  /* ---------- 3. 待辦清單 ---------- */
  const KEY = 'airic.checklist.v2';
  const allItems = () => SITE.checklist.flatMap(g => g.items);

  function loadState() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch { return {}; }
  }
  function saveState(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* 隱私模式忽略 */ }
  }

  function renderChecklist() {
    const state = loadState();
    const tick = `<svg viewBox="0 0 24 24" fill="none" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;

    $('#check-cols').innerHTML = SITE.checklist.map(g => `
      <div class="check-col">
        <div class="check-col__h"><i data-lucide="${esc(g.icon)}" style="width:15px;height:15px"></i>${esc(g.group)}</div>
        ${g.items.map(it => `
          <label class="check-item">
            <input type="checkbox" data-task="${esc(it.id)}" ${state[it.id] ? 'checked' : ''}>
            <span class="check-box">${tick}</span>
            <div>
              <div class="check-item__t">${esc(it.title)}</div>
              <div class="check-item__d">${esc(it.desc)}</div>
            </div>
          </label>`).join('')}
      </div>`).join('');

    $$('#check-cols input[data-task]').forEach(cb => {
      cb.addEventListener('change', () => {
        const s = loadState();
        s[cb.dataset.task] = cb.checked;
        saveState(s);
        updateProgress();
        if (cb.checked) toast('已記錄，進度存在這台裝置的瀏覽器裡');
      });
    });
    updateProgress();
  }

  function updateProgress() {
    const total = allItems().length;
    const done = $$('#check-cols input[data-task]').filter(c => c.checked).length;
    const pct = total ? Math.round(done / total * 100) : 0;
    $('#prog-pct').textContent = pct + '%';
    $('#prog-fill').style.width = pct + '%';
    $('#prog-count').textContent = `${done} / ${total}`;
    $('#nav-count').textContent = `${done}/${total}`;
  }

  /* ---------- 4. 空間注意事項 ---------- */
  function renderFloorNotes() {
    const li = (arr) => arr.map(t => `<li>${esc(t)}</li>`).join('');
    $('#note-meeting').innerHTML = li(SITE.floorNotes.meeting);
    $('#note-supplies').innerHTML = li(SITE.floorNotes.supplies);
  }

  /* ---------- 5. 座位圖 ---------- */
  function seatHTML(seat) {
    if (seat.empty) {
      return `<div class="seat seat--empty" data-key="${esc([seat.ext, seat.desk, ...(seat.ip || [])].filter(Boolean).join(' '))}">
        <div class="seat__name">空位</div>
        <div class="seat__meta">
          ${seat.ext ? `<span class="seat__desk">#${esc(seat.ext)}</span>` : ''}
          ${seat.desk ? `<span class="seat__desk">${esc(seat.desk)}</span>` : ''}
        </div>
        ${(seat.ip || []).map(i => `<div class="seat__ip">${esc(i)}</div>`).join('')}
      </div>`;
    }
    const g = SITE.seatGroups[seat.group];
    const key = [seat.name, seat.en, seat.ext, seat.desk, ...(seat.ip || []), g && g.label]
      .filter(Boolean).join(' ').toLowerCase();
    return `<div class="seat" data-group="${esc(seat.group || '')}" data-key="${esc(key)}"
             style="border-left-color:${g ? g.color : 'var(--ink-25)'}">
      <div class="seat__name">${esc(seat.name)}</div>
      ${seat.en ? `<div class="seat__en">${esc(seat.en)}</div>` : ''}
      <div class="seat__meta">
        ${seat.ext ? `<span class="seat__ext">#${esc(seat.ext)}</span>` : ''}
        ${seat.desk ? `<span class="seat__desk">${esc(seat.desk)}</span>` : ''}
      </div>
      ${(seat.ip || []).map(i => `<div class="seat__ip">${esc(i)}</div>`).join('')}
    </div>`;
  }

  function renderMap() {
    /* 牆面設備 */
    $('#map-wallrow').innerHTML = SITE.facilities.map(f => `
      <div class="wall-chip ${f.kind === 'door' ? 'wall-chip--door' : ''}">
        <div class="wall-chip__n">${esc(f.name)}</div>
        ${(f.ip || []).map(i => `<div class="wall-chip__ip">${esc(i)}</div>`).join('')}
      </div>`).join('');

    /* 座位島：把兩排座位交錯排進同一個 grid，左右兩欄的列高才會對齊 */
    $('#map-pods').innerHTML = SITE.pods.map(pod => {
      const rows = Math.max(...pod.columns.map(c => c.seats.length));
      let cells = '';
      for (let r = 0; r < rows; r++) {
        pod.columns.forEach(col => {
          cells += col.seats[r] ? seatHTML(col.seats[r]) : '<div></div>';
        });
      }
      return `<div class="pod">
        ${pod.front ? `<div class="pod__front">${pod.front.map(seatHTML).join('')}</div>` : ''}
        ${pod.columns.map(c => `<div class="desk-head">${esc(c.desk)}</div>`).join('')}
        ${cells}
        ${pod.note ? `<div class="pod__note">${esc(pod.note)}</div>` : ''}
      </div>`;
    }).join('');

    /* 右側空間 */
    $('#map-rooms').innerHTML = SITE.rooms.map(r => `
      <div class="room ${r.tone === 'office' ? 'room--office' : ''}">
        <div class="room__n">${esc(r.name)}</div>
        <div class="seat__meta">
          ${r.ext ? `<span class="seat__ext">#${esc(r.ext)}</span>` : ''}
          ${r.desk ? `<span class="seat__desk">${esc(r.desk)}</span>` : ''}
        </div>
        ${(r.ip || []).map(i => `<div class="seat__ip">${esc(i)}</div>`).join('')}
      </div>`).join('');

    /* 分組圖例 */
    const used = new Set();
    SITE.pods.forEach(p => {
      (p.front || []).forEach(s => s.group && used.add(s.group));
      p.columns.forEach(c => c.seats.forEach(s => s.group && used.add(s.group)));
    });
    $('#legend').innerHTML = Object.keys(SITE.seatGroups).filter(k => used.has(k)).map(k => {
      const g = SITE.seatGroups[k];
      return `<button type="button" data-group="${esc(k)}"><i style="background:${g.color}"></i>${esc(g.label)}</button>`;
    }).join('');

    $$('#legend button').forEach(b => b.addEventListener('click', () => {
      const on = b.classList.toggle('is-on');
      $$('#legend button').forEach(o => { if (o !== b) o.classList.remove('is-on'); });
      applySeatFilter(on ? b.dataset.group : null);
    }));
  }

  let activeGroup = null;
  function applySeatFilter(group) {
    activeGroup = group === undefined ? activeGroup : group;
    const q = $('#seat-q').value.trim().toLowerCase();
    let hits = 0;
    $$('#map-pods .seat').forEach(el => {
      const okGroup = !activeGroup || el.dataset.group === activeGroup;
      const okText = !q || (el.dataset.key || '').includes(q);
      const ok = okGroup && okText;
      el.classList.toggle('is-dim', !ok);
      el.classList.toggle('is-hit', ok && !!q && !el.classList.contains('seat--empty'));
      if (ok && !el.classList.contains('seat--empty')) hits++;
    });
    const hint = $('#seat-hint');
    hint.innerHTML = (q || activeGroup)
      ? `符合 <b>${hits}</b> 個座位`
      : '可用姓名、英文名、分機或桌號搜尋';
  }

  function bindSeatSearch() {
    const input = $('#seat-q');
    input.addEventListener('input', () => applySeatFilter(undefined));
    $('#seat-clear').addEventListener('click', () => {
      input.value = '';
      $$('#legend button').forEach(o => o.classList.remove('is-on'));
      applySeatFilter(null);
      input.focus();
    });
  }

  /* ---------- 6. 規範庫 ---------- */
  function renderRules(cat = 'all') {
    const list = SITE.rules.filter(r => cat === 'all' || r.cat === cat);
    $('#rule-list').innerHTML = list.map((r, i) => `
      <div class="rule" data-i="${i}">
        <button class="rule__btn" type="button" aria-expanded="false">
          <span class="rule__cat">${esc(r.catLabel)}</span>
          <span class="rule__main">
            <span class="rule__t">${esc(r.title)}</span>
            <span class="rule__s">${esc(r.summary)}</span>
          </span>
          <span class="rule__chev"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg></span>
        </button>
        <div class="rule__body"><ol>${r.body.map(b => `<li>${esc(b)}</li>`).join('')}</ol></div>
      </div>`).join('');

    $$('#rule-list .rule__btn').forEach(btn => btn.addEventListener('click', () => {
      const row = btn.closest('.rule');
      const open = row.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    }));
  }

  function renderFilters() {
    const cats = [{ k: 'all', l: '全部' }];
    SITE.rules.forEach(r => {
      if (!cats.some(c => c.k === r.cat)) cats.push({ k: r.cat, l: r.catLabel });
    });
    $('#filters').innerHTML = cats.map((c, i) =>
      `<button type="button" data-cat="${esc(c.k)}" class="${i === 0 ? 'is-on' : ''}">${esc(c.l)}</button>`).join('');
    $$('#filters button').forEach(b => b.addEventListener('click', () => {
      $$('#filters button').forEach(o => o.classList.remove('is-on'));
      b.classList.add('is-on');
      renderRules(b.dataset.cat);
    }));
  }

  /* ---------- 7. 系統連結 ---------- */
  function renderSystems() {
    $('#sys-grid').innerHTML = SITE.systems.map(s => {
      const dead = !s.url || s.url === '#';
      return `<a class="sys" href="${esc(s.url || '#')}" ${dead ? '' : 'target="_blank" rel="noopener"'} ${dead ? 'data-dead="1"' : ''}>
        <span class="sys__ico"><i data-lucide="${esc(s.icon)}" style="width:18px;height:18px"></i></span>
        <span>
          <span class="sys__n" style="display:block">${esc(s.name)}</span>
          <span class="sys__d">${esc(s.desc)}</span>
        </span>
        <span class="sys__go"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 17 17 7M9 7h8v8"/></svg></span>
      </a>`;
    }).join('');

    $$('#sys-grid a[data-dead]').forEach(a => a.addEventListener('click', e => {
      e.preventDefault();
      toast('這個連結還沒設定，請在 data.js 的 systems 填入網址');
    }));
  }

  /* ---------- 8. 全站搜尋 ---------- */
  function buildIndex() {
    const idx = [];
    SITE.rules.forEach(r => idx.push({ t: r.title, d: r.catLabel + '｜' + r.summary, k: '規範', href: '#rules' }));
    SITE.systems.forEach(s => idx.push({ t: s.name, d: s.desc, k: '系統', href: '#systems' }));
    allItems().forEach(i => idx.push({ t: i.title, d: i.desc, k: '待辦', href: '#checklist' }));
    SITE.contacts.forEach(c => idx.push({ t: c.name, d: c.role + '｜分機 ' + c.ext, k: '窗口', href: '#about' }));
    SITE.pods.forEach(p => {
      const push = (s) => { if (!s.empty) idx.push({
        t: s.name + (s.en ? ` ${s.en}` : ''),
        d: [s.ext && '分機 ' + s.ext, s.desk && '桌號 ' + s.desk, (s.ip || [])[0]].filter(Boolean).join('｜'),
        k: '座位', href: '#seatmap', seat: s.name,
      }); };
      (p.front || []).forEach(push);
      p.columns.forEach(c => c.seats.forEach(push));
    });
    SITE.rooms.forEach(r => idx.push({ t: r.name, d: `分機 ${r.ext}｜${(r.ip || [])[0] || ''}`, k: '空間', href: '#seatmap' }));
    return idx;
  }

  let INDEX = [];
  function openSearch(open) {
    const m = $('#search-modal');
    m.classList.toggle('is-open', open);
    if (open) { $('#search-q').value = ''; renderSearch(''); $('#search-q').focus(); }
  }
  function renderSearch(q) {
    const box = $('#search-results');
    q = q.trim().toLowerCase();
    if (!q) { box.innerHTML = `<div class="modal__hint">輸入姓名、分機、桌號、關鍵字…</div>`; return; }
    const hit = INDEX.filter(i => (i.t + i.d + i.k).toLowerCase().includes(q)).slice(0, 12);
    if (!hit.length) { box.innerHTML = `<div class="modal__hint">找不到「${esc(q)}」</div>`; return; }
    box.innerHTML = hit.map(i => `
      <a class="res" href="${i.href}" data-seat="${esc(i.seat || '')}">
        <span><span class="res__t">${esc(i.t)}</span><span class="res__d" style="display:block">${esc(i.d)}</span></span>
        <span class="res__k">${esc(i.k)}</span>
      </a>`).join('');
    $$('#search-results .res').forEach(a => a.addEventListener('click', () => {
      const seat = a.dataset.seat;
      openSearch(false);
      if (seat) { $('#seat-q').value = seat; applySeatFilter(null); }
    }));
  }

  /* ---------- 9. 其他 ---------- */
  function bindNav() {
    const nav = $('#nav');
    const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    $('#btn-search').addEventListener('click', () => openSearch(true));
    $('#search-esc').addEventListener('click', () => openSearch(false));
    $('#search-modal').addEventListener('click', e => { if (e.target.id === 'search-modal') openSearch(false); });
    $('#search-q').addEventListener('input', e => renderSearch(e.target.value));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') openSearch(false);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(true); }
    });
  }

  function bindReveal() {
    const els = $$('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px' });
    els.forEach(e => io.observe(e));
  }

  /* ---------- 啟動（由 gate.js 在解鎖後呼叫） ---------- */
  window.renderSite = () => {
    renderMeta();
    renderContacts();
    renderChecklist();
    renderFloorNotes();
    renderMap();
    bindSeatSearch();
    applySeatFilter(null);
    renderFilters();
    renderRules('all');
    renderSystems();
    INDEX = buildIndex();
    bindNav();
    bindReveal();
    if (window.lucide) lucide.createIcons();
  };

  /* 沒有密碼鎖時（例如自行改成明文版）也能正常啟動 */
  document.addEventListener('DOMContentLoaded', () => {
    if (!document.body.classList.contains('locked') && window.SITE) window.renderSite();
  });
})();
