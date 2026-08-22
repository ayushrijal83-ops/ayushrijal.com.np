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
| M05 | Projects world + K4 build-time GitHub integration | **Complete** | §1E below. Awaiting review. K4 and §9.6 closed. |
| M06 | AI Lab world | **Complete** | §1F below. Awaiting review. `/ai` renamed `/ai-lab`. |
| M07 | GitHub world | **Complete** | §1G below. Awaiting review. `EXCLUDED_REPOS` retired. |
| M08+ | Remaining three worlds, content collections, redirects, cutover | Not started | Cybersecurity, Learning, Contact. Each is a CSS entrance block plus a page. |

**M07 scope compliance:** the GITHUB world was built. **CYBERSECURITY, LEARNING and CONTACT are NOT STARTED** — they remain M02 shells. No world outside GITHUB was modified, not even by a sentence. `lib/github.ts` changed, but it is the M05 data layer this world consumes: `EXCLUDED_REPOS` was retired in favour of `REPO_KIND`, because an archive that hides three of its ten holdings is not an archive (§1G.1). No workflow was touched and no snapshot field was added. No dependency was added. V1 remains byte-identical, `main` is unmodified, nothing is merged. See §1G.13.

**M06 scope compliance:** the AI LAB world was built. **CYBERSECURITY, LEARNING, GITHUB and CONTACT are NOT STARTED** — they remain M02 shells. HOME and ABOUT were not modified. Two changes fell outside AI LAB, both consequences rather than scope: `TitleBlock`'s styles moved into the component (a genuine shared-system bug — AI LAB rendered it unstyled), and one sentence links PROJECTS into the lab per the brief's world relationship. No dependency was added. V1 remains byte-identical, `main` is unmodified, nothing is merged. See §1F.13.

**M05 scope compliance:** the PROJECTS world was built and K4 was closed. **AI LAB, CYBERSECURITY, LEARNING, GITHUB and CONTACT are NOT STARTED** — they remain M02 shells. Home and About were not modified; the only change outside PROJECTS is a two-line overflow fix on `/contact` (§1E.9). No dependency was added; `astro` is still the only production dependency. V1 remains byte-identical, `main` is unmodified, nothing is merged. See §1E.13.

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

**The exit half of the transition, end to end.** A real left-click was
dispatched at the ABOUT link's measured coordinates on `/`, and the gate was
sampled 90ms later — i.e. while the handler's work should be visible:

| Case | At +90ms | Landed |
|---|---|---|
| Plain left click | `data-state="leaving"`, `gate-register-close` running, gate visible | `/about`, `data-world="about"`, gate hidden |
| Reduced motion | already at `/about`, no state, gate hidden, 0 animations | `/about`, gate hidden |
| Ctrl+click | still on `/`, no state set | stayed on `/` |

So the two halves do join across a navigation: HOME's plate closes, then
ABOUT's drawer opens. The documented degradations hold — under reduced motion
the handler is never bound and the link navigates immediately, and a modified
click is left alone for the browser to handle.

Worth naming as a deliberate reading rather than an accident: the *exit*
belongs to the world being left and the *entrance* to the world being entered,
so this crossing is "close the drafting sheet, then draw the drawer open" —
two mechanisms, in that order, not one effect played twice.

**Keyboard navigation**, driven with real key events on `/about` @1440×900:

```
 1. a.skip-link       Skip to content   outline 2px solid #9c3016, offset 3px
 2. a.masthead__mark  Ayush Rijal
 3. a.masthead__link  About             aria-current=page
 4-9. Projects / AI Lab / Security / Learning / GitHub / Contact
10. a                 github (colophon)
11. leaves the document
```

Tab order matches reading order, the skip link is the first stop, and the
focus indicator was *resolved* rather than assumed — `outlineStyle`,
`outlineWidth` and `outlineColor` computed on each stop, all `solid 2px
rgb(156, 48, 22)` at 3px offset. Pressing Enter on the skip link sets
`location.hash` to `#main` and `:target` resolves to the `main` element, so it
moves the reading position and not merely the focus ring.

One measurement needed a second look, recorded so it is not re-investigated:
the colophon link first reported as focused-but-off-screen. It is not. The
`html:focus-within { scroll-behavior: smooth }` rule in `global.css` does not
advance in headless Chrome, so the scroll never ran. Re-measured with reduced
motion emulated — which is exactly what disables that rule — focus scrolls the
link fully into view (`scrollY` at maximum, element inside the viewport) on
both `/about` and `/`.

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

1. **No non-Chromium engine was rendered.** Firefox is installed on this
   machine and three headless attempts were made; all failed before producing
   output with `RenderCompositorSWGL failed mapping default framebuffer`, a
   graphics-backend failure unrelated to the site. Driving Gecko properly
   needs `geckodriver`, a new dependency, which was not added without
   approval. **Firefox and Safari remain untested**, as they were in M03-B,
   and everything in §1D.6 is a headless-Chromium measurement. The features
   the page leans on — `clip-path` animation, `position: sticky`, subgrid-free
   CSS grid, `text-wrap: balance` — are all widely supported, but that is a
   claim from support tables, not a measurement.
2. **No manual click-through on a real device.** The browser extension was
   unavailable, so there was no human looking at the page in a real window.
   The transition was verified by dispatched input rather than by a hand.
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

## 1E. M05 — Projects world + K4 (build-time GitHub integration)

**Status: M05 — PROJECTS WORLD — COMPLETE.** Awaiting architectural review.
**Scope:** two objectives. Build the PROJECTS world on the M04 world system,
and close K4 — move GitHub data off the visitor's browser and onto the build.
No other world was built. See §1E.13 for what remains untouched.

### 1E.0 The two layers, which is the whole design

A project page makes claims about software. This world is built so that every
claim on it is attributable to one of exactly two sources, and so that the
reader can tell which:

| Layer | Source | Written by | Can it be wrong? |
|---|---|---|---|
| **AS REPORTED BY THE REPOSITORY** | `github.snapshot.json` | GitHub | Only if GitHub is wrong |
| **AS BUILT** — the narrative | `src/content/projects/*.md` | Ayush | Yes, and §1E.6 found four |

They are joined on the repository URL by `repoByUrl` in `lib/github.ts`, never
by a page reaching into the snapshot array. A project whose repository is
missing from the snapshot renders its narrative with the facts *visibly*
absent — "Repository data unavailable — narrative only" — rather than with a
zero, a blank, or a fabricated figure.

That separation is not decoration. AgroVision's GitHub-reported primary
language is `HTML`, because the repository is mostly Jinja templates by byte
count; its narrative says Python and Flask. Both are true, they disagree, and
a design that merged them would have had to pick one and lie.

### 1E.1 Visual system — the workshop sheet

| Element | Decision |
|---|---|
| Stock | `--paper-workshop`, one step from the global stock. Uses the M04 MATERIAL slot; clears the whole ink ramp at AA (asserted by `verify-output.mjs`) |
| Ground | Drafting grid — the finest ruling of the eight worlds |
| Entrance | `sheet` — the plate arrives as a drawing pulled from a drawer |
| Grammar | A parts list. The register is a real `<table>`; the assertion in `verify-output.mjs` fails the build if it degrades to cards |
| Record panels | Clipped top-right corner (`clip-path`), panel ground one step lighter than the world's stock |
| Type | No new scale. Global tokens only, per the §8.2 shared-vs-per-world boundary |

Two things were deleted rather than fixed during M05 (commit `80a0cfc`):

- **The fold mark** across each panel's cut corner never rendered. `clip-path`
  clips an element's own pseudo-elements, so a hairline drawn along the cut is
  removed by the cut. Correcting it needs a gradient stop at 50% of a diagonal
  axis plus a sub-pixel nudge to survive the clip. The corner is legible from
  the material without it — the panel ground is lighter than the stock and the
  drafting grid shows through the cut — so the ornament went.
- **A duplicate link.** Each panel carried an "Open record" link to the same
  destination as its own heading, which cost a keyboard user three tab stops
  per project. Two is the most any one record should cost.

### 1E.2 The register and its ordering

Featured work first, then most recently worked — `updated`, falling back to
`date`. The caption on the table states the rule.

It originally sorted on `date` (when the project started) while the visible
column showed `updated` (LAST WORKED), so the table could list one project
above another while displaying a date that said the opposite. That reads as a
bug in the table rather than as an editorial decision. Fixed in `80a0cfc`.

Verified order in the built output: **YushaCyber** (2026-08-15, featured) →
**Jarvis Assistant** (2026-08-09, featured) → **AgroVision Nepal**
(2026-07-23). This matches the M05 brief's required order.

### 1E.3 K4 — build-time GitHub integration

```
GitHub Actions (push to v2, and every 6h)
   └─ scripts/fetch-github.mjs, with the runner's GITHUB_TOKEN
        └─ src/data/github.generated.json     (gitignored, fresh)
             └─ lib/github.ts, at build time
                  └─ static HTML with the facts baked in
```

Nothing in that chain runs in a visitor's browser. `verify-output.mjs` asserts
it directly: no shipped page may contain the string `api.github.com`.

**Two workflows, two jobs.**

| Workflow | Trigger | Does |
|---|---|---|
| `ci.yml` | push to `v2`, PR, dispatch | `npm ci` → refresh data (`continue-on-error`) → `npm run verify` → `npm run test:github` → `npm audit --audit-level=high` |
| `github-data.yml` | cron `0 */6 * * *`, dispatch | refresh → verify → commit the snapshot back to `v2` **only if a repository fact moved** |

CI keeps a *built* site current. The scheduled workflow exists for the case CI
cannot cover: keeping the committed **fallback** fresh, because a fallback
last written months ago is a fallback that lies.

Three details that are load-bearing rather than incidental:

- **`--promote` ignores `generatedAt`.** Every run produces a new timestamp.
  Without a facts-only comparison, four runs a day would each rewrite and
  commit the snapshot forever, and the history would say nothing.
- **The refresh step installs nothing.** `fetch-github.mjs` has zero
  dependencies (Node 22+ has global `fetch`), so `npm ci` runs only for the
  verify step that needs it.
- **It verifies before it commits.** This job writes to the branch unattended.
  A snapshot that breaks the build must not be what lands while nobody looks.

Cadence answers **§9.6** at its recommended value: every six hours, plus on
push. Four runs a day at roughly twenty seconds each, well inside the free
tier. **§9.6 is now closed.**

### 1E.4 Fallback architecture

The contract, in `lib/github.ts`, in order:

1. `src/data/github.generated.json` — fresh, gitignored, written by a workflow.
2. `src/data/github.snapshot.json` — last known-good, committed.
3. `null` — a **designed state**, not an error: the page says the data is
   unavailable and renders the narrative alone.

The fetch is deliberately **not** part of `npm run build`, and its CI step is
`continue-on-error`. A GitHub outage, a rate limit or a network blip cannot
fail a build or blank a page. That is the difference between an integration
and a deployment dependency.

**This is tested by breaking it** — `npm run test:github`
(`scripts/test-github.mjs`, commit `62e43c7`). It moves *both* data files
aside, simulating the worst case (the API is down **and** the committed
snapshot is gone), rebuilds, and asserts: the build succeeds, the register
renders, all three records are still listed, the page declares the data
unavailable, and no fabricated star count appears. Then it restores and
rebuilds. **13 assertions, all passing.**

That test exists because of a real bug. `loadGitHubSnapshot` shipped in M02
resolving its paths against the bundle rather than the process working
directory, so it **always** returned `null` — and because `null` is a
legitimate designed state, the output was identical to a working loader. It
survived three milestones. Nothing short of deliberately removing the data
would have caught it, which is precisely why deliberately removing the data is
now a test.

### 1E.5 Security

| Property | How it is held | How it is checked |
|---|---|---|
| No credential in the client | Static output has no request-time runtime | Structural |
| No credential in `src/` or `public/` | Token read from `process.env` only | Review + `.gitignore` |
| No credential in the output | Field allow-list in `normalise` — the API response's owner objects, URLs and permission blocks never cross | **`verify-output.mjs` scans every shipped file** |
| No credential in a log | Actions masks secrets; the scanner prints a byte offset, never the match | Asserted by `test-github.mjs` |
| No visitor-facing rate limit | Data is baked in at build time | `api.github.com` assertion |
| Least privilege | `ci.yml` is `contents: read`; only `github-data.yml` has `contents: write` | Review |

The credential scan (commit `62e43c7`) covers `.html`, `.js`, `.css`, `.json`,
`.xml`, `.txt` and `.svg` in `dist/` — a token pasted into a data file ships
exactly as far as one in a page. It matches GitHub's own token prefixes
(`ghp_` / `gho_` / `ghu_` / `ghs_` / `ghr_`, `github_pat_`), `Authorization`
headers, and credential-shaped assignments of 16+ characters.

**It deliberately does not print what it found.** A CI log on a public
repository is published output too, and it outlives a force-push. The failure
names the file and a byte offset. `test-github.mjs` plants a canary token in
`dist/` and asserts all three: the gate fails, it names the file, and the
value does not appear in the output.

**Secret scan result: clean.** No credential-like value in `dist/` (15 pages,
all asset types). `npm audit`: **0 vulnerabilities**.

**One finding, in someone else's repository.** `Agriculture_simulator` commits
an OpenWeatherMap API key as a string literal in `app.py`, under a comment
reading "Hackathon: hardcode key". It is a public repository. The value is not
reproduced in this document or on the site. **It needs revoking at
OpenWeatherMap and moving to an environment variable** — that is outside this
repository and is recorded here as an action for Ayush, and named on the
AgroVision record as a defect the author found in his own work.

### 1E.6 Verified project facts — and four corrections

Every claim was re-verified against source during M05 (commit `893b2fb`):
`jarvis_assistant` and `Agriculture_simulator` through the GitHub API and raw
file reads, `YushaCyber` against the local clone at `D:\YushaCyber` at commit
`e412b5f` (2026-08-15), which matches the published `pushedAt`.

**The brief's checklist, answered against code:**

| Project | Claim | Verdict |
|---|---|---|
| YushaCyber | Cybersecurity learning platform | **Built** — Flask app factory, 14 blueprints |
| | AI mentor | **Built, with a caveat** — `app/core/ai/`; a *client* for OpenAI or Anthropic with a mock provider. Needs a key; reports itself unavailable without one. Nothing local, nothing trained here |
| | Roadmap | **Built** — `roadmap_bp` at `/roadmap`, markdown content, `bleach`-sanitised |
| | CTF / challenges | **Built** — `ChallengeCategory`, `Challenge`, `ChallengeSolve`, `ChallengeHint` |
| | XP / levels | **Built** — `User.xp`, `User.level`, `xp_reward` on challenges and mission objectives, achievement engine, leaderboard |
| Jarvis | Local LLM, Ollama / Mistral | **Built** — `ollama==0.3.3`; `AIBrain(model="mistral")` by default |
| | Text-to-speech | **Built** — `pyttsx3` |
| | OpenCV, MediaPipe | **Built** — both in `requirements.txt`, both used in `vision.py` |
| | Face detection | **Built** — `mp.solutions.face_detection` *and* `face_mesh`, with a nose/eye-line gaze estimate driving an attention state |
| | Gesture recognition | **Built** — `gesture.py` + `gesture_control.py`, plus per-game profiles |
| | Automation | **Built** — PyAutoGUI behind an application whitelist, a keystroke allow-list, a 120-character typing cap, rate limiting, and a confirmation on the close-window hotkey |
| AgroVision | Soil detection | **Partial** — `/soil-check` scores a **form-entered** soil type and nitrogen level against `crop_data.json`. No sensor exists. The *real-time* version stays on the roadmap |
| | Nutrient recommendation | **Partial** — the same route returns banded advice, not a dosage |
| | Weather requirements | **Built** — `/weather-check` calls OpenWeatherMap live and weights temperature 40% / soil 30% / nutrients 20% |
| | Fertilizer recommendation | **Not built** — roadmap only |
| | Plant disease detection | **Not built** — roadmap only |

**The four corrections, and why two of them are the more interesting failure:**

1. **AgroVision's roadmap was copied from its README's "Future Improvements",
   which is stale against its own source.** Weather API integration and farmer
   authentication were both listed as unbuilt; both are in `app.py`. The site's
   rule is "only publish claims supported by the repository" — reading a
   roadmap instead of the code got the direction of the error backwards and
   produced an *understatement*, which is a fabrication too. The output guard
   in `verify-output.mjs` had been enforcing it.
2. **YushaCyber registers fourteen blueprints, not fifteen.** The prose already
   enumerated fourteen; only the number was wrong.
3. **YushaCyber's `bleach` claim was false.** The record said the dependency was
   imported by the code while missing from `requirements.txt` — "a real bug,
   found and recorded". It was added on 2026-07-14, five weeks before the record
   claimed it was absent. Removed; the sanitisation fact itself is true and kept.
4. **Jarvis under-reported itself.** Face detection, face mesh, gaze-based
   attention, the Mistral default and the entire input-safety fence were all
   implemented and unmentioned.

Figures spot-checked and confirmed: YushaCyber ≈ 3.47 MB of tracked Python
across 374 files, **48** test files; Jarvis `voice.py` 24,842 B, `vision.py`
9,785 B, `ui.py` 23,430 B.

**Nothing on the site is published that the repository does not support**, and
the AgroVision roadmap block — struck through, headed "Not built" — is
enforced: `verify-output.mjs` fails the build if "disease detection",
"Fertilizer" or "fertiliser" appears anywhere before that marker.

### 1E.7 Accessibility

Verified in Chrome 151 against the built output.

| Check | Result |
|---|---|
| Heading structure | One `<h1>` per page, all 15 pages |
| Landmarks | `header` / `nav` / `main` / `footer` on every page checked |
| Skip link | Present, `href="#main"`, `#main` exists; moves from `-69px` to `+8px` on focus |
| Focus indicators | **Every** focusable element on `/`, `/projects`, `/projects/yushacyber`, `/contact` shows an outline under `:focus-visible` — 16, 19, 13 and 11 elements, zero without |
| Tab cost per record | Two stops (register row, panel heading), down from three |
| Contrast | Every ink step against the workshop stock clears WCAG AA; asserted in the build |
| Reduced motion | Motion is **opt-in**: every animation sits inside `@media (prefers-reduced-motion: no-preference)` and uses `backwards` fill, so the unanimated state is the finished state. A reduced-motion user needs no override |
| Forced colors | `.record-panel` rules present; the dead `::after` override was removed with the element |
| The register | A real `<table>` with `<caption>` and `scope="col"` headers — announced as a table, not read as loose text |

An earlier automated pass reported every element as missing a focus ring; that
was a false negative from calling `.focus()`, which does not set
`:focus-visible` in Chrome. Re-run with `.focus({focusVisible:true})`: zero
failures. Recorded because the wrong method produces a confidently wrong
accessibility report.

### 1E.8 Performance

Static output, no framework runtime, no third-party origin.

| | Bytes |
|---|---|
| `dist/` total | 334,578 |
| `/projects` HTML | 18,262 |
| CSS for `/projects` (2 files) | 23,229 |
| **JS on `/projects`** | **639** — one script, the world gate |
| All JS in `dist/` | 6,195 |
| Fonts (6 × woff2, self-hosted, subset) | 109,244; `/projects` preloads 2 |
| Build | 15 pages in ~1.4–2.2 s |

*Not measured:* Lighthouse scores, cold-cache field performance, real-device
frame rate. Carried forward, unchanged, from M04's open list.

### 1E.9 Responsive testing

Programmatic overflow sweep over 320 / 360 / 375 / 414 / 768 / 1024 / 1280 /
1440 / 1920 px across `/`, `/about`, `/projects`, all three records, `/github`
and `/contact` — measuring `documentElement.scrollWidth` against `clientWidth`
and naming the widest offending element on any failure.

**One overflow found, and fixed:** `/contact` at 320 px overflowed by 3 px.
`.channels__value` is `inline-size: fit-content` around an email address,
which is a single unbreakable token — a horizontal scrollbar on the narrowest
phones for the sake of one link. Fixed with `overflow-wrap: anywhere` and
`max-inline-size: 100%`. Re-swept: **zero overflow at every width on every
page.**

At 390 px the register stacks into labelled blocks (its cell labels carry
through), the nav wraps to two rows, and the sheet block reflows to two
columns. The record panel and its cut corner survive the reflow.

### 1E.10 Browser and no-JS testing

**Chrome 151 (Windows 11) — verified.** Firefox, Safari, Edge and real mobile
devices: **not tested.** No emulator substitutes for a real device and none is
claimed. This remains open, as it has since M02.

**JavaScript disabled** — tested by loading each page in a sandboxed frame with
scripting denied and comparing against the same page with scripting allowed:

| Page | No-JS | With JS |
|---|---|---|
| `/projects` | 1,827 chars, 3 register rows, 3 panels | **Identical** |
| `/` | 1,346 chars | 1,366 chars — the wordmark island swapping its fallback `<h1>` |

The PROJECTS world is byte-for-byte the same with scripting off. Its only
script is the world gate, which is an entrance, not content.

**Console: clean.** Zero errors, warnings, rejections or exceptions across all
11 routes.

### 1E.11 Build and CI status

| Gate | Result |
|---|---|
| `astro check` | 42 files, **0 errors, 0 warnings, 0 hints** |
| `astro build` | 15 pages, clean |
| `npm run verify` | **Pass** — 8 worlds, no-JS fallbacks intact, About record verbatim, 3 project records with sources, **no credentials**, 3 world stocks clear AA, no inline scripts, no third-party origins, no Pretext |
| `npm run test:github` | **Pass** — 13/13 |
| `npm audit --audit-level=high` | **0 vulnerabilities** |
| Direct URLs | 13/13 routes return 200 |

`astro.config.mjs` sets `trailingSlash: 'never'`, so `astro preview` returns
404 for `/about/`. GitHub Pages serves `/about/` from the emitted
`about/index.html` regardless. Worth knowing before someone reports it as a
bug against the preview server.

Dependencies: **`astro` remains the only production dependency.** Nothing was
added for K4 — the fetch script, the verification gate and the fallback test
are all zero-dependency Node.

### 1E.12 Known limitations

1. **Firefox, Safari, Edge and real mobile devices are untested.** Open since M02.
2. **Lighthouse, axe and a screen-reader pass have not been run.** Structural
   accessibility is verified; lived accessibility is not.
3. **`contributions` is `null`.** Contribution totals need the GraphQL API. The
   field exists and is never estimated; the site shows no contribution figure
   rather than an invented one.
4. **The scheduled workflow has not yet fired.** Its logic is exercised locally
   — promotion is a verified no-op when facts are unchanged and fires when they
   change — but the first cron run is unobserved.
5. **`github-data.yml` commits to `v2` unattended.** It verifies first, and it
   can only ever touch one file. Still the only automation in this repository
   holding `contents: write`.
6. **`/contact`, `/ai`, `/cybersecurity`, `/learning`, `/github` are M02 shells.**
7. **The gate choreography is still untuned** and scroll-driven composition is
   still unimplemented. Open since M03-B.
8. **The OpenWeatherMap key in `Agriculture_simulator` is still live** until
   Ayush revokes it. Outside this repository; recorded in §1E.5.

### 1E.13 M05 scope compliance

**Only PROJECTS was built.** Two lines of CSS changed outside it — the
`/contact` overflow fix in §1E.9, which is a defect repair on a shipped page,
not the start of that world.

| World | State |
|---|---|
| **PROJECTS** | **COMPLETE** |
| **AI LAB** | **NOT STARTED** |
| **CYBERSECURITY** | **NOT STARTED** |
| **LEARNING** | **NOT STARTED** |
| **GITHUB WORLD** | **NOT STARTED** |
| **CONTACT** | **NOT STARTED** |

Home and About were not modified. No dependency was added. The CSP was not
weakened. **V1 remains byte-identical, `main` is unmodified, nothing is
merged.**

### 1E.14 Commits

| Hash | Commit |
|---|---|
| `282b8c8` | feat(projects): implement build-time GitHub retrieval, and fix the loader |
| `df2a6c1` | feat(projects): file three verified project records |
| `db6dc17` | feat(world): give PROJECTS its stock and the sheet entrance |
| `ab8e6ec` | feat(projects): build the engineering workshop world |
| `437ad07` | test(projects): assert the records, the two layers, and the roadmap boundary |
| `80a0cfc` | fix(projects): order the register by the date it shows, and cut two dead things |
| `04c97ea` | feat(projects): close K4 with a scheduled build-time GitHub workflow |
| `62e43c7` | test(projects): verify the GitHub fallback and secret isolation |
| `893b2fb` | fix(projects): correct three records against their repositories, not their READMEs |
| `92dba32` | fix(contact): stop an email address pushing the page 3px wide at 320 |
| _this_ | docs: record M05 — the Projects world and the closing of K4 |

Files added or changed in the K4 half:

```
.github/workflows/github-data.yml    new — the scheduled refresh
.github/workflows/ci.yml             + the fallback/secret test step
scripts/fetch-github.mjs             + facts-only --promote comparison
scripts/test-github.mjs              new — 13 assertions
scripts/verify-output.mjs            + credential scan, narrowed AgroVision guard
package.json                         + test:github
src/content/projects/*.md            three records corrected
src/pages/contact.astro              overflow fix
```

---

## 1F. M06 — AI Lab world

**Status: M06 — AI LAB — COMPLETE.** Awaiting architectural review.
**Scope:** one objective. Build the AI LAB world on the M04 system. No other
world was built; see §1F.13.

### 1F.0 The route changed, and this was the last cheap moment to change it

The world was `ai` at `/ai`, named **Experimental Machine Room**. That is a
mainframe hall. The work it holds is a laboratory — things are assembled, run,
measured, taken apart and run again — and the M06 brief names both the route
`/ai-lab` and the identity *experimental laboratory*.

Renamed: `id: 'ai-lab'`, `href: '/ai-lab'`, world **Experimental Laboratory**,
gate `EXPERIMENTAL LABORATORY` / `ENTERING THE LABORATORY`. Six references in
total across the registry, the world stylesheet, the page and the verification
script.

Recorded here because the timing is the point: nothing is published, so the URL
was still free. After cutover this would have cost a redirect (R10), and the
world would have kept a name that described the wrong building for as long as
the site existed.

### 1F.1 Visual system — the bench

| Element | Decision |
|---|---|
| Stock | `#f1f0ea` — the lightest, least saturated in the archive. Bench paper, against HOME's warm drafting, ABOUT's manila, PROJECTS' cold grey. Ink ramp measures 15.21 / 7.69 / 5.88 / 4.99 |
| Accent | `#4a5c3a`, 6.38:1 on that stock. A chalkboard-and-reagent-bottle green — the darkest, least chromatic accent in the archive, chosen directly against the brief's prohibition on neon |
| Ground | **Two** rulings: a dot matrix on a sample pitch, and a graduated scale down the inline-start margin — minor ticks at that pitch, a major every fifth |
| Entrance | `traverse` — a specimen slide carried across the stage |
| Grammar | Stations. A numbered sequence of bench positions, not a scroll of sections |
| Type | No new scale. Global tokens only |

**The graduated margin is the world's thesis as furniture.** HOME registers,
PROJECTS draws, ABOUT files; this world *measures*, so every page in it carries
a ruler down its edge. The scale and the sample field both read
`--bench-pitch`, so the ruler cannot drift from the thing it is measuring, and
the same token graduates the leading edge of the entrance plate.

Nothing glows. No gradient, no glass, no circuit board, no particles, no
neural-network ornament, no terminal phosphor. The accent is used the way a
reagent label uses colour — to mark what has been measured.

### 1F.2 The philosophy, as a station rather than a pull-quote

*"I build, experiment, break, and learn."* is set in the display face at
`--step-3`, labelled `WORKING PRINCIPLE`, and ruled on its measuring edge —
treated as a specimen under examination, because it is a statement about
method and a method is the kind of thing this world examines.

Underneath it, the second half of the brief's philosophy, in the form the
About record already verified: *when AI gives me code, I want to understand
what it does rather than blindly accepting the output*. The page then says why
that is engineering rather than caution — **a system you did not understand
when it worked is a system you cannot fix when it stops** — and draws the
consequence that shapes the whole world: the unit of work here is not a model,
it is a pipeline you can follow end to end.

### 1F.3 Verified AI capabilities

Read out of source during M06. `jarvis_assistant`, `beach_buggy_ai`, `x-man`
and `Agriculture_simulator` through the GitHub API and raw file reads;
`YushaCyber` from the local clone verified in M05.

**Two repositories were inspected for the first time in M06** and both are
substantial AI work that no earlier milestone had looked at:

- **`beach_buggy_ai`** — a gesture-controlled gaming assistant. MediaPipe
  Hands, OpenCV, pynput, plus blink detection, DeepFace expression
  classification, a voice assistant, and GPT-4o / Gemini 1.5 Flash chat.
- **`x-man` (NepalSathi)** — a Flask civic-information platform whose AI
  service runs `qwen2.5:0.5b` through local Ollama with a rule-based fallback.

| Area | Verdict | Evidence |
|---|---|---|
| Local language model | **Implemented** | `ollama==0.3.3`, `AIBrain(model="mistral")`; and `qwen2.5:0.5b` at `localhost:11434`, temp 0.3, 80-token cap, 20 s timeout |
| **Model training** | **NOT ATTEMPTED** | No `.fit(`, no `train_test_split`, no `torch.save`, no epoch loop, no fine-tune, in any repository |
| Speech recognition | **Implemented** | Vosk `KaldiRecognizer` continuous at 16 kHz; faster-whisper `small`, lazy-loaded |
| Text to speech | **Implemented** | `pyttsx3`, rate 185, interruptible via `engine.stop()` |
| Face detection | **Implemented** | `mp.solutions.face_detection` at ≥0.3, plus `face_mesh` with a nose/eye-line pitch proxy |
| Gesture recognition | **Implemented** | MediaPipe Hands, 21 landmarks; wrist(0)→knuckle(9) Δx, EMA α 0.3, ±0.02 |
| Expression classification | **Implemented** | DeepFace, every 10th frame, ≥0.4 confidence |
| Automation | **Implemented** | PyAutoGUI and pynput behind an app whitelist, a key allow-list, a 120-char typing cap, rate limiting and a confirm on the close-window hotkey |
| Hosted language model | **Implemented, key-gated** | OpenAI/Anthropic in YushaCyber; GPT-4o/Gemini in `beach_buggy_ai`. Both report unavailable without a key |

**Three claims were deliberately NOT made**, each because the source says
otherwise:

1. **Jarvis is not "offline".** Its only network call is opening a Google
   search URL in a browser on command. *No cloud inference* is accurate;
   *no network* would not be, so the page says the first.
2. **`emotion_engine.py` detects no emotion.** Its own docstring reads "NO ML,
   NO threads, NO side effects" — it is a lookup from vision state to a reply
   style. Experiment 002 records the gap between that and the filename rather
   than repeating the filename's implication.
3. **Head pose is not gaze.** The pitch estimate is nose-below-eye-line, and
   experiment 002 says so and says it should be justified with data before
   anything is built on it.

### 1F.4 Experiment architecture

The `experiments` collection has existed since M02 with exactly the schema this
needed: `outcome` as an enum including `failed` and `inconclusive`,
`hypothesis`, `apparatus`, and — the field that matters — **`result` optional**.
M06 is the first work to use it, and the reason it was written optional in M02
is the reason the world works now.

| No. | Experiment | Outcome | Result field |
|---|---|---|---|
| 001 | Aiming a general classifier at five crops | succeeded | No accuracy measured — no labelled test set exists |
| 002 | Attention as an input | **inconclusive** | Not measured |
| 003 | Two speech recognisers instead of one | succeeded | Latency and WER not measured |
| 004 | Hand tilt as a steering axis | succeeded | No frame rate or false-trigger rate |
| 005 | A 0.5B model, on purpose | succeeded | No latency, quality or fallback rate |

Four of five report an absence. **002 is filed inconclusive rather than
succeeded on purpose**: the mechanism works — presence detected, state changed,
replies shortened — and whether that makes the assistant *better* was never
tested. The honest outcome for an experiment whose result was never observed is
not success.

The notebook is ordered **ascending** by date, unlike every other index on the
site. 001 coming first is the convention of a lab book, and reversing it would
make the numbers argue with the order.

The numbers that *are* published were read from source: EAR 0.21 over 2 frames
with a 0.5 s double-blink window, tilt ±0.02, EMA α 0.3, detection confidence
0.7 and tracking 0.5, 1280×720 captured and 320×240 inferred, 3–4 s command
capture stopping after 450 ms below energy 400, temperature 0.3, 80 tokens.
Those constants are the actual engineering — they belong to one camera, one
microphone and one machine, and no tutorial contains them.

### 1F.5 Model provenance — the station the world is built around

Station 07 is a nine-row table of every model on the bench and where its
weights came from. Its last column reads **No** nine times.

Nothing here was trained or fine-tuned. MobileNetV2 arrives with ImageNet
weights; MediaPipe's graphs are Google's; Vosk, Whisper and DeepFace are
published; Mistral and qwen are pulled through Ollama; GPT-4o, Gemini and
Claude are hosted. There is no dataset, no training run, no accuracy figure and
no loss curve, **because none of those things exist.**

Stating it outright is worth more than any claim the page could make instead,
and it leaves visible the discipline this work does practise: applying a
general model to a narrow problem well. The plant gate, the label map, the
smoothing constant, the wake-word split — none of them touch a weight, and all
of them decide whether the system works.

### 1F.6 Technical diagrams — every diagram is a list

Six pipelines: local language model, face and attention, crop identification,
speech in/out, hand as an input device, command to action. Thirty-one stages.

**None of them is an SVG. There is no SVG on the page at all.** Each is an
`<ol>` of stages with the connectors — rule and plotted arrowhead — drawn in
CSS pseudo-elements. Consequences, and each was the reason:

- the stages are text, in order, in the HTML. A screen reader gets "list, 5
  items" in sequence. There is no alt text to write and none to fall out of
  sync with the diagram;
- complete with CSS disabled, and complete with JavaScript disabled;
- it **recomposes** rather than scaling. Above 52rem a horizontal run with
  rightward connectors; below, a vertical stack with downward ones. The brief
  asks specifically not to shrink desktop diagrams, and the way to comply is
  not to have one drawing.

Each stage carries an optional `note` — the thing a diagram normally cannot
say. That is where the barge-in path, the 320×240 downscale and the fail-safe
live, and they are the most useful text in each figure.

`verify-output.mjs` fails the build if an `<svg>` ever appears on this page.

### 1F.7 Transition

`traverse` — a specimen slide carried across the stage. The plate does not
part, split or lift: it travels sideways as one rigid piece and the bench is
uncovered behind it, the motion of a mechanical stage being wound in X.

It is **the one motion the other three worlds do not make**. HOME withdraws to
both margins, ABOUT travels down, PROJECTS parts along a crease. That is now
the written constraint on every future entrance, in `gate.css`: four
implemented kinds are four different motions, not four timings of one, and an
entrance that moves the way a built world already moves is a duration change
wearing a different name.

Two marks make it a mechanism rather than a wipe, and both come from the bench:
a **graduated leading edge** at `--bench-pitch`, so the travel is measured; and
a translate as well as a clip, so the slide has travel and a stopping point.
The label is fixed to the leading edge and rides off the stage with it.

560 ms on `--ease-drawer`, inside the brief's 400–800 ms window, over content
the browser has already painted. Verified mid-animation in Chrome: at 45%
through, `clip-path: inset(0 0 0 10.3%)` and `translate: 10.6px`, plate
visible, label travelling.

**Reduced motion:** the resting state is `visibility: hidden`, and the clock is
zeroed at the token source, so a reduced-motion visitor gets the bench
immediately. A failed or unsupported animation resolves the same way. Nothing
on the page is revealed by motion.

### 1F.8 Accessibility

Verified in Chrome 151 against the built output.

| Check | Result |
|---|---|
| Headings | One `<h1>`; nine `<h2>` stations; `<h3>` per experiment. No level skipped |
| Landmarks | `header` / `nav` / `main` / `footer` |
| `aria-current` | Set on the AI Lab nav item |
| Skip link | Present, targets an existing `#main` |
| Diagrams | Lists, not images. No alt text needed; nothing important reachable only through a drawing |
| Tables | Real `<table>` with `<caption>` and `scope="col"`. Below 48rem they become labelled blocks, with `data-label` carrying the column heading down — and `thead` is clipped, not `display: none`, so it stays in the accessibility tree |
| Marks | The locus and outcome squares never carry meaning by colour alone — each is paired with its word (`ON THE MACHINE`, `NOTHING TRAINED`, `succeeded`) |
| Forced colours | Locus and outcome distinctions survive on the border, since a background fill is not guaranteed to render |
| Reduced motion | All motion inside `no-preference`, `backwards` fill, so the unanimated state is the finished state |
| Contrast | Bench stock clears every ink step at AA; asserted in the build |

**One check could not be re-run: the live keyboard focus pass.** The browser
window had no OS focus in this session, so `document.hasFocus()` was false and
`:focus-visible` could not be exercised — every element reports "no ring",
which is the tool being wrong, not the page. What was verified instead: the
`:where(:focus-visible)` rule ships in `BaseLayout` CSS on every page, and
**nothing in `ai-lab.css`, `ai-lab.astro` or `Pipeline.astro` sets `outline`
at all**, so there is nothing new that could suppress it. M05 verified the same
rule live, on the same shared header and footer, with zero failures. Recorded
as a limitation rather than claimed as a pass.

### 1F.9 Performance

| | Bytes |
|---|---|
| `/ai-lab` HTML | 59,402 |
| `ai-lab.css` | 10,631 |
| `BaseLayout.css` | 18,472 |
| **JS on `/ai-lab`** | **639** — one script, the world gate |
| `dist/` total | 402,680 |
| Build | 15 pages in ~1.4 s |

No Three.js, no WebGL, no animation library, no CDN, no client-side API call.
`astro` remains the only production dependency. The page is the largest HTML in
the archive because it contains the most text, which is the right reason.

### 1F.10 Responsive testing

Overflow sweep at every width the brief lists — **320 / 360 / 375 / 390 / 414 /
768 / 1024 / 1280 / 1366 / 1440 / 1920** — across `/ai-lab`, `/`, `/about`,
`/projects`, `/github`, `/learning` and `/contact`, measuring
`documentElement.scrollWidth` against `clientWidth`.

**One overflow found, and traced to root cause.** `/ai-lab` was 4 px wide at
320 px. The offender was not the paragraph it appeared in: `<code>` containing
`app/services/ai_service.py` measures 238 px as one unbreakable token, which
set the **min-content width of its grid item**, which sized the experiment
list's auto track to 289 px inside a 264 px container. Fixed with
`overflow-wrap: anywhere` on inline code in both places it appears. Re-swept at
all eleven widths across all seven pages: **zero overflow.**

Recorded because the diagnosis is the interesting part — the overflow was in
the list track, three levels up from the element that caused it, and the first
four guesses were all wrong. It took measuring min-content per node to find.

Recomposition verified at 375 px: pipelines stack vertically with downward
connectors (`grid-auto-flow: row`), both tables become labelled blocks with the
column heading carried by `::before`, stage width 278 px, zero overflow.

### 1F.11 Browser and no-JS testing

**Chrome 151 (Windows 11) — verified.** Firefox, Safari, Edge and real mobile
devices: **not tested.** No additional browser infrastructure was installed,
per the brief, and nothing is claimed that was not run.

**JavaScript disabled** — a sandboxed frame with scripting denied, compared
against the same page with scripting allowed:

| | No-JS | With JS |
|---|---|---|
| Characters | 21,585 | 21,585 |
| Pipelines / stages | 6 / 31 | 6 / 31 |
| Experiment records | 5 | 5 |
| System index rows | 7 | 7 |
| Provenance rows | 9 | 9 |

**Byte-for-byte identical.** The world's only script is the shared gate, which
is an entrance, not content.

**Console: clean.** No errors, warnings or rejections.

### 1F.12 Security

The credential scan added in M05 covers the new page and its assets: **clean**.
`npm audit`: **0 vulnerabilities**.

Nothing on this page exposes a key, a token, a private path or a private
configuration. Two specific cares were taken:

- `beach_buggy_ai` ships a `.env.example` with empty placeholders and no
  committed `.env`. That is good practice and is described as key-gated; no
  value is reproduced.
- Local machine paths are not published. The page says `localhost:11434`
  because that is the documented default port of a public tool, not a fact
  about anyone's machine.

The M05 finding stands unchanged: the **OpenWeatherMap key hardcoded in
`Agriculture_simulator` still needs revoking**. It is outside this repository.

### 1F.13 M06 scope compliance

| World | State |
|---|---|
| **HOME** | **COMPLETE** |
| **ABOUT** | **COMPLETE** |
| **PROJECTS** | **COMPLETE** |
| **AI LAB** | **COMPLETE** |
| **CYBERSECURITY** | **NOT STARTED** |
| **LEARNING** | **NOT STARTED** |
| **GITHUB** | **NOT STARTED** |
| **CONTACT** | **NOT STARTED** |

Two changes were made outside AI LAB, both of them consequences rather than
scope creep:

1. **`TitleBlock`'s styles moved into the component.** They lived in
   `styles/projects.css`, which worked exactly as long as PROJECTS was the only
   world importing it — AI LAB rendered the same component as an unstyled
   definition list. A shared component that only looks right inside one world
   is shared by accident. This is the "genuine shared-system bug" exception the
   brief allows. The per-world entrance animation stays in the world
   stylesheet, because that part really is choreography.
2. **One sentence added to the PROJECTS intro**, linking into the lab, per the
   brief's §27 world relationship.

HOME and ABOUT were not modified. No dependency was added. The CSP was not
weakened. **V1 remains byte-identical, `main` is unmodified, nothing is
merged.** HOME, ABOUT and PROJECTS were re-verified after the shared-component
change: build green, output assertions green, zero overflow at every width.

### 1F.14 Known limitations

1. **Live keyboard focus could not be re-verified** this session — see §1F.8.
   Structurally intact and verified live in M05; not re-run.
2. **Firefox, Safari, Edge and real mobile remain untested.** Open since M02.
3. **Lighthouse, axe and a screen-reader pass have not been run.**
4. **Nothing on this bench is measured**, which is the world's own headline
   finding and also its largest gap. Latency on the local model, false-trigger
   rate on the gesture threshold, and crop accuracy against a labelled set are
   three cheap experiments, none of them run.
5. **No model has been trained.** Recorded as a station rather than hidden, and
   named as the next thing to learn.
6. **`/cybersecurity`, `/learning`, `/github`, `/contact` are M02 shells.**
7. **The gate choreography is still untuned** and scroll-driven composition is
   still unimplemented. Open since M03-B.
8. **The OpenWeatherMap key in `Agriculture_simulator` is still live.**

### 1F.15 Commits

| Hash | Commit |
|---|---|
| `06db020` | feat(world): rename the AI world and print it on bench paper |
| `d4dea43` | feat(ai-lab): add the traverse entrance |
| `8ec940f` | feat(ai-lab): file five verified experiment records |
| `268e323` | feat(ai-lab): build the experimental laboratory |
| `7f1b336` | test(ai-lab): assert the world cannot quietly start overstating |
| _this_ | docs: record M06 — the AI Lab world |

```
src/lib/worlds.ts                      ai → ai-lab, traverse, gate copy
src/styles/worlds.css                  bench stock + graduated ground
src/styles/gate.css                    the traverse entrance
src/pages/ai.astro → ai-lab.astro      the laboratory
src/styles/ai-lab.css                  new — the bench furniture
src/components/ai-lab/Pipeline.astro   new — a signal path, as a list
src/content/experiments/*.md           new — five verified records
src/components/projects/TitleBlock.astro   + its own styles, scoped
src/styles/projects.css                − the styles that moved
src/pages/projects/index.astro         + the link into the lab
scripts/verify-output.mjs              + AI Lab assertions, route rename
```

---

## 1G. M07 — GitHub world

**Status: M07 — GITHUB — COMPLETE.** Awaiting architectural review.
**Scope:** one objective. Build the GITHUB world on the M04 system and the M05
data pipeline. No other world was built; see §1G.13.

### 1G.0 Concept — a register, not a dashboard

PROJECTS says what was built. AI LAB says how the intelligence in it works.
This world says **where the source is**, and it is the only one of the three
whose content is entirely fetched rather than written.

The route did not change: `/github` was already correct, so unlike M06 this
milestone renamed nothing. The world's *name* did — **Code Repository** became
**Public Code Archive**, because "code repository" describes a thing on GitHub
and this page is a record of them.

**The standing claim**, set as a ruled entry rather than a pull-quote:

> I don't want my portfolio to tell you that I can code. I want the source to
> show you.

Followed immediately by the qualification that keeps it honest — *that is not
a claim that any of this is production quality; most of it is not.* The claim
is only that nothing on this site has to be taken on trust.

### 1G.1 The decision that shaped the world: nothing is hidden

`EXCLUDED_REPOS` had existed since M02, carried over from a hardcoded array in
V1's `main.js`. It dropped three repositories from the index: the profile
README, this website, and a personal page.

That is defensible on a portfolio grid. It is **indefensible on a page whose
claim is that the source is the record.** An archive that quietly omits three
of its ten holdings is not an archive, and a visitor has no way to know the
omission happened.

So it was deleted and replaced by `REPO_KIND` — a classification, not a filter:

| Class | Repositories |
|---|---|
| `project` | YushaCyber, jarvis_assistant, Agriculture_simulator |
| `code` | beach_buggy_ai, x-man |
| `notes` | cyber-security, Jarvis-AI-Assistant |
| `site` | ayushrijal.com.np |
| `profile` | ayushrijal83-ops |
| `personal` | A-Universe-For-You |

A profile README being a profile README is a fact worth **stating**, not a
reason to delete a row. The register prints the class and the reader decides
what to weigh.

`publicRepos()` changed to match. It now drops only **forks** — public code,
but not authored work, and the register makes a claim about authorship — and
**keeps archived repositories**, marked. An archive that drops the archived
material has misunderstood the word.

### 1G.2 Visual system — accounting stationery

| Element | Decision |
|---|---|
| Stock | `#ebedf1` — the only genuinely BLUE paper in the archive, against HOME's warm drafting, ABOUT's manila, PROJECTS' neutral grey and AI LAB's bench white. Ink ramp 14.81 / 7.49 / 5.73 / 4.86 |
| Accent | Graphite `#40484f`, 7.94:1. The least chromatic accent in the archive on purpose — this world's job is to get out of the way of the record |
| Spot | The archive's red appears exactly once, as the stamp on the compiled date, which is what a spot colour is for |
| Ground | Vertical column rules only, on `--ledger-column`. The only ground in the archive ruled the short way — which is what a register looks like before it is filled in |
| Entrance | `ruling` — the plate ruled away column by column |
| Grammar | Numbered folios. A register, a tally, a dated list, a section of absences, a stamp |

No card grid, no tile, no widget, no metric, no GitHub logo, no green, no
terminal. GitHub's own visual identity appears nowhere on the page; the
provenance is carried by the word *GitHub* and the profile URL.

### 1G.3 Data architecture — reused, unchanged

```
GitHub Actions (push to v2, and every 6h)
   └─ scripts/fetch-github.mjs, with the runner's GITHUB_TOKEN
        └─ src/data/github.generated.json  →  src/data/github.snapshot.json
             └─ lib/github.ts, at build time
                  └─ static HTML
```

**Nothing in the M05 pipeline was modified.** No workflow changed, no field was
added to the snapshot, `fetch-github.mjs` was not touched. The snapshot already
carried everything this world needed — name, description, url, language, stars,
forks, pushedAt, createdAt, topics, archived, fork — and the world was built
against what exists rather than the other way round.

`verify-output.mjs` still fails the build if any page contains
`api.github.com`. No request leaves a visitor's browser.

### 1G.4 The register of holdings

A real `<table>`: ten rows, one per public repository, most recently pushed
first. Columns are No. / Repository / Class / Language / Last push / Source.

The **description sits inside the repository cell**, not in a column of its
own — a description is part of what the holding is, not a separate
measurement, and giving it a column would force every other column narrow to
serve the longest sentence. Descriptions are **GitHub's own words, quoted**,
rendered inside typographic quotation marks so the attribution survives a
reader forgetting the caption said so. A repository with no description prints
`NO DESCRIPTION ON GITHUB` rather than a gap or an invented line.

Keyboard cost is one tab stop per row, two for the three that also carry a
curated record. No row is a giant link.

**And one quotation earns the entire two-layer design.** YushaCyber's GitHub
description says it has *"a thriving community"*; its workshop record says it
has no users to speak of. Both stay on the site, a note under the register
says why, and neither was edited to agree with the other. Rewriting the
quotation would have erased exactly the difference that separating the layers
exists to preserve.

### 1G.5 Provenance and what is deliberately absent

**Folio 03 — the language tally.** One cell per repository: Python 4, HTML 3,
Unclassified 3. It counts **repositories**, not lines and not bytes, and the
lede says so — GitHub assigns one primary language per repository and the
snapshot carries nothing finer, so a percentage would be a proportion of
something nobody measured. Drawn as discrete cells you can count against the
printed number rather than as a continuous bar, and unclassified repositories
get open cells rather than a fourth colour. The page names its own blunt
instrument: `Agriculture_simulator` counts as HTML because it is mostly Jinja
templates, while its logic is Python.

**Folio 04 — last push.** The date of the most recent push per repository, and
the lede states what that is *not*: not a commit count, not activity, not a
streak. A repository pushed once and one pushed a hundred times show the same
single date.

**Folio 05 — what the snapshot does not contain.** Its own heading, in the same
weight as the folios that contain something:

| Absent | Why |
|---|---|
| Contribution totals | `contributions` is null. Totals need GraphQL, which mandates a token — fetched properly or left absent, never estimated |
| Commit counts and streaks | Not in the snapshot and not derivable from it |
| Lines or bytes of code | GitHub reports one primary language per repository and nothing finer at this endpoint |
| Private work | The public record only; its absence is not a claim that nothing else exists |

Every one of those could be invented convincingly from the data that *is*
here, and each would be a lie of a slightly different kind. A contribution
heatmap is the single most common fabrication on pages like this one, and this
page says outright that it does not have the data for one.

**Folio 06 — provenance.** How the facts arrived, and the stamp: everything
above is only true as of the compiled date.

### 1G.6 GitHub profile integration

`https://github.com/ayushrijal83-ops`, read from `SITE.github` rather than
typed — the username is already configured and guessing it was explicitly
forbidden. It appears as the single call to action in folio 06, at `--step-1`
on a ruled underline; still a link, because this archive has no buttons. It is
also present in the fallback state, which is the case where it matters most.

`verify-output.mjs` fails the build if the archive has no link to the profile
it is an archive of.

### 1G.7 Projects ↔ GitHub

The join is on the repository URL, the same key `repoByUrl` uses in the other
direction, built as a Map so a mistyped URL fails to link rather than linking
to the wrong record.

- **Folio 01 · Cross-referenced** — the three repositories that also hold a
  written record, at the top rather than buried, because a visitor arriving
  from a project record needs the return path immediately.
- **The register's Source column** carries `Record` alongside the repository
  link on those three rows.
- Featured by **whether a curated record exists**, never by stars. The star
  counts on this account are 1, 1 and 0, and ranking by them would rank
  nothing. The page says so.

No project narrative is repeated. This world links to the record; it does not
summarise it.

### 1G.8 Fallback

The M05 contract is unchanged and authoritative: `generated.json` → committed
`snapshot.json` → `null`.

This world is **the hardest case on the site under that third state**, because
it has no curated layer to fall back on — every word in its body comes from
the snapshot. With no data it must render its designed unavailable state, not
an empty register. An empty register would read as *this person has no public
code*: the opposite of true, and the worst thing this world could accidentally
say.

`npm run test:github` now drives it through that state by hiding both data
files and rebuilding. Five new assertions on top of the M05 thirteen — **18
total, all passing**: the archive still builds and titles itself, it declares
the data unavailable, it still reaches the profile, it shows no empty register,
and it claims no holdings it cannot list.

### 1G.9 Security

Credential scan over `dist/`: **clean**. `npm audit`: **0 vulnerabilities**.
No token, Authorization header, API secret, private key, environment value or
local path is shipped. The public username and public repository URLs are the
only external identifiers on the page, and both are public by definition.

`GITHUB_TOKEN` remains confined to the Actions runner; nothing about that
changed in M07 because nothing about the pipeline changed.

**The M05 finding stands, unchanged and unresolved:** an exposed credential was
identified in `Agriculture_simulator`, a separate repository outside this one.
It requires revocation and rotation. The value is not reproduced here or
anywhere on the site, and **nothing in this archive should be read as a claim
that that repository is security-clean** — it is listed as a holding, which is
a statement about existence, not about hygiene.

### 1G.10 Accessibility

Verified in Chrome 151 against the built output.

| Check | Result |
|---|---|
| Headings | One `<h1>`, seven `<h2>`. No level skipped |
| Landmarks | `header` / `nav` / `main` / `footer` |
| `aria-current` | Set on the GitHub nav item |
| Skip link | Present, `#main` exists |
| Table semantics | A real `<table>` — caption, six `scope="col"` headers, ten `scope="row"` row headers. Not divs |
| Narrow screens | Below 48rem the register becomes labelled blocks, `data-label` carrying the column heading via `::before`; `thead` is clipped, not `display: none`, so it stays in the accessibility tree |
| External links | 15 on the page; all carry `rel="noopener noreferrer"`; 14 carry a visible ↗ marker |
| Tally | The cells are `aria-hidden`; every row carries its count as text, so a screen reader gets "PYTHON — 4 repositories" rather than eleven empty spans |
| Colour alone | Never. Every class mark, tally row and stamp is paired with its word |
| Forced colours | The tally's filled/open distinction survives on the border |
| Reduced motion | All motion inside `no-preference`, `backwards` fill, unanimated state is the finished state |
| Contrast | Ledger stock clears every ink step at AA; asserted in the build |
| SVG | None on the page |

**Two things recorded honestly rather than fixed:**

1. **The live keyboard focus pass could not be run**, for the same reason as
   M06: the browser window had no OS focus, so `document.hasFocus()` was false
   and `:focus-visible` could not be exercised. Verified instead that the rule
   ships on every page and that **nothing in `github.css` or `github.astro`
   sets `outline` at all**. M05 verified it live on the same shared chrome.
2. **The fifteenth external link is the colophon's**, in the shared
   `SiteFooter`, and it carries no ↗. That is deliberate and it was left alone:
   it is a colophon signature (`Ayush Rijal · 2026 · github`), not a
   navigational link in body content, and adding a marker there would change
   the footer of all eight worlds — shared chrome, outside this milestone, and
   an architect-level consistency call rather than a GitHub-world defect.

### 1G.11 Performance

| | Bytes |
|---|---|
| `/github` HTML | 35,418 |
| `github.css` | 8,656 |
| `BaseLayout.css` | 20,340 |
| **JS on `/github`** | **639** — one script, the world gate |
| `dist/` total | 435,920 |
| Build | 15 pages in ~1.2 s |

No charting library, no visualisation framework, no Three.js, no WebGL, no CDN,
no client-side API call. The tally is ten `<span>`s. `astro` remains the only
production dependency.

### 1G.12 Responsive, browser and no-JS testing

**Responsive.** Overflow sweep at every width the brief lists — 320 / 360 /
375 / 390 / 414 / 768 / 1024 / 1280 / 1366 / 1440 / 1920 — across `/github`,
`/`, `/about`, `/projects`, `/ai-lab`, `/learning`, `/cybersecurity` and
`/contact`. **Zero overflow at every width on every page.**

Then a **stress test for data that does not exist yet**, because the brief
names long repository names and URLs specifically: at 320 px, a 66-character
repository name, a full repository URL inside the description, and a
66-character link label were injected into the register. Overflow before: 0.
Overflow after: **0**. The `overflow-wrap: anywhere` on repository names, link
text and inline code holds for names far longer than any that exist.

**No-JS.** Sandboxed frame with scripting denied, against the same page with
scripting allowed:

| | No-JS | With JS |
|---|---|---|
| Characters | 6,836 | 6,836 |
| Register rows | 10 | 10 |
| Cross-references / tally / pushes / absences | 3 / 3 / 10 / 4 | identical |
| GitHub links / project links / stamp | 15 / 7 / yes | identical |

**Byte-for-byte identical.** No filter or dashboard JavaScript was written — a
ten-row register does not need one, and §11 of the brief says not to build it
if it adds complexity without value.

**Browsers.** Chrome 151 (Windows 11) verified. **Firefox, Safari, Edge and
real mobile devices: not tested**, no additional infrastructure installed, and
nothing claimed that was not run.

**Console: clean** across all eleven routes.

### 1G.13 Regression and scope compliance

All eight worlds and the three project records were re-loaded after the change
and checked for a thrown error, a missing `<h1>`, a wrong `data-world`, a
missing gate kind and a missing `#main`. **Zero errors; every page correct.**
Gate kinds resolve as `register` / `drawer` / `sheet` / `traverse` / `ruling` /
`seal` / `leaf` / `transmit`. `TitleBlock`, the world tokens, the skip links
and the GitHub data pipeline are unchanged and working.

| World | State |
|---|---|
| **HOME** | **COMPLETE** |
| **ABOUT** | **COMPLETE** |
| **PROJECTS** | **COMPLETE** |
| **AI LAB** | **COMPLETE** |
| **GITHUB** | **COMPLETE** |
| **CYBERSECURITY** | **NOT STARTED** |
| **LEARNING** | **NOT STARTED** |
| **CONTACT** | **NOT STARTED** |

No world outside GITHUB was modified — not even by a sentence, unlike M06.
`lib/github.ts` changed, but it is the M05 data layer this world consumes, not
another world. No dependency was added. The CSP was not weakened. No workflow
was touched. **V1 remains byte-identical, `main` is unmodified, nothing is
merged.**

### 1G.14 Known limitations

1. **Live keyboard focus not re-verified** — see §1G.10.1. Structurally intact;
   verified live in M05.
2. **Firefox, Safari, Edge and real mobile remain untested.** Open since M02.
3. **Lighthouse, axe and a screen-reader pass have not been run.**
4. **No contribution data.** `contributions` is null and will stay null until
   the workflow adds a GraphQL call. That is a deliberate absence, documented
   on the page itself in folio 05, not an oversight.
5. **The language tally is coarse** and the page says so. Repository counts,
   not bytes; GitHub's primary-language call is a fact about a repository, not
   about the work in it.
6. **`REPO_KIND` is hand-maintained.** A new repository defaults to `code`,
   which is honest but unspecific, and nothing fails if the class is never
   refined. The completeness assertion catches a *missing* repository, not a
   *misclassified* one.
7. **The colophon's external link carries no marker** — see §1G.10.2.
   Deliberate; shared chrome.
8. **The scheduled `github-data.yml` run is still unobserved**, as it has been
   since M05. Its logic is exercised locally.
9. **The OpenWeatherMap key in `Agriculture_simulator` is still live** and
   still needs revoking. Outside this repository. See §1G.9.

### 1G.15 Commits

| Hash | Commit |
|---|---|
| `15316c2` | feat(world): give GitHub its ledger stock, and stop hiding holdings |
| `4e3d581` | feat(github): add the ruling entrance |
| `cbedd89` | feat(github): build the public code archive |
| `3b79f29` | test(github): assert the archive stays complete, and the fallback readable |
| _this_ | docs: record M07 — the GitHub world |

```
src/lib/worlds.ts        Public Code Archive, ruling, gate copy
src/lib/github.ts        REPO_KIND replaces EXCLUDED_REPOS; publicRepos
src/styles/worlds.css    ledger stock + --ledger-column
src/styles/gate.css      the ruling entrance
src/pages/github.astro   the archive — six folios
src/styles/github.css    new — accounting stationery
scripts/verify-output.mjs  + completeness, profile, no-proportion assertions
scripts/test-github.mjs    + the archive under the no-data state (18 total)
```

Unchanged, deliberately: `.github/workflows/*`, `scripts/fetch-github.mjs`,
`src/data/*`, and every world outside GITHUB.

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

**9.5 Information architecture and URL scheme.** *M06 amendment: the AI world moved from `/ai` to `/ai-lab` when it was built (§1F.0). The eight-world list is otherwise unchanged, and the redirect map (R10) is still outstanding.*  The brief names 8 worlds; the site has 5 content pages. Confirm the final section list, the URL for each, and the redirect map for the 6 currently-indexed URLs (R10).

**9.6 GitHub Actions budget. CLOSED in M05.** Implemented at the recommended cadence: `github-data.yml` runs every 6 hours plus on demand, and `ci.yml` refreshes on every push to `v2`. Four scheduled runs a day at roughly twenty seconds each. See §1E.3.

**9.7 YushaCyber. Still open, and now the most-linked thing on the site.** Three worlds reference it — the PROJECTS record, the AI LAB system index and the GITHUB register, where its GitHub description claims "a thriving community" against a curated record that says it has no users (§1G.4).  Its "Explore" CTA is currently a disabled `#`. Is a real destination expected during V2, or does it remain GitHub-only?

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

**Resolved in M02:** K1 (Node installed, Astro adopted), K2 (`.gitignore` in place), K3 (no CDN, no three.js, CSP shipped), K5 (component architecture), K8/K10/K13 (do not exist in V2), K9 (V2 escapes all interpolation). **Resolved in M05:** K4 — the Actions workflows landed (§1E.3), the fallback is tested by breaking it (§1E.4), and no shipped page may reference `api.github.com`. K6, K7, K11 and K12 remain open — K6 for the worlds whose copy is still unverified, K7 and K12 until cutover.

**Open on `v2`:** gate choreography untuned; scroll-driven composition unimplemented; `frame-ancestors` undeliverable on GitHub Pages; V1 redirect map (R10) still outstanding; cross-browser, mobile and screen-reader verification not yet performed (Chrome 151 only — see §1E.10).

| ID | Issue (V1 baseline, M01) | Severity |
|---|---|---|
| K1 | No Node.js on the dev machine — blocks any build-based V2 | ~~Blocking~~ **Resolved M02** |
| K2 | No `.gitignore` — secret/artifact leak risk the moment a build lands | ~~High~~ **Resolved M02** |
| K3 | three.js via CDN, no SRI, no CSP, 58% of page weight | ~~High~~ **Resolved M02** |
| K4 | Client-side GitHub API, 60 req/hr/IP shared across visitors | ~~Medium~~ **Resolved M05** — build-time only, two workflows, verified fallback (§1E.3–§1E.4) |
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

## 14. Next milestone — M08 recommendation

**M08 — LEARNING, and content verification for CYBERSECURITY started in
parallel.** Three worlds remain and they are not equally ready. GITHUB was
buildable immediately because every fact on it was already fetched; the three
that are left all need copy that does not exist yet, and one of them is the
highest-risk page on the site.

Recommended order:

1. **Start the §9.4 verification session for CYBERSECURITY now, before
   building anything.** It is the longest-lead item left and it blocks the
   riskiest world. The brief forbids fabricated certifications, labs and CTF
   results, and the `labs` schema already carries `discipline`,
   `authorisation`, `cve` and `severity` fields precisely because that world
   has to prove every claim. Do not build it and verify afterwards — M05 spent
   more effort correcting three already-"verified" project records than
   building the world around them.
2. **Build LEARNING next**, not CYBERSECURITY. Its content is field notes,
   which are self-verifying in a way lab write-ups are not: a note about what
   was read and what was understood is true because it was written, and the
   `learning` schema deliberately has no proficiency or completion field to
   fabricate. It is also the natural home for AI LAB's open question — the
   `cyber-security` repository's "daily basis for 6 months" is a learning log
   with nothing rendering it.
3. **Then CYBERSECURITY**, once §9.4 has covered it, then CONTACT, which is the
   smallest and has one open overflow fix already landed.
4. **Measure something on the AI Lab bench** (§1F.14.4). Still nothing there is
   instrumented, and three cheap experiments would each turn a "not measured"
   into a result.
5. **Revoke the OpenWeatherMap key** in `Agriculture_simulator` (§1E.5, §1G.9).
   Outstanding since M05, outside this repository, not waiting on a milestone.
6. **Answer §9.7.** YushaCyber is now referenced from three worlds and none of
   them can offer a destination beyond a repository.
7. **Then** tune the gate choreography, with five worlds to move between and
   five distinct entrance motions to tune against one another.
8. **Build the redirect map** (R10) before any cutover discussion. Six V1 URLs;
   `/ai` → `/ai-lab` is not among them, because that route was never published.

**M08 exit criteria:** LEARNING built and reviewed; CYBERSECURITY content
verification underway or complete; CI green including `npm run test:github`;
the first scheduled `github-data.yml` run observed — unobserved since M05. V1
still live and unmodified throughout.

---

## 14A. M07 recommendation (M06 record, now complete)

**M07 — GITHUB, because it is the world the architecture has already built.**
Four worlds remain and they are not equally ready. Pick by what can be
verified, not by IA order.

Recommended order:

1. **Build GITHUB next.** The snapshot already holds everything it needs,
   `publicRepos()` and `EXCLUDED_REPOS` were written in M02 and have never
   been rendered, and the fallback contract and its test already exist. It is
   the only remaining world whose content requires no verification session,
   because every fact on it comes from the API.
2. **Do not attempt CYBERSECURITY until §9.4 covers it.** It is the highest
   fabrication risk on the site — labs, CTF results and certifications are
   exactly what the brief forbids inventing — and the `labs` schema already
   carries `authorisation`, `discipline` and `cve` fields precisely because
   that world will need to prove every claim.
3. **Measure something on the bench.** AI LAB's own finding is that nothing in
   it is instrumented (§1F.14.4). Latency on the local model, false-trigger
   rate on the gesture threshold, and crop accuracy against a labelled set are
   three cheap experiments, and each would turn a "not measured" into a
   result. That is more valuable than an eighth system on the index.
4. **Revoke the OpenWeatherMap key** in `Agriculture_simulator` (§1E.5). Still
   outstanding, still outside this repository, still not waiting on a
   milestone.
5. **Answer §9.7.** Two worlds now link YushaCyber and neither can offer a
   destination beyond a repository.
6. **Then** tune the gate choreography, with four worlds to move between and
   four distinct entrance motions to tune against each other.
7. **Build the redirect map** (R10) before any cutover discussion. `/ai` →
   `/ai-lab` is not in it — that route was never published — but the six V1
   URLs still are.

**M07 exit criteria:** GITHUB built and reviewed; its content verified against
the snapshot rather than against memory; CI green including
`npm run test:github`; the first scheduled `github-data.yml` run observed —
still unobserved since M05. V1 still live and unmodified throughout.

---

## 14B. M06 recommendation (M05 record, now complete)

**M06 — one more world, on the system that now has two worlds' worth of
evidence behind it.** PROJECTS is the second content world built on the M04
system and the first to join curated narrative to fetched facts. Nothing in it
required a change to the world system, which is the strongest signal so far
that the architecture holds.

Recommended order:

1. **Run §9.4 content verification for the next world's copy before building
   it.** M05 spent more effort correcting three already-"verified" records than
   it did building the world around them — and the corrections included two
   *understatements*, produced by trusting a README instead of reading source.
   The lesson generalises: verify against code, not against documentation, and
   do it before the page exists rather than after.
2. **Pick the next world by which content is verifiable, not by IA order.**
   GITHUB is the cheapest — the snapshot already holds everything it needs and
   `publicRepos()` is already written. CYBERSECURITY is the highest-risk for
   fabricated claims and should not be attempted until §9.4 has covered it.
3. **Revoke the OpenWeatherMap key** in `Agriculture_simulator` (§1E.5). Small,
   outside this repository, and it should not wait for a milestone.
4. **Answer §9.7** — whether YushaCyber gets a real destination. It is now a
   live question, since the record links a repository and nothing else.
5. **Then** tune the gate choreography, with three worlds to move between.
6. **Build the redirect map** (R10) before any cutover discussion.

**M06 exit criteria:** one further world built and reviewed; its content
verified against source before publication; CI green including
`npm run test:github`; the first scheduled `github-data.yml` run observed. V1
still live and unmodified throughout.

---

## 14C. M03 recommendation (M02 record, now complete)

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

## 14D. M02 recommendation (M01 record, now complete)

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

*End of M07 — GITHUB COMPLETE. Five worlds built: HOME, ABOUT, PROJECTS, AI LAB, GITHUB. Awaiting architectural review. CYBERSECURITY, LEARNING and CONTACT are NOT STARTED, and no work on them should begin until this milestone is reviewed.*
