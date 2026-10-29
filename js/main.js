/* Shared behaviour for the NusaDB site: theme toggle, menus, copy buttons,
   tabs, the on-page contents list, chart tooltips, and the write-path figure
   on the home page. No framework and no build step. Every page reads fine
   without this file; it only adds the controls that need a script. */

(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- colour scheme -------------------------------------------------- */

  var KEY = "nusadb-theme";
  try {
    var saved = localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  } catch (e) { /* storage blocked: follow the media query */ }

  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  var themeBtn = document.getElementById("themeBtn");
  if (themeBtn) {
    var paint = function () {
      var dark = currentTheme() === "dark";
      themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
      themeBtn.innerHTML = dark
        ? '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/></svg>'
        : '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8Z"/></svg>';
    };
    paint();
    themeBtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem(KEY, next); } catch (e) { /* ignore */ }
      paint();
    });
  }

  /* ---- masthead + sidebar toggles ------------------------------------ */

  var burger = document.getElementById("burger");
  var mastNav = document.getElementById("mastNav");
  if (burger && mastNav) {
    burger.addEventListener("click", function () {
      var open = mastNav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mastNav.addEventListener("click", function (ev) {
      if (ev.target.tagName === "A") {
        mastNav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  // The header is borderless at the top of the page and gains a rule once
  // the page scrolls under it. Without script the rule is always there.
  var mast = document.querySelector(".masthead");
  if (mast) {
    var edge = function () { mast.classList.toggle("scrolled", window.scrollY > 4); };
    window.addEventListener("scroll", edge, { passive: true });
    edge();
  }

  var sideBtn = document.querySelector(".sidebar-toggle");
  var side = document.querySelector(".sidebar");
  if (sideBtn && side) {
    sideBtn.addEventListener("click", function () {
      var open = side.classList.toggle("open");
      sideBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---- copy buttons --------------------------------------------------- */

  document.querySelectorAll(".code").forEach(function (block) {
    var btn = block.querySelector(".copy");
    var pre = block.querySelector("pre");
    if (!btn || !pre) return;
    btn.addEventListener("click", function () {
      // Prompt markers (.p) are dropped so the clipboard holds what a shell accepts.
      var clone = pre.cloneNode(true);
      clone.querySelectorAll(".p").forEach(function (n) { n.remove(); });
      var text = clone.textContent.replace(/\s+$/, "");
      var done = function () {
        var label = btn.querySelector("em");
        btn.dataset.done = "1";
        if (label) label.textContent = "Copied";
        setTimeout(function () {
          btn.dataset.done = "";
          if (label) label.textContent = "Copy";
        }, 1600);
      };
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); done(); } catch (e) { /* give up quietly */ }
        document.body.removeChild(ta);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else {
        fallback();
      }
    });
  });

  /* ---- tabs (session examples, drivers) ------------------------------- */

  /* Without script every panel is visible, one under the other. With it,
     one panel shows at a time and the arrow keys move between tabs. */
  document.querySelectorAll("[data-tabs]").forEach(function (box) {
    var tabs = Array.prototype.slice.call(box.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t, false); });
      t.addEventListener("keydown", function (ev) {
        var k = ev.key, j = -1;
        if (k === "ArrowRight" || k === "ArrowDown") j = (i + 1) % tabs.length;
        else if (k === "ArrowLeft" || k === "ArrowUp") j = (i - 1 + tabs.length) % tabs.length;
        else if (k === "Home") j = 0;
        else if (k === "End") j = tabs.length - 1;
        if (j >= 0) { ev.preventDefault(); select(tabs[j], true); }
      });
    });
    var first = tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0] || tabs[0];
    select(first, false);
  });

  /* ---- heading anchors + table of contents ---------------------------- */

  var prose = document.querySelector(".prose");
  var tocBox = document.getElementById("toc");
  if (prose) {
    var heads = prose.querySelectorAll("h2[id], h3[id]");
    heads.forEach(function (h) {
      var a = document.createElement("a");
      a.className = "anchor";
      a.href = "#" + h.id;
      a.setAttribute("aria-label", "Link to this section");
      a.textContent = "#";
      h.appendChild(a);
    });
    if (tocBox && heads.length > 2) {
      var ul = document.createElement("ul");
      heads.forEach(function (h) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "#" + h.id;
        a.textContent = (h.textContent || "").replace(/#$/, "").trim();
        if (h.tagName === "H3") a.className = "lv3";
        li.appendChild(a);
        ul.appendChild(li);
      });
      tocBox.appendChild(ul);
      var links = tocBox.querySelectorAll("a");
      var spy = function () {
        var best = 0;
        for (var i = 0; i < heads.length; i++) {
          if (heads[i].getBoundingClientRect().top - 100 <= 0) best = i; else break;
        }
        links.forEach(function (l, i) { l.classList.toggle("on", i === best); });
      };
      var queued = false;
      window.addEventListener("scroll", function () {
        if (queued) return;
        queued = true;
        requestAnimationFrame(function () { spy(); queued = false; });
      }, { passive: true });
      spy();
    }
  }

  /* ---- chart tooltips --------------------------------------------------- */

  document.querySelectorAll(".chart").forEach(function (chart) {
    var tip = document.createElement("div");
    tip.className = "chart-tip";
    tip.hidden = true;
    chart.style.position = "relative";
    chart.appendChild(tip);
    function show(bar) {
      var cr = chart.getBoundingClientRect(), br = bar.getBoundingClientRect();
      tip.textContent = bar.getAttribute("data-tip");
      tip.style.left = (br.left - cr.left + Math.min(br.width, cr.width - 40) / 2) + "px";
      tip.style.top = (br.top - cr.top) + "px";
      tip.hidden = false;
    }
    chart.querySelectorAll(".bar").forEach(function (bar) {
      bar.addEventListener("mouseenter", function () { show(bar); });
      bar.addEventListener("focus", function () { show(bar); });
      bar.addEventListener("mouseleave", function () { tip.hidden = true; });
      bar.addEventListener("blur", function () { tip.hidden = true; });
    });
  });

  /* ---- Fig. 1: the write path ------------------------------------------ */

  /* Steps: 0 empty log; 1-2 inserts dirty p2 and p6; 3 commit + fsync;
     4 update dirties p9; 5 commit + fsync; 6 checkpoint writes the changed
     pages to a new segment and the image now covers lsn 1205; 7 the log is
     truncated. The markup holds the drawing at step 5, which is what a reader
     without script, or with reduced motion and no interaction, sees. */
  var fig = document.getElementById("logfig");
  if (fig) {
    var frames = fig.querySelectorAll(".lf-frame");
    var pages = fig.querySelectorAll(".lf-page[data-dirty]");
    var sync1 = document.getElementById("lfSync1");
    var sync2 = document.getElementById("lfSync2");
    var seg = document.getElementById("lfSeg");
    var segBox = document.getElementById("lfSegBox");
    var segTxt = document.getElementById("lfSegTxt");
    var arrow = document.getElementById("lfCkptArrow");
    var covers = document.getElementById("lfCovers");
    var state = document.getElementById("lfState");
    var playBtn = document.getElementById("lfPlay");
    var stepBtn = document.getElementById("lfStep");
    var LABELS = [
      "btree.wal is empty; the image covers lsn 1200",
      "txn 7 inserts a row: record appended, page p2 changed",
      "txn 7 inserts another row: page p6 changed",
      "txn 7 commits: <b>fsync</b>, COMMIT returns",
      "txn 8 updates a row: page p9 changed",
      "txn 8 commits: <b>fsync</b>, COMMIT returns",
      "CHECKPOINT: p2, p6, p9 go to a new segment; image covers lsn 1205",
      "image published, btree.wal truncated to 0 bytes"
    ];
    var step = 5;
    var timer = null;

    function render(n) {
      step = n;
      frames.forEach(function (f) {
        var s = +f.getAttribute("data-step");
        var visible = s <= n && n < 7;
        f.style.opacity = visible ? "1" : "0";
      });
      pages.forEach(function (p) {
        var touched = +p.getAttribute("data-dirty") <= n;
        var cls = n === 6 ? "d-box-brand" : (touched && n < 6 ? "d-dirty" : "d-clean");
        if (!touched) cls = "d-clean";
        p.setAttribute("class", "lf-page " + cls);
      });
      sync1.classList.toggle("on", n >= 3 && n < 7);
      sync2.classList.toggle("on", n >= 5 && n < 7);
      var written = n >= 6;
      segBox.setAttribute("stroke-dasharray", written ? "0" : "4 3");
      segTxt.textContent = written ? "…1205….seg" : "next .seg";
      seg.style.opacity = (n >= 5) ? "1" : "0.35";
      arrow.style.opacity = (n === 6) ? "1" : (n >= 5 && n < 6 ? "0.5" : "0");
      covers.textContent = written ? "covers lsn 1205" : "covers lsn 1200";
      state.innerHTML = LABELS[n];
    }

    function tick() { render((step + 1) % LABELS.length); }
    function play() {
      if (timer) return;
      timer = setInterval(tick, 1500);
      playBtn.textContent = "Pause";
    }
    function pause() {
      clearInterval(timer);
      timer = null;
      playBtn.textContent = "Play";
    }
    playBtn.addEventListener("click", function () { if (timer) pause(); else play(); });
    stepBtn.addEventListener("click", function () { pause(); tick(); });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      pause();
      render(5);
    } else {
      // Start from an empty log the first time the figure is on screen, and
      // stop the loop whenever it scrolls away.
      var started = false;
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            if (!started) { started = true; render(0); }
            if (playBtn.textContent !== "Play" || !started) play();
          } else if (timer) {
            clearInterval(timer);
            timer = null;
          }
        });
      }, { threshold: 0.35 }).observe(fig);
    }
  }

  /* ---- year stamp ------------------------------------------------------ */

  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();
