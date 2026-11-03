/* gidromet.iradgov.org: the Central Square camera (webcam.html and the box on the home page).
   The picture follows the time of day in Talas and today's weather and air. */
(function () {
  "use strict";
  var LAT = 42.52, LON = 72.24, TZ = 6;
  var BASE = "/assets/webcam/talas/";
  var TEXT = {
    en: {
      cam: "TALAS · CENTRAL SQUARE · CAM 1", h: "Webcam: Central Square, Talas",
      upd: "The picture is refreshed every 5 minutes.", off: "Camera temporarily unavailable",
      offS: "The picture will be back shortly.", more: "Larger picture", now: "Now in Talas",
      air: "Air quality index", irt: "IRT", nojs: "Last saved picture."
    },
    ir: {
      cam: "TALAS · BORBORDUK AYANT · KAM 1", h: "Veb-kamera: Borborduk ayant, Talas",
      upd: "Süröt ar 5 münöttö jañılanat.", off: "Kamera ubaktıluu ishtebeyt",
      offS: "Süröt jakında kaytıp kelet.", more: "Chooñ süröt", now: "Azır Talasta",
      air: "Aba sapatı indeksi", irt: "IRT", nojs: "Akırkı saktalgan süröt."
    },
    ru: {
      cam: "ТАЛАС · ЦЕНТРАЛЬНАЯ ПЛОЩАДЬ · КАМ 1", h: "Веб-камера: Центральная площадь, Талас",
      upd: "Изображение обновляется каждые 5 минут.", off: "Камера временно недоступна",
      offS: "Изображение скоро появится.", more: "Крупнее", now: "Сейчас в Таласе",
      air: "Индекс качества воздуха", irt: "IRT", nojs: "Последний сохранённый кадр."
    }
  };

  function lang() {
    var q = (location.search.match(/[?&]lang=(en|ir|ru)\b/) || [])[1];
    if (q) return q;
    try { var s = localStorage.getItem("gm_lang"); if (s === "en" || s === "ir" || s === "ru") return s; } catch (e) {}
    return "en";
  }
  function T(k) { var L = TEXT[lang()] || TEXT.en; return L[k] != null ? L[k] : TEXT.en[k]; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function iradNow() { var n = new Date(); return new Date(n.getTime() + n.getTimezoneOffset() * 60000 + TZ * 3600000); }
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 10000) / 10000; }

  /* sunrise and sunset in Irad Time (hours), NOAA approximation; alt = sun height in degrees */
  function sunTimes(d, alt) {
    var start = Date.UTC(d.getFullYear(), 0, 0), doy = Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - start) / 864e5);
    var g = 2 * Math.PI / 365 * (doy - 1);
    var eq = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
    var dec = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
    var la = LAT * Math.PI / 180, z = (90 - alt) * Math.PI / 180;
    var c = (Math.cos(z) - Math.sin(la) * Math.sin(dec)) / (Math.cos(la) * Math.cos(dec));
    var ha = Math.acos(Math.max(-1, Math.min(1, c))) * 180 / Math.PI;
    var noon = (720 - 4 * LON - eq) / 60 + TZ;
    return [noon - ha / 15, noon + ha / 15];
  }
  /* dawn, day, late (late afternoon), dusk, night */
  function slot(d) {
    var h = d.getHours() + d.getMinutes() / 60, s = sunTimes(d, -0.833), c = sunTimes(d, -6);
    if (h < c[0] || h >= c[1]) return "night";
    if (h < s[0] + 0.75) return "dawn";
    if (h >= s[1] - 0.25) return "dusk";
    if (h >= s[1] - 2.5) return "late";
    return "day";
  }
  /* clear, cloud, rain, snow, haze from today's numbers for Talas */
  function weather(data, d) {
    var key = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + "-" + d.getHours();
    if (!data) return hash(key) < 0.5 ? "cloud" : "clear";
    var w = (data.weather || []).filter(function (x) { return x.id === "talas"; })[0];
    var a = (data.air || []).filter(function (x) { return x.id === "talas"; })[0];
    if (!w) return "cloud";
    var c = +w.code || 0, t3 = w.temps_3h || [], i = Math.floor(d.getHours() / 3);
    var tNow = t3.length === 8 ? t3[i] + (t3[(i + 1) % 8] - t3[i]) * ((d.getHours() % 3) + d.getMinutes() / 60) / 3 : (w.high + w.low) / 2;
    var snowy = (c >= 71 && c <= 77) || c === 85 || c === 86, wet = c >= 51 || (w.precip_mm || 0) > 0;
    if (snowy || wet) {
      var share = Math.min(0.85, 0.4 + (w.precip_mm || 0) / 12);
      if (hash(key + "p") < share) return snowy || tNow <= 0.5 ? "snow" : "rain";
      return "cloud";
    }
    var aqi = a ? +a.aqi || 0 : 0;
    if (c === 45 || c === 48 || aqi >= 151 || (w.inversion && aqi >= 101)) return "haze";
    if (c >= 3) return "cloud";
    if (c === 2) return hash(key + "c") < 0.5 ? "cloud" : "clear";
    return "clear";
  }
  function frame(data) {
    var d = iradNow(), blk = Math.floor((d.getHours() * 60 + d.getMinutes()) / 5);
    var day = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    var shot = new Date(d.getTime()); shot.setMinutes(blk % 12 * 5, 0, 0);
    /* now and then the camera drops out for a while: about one twenty-minute spell in twenty-five */
    var off = hash(day + "-" + Math.floor(blk / 4) + "off") < 0.04;
    var take = hash(day + "-" + blk + "t") < 0.5 ? "a" : "b";
    var s = slot(d), w = weather(data, d);
    return { off: off, src: BASE + s + "-" + w + "-" + take + ".jpg", stamp: pad(shot.getDate()) + "." + pad(shot.getMonth() + 1) + "." + shot.getFullYear() + "  " + pad(shot.getHours()) + ":" + pad(shot.getMinutes()) + " " + T("irt"), key: blk, slot: s, wx: w };
  }

  var DATA = null, last = null;
  function draw(force) {
    var f = frame(DATA);
    if (!force && last && last.key === f.key && last.src === f.src) return;
    last = f;
    document.querySelectorAll(".camv").forEach(function (box) {
      var inner = f.off
        ? '<div class="cam-off"><div><b>' + T("off") + '</b><br><span>' + T("offS") + "</span></div></div>"
        : '<img src="' + f.src + '" alt="' + T("h") + '" width="960" height="540">';
      box.innerHTML = inner +
        '<span class="cam-ts">' + f.stamp + '<i class="cam-rec"></i></span><span class="cam-nm">' + T("cam") + "</span>";
      if (!f.off) live(box, f.slot);
    });
    document.querySelectorAll("[data-cam]").forEach(function (el) { el.textContent = T(el.getAttribute("data-cam")); });
    var now = document.getElementById("camNow");
    if (now && DATA) {
      var w = (DATA.weather || []).filter(function (x) { return x.id === "talas"; })[0], a = (DATA.air || []).filter(function (x) { return x.id === "talas"; })[0];
      if (w) {
        var d = iradNow(), t3 = w.temps_3h || [], i = Math.floor(d.getHours() / 3);
        var tn = t3.length === 8 ? t3[i] : w.high; /* the same figure as the header */
        var L = lang(), lab = (w.label && (w.label[L] || w.label.en)) || "";
        now.innerHTML = "<b>" + T("now") + ":</b> " + (tn > 0 ? "+" : tn < 0 ? "−" : "") + Math.abs(tn) + "°, " + lab +
          (a ? " · " + T("air") + " " + a.aqi : "");
      }
    }
  }
  /* the live look on a still picture: sensor static (worse in the dark), a slight flicker, and now and then
     the blocky smear of the next JPEG arriving, or a line torn sideways */
  var STILL = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var GRAIN = { dawn: 0.13, day: 0.08, late: 0.1, dusk: 0.17, night: 0.26 };
  var TILES = [], FX = [];
  function tiles() {
    for (var k = 0; k < 8; k++) {
      var c = document.createElement("canvas"); c.width = 320; c.height = 180;
      var x = c.getContext("2d"), im = x.createImageData(320, 180), p = im.data;
      for (var i = 0; i < p.length; i += 4) {
        var v = Math.random() * 255, ch = (Math.random() - 0.5) * 40;   /* a little colour in the static */
        p[i] = v + ch; p[i + 1] = v; p[i + 2] = v - ch; p[i + 3] = 255;
      }
      x.putImageData(im, 0, 0); TILES.push(c);
    }
  }
  function live(box, s) {
    if (STILL) return;
    var img = box.querySelector("img");
    var grain = document.createElement("canvas"), blk = document.createElement("canvas");
    grain.className = "cam-fx"; blk.className = "cam-blk";
    grain.width = 480; grain.height = 270; blk.width = 960; blk.height = 540;
    grain.style.opacity = GRAIN[s] || 0.1;
    box.insertBefore(blk, img.nextSibling); box.insertBefore(grain, blk.nextSibling);
    FX = FX.filter(function (o) { return document.body.contains(o.box); });
    var o = { box: box, img: img, grain: grain, blk: blk, next: 0, glitch: null };
    FX.push(o);
    if (img.complete) refresh(o, performance.now()); else img.onload = function () { refresh(o, performance.now()); };
  }
  function refresh(o, t) { o.glitch = { t: t, kind: "load" }; o.next = t + 15000 + Math.random() * 30000; }
  function tick(t) {
    if (!document.hidden) FX.forEach(function (o) {
      var g = o.grain.getContext("2d"), n = TILES[(Math.random() * TILES.length) | 0];
      g.drawImage(n, -Math.random() * 160, -Math.random() * 90, 640, 360);
      o.img.style.filter = "brightness(" + (1 + (Math.random() - 0.5) * 0.035).toFixed(3) + ")";
      if (!o.glitch && t > o.next) o.glitch = { t: t, kind: Math.random() < 0.6 ? "load" : "tear", y: Math.random() * 500, h: 6 + Math.random() * 24, dx: (Math.random() < 0.5 ? -1 : 1) * (6 + Math.random() * 18) };
      var b = o.blk.getContext("2d"), q = o.glitch;
      b.clearRect(0, 0, 960, 540);
      if (!q || !o.img.complete || !o.img.naturalWidth) return;
      var a = t - q.t;
      if (q.kind === "load") {
        /* a coarse 8x8-block version that resolves from the top down, as a slow JPEG does */
        if (a > 900) { o.glitch = null; o.next = t + 15000 + Math.random() * 30000; return; }
        var edge = a < 250 ? 0 : (a - 250) / 650 * 540;
        b.imageSmoothingEnabled = false;
        b.drawImage(o.img, 0, 0, 120, 68); b.drawImage(o.blk, 0, 0, 120, 68, 0, 0, 960, 540);
        b.clearRect(0, 0, 960, edge);
      } else {
        if (a > 160) { o.glitch = null; o.next = t + 15000 + Math.random() * 30000; return; }
        b.drawImage(o.img, 0, q.y, 960, q.h, q.dx, q.y, 960, q.h);
      }
    });
    setTimeout(function () { requestAnimationFrame(tick); }, 80);
  }
  if (!STILL) { tiles(); requestAnimationFrame(tick); }

  function css() {
    var s = document.createElement("style");
    s.textContent =
      ".camv{position:relative;display:block;background:#222;aspect-ratio:16/9;overflow:hidden;border:1px solid #7f9db9}" +
      "main .camv:not(.sm){max-width:640px}" +
      ".camv img{display:block;width:100%;height:100%;object-fit:cover}" +
      ".cam-ts,.cam-nm{position:absolute;font:bold 13px/1 'Courier New',monospace;color:#fff;text-shadow:1px 1px 0 #000,-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000;white-space:nowrap}" +
      ".cam-ts{left:8px;top:8px}.cam-nm{right:8px;bottom:8px}" +
      ".camv.sm .cam-ts,.camv.sm .cam-nm{font-size:10px}.camv.sm .cam-ts{left:5px;top:5px}.camv.sm .cam-nm{right:5px;bottom:5px}" +
      ".cam-off{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;color:#ddd;font:13px Tahoma,Verdana,sans-serif;" +
      "background:repeating-linear-gradient(0deg,#1d2026 0 2px,#262a31 2px 4px)}.cam-off b{font-size:15px;color:#fff}" +
      "@media (max-width:480px){.cam-ts,.cam-nm{font-size:10px}}" +
      ".cam-fx,.cam-blk{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}" +
      ".cam-fx{mix-blend-mode:overlay}" +
      ".cam-rec{display:inline-block;width:8px;height:8px;margin-left:7px;border-radius:50%;background:#e01010;box-shadow:0 0 0 1px #000;vertical-align:1px;animation:camrec 2s steps(1) infinite}" +
      "@keyframes camrec{50%{opacity:0}}" +
      "@media (prefers-reduced-motion:reduce){.cam-rec{animation:none}}";
    document.head.appendChild(s);
  }

  css();
  fetch("https://iradgov.org/data/today.json", { cache: "no-cache" }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }).then(function (d) {
    if (d) { if (d.weather && d.weather.places) d.weather = d.weather.places; if (d.air && d.air.places) d.air = d.air.places; }
    DATA = d; draw(true);
  });
  setInterval(function () { draw(false); }, 30000);
  /* the site script switches language without a reload; follow it */
  new MutationObserver(function () { draw(true); }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  window.GM_CAM = { frame: frame, slot: slot, sunTimes: sunTimes };
})();
