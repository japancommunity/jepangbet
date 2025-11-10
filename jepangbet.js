/* projectDyahahayuk.js — drop-in (struktur dipertahankan)
   - Tetap ada: window.dyahahayuk { goto, rotate, copy, q, qa }
   - Tetap ada: handler [data-go] & [data-copy]
   - Tambahan: Notifikasi WD gaya pill merah (ikon kiri), posisi ATAS
*/
(function () {
  'use strict';

  /** =========================
   *  1) ROTASI LINK TUJUAN
   *  ========================= */
  const links = [
    // Ganti dengan link tujuanmu (opsional)
    "https://example.com",
    "https://example.org",
    "https://example.net"
  ];
  const target = links[Math.floor(Math.random() * links.length)];

  /** =========================
   *  2) API GLOBAL (TETAP)
   *  ========================= */
  window.dyahahayuk = {
    goto: function (url) {
      // Jika tidak diberi url, pakai target acak
      location.href = url || target;
    },
    rotate: function (list) {
      var arr = Array.isArray(list) ? list : links;
      if (!arr.length) return;
      var url = arr[Math.floor(Math.random() * arr.length)];
      location.href = url;
    },
    copy: function (text) {
      if (!text) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        try {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.top = '-1000px';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        } catch (e) {}
      }
    },
    q: function (sel) { return document.querySelector(sel); },
    qa: function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  };

  /** =====================================================
   *  3) HANDLER ATRIBUT (TETAP) — JANGAN UBAH URUTANNYA
   *  ===================================================== */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-go],[data-copy]');
    if (!el) return;

    // Copy
    if (el.hasAttribute('data-copy')) {
      var text = el.getAttribute('data-copy') || '';
      window.dyahahayuk.copy(text);
      return;
    }
    // Go
    if (el.hasAttribute('data-go')) {
      var mode = el.getAttribute('data-go');
      if (mode === 'rotate') {
        var raw = el.getAttribute('data-links') || '';
        var arr = raw.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
        window.dyahahayuk.rotate(arr);
      } else {
        window.dyahahayuk.goto(mode);
      }
    }
  });

  /** =========================
   *  4) NOTIF WD — TAMBAHAN
   *  ========================= */

  // Konfigurasi
  var SHOW_MS = 3000;      // durasi tampil
  var INTERVAL_MS = 5000;  // jeda antar notifikasi
  var TEXT_BEFORE = "Berhasil Withdraw"; // atau "telah berhasil WD sebesar"

  // Logo kiri (acak) — ganti sesuai kebutuhan
  var LOGOS = [
    "https://sgalabel.blob.core.windows.net/agent-websites/335/medialibrary/images/335_579d4b6f02b74261acd53d9c86028693.webp",
    "https://sgalabel.blob.core.windows.net/agent-websites/335/medialibrary/images/335_ceb66588c6df40ffa85dc66b3977f576.webp",
    "https://sgalabel.blob.core.windows.net/agent-websites/335/medialibrary/images/335_6601f6f97e8d4fd9a6f1c176ea22a12b.webp",
    "https://sgalabel.blob.core.windows.net/agent-websites/335/medialibrary/images/335_e9bf388624c246a6b1b862a4a35bf7e0.webp"
  ];

  // Data acak (bisa diganti data asli)
  var NAMES = [
    "Jo*****r", "Ka*****z", "Ke*****a", "Re*****i", "Lu*****i", "Ma*****n", "De*****r"
  ];

  // Util acak angka → format Rupiah
  function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function rupiahRandom() {
    var n = rand(50, 10000) * 1000; // 50.000 s/d 10.000.000
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(n);
  }
  function pick(arr) { return arr[rand(0, arr.length - 1)]; }

  // CSS pill merah (posisi ATAS seperti gambar pertama, gaya mirip gambar kedua)
  var css = ""
    + ".wd-pill{position:fixed;top:14px;left:14px;z-index:999999;display:inline-flex;align-items:center;gap:10px;"
    + "padding:8px 14px;border-radius:999px;background:rgba(23,23,23,.88);border:2px solid #970005;color:#970005;"
    + "font:14px/1.25 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;"
    + "box-shadow:0 10px 20px rgba(0,0,0,.25),inset 0 0 0 1px rgba(255,255,255,.04);"
    + "transform:translateY(-12px);opacity:0;pointer-events:none}"
    + ".wd-pill.is-show{opacity:1;transform:translateY(0);transition:transform .35s ease,opacity .35s ease}"
    + ".wd-pill img{height:1.2em;width:auto;object-fit:contain;border-radius:4px;background:transparent}"
    + ".wd-pill .wd-text{white-space:nowrap}";
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // Elemen DOM
  var pill = document.createElement('div');
  pill.className = 'wd-pill';
  pill.setAttribute('aria-live', 'polite');

  var logoEl = document.createElement('img'); logoEl.alt = 'logo';
  var textEl = document.createElement('span'); textEl.className = 'wd-text';

  pill.appendChild(logoEl);
  pill.appendChild(textEl);
  document.addEventListener('DOMContentLoaded', function(){ document.body.appendChild(pill); });

  // Tampil/hilang
  var hideTimer = null;
  function showOnce() {
    logoEl.src = pick(LOGOS);
    var name = pick(NAMES);
    var money = rupiahRandom();
    textEl.textContent = name + ' ' + TEXT_BEFORE + ' ' + money;

    pill.classList.add('is-show');
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(function(){ pill.classList.remove('is-show'); }, SHOW_MS);
  }

  // Mulai
  showOnce();
  setInterval(showOnce, INTERVAL_MS);

})();
