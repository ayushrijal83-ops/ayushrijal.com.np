(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Disabled-link guard ----------------
     aria-disabled alone doesn't stop keyboard Enter activation on <a>
     elements, so block the click itself regardless of input method. */
  document.addEventListener("click", function (e) {
    var disabledLink = e.target.closest('a[aria-disabled="true"]');
    if (disabledLink) {
      e.preventDefault();
    }
  });

  /* ---------------- Nav scroll state ---------------- */
  var nav = document.getElementById("site-nav");
  var toggleScrolled = function () {
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  toggleScrolled();
  window.addEventListener("scroll", toggleScrolled, { passive: true });

  /* ---------------- Mobile menu ---------------- */
  var navToggle = document.getElementById("nav-toggle");
  var mobileMenu = document.getElementById("mobile-menu");

  function closeMenu() {
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    mobileMenu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  function openMenu() {
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    mobileMenu.classList.add("is-open");
    document.body.classList.add("menu-open");
  }

  navToggle.addEventListener("click", function () {
    var isOpen = navToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) { closeMenu(); } else { openMenu(); }
  });

  mobileMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeMenu(); }
  });

  /* ---------------- Scroll reveal ---------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------- Resume availability check ---------------- */
  var resumeLinks = document.querySelectorAll(".resume-link, .nav-resume-link");
  fetch("/assets/resume.pdf", { method: "HEAD" })
    .then(function (res) {
      if (res.ok) {
        resumeLinks.forEach(function (link) {
          link.removeAttribute("aria-disabled");
        });
      }
    })
    .catch(function () {
      /* resume not available yet — links stay disabled */
    });
})();
