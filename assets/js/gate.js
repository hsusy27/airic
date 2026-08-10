/* ==========================================================================
   AIRIC Portal — 密碼鎖
   --------------------------------------------------------------------------
   網站內容存在 data.enc.js，是「加密過的亂碼」。
   使用者輸入正確密碼後，才在瀏覽器裡解密出來顯示。

   ※ 改密碼：用 build.html 重新產生 data.enc.js 即可，這個檔案不用動。
   ※ 密碼不會存在任何檔案裡，也不會傳到任何伺服器。
   ========================================================================== */
(() => {
  'use strict';

  const SESSION_KEY = 'airic.pw';   // 只存在分頁的暫存區，關掉分頁就消失

  const $ = (s) => document.querySelector(s);
  const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

  /* ---------- 解密 ---------- */
  async function unlock(password) {
    if (typeof ENC_DATA === 'undefined') throw new Error('NO_DATA');

    const enc = new TextEncoder();
    const baseKey = await crypto.subtle.importKey(
      'raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']
    );
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: b64(ENC_DATA.salt), iterations: ENC_DATA.iter, hash: 'SHA-256' },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false, ['decrypt']
    );
    const plain = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: b64(ENC_DATA.iv) }, key, b64(ENC_DATA.ct)
    );
    return JSON.parse(new TextDecoder().decode(plain));
  }

  /* ---------- 進站 ---------- */
  function enter(site) {
    window.SITE = site;
    document.body.classList.remove('locked');
    $('#gate').remove();
    if (typeof window.renderSite === 'function') window.renderSite();
  }

  function fail(msg) {
    const box = $('#gate-err');
    box.textContent = msg;
    box.classList.add('is-on');
    $('#gate-form').classList.add('shake');
    setTimeout(() => $('#gate-form') && $('#gate-form').classList.remove('shake'), 420);
  }

  /* ---------- 啟動 ---------- */
  document.addEventListener('DOMContentLoaded', async () => {
    const form = $('#gate-form');
    const input = $('#gate-pw');
    const btn = $('#gate-btn');
    if (!form) return;

    // 這個分頁稍早已經解過鎖 → 直接進去，不用再問一次
    const cached = sessionStorage.getItem(SESSION_KEY);
    if (cached) {
      try { return enter(await unlock(cached)); }
      catch { sessionStorage.removeItem(SESSION_KEY); }
    }

    input.focus();

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pw = input.value;
      if (!pw) return;

      btn.disabled = true;
      btn.textContent = '解鎖中…';
      $('#gate-err').classList.remove('is-on');

      // 讓「解鎖中…」有機會畫出來（解密要跑 25 萬次雜湊，約 0.3 秒）
      await new Promise((r) => setTimeout(r, 30));

      try {
        const site = await unlock(pw);
        try { sessionStorage.setItem(SESSION_KEY, pw); } catch { /* 無痕模式忽略 */ }
        enter(site);
      } catch (err) {
        btn.disabled = false;
        btn.textContent = '進入';
        input.value = '';
        input.focus();
        fail(err && err.message === 'NO_DATA'
          ? '找不到內容檔（data.enc.js），請確認檔案有一起上傳。'
          : '密碼不正確，請再試一次。');
      }
    });
  });

  /* ---------- 鎖回去（導覽列的鎖頭按鈕） ---------- */
  window.airicLock = () => {
    sessionStorage.removeItem(SESSION_KEY);
    location.reload();
  };
})();
