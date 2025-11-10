<!-- PAKAI INI SEBAGAI FILE TERPISAH, mis. wd-notif.js -->
<script>
(function () {
  "use strict";

  /** =======================
   *  KONFIGURASI MUDAH
   *  ======================= */
  const INTERVAL_MS = 5000;   // jeda antar notifikasi
  const SHOW_MS     = 3000;   // durasi tampil
  const USE_WHITELIST = false;  // true jika ingin kunci ke domain tertentu
  const ALLOW = [
    // Masukkan btoa(hostname) yang diizinkan, contoh:
    // btoa("japancommunity.github.io")
  ];

  // Logo kiri (acak)
  const LOGOS = [
    "https://sgalabel.blob.core.windows.net/agent-websites/335/medialibrary/images/335_579d4b6f02b74261acd53d9c86028693.webp",
    "https://sgalabel.blob.core.windows.net/agent-websites/335/medialibrary/images/335_ceb66588c6df40ffa85dc66b3977f576.webp",
    "https://sgalabel.blob.core.windows.net/agent-websites/335/medialibrary/images/335_6601f6f97e8d4fd9a6f1c176ea22a12b.webp",
    "https://sgalabel.blob.core.windows.net/agent-websites/335/medialibrary/images/335_e9bf388624c246a6b1b862a4a35bf7e0.webp"
  ];

  // Kata kunci pesan
  const TEXT_BEFORE = "Berhasil Withdraw"; // bisa diganti "Berhasil WD"

  /** =======================
   *  GUARD (opsional)
   *  ======================= */
  if (USE_WHITELIST) {
    const ok = ALLOW.includes(btoa(location.hostname));
    if (!ok) return;
  }

  /** =======================
   *  CSS (gaya pill merah, posisi ATAS-KIRI)
   *  ======================= */
  const css = `
  .wd-pill {
    position: fixed; top: 12px; left: 12px; z-index: 999999;
    display: inline-flex; align-items: center; gap: 10px;
    padding: 8px 14px; border-radius: 999px;
    background: rgba(23,23,23,.85); border: 2px solid #ff2d2d;
    color: #ff2d2d; font: 14px/1.25 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
    box-shadow: 0 8px 24px rgba(0,0,0,.25), inset 0 0 0 1px rgba(255,255,255,.04);
    transform: translateY(-12px); opacity: 0; pointer-events: none;
  }
  .wd-pill.is-show { opacity: 1; transform: translateY(0); transition: transform .35s ease, opacity .35s ease; }
  .wd-pill img { width: 20px; height: 20px; object-fit: contain; border-radius: 4px; background: transparent }
  .wd-pill .wd-text { white-space: nowrap; }
  @media (prefers-reduced-motion: reduce) {
    .wd-pill { transition: none }
  }`;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /** =======================
   *  ELEMEN DOM
   *  ======================= */
  const pill = document.createElement("div");
  pill.className = "wd-pill";
  pill.setAttribute("aria-live", "polite");

  const logoEl = document.createElement("img");
  logoEl.alt = "logo";

  const textEl = document.createElement("span");
  textEl.className = "wd-text";

  pill.appendChild(logoEl);
  pill.appendChild(textEl);
  document.body.appendChild(pill);

  /** =======================
   *  UTIL
   *  ======================= */
  function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

  // 8 huruf acak → tampil "x*****y"
  function randomMaskedName() {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    let s = "";
    for (let i = 0; i < 8; i++) s += letters[rand(0, letters.length - 1)];
    return s[0] + "*****" + s[s.length - 1];
  }

  // Angka acak 50–10000 → rupiah (Rp 5.873.000,00)
  function randomRupiah() {
    const n = rand(50, 10000) * 1000; // seperti skripmu
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(n);
  }

  function pick(arr) { return arr[rand(0, arr.length - 1)]; }

  /** =======================
   *  LOGIKA TAMPIL/HILANG
   *  ======================= */
  let hideTimer = null;

  function showOnce() {
    // set konten
    logoEl.src = pick(LOGOS);
    textEl.textContent = `${randomMaskedName()} ${TEXT_BEFORE} ${randomRupiah()}`;

    // tampil
    pill.classList.add("is-show");

    // auto sembunyi
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      pill.classList.remove("is-show");
    }, SHOW_MS);
  }

  // tampil perdana + interval
  showOnce();
  setInterval(showOnce, INTERVAL_MS);
})();
</script>
