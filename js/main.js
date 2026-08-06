(function () {
  "use strict";

  var nav = document.getElementById("navbar");
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  var yearEl = document.getElementById("year");

  function onScroll() {
    if (window.scrollY > 10) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }

  function closeMenu() {
    toggle.classList.remove("open");
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  links.addEventListener("click", function (e) {
    if (e.target.closest("a")) {
      closeMenu();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var code = btn.closest(".code-wrap").querySelector("code");
      var text = code.innerText;

      function fallbackCopy() {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        var ok = false;
        try {
          ok = document.execCommand("copy");
        } catch (err) {
          ok = false;
        }
        document.body.removeChild(ta);
        return ok;
      }

      var done = false;
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(
          function () {
            done = true;
            showCopied(btn);
          },
          function () {
            if (fallbackCopy()) showCopied(btn);
          }
        );
      } else if (fallbackCopy()) {
        showCopied(btn);
      }

      function showCopied(el) {
        el.classList.add("copied");
        var old = el.textContent;
        el.textContent = "Copied!";
        setTimeout(function () {
          el.classList.remove("copied");
          el.textContent = old;
        }, 1800);
      }
    });
  });
})();
