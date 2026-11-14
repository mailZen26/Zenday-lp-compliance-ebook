/* zenday.js — optionale Komfortfunktionen zu zenday.css (Version 0.2)
   Einbinden am Ende des <body>: <script src="/zenday.js" defer></script>
   Ohne dieses Skript funktioniert alles weiterhin, nur das Menü schließt sich nicht von selbst. */
(function () {
  var menues = document.querySelectorAll('.zd-menue');

  menues.forEach(function (menue) {
    var summary = menue.querySelector('summary');
    var sync = function () { if (summary) summary.setAttribute('aria-expanded', menue.open ? 'true' : 'false'); };
    sync();
    menue.addEventListener('toggle', sync);

    // Menü schließen, sobald ein Link angetippt wird
    menue.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { menue.open = false; });
    });
  });

  // Schließen mit Escape oder Klick außerhalb
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    menues.forEach(function (m) { if (m.open) { m.open = false; var s = m.querySelector('summary'); if (s) s.focus(); } });
  });
  document.addEventListener('click', function (e) {
    menues.forEach(function (m) { if (m.open && !m.contains(e.target)) m.open = false; });
  });

  // Beim Wechsel auf Desktop-Breite offenes Menü schließen
  var desktop = window.matchMedia('(min-width: 1024px)');
  var zu = function () { if (desktop.matches) menues.forEach(function (m) { m.open = false; }); };
  desktop.addEventListener ? desktop.addEventListener('change', zu) : desktop.addListener(zu);

  // Aktuellen Menüpunkt markieren (gleicher Pfad)
  var pfad = location.pathname.replace(/\/index\.html$/, '/');
  document.querySelectorAll('.zd-nav a, .zd-menue__panel a:not(.zd-btn)').forEach(function (a) {
    var ziel = a.getAttribute('href') || '';
    if (ziel && ziel.charAt(0) === '/' && ziel.replace(/\/index\.html$/, '/') === pfad) a.setAttribute('aria-current', 'page');
  });
})();

/* ------------------------------------------------------------------
   Meta Pixel mit Einwilligung (für alle Seiten)
   - Ohne Pixel-ID passiert nichts: kein Banner, kein Pixel.
   - Der Pixel lädt erst nach „Akzeptieren“. Vorher existiert window.fbq
     nicht, die bestehenden Aufrufe (Lead, Schedule, Video…) laufen dann ins Leere.
   - Entscheidung wird 12 Monate gespeichert; über „Cookie-Einstellungen“
     im Footer jederzeit änderbar.
   ------------------------------------------------------------------ */
(function () {
  var META_PIXEL_ID = '';            // ← hier die Pixel-ID aus dem Meta Events Manager eintragen
  if (!META_PIXEL_ID) return;

  var SCHLUESSEL = 'zd-einwilligung';
  var GUELTIG_TAGE = 365;

  var lesen = function () {
    try {
      var w = JSON.parse(localStorage.getItem(SCHLUESSEL) || 'null');
      if (w && (Date.now() - w.zeit) / 864e5 < GUELTIG_TAGE) return w.marketing;
    } catch (e) {}
    return null;
  };
  var speichern = function (ja) {
    try { localStorage.setItem(SCHLUESSEL, JSON.stringify({ marketing: ja, zeit: Date.now() })); } catch (e) {}
  };

  var pixelLaden = function () {
    if (window.fbq) return;
    /* Offizielles Meta-Pixel-Basisskript */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  };

  /* Banner */
  var stil = document.createElement('style');
  stil.textContent =
    '.zd-cookie{position:fixed;z-index:1000;left:16px;right:16px;bottom:calc(16px + env(safe-area-inset-bottom));max-width:560px;margin-inline:auto;' +
    'background:var(--zd-weiss,#fff);border:1px solid rgba(43,47,56,.10);border-radius:20px;padding:20px 22px;' +
    'box-shadow:0 4px 8px rgba(43,47,56,.04),0 18px 48px rgba(43,47,56,.14);font-family:inherit;color:var(--zd-text,#2B2F38)}' +
    '.zd-cookie h2{font-size:1.0625rem;margin:0 0 6px;color:#2B2F38}' +
    '.zd-cookie p{font-size:var(--zd-fs-s,15px);line-height:1.5;margin:0}' +
    '.zd-cookie__knoepfe{display:flex;gap:10px;margin-top:16px}' +
    '.zd-cookie__knoepfe .zd-btn{flex:1}' +
    '.zd-cookie-link{background:none;border:0;padding:0;font:inherit;color:inherit;text-decoration:underline;cursor:pointer}' +
    '@media (max-width:420px){.zd-cookie__knoepfe{flex-direction:column}}';
  document.head.appendChild(stil);

  var banner = null;
  var zeigen = function () {
    if (banner) { banner.hidden = false; return; }
    banner = document.createElement('div');
    banner.className = 'zd-cookie';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'zd-cookie-titel');
    banner.innerHTML =
      '<h2 id="zd-cookie-titel">Ihre Einwilligung</h2>' +
      '<p>Mit Ihrer Einwilligung nutzen wir den Meta Pixel, um zu messen, wie gut unsere Anzeigen und Inhalte funktionieren. ' +
      'Dabei werden Daten an Meta übermittelt, auch in die USA. Sie können Ihre Entscheidung jederzeit über „Cookie-Einstellungen“ im Seitenfuß ändern. ' +
      'Mehr in der <a href="/datenschutz">Datenschutzerklärung</a>.</p>' +
      '<div class="zd-cookie__knoepfe">' +
      '<button type="button" class="zd-btn zd-btn--sekundaer zd-btn--klein" data-wahl="nein">Ablehnen</button>' +
      '<button type="button" class="zd-btn zd-btn--sekundaer zd-btn--klein" data-wahl="ja">Akzeptieren</button>' +
      '</div>';
    banner.addEventListener('click', function (e) {
      var k = e.target.closest('[data-wahl]');
      if (!k) return;
      var ja = k.getAttribute('data-wahl') === 'ja';
      var vorher = lesen();
      speichern(ja);
      banner.hidden = true;
      if (ja) pixelLaden();
      else if (vorher === true) location.reload(); // Widerruf: Pixel sauber entladen
    });
    document.body.appendChild(banner);
  };

  /* „Cookie-Einstellungen“ im Footer neben dem Impressum */
  var footerLink = function () {
    var imp = document.querySelector('footer a[href*="impressum"]');
    if (!imp) return;
    var knopf = document.createElement('button');
    knopf.type = 'button';
    knopf.className = 'zd-cookie-link';
    knopf.textContent = 'Cookie-Einstellungen';
    knopf.addEventListener('click', zeigen);
    var li = imp.closest('li');
    if (li) { var neu = document.createElement('li'); neu.appendChild(knopf); li.parentNode.insertBefore(neu, li.nextSibling); }
    else imp.parentNode.insertBefore(knopf, imp.nextSibling);
  };

  var start = function () {
    footerLink();
    var w = lesen();
    if (w === true) pixelLaden();
    else if (w === null && !/\/(datenschutz|impressum)\/?$/.test(location.pathname)) zeigen();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
