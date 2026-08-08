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

  /* ---------------- Theme system ---------------- */
  var root = document.documentElement;
  var themeToggle = document.getElementById("theme-toggle");
  var metaThemeColor = document.getElementById("meta-theme-color");
  var themeColors = { dark: "#050505", light: "#faf9f7" };
  var systemPref = window.matchMedia("(prefers-color-scheme: light)");

  function applyTheme(theme, persist) {
    root.setAttribute("data-theme", theme);
    if (themeToggle) {
      themeToggle.setAttribute("aria-label", theme === "light" ? "Switch to dark theme" : "Switch to light theme");
    }
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", themeColors[theme]);
    }
    if (persist) {
      try { localStorage.setItem("theme", theme); } catch (e) {}
    }
    document.dispatchEvent(new CustomEvent("themechange", { detail: { theme: theme } }));
  }

  applyTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark", false);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next, true);
    });
  }

  systemPref.addEventListener("change", function (e) {
    var hasExplicitChoice;
    try { hasExplicitChoice = !!localStorage.getItem("theme"); } catch (err) { hasExplicitChoice = false; }
    if (!hasExplicitChoice) {
      applyTheme(e.matches ? "light" : "dark", false);
    }
  });

  /* ---------------- Live GitHub projects ---------------- */
  (function () {
    var grid = document.getElementById("project-grid");
    if (!grid) return;

    var GH_USER = "ayushrijal83-ops";
    /* Repos hidden from the live feed: flagship (shown separately), the
       profile-readme repo, this portfolio itself, and anything off-brand
       for a professional cybersecurity/AI presence. Edit this list to
       change what shows up. */
    var EXCLUDE = ["YushaCyber", "ayushrijal83-ops", "ayushrijal.com.np", "A-Universe-For-You"];
    var CACHE_KEY = "gh-projects-cache-v1";
    var CACHE_TTL = 1000 * 60 * 60;

    function escapeHtml(str) {
      var div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    }

    function timeAgo(dateStr) {
      var diff = Date.now() - new Date(dateStr).getTime();
      var days = Math.floor(diff / 86400000);
      if (days < 1) return "today";
      if (days === 1) return "yesterday";
      if (days < 30) return days + "d ago";
      var months = Math.floor(days / 30);
      if (months < 12) return months + "mo ago";
      return Math.floor(months / 12) + "y ago";
    }

    function cardHtml(repo) {
      var desc = repo.description
        ? escapeHtml(repo.description)
        : "No description yet — check the repo for details.";
      var lang = repo.language;
      var stars = repo.stargazers_count;
      return (
        '<article class="project-card">' +
          "<h3>" + escapeHtml(repo.name) + "</h3>" +
          "<p>" + desc + "</p>" +
          '<div class="project-tags">' +
            (lang ? '<span class="tag">' + escapeHtml(lang) + "</span>" : "") +
            (stars > 0 ? '<span class="tag tag-star">★ ' + stars + "</span>" : "") +
          "</div>" +
          '<div class="project-links">' +
            '<a href="' + repo.html_url + '" class="project-link" target="_blank" rel="noopener noreferrer">GitHub ↗</a>' +
            '<span class="project-updated">Updated ' + timeAgo(repo.updated_at) + "</span>" +
          "</div>" +
        "</article>"
      );
    }

    function render(repos) {
      if (!repos.length) {
        grid.innerHTML = '<p class="project-empty">No public repos to show yet — check back soon.</p>';
      } else {
        grid.innerHTML = repos.map(cardHtml).join("");
      }
      grid.setAttribute("aria-busy", "false");
    }

    function renderError() {
      grid.innerHTML =
        '<p class="project-empty">Couldn’t load live projects right now — ' +
        '<a href="https://github.com/' + GH_USER + '" target="_blank" rel="noopener noreferrer">view them directly on GitHub</a>.</p>';
      grid.setAttribute("aria-busy", "false");
    }

    function processRepos(list) {
      return list
        .filter(function (r) { return !r.fork && EXCLUDE.indexOf(r.name) === -1; })
        .sort(function (a, b) { return new Date(b.updated_at) - new Date(a.updated_at); })
        .slice(0, 6);
    }

    function fromCache() {
      try {
        var raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        var parsed = JSON.parse(raw);
        if (Date.now() - parsed.time > CACHE_TTL) return null;
        return parsed.data;
      } catch (e) {
        return null;
      }
    }

    function toCache(data) {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), data: data }));
      } catch (e) {}
    }

    var cached = fromCache();
    if (cached) { render(cached); }

    fetch("https://api.github.com/users/" + GH_USER + "/repos?sort=updated&per_page=100", {
      headers: { Accept: "application/vnd.github+json" }
    })
      .then(function (res) {
        if (!res.ok) throw new Error("GitHub API error " + res.status);
        return res.json();
      })
      .then(function (data) {
        var repos = processRepos(data);
        toCache(repos);
        render(repos);
      })
      .catch(function () {
        if (!cached) { renderError(); }
      });
  })();

  /* ---------------- 3D pointer-tilt on cards (desktop only) ---------------- */
  (function () {
    var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduceMotion || !canHover) return;

    var selector = ".project-card, .tech-card, .about-facts, .featured-card";
    var current = null;

    function resetTilt(el) {
      el.style.transition = "transform 500ms cubic-bezier(0.16, 1, 0.3, 1)";
      el.style.transform = "";
    }

    document.addEventListener("mousemove", function (e) {
      var target = e.target.closest ? e.target.closest(selector) : null;
      if (!target) {
        if (current) { resetTilt(current); current = null; }
        return;
      }
      if (target !== current) {
        if (current) resetTilt(current);
        current = target;
        current.style.transition = "none";
      }
      var rect = target.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      var rotateY = px * 7;
      var rotateX = py * -7;
      target.style.transform =
        "perspective(900px) rotateX(" + rotateX.toFixed(2) + "deg) rotateY(" + rotateY.toFixed(2) +
        "deg) translateY(-4px) translateZ(6px)";
    }, { passive: true });

    document.addEventListener("mouseleave", function () {
      if (current) { resetTilt(current); current = null; }
    });
  })();
})();
