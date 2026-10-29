/* gidromet.iradgov.org: site script. Header, menu, left column, footer, language and the data-driven parts. */
(function () {
  "use strict";
  var SITE = {"store": "gm_lang", "nav": [["home", "/"], ["map", "/map.html"], ["forecast", "/forecast.html"], ["mountains", "/mountains.html"], ["air", "/air.html"], ["water", "/water.html"], ["about", "/about.html"]], "navAlias": {}, "links": [["gov", "https://iradgov.org/"], ["eirad", "https://e-irad.org/"], ["bank", "https://bank.iradgov.org/"], ["arch", "https://archives.iradgov.org/"], ["post", "https://post.iradgov.org/"], ["elections", "https://elections.iradgov.org/"], ["court", "https://court.iradgov.org/"], ["stats", "https://stats.iradgov.org/"], ["mejlis", "https://mejlis.iradgov.org/"], ["jandarm", "https://jandarm.iradgov.org/"], ["customs", "https://customs.iradgov.org/"], ["railways", "https://railways.iradgov.org/"], ["avia", "https://avia.iradgov.org/"], ["loto", "https://loto.iradgov.org/"], ["tender", "https://tender.e-irad.org/"]]};

  /* Mountain points of the mountain forecast (same points and code as jandarm.iradgov.org/roads.html). */
  var MTN = [{"id": "karasuu", "e": 1390, "road": "open", "n": {"en": "Kara-Suu Canyon mouth", "ir": "Kara-Suu kapchıgayının oozu", "ru": "Устье каньона Кара-Суу"}, "r": {"en": "Sary-Bulak road", "ir": "Sarı-Bulak jolu", "ru": "Дорога на Сары-Булак"}}, {"id": "aksay", "e": 2000, "road": "open", "n": {"en": "Aksay post", "ir": "Aksay postu", "ru": "Пост Аксай"}, "r": {"en": "Line crossing", "ir": "Liniya ötkölü", "ru": "Пункт пропуска на линии"}}, {"id": "suusamyr", "e": 2660, "road": "season", "n": {"en": "Suusamyr crossing", "ir": "Suusamır ötkölü", "ru": "Пункт пропуска Суусамыр"}, "r": {"en": "Karakol road, line crossing", "ir": "Karakol jolu, liniya ötkölü", "ru": "Каракольская дорога, пункт пропуска"}}, {"id": "otmek", "e": 3175, "road": "open", "n": {"en": "Otmek tunnel", "ir": "Otmek tunneli", "ru": "Отмекский тоннель"}, "r": {"en": "State Route 1, portals", "ir": "1-mamlekettik jol, portaldar", "ru": "Трасса № 1, порталы"}}, {"id": "alabel", "e": 3184, "road": "open", "n": {"en": "Fergana Gateway (Ala-Bel)", "ir": "Fergana Darbazası (Ala-Bel)", "ru": "Ферганские ворота (Ала-Бель)"}, "r": {"en": "State Route 1, summit post", "ir": "1-mamlekettik jol, ashuudagı post", "ru": "Трасса № 1, пост на перевале"}}, {"id": "otmekpass", "e": 3330, "road": "summer", "n": {"en": "Otmek Pass, old road", "ir": "Otmek ashuusu, eski jol", "ru": "Перевал Отмек, старая дорога"}, "r": {"en": "Summer bypass", "ir": "Jaykı aylanma jol", "ru": "Летний объезд"}}, {"id": "manas", "e": 3850, "road": "none", "n": {"en": "Manas Peak observatory", "ir": "Manas chokusundagı observatoriya", "ru": "Обсерватория пика Манас"}, "r": {"en": "No road", "ir": "Jol jok", "ru": "Дороги нет"}}];

  /* The weather map. Projection matches assets/irad-map.svg (drawn from the Kartalar map data):
     x = (lon - 67.9) * 72.66, y = (46.1 - lat) * 100. Posts are worked out from their base station at 6.5° per 1,000 m.
     dx, dy: where the station's flag sits, in screen pixels from the point. */
  var MAP = {
    views: { isez: [214, 196, 312, 340], irad: [-29, -30, 588, 640] },
    st: [
      { id: "talas", kind: "main", lat: 42.52, lon: 72.24, e: 1270, dx: -30, dy: -50, all: 1, n: { en: "Talas", ir: "Talas", ru: "Талас" } },
      { id: "nurzhan", kind: "main", lat: 43.6, lon: 73.76, e: 470, dx: -70, dy: -40, all: 1, n: { en: "Nurzhan", ir: "Nurzhan", ru: "Нуржан" } },
      { id: "iyik-janyl", kind: "main", lat: 41.412, lon: 72.226, e: 650, dx: -72, dy: -36, all: 1, n: { en: "Iyık Janyl", ir: "Iyık Janyl", ru: "Ийык Джаныл" } },
      { id: "tash-komur", kind: "main", lat: 41.345, lon: 72.222, e: 600, dx: 10, dy: 8, all: 1, n: { en: "Tash-Kömür", ir: "Tash-Kömür", ru: "Таш-Кумыр" } },
      { id: "sary-bulak", kind: "post", from: "talas", lat: 42.365, lon: 72.085, e: 1640, dx: -72, dy: 6, n: { en: "Sary-Bulak", ir: "Sarı-Bulak", ru: "Сары-Булак" } },
      { id: "kyzyl-adyr", kind: "post", from: "talas", lat: 42.618, lon: 71.588, e: 1010, dx: -30, dy: -50, n: { en: "Kyzyl-Adyr", ir: "Kızıl-Adır", ru: "Кызыл-Адыр" } },
      { id: "aksay", kind: "post", from: "talas", lat: 42.379, lon: 72.75, e: 2010, dx: -24, dy: -52, n: { en: "Aksay", ir: "Aksay", ru: "Аксай" } },
      { id: "otmek", kind: "post", from: "talas", lat: 42.35, lon: 73.176, e: 2550, dx: 8, dy: -46, n: { en: "Otmek", ir: "Otmek", ru: "Отмек" } },
      { id: "alabel", kind: "post", from: "talas", lat: 42.247, lon: 73.06, e: 3184, dx: -28, dy: 10, n: { en: "Fergana Gateway", ir: "Fergana Darbazası", ru: "Ферганские ворота" } },
      { id: "toktogul", kind: "post", from: "iyik-janyl", lat: 41.872, lon: 72.938, e: 1000, dx: 10, dy: -14, n: { en: "Toktogul", ir: "Toktogul", ru: "Токтогул" } },
      { id: "bazar-korgon", kind: "post", from: "iyik-janyl", lat: 41.035, lon: 72.743, e: 800, dx: 8, dy: -16, n: { en: "Bazar-Korgon", ir: "Bazar-Korgon", ru: "Базар-Коргон" } },
      { id: "boz-korgon", kind: "post", from: "nurzhan", lat: 43.583, lon: 74.251, e: 890, dx: -20, dy: 10, n: { en: "Boz-Korgon", ir: "Boz-Korgon", ru: "Боз-Коргон" } },
      { id: "manas", kind: "obs", from: "talas", lat: 42.329, lon: 71.0135, e: 3850, dx: 8, dy: -46, n: { en: "Manas Peak", ir: "Manas chokusu", ru: "Пик Манас" } },
      { id: "radar", kind: "radar", lat: 43.48, lon: 73.842, n: { en: "Kök-Döbö", ir: "Kök-Döbö", ru: "Кок-Дёбё" } },
      { id: "rec-hot", kind: "rec", lat: 45.0, lon: 68.75, all: 2, v: "+46.2°", t: "recHot", n: { en: "Akzhaykyn depression", ir: "Akjaykın oyduñu", ru: "Акжайкынская впадина" } },
      { id: "rec-cold", kind: "rec", lat: 42.13, lon: 72.8, all: 2, v: "−41.5°", t: "recCold", n: { en: "Aksay Plateau", ir: "Aksay jaylası", ru: "Плато Аксай" } }
    ],
    labels: [
      { k: "lbKAZ", lat: 46.2, lon: 70.6, sz: 13, v: "irad" }, { k: "lbUZB", lat: 40.5, lon: 68.6, sz: 11, v: "irad" }, { k: "lbKGZ", lat: 40.47, lon: 73.5, sz: 11, v: "irad" },
      { k: "lbAtr", lat: 44.7, lon: 70.9, sz: 13, v: "irad", c: "z" }, { k: "lbIsez", lat: 43.3, lon: 72.45, sz: 12, c: "z2" }, { k: "lbTk", lat: 41.72, lon: 72.98, sz: 8, v: "isez", c: "w" }
    ]
  };

  var I = window.SITE_I18N;
  var LANGS = ["ir", "ru", "en"];
  var PAGE = document.body.getAttribute("data-page") || "";
  var LANG = (function () {
    var q = (location.search.match(/[?&]lang=(en|ir|ru)\b/) || [])[1];
    if (q) { try { localStorage.setItem(SITE.store, q); } catch (e) {} return q; }
    try { var s = localStorage.getItem(SITE.store); if (LANGS.indexOf(s) >= 0) return s; } catch (e) {}
    return "en";
  })();
  var cache = {};

  /* ---------- helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function fill(s, v) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return v && v[k] != null ? v[k] : m; }); }
  function t(k, v) { var d = I.ui[LANG] || {}; var s = d[k] != null ? d[k] : I.ui.en[k]; return s == null ? k : (v ? fill(s, v) : s); }
  function tri(o) { if (o == null) return ""; if (typeof o === "string") return o; return o[LANG] || o.en || ""; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function iradNow() { var n = new Date(); return new Date(n.getTime() + n.getTimezoneOffset() * 60000 + 6 * 3600000); }
  function iradToday() { var d = iradNow(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function fmtDate(s) {
    var p = String(s).split("-"), M = t("months");
    if (p.length < 3) return t("monthsNom")[+p[1] - 1] + " " + p[0];
    if (LANG === "ir") return (+p[2]) + "-" + M[+p[1] - 1] + " " + p[0];
    return (+p[2]) + " " + M[+p[1] - 1] + " " + p[0];
  }
  function shortDate(s) { var p = String(s).split("-"); return pad(+p[2]) + "." + p[1]; }
  function getJSON(url) {
    if (!cache[url]) cache[url] = fetch(url, { cache: "no-cache" }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
    return cache[url];
  }
  function getText(url) {
    if (!cache[url]) cache[url] = fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); });
    return cache[url];
  }
  function sortByDate(a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; }
  /* today's numbers: the public file (iradone.com/data/today.json) nests its lists; flatten them once */
  function todayData() {
    return getJSON("https://iradone.com/data/today.json").then(function (d) {
      if (d.weather && d.weather.places) d.weather = d.weather.places;
      if (d.air && d.air.places) d.air = d.air.places;
      if (d.water && d.water.toktogul && !d.toktogul) d.toktogul = d.water.toktogul;
      if (!d.computed) d.computed = d.updated;
      return d;
    });
  }
  function failBox(el) { if (el) el.innerHTML = '<p class="muted">' + esc(t("loadFail")) + "</p>"; }
  function n(x) { return LANG === "en" ? String(x) : String(x).replace(".", ","); }
  function deg(x) { x = Math.round(x); return (x > 0 ? "+" : x < 0 ? "−" : "") + Math.abs(x) + "°"; }
  function tcls(x) { x = Math.round(x); return x > 0 ? "hot" : x < 0 ? "cold" : ""; }
  function place(d, id) { return d.weather.filter(function (w) { return w.id === id; })[0]; }

  /* ---------- weather pictograms (WMO weather codes) ---------- */
  function icon(code, lo) {
    var c = +code || 0, k = c <= 1 ? "sun" : c === 2 ? "part" : c === 3 ? "cloud" : c === 45 || c === 48 ? "fog" : c >= 95 ? "storm" :
      (c >= 71 && c <= 77) || c === 85 || c === 86 ? "snow" : c === 68 || c === 56 || c === 57 || c === 66 || c === 67 ? "sleet" : c >= 51 ? (c >= 80 ? "shower" : "rain") : "cloud";
    if (k === "rain" && lo != null && lo < -1) k = "sleet";
    var sun = function (x, y, r) {
      var rays = ""; for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4; rays += "M" + (x + Math.cos(a) * (r + 3)).toFixed(1) + " " + (y + Math.sin(a) * (r + 3)).toFixed(1) + "L" + (x + Math.cos(a) * (r + 7)).toFixed(1) + " " + (y + Math.sin(a) * (r + 7)).toFixed(1); }
      return '<path d="' + rays + '" stroke="#f39c12" stroke-width="2.4" stroke-linecap="round"/><circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#ffd23a" stroke="#ec8f0b" stroke-width="1.5"/>';
    };
    var cloud = function (dx, dy, f) { return '<path transform="translate(' + dx + " " + dy + ')" d="M11 34h25a8 8 0 0 0 1-16 11 11 0 0 0-21-3 9 9 0 0 0-5 19z" fill="' + (f || "#f3f6fa") + '" stroke="#7b90aa" stroke-width="1.5"/>'; };
    var drops = function (col) { return '<path d="M17 38l-2 6M25 38l-2 6M33 38l-2 6" stroke="' + (col || "#2a74c9") + '" stroke-width="2.4" stroke-linecap="round"/>'; };
    var flakes = '<g fill="#5aa0e6"><circle cx="16" cy="42" r="2.4"/><circle cx="25" cy="44" r="2.4"/><circle cx="34" cy="42" r="2.4"/></g>';
    var g = k === "sun" ? sun(24, 24, 9) : k === "part" ? sun(17, 17, 7) + cloud(4, 4) : k === "cloud" ? cloud(-6, -6, "#dfe6ef") + cloud(2, 2) : k === "fog" ? cloud(0, -4) + '<path d="M8 38h32M12 43h26" stroke="#9aa9bb" stroke-width="2.4" stroke-linecap="round"/>' :
      k === "rain" ? cloud(0, -4, "#dfe6ef") + drops() : k === "shower" ? sun(15, 13, 6) + cloud(0, -4) + drops() : k === "snow" ? cloud(0, -4) + flakes :
      k === "sleet" ? cloud(0, -4, "#dfe6ef") + '<path d="M17 38l-2 6M33 38l-2 6" stroke="#2a74c9" stroke-width="2.4" stroke-linecap="round"/><circle cx="25" cy="42" r="2.4" fill="#5aa0e6"/>' :
      cloud(0, -4, "#c9d2de") + '<path d="M24 34l-5 8h5l-3 7 8-10h-5l3-5z" fill="#ffd23a" stroke="#d48806" stroke-width="1"/>';
    return '<svg viewBox="0 0 48 48" aria-hidden="true">' + g + "</svg>";
  }

  /* a station's weather on day i (0 today, 1 tomorrow, 2 the day after); posts follow their base station */
  function stWx(d, s, i) {
    var b = place(d, s.from || s.id); if (!b) return null;
    var w = i === 0 ? b : (b.forecast || [])[i - 1]; if (!w) return null;
    if (!s.from) return { hi: w.high, lo: w.low, code: w.code, label: tri(w.label), mm: i === 0 ? w.precip_mm : null, inv: i === 0 && w.inversion };
    var k = (s.e - b.elevation_m) * 0.0065, hi = w.high - k, lo = w.low - k, wet = (w.code || 0) >= 51 || (i === 0 && (w.precip_mm || 0) > 0);
    var code = !wet ? w.code : hi <= 1 ? 73 : lo <= 0 ? 68 : w.code;
    return { hi: hi, lo: lo, code: code, label: !wet ? tri(w.label) : hi <= 1 ? t("mtSnow") : lo <= 0 ? t("mtMix") : t("mtRain") };
  }

  /* ---------- chrome ---------- */
  function navHTML() {
    return SITE.nav.map(function (x) {
      var cur = x[0] === PAGE || (SITE.navAlias[PAGE] === x[0]);
      return '<li><a href="' + x[1] + '"' + (cur ? ' aria-current="page"' : "") + ">" + esc(t("nav_" + x[0])) + "</a></li>";
    }).join("");
  }
  function chrome() {
    var top = $("#top"), bottom = $("#bottom"), lcol = $("#lcol"), under = $("#under");
    if (top) {
      top.innerHTML =
        '<a class="skip" href="#main">' + esc(t("skip")) + "</a>" +
        '<header class="hdr"><a class="home" href="/"><img src="/assets/gidromet-logo.svg" alt="" width="82" height="82">' +
        '<div class="ttl"><div class="n">Irad <span>Gidromet</span></div><div class="s">' + esc(t("mastS")) + '</div><div class="s2">' + esc(t("mastRu")) + "</div></div></a>" +
        '<div class="side"><div class="langs" role="group" aria-label="' + esc(t("langLabel")) + '">' +
        LANGS.map(function (l) { return '<button type="button" data-lang="' + l + '" aria-pressed="' + (l === LANG) + '" lang="' + I.htmlLang[l] + '">' + esc(I.langs[l]) + "</button>"; }).join("") +
        '</div><div id="hdrNow"></div><span class="clock" id="clock"></span></div></header>' +
        '<nav class="nav" aria-label="' + esc(t("navLabel")) + '"><button class="burger" type="button" aria-expanded="false">☰ ' + esc(t("menu")) + '</button><ul class="menu">' + navHTML() + "</ul></nav>" +
        '<div id="warnStrip"></div>';
      $(".burger", top).addEventListener("click", function () {
        var nav = $(".nav", top), open = !nav.classList.contains("open");
        nav.classList.toggle("open", open); this.setAttribute("aria-expanded", open);
      });
      $$("[data-lang]", top).forEach(function (b) { b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); }); });
      tick();
    }
    if (lcol) {
      lcol.innerHTML =
        '<div class="lbox menu-box"><div class="h">' + esc(t("lcMenu")) + '</div><div class="b"><ul>' +
        SITE.nav.map(function (x) { return '<li><a href="' + x[1] + '"' + (x[0] === PAGE ? ' aria-current="page"' : "") + ">" + esc(t("nav_" + x[0])) + "</a>" + (x[0] === "map" ? ' <span class="new">' + esc(t("newB")) + "</span>" : "") + "</li>"; }).join("") +
        "</ul></div></div>" +
        '<div class="lbox"><div class="h">' + esc(t("lcCities")) + '</div><div class="b" id="lcCities"></div></div>' +
        '<div class="lbox"><div class="h">' + esc(t("tkFill")) + '</div><div class="b tk" id="lcTk"></div></div>' +
        '<div class="lbox"><div class="h">' + esc(t("lcLinks")) + '</div><div class="b"><ul>' +
        '<li><a href="https://jandarm.iradgov.org/roads.html">' + esc(t("lcRoads")) + "</a></li>" +
        '<li><a href="https://maps.attelkom.net/">' + esc(t("lcKart")) + "</a></li>" +
        '<li><a href="https://iradgov.org/">iradgov.org</a></li></ul></div></div>';
    }
    if (bottom) {
      bottom.innerHTML =
        '<footer class="foot"><div class="fl"><address style="font-style:normal">' + t("footAddr") + "</address>" +
        '<div style="text-align:right">' + SITE.nav.map(function (x) { return '<a href="' + x[1] + '">' + esc(t("nav_" + x[0])) + "</a>"; }).join(" · ") + "</div></div>" +
        '<div class="links"><b>' + esc(t("footGov")) + ":</b> " + SITE.links.map(function (l) { return '<a href="' + l[1] + '">' + esc(t("link_" + l[0])) + "</a>"; }).join(" ") + "</div>" +
        '<div class="fine"><span>' + esc(t("footCopy", { y: iradNow().getFullYear() })) + "</span><span>" + esc(t("footTime")) + "</span></div></footer>";
    }
    if (under) under.textContent = t("under");
  }
  var tickTimer;
  function tick() {
    var el = $("#clock"); if (!el) return;
    var d = iradNow();
    el.textContent = t("clock", { d: fmtDate(iradToday()), t: pad(d.getHours()) + ":" + pad(d.getMinutes()) });
    clearTimeout(tickTimer); tickTimer = setTimeout(tick, 30000);
  }

  /* ---------- static text ---------- */
  function staticText() {
    var P = (I.pages || {})[LANG] || {};
    $$("[data-i18n]").forEach(function (el) {
      if (!el.hasAttribute("data-en")) el.setAttribute("data-en", el.innerHTML);
      var k = el.getAttribute("data-i18n");
      el.innerHTML = LANG === "en" ? el.getAttribute("data-en") : (P[k] != null ? P[k] : el.getAttribute("data-en"));
    });
    var tk = document.body.getAttribute("data-title");
    var dt = (tk && P["title_" + tk] && LANG !== "en" ? P["title_" + tk] : (document.body.getAttribute("data-title-en") || document.title.split(" | ")[0]));
    document.title = dt === t("mastN") ? dt : dt + " | " + t("mastN");
    document.documentElement.lang = I.htmlLang[LANG];
  }
  function setLang(l) {
    LANG = l;
    try { localStorage.setItem(SITE.store, l); } catch (e) {}
    render();
  }

  /* ---------- notices ---------- */
  function dates() {
    $$("[data-date]").forEach(function (el) { el.textContent = fmtDate(el.getAttribute("data-date")); });
  }
  function notices() {
    var el = $("#notices"); if (!el) return;
    var k = +(el.getAttribute("data-n") || 99);
    getJSON("/data/notices.json").then(function (d) {
      var items = (d.notices || []).slice().sort(sortByDate).slice(0, k);
      el.innerHTML = items.map(function (x) {
        return '<div class="notice"><div class="meta">' + esc(fmtDate(x.date)) + (x.number ? " · " + esc(tri(x.number)) : "") + '</div><div class="t">' + esc(tri(x.title)) + "</div>" +
          (x.text ? "<p>" + tri(x.text) + "</p>" : "") + (x.signed ? '<p class="small muted">' + esc(tri(x.signed)) + "</p>" : "") + "</div>";
      }).join("");
    }).catch(function () { failBox(el); });
  }

  /* ---------- today's numbers ---------- */
  function mountains(d) {
    var el = $("#mtnNow"); if (!el) return;
    var base = place(d, "talas"); if (!base) return;
    var winter = (function () { var m = +d.date.slice(5, 7), dd = +d.date.slice(8, 10); return m >= 11 || m <= 4 || (m === 10 && dd >= 25); })();
    function day(w, e) {
      var k = (e - 1270) * 0.0065, hi = w.high - k, lo = w.low - k, wet = (w.code || 0) >= 51 || (w.precip_mm || 0) > 0;
      var sky = !wet ? tri(w.label) : hi <= 1 ? t("mtSnow") : lo <= 0 ? t("mtMix") : t("mtRain");
      return { hi: hi, lo: lo, snow: wet && lo <= 0, heavy: wet && hi <= 1 && ((w.precip_mm || 0) >= 10 || (w.code || 0) >= 73), txt: deg(hi) + " / " + deg(lo) + " · " + sky };
    }
    el.innerHTML = '<div class="tbl-wrap"><table class="facts mtn"><thead><tr><th>' + esc(t("mtPlace")) + '</th><th class="num">' + esc(t("mtElev")) + "</th><th>" + esc(t("mtToday")) + "</th><th>" + esc(t("mtTom")) + "</th><th>" + esc(t("mtRoad")) + "</th></tr></thead><tbody>" +
      MTN.map(function (p) {
        var a = day(base, p.e), b = base.forecast && base.forecast[0] ? day(base.forecast[0], p.e) : null, st;
        if (p.road === "none") st = '<span class="muted">' + esc(t("mtNoRoad")) + "</span>";
        else if ((p.road === "summer" || p.road === "season") && winter) st = '<span class="st no">' + esc(t("mtSeason")) + "</span>";
        else if (a.heavy && p.e > 2500) st = '<span class="st no">' + esc(t("mtClosure")) + "</span>";
        else if ((a.snow || a.lo <= -2) && p.e > 1800) st = '<span class="st warn">' + esc(t("mtChains")) + "</span>";
        else st = '<span class="st ok">' + esc(t("mtOpen")) + "</span>";
        return "<tr><td><b>" + esc(tri(p.n)) + '</b><br><span class="small muted">' + esc(tri(p.r)) + '</span></td><td class="num nw">' + esc(t("mtM", { v: p.e.toLocaleString("en").replace(",", LANG === "en" ? "," : " ") })) +
          "</td><td data-l=\"" + esc(t("mtToday")) + "\">" + esc(a.txt) + "</td><td data-l=\"" + esc(t("mtTom")) + "\">" + (b ? esc(b.txt) : "") + "</td><td>" + st + "</td></tr>";
      }).join("") + "</tbody></table></div>";
  }
  function warnings(d) {
    var el = $("#warnStrip"); if (!el) return;
    var out = [], frost = [], minLo = 99, heavy = [], air = {}, inv = [];
    d.weather.forEach(function (w) {
      [w.low, w.forecast && w.forecast[0] ? w.forecast[0].low : 99].forEach(function (lo) { if (lo <= -1 && frost.indexOf(tri(w.name)) < 0) { frost.push(tri(w.name)); } if (lo <= -1) minLo = Math.min(minLo, lo); });
      if ((w.precip_mm || 0) >= 15) heavy.push(tri(w.name));
      if (w.inversion) inv.push(tri(w.name));
    });
    d.air.forEach(function (a) { if (a.aqi > 100) { var c = tri(a.label); (air[c] = air[c] || []).push(tri(a.name)); } });
    var fg = stWx(d, MAP.st.filter(function (s) { return s.id === "alabel"; })[0], 0);
    if (fg && (fg.code === 73 || fg.code === 68)) out.push(esc(t("wSnowPass", { v: deg(fg.hi) })));
    if (heavy.length) out.push(esc(t("wHeavy", { p: heavy.join(", ") })));
    if (frost.length) out.push(esc(t("wFrost", { v: deg(minLo), p: frost.join(", ") })));
    Object.keys(air).forEach(function (c) { out.push(esc(t("wAir", { c: c, p: air[c].join(", ") }))); });
    if (inv.length) out.push(esc(t("wInv", { p: inv.join(", ") })));
    el.innerHTML = out.length ? '<div class="warn"><div class="k">⚠ ' + esc(t("warnK")) + '</div><div class="v">' + out.map(function (x) { return "<b>" + x + "</b>"; }).join(" &nbsp;•&nbsp; ") + "</div></div>"
      : '<div class="warn calm"><div class="k">' + esc(t("calmK")) + '</div><div class="v">' + esc(t("calmV")) + "</div></div>";
  }
  function sideParts(d) {
    var el;
    if ((el = $("#hdrNow"))) {
      var tl = place(d, "talas"), h = iradNow().getHours();
      if (tl) {
        var v = tl.temps_3h && d.date === iradToday() ? tl.temps_3h[Math.floor(h / 3)] : tl.high;
        el.innerHTML = '<div class="now">' + icon(tl.code, tl.low) + '<span class="t">' + deg(v) + '</span><div class="p">' + esc(t("nowP", { t: tri(tl.label) })) + "</div></div>";
      }
    }
    if ((el = $("#lcCities"))) el.innerHTML = d.weather.map(function (w) {
      return '<div class="city">' + icon(w.code, w.low) + '<span class="n">' + esc(tri(w.name)) + '</span><span class="t"><span class="' + tcls(w.high) + '">' + deg(w.high) + '</span> <span class="muted">' + deg(w.low) + "</span></span></div>";
    }).join("") + '<div class="upd">' + esc(t("lcData", { d: shortDate(d.date), t: String(d.computed || "").slice(11, 16) })) + "</div>";
    if ((el = $("#lcTk")) && d.toktogul) {
      var k = d.toktogul;
      el.innerHTML = '<div class="v">' + n(k.fill_pct) + '%</div><div class="gauge"><i style="width:' + Math.max(0, Math.min(100, k.fill_pct)) + '%"></i></div>' +
        "<div>" + esc(t("tkStore", { s: n(k.storage_km3), t: n(k.total_km3) })) + '</div><div class="muted">' + esc(t("tkChange", { c: (k.change_mcm > 0 ? "+" : k.change_mcm < 0 ? "−" : "") + n(Math.abs(k.change_mcm)) })) + "</div>";
    }
  }
  function live() {
    var ids = ["wxNow", "wxFc", "aqNow", "tkNow", "wxUpd", "mtnNow", "lcCities", "lcTk", "hdrNow", "warnStrip", "wxMap", "stTable"];
    if (!ids.some(function (i) { return document.getElementById(i); })) return;
    todayData().then(function (d) {
      var el;
      sideParts(d);
      warnings(d);
      if ((el = $("#wxNow"))) el.innerHTML = '<div class="wx">' + d.weather.map(function (w) {
        return '<div class="wxc"><div class="k">' + esc(tri(w.name)) + '</div><div class="row">' + icon(w.code, w.low) + '<div class="v"><span class="' + tcls(w.high) + '">' + deg(w.high) + '</span> <span class="lo">/ ' + deg(w.low) + "</span></div></div>" +
          '<div class="s">' + esc(tri(w.label)) + (w.precip_mm ? " · " + esc(t("wxPrecip", { v: n(w.precip_mm) })) : "") + "</div>" +
          (w.inversion ? '<div class="s inv">' + esc(t("wxInv")) + "</div>" : "") + '<div class="s muted">' + esc(t("wxElev", { v: w.elevation_m })) + "</div></div>";
      }).join("") + "</div>";
      if ((el = $("#wxFc"))) el.innerHTML = d.weather.map(function (w) {
        var rows = [{ date: d.date, high: w.high, low: w.low, label: w.label, code: w.code, now: true }].concat(w.forecast || []);
        return "<h2>" + esc(tri(w.name)) + ' <span class="small muted">' + esc(t("wxElev", { v: w.elevation_m })) + "</span></h2>" +
          '<div class="tbl-wrap"><table class="facts"><thead><tr><th>' + esc(t("wxDay")) + "</th><th></th><th class=\"num\">" + esc(t("wxHi")) + "</th><th class=\"num\">" + esc(t("wxLo")) + "</th></tr></thead><tbody>" +
          rows.map(function (r) { return "<tr><td class=\"nw\">" + esc(r.now ? t("wxNow") : fmtDate(r.date)) + '</td><td><span class="fcd">' + icon(r.code, r.low) + esc(tri(r.label)) + '</span></td><td class="num ' + tcls(r.high) + '"><b>' + deg(r.high) + '</b></td><td class="num ' + tcls(r.low) + '">' + deg(r.low) + "</td></tr>"; }).join("") +
          "</tbody></table></div>" +
          (w.temps_3h ? '<p class="small muted">' + esc(t("wx3h")) + ": " + w.temps_3h.map(function (v, i) { return pad(i * 3) + ":00 " + deg(v); }).join(" · ") + "</p>" : "");
      }).join("");
      if ((el = $("#aqNow"))) el.innerHTML = '<div class="tbl-wrap"><table class="facts"><thead><tr><th>' + esc(t("aqPlace")) + '</th><th class="num">' + esc(t("aqAqi")) + '</th><th class="num">' + esc(t("aqPm")) + "</th><th>" + esc(t("aqCat")) + "</th></tr></thead><tbody>" +
        d.air.map(function (a) { return "<tr><td>" + esc(tri(a.name)) + '</td><td class="num"><span class="aqb aq-' + esc(a.category) + '">' + a.aqi + '</span></td><td class="num">' + n(a.pm25) + "</td><td>" + esc(tri(a.label)) + "</td></tr>"; }).join("") +
        "</tbody></table></div>" + (d.air[0] && d.air[0].heating_season ? '<p class="small muted">' + esc(t("aqHeat")) + "</p>" : "");
      if ((el = $("#tkNow")) && d.toktogul) {
        var k = d.toktogul;
        el.innerHTML = '<div class="card"><div class="small muted">' + esc(t("tkFill")) + '</div><div style="font:bold 26px Arial,sans-serif;color:#1f5fa6">' + n(k.fill_pct) + '%</div><div class="small">' + esc(t("tkStore", { s: n(k.storage_km3), t: n(k.total_km3) })) + "</div>" +
          '<div class="small">' + esc(tri(k.trend_label)) + " · " + esc(t("tkChange", { c: (k.change_mcm > 0 ? "+" : k.change_mcm < 0 ? "−" : "") + n(Math.abs(k.change_mcm)) })) + "</div></div>";
      }
      mountains(d);
      weatherMap(d);
      stationTable(d);
      if ((el = $("#wxUpd"))) el.textContent = t("wxUpd", { d: fmtDate(d.date), t: String(d.computed || "").slice(11, 16) });
    }).catch(function () {
      ["wxNow", "wxFc", "aqNow", "tkNow", "mtnNow", "lcCities", "lcTk", "wxMap", "stTable"].forEach(function (i) { var e = document.getElementById(i); if (e) failBox(e); });
      var w = $("#warnStrip"); if (w) w.innerHTML = "";
    });
  }

  /* ---------- weather map ---------- */
  var mapState = { layer: 0, view: "isez", sel: null };
  function proj(lat, lon) { return [(lon - 67.9) * 72.66, (46.1 - lat) * 100]; }
  function stElev(d, s) { var w = s.kind === "main" && place(d, s.id); return w ? w.elevation_m : s.e; }
  function stKindText(s) {
    if (s.kind === "main") return t("kMain");
    var b = MAP.st.filter(function (x) { return x.id === s.from; })[0];
    return t(s.kind === "obs" ? "kObs" : "kPost", { b: b ? tri(b.n) : "" });
  }
  function weatherMap(d) {
    var box = $("#wxMap"); if (!box) return;
    var dayN = function (i) { var w = place(d, "talas"); return w && w.forecast && w.forecast[i - 1] ? shortDate(w.forecast[i - 1].date) : ""; };
    var layers = [t("mapToday"), t("mapTom"), dayN(2), t("mapAir")];
    getText("/assets/irad-map.svg").then(function (svg) {
      var inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
      box.innerHTML = '<div class="wmap"><div class="bar"><div class="g" role="group">' +
        layers.map(function (l, i) { return '<button type="button" data-ly="' + i + '" aria-pressed="' + (i === mapState.layer) + '">' + esc(l) + "</button>"; }).join("") +
        '</div><div class="g" role="group"><button type="button" data-vw="isez" aria-pressed="' + (mapState.view === "isez") + '">' + esc(t("mapIsez")) + '</button><button type="button" data-vw="irad" aria-pressed="' + (mapState.view === "irad") + '">' + esc(t("mapIrad")) + "</button></div></div>" +
        '<div class="cv"><svg class="mp" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + esc(t("nav_map")) + '">' + inner + '<g id="mLbl"></g><g id="mMk"></g></svg></div>' +
        '<div class="legend"><span><i style="background:#fffef6"></i>' + esc(t("lgIsez")) + '</span><span><i style="background:#e2e8d3"></i>' + esc(t("lgAtr")) + '</span><span><i style="background:none;border:0;border-top:2px solid #b5212b;height:0"></i>' + esc(t("lgBorder")) +
        '</span><span><i style="background:none;border:0;border-top:2px dashed #5a5a5a;height:0"></i>' + esc(t("lgLine")) + '</span><span><i style="background:#fff;border-color:#a6c6dc"></i>' + esc(t("lgIce")) +
        '</span><span>● ' + esc(t("lgMain")) + '</span><span>○ ' + esc(t("lgPost")) + '</span><span>◎ ' + esc(t("lgRadar")) + '</span><span>★ ' + esc(t("lgRec")) + "</span></div>" +
        '<div class="cap"><span id="mCap"></span><span>' + esc(t("wxUpd", { d: fmtDate(d.date), t: String(d.computed || "").slice(11, 16) })) + '</span></div><div class="info" id="mInfo"></div></div>';
      $$("[data-ly]", box).forEach(function (b) { b.addEventListener("click", function () { mapState.layer = +b.getAttribute("data-ly"); weatherMap(d); }); });
      $$("[data-vw]", box).forEach(function (b) { b.addEventListener("click", function () { mapState.view = b.getAttribute("data-vw"); weatherMap(d); }); });
      drawMarkers(d);
    }).catch(function () { failBox(box); });
  }
  function drawMarkers(d) {
    var svg = $("#wxMap svg.mp"); if (!svg) return;
    var vb = MAP.views[mapState.view], air = mapState.layer === 3;
    svg.setAttribute("viewBox", vb.join(" "));
    var u = vb[2] / Math.max(svg.clientWidth || 700, 560); /* map units per screen pixel */
    var f = function (x) { return (x * u).toFixed(2); };
    $("#mLbl", svg).innerHTML = MAP.labels.filter(function (l) { return !l.v || l.v === mapState.view; }).map(function (l) {
      var p = proj(l.lat, l.lon);
      return '<text class="m-lbl' + (l.c ? " " + l.c : "") + '" x="' + p[0].toFixed(1) + '" y="' + p[1].toFixed(1) + '" text-anchor="middle" font-size="' + f(l.sz) + '"' + (l.c === "w" ? ' style="fill:#3c78b8;letter-spacing:0;font-style:italic;text-transform:none"' : "") + ">" + esc(t(l.k)) + "</text>";
    }).join("");
    var aqi = {}; d.air.forEach(function (a) { aqi[a.id] = a; });
    var list = MAP.st.filter(function (s) { return mapState.view === "isez" ? s.all !== 2 : s.all; });
    $("#mMk", svg).innerHTML = list.map(function (s) {
      var p = proj(s.lat, s.lon), x = p[0].toFixed(1), y = p[1].toFixed(1), nm = esc(tri(s.n));
      var g = '<g class="mk ' + (s.kind === "main" ? "main" : s.kind === "rec" ? "rec" : "der") + (mapState.sel === s.id ? " sel" : "") + '" data-st="' + s.id + '" tabindex="0">';
      if (s.kind === "radar") return g + '<circle cx="' + x + '" cy="' + y + '" r="' + f(7) + '" fill="none" stroke="#1f5fa6" stroke-width="' + f(1.3) + '"/><circle cx="' + x + '" cy="' + y + '" r="' + f(2.5) + '" fill="#1f5fa6"/>' +
        '<text class="nm" x="' + (p[0] + 9 * u).toFixed(1) + '" y="' + (p[1] + 12 * u).toFixed(1) + '" font-size="' + f(9) + '" stroke-width="' + f(2.5) + '">' + nm + "</text><title>" + esc(t("kRadar")) + "</title></g>";
      if (s.kind === "rec") return g + '<text x="' + x + '" y="' + (p[1] + 5 * u).toFixed(1) + '" text-anchor="middle" font-size="' + f(15) + '" fill="#c0392b">★</text>' +
        '<text class="nm" x="' + (p[0] + 10 * u).toFixed(1) + '" y="' + (p[1] + 1 * u).toFixed(1) + '" font-size="' + f(9.5) + '" stroke-width="' + f(2.5) + '">' + nm + '</text><text class="nm tp ' + (s.v.charAt(0) === "+" ? "w" : "c") + '" x="' + (p[0] + 10 * u).toFixed(1) + '" y="' + (p[1] + 12 * u).toFixed(1) + '" font-size="' + f(11) + '" stroke-width="' + f(2.5) + '">' + s.v + "</text><title>" + esc(t(s.t)) + "</title></g>";
      var fx = p[0] + s.dx * u, fy = p[1] + s.dy * u, W = 72, H = 24, body;
      if (air) {
        var a = aqi[s.id];
        if (!a) return g.replace('class="mk', 'class="mk off') + '<circle class="dot" cx="' + x + '" cy="' + y + '" r="' + f(3.5) + '" stroke-width="' + f(1.2) + '"/></g>';
        body = '<rect class="aq-' + esc(a.category) + '" x="' + (fx + 3 * u).toFixed(1) + '" y="' + (fy + 3 * u).toFixed(1) + '" width="' + f(W - 6) + '" height="' + f(H - 6) + '" style="fill:' + ({ good: "#2e8b3e", moderate: "#c99a00", sensitive: "#d96c00", unhealthy: "#c62828", "very-unhealthy": "#7b1fa2", hazardous: "#6d1b1b" }[a.category] || "#888") + '"/>' +
          '<text x="' + (fx + W / 2 * u).toFixed(1) + '" y="' + (fy + 17 * u).toFixed(1) + '" text-anchor="middle" font-size="' + f(13) + '" fill="#fff" font-weight="bold" font-family="Arial,sans-serif">' + a.aqi + "</text>";
      } else {
        var w = stWx(d, s, mapState.layer); if (!w) return "";
        var hi = Math.round(w.hi), lo = Math.round(w.lo);
        body = '<svg x="' + (fx + 1 * u).toFixed(1) + '" y="' + (fy + 1 * u).toFixed(1) + '" width="' + f(22) + '" height="' + f(22) + '" viewBox="0 0 48 48">' + icon(w.code, w.lo).replace(/^<svg[^>]*>|<\/svg>$/g, "") + "</svg>" +
          '<text class="tp ' + (hi > 0 ? "w" : hi < 0 ? "c" : "z") + '" x="' + (fx + 24 * u).toFixed(1) + '" y="' + (fy + 17 * u).toFixed(1) + '" font-size="' + f(13) + '">' + deg(hi) + "</text>" +
          '<text class="lo" x="' + (fx + 56 * u).toFixed(1) + '" y="' + (fy + 17 * u).toFixed(1) + '" font-size="' + f(9) + '">' + deg(lo) + "</text>";
      }
      var line = '<path d="M' + x + " " + y + "L" + (fx + W / 2 * u).toFixed(1) + " " + (fy + (s.dy < 0 ? H : 0) * u).toFixed(1) + '" stroke="#4f74a0" stroke-width="' + f(.8) + '"/>';
      return g + line + '<rect class="flag" x="' + fx.toFixed(1) + '" y="' + fy.toFixed(1) + '" width="' + f(W) + '" height="' + f(H) + '" stroke-width="' + f(1) + '"/>' + body +
        '<text class="nm" x="' + (fx + W / 2 * u).toFixed(1) + '" y="' + (s.dy < 0 ? fy - 3 * u : fy + (H + 10) * u).toFixed(1) + '" text-anchor="middle" font-size="' + f(10) + '" stroke-width="' + f(2.5) + '">' + nm + "</text>" +
        '<circle class="dot" cx="' + x + '" cy="' + y + '" r="' + f(3.5) + '" stroke-width="' + f(1.2) + '"/><title>' + nm + "</title></g>";
    }).join("");
    $("#mCap").textContent = (air ? t("mapCapAir") : t("mapCap")) + " " + t("mapClick");
    $$(".mk", svg).forEach(function (g) {
      var go = function () { mapState.sel = g.getAttribute("data-st"); drawMarkers(d); };
      g.addEventListener("click", go);
      g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    });
    mapInfo(d);
  }
  function mapInfo(d) {
    var el = $("#mInfo"); if (!el) return;
    var s = MAP.st.filter(function (x) { return x.id === mapState.sel; })[0];
    if (!s) { el.innerHTML = '<span class="muted">' + esc(t("mapClick")) + "</span>"; return; }
    if (s.kind === "radar") { el.innerHTML = "<b>" + esc(t("kRadar")) + "</b>. " + esc(t("kRadarS")); return; }
    if (s.kind === "rec") { el.innerHTML = "<b>" + esc(tri(s.n)) + "</b>. " + esc(t(s.t)) + "."; return; }
    var head = "<b>" + esc(tri(s.n)) + "</b>, " + esc(t("mtM", { v: stElev(d, s).toLocaleString("en").replace(",", LANG === "en" ? "," : " ") })) + ", " + esc(stKindText(s)) + ".<br>";
    if (mapState.layer === 3) {
      var a = d.air.filter(function (x) { return x.id === s.id; })[0];
      var cnt = { nurzhan: 3, talas: 2, "iyik-janyl": 1 }[s.id] || 0;
      el.innerHTML = head + (a ? esc(t("infAqi", { a: a.aqi, c: tri(a.label), p: n(a.pm25), n: cnt })) : esc(t("infNoAqi")));
      return;
    }
    el.innerHTML = head + [0, 1, 2].map(function (i) {
      var w = stWx(d, s, i); if (!w) return "";
      var b = place(d, s.from || s.id), lbl = i === 0 ? t("mapToday") : i === 1 ? t("mapTom") : shortDate(b.forecast[1].date);
      return esc(lbl) + ": " + esc(w.label) + ", <b class=\"" + tcls(w.hi) + "\">" + deg(w.hi) + "</b> / " + deg(w.lo) + (w.mm ? ", " + esc(t("wxPrecip", { v: n(w.mm) })) : "");
    }).filter(Boolean).join(" &nbsp;|&nbsp; ");
  }
  function stationTable(d) {
    var el = $("#stTable"); if (!el) return;
    var no = 0;
    el.innerHTML = '<div class="tbl-wrap"><table class="facts"><thead><tr><th class="num">' + esc(t("stNo")) + "</th><th>" + esc(t("stName")) + '</th><th class="num">' + esc(t("mtElev")) + "</th><th>" + esc(t("stKind")) + "</th><th>" + esc(t("mtToday")) + "</th></tr></thead><tbody>" +
      MAP.st.filter(function (s) { return s.e; }).map(function (s) {
        var w = stWx(d, s, 0); no++;
        return '<tr><td class="num">' + pad(no) + "</td><td><b>" + esc(tri(s.n)) + '</b></td><td class="num nw">' + esc(t("mtM", { v: stElev(d, s).toLocaleString("en").replace(",", LANG === "en" ? "," : " ") })) + "</td><td>" + esc(stKindText(s)) + "</td><td class=\"nw\">" +
          (w ? '<span class="fcd">' + icon(w.code, w.lo) + '<b class="' + tcls(w.hi) + '">' + deg(w.hi) + "</b>&nbsp;/&nbsp;" + deg(w.lo) + "</span>" : "") + "</td></tr>";
      }).join("") + "</tbody></table></div>";
  }
  var rsz;
  window.addEventListener("resize", function () { clearTimeout(rsz); rsz = setTimeout(function () { if ($("#wxMap svg.mp")) todayData().then(drawMarkers); }, 200); });

  /* ---------- forms and online services; "In the news" ---------- */
  var SVC = {"home": [[{"en": "Request for a certified weather certificate", "ir": "Tastıktalgan aba ırayı malımatnamasın suroo", "ru": "Запрос заверенной справки о погодных условиях"}, "https://e-irad.org/forms/GM-9.pdf", "GM-9 · PDF"], [{"en": "Road conditions and the Otmek tunnel", "ir": "Joldordun abalı jana Ötmök tunneli", "ru": "Состояние дорог и тоннель Отмёк"}, "https://jandarm.iradgov.org/roads.html", {"en": "Gendarmerie", "ir": "Jandarmeriya", "ru": "Жандармерия"}]], "about": [[{"en": "Request for a certified weather certificate", "ir": "Tastıktalgan aba ırayı malımatnamasın suroo", "ru": "Запрос заверенной справки о погодных условиях"}, "https://e-irad.org/forms/GM-9.pdf", "GM-9 · PDF"]], "forecast": [[{"en": "Request for a certified weather certificate", "ir": "Tastıktalgan aba ırayı malımatnamasın suroo", "ru": "Запрос заверенной справки о погодных условиях"}, "https://e-irad.org/forms/GM-9.pdf", "GM-9 · PDF"]], "mountains": [[{"en": "Road conditions and the Otmek tunnel", "ir": "Joldordun abalı jana Ötmök tunneli", "ru": "Состояние дорог и тоннель Отмёк"}, "https://jandarm.iradgov.org/roads.html", {"en": "Gendarmerie", "ir": "Jandarmeriya", "ru": "Жандармерия"}], [{"en": "Application for passage of dangerous goods through the Otmek tunnel", "ir": "Ötmök tunneli arkıluu kooptuu jük ötkörüü arızı", "ru": "Заявление на проезд с опасным грузом через тоннель Отмёк"}, "https://e-irad.org/forms/HPC-20.pdf", "HPC-20 · PDF"]], "water": [[{"en": "Drill a well or take irrigation water", "ir": "Kuduk kazuu je sugaruu suusun aluu", "ru": "Бурение скважины или забор воды для полива"}, "https://e-irad.org/procedure.html?id=b-build-well", {"en": "step by step", "ir": "baskıchma-baskıch", "ru": "пошагово"}], [{"en": "Request for a certified weather certificate", "ir": "Tastıktalgan aba ırayı malımatnamasın suroo", "ru": "Запрос заверенной справки о погодных условиях"}, "https://e-irad.org/forms/GM-9.pdf", "GM-9 · PDF"]]};
  var SVC_L = {"svcH": {"en": "Forms and online services", "ir": "Formalar jana onlayn kızmattar", "ru": "Бланки и онлайн-услуги"}, "svcAll": {"en": "All forms on e-Irad", "ir": "e-Iraddagı bardık formalar", "ru": "Все бланки на e-Irad"}, "newsH": {"en": "In the news", "ir": "Jañılıktarda", "ru": "В новостях"}}, NEWS_HOST = "gidromet.iradgov.org", newsP;
  function linkBoxes() {
    var wrap = $("main .wrap"); if (!wrap) return;
    $$("#svc-box, #news-box").forEach(function (b) { b.parentNode.removeChild(b); });
    var host = $("aside", wrap) || wrap, L = SVC[PAGE];
    if (L && L.length) {
      var box = document.createElement("div");
      box.id = "svc-box"; box.className = "card tone"; box.style.marginTop = "16px";
      box.innerHTML = "<h3>" + esc(tri(SVC_L.svcH)) + '</h3><ul style="margin:0;padding-left:18px">' + L.map(function (x) {
        return '<li style="margin:4px 0"><a href="' + x[1] + '">' + esc(tri(x[0])) + "</a>" + (x[2] ? ' <span class="small muted">' + esc(tri(x[2])) + "</span>" : "") + "</li>";
      }).join("") + '</ul><p class="small" style="margin-bottom:0"><a href="https://e-irad.org/forms.html">' + esc(tri(SVC_L.svcAll)) + "</a></p>";
      host.appendChild(box);
    }
    if (PAGE !== "home") return;
    newsP = newsP || Promise.all(["https://iradone.com/data/sitelinks.json", "https://talasherald.com/data/sitelinks.json"].map(function (u) {
      return fetch(u).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
    }));
    newsP.then(function (feeds) {
      var items = [];
      feeds.forEach(function (f) { if (f && f.sites && f.sites[NEWS_HOST]) f.sites[NEWS_HOST].forEach(function (s) { items.push({ title: s.title, url: s.url, date: s.date, outlet: f.outlet }); }); });
      if (!items.length || $("#news-box")) return;
      items.sort(sortByDate);
      var box = document.createElement("div");
      box.id = "news-box"; box.className = "card"; box.style.marginTop = "16px";
      box.innerHTML = "<h3>" + esc(tri(SVC_L.newsH)) + '</h3><ul style="margin:0;padding-left:18px">' + items.slice(0, 5).map(function (s) {
        return '<li style="margin:6px 0"><a href="' + esc(s.url) + '">' + esc(s.title) + '</a><br><span class="small muted">' + esc(s.outlet) + " · " + esc(fmtDate(s.date)) + "</span></li>";
      }).join("") + "</ul>";
      host.appendChild(box);
    });
  }

  function render() {
    chrome();
    staticText();
    dates();
    notices();
    live();
    linkBoxes();
  }
  render();
})();

/* holiday, half-mast, pass and power notices shared by the state sites (iradgov.org/assets/irad-bar.js) */
(function () {
  var s = document.createElement("script");
  s.src = "https://iradgov.org/assets/irad-bar.js"; s.defer = true; s.setAttribute("data-kind", "gov");
  document.head.appendChild(s);
})();
