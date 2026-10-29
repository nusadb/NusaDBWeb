/* Shared behaviour for the NusaDB site: theme toggle, menus, copy buttons and
   the on-page contents list. No framework and no build step. Every page works
   without this file; it only adds the controls that need a script. */

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
      // textContent drops the highlighting spans. Prompt markers (.p) are
      // removed so the clipboard holds only what a shell accepts.
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

      // Mark the last heading that has scrolled past the top of the window.
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

})();
