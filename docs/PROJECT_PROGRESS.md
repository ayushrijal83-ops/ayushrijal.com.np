# Ayush Rijal Portfolio V2 — Project Progress

**Central project state document.** Read this before every development session. Update it before stopping work.

| | |
|---|---|
| **Owner** | Ayush Rijal |
| **Architect / product lead / design review** | ChatGPT |
| **Implementation** | Senior Developer (Claude) |
| **Repository** | `ayushrijal83-ops/ayushrijal.com.np` |
| **Production URL** | https://ayushrijal.com.np |
| **Current milestone** | **M01 — Reconnaissance & Technical Assessment** |
| **M01 status** | Complete — awaiting architectural review |
| **Last updated** | 2026-08-20 |
| **Working branch** | `main` (clean, untouched — no production code modified in M01) |

---

## 1. Milestone log

| # | Milestone | Status | Notes |
|---|---|---|---|
| M01 | Reconnaissance & technical assessment | **Complete** | This document. No production code touched. |
| M02 | Architecture decision + Pretext prototype | Blocked | Needs architect sign-off on §9 open decisions |
| M03 | Design language & token system | Not started | |
| M04 | Home world (Pretext typography) | Not started | |
| M05+ | Remaining 7 section worlds | Not started | |

**M01 scope compliance:** no files deleted, no UI replaced, no dependencies installed, no Pretext implementation. The only addition to the repository is this document.

---

## 2. Exact current project state

The live site is a **hand-written static multi-page site with no build step**. It works. It has no toolchain of any kind.

```
ayushrijal.com.np/
├── CNAME                  ayushrijal.com.np          (apex domain, GitHub Pages)
├── .nojekyll              disables Jekyll processing
├── robots.txt, sitemap.xml
├── index.html             13.4 KB   Home
├── about.html             11.0 KB   About + tech stack
├── work.html              11.1 KB   YushaCyber feature + live GitHub grid
├── journey.html           10.3 KB   Timeline + "now"
├── blog.html               9.2 KB   Empty state only
├── contact.html           12.1 KB   Social links + resume band
├── css/style.css          34.3 KB   1364 lines — the entire design system
├── js/
│   ├── main.js            11.1 KB   Nav, theme, reveal, GitHub feed, card tilt
│   ├── hero-3d.js         11.7 KB   Home hero WebGL scene
│   ├── page-3d.js         10.0 KB   Subpage hero WebGL scene
│   └── bg-3d.js            8.4 KB   Full-page ambient WebGL scene
└── assets/
    ├── favicon.svg
    ├── resume.pdf         94 KB
    └── photos/
        ├── ayush-profile.jpg              1.6 MB   [!] unreferenced by any page
        └── optimized/                     480/720/960 x {jpg, webp}
```

**Absent entirely:** `package.json`, any lockfile, `.gitignore`, `README.md`, `docs/`, `.github/`, `tsconfig.json`, linter config, test suite, CI, environment files.

---

## 3. Existing architecture

**Rendering model.** Six independent hand-authored HTML documents. Full page load on every navigation. No templating, no partials, no includes — the `<head>` (47–66 lines), `<header class="site-nav">` and `<footer class="site-footer">` are physically copy-pasted into all six files. Footers are byte-identical across all pages; navs differ only by a correctly-placed `aria-current="page"`.

**Styling.** One 1364-line stylesheet. Genuinely well-organised: a semantic design-token layer (`:root` plus `:root[data-theme="light"]`) defining ~20 colour tokens, type, spacing, radii and easing, followed by 20 clearly-delimited component sections. The stated rule — *"All components must consume these semantic variables — never hardcode theme-specific colors"* — is actually followed. No preprocessor, no utility framework, no CSS-in-JS.

**JavaScript.** `main.js` is a classic (non-module) IIFE handling nav scroll state, mobile menu, scroll-reveal, theme system, the GitHub feed and pointer-tilt. The three 3D files are ES modules importing `three` through an **import map** pointing at `cdn.jsdelivr.net/npm/three@0.160.0`. No bundler, no transpilation, no dependency manifest — the import map *is* the dependency declaration.

**Theme system.** A blocking inline script in every `<head>` reads `localStorage.theme` (falling back to `prefers-color-scheme`) and stamps `data-theme` on `<html>` before first paint, correctly avoiding FOUC. Theme changes broadcast a `themechange` CustomEvent that all three WebGL scenes subscribe to and re-tint their materials against. This is a deliberate, well-executed piece of engineering.

**GitHub integration (existing).** `main.js` fetches `api.github.com/users/ayushrijal83-ops/repos` **unauthenticated from the browser**, filters forks and a hardcoded exclusion list (`YushaCyber`, the profile repo, this repo, `A-Universe-For-You`), sorts by `updated_at`, takes 6, and renders cards. Results are cached in `localStorage` with a 1-hour TTL; the cache renders first, then revalidates. It has real empty and error states. **No token is present anywhere in the codebase — no credential exposure.** Verified working live today.

**Deployment.** GitHub Pages serving the repository root of `main`. `CNAME` binds the apex domain; `.nojekyll` disables Jekyll. There is no Actions workflow — publication is a side effect of `git push`. Deploy time is seconds; rollback is `git revert`.

---

## 4. Existing stack

| Layer | Technology | Version | Delivery |
|---|---|---|---|
| Markup | Hand-written HTML5 | — | Static files |
| Styling | Plain CSS, custom properties | — | Single stylesheet |
| Scripting | ES2015+ JS, `var`-style, IIFE | — | 4 unbundled files |
| 3D | three.js | 0.160.0 | jsDelivr CDN via import map |
| Fonts | Inter, JetBrains Mono | — | Google Fonts (render-blocking) |
| Data | GitHub REST v3 | — | Client-side, unauthenticated |
| Hosting | GitHub Pages | — | `main` branch root |
| Build / test / lint / types / CI | **none** | — | — |

**Local toolchain available on the development machine (verified 2026-08-20):**

| Tool | Status |
|---|---|
| git 2.52.0 | present |
| Python 3.10 | present |
| **Node.js / npm / pnpm / bun / deno** | **NOT INSTALLED** |

This is the single most consequential finding of M01 — see §7 and §9.1.

---

## 5. What can be reused

Reuse is higher than the "generic AI portfolio" surface suggests. The *aesthetic* is wrong for V2; several *engineering patterns* underneath it are good and should be carried forward.

**Carry forward as-is**

- **Deployment setup** — CNAME, `.nojekyll`, apex domain, Pages configuration. Working; do not disturb.
- **Assets** — `resume.pdf`, `favicon.svg`, and the 480/720/960 `webp`+`jpg` responsive portrait set (already correctly generated with `srcset`/`sizes`/`fetchpriority`).
- **SEO scaffolding** — canonical URLs, Open Graph, Twitter card, JSON-LD `Person` (real, correct social profiles), `sitemap.xml`, `robots.txt`.

**Carry forward as patterns (re-implement, don't copy)**

- **Semantic token architecture** — the `:root` + `[data-theme]` structure and the "components consume semantic variables only" discipline. Keep the *architecture*; every *value* changes.
- **Accessibility scaffolding** — skip link, `aria-labelledby` on every section, `aria-current` nav state, `aria-expanded`/`aria-controls` mobile menu, Escape-to-close, `aria-live`/`aria-busy` on the async grid, a real `prefers-reduced-motion` block, and a click-guard that blocks keyboard activation of `aria-disabled` links (a subtlety most sites get wrong).
- **Scroll-reveal safety net** — reveals elements already in the viewport synchronously, observes the rest, and force-reveals everything after 1200 ms regardless. Content visibility never depends on GPU speed. Excellent defensive thinking; keep the principle in V2.
- **WebGL lifecycle discipline** — `IntersectionObserver` gating, `visibilitychange` pause, `webglcontextlost` handling, DPR clamping, frame-skip throttling, reduced-resolution ambient canvas, and skipping the ambient scene entirely under 560 px. Whatever canvas work V2 does, reuse this exact lifecycle contract.
- **GitHub feed logic** — exclusion list, TTL cache, cache-then-revalidate, `escapeHtml`, distinct empty vs. error states. The logic survives; the transport moves to build time (§8.3).

**Content requiring verification before reuse**

Copy on `about.html` (tech lists) and `journey.html` (2026 timeline, e.g. *"Built interactive cybersecurity labs"*) is unverified. Under the project's no-fabrication rule this must be confirmed with Ayush item-by-item before any of it enters V2. Tracked as open decision §9.4.

---

## 6. What should be replaced

**The entire visual layer.** V1 is, almost point for point, the aesthetic the brief rejects: a cyan `#00e5ff` accent, additively-blended glowing particle networks, wireframe icosahedrons, orbiting reactor rings, radial glow sprites, a scroll-parallax starfield, translucent cards, and pointer-tilt on every card class. All 1364 lines of CSS and all three WebGL scenes are replaced.

| Replace | With | Why |
|---|---|---|
| 1364-line stylesheet | V2 design system | Wrong aesthetic direction entirely |
| `hero-3d.js`, `page-3d.js`, `bg-3d.js` | Purpose-built motion per world | Decorative spectacle, no design purpose |
| Copy-pasted HTML boilerplate x6 | Component/layout system | Any nav change = 6 edits; guarantees drift |
| Client-side GitHub fetch | Build-time snapshot | Rate limits, latency, no richer data |
| Global pointer-tilt on all cards | Per-world interaction language | Same effect everywhere = no world identity |
| Dark/light toggle | Architect decision (§9.2) | An archive identity is usually one committed look |
| Inline `style="…"` visually-hidden | `.visually-hidden` utility | 3 occurrences; inconsistent |
| Blank `blog.html` | LEARNING world (content-driven) | Currently an empty state with no system behind it |

`hero-3d.js` and `page-3d.js` share **161 identical lines** across 330 and 274 lines respectively — roughly 59% duplication. Both are deleted, so this resolves itself.

---

## 7. Technical risks

**R1 — No Node.js on the development machine. SEVERITY: BLOCKING for M02.**
No Node, npm, pnpm, bun or deno is installed. Every modern option that delivers the brief's stated requirements — *type safety*, *clean component architecture*, *maintainability* — needs a JS toolchain. Pretext ships as an ESM-only npm package with a TypeScript peer dependency. **This must be resolved before M02 begins.** Two paths in §9.1.

**R2 — The brief's engineering requirements are unreachable without a build.**
"Type safety" and "clean component architecture" cannot be delivered by hand-written HTML files with copy-pasted headers. A zero-build V2 is possible, but it silently drops two named requirements. That trade must be an explicit architect decision, not a default.

**R3 — CDN supply-chain exposure. SEVERITY: HIGH.**
three.js loads from `cdn.jsdelivr.net` with **no Subresource Integrity hash** — import maps do not support SRI, so the mechanism used here structurally cannot be pinned. Google Fonts loads render-blocking from a second third-party origin, also without SRI. There is no Content-Security-Policy. A compromise of either CDN executes arbitrary code on the apex domain. V2 must self-host or vendor its dependencies.

**R4 — three.js is 58% of page weight.** Measured: 255 KB transferred of a 437 KB total page, on every page, for purely decorative geometry. Whatever V2's motion layer is, it should not begin by importing a general-purpose 3D engine.

**R5 — Pretext capability mismatch with the stated Home concept. SEVERITY: DESIGN-CRITICAL.** See §7.1.

**R6 — Unauthenticated client-side GitHub API.** Confirmed live: the endpoint allows 60 requests/hour **per IP**, shared across all visitors behind a NAT/corporate/mobile gateway. Measured 50/60 remaining after a handful of test loads. The 1-hour `localStorage` cache mitigates repeat visits only. Contribution/activity data (which the brief asks for) requires the GraphQL API, which **mandates a token** — impossible client-side without exposing it.

**R7 — No `.gitignore`. SEVERITY: HIGH once a build exists.** The moment a toolchain is introduced, `node_modules/`, `dist/`, `.env` and cache directories become committable by accident. Must be added *before* any dependency work.

**R8 — Zero automated verification.** No tests, no linting, no type checking, no CI, no performance budget. Every regression is found by a human looking at the site, or not at all.

**R9 — Repository weight.** A 1.6 MB original JPG is committed and shipped to every cloner but referenced by no page. Pack size is 2.40 MiB, most of it this file. History rewriting to remove it is possible but risky; recommend leaving history alone and deleting the working-tree copy.

**R10 — Six URLs are indexed and listed in the sitemap.** V2's IA (8 worlds) does not map 1:1 onto them. GitHub Pages cannot issue server-side 301s — redirects must be `<meta http-equiv="refresh">` plus canonical stubs. Plan this before renaming anything.

**R11 — No `og:image`.** Every link share of the site renders a bare text preview.

### 7.1 Pretext — investigation findings

Investigated directly: repository metadata, the npm registry entry, and the published `dist` bundle and type definitions read line by line. **Verified facts, 2026-08-20:**

| Property | Value |
|---|---|
| Package | `@chenglou/pretext` |
| Latest version | **0.0.8**, published 2026-06-12 |
| License | MIT |
| Runtime dependencies | **none** (peer: `typescript ^5`) |
| Module format | ESM only (`"type": "module"`) |
| Bundle size | 24 KB unminified, single file, served correctly from jsDelivr |
| Runtime requirements | Canvas 2D + `Intl.Segmenter` |
| Repository activity | 49,949 stars; last push 2026-06-23 |

**Public API** (from `layout.d.ts`): `prepare`, `prepareWithSegments`, `layout`, `layoutWithLines`, `layoutNextLine`, `layoutNextLineRange`, `materializeLineRange`, `walkLineRanges`, `measureLineStats`, `measureNaturalWidth`, `clearCache`, `setLocale`.

**What Pretext actually is.** A reflow-free **paragraph measurement and line-breaking engine**. It segments text with `Intl.Segmenter`, measures via canvas `measureText`, caches the widths, then answers "how does this text break at width W?" with pure arithmetic — no DOM reads, no layout thrash. `layout()` returns `{lineCount, height}`. `layoutWithLines()` returns `LayoutLine[]`, each `{text, width, start, end}`, where the cursors are `{segmentIndex, graphemeIndex}`.

**Two consequences the architect must weigh:**

1. **Pretext measures; it does not render.** There is no draw call in the library. We supply the renderer (Canvas 2D, SVG, or absolutely-positioned DOM). That is a feature for us — it is exactly the "manual line rendering" the brief asks for — but it means Pretext is roughly 20% of the Home page's work, not 80%.

2. **Pretext exposes line- and segment-level geometry, not per-glyph positions.** The brief's Home concept — *"AYUSH RIJAL becomes the central visual object, typography dynamically composes/recomposes"* — implies per-letter choreography. Pretext will not provide letter positions. It gives line boxes, line widths, the segment array, and grapheme-indexed cursors.

**Recommendation.** Do not force the wordmark onto Pretext. Split the Home page in two:

- **The wordmark** (`AYUSH RIJAL` composing/recomposing, with `SOFTWARE`/`AI`/`CYBERSECURITY` interacting with it) — a thin glyph-positioning layer of our own, on the order of 100 lines using canvas `measureText` per grapheme, or SVG `<tspan>`s. No library needed.
- **Pretext** — driving the genuinely dynamic multiline editorial typography around it: text blocks that recompose at arbitrary widths, justified/measured column layout, reflow-free response to viewport and scroll. This is the "living archive" text behaviour, and it is exactly what Pretext is built for.

This uses Pretext for a real problem rather than decoratively, which matches the brief's own instruction. **M02 must prove it in an isolated prototype before any of it touches the site.** Pin `0.0.8` exactly and vendor the 24 KB file into the repository — at pre-1.0 the API can move under us, and vendoring also closes risk R3 for this dependency.

**Browser support note:** `Intl.Segmenter` requires Chrome 87+, Safari 14.1+, **Firefox 125+** (shipped 2024). Confirmed present in the test browser. A no-Pretext fallback path (plain CSS-flowed text) is required for older engines — this is the brief's progressive-enhancement requirement applied literally.

---

## 8. Recommended V2 architecture

*Proposed. Requires architect approval before implementation — see §9.*

### 8.1 Framework — Astro (static output)

| Requirement from brief | How Astro satisfies it |
|---|---|
| Type safety | TypeScript first-class, no configuration |
| Clean component architecture | `.astro` components; nav/footer authored once |
| Minimal dependencies | Ships **zero JS by default** — the restrained editorial direction, enforced by the framework |
| Performance | Per-component islands: only Home loads Pretext, only worlds that need canvas load canvas |
| Progressive enhancement | Server-rendered HTML first; interactivity hydrates on top |
| Deployment | Static output drops into the existing GitHub Pages setup unchanged |
| Content system | Typed content collections — the LEARNING notebook, CYBERSECURITY write-ups and AI LAB entries become schema-validated Markdown, so *"actual future entries can be added"* becomes a real, typed workflow rather than hand-edited HTML |

Alternatives considered. **Next.js** — heavier, SSR-oriented, unnecessary for a static site. **Eleventy** — excellent and lighter, but weaker TypeScript and component story. **Vite + vanilla TS** — full control, but we rebuild routing, layouts and content pipelines by hand. **Stay zero-build** — the only option that works *today* with no Node install; forfeits type safety and components (§9.1 path B).

### 8.2 Design system

Self-hosted, subset, `woff2`, `font-display: swap`, preloaded — removing the Google Fonts origin entirely and closing half of R3. The token architecture carries over from V1; every value is replaced. The brief's *"different worlds, one design language"* is enforced structurally: **global tokens** (type scale, spacing, motion curves, base ink/paper) are shared and immutable across worlds; each world overrides only a small, explicitly-scoped set (accent, texture, grid behaviour, motion character). A world may not invent a new type scale.

### 8.3 GitHub integration — build-time, token never in the client

```
GitHub Actions (on push + scheduled cron)
   └─ fetch REST + GraphQL with secrets.GITHUB_TOKEN   <- server-side only
        └─ normalise -> typed JSON snapshot -> build input
             └─ static HTML with real data baked in -> Pages
```

- **Zero client-side credentials** — the token lives only in the Actions runner. Non-negotiable per the brief.
- **Zero visitor-facing rate limits** — solves R6 completely; 5000 req/hr authenticated at build time.
- **Unlocks the richer data** the brief asks for — languages, stars, forks, and contribution/activity via GraphQL `contributionsCollection`, which is *only* reachable with a token.
- **Fails safe** — a failed fetch falls back to the last committed snapshot; the site never ships an empty or broken projects section.
- Optional client-side revalidation can layer on top as progressive enhancement, never as the primary path.
- Featured/excluded repositories move from a hardcoded array in `main.js` into typed config.
- **No fabricated statistics under any circumstance** — if data is unavailable, the UI says so.

### 8.4 Motion and canvas

Drop three.js as a default dependency (R4). Most of the brief's visual direction — blueprint rule lines, registration marks, archive grids, plate transitions, editorial typography — is Canvas 2D, SVG and CSS work, not 3D. Introduce a 3D engine only if one specific world genuinely requires it, and then load it on that route alone. The V1 lifecycle contract (§5) applies to every canvas: viewport-gated, tab-visibility-paused, context-loss-handled, DPR-clamped, and honouring `prefers-reduced-motion` with a static composition as the fallback rather than merely a disabled animation.

### 8.5 Quality gates (CI, from day one of M02)

`.gitignore` (first commit, before any dependency work), `tsc --noEmit`, ESLint + Prettier, `astro check`, HTML validation, Lighthouse CI with performance and accessibility budgets, axe accessibility checks, and link checking. All wired into GitHub Actions and required before merge.

---

## 9. Open decisions — architect input required

**9.1 Toolchain. BLOCKING.**

- **Path A (recommended):** install Node 22 LTS, adopt Astro + TypeScript. Delivers every stated engineering requirement. Cost: a toolchain must be installed on the machine; a build step is added.
- **Path B (fallback):** stay zero-build. Vendored ESM plus import maps, hand-written HTML. Works today with zero installs. Cost: **forfeits type safety and component architecture** — two explicitly named requirements — and the copy-paste boilerplate problem persists and worsens across 8 worlds.

**9.2 Does the dark/light toggle survive into V2?** A "technical archive / blueprint / research notebook" identity is normally a single committed look. Supporting two themes across 8 distinct worlds roughly doubles design and QA cost. Recommend committing to one palette; the toggle is removed unless the architect wants it kept.

**9.3 Typography.** Inter + JetBrains Mono is the generic-portfolio default and should go. The editorial/archive direction needs a deliberate pairing — a text serif or a technical grotesque, plus a monospace for the archival/technical register. Needs an explicit type direction and a self-hosting weight budget from design.

**9.4 Content verification session with Ayush. BLOCKING for any copy work.** Timeline entries, tech lists and the cybersecurity section must be confirmed line by line before they enter V2. The brief forbids fabricated certifications, labs, CTF results or experience, and the existing V1 copy has not been verified against reality.

**9.5 Information architecture and URL scheme.** The brief names 8 worlds; the site has 5 content pages. Confirm the final section list, the URL for each, and the redirect map for the 6 currently-indexed URLs (R10).

**9.6 GitHub Actions budget.** Build-time GitHub integration (§8.3) needs a scheduled workflow. Confirm an acceptable rebuild cadence — recommend every 6 hours, plus on push.

**9.7 YushaCyber.** Its "Explore" CTA is currently a disabled `#`. Is a real destination expected during V2, or does it remain GitHub-only?

---

## 10. Recommended migration strategy

**Principle: V1 stays live and untouched until V2 is complete. No destructive rewrite at any point.**

1. **Protect the baseline** — tag the current `HEAD` as `v1-final`. `main` continues deploying V1 to production throughout.
2. **Add safety infrastructure to `main` first** — `.gitignore`, `README.md`, this document. Small, reviewable, non-visual commits.
3. **Open a long-lived `v2` branch.** All redesign work happens there. Production is never in a half-migrated state.
4. **Stand up a preview deployment** for `v2` (Cloudflare Pages or Netlify preview, or a second Pages target). The architect reviews every world on a real URL, not screenshots.
5. **Build world by world**, each as its own reviewable milestone: skeleton + design system, then Home (Pretext), then the remaining 7. Each world merges into `v2` only after design review.
6. **Migrate content deliberately**, only after §9.4 verification. Nothing carries over unread.
7. **Cut over once**, when all 8 worlds pass review: merge `v2` into `main`, switch Pages to build from Actions, and ship redirect stubs for the old URLs in the same commit.
8. **Rollback plan** — the `v1-final` tag remains; reverting is one command. Keep it until V2 has been stable in production for a week.

**Git discipline:** small scoped commits with real messages; no secrets, no `.env`, no `node_modules/`, no build artifacts, no large generated files.

---

## 11. Test, build and security status

**Build status: N/A — no build system exists.** Nothing to compile; `git push` publishes.

**Automated test status: none exist.** No test runner, no linting, no type checking, no CI. This is the largest process gap and is addressed in §8.5.

**Manual smoke test executed 2026-08-20** (Python `http.server` on port 8765, Chrome, 1512x786 viewport, DPR 1.5):

| Check | Result |
|---|---|
| All 6 routes + 9 assets return 200 | Pass — 15/15 |
| JavaScript console errors | Pass — none across 3 page loads |
| WebGL2 context | Pass — available; both canvases initialise |
| `Intl.Segmenter` (Pretext prerequisite) | Pass — present |
| Theme system, no-FOUC init | Pass — resolved to `light`, applied pre-paint |
| Scroll-reveal | Pass — 5/5 elements revealed |
| Resume link availability check | Pass — HEAD probe succeeds, link enables |
| **Live GitHub feed** | **Pass — 5 real repositories rendered, 0 skeletons left, cache written** |
| GitHub rate limit observed | **Warning — 50/60 remaining, confirms R6** |
| Images missing `alt` | Pass — 0 |
| Links without accessible name | Pass — 0 |
| Heading hierarchy (contact page) | Pass — single `h1`, ordered `h2`s |
| `lang` attribute | Pass — `en` |
| DOMContentLoaded / load | 572 ms / 600 ms (localhost, warm cache) |
| Total transfer, Home | 437 KB across 9 requests |
| — of which three.js | **255 KB (58%)** — see R4 |

*Not yet measured:* real-device frame rate (requestAnimationFrame is throttled in a background tab, so no number is reported rather than a fabricated one), Lighthouse scores, cold-cache field performance, cross-browser and mobile verification, and a screen-reader pass. Scheduled for M02.

**Security status.**

| Item | Status |
|---|---|
| Secrets / tokens / API keys in repository | **Clean** — full-tree search found none |
| `.env` files | None |
| GitHub API credentials in client code | None — unauthenticated public endpoints only |
| External links | All carry `rel="noopener noreferrer"` |
| Untrusted HTML injection | **Warning** — repo name, description and language are correctly escaped via `escapeHtml`; `repo.html_url` is interpolated **unescaped** into an `href`. The source is the GitHub API, so it is not currently exploitable, but the pattern is unsafe and must not survive into V2. |
| SRI on third-party scripts | **Absent**, and structurally impossible with import maps (R3) |
| Content-Security-Policy | **Absent** |
| `.gitignore` | **Absent** (R7) |

---

## 12. Known issues

| ID | Issue | Severity |
|---|---|---|
| K1 | No Node.js on the dev machine — blocks any build-based V2 | **Blocking** |
| K2 | No `.gitignore` — secret/artifact leak risk the moment a build lands | High |
| K3 | three.js via CDN, no SRI, no CSP, 58% of page weight | High |
| K4 | Client-side GitHub API, 60 req/hr/IP shared across visitors | Medium |
| K5 | HTML boilerplate copy-pasted x6; 161 duplicated lines between two 3D files | Medium |
| K6 | Unverified biography, timeline and skills copy | Medium |
| K7 | 1.6 MB unreferenced JPG committed and shipped | Low |
| K8 | No `og:image` — bare link previews | Low |
| K9 | `repo.html_url` interpolated unescaped into `href` | Low |
| K10 | Inline `style` used for visually-hidden headings (x3) | Low |
| K11 | Hero visual shows a visible canvas seam at ~1512 px wide viewports | Low — moot after redesign |
| K12 | `blog.html` is an empty state with no content system behind it | Low |
| K13 | `index.html` sets no `aria-current` for the home link | Trivial |

---

## 13. Relevant commands

```bash
# Serve locally (no Node required — Python is present on this machine)
python -m http.server 8765
# -> http://localhost:8765

# Smoke-test every route
for p in / /about.html /work.html /journey.html /blog.html /contact.html; do
  curl -s -o /dev/null -w "%{http_code} $p\n" "http://localhost:8765$p"
done

# Deploy (current V1 model — push publishes)
git push origin main

# Protect the V1 baseline before V2 work begins
git tag v1-final && git push origin v1-final
```

*No npm/pnpm commands exist yet. This section is updated the moment a toolchain is approved (§9.1).*

---

## 14. Next milestone — M02 recommendation

**M02 — Architecture decision plus isolated Pretext prototype.** Do not start the redesign. Do not touch V1.

**Gate:** M02 cannot begin until §9.1 (toolchain) and §9.5 (IA/URL scheme) are decided. §9.4 (content verification) blocks copy work but not the prototype.

Proposed M02 scope, in order:

1. **Resolve the toolchain decision** (§9.1). Everything downstream depends on it.
2. **Land safety infrastructure on `main`** — `.gitignore`, `README.md`. Tag `v1-final`. Small, non-visual commits.
3. **Build the Pretext prototype in isolation** — a standalone page on the `v2` branch, not wired into the site. It must answer concretely:
   - Can Pretext drive dynamic multiline recomposition at 60 fps under viewport, scroll and pointer input?
   - What does the custom glyph-positioning layer for the wordmark cost, in lines and in milliseconds (§7.1)?
   - Canvas, SVG or DOM for the renderer — decided by measurement, not preference.
   - What does the no-`Intl.Segmenter` fallback actually look like?
   - Is the v0.0.8 API stable enough to build on, and does vendoring it behave?
   - **Kill criterion:** if the prototype shows Pretext is not earning its place, we say so and use plain typography. The brief explicitly warns against using it because it is interesting.
4. **Produce the V2 design-language brief** — type direction, palette, grid, motion vocabulary, and the shared-vs-per-world token boundary (§8.2) — for design review before any world is built.
5. **Deliver a one-world vertical slice** (Home skeleton only, no styling commitment) proving the chosen framework, routing, content collections and the CI gates end to end.

**M02 exit criteria:** toolchain decided and installed; `.gitignore` and `v1-final` in place; a working Pretext prototype with a written go/no-go decision and measured numbers; an approved design-language brief; CI green on a vertical slice. **V1 still live and unmodified throughout.**

---

*End of M01. Awaiting architectural review.*
