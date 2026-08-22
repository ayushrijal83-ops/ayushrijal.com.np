# Ayush Rijal Portfolio V2 — Project Progress

**Central project state document.** Read this before every development session. Update it before stopping work.

| | |
|---|---|
| **Owner** | Ayush Rijal |
| **Architect / product lead / design review** | ChatGPT |
| **Implementation** | Senior Developer (Claude) |
| **Repository** | `ayushrijal83-ops/ayushrijal.com.np` |
| **Production URL** | https://ayushrijal.com.np |
| **Current milestone** | **M04 — World System + About world** |
| **M04 status** | Complete — awaiting architectural review. See §1D. |
| **Last updated** | 2026-08-22 |
| **Working branch** | `v2` (all V2 work). `main` still serves V1 to production, unmodified. |

---

## 1. Milestone log

| # | Milestone | Status | Notes |
|---|---|---|---|
| M01 | Reconnaissance & technical assessment | **Complete** | §2–§10 below. No production code touched. |
| M02 | Foundation & Pretext prototype | **Complete** | §1A below. Awaiting review. |
| M03-B | Home world implementation | **Complete** | §1B below. Approved. |
| M03-B.1 | Home polish & Pretext decision | **Complete** | §1C below. Awaiting review. |
| M04 | World System + About world | **Complete** | §1D below. Awaiting review. |
| M05+ | Remaining six worlds, content collections, GitHub Actions integration, redirects, cutover | Not started | Each world is now a CSS entrance block plus a page. |

**M01 scope compliance:** no files deleted, no UI replaced, no dependencies installed, no Pretext implementation.

**M04 scope compliance:** the world system was extended (one contract change), and **only ABOUT was built**. Projects, AI Lab, Cybersecurity, Learning, GitHub and Contact are untouched M02 shells. No dependency was added. V1 remains byte-identical, `main` is unmodified, nothing is merged. See §1D.10.

**M03-B.1 scope compliance:** A polish pass on Home only. **M04 has not started** — no world beyond Home was built and no content collection was populated. `@chenglou/pretext` was removed from production; `astro` is now the only production dependency. V1 remains byte-identical, `main` is unmodified, nothing is merged. See §1C.

**M03-B scope compliance:** Home only. V1 remains byte-identical, `main` is unmodified, nothing is merged. No other world was implemented, no CDN or third-party runtime origin was added, and the CSP was not weakened. See §1B.11.

**M02 scope compliance:** V1 is untouched — every V1 file (`index.html`, `css/`, `js/`, `assets/`, `CNAME`) is byte-identical on this branch, `main` is unmodified, and nothing has been merged. No unverified content was migrated. No page beyond the eight approved routes was built. No animation library, WebGL scene or particle system was added.

---

## 1A. M02 — Foundation & Pretext prototype

### 1A.1 Toolchain (resolves §9.1, R1, K1)

Path A taken: Node installed, Astro + TypeScript adopted.

| Tool | Version |
|---|---|
| Node.js | **v24.19.0** (24.x LTS) |
| npm | 11.17.0 |
| Astro | **7.2.4** |
| TypeScript | **5.9.3** |
| `@astrojs/check` | 0.9.10 |
| `@types/node` | 24.10.1 |
| `@chenglou/pretext` | **0.0.8** (exact pin, no range) |

`@chenglou/pretext` has **no runtime dependencies**. Direct dependency count: 2 runtime, 3 dev. Every version is pinned exactly and `package-lock.json` is committed.

> **Superseded by §1C.1.** `@chenglou/pretext` was removed in M03-B.1. The current tree has **one** production dependency, `astro`. Everything in §1A and §1B below is the record as it stood at the time and is left unedited.

> **Note for the next session.** Node is installed at `C:\Program Files\nodejs` but is **not on the shell PATH** in either Git Bash or PowerShell. Prefix commands with `export PATH="/c/Program Files/nodejs:$PATH"`, or add it to PATH permanently.

### 1A.2 Architecture

```
src/
├── components/
│   ├── archive/ArchiveIndex.astro      shared holdings index + empty state
│   ├── home/{Wordmark,EditorialField}.astro
│   ├── nav/{SiteHeader,SiteFooter}.astro
│   └── transition/WorldGate.astro
├── layouts/{BaseLayout,WorldLayout}.astro
├── pages/                              8 world routes + /lab/*
├── content/{projects,labs,learning,experiments}/   empty by instruction
├── content.config.ts                   4 schemas
├── data/github.snapshot.json           committed fallback
├── lib/{worlds,github,site}.ts         typed registries, no I/O
├── scripts/                            client islands only
└── styles/{tokens,global,fonts,worlds,gate,home,lab}.css
```

The default is static rendering. Client JavaScript exists only where interaction requires it, and the build proves it: a content world ships **639 bytes** of JS — the gate's exit half, nothing else. Pretext loads on `/` and `/lab/pretext` and nowhere else.

### 1A.3 Build and CI result

| Check | Result |
|---|---|
| `astro build` | **Pass** — 11 pages in 0.83 s |
| `astro check` (33 files) | **Pass** — 0 errors, 0 warnings, 0 hints |
| `npm audit` | **Pass** — 0 vulnerabilities |
| CI output verification | **Pass** — 8/8 worlds present, both no-JS fallbacks intact |

CI (`.github/workflows/ci.yml`) runs on `v2` pushes and PRs and deploys nothing. Every step was also executed locally and passes.

Two expected build warnings: the glob loader reports that the four content collections are empty. That is the intended M02 state, not a defect.

### 1A.4 Bundle weight

| Asset | Raw | Gzip | Loaded on |
|---|---|---|---|
| Pretext chunk | 44.2 KB | **14.6 KB** | `/` and `/lab/pretext` only |
| Shared CSS | 10.9 KB | 3.0 KB | every page |
| World-gate script | 639 B | — | every page |
| Home HTML | 10.6 KB | 2.7 KB | — |

For comparison, V1 shipped **255 KB of three.js on every page** (R4). Nothing on this branch imports a 3D engine.

### 1A.5 Pretext prototype — measured result

Chrome, this machine, 200 width-queries per pass, 3 repetitions, medians reported. The DOM baseline writes a width and reads `offsetHeight`, which is what forces synchronous layout.

| Measurement | Result |
|---|---|
| `prepareWithSegments()` — one-time | **2.8 – 3.5 ms** |
| Width query, Pretext | **4 – 10 µs** |
| Width query, forced DOM reflow (in-flow element) | **103 – 192 µs** |
| **Ratio** | **16 – 26× faster** |
| **Break-even** | **19 – 34 queries** |
| Full re-layout including DOM writes, 7 → 21 lines | 100 – 700 µs |

An independent measurement outside the page's own rig gave 3.5 µs vs 102 µs — **29×**, break-even 53 queries — consistent with the above.

**Two numbers that were wrong before they were right,** recorded because they change the conclusion:

1. The first rig measured **1.8×**, which would have failed the kill criterion. It was probing an absolutely-positioned, `visibility: hidden` element. An out-of-flow element invalidates almost nothing, so reflowing it is nearly free. Moving the probe into normal flow moved the result from 1.8× to ~20×. The rig now keeps its probe in flow, and visible, on purpose.
2. A single benchmark shot varied between 3.4×, 104× and 20× across three consecutive runs, because JIT warm-up and `performance.now()` coarsening both bite hard at microsecond scale. The rig now takes medians.

**Verdict: PROCEED — but not for the reason the performance numbers suggest.**

A 20× speedup on an operation that costs 100 µs is not, by itself, worth a dependency. Home does not query text width thousands of times. The honest justification is **capability, not speed**: per-line variable width. The editorial text is set *around* the wordmark, each line's width supplied by the caller from the wordmark's measured geometry. CSS has no equivalent — `shape-outside` needs a float whose shape is known in advance and cannot take per-line widths from a sibling island — and the hand-rolled alternative costs a forced reflow per probe, which is where the 20× stops being academic.

If that composition is cut at design review, **Pretext should be cut with it.** Without variable-width flow, `text-wrap: pretty` plus a `max-inline-size` produces an equivalent result for free, and this document should then be read as recommending exactly that. The dependency is justified by one specific design decision and is not otherwise load-bearing.

### 1A.6 Custom wordmark prototype — measured result

| Measurement | Result |
|---|---|
| Graphemes | 11 |
| Full layout — one-time, per font load | **400 – 600 µs** |
| Natural width at 100 px reference | 462.7 px |
| **Kerning error if ignored** | **2.4 px at a 160 px display size** |
| Cost per resize | **zero measurement** — pure scale |

Engine size: 130 lines including comments. It is not a typography framework and must not become one.

The 2.4 px figure justifies the cumulative-prefix approach: on a display wordmark that is a visible loosening, and the fix costs about 22 `measureText` calls, once. It is a modest number honestly reported — an earlier version of this comparison claimed 26.4 px by failing to apply the same letter-spacing to both sides, which measured the tracking setting rather than kerning.

**Verdict: PROCEED.** Small, isolated, cheap, and it does the one thing Pretext structurally cannot.

### 1A.7 Performance and accessibility observations

**Performance.** Text measurement happens once per font load in both systems; resize is arithmetic. The pointer response is a compositor-only `translate3d` and never touches layout. No WebGL is used or assumed anywhere — the Home prototype has no 3D path to fall back from. Only the two above-the-fold faces are preloaded; preloading the whole family would compete with the HTML and make the wordmark arrive later, not sooner.

**Accessibility.**

- Both islands are progressive enhancements over complete static HTML. The real `<h1>` and the real paragraph are always in the DOM, are what assistive technology reads, and are hidden only *after* their replacement has actually rendered.
- Verified in the built output: `<h1 class="wordmark__fallback">` and the full editorial paragraph are present in `dist/index.html`. CI asserts both on every run.
- Glyph and line layers are `aria-hidden`; the wordmark contributes exactly one `<h1>` to the document.
- `prefers-reduced-motion` is honoured at the token source, and additionally suppresses the wordmark entrance, the glyph pointer response, the line stagger, and the gate's exit half.
- The gate is `aria-hidden` — every word it shows is already the page heading — and is `pointer-events: none` even while visible, so it never blocks interaction.
- The pointer response is skipped entirely on coarse pointers.
- Skip link, visible focus ring, `aria-current` on the active world, `forced-colors` handling for the hairline system, and a print path that drops the decorative grounds.

**Not yet measured**, deferred to M03 and deliberately not estimated: Lighthouse scores, real-device frame rate, cross-browser verification beyond Chrome, a screen-reader pass, and mobile testing. Animation timing could not be observed in the automation harness at all, because Chrome pauses CSS animations in a backgrounded tab.

### 1A.8 Defects found and fixed during M02

| # | Defect | Resolution |
|---|---|---|
| D1 | ResizeObserver oscillation could **hard-freeze the tab**: writing the stage height summons a scrollbar, which narrows the content box, which changes the layout, which removes the scrollbar. Reproduced twice. | Burst guard in the layout engine, plus `scrollbar-gutter: stable` so the oscillation is not created in the first place. |
| D2 | The field's first composition ran while its stage was `display: none`, measuring 0 wide, leaving the whole layout dependent on a ResizeObserver rescue. Produced one observed page load with zero lines rendered. | Reveal before composing; hide the fallback only once lines exist. |
| D3 | Benchmark understated Pretext by ~7× via an out-of-flow probe. | Probe moved into normal flow. |
| D4 | Kerning comparison measured letter-spacing rather than kerning. | Same tracking applied to both sides. |
| D5 | Wordmark entrance never resolved on touch devices — the settle handler sat inside a function that returns early on coarse pointers. | Handler moved to the mount path. |

### 1A.9 Open decisions for review

1. **Is the archive / drafting-paper direction approved?** Everything downstream depends on it. §9.2 (dark/light toggle) is currently answered "one committed look" — the system ships a single palette. §9.3 (typography) is currently answered "IBM Plex, self-hosted". Both remain proposals.
2. **Is the per-line variable-width Home composition approved?** This is the sole justification for keeping Pretext (§1A.5). A "no" here should remove the dependency.
3. **Is the gate copy right?** The eight gate lines in `lib/worlds.ts` are placeholders — the brief supplied them as conceptual examples. The *system* is the deliverable.
4. **§9.4 content verification session** remains blocking for all copy. Every content collection is empty until it happens.
5. **§9.5 redirect map** for the six currently-indexed V1 URLs (R10) — still unaddressed, still required before cutover.
6. **§9.6 rebuild cadence** and **§9.7 YushaCyber destination** — still open from M01.

### 1A.10 Deferred from M02, on purpose

- The gate's exit choreography is a working capability, not a tuned experience.
- Scroll-driven composition and the wordmark→navigation transition are not implemented. The brief asks that the typography be *capable* of them; committing to specific choreography before design review would be optimising a detail ahead of the direction.
- GitHub integration is architecture only, as instructed. No workflow, no fetch.
- `frame-ancestors` cannot be delivered on GitHub Pages — see `docs/SECURITY.md` §4.

### 1A.11 Commits on `v2`

| Hash | Commit |
|---|---|
| `f42314e` | docs: document V1 reconnaissance and V2 migration strategy |
| `4acef43` | build: establish Astro + TypeScript toolchain on a pinned dependency tree |
| `b34b591` | feat(design): add the archive design system and eight per-world grounds |
| `35c956e` | feat(architecture): add layouts, the eight-world registry, and content schemas |
| `2ead831` | feat(home): add the two cooperating typography systems and their prototypes |
| `420a897` | ci: verify types, build and no-JS fallbacks on the v2 branch |

### 1A.12 How to review this

```bash
export PATH="/c/Program Files/nodejs:$PATH"   # Node is not on PATH by default
npm ci
npm run verify        # astro check && astro build
npm run dev           # http://localhost:4321
```

| Route | What to look at |
|---|---|
| `/` | The Home prototype, both typography systems live. Resize the window. |
| `/lab/wordmark` | System A in isolation, with its metrics and its CSS fallback. |
| `/lab/pretext` | ~~System B in isolation.~~ Now a static experiment record — see §1C.1. The rig is at `8a5f95f`. |
| `/cybersecurity` vs `/learning` vs `/github` | Three grounds that differ structurally, not by colour. |
| `/about` | The deliberately blank record card. |

To check the no-JS path, disable JavaScript and reload `/`. The page must stay complete and readable.

---

## 1B. M03-B — Home world implementation

Home is built as a complete vertical slice: one world, its entrance, its
typography, its responsive redesign and its no-JS path. The other seven worlds
are deliberately untouched — they still render their M02 placeholder shells.

### 1B.1 The headline decision — Pretext is removed from Home

M02 selected Pretext for one specific job, and the M03-B brief scoped its
licence precisely: *"Pretext is justified ONLY by the variable-width multiline
typography composition… If the variable-width composition is removed during
implementation, REMOVE PRETEXT as a dependency."*

Instrumenting the live composition retired that justification:

```json
{ "lineCount": 3, "textBandBottom": 104.4, "blockHeight": 241,
  "linesBelowBlock": 0, "charCount": 84 }
```

84 characters set to three lines, occupying 104px inside a 241px masthead
block, with **zero lines falling below the block**. Every line is therefore
laid at the same width. A "variable-width" layout with exactly one width is not
a variable-width layout, and the whole case for the dependency rested on it.

What replaced it:

| Was doing | Now done by |
|---|---|
| Wrapping text around the masthead | `float: inline-start` + `display: flow-root` |
| Killing the `"work."` orphan | `text-wrap: balance` |
| Measuring the exclusion in JS | Nothing — the browser does it during layout |

The CSS version is better on the merits, not merely cheaper. The float works
with JavaScript disabled, where the Pretext field could not; it reflows during
layout rather than after it, so it cannot contribute to CLS; and `flow-root`
makes the hero reserve the masthead's real height, which fixed an overlap bug
the absolutely-positioned version had.

**Result on Home's payload:** ~15 KB gzip of Pretext → **2.7 KB gzip total**
(WorldLayout 486 B + index 122 B + motion 364 B + wordmark 1767 B).

Pretext, `EditorialField.astro` and `/lab/pretext` are all **retained**, moved
under `src/components/lab/`. They are the evidence behind this call and cost
Home nothing: the 15 KB is now reachable only from `/lab/pretext`. If the
architect disagrees with the reading, the composition can be restored from the
lab in one commit. If the architect agrees, deleting the dependency is a
one-line change to `package.json`.

### 1B.2 Content — structurally impossible to embellish

Every factual claim on Home resolves through `src/lib/profile.ts`, a single
frozen object holding the approved identity content verbatim. No component
contains a biographical string literal. The build asserts the philosophy
sentence survives into the shipped HTML (`scripts/verify-output.mjs`).

The five motivation statements are **stored but not rendered**. They are
about-page material, and Home is not the place to spend them.

Nothing was invented: no achievements, employers, degrees, certifications,
clients, awards, skills or experience beyond the approved list.

### 1B.3 The composition

| Band | What it is |
|---|---|
| Sheetmark | `AR-00 · GENERAL ARCHIVE` / `SHEET 1 OF 1` — the sheet identifies itself |
| Hero | The wordmark, the identity list, and the about statement flowed beside it |
| Fig. 01 — Method | The philosophy as a four-stage process diagram with a return path |
| Record | An engineering title block: status, current learning, subjects |
| Contents | The archive's table of contents, generated from `WORLDS` |

The philosophy is set as a **diagram**, not a slogan: four numbered stages
(01 BUILD → 02 EXPERIMENT → 03 BREAK → 04 LEARN) over a return rule reading
`RETURNS TO 01`, with the approved sentence beneath as a figure caption. It is
a cycle, which is what the sentence describes, and the drawing says so before
the sentence is read.

### 1B.4 The entrance

`OPENING ARCHIVE → DRAFTING TABLE → TYPOGRAPHY COMPOSES → NAME REVEALS →
INTERACTIVE`, staged from five tokens in `tokens.css`:

| Token | ms | Stage |
|---|---|---|
| `--enter-marks` | 160 | Registration marks find the four corners |
| `--enter-rules` | 300 | Rules are drawn (`scaleX`) |
| `--enter-type` | 440 | Glyphs are struck in reading order, 42ms apart |
| `--enter-body` | 620 | The standfirst and identity are set |
| `--enter-index` | 760 | The figure, record and contents are filed in |

No fade-and-scale-and-blur anywhere. The gate opens centre-out on a `clip-path`
like a sheet being registered onto a board.

**Fail-safe by inversion.** Every entrance animation uses
`animation-fill-mode: backwards`, so the *unanimated* state is the *finished*
state. Verified rather than asserted: with `animation: none !important` and
`transition: none !important` forced onto every element and pseudo-element,
all nine animated selectors report `opacity: 1`, no `transform`, no
`translate`, and `document.getAnimations()` reports zero running. A dropped
stylesheet, a paused tab or a reduced-motion preference cannot strand content
at `opacity: 0`.

### 1B.5 The transition architecture (built once, used once)

`Entrance` is a union of eight kinds in `worlds.ts`, one per world, selected
by `[data-gate-kind]` on a shared gate component. Only `register` — Home's —
is implemented. The other seven are declared and fall through to the base gate,
which is a complete entrance in its own right, not a stub.

Adding a world's entrance later is a CSS block keyed on its kind. It is not a
new component and not a new script. Per the brief, **no other world was built.**

### 1B.6 Responsive — three compositions, not one shrunk

`/lab/viewports` renders a route at all seven matrix sizes at once in
same-origin iframes, so media queries resolve against a real viewport. It
exists because Chrome will not resize a window below ~500px.

| Width | Wordmark | Method figure | About statement |
|---|---|---|---|
| ≥ 1280px | One line | Four across | Flowed beside the masthead |
| 768–1279px | One line | Two-up, two rows | Beneath, full measure |
| < 768px | Stacked `Ayush` / `Rijal` | Vertical numbered list | Beneath, full measure |

Measured at every matrix size — 1920×1080, 1440×900, 1366×768, 1024×768,
768×1024, 390×844, 375×812 — with **zero horizontal overflow** at all seven.

### 1B.7 Defects found and fixed during M03-B

1. **`"AR-00 · ARCHIVE AR-00"`** — the sheetmark prints `ref · gateTitle`, and
   `gateTitle` had been changed to include the ref. Reverted.
2. **Stranded leading middot** — the identity list wrapped mid-list. It is now
   a stacked grid at every width, with no `li + li::before` separator.
3. **Masthead overlapped the next section** — an absolutely-positioned hero
   block reserves no height. `float: inline-start` + `display: flow-root`.
4. **About statement pushed below the float** — a `max-inline-size: 30ch` box
   was narrower than the space beside the float, so no line box fit. Removed
   the cap in the wide band.
5. **Viewport harness iframes stayed blank.** The real cause was two layers
   deep: Astro inlines any client script bundling under 4 KB, and the CSP is
   `script-src 'self'`, which drops inline scripts **silently** — no build
   error, no console error, the page simply does nothing. The first fix
   attempt set `build.assetsInlineLimit`, which Astro ignores: its script
   plugin reads the limit from the resolved *Vite* config. Correct fix is
   `vite.build.assetsInlineLimit`. Weakening the CSP to `'unsafe-inline'`
   would also have "worked" and was rejected. `npm run verify` now asserts no
   inline script exists in any page, because the failure is invisible and easy
   to reintroduce.
6. **`"2026 ·github"` in the colophon** — Astro's `compressHTML` collapses a
   newline between text and an element to nothing. The separator is now the
   expression `{' · '}`, which cannot be collapsed.
7. **"EXPERIMENT" overlapped "BREAK" between 768px and 1279px.** Four grid
   tracks were narrower than the widest verb, and text overflows a grid track
   silently. Measured: the verb sets 5.63em wide and needs ~1230px of sheet
   before a quarter-width track holds it. Fixed with a two-up band, and
   `overflow-wrap: anywhere` as insurance so a wider fallback face breaks a
   word rather than overlapping a neighbour.
8. **Eighteen WCAG AA contrast failures.** `--ink-tertiary` measured 3.65:1 and
   `--ink-faint` 2.21:1 against `--paper` — both set by eye. They carry the
   figure glosses, the contents summaries, the title-block labels and the
   sheetmark, so a large share of the page's actual reading matter was below
   AA. Both were re-derived at constant hue and saturation to sit at 5.45:1 and
   4.62:1. Re-measured: 67 text elements, **zero failures, minimum 4.62:1**.

### 1B.8 Verification — what was measured

Run `npm run verify` (CI runs the identical command).

**Build:** `astro check` — 0 errors, 0 warnings, 0 hints across 40 files.
`astro build` — 12 pages. `scripts/verify-output.mjs` asserts, on the built
output: all eight worlds exist and carry their `data-world` id; Home retains
its no-JS `<h1>`, its standfirst and the verbatim philosophy string; no page
contains an inline script; no page loads a third-party origin.

**Performance** (Chrome, `astro preview`, Home):

| Metric | Value |
|---|---|
| Requests | 13, all same-origin |
| HTML | 17.6 KB decoded / 4.3 KB transferred |
| CSS | 2 files, 4.6 KB |
| JS | 4 modules, **2.7 KB gzip** |
| Fonts | 6 woff2, 106.7 KB, self-hosted |
| FCP | 120ms |
| DOMContentLoaded / load | 87ms / 114ms |
| **Cumulative Layout Shift** | **0** |

CLS of 0 is the number that matters here: the M02 D1 defect was a
ResizeObserver/scrollbar oscillation that froze the tab. It has not returned,
and the burst-signature guard plus `scrollbar-gutter: stable` remain in place.

LCP reports 968ms and is **animation-bound by design** — the LCP element is the
standfirst, which is scheduled at `--enter-body` (620ms) plus its duration.
Under `prefers-reduced-motion: reduce` those tokens are zero and LCP collapses
to roughly first paint. Flagged for the architect in §1B.10 rather than
silently tuned.

**Accessibility:** one `<h1>`, no skipped heading levels (h1 → h2 ×3),
`lang="en"`, header/nav/main/footer landmarks, no image without `alt`, no link
without an accessible name, nothing focusable inside `aria-hidden`. Sixteen
focus stops, every one with a visible 2px accent outline at a 2.67px offset and
`:focus-visible` true. Skip link present and reachable first. Contrast as
§1B.7.8.

**No-JS:** tested by serving the built HTML with every `<script>` stripped.
Home stays complete — the real `<h1>` sets at display size, the about
statement flows beside it through the float, and the figure, record and
contents are all present. The progressive-enhancement contract is that the
fallback heading is demoted to `visually-hidden` only *after* the island has
rendered; confirmed in the DOM (1×1 clipped, still the accessible heading).

**Browsers:** Chrome 1440×900 and at all seven matrix widths through the
harness — no console messages of any kind on Home. Firefox (Windows, current
release) — Home renders correctly: the wordmark island runs, the float
composition holds, the four-across method figure sets without collision.

### 1B.9 Not tested — stated rather than implied

- **Safari / WebKit** — unavailable on this machine. Not tested, not claimed.
- **`prefers-reduced-motion` under a live OS/browser preference.** The CSS is
  verified structurally (every entrance animation is declared *inside*
  `@media (prefers-reduced-motion: no-preference)`, so under `reduce` it is
  never declared at all; the remaining tokens are zeroed) and the fail-safe
  inversion is verified empirically as in §1B.4. But the media query was never
  observed matching: Chrome's emulation is not reachable through the tooling
  here, Firefox's headless screenshot pipeline fails on this machine, and
  changing the Windows animation setting is a system-settings change I did not
  make. **A human should load Home once with the OS animation setting off.**
- **Real hardware.** All figures are from a desktop Chrome on localhost. No
  phone, no throttled network.

### 1B.10 Open decisions for review

1. ~~**Delete Pretext, or restore the composition?**~~ **RESOLVED** — the
   architect chose removal. Carried out in M03-B.1; see §1C.1.
2. **The phone masthead occupies the first screen.** At 390×844 the stacked
   wordmark plus identity runs 774px, so the about statement begins at 757px —
   below the fold. It is a deliberate poster composition and it is striking,
   but a visitor's first screen holds only a name. Capping it is a design
   decision, not a bug fix, so it was left alone and measured instead.
3. **The stacked wordmark sets its two lines at different sizes** (129px
   `Ayush`, 177px `Rijal` at 390px) because each line is fitted to the full
   measure independently. This is the documented justified-masthead device and
   it reads as intentional — confirming that reading is an architect's call.
4. **The no-JS wordmark is uppercase; the enhanced one is mixed case.** The
   fallback is styled to be a finished thing rather than an apology, and
   uppercase is what works at that size without measured kerning. Two visitors
   can therefore see two different — both correct — mastheads.
5. **LCP is animation-bound at ~968ms.** §1B.8. Reducing `--enter-body` would
   trade entrance choreography for the metric.
6. **IBM Plex is still a prototype selection**, per the M03-B brief. The
   two-layer FACE → ROLE token split and the `[data-type-set]` audition harness
   are in place so a serif or mono display face can be compared without
   touching a component.

### 1B.11 Scope compliance

V1 is untouched and byte-identical; `main` is unmodified; nothing is merged.
No world beyond Home was implemented. No third-party runtime origin, no CDN,
no WebGL, no animation library, no client-side GitHub API call, no secret and
no credential were introduced. The CSP was not weakened — it caused real
debugging cost during this milestone and was upheld anyway. Dependencies are
still exactly pinned with a committed lockfile.

### 1B.12 How to review this

```bash
export PATH="/c/Program Files/nodejs:$PATH"   # Node is not on PATH by default
npm ci
npm run verify        # astro check && astro build && verify-output.mjs
npm run preview       # http://localhost:4321
```

| Route | What to look at |
|---|---|
| `/` | Home. Reload to watch the entrance. Resize across 1280px and 768px. |
| `/lab/viewports` | All seven matrix viewports at once. `?route=/about` to review another page. |
| `/lab/wordmark` | The wordmark island in isolation, with its metrics and its CSS fallback. |
| `/lab/pretext` | The experiment record. Static as of §1C.1 — the executable rig is at `8a5f95f`. |

---

## 1C. M03-B.1 — Home polish & the Pretext decision

A refinement pass, not a feature pass. Home did not get bigger; it got more
precise, more readable, more responsive and faster. **M04 has not started.** No
world other than Home was touched.

### 1C.1 Pretext — removed from production

**Decision: removed.** The package is gone from `package.json` and the
lockfile.

> Pretext was evaluated against the actual Home composition. The live
> composition did not require variable-width line widths, so the approved
> load-bearing justification was not present. Native CSS provided the required
> layout. Pretext was therefore removed from production rather than retained as
> an unnecessary dependency. The experiment is retained temporarily as
> evidence.

The measurement behind it (§1B.1): 84 characters → 3 lines → 104px of content
inside a 241px block, **every line at the same effective width**. What replaced
it is `display: flow-root` plus `float: inline-start`, with `text-wrap: balance`
for the rag — no runtime dependency, no JavaScript, no CLS contribution, no
per-probe measurement, nothing to maintain.

**What was deleted:** `src/scripts/lab-pretext.ts`,
`src/scripts/editorial-field.ts`, `src/components/lab/EditorialField.astro`,
and the `@chenglou/pretext` dependency.

**What `/lab/pretext` is now.** The brief asked for the page to be kept "if it
remains technically isolated". It is kept — as a **record** rather than a rig,
which is the only arrangement that satisfies both halves of the instruction. A
page that still ran the benchmark would need the package installed and would
ship its 44.8 KB into `dist/` on every deploy, which is the dependency
remaining in production wearing a lab coat. Evidence does not need a runtime;
it needs to be written down, and every figure on the page was measured before
it was written. The page is stamped **EXPERIMENT RECORD · NOT PRODUCTION**,
stays `noindex` and unlinked, and prints the commands to restore the executable
rig from `8a5f95f`.

**What stops it coming back.** `scripts/verify-output.mjs` asserts the outcome
rather than the intention: the package appears in neither dependency field, and
no shipped `.js`/`.css` contains its code. The realistic regression was never
someone re-adding it deliberately — it was a lab-page import quietly pulling it
back into `dist/` where nobody looks.

**Effect on the bundle:**

| | Before | After |
|---|---|---|
| Home JavaScript | 2.7 KB gzip | **2.7 KB gzip** (unchanged — Home never shipped it) |
| Site-wide JavaScript | 6.2 KB + 15.0 KB Pretext chunk | **3.6 KB gzip total** |
| Production dependencies | `astro`, `@chenglou/pretext` | **`astro`** |

### 1C.2 Mobile masthead — 92% → 65%

The masthead ran 774px of an 844px viewport. Recomposed, not scaled:

| Viewport | Hero | % of first screen |
|---|---|---|
| 1920 × 1080 | 571px | 52.9% |
| 1440 × 900 | 562px | 62.4% |
| 1366 × 768 | 551px | 71.7% |
| 1024 × 768 | 498px | 64.8% |
| 768 × 1024 | 694px | 67.8% |
| **390 × 844** | **550px** | **65.2%** |
| **375 × 812** | **601px** | **74.0%** |

Three changes, in order of what they returned:

1. **The name sets on one line at every width.** The stacked `Ayush` / `Rijal`
   arrangement was the whole problem: two lines each fitted to the full measure
   cost ~400px on a phone *whatever type size you pick*, because the height
   follows from the width. One line at the same measure is ~94px, still
   full-bleed, and returns 300px. The stacking capability stays in the
   component; Home no longer passes `stack`.
2. **The philosophy moved into the hero as a strapline.** It had been the
   caption under Fig. 01, two screens down — the one sentence saying how this
   person works, invisible on the screen where it mattered. Fig. 01 draws the
   same idea as a cycle and no longer repeats the words. The sentence is on the
   page **exactly once**, asserted by the build.
3. **The phone gets its own vertical rhythm:** tighter masthead gaps, tighter
   hero padding, and the about statement one type step down — worth 50px at
   375px, where the larger size bought an extra line and nothing else.

**First-screen contents, verified at all seven viewports:** the name, both
identity lines, the Cybersecurity Learner line, the philosophy, the about
statement, and the next section's label visible beneath them. That label is the
"more below" indicator: it is content rather than a decorative cue, and it
cannot lie about whether there is anything there.

**Zero horizontal overflow at all seven sizes.**

### 1C.3 Wordmark — the two states are one wordmark

The no-JS fallback was `text-transform: uppercase` while the island set mixed
case, so the two states were two different logos: `AYUSH RIJAL` without
JavaScript, `Ayush Rijal` with it. The case now matches, and the only remaining
difference is what the island actually adds — measured per-glyph positions and
real kerning. The enhanced state reads as the static wordmark set more
precisely, which is what it is.

Unchanged and re-verified: the accessible `<h1>` is always in the DOM, the
fallback is demoted to `visually-hidden` only after the island renders,
keyboard access is unaffected (the wordmark is not focusable), and the whole
thing is inert under reduced motion.

### 1C.4 LCP — content no longer waits for the entrance

**Cause.** The standfirst was the LCP element and was held at `opacity: 0`
until `--enter-body`. A browser cannot report an element as painted while it is
transparent, so the animation was not decorating the content — it was deciding
when the content was allowed to exist.

**Fix.** The entrance is now built out of **movement and drawing, not fading**.
Every content stage starts fully opaque and slightly out of position; the
browser paints finished text on the first frame and the choreography settles it
afterwards. That is truer to the concept as well: a typebar striking a platen
and a rule drawn across a sheet are both movements — nothing in a drafting room
fades in. Glyph travel went from 0.14em to 0.24em so the settle reads without a
fade carrying it.

`opacity` survives on exactly two things, both furniture: the registration
marks and the gate plate. The gate's opaque hold dropped from 40% of its
duration to 15%, and the stage delays were roughly halved — with nothing fading
in, a long wait no longer builds anticipation, it just leaves text sitting
fractionally out of place. Everything now finishes inside ~700ms.

**Result.**

| | M03-B | M03-B.1 |
|---|---|---|
| LCP − FCP | 848ms | **0ms** (3 loads) |
| LCP element | `.standfirst` | `.standfirst` |
| Content opaque at load event | no | **yes, all of it** |
| CLS | 0 | **0** |

The second row is the measurement that matters and the one that is free of
harness artifacts: sampling every content element at the load event returns
`opacity: 1, visibility: visible` for the heading, identity, strapline,
standfirst, method stages, title block and contents rows.

The rule is written down as an **entrance policy** at the top of `home.css`,
because the failure it prevents is silent: an `opacity: 0` added to a keyframe
looks harmless in review and costs a second of LCP.

**Absolute FCP/LCP figures are not reported.** The automation tab loads
backgrounded, and Chrome defers first paint in hidden tabs — every run put FCP
in the 3–12s range, tracking the moment the tab became visible rather than
anything about the page. `LCP − FCP` is immune to that offset because both
marks sit on the same clock behind the same visibility gate, which is why it is
the figure quoted.

### 1C.5 Reduced motion — TESTED

**Tested, not merely verified structurally.** M03-B could not run this test;
M03-B.1 could, using headless Chrome's `--force-prefers-reduced-motion`.

The switch was confirmed to actually reach CSS before trusting it: a JS-free
probe page whose `content` differs per branch rendered `REDUCE` under the flag
and `no-preference` in a control profile with the same binary.

Home was then rendered under the flag at **all seven matrix viewports**, using
the `/lab/viewports` harness so the phone frames are real 390px and 375px
viewports rather than a clamped window. Results:

- No entrance movement, and no gate plate.
- No delayed content — everything present at first paint.
- No infinite or decorative animation running.
- Hierarchy intact: masthead, sheetmark, name, identity, strapline, about
  statement, Fig. 01, Record, Contents, all in order and all legible.
- Immediately understandable at every size.

This works because nearly every entrance animation is declared *inside*
`@media (prefers-reduced-motion: no-preference)` — under `reduce` it is never
declared at all — and the handful that are not have their duration and delay
tokens zeroed at the token source.

**Harness note worth keeping:** a first attempt rendered Home directly at
`--window-size=390` and produced a clipped page that looked like a real
overflow bug. It was not. Headless Chrome clamps its window to ~512px, so the
page laid out at 512 and was captured at 390. A width probe confirmed
`innerWidth=512`. This is the same clamp that made `/lab/viewports` necessary
in the first place, and it will fool the next person too.

### 1C.6 Accessibility — no regression

Re-run against the M03-B baseline:

| Check | M03-B | M03-B.1 |
|---|---|---|
| Text elements checked | 67 | 67 |
| Contrast failures | 0 | **0** |
| Minimum contrast | 4.62:1 | **4.62:1** |
| Focus stops | 16 | **16** |
| All `:focus-visible` with a visible outline | yes | **yes** (2px solid accent) |
| `<h1>` count / skipped heading levels | 1 / none | 1 / none |
| Landmarks, skip link, `lang` | present | present |
| Images without `alt`, links without a name | 0 / 0 | 0 / 0 |
| Focusable inside `aria-hidden` | 0 | **0** |
| Philosophy sentence occurrences | 1 | **1** |

Nothing is conveyed by animation alone: the entrance now only moves content
that is already painted and already readable, which strengthens this rather
than weakening it.

**Method note:** synthetic Tab keypresses did not reach the page in this
session because the automation window was not OS-focused, so the tab order was
walked programmatically with `focus({ focusVisible: true })` and each stop's
computed outline read. The order returned matches DOM order exactly — skip link
→ seven masthead links → seven contents rows → footer link.

### 1C.7 Performance — no replacement complexity

| Metric | M03-B | M03-B.1 |
|---|---|---|
| Requests | 13 | **13** |
| HTML | 17.6 KB decoded / 4.3 KB transferred | 18.3 KB / 4.4 KB |
| Home JavaScript | 2.7 KB gzip | **2.7 KB gzip** |
| Site-wide JavaScript | 6.2 KB + a 15.0 KB Pretext chunk | **3.6 KB gzip** |
| Production dependencies | 2 | **1** |
| CLS | 0 | **0** |
| LCP − FCP | 848ms | **0ms** |
| TTFB / DCL / load | — | 40ms / 141ms / 147ms |
| Console messages on Home | 0 | **0** |

The HTML grew 0.7 KB: the strapline moved into the hero and Fig. 01's caption
was removed, netting slightly more markup in the head of the document. Removing
Pretext introduced no replacement code at all — the deletion was three modules
and a dependency, and nothing was written to stand in for them.

### 1C.8 Build / CI

All run, none claimed without running:

| Command | Result |
|---|---|
| `npm ci` | 272 packages, clean install from the lockfile |
| `astro check` | **0 errors, 0 warnings, 0 hints** |
| `astro build` | 12 pages |
| `node scripts/verify-output.mjs` | 8 worlds, no-JS fallbacks intact, no inline scripts, no third-party origins, **no Pretext** |
| `npm audit --audit-level=high` | **0 vulnerabilities** |

CI runs `npm run verify`, which is the same three-step command, so the CI
checks and the local checks cannot drift.

### 1C.9 Browser testing

- **Chrome** — Home at 1440×900 and at all seven matrix widths through the
  harness. No console messages of any kind. Reduced motion at all seven
  viewports via headless Chrome with the forcing switch.
- **Firefox** (Windows, current release) — Home renders correctly: the wordmark
  island runs and sets mixed case, the float composition holds, the drafting
  ground and identity list are correct. Verified visually at the top of the
  page.
- **Safari / WebKit** — unavailable on this machine. **Not tested, not
  claimed.**

### 1C.10 Known limitations

1. **Safari/WebKit untested.** No macOS or iOS device available here.
2. **Absolute FCP/LCP unmeasured** (§1C.4). The relative figure is sound; the
   absolute one needs a foreground browser or a lab tool.
3. **Firefox coverage is partial** — the top of Home was confirmed visually;
   the strapline and lower bands were not. Firefox's headless screenshot
   pipeline fails on this machine with a software-compositor error, and
   region-capturing the window proved unreliable. Nothing in the changed CSS is
   Firefox-risky (`text-wrap: balance` degrades to normal wrapping if
   unsupported), but it is not the same as having looked.
4. **No real hardware or throttled network.** Every figure is desktop Chrome on
   localhost.
5. **`/lab/pretext` is a record, not a rig** (§1C.1). Re-running the benchmark
   means restoring four files and reinstalling the package.
6. **1920 × 1080 sits at 52.9%**, below the 60% floor. The floor was set for
   phones; on a 1080px-tall desktop a hero that stopped lower would be a worse
   composition, not a better one.

### 1C.11 Current project state

Home is complete as a vertical slice. The other seven worlds still render their
M02 placeholder shells and their entrances are declared but unimplemented.
*(Superseded by §1D: ABOUT is now built, leaving six placeholder shells.)* V1
is untouched and byte-identical, `main` is unmodified, nothing is merged. One
production dependency: `astro`.

### 1C.12 Commits

| Hash | Commit |
|---|---|
| `61cf170` | build: remove pretext from production |
| `0a42e0b` | fix(home): rebalance the mobile masthead so it opens the page |
| `eee2801` | perf(home): decouple content visibility from the entrance animation |

The masthead commit also carries the `home.css` half of the entrance change;
the two edits interleave in one file and separating them would have cost more
clarity than it bought.

### 1C.13 Next milestone

*Superseded — M04 is complete. See §1D.*

**M04 had not started at the time of writing.** Nothing in About, Projects,
AI Lab, Cybersecurity, Learning, GitHub or Contact was built, and no content
collection was populated. M03-B.1 stopped here for architect review. The open items carried forward are
§1C.10 and the typography question in §1B.10.6 — IBM Plex is still a prototype
selection, and the FACE → ROLE token split plus the `[data-type-set]` audition
harness remain in place so a serif or mono display face can be compared without
touching a component.

---

## 1D. M04 — World System + About world

**Status:** Complete — awaiting architectural review.
**Scope:** two objectives only. Build the reusable world-system architecture,
and implement ONLY the ABOUT world on it. No other world was touched.

### 1D.0 Starting position — the system already half existed

M02 and M03-B built most of what the M04 brief asks for as objective 1, so
this milestone extended it rather than rebuilding it. What was already in
place before any M04 commit:

| Piece | Where | State at M04 start |
|---|---|---|
| World registry (identity, route, nav label, metadata, ground, entrance, ref) | `lib/worlds.ts` | Complete, 8 worlds |
| World layout (gate, header, masthead, colophon, surface opt-in) | `layouts/WorldLayout.astro` | Complete |
| Shared gate component | `components/transition/WorldGate.astro` | Complete |
| Per-kind entrance mechanism (`[data-gate-kind]`) | `styles/gate.css` | Mechanism complete, 1 of 8 kinds implemented |
| Exit half of the transition | `scripts/world-gate.ts` | Complete |
| Per-world ground geometry | `styles/worlds.css` | 8 grounds |
| Shared a11y / SEO / CSP / reduced-motion / responsive foundations | `BaseLayout`, `tokens.css`, `global.css` | Complete |

So M04 did **not** create a second world system. It found one gap, closed it,
and used the result to build ABOUT. Per the brief's instruction not to rewrite
working systems without a reason, nothing above was re-architected.

### 1D.1 The one architectural change — the MATERIAL slot

`tokens.css` stated a contract: a world may override exactly four variables,
and *the paper is immutable*. A fifth was explicitly declared an architecture
decision rather than a styling decision. Building ABOUT forced that decision.

**The problem.** With the stock fixed for all eight worlds, a world can differ
only in the geometry of its hairline ruling. Two worlds built that way read as
the same page with a different pattern behind it. The brief's own failure
criterion — *"if the difference is only a different background colour: FAIL"* —
has an inverse that is just as true: if every world is printed on the same
stock, geometry alone will not carry them apart.

**The decision.** A world may now also choose its STOCK: the four `--paper-*`
tones. The ink stays immutable. Two reasons, and the second is the one that
matters: the ink is what makes eight worlds one archive, and **the ink ramp's
floor IS the WCAG AA threshold**, derived against `--paper` (14.08 / 7.12 /
5.45 / 4.62). A world that darkens its stock drops four text colours below
4.5:1 simultaneously.

**The constraint, enforced not remembered.** A world's stock must be at least
as light as `#ece7dc`. `scripts/verify-output.mjs` now parses every `--paper`
declared in `worlds.css`, measures it against every step of the ramp using
WCAG relative luminance, and fails the build below 4.5:1. It reads the source
tokens rather than the built CSS, so it fails whether or not the offending
world has a page yet. No dependency was added.

That is the whole extension. The registry gained no new field, no new
component was created, and no abstraction layer was introduced.

### 1D.2 What was deliberately NOT added

The brief lists `transition duration` and `accessibility label` as things a
world config might carry. Neither became a field, on purpose:

- **Duration** lives in the kind's CSS block, off the shared clock in
  `tokens.css` (`--dur-base` / `--dur-slow` / `--dur-plate`). A number in
  TypeScript that only CSS ever reads is a second place to look for one fact,
  and the reduced-motion block already zeroes that clock at its source. Timing
  is part of choreography, so it lives with the choreography.
- **Accessibility label** is already served by `nav` and `world`, both of which
  the header and colophon consume. A third string would have been a synonym.

Also not built: seven placeholder entrance implementations. The six remaining
kinds are declared in `Entrance` and inherit the base gate, which is a
complete fail-safe entrance rather than a stub — exactly the placeholder
configuration the brief asks for.

### 1D.3 The ABOUT world — how it differs from HOME

The review question is whether ABOUT actually *feels* different. It is
answered on four axes, none of which is background colour:

| | HOME | ABOUT |
|---|---|---|
| **Material** | A sheet registered onto a dark drafting table (`surface` plate). An object you look at. | The card itself, filling the frame. No plate, no table. A record you are holding. |
| **Stock** | `#ece7dc` drafting grey-beige | `#f0ece1` warm manila |
| **Ground** | Blueprint module, 4rem, both axes | Catalogue-card ruling, 2rem, horizontal only |
| **Accent** | `--spot` #9c3016, correction red | #5c4630, archival brown — the first accent that carries text as well as linework |
| **Display type** | The name STAMPED: Plex Sans Condensed 700, uppercase, measured per-glyph kerning | The name TYPED: Plex Serif 400, mixed case, `--step-5` |
| **Structure** | Announced by large uppercase display headings | Announced by small tracked mono labels in a left margin |
| **Layout grammar** | Centred composition, full-width rules | Asymmetric editorial margin; reads down the label column |
| **Motion** | Striking — a typebar hitting a platen, glyphs 42ms apart | Settling — cards dropped into a drawer |
| **Entrance** | `register`, opens centre-out | `drawer`, front travels down and out |

Shared, unchanged: the layout, the header, the colophon, the gate component,
the ink ramp, the type scale, the spacing scale, the motion curves, the CSP,
the skip link, the focus ring, the reduced-motion policy, the entrance policy.

**No new font dependency.** ABOUT's typographic identity is a change of
*role assignment*, not of family: it sets its subject record in `--font-text`
(Plex Serif, already self-hosted and already preloaded elsewhere) instead of
`--font-display`. Zero additional bytes.

### 1D.4 The drawer transition

`drawer` is the second entrance built on the M03 per-kind mechanism, which is
what proves that mechanism extends. It is a CSS block in `gate.css` keyed on
`[data-gate-kind='drawer']` — no new component, no new script, no change to
`world-gate.ts`.

The gate plate *is* the drawer front. It travels down and out of frame while
the record is uncovered from the top edge downward, which is what you see when
a filing drawer is pulled toward you. Two marks make it read as a mechanism
rather than as a wipe: a rail in the world accent along its leading edge, so
the panel has a visible front; and a `translate` alongside the `clip-path`, so
the front has travel and weight instead of being silently consumed.

- Hold 30% of `--dur-slow`, total **560 ms** — inside the brief's 400–800 ms.
- Curve `--ease-drawer`, the token the system already keeps for this.
- No fade, no scale, no blur, no 3D, no glitch, no particles.
- Leaving ABOUT plays `drawer-close`: the front rises back in, so a return
  reads as the same mechanism run backwards.

**Fail-safe by inversion, unchanged from M03.** The gate's unanimated state is
`hidden`; the animation runs visible → hidden. A dropped stylesheet, an engine
without `@keyframes`, or a reduced-motion preference all resolve to "gate gone,
content visible". Measured, not asserted — see §1D.6.

### 1D.5 Content — verified only

Every claim on `/about` is rendered verbatim from `lib/profile.ts`. The page
contains no biographical prose of its own, which is what makes the
no-fabrication rule enforceable rather than merely intended.

Added to the verified record this milestone: **one** statement, the AI
philosophy supplied in the M04 brief §7. Nothing else was added and nothing
was rephrased.

Rendered: name, identity, about statement, education (Bachelor's student —
Lincoln University), learning (Cybersecurity · AI · German), the seven
interests, the three position statements (method, on AI, on security), and the
ambition as the closing statement.

**Not invented:** no birth information, location, employer, job history,
certification, award, GPA, graduation date, years of experience, or
professional title. Four of those absences are named explicitly in a
`NOT YET RECORDED` block at the foot of the record, with a line stating they
are absent because unconfirmed rather than withheld. An archive that shows the
extent of its holdings is more credible than one that fills every field.

### 1D.6 Verification — what was measured

Chrome could not be driven through the browser extension this session, so
testing was done against headless Chrome over the DevTools Protocol. Node 22
ships a global `WebSocket`, so this needed **no new dependency** — the probe
is a scratchpad script, not repository code. Device metrics were set through
`Emulation.setDeviceMetricsOverride` rather than by resizing a window, which
is what makes sub-500px viewports measurable at all (§1B.6).

**Responsive — all seven matrix sizes, `/about`:**

| Viewport | Horizontal overflow | Content stranded invisible | Gate resolved | Document height |
|---|---|---|---|---|
| 390 × 844 | 0 px | 0 | hidden | 2247 px |
| 375 × 812 | 0 px | 0 | hidden | 2270 px |
| 768 × 1024 | 0 px | 0 | hidden | 1984 px |
| 1024 × 768 | 0 px | 0 | hidden | 1871 px |
| 1366 × 768 | 0 px | 0 | hidden | 1908 px |
| 1440 × 900 | 0 px | 0 | hidden | 1908 px |
| 1920 × 1080 | 0 px | 0 | hidden | 1908 px |

Three intentional compositions, not one shrunk: below 480px the record fields
stack label-over-value and the identity roles stack without separators; from
768px the editorial margin engages and the holdings index goes two-up; from
1440px the margin labels become sticky against a wider content column.

**Reduced motion (`prefers-reduced-motion: reduce`, all seven sizes):**
zero running animations, zero stranded elements, gate resolved to `hidden`,
identical document heights, full heading outline intact.

**JavaScript disabled (`Emulation.setScriptExecutionDisabled`, 1440×900):**
overflow 0, gate hidden, skip link present, all seven navigation links
present, and every verified statement rendered — checked individually:
name, philosophy, Lincoln University, the AI statement, the security
statement, the ambition, and the learning list.

**Direct URL / reload / copied URL:** `/about` is a static
`dist/about/index.html`. It carries its own `<title>`, description, canonical
and Open Graph tags and does not read any state from HOME. Every probe above
navigated to `/about` directly, never from `/`.

**Accessibility:**

- Heading outline: `H1 Ayush Rijal` → `H2 01 Current chapter` → `H2 02 What I
  work with` → `H2 03 Positions` → `H2 04 Closing statement` → `H2 Not yet
  recorded`. One h1, no skipped levels. The margin labels are real `<h2>`
  elements set in the label register — the visual treatment changed, the
  semantics did not. The "Subject" label above the `<h1>` is deliberately not
  a heading, because an `<h2>` there would invert the outline.
- `aria-current="page"` resolves to exactly one element, the About link.
- Skip link present and first in tab order; focus ring unchanged and global.
- Every section is a named region via `aria-labelledby`.
- Lists stay lists: the identity roles and the holdings index are `<ul>`, with
  separators drawn by CSS rather than joined into strings. Fixed during this
  milestone: `01Current chapter` — Astro's `compressHTML` collapsed the space
  between the catalogue number and the heading text, so the accessible name
  ran the two together. Now `{' '}`, the same device the colophon uses.
- Contrast, measured: ink 14.71 / 7.44 / 5.69 / 4.82 against the ABOUT stock —
  every step *higher* than against the global paper. Accent as text 7.49:1.
  Reversed tab (paper on accent) 8.04:1. Focus ring 6.25:1. All clear AA.
- Forced-colours: the accession tab is the only reversed element on the page
  and is given a bordered transparent treatment, since it would otherwise
  resolve to a solid block with same-colour text.

**Performance:** `/about` is 13.9 KB of HTML and 5.1 KB of its own CSS. Zero
page-specific JavaScript — the only module on the page is the shared 639-byte
world-gate exit handler from the layout. No three.js, no WebGL, no animation
library, no external runtime dependency, no new font file.

**Build / CI:** `npm ci` clean, `astro check` **0 errors, 0 warnings, 0 hints**
across 38 files, `astro build` 12 pages, `npm run verify` green,
`npm audit --audit-level=high` **0 vulnerabilities**. One production
dependency, still `astro`.

**M03 regression check:** HOME was probed at all seven viewports after the
shared-infrastructure changes — 0 overflow, 0 stranded, 0 running animations,
heading outline and focusable count unchanged. M04 did not break M03.

### 1D.7 Defects found and fixed

1. **The gate rule centred itself.** `.gate__rule` is an `<hr>`, and the reset
   in `global.css` zeroes margins by element name without listing `hr`, so it
   kept the UA's `margin-inline: auto` and sat centred beneath two
   left-aligned lines. Present on HOME since M03-B; found by looking at a
   screenshot of the ABOUT gate. `.rule` was never affected because
   `global.css` sets `margin: 0` on that class. Fixed in `gate.css`.
2. **`01Current chapter`** — accessible name defect, above.
3. **Orphaned separator on phones.** The identity list wrapped, carrying its
   `·` to the start of the next line where it reads as a bullet. The list now
   stacks below 480px, which is also how HOME sets the same three roles.

### 1D.8 Known limitations

1. **The browser extension was unavailable**, so no manual click-through, no
   real-device testing, and no visual check in a non-Chromium engine. Firefox
   and Safari are **untested**, as they were in M03-B. Everything reported in
   §1D.6 is a headless-Chromium measurement.
2. **The exit half of the transition is untested end to end.** `world-gate.ts`
   is unchanged from M03 and `drawer-close` is written symmetrically to the
   entrance, but a real HOME → ABOUT click was not driven this session.
3. **Gate copy for the six unbuilt worlds is still placeholder-grade.** HOME
   and ABOUT now carry written copy; the rest are the M02 conceptual examples.
4. **`--paper-recessed` and `--paper-edge` are set for ABOUT but unused by it.**
   They are declared so the world's stock is internally consistent if a later
   component reaches for them. Deleting them is defensible.
5. **The typography question from §1B.10.6 is still open.** IBM Plex remains a
   prototype selection. ABOUT strengthens the case for keeping Plex Serif —
   it is now doing display work, not just body work — but the decision is the
   architect's.

### 1D.9 Open decisions for review

1. **Is the MATERIAL slot the right widening of the contract?** The
   alternative was to keep one stock for all eight worlds and push harder on
   geometry. The contrast constraint is enforced either way; this is a design
   judgement, not a safety one.
2. **Does the drawer read as a drawer?** It is the first entrance whose
   metaphor is mechanical rather than typographic.
3. **Should the `NOT YET RECORDED` block ship?** It is honest and on-concept,
   and it is also the only place the page draws attention to what it lacks.
4. **The gate still sets its `ENTER` line in the display face on every world.**
   Arguably it should take the world's own register. Left shared for now,
   because the gate is chrome.

### 1D.10 Scope compliance

V1 is untouched and byte-identical. `main` is unmodified. Nothing is merged.
**No world beyond ABOUT was built** — Projects, AI Lab, Cybersecurity,
Learning, GitHub and Contact still render their M02 placeholder shells and
their entrances remain declared-but-inherited. No content collection was
populated. No dependency was added, in production or in dev. The CSP was not
weakened. No secret, credential or third-party runtime origin was introduced.

### 1D.11 Commits

| Hash | Commit |
|---|---|
| `9c9ba45` | feat(world): open the material slot of the world channel |
| `ba49a8a` | feat(world): implement the drawer entrance, and fix the gate rule |
| `ee2455d` | feat(about): build the personal archive world |
| `a8505f1` | test(about): assert the record verbatim and every world stock at AA |

### 1D.12 How to review this

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm ci
npm run verify
npm run preview        # http://localhost:4321
```

| Route | What to look at |
|---|---|
| `/about` | The record. Reload to watch the drawer open. Resize across 480px and 768px. |
| `/` | Confirm HOME is unchanged apart from the gate rule now aligning left. |
| `/lab/viewports?route=/about` | All seven matrix viewports at once. |

The one question that matters: put `/` and `/about` side by side. If they read
as two environments that were engineered by the same hand, the milestone
succeeded. If they read as one page with a different tint, it did not.

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

> **Superseded for V2 by §1A.3.** The section below is the M01 record of V1 and is kept as the historical baseline.
>
> V2 status on `v2`: `astro check` 0 errors / 0 warnings across 33 files, `astro build` 11 pages green, `npm audit` 0 vulnerabilities, CI green.

**Build status (V1): N/A — no build system exists.** Nothing to compile; `git push` publishes.

**Automated test status (V1): none exist.** No test runner, no linting, no type checking, no CI. Addressed for V2 in §1A.3.

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

**Resolved in M02:** K1 (Node installed, Astro adopted), K2 (`.gitignore` in place), K3 (no CDN, no three.js, CSP shipped), K5 (component architecture), K8/K10/K13 (do not exist in V2), K9 (V2 escapes all interpolation). K4, K6, K7, K11, K12 remain open — K4 until the Actions workflow lands, K6 until the content session, K7 and K12 until cutover.

**Open on `v2`:** gate choreography untuned; scroll-driven composition unimplemented; `frame-ancestors` undeliverable on GitHub Pages; V1 redirect map (R10) still outstanding; cross-browser, mobile and screen-reader verification not yet performed.

| ID | Issue (V1 baseline, M01) | Severity |
|---|---|---|
| K1 | No Node.js on the dev machine — blocks any build-based V2 | ~~Blocking~~ **Resolved M02** |
| K2 | No `.gitignore` — secret/artifact leak risk the moment a build lands | ~~High~~ **Resolved M02** |
| K3 | three.js via CDN, no SRI, no CSP, 58% of page weight | ~~High~~ **Resolved M02** |
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

**V2 commands (branch `v2`).** Node is installed at `C:\Program Files\nodejs` but is **not on the shell PATH**:

```bash
export PATH="/c/Program Files/nodejs:$PATH"

npm ci               # install exactly from the committed lockfile
npm run dev          # http://localhost:4321
npm run check        # astro check — types across .astro and .ts
npm run build        # static output to dist/
npm run verify       # check && build, the same gate CI runs
npm run preview      # serve dist/
npm audit
```

---

## 14. Next milestone — M03 recommendation

**M03 — Design review, then world build-out.** Do not start building the remaining worlds until §1A.9 is answered; the whole point of stopping here is that the direction is cheap to change now and expensive to change after seven more worlds exist.

Recommended order:

1. **Review the direction on a real URL** — `/`, `/lab/wordmark`, `/lab/pretext`, and three contrasting worlds. Answer §1A.9.1 and §1A.9.2. The Pretext decision is genuinely reversible today and will not be later.
2. **Run the §9.4 content verification session with Ayush.** It blocks every content world and it is the longest-lead item. It should start before the design conversation finishes, not after.
3. **Land the GitHub Actions workflow** — the fetch, the generated snapshot, the scheduled cadence (§9.6). The architecture and fallback contract are already in place; only the workflow is missing.
4. **Build the worlds**, one reviewable milestone each, in the order content becomes verified.
5. **Then** tune the gate choreography and add scroll-driven composition, once there is more than one world to move between.
6. **Build the redirect map** (R10) before any cutover discussion.

**M03 exit criteria:** design direction signed off; the Pretext go/no-go confirmed or reversed; content verification complete; GitHub workflow green; at least two full worlds built and reviewed. V1 still live and unmodified throughout.

---

## 14A. M02 recommendation (M01 record, now complete)

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

*End of M02. Awaiting architectural review of the architecture and the Home prototype. Do not proceed to M03 until §1A.9 is answered.*
