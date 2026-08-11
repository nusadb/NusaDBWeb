/* Shared behaviour for the NusaDB site.
   No framework, no build step: every page loads this one file and only the
   pieces whose markup is present do anything. */

(function () {
  "use strict";

  /* ---- colour scheme -------------------------------------------------- */

  var KEY = "nusadb-theme";
  var root = document.documentElement;
  root.classList.add("js");

  try {
    var saved = localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  } catch (e) { /* storage blocked: fall back to the media query */ }

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
        ? '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/></svg>'
        : '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8Z"/></svg>';
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
      // textContent drops the syntax spans, so what lands on the clipboard is
      // what a shell or a session would accept.
      var text = pre.textContent.replace(/\s+$/, "");
      var done = function () {
        var label = btn.querySelector("em");
        btn.dataset.done = "1";
        if (label) label.textContent = "Copied";
        setTimeout(function () {
          btn.dataset.done = "";
          if (label) label.textContent = "Copy";
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else {
        fallback();
      }
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
    });
  });

  /* ---- overflow hint on code blocks ----------------------------------- */

  // Mark a sample that is wider than its box so the stylesheet can fade its
  // right edge. Re-measured on resize because the font size scales with the
  // viewport, so a block that overflowed at one width may not at another.
  var codes = document.querySelectorAll(".code");
  if (codes.length) {
    var measure = function () {
      codes.forEach(function (block) {
        var pre = block.querySelector("pre");
        if (!pre) return;
        block.classList.toggle("overflowing", pre.scrollWidth > pre.clientWidth + 2);
      });
    };
    measure();
    window.addEventListener("resize", measure);
    // Fonts land after first paint and change the measurement.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  }

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

      // Highlight the heading nearest the top of the viewport rather than
      // whichever one an observer fired for last, so fast scrolling settles on
      // the section actually being read.
      var links = tocBox.querySelectorAll("a");
      var spy = function () {
        var best = 0;
        for (var i = 0; i < heads.length; i++) {
          if (heads[i].getBoundingClientRect().top - 90 <= 0) best = i; else break;
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


  /* ---- year stamp ----------------------------------------------------- */

  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  /* ---- motion --------------------------------------------------------- */

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  // A slight shadow once the page has moved, so the sticky masthead reads as
  // sitting above the content instead of being welded to it.
  var mast = document.querySelector(".masthead");
  if (mast) {
    var shade = function () { mast.classList.toggle("scrolled", window.scrollY > 4); };
    window.addEventListener("scroll", shade, { passive: true });
    shade();
  }

  // Reveal on first approach only. Groups stagger by a few tens of milliseconds,
  // which reads as the group settling rather than as items animating one by one.
  var targets = document.querySelectorAll(
    ".hero-grid > *, .section-head, .cards > *, .split > *, .factlist, .prose > *"
  );
  if (!targets.length) return;

  if (reduced.matches || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("reveal", "in"); });
    return;
  }

  targets.forEach(function (el) { el.classList.add("reveal"); });

  var io = new IntersectionObserver(function (entries) {
    // Stagger within one batch, capped so a long list never waits noticeably.
    var shown = 0;
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.style.setProperty("--d", Math.min(shown, 5) * 55 + "ms");
      e.target.classList.add("in");
      io.unobserve(e.target);
      shown++;
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });

  targets.forEach(function (el) { io.observe(el); });

  // Anything already on screen at load should not wait for a scroll event.
  requestAnimationFrame(function () {
    targets.forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("in");
    });
  });

})();
