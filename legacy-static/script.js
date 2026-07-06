/* MARQUE-S — interactions */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Menu mobile ---------- */
  var burger = document.getElementById("burger");
  var navLinks = document.getElementById("navLinks");
  if (burger && navLinks) {
    burger.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navLinks.classList.contains("is-open")) {
        navLinks.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
        burger.focus();
      }
    });
  }

  /* ---------- Reveal au scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReduced) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Parallaxe hero (transform only, rAF) ---------- */
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  if (parallaxEls.length && !prefersReduced) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          parallaxEls.forEach(function (el) {
            var f = parseFloat(el.getAttribute("data-parallax")) || 0.1;
            el.style.transform = "translate3d(0," + (y * f).toFixed(1) + "px,0)";
          });
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Compte à rebours — Drop 003 : 12.07.2026 10:00 Paris ---------- */
  var cdRoot = document.getElementById("countdown");
  if (cdRoot) {
    var target = new Date("2026-07-12T10:00:00+02:00").getTime();
    var fields = {
      d: cdRoot.querySelector('[data-cd="d"]'),
      h: cdRoot.querySelector('[data-cd="h"]'),
      m: cdRoot.querySelector('[data-cd="m"]'),
      s: cdRoot.querySelector('[data-cd="s"]')
    };
    var pad = function (n) { return String(n).padStart(2, "0"); };
    var tick = function () {
      var diff = target - Date.now();
      if (diff <= 0) {
        fields.d.textContent = fields.h.textContent = fields.m.textContent = fields.s.textContent = "00";
        cdRoot.previousElementSibling.textContent = "Le drop est LIVE.";
        return;
      }
      fields.d.textContent = pad(Math.floor(diff / 864e5));
      fields.h.textContent = pad(Math.floor(diff / 36e5) % 24);
      fields.m.textContent = pad(Math.floor(diff / 6e4) % 60);
      fields.s.textContent = pad(Math.floor(diff / 1e3) % 60);
      window.setTimeout(tick, 1000);
    };
    tick();
  }

  /* ---------- Newsletter : validation au blur + feedback ---------- */
  var form = document.getElementById("nlForm");
  if (form) {
    var email = document.getElementById("email");
    var errorMsg = document.getElementById("emailError");
    var success = document.getElementById("nlSuccess");
    var submitBtn = document.getElementById("nlSubmit");
    var field = email.closest(".field");
    var isValid = function () { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim()); };

    var setError = function (show) {
      field.classList.toggle("is-invalid", show);
      errorMsg.hidden = !show;
      email.setAttribute("aria-invalid", String(show));
    };

    email.addEventListener("blur", function () {
      if (email.value.trim() !== "") setError(!isValid());
    });
    email.addEventListener("input", function () {
      if (field.classList.contains("is-invalid") && isValid()) setError(false);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!isValid()) { setError(true); email.focus(); return; }
      setError(false);
      submitBtn.classList.add("is-loading");
      submitBtn.setAttribute("aria-disabled", "true");
      /* Simulation d'appel API — brancher un vrai endpoint ici */
      window.setTimeout(function () {
        submitBtn.classList.remove("is-loading");
        submitBtn.removeAttribute("aria-disabled");
        form.hidden = true;
        success.hidden = false;
      }, 900);
    });
  }
})();
