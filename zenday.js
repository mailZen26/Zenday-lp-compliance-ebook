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
