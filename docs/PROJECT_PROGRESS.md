# Ayush Rijal Portfolio V2 — Project Progress

**Central project state document.** Read this before every development session. Update it before stopping work.

| | |
|---|---|
| **Owner** | Ayush Rijal |
| **Architect / product lead / design review** | ChatGPT |
| **Implementation** | Senior Developer (Claude) |
| **Repository** | `ayushrijal83-ops/ayushrijal.com.np` |
| **Production URL** | https://ayushrijal.com.np |
| **Current milestone** | **M19 — Final QA, accessibility, cross-browser verification & release — PROJECT COMPLETE** |
| **M19 status** | **COMPLETE — PRODUCTION RELEASE VERIFIED.** Final milestone. QA only: three defects found by M19's own verification and fixed, all in `/lab/` — total product diff **3 files, +11 −4**. Responsive **136 cells across 8 widths: 0 findings** after fix (5 before). **axe-core 4.13.0: 0 violations** on every route (2 rules before). Reduced motion verified by engine emulation — **0 animation objects at all** under `reduce`, in all three engines. Cross-browser **Chromium 151 / Firefox 153 / WebKit 26.5, 51 cells each, 0 findings**; **Safari itself NOT TESTED — no Apple hardware**. Security: 0 credentials, 0 source maps, 0 network-capable JS, 0 external loads, CSP on 17/17, `npm audit` clean. **No floating Kali dragon exists in this repository** — verified by grep over source and `dist`; the pointer-reactive wordmark was QA'd against the Phase 4 criteria instead. See §1U. |
| **M18 status** | **COMPLETE — SNAPSHOT-TO-PRODUCTION AUTOMATION VERIFIED.** The scheduled chain was observed end to end on 2026-08-25: `github-data` run **32850891668** (event `schedule`) → bot commit **`9d64237`** 13:01:53Z → Deploy run **32850928044** (event `workflow_dispatch`, `head_sha` = that commit exactly) → all four gates green in 29 s → `deploy-pages` executed → `github-pages` deployment **6083695789** success 13:03:22Z, live `Last-Modified` 13:02:42 GMT. Objective B also complete: PR **#1** produced the first `pull_request` CI run **32825354280**, four gates green, **zero** Deploy runs on the branch. See §1T.
| **M17 status** | **COMPLETE — VERIFIED.** Feature branches now run CI automatically: run `32812105029` on `m17-ci-hardening` (`dcd44e2`) passed all four gates in 25 s, and was the **only** run the branch produced — no Deploy, no Pages deployment, production bytes unchanged. Merge `44f928e`, Deploy `32812259354` success (build 31 s, deploy job **executed** 10 s); production re-verified on nine routes. PR CI **NOT OBSERVED — OWNER ACTION**. See §1S. |
| **M16 status** | **COMPLETE — verified over HTTPS.** Merge `4caff65`, Deploy run `32741152755` success in 60 s with `Test the security content audit` passing on a real runner. `/cybersecurity/` live at **20,059 B, byte-identical to the artifact**; §8c and §8d re-verified against the deployed HTML. See §1R. |
| **M15 status** | **Complete — merged in M16.** Branch `m15-cybersecurity` (`2aac8e7`). Nothing fabricated: the world publishes the evidence boundary, not a portfolio. Audit extended (§8c/§8d), negative-tested 35/35. See §1Q. |
| **M14 status** | **COMPLETE.** HTTPS enforcement **verified** (301 → HTTPS site-wide, valid cert). `github-data.yml` retargeted to `main` (`7ce6e11`), deployed via run `32735886304`, production republished 14:00:30Z and byte-compared against `dist`. `github-data` has **still never executed** — next scheduled 18:00Z. See §1P. |
| **Last updated** | 2026-08-25 |
| **Working branch** | `main` — production, deploys on push. `m18-snapshot-deploy` merged via **PR #1** (`093215d`) and retained; rollback of the snapshot-dispatch change is `git revert -m 1 093215d`. `m17-ci-hardening` merged (`--no-ff`, `44f928e`) and retained; rollback of the CI trigger change is `git revert -m 1 44f928e`. `m15-cybersecurity` merged (`--no-ff`, `4caff65`) and retained. Rollback of the Cybersecurity world is `git revert -m 1 4caff65`; of the V2 cutover, `git revert -m 1 927477a`. |

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
| M08 | Learning world + §9.4 verification for Cybersecurity | **Complete** | §1H below. Awaiting review. Eighteen inert verification regexes repaired. |
| M09 | Contact world | **Complete** | §1I below. Awaiting review. World renamed to Correspondence; no form, by design. |
| M10 | Final integration | **Complete** | §1J below. Awaiting review. Deployment artefacts added; first real keyboard audit. |
| M11 | Cutover preparation | **Complete** | §1K below. Awaiting review. **READY FOR FINAL CUTOVER.** Text-resize limitation closed. |
| M12 | Final cutover | **Complete** | §1L below. **FINAL CUTOVER READY.** v2 pushed; CI observed passing remotely. |
| M13 | Production verification | **Complete — result is BLOCKED** | §1M below. Production observed serving V1. Cutover did not reach GitHub. One blocking defect fixed: `deploy.yml`. |
| M13-B | Deployment recovery | **Complete — cutover still BLOCKED** | §1N below. `deploy.yml` audited, corrected, pushed, and **observed passing on `v2` in 27 s** with the deploy job correctly skipped. Blocked on the Pages source, owner-only. |
| M13-C | **THE CUTOVER** | **COMPLETE — OBSERVED LIVE** | §1O below. Merge `927477a`; Deploy run `32731636983` success, deploy job **executed**; production serving V2, verified over HTTP on every route. |
| M15 | Cybersecurity world | **Complete** | §1Q below. Evidence-based, zero fabrication, 0 findings filed and correctly so. Merged in M16. |
| M16 | Production integration & verification | **Complete — VERIFIED LIVE** | §1R below. Merge `4caff65`, Deploy `32741152755`; `/cybersecurity/` verified over HTTPS byte-identical; §8c/§8d re-run against production. |
| M19 | Final QA, accessibility, cross-browser & release | **COMPLETE — RELEASE VERIFIED** | §1U below. 136 responsive cells / 0 findings; axe 0 violations; reduced motion 0 animations under `reduce`; Chromium+Firefox+WebKit 0 findings, Safari NOT TESTED; 3 defects fixed, all in `/lab/`. |
| M18 | Snapshot deployment gap + PR CI | **COMPLETE — VERIFIED** | §1T below. First `pull_request` CI run `32825354280` green with zero Deploy runs; scheduled chain observed end to end — run `32850891668` → bot commit `9d64237` → `workflow_dispatch` Deploy `32850928044` → Pages deployment `6083695789` success. |
| M17 | Feature-branch CI hardening | **Complete — VERIFIED** | §1S below. CI run `32812105029` on `m17-ci-hardening` green with zero Deploy runs; merge `44f928e`, Deploy `32812259354` success. PR CI **NOT OBSERVED**. |
| M14 | Production hardening & closeout | **Complete** | §1P below. HTTPS enforced and verified; `github-data.yml` → `ref: main`; production re-verified and byte-compared. `github-data` execution **NOT OBSERVED**. |
| Cutover | V1 → V2 | **DONE 2026-08-24** | Production serves V2. Remaining: Enforce HTTPS (owner), `github-data.yml` ref (owner), OpenWeatherMap key (external). |

**M12 scope compliance:** no new world, no redesign, no framework, no CMS, no backend, no third-party contact service, **no dependency added**. **CYBERSECURITY was not built and not modified.** Three changes, each a defect found by this milestone’s own audits: the archive called the head-pose estimate “gaze” in two tables while its own experiment says it is not (§1L.2); the 404 page was indexable; and five assertions were added to hold both. No existing assertion was weakened and no exception was added to make one inert. `v2` was pushed — no force, no history rewritten, nothing merged — and `origin/main` is unchanged at `41d4dc1`. V1 remains byte-identical against both local `main` and `origin/main`. Production still serves V1. See §1L.

**M11 scope compliance:** no new world, no redesign, no framework, no CMS, no backend, no third-party contact service, **no dependency added** (`package.json` and `package-lock.json` unchanged). **CYBERSECURITY was not built and not modified** — only its `summary` string was corrected, because it advertised holdings the archive does not have (§1K.2). Four changes: legacy route handling (§1K.1), the data-table scroll port that closes M10’s text-resize limitation (§1K.11), that summary, and fourteen new assertions. No existing assertion was weakened and no exception was added to make one inert. Nothing is deployed and nothing is merged. V1 remains byte-identical, `main` is unmodified. See §1K.

**M10 scope compliance:** no new world was built and no world was redesigned. **CYBERSECURITY was not built, not modified and not verified further.** Four changes, each an integration defect rather than a feature: `overflow-wrap: anywhere` on `body`, fixing a measured text-resize overflow on every world (§1J.3); `tabindex="-1"` on every `<main>`, fixing a skip link that scrolled without moving focus (§1J.4); five production artefacts the build had never shipped, two of which are deployment blockers (§1J.8); and seven assertions over them. **No dependency was added. No third-party service was introduced. No content claim was rewritten** — the one questionable claim found by the audit is reported in §1J.1 and left for decision. V1 remains byte-identical, `main` is unmodified, nothing is merged. See §1J.

**M09 scope compliance:** the CONTACT world was built. **CYBERSECURITY was not built, not modified and not verified further** — it remains on hold pending the §14 decision recorded in M08. Three changes fell outside CONTACT, each a consequence rather than scope: `global.css` and `ArchiveContents.astro`, because renaming the world to “Correspondence” put a fourteen-character unbreakable word into display type and a horizontal scrollbar onto HOME (§1I.5); `worlds.ts`, for this world’s own name, gate copy and entrance; and `verify-output.mjs`, for the new assertions. **No third-party service and no dependency were introduced** — the no-form decision is what made that possible rather than something that had to be worked around. V1 remains byte-identical, `main` is unmodified, nothing is merged. See §1I.14.

**M08 scope compliance:** the LEARNING world was built. **CYBERSECURITY and CONTACT are NOT STARTED** — they remain M02 shells. No world was redesigned and no built world changed visually. Four changes fell outside LEARNING, each a consequence rather than scope: the verification scripts, whose existing guards turned out not to run at all (§1H.9); four lines in `github.astro` fixing the “0 repositories” fallback that the repaired guard immediately caught; one markdown heading renamed to clear a duplicate id on `/ai-lab`; and `worlds.ts`, for this world’s own summary and entrance. No dependency was added — one was proposed for the duplicate-id fix and rejected as disproportionate. V1 remains byte-identical, `main` is unmodified, nothing is merged. See §1H.14.

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

## 1H. M08 — Learning world, and §9.4 verification for Cybersecurity

**Status: M08 — LEARNING — COMPLETE.** Awaiting architectural review.
**Scope:** two objectives. Build the LEARNING world, and run the §9.4 content
verification for CYBERSECURITY in parallel without building it. Both done; the
second produced a conclusion that changes M09 (§1H.8, §14).

Route `/learning`. World name **Field Notebook**, sheet **AR-05**, ground
`graph`, entrance `leaf`. Eight numbered leaves, seventeen subjects, a
thirteen-entry dated log, five open questions. No client JavaScript beyond the
shared world gate.

### 1H.0 The failure mode this world is designed against

Every other world in the archive can be audited against something. PROJECTS
against three repositories, AI LAB against source constants, GITHUB against a
snapshot fetched at build time. A skills page can be audited against nothing,
and that is not an accident of how they are usually written — it is the format.

"Python — 90%" has no truth conditions. There is no observation that would make
it false, so it cannot be wrong, so the number written is the number the author
would like to be true. Every generic portfolio on the internet contains one and
none of them is lying in any way that can be caught.

So the work of M08 was not designing a page. It was finding a shape for this
content that **can be wrong**, and then filling it only with things that
survived being checked. Everything below follows from that.

### 1H.1 Visual system — the engineering computation pad

| | |
|---|---|
| Stock | `#e9eee9` — pale green pad paper. Raised `#f1f5f0`, recessed `#dfe4df`, edge `#d2d9d2` |
| Ink ramp on that stock | 14.78 / 7.48 / 5.72 / 4.85 — every step above AA, and above the global paper |
| Channel | `#33406b`, writing-ink indigo, **8.57:1** on the stock, so it carries text as well as linework |
| Ground | Fine grid at `--notebook-module / 5`, emphasised every fifth line |
| Spot | Three marks, one meaning |

The stock is the only green paper in the archive. The accent was previously
`#2f4858` — the same drafting blue PROJECTS is drawn in, which is how eight
worlds converge on one look; indigo is the colour of the **pen** rather than of
the print, and this is the one world whose marks were made by hand.

Three devices carry the identity and no others:

1. **The margin rule.** One red vertical line down the inline-start of the
   writing area. The most recognisable piece of furniture on a sheet of
   computation paper, and the place this world's spot use is defined.
2. **The annotation register.** Where other worlds tabulate a fact, this one
   tabulates a fact *and its basis*, set as a marginal note in mono.
3. **The date in the margin.** The field log puts its date outside the writing,
   as the thing that files the entry rather than as a column of data.

**On the spot colour.** GITHUB spends its red exactly once, on the compiled
stamp. This world spends it three times — the margin rule, the numbering of the
open questions, and the single standing that reads `Not attempted` — for six
marks on the page in total. That is the same discipline rather than a
relaxation of it, because all six mean one thing: *this still wants attention*.
The rule is written at the top of `styles/learning.css`, because a spot colour
without a stated rule becomes decoration within one milestone.

Below 48rem the margin rule stays but its indent goes to zero. A phone has no
room for a margin, and spending 40px of a 280px measure on one costs the
evidence column more than the device is worth — the lesson of the M06 overflow,
where an unbreakable literal three levels down a grid set the minimum width.

### 1H.2 The register — standing and basis

Nothing carries a level. Every subject carries two fields, and both can be
wrong:

**STANDING** — what was actually done. Five values, and they are **not a
ranking**: `Built`, `Experimented`, `Currently learning`, `Exploring`,
`Not attempted`.

**BASIS** — whether anyone else can check. `Verified` (read out of source, with
the file, constant or commit range named), `Partly verified` (the evidence says
which half is which), `Stated` (the owner said so and this archive holds
nothing that shows it).

Both axes are explained in a legend on the page before the register uses them,
because the whole design fails if a reader collapses them into one scale.

Two decisions inside that:

**`Stated` is a first-class answer.** C, German and the degree have no artifact
here. They are in the register, marked, rather than dropped. Dropping them
would make the register look stronger by removing exactly the parts nobody can
check — the same lie in a subtler shape.

**`Not attempted` is a standing.** The most useful line on a page about
learning is often the one saying a thing was never done. *Training a model*
carries it, and its evidence is an absence read out of every repository.

Grouped by strand, never sorted by standing. Sorting by standing would put the
bar chart back on the page with the numbers taken off.

### 1H.3 What was verified, subject by subject

Seventeen subjects in five strands. Sources: the public repositories through
the GitHub API, `YushaCyber` from the local clone verified in M05, and the AI
capabilities from the M06 audit (§1F.3).

| Strand | Verified | Partly | Stated |
|---|---|---|---|
| AI and language models | 5 | — | — |
| Programming | 3 | — | 1 |
| Cybersecurity | 4 | 1 | — |
| Systems and hardware | — | 1 | — |
| Away from the machine | — | — | 2 |

Three of the seventeen are `Stated`, and the page says so in its own opening
paragraph rather than leaving it to be counted.

Where the M08 verification changed what would otherwise have been written:

- **Nmap and packet analysis** were going to be `Stated` — the brief lists them
  as things being learned and no repository has a scan or a capture in it.
  Reading `YushaCyber` turned them into `Verified`, but for a different claim
  than the obvious one. See §1H.5.
- **Networking** is the only `Partly verified` in its strand, and the split is
  stated on the row: SSH and ports from Bandit 0, then five lab modules with
  tests. "Advanced networking", which V1 claims, is not supported by either.
- **Hardware** was going to be `Stated` from the personal record's interest
  list. The vision and speech constants — 1280×720 captured, 320×240 inferred,
  capture stopping 450 ms below energy 400 — are evidence of working against
  real devices, so it is `Partly verified` with the boundary written out.

### 1H.4 The field log — Bandit 0 to 13

The strongest content in the world, and none of it was written for the site.

| | |
|---|---|
| Source | `ayushrijal83-ops/cyber-security`, public |
| Levels | 0 → 13, thirteen transitions, each with its own note file |
| Commits | 19, across 6 active days |
| Range | 13 → 20 August 2026 (repository created 11 August) |
| Own notes | 6 commands got a second file of their own |

Each row states what the level turned on, taken from the note written for it —
`cat ./-` versus `cat -`, escaping spaces, `file ./*`, finding by owner and
size, `grep`, `sort | uniq -u` and why `uniq` only compares neighbours,
`strings`, Base64, ROT13 through `tr`, and a hex dump under layered
compression.

**The level passwords are in those notes and are not reproduced here.** They
are public wargame answers rather than anyone's secret, which is exactly why
republishing them would be pointless as well as rude. `verify-output.mjs` fails
the build on any 32-character base62 token appearing on this page.

**The last column is the argument.** Six of the thirteen levels produced a
second file about the *command itself* — not what it did in that level, but
what it does. Those files were written after the level was already solved.
That is the same instinct as §1H.5, and it is why the log is on this page
rather than being summarised as "learning Linux".

**Claim and record, side by side.** The repository describes itself as *"I will
going to upload daily basis for 6 months."* The record shows 19 commits across
6 days. Both are printed, neither edited to agree with the other, and the
stated intention is labelled as an intention — the same two-layer treatment
GITHUB gives YushaCyber's "thriving community" (§1G.4).

### 1H.5 Re-implementation as a method

The one editorial claim the world makes, and it is made because the source
keeps making it: **faced with a tool that is not understood, the response here
is to write a version of it.**

| Tool | What was built | Scale |
|---|---|---|
| The shell | 54 commands over a virtual filesystem: pipes, redirection, variable assignment and expansion, command substitution, single-line `if` and `for` | 297 lines of shell, 1,195 of commands |
| Nmap | A scanner over a virtual network — services and versions, filtered ports, a host that drops ICMP, UDP, an OS guess. `-p-`, `-sn`, `-sV`, `-sU`, `-sT`, `-O`, `-Pn` | 358 lines of network, 484 of tests |
| A packet analyser | Capture, display filters and stream following, addressed by the same simulated terminal | 409 lines of packets, 536 of tests |

`app/core/terminal/shell.py` says it exists so the terminal behaves *"like a
real (sandboxed) shell rather than fake string-matching"*. That is the
philosophy of §1F.2 — understand it rather than trust it — appearing
independently in the security work, written before this site existed.

**The page states the boundary explicitly.** This is evidence that the
behaviour of these tools was understood well enough to reproduce and grade. It
is not a record of running them against a real network, and the register says
so on every affected row. Getting that distinction wrong would have been the
single most damaging fabrication available in this milestone.

### 1H.6 Open questions

Five things that were built, shipped, and never measured. Each is keyed to an
experiment in the `experiments` collection whose `result` field records the
absence the question is about.

The join **throws at build time** if an experiment is missing. A question whose
source has been deleted is a question with nothing behind it, and failing the
build is the correct response — the same policy `getWorld` applies to an
unknown world.

This is the notebook's most valuable page, and it exists because M06 wrote
`result` as optional in the schema and then used it honestly. Four of five
experiments already reported an absence; this world turns each one into the
work that has not been done yet.

### 1H.7 Transition — `leaf`

A notebook leaf turned. **The sixth entrance, and the first that leaves the
plane of the page.** The other five all move flat: a mask withdraws to both
margins (`register`), a drawer front travels down (`drawer`), two halves part
along a crease (`sheet`), a slide traverses laterally (`traverse`), columns are
ruled away upward (`ruling`). This one is hinged at the inline-start spine and
rotates about a vertical axis.

Three things make it a leaf rather than a rotating rectangle:

- **the spine** — a binding rule with stitch holes down the inline-start edge,
  pitched off `--notebook-module`, so the binding and the pad's ruling are the
  same stationery;
- **the ruling** — the plate carries the pad's squared grid, so the squares
  foreshorten and converge as it turns. That is what makes the rotation legible
  as depth; a blank plate would read as a shrinking rectangle;
- **the direction** — the free edge swings *away* from the reader.

The last one is mechanical as well as editorial. Under `perspective()` a face
moving toward the camera projects **outward**, and a fixed viewport-sized
element doing that can push past the viewport edge. Measured mid-rotation
(paused at 300 ms of 560 ms), the plate's right edge sits at **213 / 523 /
1321** px at viewport widths 320 / 768 / 1920, and document overflow is zero at
all three.

It stops at exactly 90°, where the projected width is zero, so the type on the
leaf is never seen mirrored and no sliver is left standing at the spine.
560 ms on `--ease-drawer`, hold 20% — inside the 400–800 ms window, over
content the browser has already painted. Leaving lays the leaf back down
(`gate-leaf-close`, verified to play and to complete the navigation).

### 1H.8 §9.4 — CYBERSECURITY content verification

Run in parallel with the build, as the brief directs, and it produced a
conclusion that changes the next milestone.

**V1's `journey.html` copy, item by item:**

| V1 claim | Verdict | Evidence |
|---|---|---|
| "Started serious cybersecurity learning" (2026) | **Supported** | `cyber-security` created 11 Aug 2026; `YushaCyber` created 5 Jul 2026 |
| "Built cybersecurity learning roadmap" | **Supported** | `roadmap` is one of YushaCyber's fourteen registered blueprints (§1E.6) |
| "Started building YushaCyber" | **Supported** | Repository, 5 Jul 2026 |
| "Built interactive cybersecurity labs" | **Supported, and understated** | 48 test files; a 4,669-line simulated terminal across shell, filesystem, network, packets and web; 54 commands; graded missions |
| "Launched personal technology brand" | **Not a verifiable fact** | Marketing language with no referent. Must not enter V2 |
| "Learning advanced networking" | **Not supported as stated** | "Advanced" is unevidenced. What exists is five lab modules and Bandit-level SSH |
| "Improving cybersecurity fundamentals" | Supported but vague | Superseded by the register in §1H.2, which is checkable |
| Identity: "Cybersecurity Developer • AI Builder • Founder" | **Conflicts with the approved record** | M03-A approved "AI Developer / AI Builder · Cybersecurity Learner". "Founder" was never supplied and appears nowhere in V2 |

**What does not exist anywhere in any repository**, checked rather than
assumed: no certification, no completed course, no CTF placement, no
engagement, no CVE, no disclosure, no report, no client. The `labs` schema's
`cve`, `authorisation` and `severity` fields — written in M02 precisely so that
world could prove its claims — have nothing to populate them.

**The finding that matters, and it is not what the roadmap assumed.**
Everything verifiable about security in this archive **is already published, in
another world**:

- the Bandit log → LEARNING §04;
- the lab content and the simulated terminal → LEARNING §03 and the PROJECTS
  record;
- the two security decisions inside YushaCyber (global CSRF, `bleach` on
  rendered markdown against an allow-list) → the PROJECTS record and the
  LEARNING register.

So **CYBERSECURITY currently has no content of its own.** Built today it would
either restate three worlds or fabricate, and the second is what a security
page under content pressure actually does. This is an architect decision, not
an engineering one — see §14.

**Unchanged and still outstanding:** `Agriculture_simulator` contains an
exposed OpenWeatherMap credential, identified in M05 and not revoked. That
repository must not be described as security-clean anywhere. The value is not
reproduced in this archive.

### 1H.9 A defect in the verification script itself

Found while adding the LEARNING guards, and it is the most important thing in
this milestone.

**Eighteen `\b` word boundaries across `verify-output.mjs` and
`test-github.mjs` were literal U+0008 BACKSPACE bytes.** A shell had
interpreted the escape before Node ever saw the file. Every regex containing
one could not match anything a browser will render, so every one of them had
been *passing* since the milestone that wrote it:

| Guard | Added | Status until M08 |
|---|---|---|
| AI Lab fabricated metrics — accuracy, loss, epochs, "trained on N" | M06 | Inert (5 patterns) |
| GitHub percentage / no-proportion | M07 | Inert |
| GitHub invented activity — commits, streaks, contributions | M07 | Inert (4 patterns) |
| One credential-shaped-assignment pattern | M05 | Inert |
| `test-github`: "claims no holdings it cannot list" | M07 | Inert |

All eighteen were repaired and then **negative-tested**: three planted
paragraphs now produce fourteen detections. The M07 final report described
these guards as working; that was wrong, and this is the correction.

**One of them was hiding a real defect.** With the snapshot absent, the GitHub
title block printed **"0 repositories"** — not a missing number but a wrong
one, since there are ten and the page simply could not see them. The assertion
written in M07 to catch exactly that could not run. Counts derived from absent
data now read `Unavailable`, like the compiled date beside them.

Two further repairs the first one exposed:

- **Content assertions now run against `prose(html)`** — the page with
  `<style>` and `<script>` stripped. Astro inlines the stylesheet and
  `@keyframes` is full of `0%`, so a "no percentage on this page" check
  measured against raw HTML is either permanently failing or quietly
  special-cased until it is permanently passing. The GitHub guard would have
  hit `0%` in a keyframe the moment it started working.
- **The third-party-origin check no longer allowlists a hostname.** It matched
  every `src` and `href` and exempted anything starting
  `href="https://github.com/`, which got it wrong in both directions: an
  external *stylesheet* on that host would have passed, and an outbound *link*
  to any other site failed the build. Resources and anchors are now separated
  by what they are — no third-party resource ever, any outbound link but only
  with `rel="noopener noreferrer"`, which is the check M07 ran by hand.

Plus a new assertion for **duplicate ids on any page**, which immediately found
`id="what-i-learned"` twice on `/ai-lab`: two experiment bodies, the same
markdown heading, both slugged by Astro. Invalid HTML and an ambiguous target
for anything resolving an id, shipped since M06.

The general fix — namespacing markdown heading ids by source file via a rehype
plugin — was written, then reverted: Astro 7's default Markdown processor is
Sätteri, and `rehypePlugins` requires installing `@astrojs/markdown-remark`,
which swaps the processor for the whole site. A dependency and a rendering
change to deduplicate one id is the wrong trade. One heading was renamed
instead, and **the assertion is the durable part** — the next collision fails
the build by name.

**The common cause, and the rule that follows from it:** a check that *cannot*
fire looks exactly like a check with nothing to report. Nothing is added to
`verify-output.mjs` from here on without being negative-tested against a
planted violation first. That instruction is now written in the file.

### 1H.10 Accessibility

| | |
|---|---|
| Headings | 1 `<h1>`, 8 `<h2>`, no level skipped |
| Landmarks | one `<main>`, one `<nav>`, skip link, `aria-current` on the nav |
| Duplicate ids | 0 (and now asserted on every page) |
| Broken fragment links | 0 |
| `aria-labelledby` targets | all resolve |
| Tables | 2, each with a `<caption>`, 4 `<th scope="col">`, and row headers — 17 and 13 |
| Strand headings | `<th scope="colgroup">`, so a screen reader hears the strand without it being repeated on every row |
| External links | 3, all `rel="noopener noreferrer"`, all with a `↗` |
| Tab stops | 36 |
| Colour | Standing and basis are always **words**. `Not attempted` is red *and* says "Not attempted"; `Stated` is italic lower-case *and* says "Stated" |
| Narrow screens | Both tables recompose into labelled blocks; `<thead>` is clipped, not `display: none`, because the headings are what the `data-label` values quote |
| Forced colours | Margin rule, quote rules and the two spot marks all resolve to `CanvasText` |

**Not verified, and not claimed:** the live focus-visible pass could not run —
`document.hasFocus()` was `false` throughout, as in M06 and M07, because the
browser window had no OS focus. What was done instead is a static audit: no
rule in any stylesheet sets `outline: none` or `outline: 0`, so nothing
suppresses the ring. That is weaker evidence and is recorded as weaker.

No axe run, no Lighthouse run, no screen-reader pass. Unchanged since M05.

### 1H.11 Performance

| | |
|---|---|
| `/learning` HTML | 36,779 B |
| `learning.css` | 10,095 B |
| `BaseLayout.css` | 22,366 B (from 20,340 — the `leaf` entrance) |
| **JavaScript on `/learning`** | **639 B**, one script, the world gate |
| `dist/` total | 475,268 B, 15 pages |
| `npm audit` | 0 vulnerabilities |
| `astro check` | 0 errors, 0 warnings, 0 hints |

No dependency was added. Two tables, no filter UI, no charting: a
seventeen-row register does not need one, and a bar would be the exact thing
this world exists to refuse.

### 1H.12 Responsive, browser and no-JS testing

**Eleven widths × eleven pages — 121 combinations, zero horizontal overflow.**
320, 360, 390, 414, 480, 640, 768, 1024, 1280, 1440, 1920, across all eight
worlds and the three project records.

Then a stress test at 320px for content that does not exist yet: a 66-character
unbroken identifier in an evidence cell, a full URL with escaped spaces in a
log row, and a 60-character space-free subject name. Still zero.

**No-JS:** the `<main>` text is byte-identical with and without JavaScript —
11,781 characters, 17 subject rows, 13 log rows, 5 questions. The gate's
resting state is `visibility: hidden`, so the notebook is simply open.

**Console:** clean across all 11 routes.

**Browser:** Chrome 151 on Windows 11 only. Firefox, Safari, Edge and real
mobile devices are **not tested**, and nothing is claimed about them. The
`leaf` entrance is the first use of a 3D transform in the archive, which makes
this gap slightly more expensive than it was last milestone.

**Reduced motion:** every `animation:` declaration in `learning.css` and
`gate.css` is inside `@media (prefers-reduced-motion: no-preference)` — checked
by parsing both files, not by reading them. The clock is zeroed at the token
source, and the resting state of every stage is the finished state.

### 1H.13 Security

Credential scan clean; `npm audit` 0. No token, header, secret, key,
environment value or local path in `dist/`. The 32-character-token guard on
`/learning` is new and specific to this world.

One credential pattern that had been inert since M05 now works (§1H.9), and it
fires on a planted `Password: <32 chars>` string.

**Unchanged:** the exposed OpenWeatherMap key in `Agriculture_simulator`
requires revocation and rotation. Outside this repository, outstanding since
M05, and no page here describes that repository as security-clean.

### 1H.14 Regression and scope compliance

All eight worlds swept: correct gate kind on each (`register` / `drawer` /
`sheet` / `traverse` / `seal` / `leaf` / `ruling` / `transmit`), one `<h1>`
each, no duplicate ids, no external link missing `rel`, no broken fragment,
zero console errors.

**Built:** `/learning` only. **Not started:** CYBERSECURITY, CONTACT — as the
brief requires.

**Touched outside the Learning world, and why each was necessary:**

- `scripts/verify-output.mjs`, `scripts/test-github.mjs` — the inert-regex
  repair (§1H.9). Not optional: the milestone's own guards were being added to
  a file whose existing guards did not run.
- `src/pages/github.astro` — the "0 repositories" fallback defect, surfaced by
  that repair. Four lines.
- `src/content/experiments/hand-tilt-as-a-steering-axis.md` — one heading
  renamed to clear a duplicate id on `/ai-lab`.
- `src/lib/worlds.ts` — Learning's summary and the `leaf` documentation.

No world was redesigned. No visual change was made to HOME, ABOUT, PROJECTS,
AI LAB or GITHUB.

### 1H.15 Known limitations

1. **Focus pass not run** — `document.hasFocus()` false again; static audit
   only (§1H.10).
2. **One browser.** Firefox, Safari, Edge, real mobile untested — and this is
   the first milestone shipping a 3D transform.
3. **No axe, no Lighthouse, no screen reader.** Unchanged since M05.
4. **The `learning` collection is still empty**, so §06 renders its written
   empty state and the populated branch has never been exercised.
5. **`lib/learning.ts` is hand-maintained.** The completeness guard catches a
   subject that stops *rendering*; it cannot catch a subject that is *wrong*.
   Re-verification is a human act, as it is for `profile.ts`.
6. **Three subjects rest on the owner's word alone.** That is stated on the
   page, which is the mitigation, but it is not evidence.
7. **The field log will go stale.** It is a snapshot of a repository that is
   still being committed to; nothing refetches it. Unlike the GitHub world,
   this content is not on the build-time pipeline — a deliberate choice, since
   the log's value is the written notes rather than the commit count, but it
   means the numbers are true as of 20 August 2026 and no later.
8. **OpenWeatherMap key still live.**
9. **The scheduled `github-data.yml` run remains unobserved** since M05.

### 1H.16 Commits

| Hash | |
|---|---|
| `223edd7` | `fix(verify): repair eighteen inert regexes, and the bug one was hiding` |
| `00a9b3a` | `feat(world): print Learning on pad stock, in pen ink` |
| `06a5113` | `feat(learning): turn the leaf` |
| `c2d85ef` | `feat(learning): build the field notebook` |
| `f0d8f9f` | `test(learning): assert the register keeps both axes, and claims no level` |
| _this_ | `docs: record M08 — the field notebook, and a verification repair` |

Working tree clean on `v2`. `main` untouched; V1 byte-identical.

---

## 1I. M09 — Contact world

**Status: M09 — CONTACT — COMPLETE.** Awaiting architectural review.
**Scope:** one objective. Build the CONTACT world. CYBERSECURITY was not
touched and remains on hold pending the §14 decision recorded in M08.

Route `/contact`. World renamed **Transmission Room → Correspondence**, sheet
**AR-07**, ground `tape`, entrance `transmit`. Five clauses. No client
JavaScript beyond the shared world gate, and **no form**.

### 1I.0 The problem this world had

Seven worlds document. This is the one where the archive stops documenting and
a person answers, and that change of mode is the whole design problem — the
page has to read as the natural final action of an archive rather than as the
thing bolted to the end of a portfolio.

It also has the archive's only failure mode that is invisible from the inside:
**a wrong address fails silently.** A visitor writes, gets nothing back, and
concludes they were ignored. Nobody writes a second time to report the typo. So
contact details were treated with the same discipline as credentials — read out
of a source Ayush published himself, with the source named next to the value on
the page.

### 1I.1 Content verification

Sources checked: `contact.html` on the live V1 site (branch `main`), and the
GitHub REST profile for `ayushrijal83-ops`.

**The GitHub profile carries nothing.** `email`, `blog`, `location`, `company`,
`bio` and `twitter_username` are all null. Worth recording as a negative
result: no value on this page could have been sourced from there, and the
absence of `location` independently corroborates ABOUT's "Location — not yet
recorded".

V1 publishes **six** outbound channels. Three are carried forward:

| Channel | Standing | Source |
|---|---|---|
| `ayushrijal83@gmail.com` | **Verified** | Published on V1 `contact.html` as a `mailto:` |
| `github.com/ayushrijal83-ops` | **Verified** | The account this archive is compiled from; also on V1 |
| `linkedin.com/in/ayush-rijal-429516410` | **Verified** | Published on V1 `contact.html` |

Three are not, and **not because they failed verification** — they are real and
public today:

- **A WhatsApp link containing a personal mobile number.** Held back. It is a
  standing privacy cost — spam, and a phone number is a social-engineering
  primitive — with no matching benefit on a correspondence sheet. It is public
  on V1, so listing it would disclose nothing new; but V2 is a deliberate
  rebuild, and carrying a personal mobile forward should be an explicit
  decision by its owner rather than a default inherited from the page being
  replaced. `verify-output.mjs` now fails the build on any `wa.me` link or
  `tel:` href, so reversing this requires deleting a check that says why.
- **Two personal social accounts.** Held back on relevance. This world is a
  channel for writing to a person about work; a social index is a different
  page and this archive does not have one. Clause 05 says on the page that
  social accounts exist and are deliberately not indexed, so the omission is
  stated rather than silent.

Reversing either decision is a three-line edit to `CHANNELS` in
`lib/contact.ts`. **This is flagged for the architect** — see §14.

Two further V1 items were checked and rejected:

- **`/assets/resume.pdf`.** Not present in V2's `public/`, so a link would 404
  after cutover. Its contents are also V1 copy, which §9.4 records as never
  having been verified — M08 found two V1 claims that do not survive. Not
  carried forward.
- **The V1 identity line, "Cybersecurity Developer • AI Builder • Founder".**
  Conflicts with the M03-A approved record; "Founder" was never supplied. The
  page prints `PROFILE.identity` verbatim instead, as every other world does.

**Facts this page does not assert**, named on it individually rather than
omitted: availability, rates, location, employment status, response time. A
contact page that simply leaves out rates reads as expensive; one that leaves
out availability reads as unavailable. Neither is a thing this page knows.

### 1I.2 Visual system — the letter

| | |
|---|---|
| Stock | `#f4f1ec` — the lightest and warmest in the archive. Raised `#faf8f4`, recessed `#eae7e0`, edge `#ded9d0` |
| Ink ramp on that stock | **15.41 / 7.80 / 5.96 / 5.05** — the highest contrast of any world |
| Channel | `#63384c` cancellation plum, **8.47:1**, carries text as well as linework |
| Ground | `tape`, unchanged — sprocket perforations down both margins |
| Spot | **None.** The only world that spends no spot colour at all |

The highest-contrast stock is deliberate: this is the one page a visitor has to
read carefully enough to act on. The plum is the violet-black of a postal
cancellation and of aniline copying ink — dark, low-chroma, red-leaning, and
specifically not the bright violet the brief rules out. It was the last
unclaimed hue after red, brown, drafting blue, green, graphite and indigo. On a
letter there is one ink, so the world's accent is its only colour.

**The `tape` ground was kept and re-read rather than redrawn.** Perforated
continuous stationery *is* correspondence stock, and it was already the only
ground in the archive that marks an edge condition instead of ruling a field.
Swapping a ground that works and is already unique would have been churn
dressed as design.

**One inversion carries the world.** Every other sheet in the archive reads
down the START edge — HOME centres, ABOUT hangs labels in a left margin,
PROJECTS and GITHUB tabulate from the left, LEARNING rules a red margin down
the left. This is **the only sheet with anything aligned to the END edge**: the
reference block, top right, where a letter carries its references. Below 48rem
it returns to reading order, because an end-aligned block in a 280px column is
not a letterhead, it is a ragged left edge.

Two supporting devices and no others: **fold marks** at the thirds of the body
(the registration a sheet carries so it folds square into an envelope), and a
**narrower measure** — a letter is set narrow because it is read once, closely,
by one person.

### 1I.3 Transition — `transmit`

The seventh entrance, and the point at which the rectangle ran out. Six kinds
already own the obvious `inset()` geometries and `leaf` owns rotation; anything
else built from an axis-aligned rectangle is one of those mirrored, which the
note in `gate.css` rules out by name.

So it is distinguished on the two axes nobody had used:

1. **The edge is not axis-aligned.** The archive's only `polygon()`: the plate
   is withdrawn behind a slanted edge, top corner leading. It does not
   translate — the sheet is not carried away, it is drawn *through* something.
2. **The motion is indexed.** Every other entrance moves continuously. This one
   advances in discrete clicks, and it is the **first and only use of
   `--ease-step`** — a token that has sat in `tokens.css` since M02 waiting for
   a world with a mechanical reason for it. A franking machine does not glide.

The mark that makes it a mechanism rather than a wipe, as every kind has one:
five parallel bars in the correspondence ink across the leading corner. They
are on the plate, so they are drawn off with it, one click at a time.

560 ms on `--ease-step`, 18% hold — inside the 400–800 ms guideline, over
content the browser has already painted. Measured mid-sweep (paused at 300 ms)
at 320 / 768 / 1920: the plate's right edge sits **exactly at the viewport** and
document overflow is **zero** at all three. Leaving plays `gate-transmit-close`
and the navigation completes.

### 1I.4 The contact mechanism

**No form. No third-party service. No new dependency.**

The output is static HTML on GitHub Pages. A form would need a third party to
receive it, routing a stranger's message and address through a company neither
party chose, under a privacy policy neither party read — a real cost paid by
the visitor to save one click. The alternative is worse and it is the one that
gets built by accident: a form that validates, clears itself, prints *message
sent* and transmits nothing. **That one passes every test a browser can run on
it**, which is precisely why the assertion for it had to be written by hand.

Clause 04 publishes that reasoning. An unexplained absence reads as an
oversight; an explained one reads as a decision.

The mechanism is a plain `mailto:` with a `subject=Correspondence` prefill, and
the address is also the link text — so it works with no mail client registered,
with no JavaScript, and by copy-paste. `rel="noopener noreferrer"` is applied
to the two `http` links and deliberately not to the `mailto:`, where it has no
meaning.

### 1I.5 An architecture bug found and fixed at the smallest layer

Renaming the world produced a genuine regression, and it reached HOME.

`.t-display` had no break behaviour. "CORRESPONDENCE" is fourteen characters
with nowhere to wrap and measures **340px** against a 305px viewport, so it
overflowed its own `<h1>` by 36px — and the HOME contents index, which prints
whatever each world calls itself, by 6px. Nothing had triggered it in eight
milestones because every previous world name either fits or contains a space
("Transmission Room" wraps freely).

Fixed on `.t-display` in `global.css` rather than on the two selectors that
happened to break, because the property being asserted is *display type never
overflows* and it has to hold for the next world name nobody has written yet.
`hyphens: auto` where the engine can hyphenate, `overflow-wrap: break-word` as
the guarantee where it cannot; `break-word` acts only when a word genuinely
does not fit, so nothing that fits today changes. `.contents__name` takes the
same two lines because it does not use `.t-display` — its weight, size and
tracking differ — and it is the one element in the archive that renders text it
does not control.

Verified afterwards across all eight worlds at all nine widths.

A second, smaller instance was caught by the stress pass: `.correspondent__name`
would overflow by 575px given a 53-character space-free name. Real names are
not guaranteed to contain a space; `overflow-wrap: break-word` added.

### 1I.6 Accessibility

| | |
|---|---|
| Headings | 1 `<h1>`, 5 `<h2>`, no level skipped |
| Landmarks | one `<main>`, one `<nav>`, skip link present, `aria-current="page"` |
| Duplicate ids | 0 |
| Broken fragment links | 0 |
| `aria-labelledby` targets | all resolve |
| Form controls | **0** — asserted site-wide |
| External links | 3, all `rel="noopener noreferrer"`, all with a `↗` |
| `mailto:` links | 1, no `rel` (correct — it has no meaning on a mail scheme) |
| Tab stops | 15 |
| Colour | The preferred channel is marked with the **word** "preferred", not only with colour or position. Struck-out omissions carry the strike, not a colour |
| Narrow screens | The reference block returns to reading order below 48rem; the fold marks are removed where there is no margin to hold them |
| Forced colours | Fold marks, the correspondent rule and all three accent-only distinctions resolve to `CanvasText` |

**Not verified, and not claimed:** the live focus-visible pass could not run.
`document.hasFocus()` was `false` throughout — the browser window had no OS
focus, so `:focus-visible` never matches and a programmatic focus proves
nothing. This is the fourth consecutive milestone with that limitation. What
was done instead: a static audit confirming **no rule in any stylesheet sets
`outline: none` or `outline: 0`**, so nothing suppresses the ring. That is
weaker evidence and is recorded as weaker.

No axe run, no Lighthouse run, no screen-reader pass. Unchanged since M05.

### 1I.7 Reduced motion

Every `animation:` declaration in `contact.css`, `gate.css` and `global.css` is
inside `@media (prefers-reduced-motion: no-preference)` — checked by parsing
the files, not by reading them. The clock is zeroed at the token source.

The gate's fail-safe was verified empirically rather than assumed: cancelling
the entrance animation outright — the "animation never ran" case — leaves the
plate at `visibility: hidden`, `opacity: 0`, with all 3,652 characters of
`<main>` present and laid out. Identical behaviour on `/`, `/learning` and
`/contact`.

The page's only movement is two hairlines a centimetre long.

### 1I.8 No-JS

`<main>` text is **byte-identical** with and without JavaScript — 3,652
characters, 3 channels, 5 matters. One external script on the route (the shared
world gate, 639 B); no inline script.

Everything the page exists to do works with scripting off: the address is a
link and also plain text, the two profile links are anchors, and no content is
behind an interaction.

### 1I.9 Security

Credential scan clean. `npm audit`: 0 vulnerabilities. No token, header,
secret, key, environment value or local path in `dist/`.

**No third-party contact service was introduced, and none was evaluated into
the build.** The CSP is unchanged, and the no-third-party-origin assertion was
not weakened — the form decision in §1I.4 is what made that possible rather
than something that had to be worked around.

Two site-wide assertions added, both of which are security or privacy
properties rather than style rules: no form or form control on any page, and no
`wa.me` link or `tel:` href on any page.

Publishing an email address in plain HTML exposes it to scrapers. Accepted:
V1 already publishes the same address in the same way, so this is not a new
disclosure, and the alternatives — JavaScript obfuscation or an image — break
the no-JS guarantee or the copy-paste path, which is a worse trade for the one
visitor who actually wants to write.

**Unresolved and unchanged:** the exposed OpenWeatherMap credential in
`Agriculture_simulator` still requires revocation and rotation. Outside this
repository, outstanding since M05, and no page here describes that repository
as security-clean. The value is not reproduced anywhere in this archive.

### 1I.10 Responsive testing

**Nine widths × eleven pages — 99 combinations, zero horizontal overflow.**
320, 360, 375, 414, 768, 1024, 1280, 1440, 1920, across all eight worlds and
the three project records.

Worth stating precisely: the harness measures inside an iframe with a classic
15px scrollbar, so the **effective** viewport is 15px narrower than the label —
the 320 case is really tested at 305. That is stricter than the label claims,
not looser.

Stress pass at 320px, all six injected at once: an 80-character email address,
an 87-character repository URL, a 55-character link label, a 53-character
space-free name, a 39-character single-word title, and a 78-character subject
line. **Zero overflow.** One of them — the name — found the bug in §1I.5 when
run individually first.

**A limitation, measured rather than glossed:** under a **text-only** resize to
200% (`html { font-size: 32px }` at a 320px viewport), every world overflows —
`/` by 214px, `/ai-lab` 148, `/github` 142, `/projects` 137, `/contact` 128,
`/about` 110, `/learning` 97. Contact is mid-pack and this is a pre-existing
site-wide property, not an M09 regression. Browser *zoom*, the common case,
scales the viewport with the text and is covered by the sweep above; what fails
is text-only enlargement (Firefox's text-only zoom, or a user stylesheet).
Fixing it is a system-wide typography change across seven built worlds and is
recommended for M10 rather than patched into one page — see §14.

### 1I.11 Performance

| | |
|---|---|
| `/contact` HTML | 17,437 B — the smallest world page in the archive |
| `contact.css` | 6,083 B — the smallest world stylesheet |
| `BaseLayout.css` | 24,021 B (from 22,366 — the `transmit` entrance) |
| **JavaScript on `/contact`** | **639 B**, one script, the shared world gate |
| `dist/` total | 491,056 B, 15 pages |
| `astro check` | 0 errors, 0 warnings, 0 hints |
| `npm audit` | 0 vulnerabilities |

No dependency was added. No animation library, no form library, no third-party
embed.

### 1I.12 Browser testing

Chrome 151 on Windows 11 only. **Firefox, Safari, Edge and real mobile devices
were not tested, and nothing is claimed about them.** No new browser
automation was installed to inflate the report.

Two things make this gap slightly more expensive than last milestone: the
`transmit` entrance is the archive's first animated `polygon()` clip-path, and
`hyphens: auto` (added in §1I.5) has different dictionary support per engine —
though `overflow-wrap: break-word` is the guarantee behind it precisely so the
result does not depend on hyphenation being available.

### 1I.13 Build, CI and verification

`npm run verify` green · `npm run test:github` 18/18 · `astro check` 0/0/0 ·
`npm audit` 0 · 15 pages · console clean across all 11 routes.

**Four new assertions, all negative-tested:**

*2j — CONTACT.* Every channel declared in `lib/contact.ts` reaches the page,
counted against the source rather than against a copy of it. The declared
address appears both as a `mailto:` and as readable text. Six overclaim
patterns — *hire me*, *open to work*, *available for*, two shapes of response
time, *freelance* — each matching a CLAIM and never a mention, since the page
prints "Availability" in its struck list and has to stay able to.

*2k — site-wide.* No `<form>` or form control on any page. No `wa.me` link or
`tel:` href on any page. No delivery-confirmation copy.

One planted paragraph, one form and two links produce **thirteen distinct
failures**, plus a fourteenth from the existing `rel` guard. Per the M08
incident, `verify-output.mjs` and every other file M09 touched were also
scanned at **byte level** for control characters before any result was
believed: zero across nine files.

### 1I.14 Scope compliance

**Built:** `/contact` only. **CYBERSECURITY was not built, not modified and not
verified further** — it remains on hold pending the §14 decision recorded in
M08.

Touched outside the Contact world, and why each was necessary:

- `src/styles/global.css` and `src/components/home/ArchiveContents.astro` — the
  display-type overflow regression the rename caused (§1I.5). Not optional: it
  put a horizontal scrollbar on HOME.
- `src/lib/worlds.ts` — this world's name, gate copy, summary and entrance.
- `scripts/verify-output.mjs` — the new assertions.

No world was redesigned. No visual change was made to HOME, ABOUT, PROJECTS,
AI LAB, GITHUB or LEARNING beyond the one-line typography guarantee, which
changes nothing that already fits.

### 1I.15 Known limitations

1. **Focus pass not run.** `document.hasFocus()` false for the fourth
   consecutive milestone; static audit only (§1I.6).
2. **One browser.** Firefox, Safari, Edge and real mobile untested.
3. **No axe, no Lighthouse, no screen reader.** Unchanged since M05.
4. **Text-only 200% resize overflows on all seven built worlds** (§1I.10).
   Measured, site-wide, pre-existing, and recommended for M10.
5. **Three verified channels are held back** (§1I.1), including a phone number.
   That is a judgement made on the owner's behalf and needs his confirmation.
6. **The email address is near-identical to another in circulation.** The
   published value on V1 is `ayushrijal83@gmail.com`; the account this work was
   commissioned from uses a one-letter-different local part. Only the published
   value is on the site, which is the correct source — but a one-character
   difference between two live addresses is exactly the kind of thing worth
   confirming once, out loud, before cutover.
7. **`lib/contact.ts` is hand-maintained.** The completeness guard catches a
   channel that stops rendering; it cannot catch one that is wrong.
8. **The archive cannot test that mail arrives.** Nothing in CI proves the
   address is live. Sending one message to it is a thirty-second check nobody
   has performed.
9. **OpenWeatherMap key still live.**
10. **The scheduled `github-data.yml` run remains unobserved** since M05.

### 1I.16 Commits

| Hash | |
|---|---|
| `6199b9c` | `fix(type): let display type break rather than push the page wide` |
| `2db7051` | `feat(world): print Contact on correspondence stock, in cancellation ink` |
| `1e539d1` | `feat(contact): ratchet the sheet off` |
| `41dbf05` | `feat(contact): build the correspondence sheet` |
| `753bcbb` | `test(contact): assert a real address, and nothing pretending to send` |
| _this_ | `docs: record M09 — the correspondence sheet` |

Working tree clean on `v2`. `main` untouched; V1 byte-identical.

### 1I.17 Final world state

| Sheet | World | Status |
|---|---|---|
| AR-00 | The Living Archive | **Complete** |
| AR-01 | Personal Archive | **Complete** |
| AR-02 | Engineering Workshop | **Complete** |
| AR-03 | Experimental Laboratory | **Complete** |
| AR-04 | Security Research Archive | **On hold** — no content of its own (§1H.8) |
| AR-05 | Field Notebook | **Complete** |
| AR-06 | Public Code Archive | **Complete** |
| AR-07 | Correspondence | **Complete** |

**Seven of eight worlds are built.** Seven of eight gate entrances are
implemented; only `seal` still inherits the base wipe. The remaining work
before cutover is not a world — it is the CYBERSECURITY decision, the redirect
map (R10), and the outstanding external items below.

---

## 1J. M10 — Final integration

**Status: M10 — FINAL INTEGRATION — COMPLETE.** Awaiting architectural review.
**Scope:** no new world. Baseline, content audit, accessibility, cross-browser,
workflow observation, security, production metadata, and a cutover plan.
CYBERSECURITY was not built, not modified and not verified further.

### 1J.0 Baseline

`npm ci` failed first time: `EPERM unlink` on
`@rolldown/binding-win32-x64-msvc`. Cause found rather than worked around — the
`astro preview` server started during M09 was still running and holding the
native binding open. It was killed and `npm ci` completed. Recorded because the
M09 report said the preview had been stopped and it had not: `kill %1` ended
the shell job, not the detached Node process.

| Check | Result |
|---|---|
| `npm ci` | clean after the above |
| `astro check` | 0 errors, 0 warnings, 0 hints (45 files) |
| `astro build` | 15 pages |
| `npm run verify` | pass |
| `npm run test:github` | 18/18 |
| `npm audit` | 0 vulnerabilities |
| Working tree | clean, on `v2` |
| V1 integrity | byte-identical (every path in `main` diffed against `v2`) |

### 1J.1 Content audit

Every public-facing page was extracted to plain text and read, then the whole
build was scanned for twelve classes of fabrication-shaped claim.

**Nothing anywhere in the archive asserts:** a certification, an award, an
employer, a client, a user or download count, a follower count, a founder or
executive title, a deployment, a trained model, years of experience, a
proficiency level, revenue or pricing, a CVE, or a security engagement. The
scan's only hits were false positives — "mail client", "client JavaScript",
"not deployed", and "Trained models" inside LEARNING's struck list of absences.

Two items are worth the architect's attention, and **neither was changed**,
because both are content decisions rather than defects:

**1. The archive advertises holdings it does not have.** `worlds.ts` gives
AR-04 the summary *"Defensive security research, lab write-ups and findings."*
That string is printed in three places: the HOME contents index, the
`<meta name="description">` of `/cybersecurity`, and that page's own masthead —
directly above its honest empty state, *"No security work has been filed yet."*
M08 §1H.8 established that no such research, write-up or finding exists
anywhere. The page is truthful about itself; the index that points at it is
not. One string, in one file. Recommended wording is in §14, but changing a
world's own description is the architect's call.

**2. "Offline-first" on the Jarvis record.** The precise claims — *"nothing
sent to a cloud API"*, *"no cloud API is involved"* — are accurate and match
M06's §1F.3 finding. "Offline-first" is a hedge doing real work: the assistant
opens a Google search URL in a browser on command, so it is not offline. The
record never says it is, and the distinction M06 insisted on (*no cloud
inference* is true, *no network* would not be) survives. Rated **partly
verified**; one clarifying sentence would close it.

Everything else on every page traces to `lib/profile.ts`, `lib/learning.ts`,
`lib/contact.ts`, the verified project records, or the GitHub snapshot.

### 1J.2 Contact decisions — current state

Nothing was added and nothing was restored. Exactly as M09 left it:

| Channel | State | Basis |
|---|---|---|
| `ayushrijal83@gmail.com` | **Published**, marked preferred | V1 `contact.html` |
| `github.com/ayushrijal83-ops` | **Published** | The account this archive compiles from |
| `linkedin.com/in/ayush-rijal-429516410` | **Published** | V1 `contact.html` |
| WhatsApp link containing a mobile number | **Withheld** | Real, public on V1. Privacy judgement pending approval |
| Personal social account #1 | **Withheld** | Real, public on V1. Not correspondence |
| Personal social account #2 | **Withheld** | Real, public on V1. Not correspondence |
| `/assets/resume.pdf` | **Not carried forward** | Absent from V2's `public/`; contents are unverified V1 copy |

The withholding is now enforced rather than merely intended: `verify-output.mjs`
fails the build on any `wa.me` link or `tel:` href on any page, and the check
says why. Reversing the decision means deleting a check that documents it —
which is the correct amount of friction for publishing a personal phone number.

**The email discrepancy stands unresolved and needs one sentence from you.**
The published address is `ayushrijal83@gmail.com`. The account this work is
commissioned from differs by one letter in the local part. Only the published
value is on the site, which is the correct source, but the site is about to
start pointing strangers at it.

### 1J.3 Accessibility — text-only 200% resize

**Investigated, root-caused, and fixed at the shared level for four of seven
worlds. The remaining three are diagnosed and left for a decision.**

The test: `font-size: 32px` on the root at a 320px viewport — text enlarged
without the page being zoomed, which is what a low-vision reader gets from
Firefox's text-only zoom or a user stylesheet.

**Cause.** Not fixed dimensions, not transforms, not viewport assumptions. In
every case, a grid or flex item's automatic minimum size is its **min-content**,
and a word like "Cybersecurity" is 250px wide at 32px, so the item forces its
track wider than the page. The sheet gutter compounds it — `clamp(1.25rem, …)`
is 80px of a 320px viewport at that root size — but the gutter is not what
overflows.

**Fix.** One declaration, `overflow-wrap: anywhere` on `body`, and the keyword
is the fix: only `anywhere` is counted when an engine computes min-content.
`break-word` breaks a word that has already overflowed, which is too late to
stop the track being widened — which is why M09's `.t-display` fix did not
generalise.

| Page | Before | After |
|---|---|---|
| HOME | 214px | **0** |
| ABOUT | 110px | **0** |
| GITHUB | 142px | **0** |
| CONTACT | 128px | **0** |
| 404 | — | **0** |
| PROJECTS | 137px | 137px |
| AI LAB | 148px | 110px |
| LEARNING | 97px | 97px |

**Measured to change nothing at normal text size:** 12 pages × 9 widths, before
and after, identical — it only ever acts on a word that cannot fit.

**The three that remain all fail through `display: table`.** A table box cannot
shrink below its min-content whatever is set on it: on LEARNING the `.subjects`
table measures 346px inside a 209px container, and forcing `display: block`
on it drops it to 209px, which proves the mechanism. PROJECTS adds
`white-space: nowrap` on its state pills and dates, which at 32px are 131px and
152px on their own.

**Not fixed, deliberately.** The correct treatment for a data table that cannot
reflow is a horizontally scrollable region with an accessible name and
`tabindex="0"` — which is a visible design change to three built worlds and
therefore an architect decision, not an engineering one. Patching the pages to
make the number go to zero is what the brief warned against.

**No WCAG compliance is claimed.** For the record, precisely: **1.4.10 Reflow
passes** (no horizontal scrolling at a 320px-equivalent viewport — 12 pages ×
9 widths, zero overflow), and **1.4.4 Resize Text passes by browser zoom**,
which scales the viewport and is the mechanism the standard's own understanding
document describes. What fails is text-only enlargement on three pages. No axe
run, no Lighthouse run and no screen-reader pass has been done at any point in
this project.

### 1J.4 Accessibility — the first real keyboard audit

Every previous milestone recorded `document.hasFocus() === false` and fell back
to a static audit. **The cause was mundane: the browser window did not have OS
focus.** Clicking once into the page fixes it, and `document.hasFocus()` then
returns `true`, `:focus-visible` matches, and a real audit is possible.

What was done, and by which method:

**Real key presses (HOME).** A `focusin` recorder, then 18 Tab presses. 17
stops recorded, every one `:focus-visible` with a painted ring
(`solid 2px rgb(156,48,22)` at a 2.67px offset — the `--focus-ring` token) and
every one on screen. The chain wrapped: contents index → colophon → **browser
chrome** → back to the skip link → nav → contents. **No focus trap.**

**Real key press on the skip link — and it found a defect.** Enter followed the
fragment and scrolled `<main>` to the top, but `document.activeElement`
remained `<body>`. The link worked by accident: a fragment navigation sets
Chrome's sequential focus navigation starting point, so the next Tab lands in
the content. Safari has never implemented that, and no browser moves a screen
reader's cursor. **Fixed:** `tabindex="-1"` on every `<main>`, re-tested with a
real activation — focus now lands on `<main>` itself. It draws no ring on a
mouse click, because the focus style is `:where(:focus-visible)`, verified
rather than assumed.

**Every tabbable, focused in turn, on all seven worlds and the 404**, with the
window genuinely focused:

| Page | Tabbables | Without a ring | Off-screen | Unnamed | Refused focus |
|---|---|---|---|---|---|
| HOME | 17 (traversed) | 0 | 0 | 0 | 0 |
| ABOUT | 10 | 0 | 0 | 0 | 0 |
| PROJECTS | 20 | 0 | 0 | 0 | 0 |
| AI LAB | 27 | 0 | 0 | 0 | 0 |
| LEARNING | 36 | 0 | 0 | 0 | 0 |
| GITHUB | 31 | 0 | 0 | 0 | 0 |
| CONTACT | 15 | 0 | 0 | 0 | 0 |
| 404 | 17 | 0 | 0 | 0 | 0 |

No positive `tabindex` anywhere in the build — the only `tabindex` in 16 pages
is the fifteen `-1` on `<main>` — so tab order is DOM order, which was checked
against reading order on HOME and CONTACT. The `mailto:` is reachable and
correct; external links activate normally; one `<h1>` and zero duplicate ids on
every page.

### 1J.5 Cross-browser

| Browser | Version | What was done |
|---|---|---|
| Chrome | 151 (Windows 11) | Everything above. Full interactive testing |
| Firefox | **154** | **Real Gecko rendering**, headless `--screenshot`, 1280 and 390 |
| Edge | **151.0.4129.101** | Headless screenshot. Chromium — same engine as Chrome |
| Safari / WebKit | — | **Not available on this machine. Not tested, nothing claimed** |

Firefox was driven with its own built-in `--screenshot` flag: no automation
framework was installed. `/github` renders correctly in Gecko at 1280 — ledger
stock, column rules, title block, cross-reference cards, typography all
correct. `/contact` at 390 caught the `transmit` gate mid-sweep, which
incidentally confirms Gecko renders the animated `polygon()` clip-path and the
repeating-gradient cancellation bars correctly — the two newest and least
portable pieces of CSS in the archive.

Firefox coverage is **visual spot-check only**. No interaction, keyboard or
focus testing was done in it.

### 1J.6 GitHub Actions — the finding

**The workflows have never run, and not for want of credentials.**

`git ls-remote --heads origin` returns exactly one branch: `main`. **`v2` has
never been pushed.** Both `ci.yml` and `github-data.yml` exist only in the
local tree, so GitHub has never seen them. The repository's Actions history is
seven runs, all `pages build and deployment` from `main`, all on 2026-08-08 —
V1's dynamic Pages build and nothing else.

That fully explains four milestones of "the scheduled run has not been
observed". It was never possible. **§9.6, which records K4 as closed and the
cadence as operating, is corrected below.**

Neither workflow was modified — no defect was found in either by inspection.
`github-data.yml` guards correctly: `contents: write`, a `concurrency` group,
an explicit `ref: v2` checkout, the token passed only as an env var to the
fetch step, and a commit that runs only if `git diff --quiet` on the snapshot
fails.

**Dispatching it is blocked on a decision, not on access.** It requires pushing
`v2`, which makes the branch public and starts four scheduled commits a day
against it. That is the architect's call. No credentials are present in this
environment: no `gh` CLI, no `GH_TOKEN`, no `GITHUB_TOKEN`.

### 1J.7 Security

| Check | Result |
|---|---|
| `npm audit` | 0 vulnerabilities |
| Credential scan over `dist/` | 0 hits across 35 built files |
| GitHub tokens / PATs | none |
| `Authorization` headers | none |
| API keys (OpenAI-, Google-shaped) | none |
| Private keys | none |
| Local filesystem paths | none |
| `process.env` / `.env` references | none |
| `api.github.com` at runtime | none |
| Client-side GitHub API | none |
| Third-party contact service | **none — no form exists** |
| Production CDN | none |
| New dependencies | **none added in M10** |

**Every external host referenced anywhere in the build**, exhaustively:
`ayushrijal.com.np`, `github.com`, `www.linkedin.com`, `overthewire.org` — all
four are anchor targets a visitor clicks, never a resource the page loads — and
`localhost`, which appears once, as the text `http://localhost:11434` on
`/ai-lab`. That is Ollama's documented default port, published in M06 as an
engineering constant. Reviewed and accepted: it is public knowledge, not
private infrastructure, and it is not in a `src` or `href`.

The CSP is unchanged and was not weakened: `default-src 'self'`,
`script-src 'self'`, `object-src 'none'`, `base-uri 'none'`,
`form-action 'none'`.

**UNRESOLVED EXTERNAL SECURITY ACTION.** `Agriculture_simulator` contains an
exposed OpenWeatherMap credential committed as a string literal. It is outside
this repository and was not touched. **It requires revocation and rotation.**
The value is not reproduced anywhere in this archive, and no page describes
that repository as security-clean. Identified in M05; still open at M10, making
it the oldest unresolved item in this document.

### 1J.8 SEO and production metadata

**The production domain is established in the repository** — `CNAME` on `main`
and `SITE.url` in `lib/site.ts` both read `ayushrijal.com.np`. No guess was
required.

Already correct on every page before M10: `lang`, unique `<title>`, unique
`<meta name="description">`, `<link rel="canonical">`, `og:type`,
`og:site_name`, `og:title`, `og:description`, `og:url`, a referrer policy, a
`color-scheme`, font preloads, one `<h1>`, and a clean heading hierarchy.

**Missing entirely, and added in M10.** The V2 build shipped none of the
production artefacts V1 has been serving since August, and two of them are
deployment blockers rather than degradations:

| File | Why it matters |
|---|---|
| `.nojekyll` | GitHub Pages runs Jekyll, which **skips every directory starting with an underscore**. Every stylesheet and script is under `/_astro/`. Without it the deploy reports success and serves the entire archive unstyled |
| `CNAME` | Without it, publishing **drops the custom domain** |
| `robots.txt` | Allows the archive, disallows `/lab/`, names the sitemap |
| `sitemap.xml` | 11 URLs, **derived** from `lib/worlds.ts` and the projects collection rather than hand-written, so it cannot go stale the way V1's did — that file still lists six `.html` pages, none of which V2 has |
| `404.html` | The only mechanism a static host has for a URL that no longer exists |

One correction: `twitter:card` was `summary_large_image` with **no `og:image`
anywhere in the archive**, which asks X to render a card it cannot fill. Changed
to `summary`. Inventing card artwork would have put the only decorative image
on the site into its social preview.

**Two items flagged rather than decided:**

- **No favicon.** V1 has `assets/favicon.svg`; V2 has none, so browsers show a
  default. Carrying V1's mark into a completely different visual language is a
  design decision, not a build fix.
- **No `og:image`.** Links to the site will preview as plain text. Correct
  today — there is no image in the archive to use — and worth an explicit
  decision before cutover.

`/lab/*` is excluded from both `robots.txt` and the sitemap: the wordmark
renderer, the viewport rig and the Pretext investigation are part of the
working record but should not compete with the eight worlds in search results.
They are still published and still reachable.

### 1J.9 The V1 → V2 cutover map

**Nothing was deployed and no redirect was created.** This is the plan.

**How V1 is served today, which the plan has to change.** GitHub's *dynamic*
branch-based Pages build, from `main`. Seven runs, all `pages build and
deployment`, the last on 2026-08-08. There is no deploy workflow in the
repository — `ci.yml` says so explicitly: *"V2 lives on its own long-lived
branch and does NOT deploy."*

**Route map.**

| V1 URL | V2 destination | Status |
|---|---|---|
| `/` | `/` | Direct. No action |
| `/about.html` | `/about` | Clear destination — needs a stub |
| `/work.html` | `/projects` | Clear destination — needs a stub |
| `/contact.html` | `/contact` | Clear destination — needs a stub |
| `/journey.html` | `/learning`? | **DECISION.** It was a timeline; V2 has none, and M08 found two of its entries unsupported. LEARNING is the nearest thing but is not a timeline |
| `/blog.html` | **none** | **DECISION.** No blog exists in V2 and none is planned |
| `/assets/resume.pdf` | **none** | Not carried forward (§1I.1). A stale inbound link 404s |
| `/sitemap.xml`, `/robots.txt` | same paths | Replaced by the generated versions |
| `/assets/favicon.svg` | **none** | See §1J.8 |
| `/css/*`, `/js/*`, `/assets/photos/*` | none | V1-only assets. Not linked from anywhere outside V1 |
| — | `/ai-lab` | **No redirect needed.** `/ai` was renamed in M06 before anything was published |

**Static redirect options, and the recommendation.** GitHub Pages has no
rewrite layer, so there are exactly three options:

1. **Meta-refresh stubs** at the old `.html` paths, each with
   `<link rel="canonical">` to the new URL and a visible link for anyone whose
   refresh is blocked. Preserves inbound links and most search equity. Four
   files.
2. **The 404 page alone.** Zero risk, already built, worst outcome for the six
   indexed URLs.
3. **A different host with rewrites.** Out of scope; it would abandon the
   entire static-hosting posture the security model rests on.

**Recommended: (1) for the four with an unambiguous destination, (2) for
`/journey.html` and `/blog.html` until the architect decides.**

**Deployment mechanism.** Switch the Pages source from the `main` branch to
GitHub Actions, and add a deploy workflow that builds `main` after the `v2`
merge. That is a repository *setting* only the owner can change, and it must
happen in the same window as the merge or the site serves a half-migrated tree.

**Order of operations, when approved.**

1. Decide `/journey.html` and `/blog.html`.
2. Push `v2` — this is also what makes CI and `github-data.yml` run for the
   first time (§1J.6). Observe both before merging anything.
3. Add the redirect stubs and the deploy workflow on `v2`; verify.
4. Switch the Pages source to GitHub Actions.
5. Merge `v2` into `main` and let the workflow deploy.
6. Verify the custom domain, then re-check the six V1 URLs and the 404.
7. Keep `v1-final` until V2 has been stable for a week.

### 1J.10 Final build verification

Clean production build from a clean working tree.

| Check | Result |
|---|---|
| `astro check` | 0 errors, 0 warnings, 0 hints |
| `astro build` | **16 pages** (15 + `404.html`) |
| `npm run verify` | pass — now including the five deployability assertions |
| `npm run test:github` | 18/18 |
| `npm audit` | 0 vulnerabilities |
| Worlds present | 8/8 |
| No-JS output | intact on every world |
| Reduced motion | every `animation:` inside `prefers-reduced-motion: no-preference`, checked by parsing |
| Horizontal overflow | 12 pages × 9 widths, **zero** |
| Duplicate ids | 0 on every page |
| `<h1>` per page | exactly 1 |
| External links | all carry `rel="noopener noreferrer"` |
| Secrets in output | none |
| `api.github.com` in shipped assets | none |
| Third-party resources | none |

### 1J.11 Assertions added

Seven, all negative-tested against planted breakage — a wrong domain, a deleted
`.nojekyll`, a stripped `robots.txt`, a `/lab/` URL swapped into the sitemap and
a 404 with its links removed produce seven distinct failures. The script was
scanned at byte level for control characters afterwards: zero.

### 1J.12 Known limitations

1. **Text-only 200% resize still overflows on PROJECTS, AI LAB and LEARNING**
   (137 / 110 / 97px), all through `display: table` (§1J.3). Diagnosed;
   the fix is a design decision.
2. **No Safari/WebKit testing.** Not available on this machine.
3. **Firefox coverage is visual only** — screenshots, no interaction.
4. **No axe, no Lighthouse, no screen-reader pass.** Unchanged since M05.
5. **`v2` has never been pushed**, so CI and `github-data.yml` have never run
   (§1J.6).
6. **No favicon and no `og:image`** (§1J.8).
7. **The AR-04 summary advertises security research that does not exist**
   (§1J.1). One string, awaiting a decision.
8. **Three verified contact channels remain withheld** pending approval, and
   the email near-collision is unconfirmed (§1J.2).
9. **Nothing proves the published address receives mail.** Sending one message
   is still the only end-to-end test the contact world has.
10. **The OpenWeatherMap key is still live** (§1J.7).
11. **CYBERSECURITY remains on hold** with no content of its own (§1H.8).

### 1J.13 Commits

| Hash | |
|---|---|
| `fc0b4e5` | `fix(a11y): stop a long word from widening the page under enlarged text` |
| `1c019ea` | `fix(a11y): move focus to <main>, not just the scroll position` |
| `2bb50bc` | `feat(build): ship the files the site cannot deploy without` |
| `16dbb12` | `test(build): assert the build is deployable` |
| _this_ | `docs: record M10 — final integration` |

Working tree clean on `v2`. `main` untouched; V1 byte-identical.

---

## 1K. M11 — Cutover preparation

**Status: M11 — READY FOR FINAL CUTOVER, pending four architect decisions.**
Not deployed. Not merged. CYBERSECURITY not built, not modified.

Every item below is labelled **IMPLEMENTED**, **VERIFIED**, **NOT VERIFIED**,
**REQUIRES ARCHITECT ACTION** or **REQUIRES EXTERNAL ACTION**. Nothing is
called complete that is not.

### 1K.0 Baseline — VERIFIED

Branch `v2`, HEAD `26de95c`, working tree clean before any change.

| Check | Result |
|---|---|
| `npm ci` | clean |
| `astro check` | 0 errors, 0 warnings, 0 hints |
| `npm run verify` | pass (16 pages) |
| `npm run test:github` | 18/18 |
| `npm audit` | 0 vulnerabilities |
| V1 integrity | byte-identical against `main` |

### 1K.1 Legacy URL migration — IMPLEMENTED, and it caught a defect it created

**One stub ships, not three, and the reason is the most important finding of
this milestone.**

`about.html`, `work.html` and `contact.html` were all written first. With them
present, requests to the live routes returned:

```
/about     -> 200  <title>Moved to Personal Archive …
/contact   -> 200  <title>Moved to Correspondence …
```

**The stubs replaced two of the seven worlds.** A static host resolving
`/about` tries `about.html` before `about/index.html`, so a stub named after a
live route does not redirect *to* that route — it *becomes* it. And since the
stub redirects to `/about`, which resolves to the stub again, that is an
infinite loop reached from the site's own navigation bar.

Measured by request against the built output, not reasoned about. Both
colliding stubs were withdrawn.

| V1 URL | Handling | State |
|---|---|---|
| `/` | Serves `/` directly | **VERIFIED** |
| `/work.html` | Stub → `/projects` | **IMPLEMENTED, VERIFIED** |
| `/about.html` | → `/404.html` | **REQUIRES ARCHITECT ACTION** — destination known, blocked by the collision |
| `/contact.html` | → `/404.html` | **REQUIRES ARCHITECT ACTION** — same collision |
| `/journey.html` | → `/404.html` | **REQUIRES ARCHITECT ACTION** — no destination exists |
| `/blog.html` | → `/404.html` | **REQUIRES ARCHITECT ACTION** — no successor |
| `/assets/resume.pdf` | → `/404.html` | Not carried forward. Contents are unverified V1 copy |
| `/ai` | Nothing | Renamed before publication; no such URL exists |

`work.html` survives for one reason: there is no `/work` route for it to
shadow. It is also the only legacy URL whose destination a visitor could not
guess.

**Unblocking `/about.html` and `/contact.html`** needs one external
observation: deploy to a Pages preview and request `/about`. If the directory
wins, both stubs can be enabled unchanged. If the file wins — as the local
preview server showed — they must stay off, or target the trailing-slash form.

The stub is hand-written HTML with no script, no external resource and no
dependency on the archive's CSS: it has to work when everything else has
failed. Zero-delay refresh (which is what keeps it clear of WCAG failure F40 —
a timed refresh cannot be stopped by a reader who needs longer), plus a
canonical and a visible link for readers whose refresh is blocked.

`src/lib/legacy.ts` is the single authority. The stubs are generated from it
and `verify-output.mjs` asserts against it, including a guard that fails the
build if any entry collides with a world route.

### 1K.2 AR-04 content correction — IMPLEMENTED, VERIFIED

Was: *"Defensive security research, lab write-ups and findings."*
Now: *"Nothing is filed here yet — the security work this archive can show is
in the field notebook and the workshop."*

The page was never the problem; it prints "0 entries". The summary was, because
it is the string that travels — HOME's contents gloss, the route's meta
description, and the masthead line directly above that empty state.

Consumed in three places, all from one field in `worlds.ts`. The old phrase now
appears in zero built files, and cannot return: three patterns are checked on
every page, and `/cybersecurity` must keep declaring itself empty.

The world's NAME is kept, deliberately. "Security Research Archive" labels what
the drawer is for rather than what is in it, and it is only ever read on the
page that immediately says it is empty.

### 1K.3 Contact channels — UNCHANGED, still withheld

Default kept. Nothing published, nothing restored, no consent inferred from V1.

| Channel | State |
|---|---|
| `ayushrijal83@gmail.com` | Published, marked preferred |
| `github.com/ayushrijal83-ops` | Published |
| `linkedin.com/in/ayush-rijal-429516410` | Published |
| WhatsApp / mobile number | **Withheld — REQUIRES ARCHITECT ACTION** |
| Personal social account ×2 | **Withheld — REQUIRES ARCHITECT ACTION** |
| `/assets/resume.pdf` | Not carried forward |

Enforced, not merely intended: the build fails on any `wa.me` link or `tel:`
href on any page.

### 1K.4 The email discrepancy — RESOLVED from repository evidence

M09 and M10 recorded this as open. It is closed, and it closes in the direction
of no change.

**The repository contains exactly one email address**, and three independent
authoritative sources inside it agree:

| Source | Finding |
|---|---|
| V1's published pages on `main` | `ayushrijal83@gmail.com` × 9. No other address |
| The V2 tree | `ayushrijal83@gmail.com` × 6. No other address |
| Authorship of **every commit** in the repository | `ayushrijal83@gmail.com` |
| GitHub REST profile | `email: null` — carries nothing |

There is **no conflicting address anywhere in the repository**. The
near-identical string noted in M09 came from the session's own account
metadata, which is not repository evidence and is not something this site may
publish. The published address stands unchanged, and the build now asserts that
exactly one address appears on the page.

What repository evidence cannot establish is whether the mailbox is *read*.
That is §1K.14.

### 1K.5 Contact end-to-end — IMPLEMENTED (assertions), NOT VERIFIED (delivery)

Asserted on every build: the `mailto:` exists, carries the declared address,
carries its `subject=` prefill, is the only address on the page, no form or
form control exists anywhere on the site, no hosted form relay appears
(Formspree, Getform, Formsubmit, Basin, Netlify Forms, Web3Forms, Formcarry),
no delivery-confirmation copy, and no credential in the output.

**Mail delivery is NOT tested and cannot be.** CI can prove the link is
correct; only a human can prove a message arrives. See §1K.14.

### 1K.6 Deployment artefacts — VERIFIED

| File | State |
|---|---|
| `public/CNAME` | `ayushrijal.com.np`, and nothing else |
| `public/.nojekyll` | present |
| `public/robots.txt` | allows the archive, disallows `/lab/`, names the sitemap on the production host |
| `sitemap.xml` | 11 URLs, generated from `lib/worlds.ts` and the projects collection |
| `404.html` | present, links back into the archive |

Sitemap contains no `/lab/` page, no `.html` route, no development route, no
`localhost`, no API endpoint. No source path or local filesystem path appears
anywhere in the output.

### 1K.7 Custom domain — VERIFIED in code, REQUIRES EXTERNAL ACTION to serve

`public/CNAME` reads `ayushrijal.com.np`, matching `SITE.url`. DNS was not
touched and **is not claimed to be configured** — that was not externally
verified.

**REQUIRES ARCHITECT ACTION:** the GitHub Pages source must be switched from
the `main` branch to **GitHub Actions** by the repository owner. That is a
repository setting; it cannot be done from code, and it must happen in the same
window as the merge or the site serves a half-migrated tree.

### 1K.8 GitHub Actions — inspected statically, NOT VERIFIED by execution

Neither workflow was modified. No defect was found by inspection.

| Property | `ci.yml` | `github-data.yml` |
|---|---|---|
| Triggers | push `v2`, PR, dispatch | cron `0 */6 * * *`, dispatch |
| `permissions` | `contents: read` | `contents: write` — the minimum to commit |
| Concurrency | grouped, cancel-in-progress | grouped, no cancel (correct: a fetched run should finish) |
| Token handling | env var on one step only | env var on one step only |
| Token written to a file | no | no |
| Secrets committed | none | none |
| Fetch script dependencies | — | zero; no `npm ci` before the fetch |
| Verify before unattended commit | n/a | **yes** — `npm run verify` runs before `git push` |
| Snapshot churn | — | `--promote` is a no-op unless a repository fact moved |

**Still never executed.** `git ls-remote --heads origin` returns only `main`;
`v2` has never been pushed, so GitHub has never seen either file. Static
inspection is all that has been done, and that is recorded as the limit of it.
Execution becomes an external verification step the moment the branch is
pushed.

### 1K.9 Security — VERIFIED

Scan over the full build: **43 files, 37 of them text, 0 hits.**

No GitHub token or PAT, no `Authorization` header, no OpenAI/Google/Slack-shaped
key, no private key marker, no credential-shaped assignment, no local Windows
path, no `process.env` reference, no `.env` value.

| Property | Result |
|---|---|
| Source maps emitted | **0** |
| Files with `sourceMappingURL` | **0** |
| Shipped JS | 6 files, **6,195 bytes** |
| `fetch` / `XMLHttpRequest` / `WebSocket` / `EventSource` / `sendBeacon` / dynamic `import` in shipped JS | **0** — the client code cannot make a network request at all |
| `api.github.com` anywhere | **absent** |
| Client-side GitHub token | none |
| Client-side Ollama request | none |

`localhost:11434` appears as **prose only**, on `/ai-lab` and `/learning` —
never in an `href` or `src`, confirmed by attribute-level grep. It is Ollama's
documented default port, published in M06 as an engineering constant.

### 1K.10 Third-party origins — VERIFIED

**Zero absolute `src=` attributes exist in the entire build.**

| Class | Hosts |
|---|---|
| Resources (script, stylesheet, image, font, iframe, CSS `url()`) | **none** |
| Outbound anchors (allowed, published deliberately) | `github.com`, `www.linkedin.com`, `overthewire.org` |

No CDN, no external stylesheet, no external script, no analytics, no tracking
pixel, no external font. Fonts remain self-hosted in `public/fonts`.

The only `<iframe>` elements in the build are on `/lab/viewports` — the
viewport measurement rig. They carry **no `src` attribute**, are populated at
runtime with same-origin paths, have `title` attributes, and that page is
disallowed in `robots.txt` and absent from the sitemap.

### 1K.11 Responsive — VERIFIED, and the M10 limitation is closed

**Normal text size: 10 widths × 12 pages = 120 combinations, zero horizontal
overflow.** 320, 360, 375, 390, 414, 768, 1024, 1280, 1440, 1920.

**Text-only 200% resize: 12 of 12 pages, zero overflow.** M10 left three
failing; all three are fixed.

| Page | M10 | M11 |
|---|---|---|
| PROJECTS | 137px | **0** |
| AI LAB | 110px | **0** |
| LEARNING | 97px | **0** |

Four causes, four fixes, each aimed at a measurement:

1. **The scroll port.** Five data tables wrapped in
   `role="region"` + `aria-label` + `tabindex="0"`, the wrapper *outside* the
   table so every caption, `thead` and `scope` is untouched. At 320px/32px the
   three tables that cannot fit scroll inside their own region (346 > 209,
   402 > 215, 374 > 225); the two that fit do not scroll and show no scrollbar.
   `display: block` on the tables was explicitly not used.
2. `.runs` → `grid-template-columns: minmax(0, 1fr)`. An implicit auto track is
   at least its item's min-content, and a `.run` carries 96px of padding at a
   32px root.
3. `.sources__what` → `flex: 0 1 9rem` with `min-inline-size: 0`. As
   `flex: none` it was a 288px label in a 249px row.
4. `.outcome` loses `white-space: nowrap`. Every value it renders is one word,
   so nowrap protected nothing that could wrap, and "INCONCLUSIVE" at 235px in
   a 225px box was the last element on the site pushing a page sideways.

No table scrolls at normal size, so no composition changed.

### 1K.12 Accessibility — VERIFIED, with the limits stated

Real keyboard audit, browser window genuinely focused (`document.hasFocus()`
`true`), on every production route.

| Page | Tabbables | No ring | Off-screen | Unnamed | Refused focus |
|---|---|---|---|---|---|
| HOME | 17 (real Tab traversal) | 0 | 0 | 0 | 0 |
| ABOUT | 10 | 0 | 0 | 0 | 0 |
| PROJECTS | 21 | 0 | 0 | 0 | 0 |
| AI LAB | 29 | 0 | 0 | 0 | 0 |
| LEARNING | 38 | 0 | 0 | 0 | 0 |
| GITHUB | 31 | 0 | 0 | 0 | 0 |
| CONTACT | 15 | 0 | 0 | 0 | 0 |
| 404 | 17 | 0 | 0 | 0 | 0 |

Also verified: **no positive `tabindex` anywhere** (the only `tabindex` in the
build is `-1` on `<main>`, plus `0` on the five scroll regions); the skip link
is the first stop and moves focus to `<main>` itself; `<main tabindex="-1">`
draws no ring on a mouse click because the focus style is
`:where(:focus-visible)`; no focus trap (the HOME chain wrapped through the
browser chrome and back); one `<h1>` per page; zero duplicate ids; zero broken
`aria-labelledby`; landmarks and `aria-current` intact; every external anchor
carries `rel="noopener noreferrer"`.

Every table keeps its `<caption>`, its `<thead>` (in the accessibility tree,
clipped rather than `display: none` at narrow widths), and its `scope`
attributes: 6/3, 5/7, 4/9, 4/17 + 5 colgroup, 4/13 col/row headers.

**NOT VERIFIED, and not claimed: WCAG compliance.** No axe run, no Lighthouse
run, no screen-reader pass has ever been done on this project. What is claimed
is exactly the list above.

### 1K.13 Reduced motion and no-JS — VERIFIED

**45 animation declarations.** 43 are inside
`@media (prefers-reduced-motion: no-preference)`. One — the HOME wordmark glyph
strike — uses the opposite valid pattern, an explicit
`@media (prefers-reduced-motion: reduce) { animation: none }`, and is protected
twice because the duration token is zeroed under reduce as well. The 45th
"declaration" my parser counted *is* that cancellation. **Zero unguarded.**

No infinite animation in any stylesheet. No `outline: none` or `outline: 0`
anywhere. The reduced-motion block still zeroes `--motion-scale` and the whole
duration clock at the token source.

**No-JS:** `<main>` text is identical with and without JavaScript on every
world — ABOUT 1,683 · PROJECTS 1,683 · AI LAB 21,059 · CYBERSECURITY 372 ·
LEARNING 11,781 · GITHUB 6,506 · CONTACT 3,652 · 404 435 characters. Zero
inline scripts on any page. The redirect stub contains no script at all.

### 1K.14 Manual test for the architect — REQUIRES ARCHITECT ACTION

CI cannot prove mail is delivered. This is the only end-to-end test the Contact
world has:

1. Open `/contact`.
2. Click the preferred email channel.
3. Confirm the mail client opens with recipient `ayushrijal83@gmail.com`.
4. Confirm the subject reads `Correspondence`.
5. Send a real test message.
6. Confirm it arrives, in that mailbox.

### 1K.15 Internal link audit — VERIFIED

17 HTML files, **252 internal links and fragments checked**.

| Check | Result |
|---|---|
| Broken internal links | **0** |
| References to `/ai`, `/journey`, `/blog` | **0** |
| Stray `.html` links | **0** |
| Dead fragments | **0** |
| `/lab/` links | 3, all *within* `/lab/index.html` — never from a world's navigation |

### 1K.16 Content claim audit — VERIFIED

Fourteen fabrication patterns plus five M08-specific regression patterns, over
all 17 pages. **Four matches, all reviewed and all legitimate:**

| Match | Page | Why it stands |
|---|---|---|
| `30%` | /ai-lab | An EMA smoothing factor read from source (`SMOOTHING_FACTOR = 0.3`) |
| `40%` | /projects/agrovision-nepal | The scoring weights read from source in M05 |
| `19 commits` | /learning | The Bandit log's actual commit count, counted in a named public repository |
| `52%` | /lab/pretext | CSS shown in a code block on an internal, robots-disallowed page |

**Zero claims** of certification, award, employer, client, user count, follower
count, founder title, deployment, trained model, years of experience,
proficiency level, revenue, CVE, or security engagement.

The M08 corrections were checked positively, not just by absence:

| Correction | Present |
|---|---|
| "Running nmap against a real network is not recorded here" | yes |
| "No capture of my own is published" | yes |
| "Nothing here was trained" | yes |
| Training a model → `Not attempted` | yes |
| Jarvis says "no cloud API is involved", never "fully offline"/"no network" | yes |
| "It is named the emotion engine and it does not detect emotion." | yes |
| Head pose described as a nose-and-eye-line estimate, never "gaze" | yes |
| AgroVision "Not built" roadmap boundary | yes |

### 1K.17 Build and CI — VERIFIED

Clean sequence from a clean tree: `npm ci` · `astro check` 0/0/0 ·
`npm run verify` pass · `npm run test:github` 18/18 · `npm audit` 0.

**17 HTML files** — 8 worlds, 3 project records, 4 lab pages, `404.html`, and
1 legacy stub. Plus `sitemap.xml`, `robots.txt`, `CNAME`, `.nojekyll`.

No lab route appears in the sitemap or in any world's navigation. No missing
asset, no broken internal link, no credential hit, no API origin.

**No dependency was added.** `package.json` and `package-lock.json` are
unchanged.

### 1K.18 Assertions added — 14, all negative-tested

Legacy: stub exists · zero-delay refresh to the right target · canonical ·
visible fallback link · no script in a stub · **no stub may shadow a world
route** · every unresolved URL is absent · the map is non-empty.
Cybersecurity: three overstatement patterns · the empty state survives.
Contact: subject prefill · exactly one address · hosted form relays.

One planted paragraph, one deleted stub, one broken stub, one orphan file and
one colliding map entry produce fourteen distinct failures.

**A control character was caught again.** A `\b` was corrupted to U+0008 by the
shell while writing the form-relay pattern — the third occurrence in this
project. Found by the byte-level scan that M08 made standing practice, repaired
before the result was believed. Zero remain in any script.

### 1K.19 Browser coverage — Chrome VERIFIED, others NOT

| Browser | Version | Coverage |
|---|---|---|
| Chrome | 151 / Windows 11 | Full: interaction, keyboard, focus, responsive, no-JS |
| Firefox | 154 | Visual spot-check only (M10), not re-run in M11 |
| Edge | 151.0.4129.101 | Screenshot only. Chromium — same engine as Chrome |
| Safari / WebKit | — | **Not available on this machine. Not tested** |

The M11 changes were verified in Chrome only. `overflow-x: auto` with
`role="region"` is long-settled across engines, but that is reasoning, not a
measurement, and it is recorded as such.

### 1K.20 External actions still required

1. **REQUIRES EXTERNAL ACTION — revoke and rotate the exposed OpenWeatherMap
   credential in `Agriculture_simulator`.** Outside this repository, not
   touched, value not reproduced anywhere in this archive, and no page
   describes that repository as security-clean. Open since M05.
2. **REQUIRES EXTERNAL ACTION — switch the GitHub Pages source to GitHub
   Actions.** A repository setting; not possible from code.
3. **REQUIRES EXTERNAL ACTION — push `v2`**, which is the only way CI and
   `github-data.yml` can ever be observed.
4. **REQUIRES ARCHITECT ACTION — send one real test email** (§1K.14).
5. **REQUIRES EXTERNAL ACTION — confirm DNS** for `ayushrijal.com.np` points
   where the new deployment will serve. Not verified here.

### 1K.21 Unresolved architect decisions

1. `/journey.html` and `/blog.html` destinations.
2. Whether to enable `/about.html` and `/contact.html` stubs, which needs the
   Pages resolution-order observation in §1K.1 first.
3. The three withheld contact channels.
4. Favicon and `og:image` — both still absent, both still correct to be absent,
   both visible to every visitor and every shared link.
5. CYBERSECURITY: hold as a stub, give it one real write-up, or fold it in.

### 1K.22 Commits

| Hash | |
|---|---|
| `8d56ec3` | `fix(cutover): finalize legacy route handling` |
| `91a05c7` | `fix(a11y): make the data tables reflow safely under enlarged text` |
| `555ab59` | `fix(content): correct the unsupported archive summary` |
| `631b0cb` | `test(cutover): harden deployment verification` |
| _this_ | `docs: record M11 cutover readiness` |

Working tree clean on `v2`. `main` at `f42314e`, untouched. V1 byte-identical.
`git diff --check` clean. No dependency change.

---

## 1L. M12 — Final cutover

**Status: FINAL CUTOVER READY — MANUAL ACTIONS REMAIN.**

V2 is built, verified and **pushed**. CI has run on a real GitHub runner and
passed. **Production has NOT been cut over** — it still serves V1, untouched —
because switching the Pages source is a repository setting no credential in
this environment can reach.

Labels used below: **COMPLETE**, **VERIFIED**, **OBSERVED**, **MANUAL ACTION
REQUIRED**, **NOT TESTED**, **DEFERRED**, **BLOCKED**.

### 1L.0 Baseline — VERIFIED

Branch `v2`, HEAD `9e6defb`, working tree clean before any change.
`npm ci` clean · `astro check` 0/0/0 · `verify` pass · `test:github` 18/18 ·
`npm audit` 0.

**One pre-existing condition found and cleared.** Local `main` is one commit
ahead of `origin/main` — `f42314e`, the M01 documentation commit, which touches
`docs/PROJECT_PROGRESS.md` and nothing else. V1 was therefore checked against
**both**: byte-identical against local `main` and against `origin/main`, which
is what production actually serves. The stronger of the two is the one that
matters, and it holds.

### 1L.1 Decisions resolved — COMPLETE

| Decision | Resolution |
|---|---|
| `/journey.html` | → 404. No verified V2 destination; none invented |
| `/blog.html` | → 404. No successor exists |
| `/about.html`, `/contact.html` | → 404. Stubs would shadow the live routes (M11 §1K.1). **BLOCKED** on observing real Pages resolution order |
| Withheld contact channels | Kept withheld. Nothing published, no consent inferred |
| Favicon / `og:image` | **DEFERRED** as post-cutover polish. No imagery invented |
| CYBERSECURITY | Remains ON HOLD. Not built, not modified |

### 1L.2 Two content defects found and corrected

**Head pose is not gaze — and the archive was contradicting itself.**

M06 established from source, and experiment 002 states outright: *"Nose-below-
eyes is not gaze; it is head pose, and someone can look at a screen with their
head down."* Two tables went on calling it gaze anyway — the Jarvis record's
stack table (*"face presence, gaze and gesture"*) and, **on the very page
carrying that experiment**, the AI Lab provenance table (*"Face and gaze"*).

Both now read "head pose", which is what the code computes.

M11's regression pattern missed it because it only matched *gaze tracking*,
*gaze detection* and *gaze estimation* — never the bare noun in a table cell.
The replacement is a negative lookbehind, `(?<!not )\bgaze\b`, not a page-level
exception: a check phrased as "unless the page also says it is not gaze" goes
inert the moment that sentence ships, which is the M08 failure mode. Verified
both ways — it fires on the claim and passes on the denial, in the same
paragraph, on the same page.

**The 404 page was indexable.** GitHub Pages serves `404.html` for every
unresolvable path, so a crawler could collect the same page under any number of
URLs; its canonical also pointed at `/404`, which is not a page. Now `noindex`.
The legacy stub deliberately does not get it — there the point is for a crawler
to follow the canonical to the new URL.

### 1L.3 Legacy URL behaviour — VERIFIED locally, one item BLOCKED

Tested by request against the production build served locally:

| URL | Observed | State |
|---|---|---|
| `/` | 200, HOME | **VERIFIED** |
| `/about`, `/contact`, `/projects` | 200, the real worlds | **VERIFIED** — no stub shadowing |
| `/work.html` | 200, "Moved to Engineering Workshop", canonical → `/projects` | **VERIFIED** |
| `/about.html` | 404 page | **VERIFIED** (intended) |
| `/journey.html`, `/blog.html`, `/assets/resume.pdf` | 404 page | **VERIFIED** (intended) |
| `/ai` | no such route; none created | **VERIFIED** |

**BLOCKED, and it cannot be unblocked from here:** whether GitHub Pages
resolves `/about` to `about.html` or to `about/index.html`. The local preview
resolved it to the file, which is why two stubs were withdrawn in M11. The real
answer needs V2 actually served by Pages. Until then no speculative workaround
exists, and none was created.

### 1L.4 Content audit — VERIFIED

19 patterns over 17 pages. **Four matches, all reviewed, all legitimate:** an
EMA smoothing constant (`30%`), the AgroVision scoring weights (`40%`), the
Bandit log's real commit count (`19 commits`), and CSS quoted in a code block
on an internal page.

Zero claims of certification, award, employer, client, user count, follower
count, founder title, deployment, trained model, years of experience,
proficiency percentage, revenue, CVE, or security engagement.

The corrected AR-04 summary is present on both consuming pages and the previous
wording appears in **zero** built files:

> *"Nothing is filed here yet — the security work this archive can show is in
> the field notebook and the workshop."*

### 1L.5 Contact — VERIFIED (link), NOT TESTED (delivery)

Nothing added. The three withheld channels remain withheld and the build fails
on any `wa.me` link or `tel:` href.

The published address matches the repository-verified one exactly. It is a
`mailto:` with the `subject=Correspondence` prefill, it is the only address on
the page, it is also the link text so it can be copied, no form exists
anywhere, no third-party relay appears, and no contact data is transmitted
automatically — the shipped JavaScript contains no network-capable construct at
all.

**No external test email was sent.** Real mailbox delivery remains a manual
user test — **MANUAL ACTION REQUIRED**, §1L.13.

### 1L.6 Accessibility — VERIFIED, limits unchanged

Every tabbable element on all 12 production routes, focused in turn with the
browser window genuinely focused:

| Route | Tabbables | Problems |
|---|---|---|
| `/` | 16 | 0 |
| `/about` | 10 | 0 |
| `/projects` | 21 | 0 |
| `/ai-lab` | 29 | 0 |
| `/cybersecurity` | 10 | 0 |
| `/learning` | 38 | 0 |
| `/github` | 31 | 0 |
| `/contact` | 15 | 0 |
| `/404.html` | 17 | 0 |
| 3 project records | 13 each | 0 |

"Problems" counts anything without a visible focus ring, off-screen, without an
accessible name, or refusing focus. Also on every route: the skip link moves
focus to `<main>` (**true on all twelve**), zero positive `tabindex`, exactly
one `<h1>`, zero duplicate ids, zero broken `aria-labelledby`, correct
`aria-current`, zero external links missing `rel="noopener noreferrer"`.

Tables: every authored table keeps its `<caption>` and `scope` attributes.
**One exception, recorded rather than fixed:** the Jarvis record contains a
markdown-rendered table with no `<caption>` and no explicit `scope`. Its `<th>`
cells sit in a `<thead>`, which makes them implicit column headers, so it is
usable but not ideal. Adding either would need raw HTML in a verified content
file or a rehype plugin — and M08 established that rehype plugins require a
dependency that swaps Astro's whole Markdown processor. **DEFERRED.**

**NOT TESTED, and not claimed: WCAG compliance.** No axe, no Lighthouse, no
screen reader — at any point in this project.

### 1L.7 Responsive — VERIFIED

**10 widths × 12 pages = 120 combinations, zero horizontal overflow.**
320, 360, 375, 390, 414, 768, 1024, 1280, 1440, 1920.

**Text-only 200% resize: 12 of 12 pages, zero overflow.**

Stress test at 320px with adversarial unbroken strings — an 80-character email
address, an 87-character repository URL, a 66-character repository name, a
53-character space-free personal name, long link labels — on `/contact`,
`/github` and `/learning`: **zero overflow on all three.**

### 1L.8 Security — VERIFIED

| Check | Result |
|---|---|
| Credential scan | 35 text files, 41 total, **0 hits** |
| GitHub tokens / PATs / Authorization headers | none |
| API keys, private keys, credential-shaped assignments | none |
| Environment values, local filesystem paths | none |
| Source maps emitted | **0** |
| `sourceMappingURL` references | **0** |
| Shipped JS | 6 files, **6,195 bytes** |
| `fetch` / XHR / WebSocket / EventSource / sendBeacon / dynamic import | **0** — the client code cannot make a network request |
| `api.github.com` anywhere | absent |
| Third-party **resources** | **none.** Zero absolute `src=` in the entire build |
| Outbound **anchors** | `github.com`, `www.linkedin.com`, `overthewire.org` |
| Debug artefacts, `.env` files, dev-only files, test fixtures | none |

`localhost:11434` appears as prose only, on `/ai-lab` and `/learning`, never in
an attribute — confirmed at attribute level. It is Ollama's documented default
port.

No matched value was printed at any point, and no security assertion was
weakened.

### 1L.9 Build — VERIFIED

Clean sequence from a clean tree: `npm ci` · `astro check` **0 errors, 0
warnings, 0 hints** · `npm run verify` pass · `npm run test:github` 18/18 ·
`npm audit` **0**.

17 HTML files: 8 worlds, 3 project records, 4 lab pages, `404.html`, 1 legacy
stub. Plus `sitemap.xml` (11 URLs), `robots.txt`, `CNAME`, `.nojekyll`.

No lab route in the sitemap or in any world's navigation. 252 internal links
and fragments checked: **0 broken, 0 references to `/ai`, `/journey` or
`/blog`, 0 stray `.html`, 0 dead fragments.** No dependency added.

### 1L.10 Push — OBSERVED

```
git push -u origin v2
 * [new branch]      v2 -> v2
```

| | |
|---|---|
| Destination | `https://github.com/ayushrijal83-ops/ayushrijal.com.np.git` |
| `origin/v2` | `0ad99ef` — matches local HEAD exactly |
| `origin/main` | `41d4dc1` — **unchanged** |
| Remote branches | `main`, `v2`, and nothing else |
| Force push | none |
| History rewritten | none |

### 1L.11 GitHub Actions — OBSERVED for the first time

**CI ran on a real GitHub runner and passed.** Run #1, workflow `CI`, branch
`v2`, event `push`, sha `0ad99ef`, conclusion **success**, 24 seconds.

| Step | Result |
|---|---|
| Set up job | success |
| `actions/checkout@v4` | success |
| `actions/setup-node@v4` | success |
| Install (`npm ci`) | success |
| **Refresh GitHub repository data** | success — a live authenticated fetch |
| **Verify** | success |
| **Test the GitHub fallback and secret isolation** | success |
| **Audit dependencies** | success |

This closes an item open since M05. Every previous milestone recorded the
workflows as never executed; they have now executed, remotely, and passed.

**`github-data.yml` did NOT register — and this is a GitHub constraint, not a
defect.** Only two workflows are listed on the repository: `CI` and the dynamic
Pages build. GitHub registers `schedule` and `workflow_dispatch` triggers **only
from the default branch**, and the default branch is `main`. So the scheduled
snapshot refresh is dormant, cannot be dispatched, and **cannot be observed
until `v2` is merged into `main`.** Nothing in the workflow needs changing;
neither workflow was modified.

Static inspection of `github-data.yml` stands from M11: `contents: write` is
the minimum needed to commit, the token is passed only as an environment
variable to one step and never written to a file, `npm run verify` runs before
the unattended push, and `--promote` is a no-op unless a repository fact moved.

### 1L.12 GitHub Pages and production — BLOCKED, then NOT TESTED

**Pages source could not be read or changed.** The Pages API returns 404
unauthenticated, and this environment has no `gh` CLI, no `GH_TOKEN` and no
`GITHUB_TOKEN`. Nothing was attempted blindly and no setting is claimed to have
changed.

**MANUAL ACTION REQUIRED — the exact step:**
> GitHub → repository **Settings** → **Pages** → **Build and deployment** →
> **Source** → change from *Deploy from a branch* to **GitHub Actions**.

**Production has not been cut over.** Verified as of this milestone:

| | |
|---|---|
| `https://ayushrijal.com.np/` | HTTP **200**, 0.64 s |
| TLS chain | valid (`ssl_verify_result 0`) |
| Content served | **still V1** — V1's title and its three.js import map are present |
| Pages deployments since the push | **none.** The v2 push triggered exactly one run, CI on `v2` |

So the push did not disturb production, which was the point of checking.

**Everything in Phases 12–13 that concerns V2 in production is NOT TESTED**,
because V2 is not in production. Every one of those checks — status codes,
titles, one `<h1>`, CSS and font loading, gate, navigation, skip link,
overflow, console errors, `/_astro/` assets — was performed against the
identical build served locally and is recorded above. They are not the same
thing as a production observation and are not presented as one.

### 1L.13 DNS — VERIFIED

Checked, not assumed:

| Record | Value |
|---|---|
| `ayushrijal.com.np` A | `185.199.108.153`, `.109.153`, `.110.153`, `.111.153` — the four GitHub Pages apex addresses |
| `www.ayushrijal.com.np` CNAME | `ayushrijal83-ops.github.io.` |
| TLS | valid chain, HTTPS serving 200 |

DNS is already correct for GitHub Pages and needs **no change** at cutover: the
same records serve whatever Pages publishes. What changes is only which build
Pages publishes.

### 1L.14 Browser coverage

| Browser | Version | Coverage |
|---|---|---|
| Chrome | 151 / Windows 11 | Full — interaction, keyboard, focus, responsive, no-JS, console |
| Firefox | 154 | Visual spot-check (M10). **Not re-run in M12** |
| Edge | 151.0.4129.101 | Screenshot only (M10). Chromium — same engine as Chrome |
| Safari / WebKit | — | **NOT TESTED.** Not available on this machine |

### 1L.15 Reduced motion and no-JS — VERIFIED

45 animation declarations: 43 inside `prefers-reduced-motion: no-preference`,
one (the HOME wordmark strike) cancelled by an explicit `reduce` override and
protected again by the zeroed duration clock, and the 45th "declaration" is
that cancellation. **Zero unguarded.** No infinite animation. No
`outline: none` in any stylesheet.

No-JS: `<main>` text is identical with and without JavaScript on **8 of 9**
routes — ABOUT 1,007 · PROJECTS 1,683 · AI LAB 21,064 · CYBERSECURITY 372 ·
LEARNING 11,781 · GITHUB 6,506 · CONTACT 3,652 · 404 435 characters. Zero
inline scripts anywhere.

HOME differs by exactly 10 characters, and that is the designed island: with
JavaScript the wordmark renders per-glyph (`AyushRijal`) alongside the static
fallback (`Ayush Rijal`). The static HTML carries the fallback `<h1>`, the
standfirst and the verbatim philosophy line — all three asserted on every
build since M03-B.

### 1L.16 Manual actions remaining

1. **MANUAL ACTION REQUIRED — switch the Pages source to GitHub Actions**
   (§1L.12). Nothing deploys until this happens.
2. **MANUAL ACTION REQUIRED — add a deploy workflow** and verify it on `v2`
   before merging.
3. **MANUAL ACTION REQUIRED — merge `v2` into `main`**, which is also what
   makes `github-data.yml` register and its cron start (§1L.11).
4. **MANUAL ACTION REQUIRED — observe Pages resolution order** once V2 is
   served, then decide whether `/about.html` and `/contact.html` stubs can be
   enabled (§1L.3).
5. **MANUAL ACTION REQUIRED — send one real test email** to the published
   address and confirm receipt. CI cannot prove delivery.
6. **EXTERNAL — revoke and rotate the exposed OpenWeatherMap credential** in
   `Agriculture_simulator`. Outside this repository, not touched, value not
   reproduced anywhere. **OpenWeatherMap credential revocation remains an
   external manual action, and this project is not fully security-clean while
   it stands.**

### 1L.17 Commits

| Hash | |
|---|---|
| `3f79216` | `fix(content): head pose is not gaze` |
| `f21a2f4` | `fix(seo): keep the 404 page out of search` |
| `0ad99ef` | `test(cutover): assert indexability and the gaze correction` |
| _this_ | `docs: record M12 — final cutover` |

Working tree clean on `v2`. `origin/v2` = `0ad99ef`. `origin/main` = `41d4dc1`,
untouched. V1 byte-identical against both local `main` and `origin/main`.
`git diff --check` clean. No dependency change. No history rewritten, no force
push, nothing merged.

### 1L.18 Exact final project state

**FINAL CUTOVER READY — MANUAL ACTIONS REMAIN.**

| | |
|---|---|
| V2 built | **COMPLETE** |
| V2 verified | **COMPLETE** |
| V2 deployable | **COMPLETE** |
| V2 pushed | **OBSERVED** — `origin/v2` at `0ad99ef` |
| GitHub Actions | **OBSERVED** — CI passed remotely in 24 s. `github-data.yml` dormant until merge |
| Pages source switched | **BLOCKED** — no credential; manual setting |
| Production cut over | **NOT DONE** — production still serves V1 |
| Custom domain | **VERIFIED** — DNS and TLS correct, no change needed |
| Production smoke test of V2 | **NOT TESTED** — V2 is not in production |
| Redirect / 404 behaviour | **VERIFIED locally**, one question **BLOCKED** on deployment |
| Security | **VERIFIED** in the build; one **EXTERNAL** action outstanding |
| `main` | untouched |
| V1 | byte-identical |
| CYBERSECURITY | ON HOLD, not built |

---

## 1M. M13 — Production verification

**Observation only. No architecture was changed, nothing was redesigned, no
feature was added, `main` was not touched, and CYBERSECURITY was not built.**

**Result: the cutover has not reached production. The live site is V1.**

Every line below is something that was actually requested over the network or
read out of git on **2026-08-24**. Where a thing could not be observed, it is
recorded as not observed rather than assumed.

### 1M.1 What the remote actually contains — OBSERVED

`git ls-remote origin`:

```
41d4dc13d755687e72d7c8c13481ffb835ee3676  refs/heads/main
e394fe2e69c15daf08f4539dca7981b46611ebb4  refs/heads/v2
```

`41d4dc1` is *Fix broken reveal animation and cut 3D rendering cost* — V1's
last commit, dated 2026-08-08. It is the same commit `main` has pointed at
since before M01. **The merge of `v2` into `main` is not on GitHub.**

Confirmed three independent ways rather than inferred from the hash:

| Check | Result |
|---|---|
| `git merge-base --is-ancestor origin/v2 origin/main` | **NO** |
| `git ls-tree origin/main` | V1 tree only — no `.github/`, no `src/`, no `astro.config.mjs`, no `package.json` |
| local `main` (`f42314e`) | also V1 tree plus `docs/`; carries no merge commit either |

So the merge is absent from the remote **and** from this clone. It was either
not completed or completed somewhere this environment cannot see.

### 1M.2 GitHub Actions — OBSERVED, and it is the second blocker

Read from the public Actions API (`/actions/runs`). Nine runs total.

| Run | Branch | Created | Conclusion |
|---|---|---|---|
| CI | `v2` | 2026-08-23T15:07:20Z | success |
| CI | `v2` | 2026-08-23T15:01:55Z | success |
| pages build and deployment | `main` | **2026-08-08T13:53:01Z** | success |
| pages build and deployment | `main` | 2026-08-08T13:15:52Z | success |
| … four older `pages build and deployment` runs on `main`, all 2026-08-08 | | | |

Filtered to `main`: seven runs, **the newest 2026-08-08T13:53:01Z**. There has
been **no workflow run on `main` since 2026-08-08** — no deploy, no Pages
build, nothing. Consistent with §1M.1: nothing was pushed, so nothing ran.

**And nothing would have run even if it had been.** `git log --all` over
`.github/workflows/*` returns no deploy or Pages workflow in any branch's
history. The repository contained exactly two workflows, `ci.yml` and
`github-data.yml`, and `ci.yml` triggers only on `v2` pushes and PRs and states
in its own header that it never publishes. §14 step 2 predicted precisely this.

With the Pages source switched to **GitHub Actions**, the legacy
*pages build and deployment* builder stops running and no workflow replaces it.
Merging `v2` into `main` in that state would have deployed **nothing** — the
site would simply have frozen on the 2026-08-08 V1 build indefinitely, with no
error anywhere to indicate why.

**Pages source setting: NOT OBSERVED.** `GET /repos/…/pages` returns
`404 Not Found` unauthenticated. That endpoint requires a credential even for a
public repository, so the 404 distinguishes nothing and no claim is made about
the setting either way.

### 1M.3 What production is serving — OBSERVED: V1

```
HTTP/1.1 200 OK
Server: GitHub.com
Last-Modified: Sat, 08 Aug 2026 13:53:15 GMT
Content-Length: 13150
```

`Last-Modified` matches the 2026-08-08T13:53:01Z Pages build to within
fourteen seconds. **Production is literally that artifact.** The served
`<title>` is `Ayush Rijal — Cybersecurity Developer & AI Builder`, V1's title,
with V1's description and V1's canonical tag.

### 1M.4 The eight V2 routes — OBSERVED, four are 404

| Route | Status | Bytes | What is actually being served |
|---|---|---|---|
| `/` | 200 | 13150 | **V1 home**, not the V2 Home world |
| `/about` | 200 | 10802 | **V1 `about.html`** via Pages extension-stripping |
| `/projects` | **404** | 9379 | GitHub's default 404 |
| `/ai-lab` | **404** | 9379 | GitHub's default 404 |
| `/github` | **404** | 9379 | GitHub's default 404 |
| `/learning` | **404** | 9379 | GitHub's default 404 |
| `/contact` | 200 | 11929 | **V1 `contact.html`** via extension-stripping |
| `/404` | **404** | 9379 | GitHub's default 404 |

None of the eight worlds exists in production. The two that return 200 are V1
pages reached through GitHub Pages' automatic `.html` fallback, not V2 routes —
proved in §1M.5, not assumed from the byte counts.

### 1M.5 Legacy routes — OBSERVED, all still V1 originals

| Route | Status | Bytes | Note |
|---|---|---|---|
| `/work.html` | 200 | 10890 | The **V1 Work page itself**. Not the 1,640-byte V2 redirect stub, and it does not redirect to `/projects`. |
| `/about.html` | 200 | 10802 | V1 About |
| `/contact.html` | 200 | 11929 | V1 Contact |
| `/journey.html` | 200 | 10070 | V1 Journey — still live; the V2 plan retires it to the 404 |
| `/blog.html` | 200 | 9057 | V1 Blog — still live; the V2 plan retires it to the 404 |
| `/assets/resume.pdf` | 200 | 94116 | Still published; V2 deliberately does not carry it forward |

`/work.html` at 10,890 bytes is the decisive one. V2's generated stub is 1,640
bytes and carries a zero-delay meta refresh. What production serves is neither.

### 1M.6 The `/about.html` ↔ `/about` collision — the M11 question, answered for V1 only

Requested both URLs and compared body hashes:

```
/about       969f2be0248eacdd168b4a1a8fa7a212
/about.html  969f2be0248eacdd168b4a1a8fa7a212   IDENTICAL
```

Same for `/contact` and `/contact.html`. So on the **live host**, GitHub Pages
resolves the extensionless `/about` to the file `about.html`.

This is a genuine observation of GitHub Pages' resolution behaviour, and it is
the first time it has been measured on the real host rather than in the local
preview. **But it does not answer §14 step 4.** There is no `about/index.html`
in production to compete with `about.html`, so what was observed is a fallback
with nothing to fall back *from* — not the precedence contest that matters.

**§14 step 4 remains BLOCKED and unanswerable until V2 is actually deployed.**
The conservative reading stands: M11 measured the file winning locally, the
live host resolves to the file here, and nothing observed today gives any
reason to enable the two withdrawn stubs. `LEGACY_ROUTES` is unchanged and
still contains only `work.html` — the one stub with no live route to shadow.

### 1M.7 Domain, TLS, sitemap, robots, 404 — OBSERVED

| Item | Observed |
|---|---|
| `CNAME` | serves `ayushrijal.com.np` — correct |
| HTTPS | valid chain; every request in this milestone completed over TLS with no warning |
| Apex resolution | reaching GitHub Pages (`Server: GitHub.com`, `x-github-edge-region: centralindia`) |
| `robots.txt` | 200, **V1's** — `Allow: /` plus the sitemap line, 71 bytes. Not V2's 404-byte file. |
| `sitemap.xml` | 200, **V1's** — six `<loc>` entries, all `.html`: `/`, `/about.html`, `/work.html`, `/journey.html`, `/blog.html`, `/contact.html`. No V2 world appears. |
| 404 behaviour | **GitHub's default page** — `<title>Page not found · GitHub Pages</title>`. V1 has no `404.html`; V2's 8,986-byte custom 404 is not deployed. |

DNS and TLS are the only part of the cutover that is genuinely correct and
needs no action, which matches what M12 recorded.

### 1M.8 Production smoke test — run against V1, because that is what is live

Item 10 was executed against production as it stands. **Every result below
describes V1 and says nothing about V2**, which is not in production and was
therefore not smoke-tested.

- Assets referenced by the live home page: `/css/style.css`, `/js/bg-3d.js`,
  `/js/hero-3d.js`, `/js/main.js` — all V1 paths. **No `/_astro/` bundle is
  referenced or served**, so `.nojekyll` was not exercised and §14 step 5's
  underscore-directory question is untested.
- Browser-level checks — rendering, console errors, horizontal overflow at
  320 px — were **NOT RUN**. Running them would have measured V1, which is
  outside this milestone's scope and would prove nothing about V2. Recorded as
  not tested rather than quietly skipped.

### 1M.9 Item 11 — production content scan — OBSERVED, and V1 fails it

Fetched every script the live page loads and scanned each.

| Asset | Finding |
|---|---|
| `/js/bg-3d.js` | clean |
| `/js/hero-3d.js` | clean |
| `/js/main.js` | **contains `api.github.com`** |

Source maps: no `sourceMappingURL` in any served asset. Credentials: no
`ghp_`, `github_pat_` or `Bearer` token in any served asset.

External origins referenced by the live home page:

```
api.github.com      cdn.jsdelivr.net    fonts.googleapis.com
fonts.gstatic.com   github.com          schema.org
wa.me               www.facebook.com    www.instagram.com
www.linkedin.com
```

This is **V1's** runtime GitHub calling and V1's third-party font and CDN
loading — exactly the behaviour V2 was built to eliminate by moving GitHub
retrieval to build time and self-hosting fonts. `verify-output.mjs` fails the
build on any third-party origin, so V2's output cannot contain these. **The
finding is against production, and production is V1.** It is not a V2 defect
and it resolves itself the moment the cutover actually happens.

### 1M.10 The one change made — `.github/workflows/deploy.yml`

Under item 13, one production-blocking defect was fixed: **the repository had
no deploy workflow at all**, so with the Pages source on GitHub Actions nothing
could ever publish. This is §14 step 2, already planned and already specified;
it is not new architecture and adds no feature.

Seventy lines on `v2`, untracked, using the canonical Pages actions:

- triggers on `push` to `main` and on `workflow_dispatch`
- `permissions: contents: read, pages: write, id-token: write`
- `concurrency: group: pages, cancel-in-progress: false` — a cancelled deploy
  can leave Pages serving a half-uploaded artifact
- `npm ci` from the committed lockfile; Node 24, matching `ci.yml`
- `npm run github:fetch` with `continue-on-error: true` — same contract as
  `ci.yml`: a GitHub outage falls back to the committed snapshot
- `npm run verify`, **not** `npm run build` — the output assertions run against
  the very artifact about to be published
- `upload-pages-artifact` from `dist`, then `deploy-pages`

**NOT OBSERVED: this workflow has never run.** It is uncommitted, unpushed, and
cannot execute until it is on a branch GitHub can trigger. No claim is made
that it works. §14 step 2's instruction to prove it on `v2` before merging
still stands and is now the next action.

Nothing else was changed. `git status` shows one untracked file and no
modifications to any source file.

### 1M.11 M13 verification summary

| Item requested | Result |
|---|---|
| Remote `main` commit | **OBSERVED** — `41d4dc1`, V1, unchanged since 2026-08-08 |
| Merge of `v2` into `main` | **NOT PRESENT** on the remote or in this clone |
| Actions deployment run | **NONE EXISTS** — no run on `main` since 2026-08-08 |
| Pages deployment succeeded | **NO** — last Pages build 2026-08-08, and it built V1 |
| Pages source setting | **NOT OBSERVED** — endpoint needs a credential |
| Production serving V2 | **NO** — production serves V1 |
| Eight V2 routes | **4 × 404**, 4 × V1 pages. None is a V2 world. |
| Legacy routes | All six serve **V1 originals**; `/work.html` does not redirect |
| `/about.html` collision | Live host resolves `/about` → `about.html`; **§14 step 4 still unanswerable** without V2 deployed |
| CNAME / HTTPS / DNS | **VERIFIED** — correct, no action needed |
| `sitemap.xml` / `robots.txt` | **V1's**, serving correctly |
| 404 behaviour | **GitHub default** — V2's custom 404 not deployed |
| Smoke test | Run against **V1**. Browser checks **NOT RUN** — would measure V1. |
| `api.github.com` / secrets / source maps | `api.github.com` **PRESENT** in V1's `main.js`. No secrets, no source maps. A V1 property. |
| Deploy workflow | **Was missing.** Added on `v2`. **Never executed.** |

**Two blockers, in order:**

1. **The merge never reached GitHub.** `origin/main` is still V1.
2. **No deploy workflow existed.** Now written, never run.

Both must be resolved before any production verification of V2 is possible.
The next action is §14 step 2 — get `deploy.yml` onto a branch and prove it
runs — followed by §14 step 1 confirmed and §14 step 3 pushed.

---

## 1N. M13-B — Deployment recovery

**Blocker 2 of §1M is closed. Blocker 1 is not, and a third has been isolated.**

The deployment mechanism now exists and has been **observed executing
successfully on a real GitHub runner**. Production has not changed and must not
be described as having changed: no merge has happened, and the Pages source
setting still cannot be read from this environment.

Nothing was redesigned, no world was touched, CYBERSECURITY was not started,
no verification assertion was weakened, and `main` was not modified.

### 1N.1 The audit of `deploy.yml` — four defects found in the M13 draft

The workflow written at the end of §1M was reviewed line by line before being
pushed, and **it was wrong in four ways**. It is recorded here because three of
the four would have caused real damage.

**1 — It could never run on `v2`.** Trigger was `push: branches: [main]`. The
first execution of the workflow would therefore have been the one publishing to
the live site, which is precisely the untested-deployment failure §1M was
written about. Fixed: `branches: [main, v2]`.

**2 — Adding `v2` to the trigger would have cut over production early.**
`actions/deploy-pages` publishes to the single Pages site **regardless of ref**,
so a naïve fix to defect 1 would have deployed V2 the moment `v2` was pushed —
an unauthorised cutover, out of order with every remaining phase. Fixed by
splitting the workflow: the `build` job runs on both branches, and the `deploy`
job carries `if: github.ref == 'refs/heads/main'`. **This guard was then proven
on the runner — see §1N.3.**

**3 — It bypassed two gates.** The draft ran `npm run verify` but neither
`npm run test:github` nor `npm audit --audit-level=high`. And `ci.yml` does not
trigger on `main` pushes at all — only `v2` and pull requests — so at the
cutover merge those two gates would have run **nowhere**, and the artifact
would have been published having never faced the dependency audit or the
fallback/secret-isolation test. Fixed: the deploy path re-runs every gate
`ci.yml` runs rather than assuming CI covered it.

**4 — Gate ORDER was unsafe for a workflow that publishes.** The draft copied
`ci.yml`'s order, `verify` → `test:github`. But `test:github` works by breaking
things: it hides both data files and rebuilds, then writes a `ghp_…`-shaped
canary into `dist/` to prove the credential scanner fires. It restores and
rebuilds afterwards — but that final rebuild is a bare `astro build` that
`verify-output.mjs` never inspects, and the canary is removed only by a
`finally`. `ci.yml` may run it last because `ci.yml` publishes nothing; a
workflow that uploads `dist/` may not.

Measured rather than assumed: `dist/` was inspected in the gap between the two
gates. The canary **was** absent and `verify-output.mjs` **did** pass against
that tree, so on the happy path the draft would have shipped a valid artifact.
The defect is therefore conditional, not certain — but it is real in two ways:
the uploaded tree would have been one no assertion had run against *at upload
time*, and one interrupted process between plant and `finally` would have
published a token-shaped string. Fixed by running `test:github` **first**, so
`verify` re-emits `dist/` from scratch and scans the exact bytes uploaded.

Also tightened: workflow-level permissions are `contents: read`, with
`pages: write` and `id-token: write` attached to the `deploy` job alone, so the
job that runs `npm ci` — and with it every dependency's lifecycle scripts —
never holds a token that can publish. `actions/configure-pages` was dropped:
`astro.config.mjs` already pins `site: 'https://ayushrijal.com.np'` with no
`base`, so it would contribute nothing while adding a failure mode.

No third-party deployment action. No new dependency. No token written to disk.

### 1N.2 Local validation before push — ALL PASSED

Node **v24.19.0**, npm **11.17.0**, run in the deploy workflow's own gate order.

| Command | Result |
|---|---|
| `npm ci` | 272 packages, **0 vulnerabilities** |
| `npm run test:github` | **18/18 assertions** |
| `npm run verify` | **17 pages**, 8 worlds, all output assertions |
| `npm run build` | 16 pages, standalone build clean |
| `npm audit --audit-level=high` | **0 vulnerabilities**, exit 0 |
| `git diff --check` | clean |

Artifact inspected directly (`dist/`), not inferred:

| Property | Observed |
|---|---|
| V2 routes | `/about`, `/projects`, `/ai-lab`, `/github`, `/learning`, `/contact`, `/cybersecurity`, 3 project records, 4 `/lab/*` |
| Top-level `.html` | `index.html`, `404.html`, `work.html` — **`work.html` is the only legacy stub**, as the collision rule requires |
| `CNAME` | `ayushrijal.com.np`, present in `public/` and `dist/` |
| `.nojekyll` | present in `public/` and `dist/` |
| `sitemap.xml` | 11 `<loc>`, **all extensionless V2 routes**, no `.html` world URL |
| `robots.txt` | V2's — `Allow: /`, `Disallow: /lab/`, sitemap line |
| `404.html` | `<title>Not in this archive</title>` + `<meta name="robots" content="noindex">` |
| `api.github.com` | **none** |
| Source maps | **none** — no `.map` file, no `sourceMappingURL` |
| Credential shapes | **none** |
| Third-party origins | **none** — no jsdelivr, no Google Fonts; fonts self-hosted in `dist/fonts` |
| AI Lab terminology | corrected — the only occurrence of "gaze" is the denial *"is not gaze; it is head pose"*; the table reads **"Face and head pose"** |
| AR-04 wording | corrected text present in `dist/cybersecurity` and `dist/index.html`; the old *"Defensive security research, lab write-ups…"* appears in **zero** built files; `/cybersecurity` still prints `0 entries` |

One external origin in `dist/` needs naming so it is not mistaken for a leak:
`http://localhost:11434` appears as **body text**, inside
`<span class="pipeline__detail">`, describing the Ollama port the Jarvis
assistant talks to on-device. It is prose about the project, not a resource the
page fetches. The other origins are `ayushrijal.com.np`, `github.com`,
`overthewire.org`, `linkedin.com` (outbound links) and the sitemap XML
namespace.

### 1N.3 The `v2` run — OBSERVED, and the cutover guard held

Commit **`63bb423`** *deploy: add GitHub Pages deployment workflow*, one file,
117 insertions. Pushed `e394fe2..63bb423`. Remote `v2` confirmed at
`63bb4237f423c66dc1ec85bc393c9bd3ccc11e8a` and confirmed to contain
`.github/workflows/deploy.yml`.

| | Deploy | CI |
|---|---|---|
| Run ID | **32706958024** | **32706957981** |
| Workflow | Deploy | CI |
| Event | `push` | `push` |
| Branch | `v2` | `v2` |
| Commit | `63bb423` | `63bb423` |
| Started | 2026-08-24T08:34:00Z | 2026-08-24T08:34:00Z |
| Ended | 2026-08-24T08:34:27Z | 2026-08-24T08:34:31Z |
| Duration | **27 s** | **31 s** |
| Conclusion | **success** | **success** |

`Deploy` job results:

| Job | Conclusion |
|---|---|
| `build` | **success** — every step: checkout, setup-node, Install, Refresh GitHub repository data, Test the GitHub fallback and secret isolation, Build and verify, Audit dependencies, upload-pages-artifact |
| `deploy` | **skipped** |

**`deploy` was skipped, and that is the result this phase existed to produce.**
The `main`-only guard was exercised on the real runner: pushing V2 to `v2`
built it, gated it, packaged it, and provably did **not** publish it.

Artifact produced: `github-pages`, **183,453 bytes**, created
2026-08-24T08:34:23Z, not expired.

CI remains green on `v2` and its `verify` job passed every step, so the new
workflow did not disturb the existing one.

**Production re-checked immediately after the push** — still
`Last-Modified: Sat, 08 Aug 2026 13:53:15 GMT`, still
`<title>Ayush Rijal — Cybersecurity Developer & AI Builder</title>`. V1,
untouched, exactly as intended.

**Not observed: `actions/deploy-pages` itself has never executed.** It cannot
be rehearsed — there is no way to test a deployment without deploying. Its
first execution will be the cutover, on `main`.

### 1N.4 Pages source — STILL NOT OBSERVABLE, and this is the blocker

`GET /repos/ayushrijal83-ops/ayushrijal.com.np/pages` → **HTTP 404**
unauthenticated. That endpoint requires a credential even on a public
repository, so the 404 distinguishes "not configured" from "configured but
unreadable" and **no claim is made either way**.

This is now the single thing standing between the repository and the cutover,
and it is owner-only. See §14 step 1.

### 1N.5 M13-B state

| Phase | State |
|---|---|
| 0 Baseline | **OBSERVED** |
| 1 Audit `deploy.yml` | **COMPLETE** — four defects found and fixed |
| 2 Local validation | **ALL PASSED** |
| 3 Commit | **DONE** — `63bb423`, deploy workflow only |
| 4 Push `v2` | **DONE** — `origin/v2` = `63bb423` |
| 5 Observe Actions | **OBSERVED** — Deploy `32706958024` success 27 s, CI `32706957981` success 31 s, `deploy` job skipped |
| 6 Pages source | **BLOCKED — OWNER ONLY.** Not observable here. |
| 7 Prepare merge | **NOT DONE** — gated on phase 6 |
| 8 Merge `v2` → `main` | **NOT DONE** |
| 9 `main` CI + deploy | **NOT DONE** |
| 10 Production smoke test | **NOT DONE** — production is still V1 |
| 11 Legacy route observation | **NOT DONE** — §14 step 4 still unanswerable |
| 12 `github-data.yml` | **NOT OBSERVED** — still dormant; needs `main` as default branch |
| 13 Post-cutover security | **NOT DONE** against a deployed artifact |
| 14 A11y / responsive regression | Build-time suite green locally; browser checks **NOT RUN** |
| 15 Email test | **NOT DONE — owner action** |
| 16 Do-not-touch list | **RESPECTED** — nothing on it was touched |
| 17 PROJECT_PROGRESS | this section |

`origin/main` remains **`41d4dc1`**. CYBERSECURITY remains ON HOLD, not built.
The OpenWeatherMap credential in `Agriculture_simulator` remains **outside this
repository, active, and unresolved** — the project is not security-clean while
it stands.

*(§1N.5 above is the state as of the M13-B stop. §1O supersedes it.)*

---

## 1O. M13-C — THE CUTOVER. Production serves V2.

**Observed over HTTP on 2026-08-24. This is no longer a plan or a rehearsal.**

`https://ayushrijal.com.np/` returns **19,214 bytes**, byte-for-byte the size of
`dist/index.html`, titled *"Ayush Rijal — Software · AI · Cybersecurity"*, with
`Last-Modified: Mon, 24 Aug 2026 13:16:17 GMT`. The 2026-08-08 V1 build that
this document tracked for thirteen milestones is no longer being served.

Two things remain open and are recorded as open: **Enforce HTTPS is off**, and
**`github-data.yml` still targets `v2`**. Neither blocks the archive; both need
an owner. §1O.8 and §1O.9.

### 1O.1 The merge — `927477a`

Pre-merge checks, all observed before anything was written: working tree clean;
`origin/main` at `41d4dc1`; `origin/v2` at `b9a3328` carrying `deploy.yml`;
local `main`'s one extra commit (`f42314e`) already contained in `v2`, so
nothing of it was at risk.

Staged with `--no-commit` and inspected before committing: **93 files, 27,111
insertions, zero deletions.** The only modified file is this one. No `.env`, no
credential, no unexpected file type. Every V1 file — `index.html`,
`about.html`, `work.html`, `journey.html`, `blog.html`, `contact.html`, `css/`,
`js/`, `CNAME`, `.nojekyll` — **unchanged and still present in the repository**.
They are inert now rather than deleted: Pages serves the uploaded `dist/`
artifact, not the repository root.

Merged **`--no-ff`** although a fast-forward was available. The reason is
rollback: force-push is forbidden, so production must be revertable by a normal
forward commit. `git revert -m 1 927477a` is now the rollback, and every
milestone commit is preserved — nothing squashed.

`origin/main`: `41d4dc1` → **`927477a`**.

### 1O.2 The `main` deployment — OBSERVED, and the deploy job RAN

| | |
|---|---|
| Workflow | **Deploy** |
| Run ID | **32731636983** |
| Event / branch | `push` / `main` |
| Commit | `927477a0a9c0626fc865aa91ed723c9ecec06af4` |
| Started | 2026-08-24T13:15:36Z |
| Ended | 2026-08-24T13:16:26Z |
| Duration | **50 s** |
| Conclusion | **success** |

| Job | Conclusion |
|---|---|
| `build` | **success** — checkout, setup-node, Install, Refresh GitHub repository data, Test the GitHub fallback and secret isolation, Build and verify, Audit dependencies, upload-pages-artifact |
| `deploy` | **success** — `actions/deploy-pages@v4` **executed** |

**The `deploy` job ran rather than being skipped.** On `v2` the same workflow
skipped it (§1N.3); on `main` the `refs/heads/main` guard opened. Both halves
of that guard are now observed behaving correctly on a real runner.

Deployment landed at **13:16:17Z**, nine seconds before the run closed —
`Last-Modified` on the live site matches.

**Honest note on "CI on `main`":** only **one** workflow ran. `ci.yml` triggers
on `push: [v2]` and pull requests, so a push to `main` does not start it, and
there is no separate CI run for `927477a` to point at. This is not a gap in
coverage — `deploy.yml`'s `build` job re-runs `verify`, `test:github` and
`npm audit --audit-level=high`, the same three gates, which is exactly why it
was written that way (§1N.1, defect 3). But the phrase "CI passed on main" would
be false and is not used.

### 1O.3 The eight worlds — OBSERVED LIVE

`build.format: 'directory'` emits `about/index.html`, so GitHub Pages issues a
**301 to the trailing-slash form**, then serves the world. Both hops recorded.

| Route | First hop | Final | Bytes | Title |
|---|---|---|---|---|
| `/` | **200** | — | 19,214 | Ayush Rijal — Software · AI · Cybersecurity |
| `/about` | 301 | `/about/` **200** | 13,999 | About — Ayush Rijal |
| `/projects` | 301 | `/projects/` **200** | 20,178 | Projects — Ayush Rijal |
| `/ai-lab` | 301 | `/ai-lab/` **200** | 59,644 | AI Lab — Ayush Rijal |
| `/github` | 301 | `/github/` **200** | 36,650 | GitHub — Ayush Rijal |
| `/learning` | 301 | `/learning/` **200** | 36,951 | Learning — Ayush Rijal |
| `/contact` | 301 | `/contact/` **200** | 17,440 | Contact — Ayush Rijal |
| `/cybersecurity` | 301 | `/cybersecurity/` **200** | 9,896 | Security Research Archive — Ayush Rijal |
| `/404` → `/404.html` | **200** | — | 8,986 | Not in this archive — Ayush Rijal |
| `/projects/yushacyber` | 301 | `…/` **200** | 18,128 | YushaCyber — Ayush Rijal |

Every size matches the local `dist/` file exactly. The 301 is a correct
permanent redirect that crawlers follow; the sitemap lists the extensionless
form, which resolves in one hop.

### 1O.4 Legacy routes — the M11 collision question, ANSWERED ON THE REAL HOST

| Route | Status | Serves | Verdict |
|---|---|---|---|
| `/work.html` | **200** | 1,640 B stub, `refresh 0; url=/projects` | **V2 stub — redirect works** |
| `/about.html` | **404** | V2 custom 404 | V2 404 |
| `/contact.html` | **404** | V2 custom 404 | V2 404 |
| `/journey.html` | **404** | V2 custom 404 | V2 404 — ARCHITECT DECISION |
| `/blog.html` | **404** | V2 custom 404 | V2 404 — ARCHITECT DECISION |
| `/assets/resume.pdf` | **404** | V2 custom 404 | V2 404 — not carried forward |
| `/ai` | **404** | V2 custom 404 | never published; nothing to preserve |
| `/index.html` | **200** | 19,214 B | V2 home |

Every 404 above serves **V2's own 8,986-byte "Not in this archive"** page, not
GitHub's default. The custom 404 is live.

**On enabling the two withdrawn stubs — the answer is still no, and now for a
measured reason.** With no `about.html` present, `/about` **301s to `/about/`**
and the world loads. Adding an `about.html` stub would put a file and a
directory in contention at the same URL, which is the exact configuration M11
measured resolving to the *file* — and since that stub redirects to `/about`,
that is an infinite loop on two worlds reached from the site's own navigation.
Production has now shown the safe half of that behaviour; it has **not** shown
the contested half, because the contested configuration is not deployed and
cannot be tested without deploying it. No proven Pages-safe mechanism exists,
so `LEGACY_ROUTES` is unchanged: `work.html` only, the one stub with no live
route to shadow. **§14 step 4 is CLOSED as "leave them 404", on evidence.**

### 1O.5 V1 machinery — GONE from production

Scanned the live home page, not `dist/`:

| V1 artefact | Live |
|---|---|
| three.js / import map | **ABSENT** (the one "three" hit is prose: *"three verified ways to write"*) |
| `cdn.jsdelivr.net` | **ABSENT** |
| `fonts.googleapis.com` / `fonts.gstatic.com` | **ABSENT** |
| `api.github.com` runtime call | **ABSENT** |
| `js/bg-3d.js`, `js/hero-3d.js` | **ABSENT** |

External origins on the live home page: **`ayushrijal.com.np`** and
**`github.com`** (an outbound link). That is all.

Assets served, all **200** with correct content types — this is the `.nojekyll`
test that §14 step 5 called out, and it passes:

`/_astro/BaseLayout.C8FStwLh.css` 24,177 B · `/_astro/index.Con1ITvG.css`
5,840 B · `/_astro/WorldLayout…js` 639 B · `/fonts/plex-mono-400.woff2`
14,708 B (self-hosted).

### 1O.6 Live sitemap, robots, domain

- **`sitemap.xml`** — V2's, 11 `<loc>`, all extensionless V2 routes. Zero
  `.html` world URLs. The V1 six-URL sitemap is gone.
- **`robots.txt`** — V2's: `Allow: /`, `Disallow: /lab/`, sitemap line.
- **`CNAME`** — 200, custom domain bound and serving.
- **`www.ayushrijal.com.np`** → **301** → `https://ayushrijal.com.np/`.

### 1O.7 Post-cutover security — CLEAN against the deployed artifact

Scanned live, over HTTP:

| Check | Result |
|---|---|
| Credentials in any served asset | **none** |
| `sourceMappingURL` | **none** |
| `.map` files fetchable | **404** |
| `api.github.com` | **none** |
| Third-party origins / CDN | **none** |
| Analytics / tracking | **none** |
| Client-side network calls | **none** |
| `/package.json`, `/astro.config.mjs`, `/.env`, `/.env.example`, `/src/lib/site.ts`, `/node_modules/…`, `/.github/workflows/deploy.yml` | all **404** — no source or config leakage |
| `npm audit --audit-level=high` on `main` | **0 vulnerabilities** |

### 1O.8 Enforce HTTPS is OFF — OWNER ACTION

`http://ayushrijal.com.np/` returns **200 in the clear**, serving the page over
plain HTTP with **no redirect to HTTPS**. Verified explicitly:
`scheme_used=http code=200 redirect=<empty>`.

HTTPS itself works and the certificate is valid — every other check in this
section ran over TLS. What is missing is the redirect.

> GitHub → **Settings** → **Pages** → tick **Enforce HTTPS**.

Whether the Pages source switch cleared this, or it was already off under V1,
**was not established** — the http→https redirect was never tested before
today, so no cause is claimed. GitHub also disables the checkbox for a while
after a Pages configuration change while it re-provisions the certificate; if
it is greyed out, wait and re-tick it.

### 1O.9 `github-data.yml` — REGISTERED, and now pointed at the wrong branch

**Registered.** The workflow list now shows `GitHub data` as **`state=active`**.
GitHub only honours `schedule` and `workflow_dispatch` from the default branch,
so this was impossible before the merge — the item open since M05 is closed on
the registration question.

**Not executed, and not faked.** Its cadence is `0 */6 * * *`; the merge landed
at ~13:16Z, so the next scheduled run is 18:00Z, after this milestone. It was
**not** manually dispatched — see the defect below for why that would have been
the wrong thing to do.

**The defect the cutover introduced.** As merged onto `main`, the workflow still
does `checkout` with **`ref: v2`** and pushes there. It will therefore refresh
the fallback snapshot on `v2`, a branch that no longer deploys, while `main`'s
committed snapshot — the one every production build falls back to — quietly
goes stale. That is precisely the failure the workflow's own header says it
exists to prevent: *"a fallback last written months ago is a fallback that
lies."*

Not fixed here, deliberately: it is not a deployment failure, production is
correct without it, and the brief for this milestone was not to change source
beyond what deployment required. **The fix is one line** — `ref: v2` → `ref: main`
at `.github/workflows/github-data.yml:37` — and it needs an owner decision, not
an assumption. Harmless in the meantime: a push to `v2` triggers `deploy.yml`'s
build job, whose deploy job skips, so it cannot publish anything.

### 1O.10 Verification suite and accessibility — run against LIVE production

`npm run verify` on the merged `main`: **pass** — 8 worlds, no-JS fallbacks
intact, About record verbatim, 3 project records with sources, no credentials,
AI Lab claims no training and no metrics, GitHub archive complete, 7 world
stocks clear WCAG AA, no inline scripts, no third-party origins, no Pretext,
deployable, 1 legacy redirect intact, 17 pages.

**The suite does not assert most of the accessibility list**, so those were
checked directly against the live site rather than claimed:

| Property | Method | Result |
|---|---|---|
| Exactly one `<h1>` per page | live HTML, 10 pages | **pass** |
| No duplicate `id` | live HTML, 10 pages | **pass** |
| No broken `aria-labelledby` | live HTML, 10 pages | **pass** |
| No positive `tabindex` | live HTML, 10 pages | **pass** |
| Skip link present, → `#main` | live HTML, 10 pages | **pass** |
| `#main` focusable (`tabindex="-1"`) | Chrome | **pass** |
| Skip link actually moves focus | Chrome | **pass** — `activeElement` becomes it |
| Focus ring visible | Chrome, 10 focusables | **pass** — `2px solid rgb(156,48,22)`, 0 without a ring |
| No broken internal links | live HEAD, 11 links | **pass** |
| `target="_blank"` without `rel="noopener"` | live HTML | **none** |
| Horizontal overflow @ 320/375/768/1280 | Chrome, 9 pages | **none** |
| Text-only 200% @ 320 px | Chrome, 9 pages | **none** |
| Console errors / CSP violations | Chrome, 10 pages | **zero** |
| No-JS output | raw HTML has full content pre-JS | **pass** |

**Reduced motion — PARTIAL, stated as such.** 12 `prefers-reduced-motion` media
blocks are present in the served CSS. The machine running this check reports
`prefers-reduced-motion: reduce` as **false**, so the reduced-motion *behaviour*
was **not** exercised — only the presence of the rules. Not claimed as verified.

**Browser coverage: Chrome only.** Safari and Firefox were **NOT** tested; no
such infrastructure was available and no claim is made about them.

### 1O.11 Still outstanding

| Item | State |
|---|---|
| **Enforce HTTPS** | **OFF — owner action**, §1O.8 |
| **`github-data.yml` targets `v2`** | **owner decision**, one line, §1O.9 |
| **Send one real email** | **NOT DONE — owner action.** `/contact/` is live and the `mailto:` is correct, but delivery cannot be proven from a static page or a link check, and was not claimed in M12 either. |
| **OpenWeatherMap credential** | **EXTERNAL, ACTIVE, UNRESOLVED.** In `Agriculture_simulator`, outside this repository, value never reproduced here. Open since M05. **The project is not security-clean while it stands**, regardless of this archive being clean. |
| **CYBERSECURITY** | **ON HOLD, not built.** `/cybersecurity/` is live and correctly declares itself empty — `0 entries`, plus the corrected AR-04 summary. Not started, not touched. |
| Safari / Firefox | **NOT TESTED** |
| Reduced-motion behaviour | **NOT EXERCISED** (rules present) |

Nothing on the M13 do-not-touch list was touched: no favicon, no `og:image`, no
redesign, no CMS, no analytics, no contact backend, no new dependency, no
withheld channel exposed, no `resume.pdf` republished, `/journey.html` and
`/blog.html` not resurrected, V1 not modified, `main` never force-pushed.

---

## 1P. M14 — Production hardening & closeout

**A hardening milestone, not a design one.** One functional line of source
changed. Nothing was redesigned, no page was added, CYBERSECURITY was not
started, no dependency was added, and no verification assertion was weakened.

Two of the three items M13 left open are now closed. One is not, and it is
recorded as not closed rather than assumed.

### 1P.1 Starting state — OBSERVED

Branch `main`, working tree clean. `origin/main` `5856572`, `origin/v2`
`b9a3328`. Workflows: `ci.yml` (`push: [v2]`, PRs), `deploy.yml`
(`push: [main, v2]`, deploy job guarded to `refs/heads/main`),
`github-data.yml` (`cron: 0 */6 * * *` + `workflow_dispatch`,
`contents: write`, **`ref: v2`**). `astro@7.2.4`, three devDependencies,
`site: 'https://ayushrijal.com.np'`, `output: 'static'`,
`build.format: 'directory'`, `trailingSlash: 'never'`.

### 1P.2 Enforce HTTPS — **VERIFIED** (was the M13 blocker)

Enabled by the owner between M13-C and M14. Confirmed by request, not by
reading a setting — the Pages API still returns HTTP 404 without a credential
and no claim is made from it.

| Check | Observed |
|---|---|
| `http://ayushrijal.com.np/` | **301 Moved Permanently** |
| `Location` | `https://ayushrijal.com.np/` |
| Final | **200**, scheme `https`, 1 redirect, 19,214 B, V2 title |
| `ssl_verify_result` | **0** (chain verified) |
| Certificate | `CN=ayushrijal.com.np`, Let's Encrypt, **notBefore** 2026-08-08, **notAfter** 2026-11-06 |
| `http://…/about/` | **301** → `https://…/about/` — enforcement is site-wide, not root-only |
| `http://www…` | **301** → `https://ayushrijal.com.np/` |
| `https://www…` | **301** → `https://ayushrijal.com.np/` |
| Mixed content | **none** — zero `http://` resources loaded on any of 9 worlds |

DNS unchanged. `CNAME` unchanged.

### 1P.3 `github-data.yml` retargeted to `main` — **VERIFIED (change), NOT OBSERVED (execution)**

The defect M13-C recorded: the workflow checked out `ref: v2` and pushed there,
so it would have refreshed the fallback snapshot on a branch that no longer
deploys while `main`'s copy — the one `deploy.yml` reads when a live fetch
fails — went stale. Exactly the failure its own header says it prevents.

Changed: **`ref: v2` → `ref: main`**, one functional line. Two comments
corrected alongside, because after the ref change they asserted the opposite of
what the workflow does — the header credited `ci.yml` with refreshing on every
push to `v2` (`ci.yml` does not run on `main` at all; `deploy.yml` does the
per-deploy refresh now), and the permissions note said the snapshot is committed
back to `v2`.

Parsed and asserted after editing, not eyeballed:

| Property | After |
|---|---|
| `checkout.ref` | **`main`** |
| `schedule` | `0 */6 * * *` — unchanged |
| `workflow_dispatch` | present — unchanged |
| `permissions` | `contents: write` — unchanged |
| `concurrency` | `group: github-data` — unchanged |
| Steps | six, same order, same names — unchanged |
| Data model / dependencies | untouched |
| Tabs in YAML | none |
| `git diff --check` | clean |
| Occurrences of `v2` remaining | **zero** |

`npm run verify` passes (17 pages, 8 worlds); `npm audit --audit-level=high`
reports 0 vulnerabilities.

### 1P.4 `github-data.yml` execution — **NOT OBSERVED**

`workflow_dispatch` exists, but **it could not be dispatched from here**:
`POST /actions/workflows/github-data.yml/dispatches` returns **HTTP 401
Requires authentication**. No `gh` CLI is installed, `GITHUB_TOKEN` and
`GH_TOKEN` are unset, and the only credential present is the git credential
helper, which is not an API token and was not touched.

**Total runs of this workflow, ever: 0.** It is `state=active` and correctly
targeted, and it has never executed. As of 2026-08-24T14:07Z the next scheduled
firing is **2026-08-24T18:00:00Z**.

Recorded as **NOT OBSERVED**. Nothing here claims it ran, that authentication
works, or that the refresh works end to end. The owner can dispatch it from the
Actions tab if they want it proven sooner; a scheduled run is otherwise the
first evidence.

### 1P.5 Deployment — **OBSERVED**

| | |
|---|---|
| Commit | **`7ce6e11`** *fix(ci): point the snapshot refresh at main* |
| Workflow / run | Deploy / **32735886304** |
| Event / branch | `push` / `main` |
| Started → ended | 2026-08-24T13:58:59Z → 14:00:38Z (**99 s**) |
| Conclusion | **success** |
| `build` job | **success** — all 12 steps, including `test:github`, `Build and verify`, `Audit dependencies` |
| `deploy` job | **success** — `actions/deploy-pages@v4` executed |
| Published | **14:00:30Z** |

Production timestamp advanced **13:28:04Z → 14:00:30Z**; ETag changed
`6a8c46e4-4b0e` → `6a8c4e7e-4b0e`. Newer than the previous deployment, verified
by header, not inferred from the workflow result.

### 1P.6 Production smoke test — **VERIFIED**, and byte-compared

All served over HTTPS. Exactly one `<h1>` on every page.

| Route | Code | Bytes | `<h1>` | Title |
|---|---|---|---|---|
| `/` | 200 | 19,214 | 1 | Ayush Rijal — Software · AI · Cybersecurity |
| `/about/` | 200 | 13,999 | 1 | About — Ayush Rijal |
| `/projects/` | 200 | 20,178 | 1 | Projects — Ayush Rijal |
| `/ai-lab/` | 200 | 59,644 | 1 | AI Lab — Ayush Rijal |
| `/learning/` | 200 | 36,951 | 1 | Learning — Ayush Rijal |
| `/github/` | 200 | 36,924 | 1 | GitHub — Ayush Rijal |
| `/contact/` | 200 | 17,440 | 1 | Contact — Ayush Rijal |
| `/cybersecurity/` | 200 | 9,896 | 1 | Security Research Archive — Ayush Rijal |
| `/404.html` | 200 | 8,986 | 1 | Not in this archive — Ayush Rijal |

**Byte-identical to `dist/`, actually compared with `cmp`, not inferred:**
`/`, `/about/`, `/contact/`, `/404.html`, `/work.html`, `/sitemap.xml`,
`/robots.txt` — **all IDENTICAL**.

`/github/` is 36,924 B here against 36,650 B in M13-C. That is expected and
correct: the world embeds repository figures refreshed at build time, so its
bytes move when the facts move. It was therefore **not** included in the
byte-comparison set.

### 1P.7 Legacy routes — **VERIFIED, unchanged from M13-C**

| Route | Code | Bytes | Serves |
|---|---|---|---|
| `/work.html` | **200** | 1,640 | V2 stub, `content="0; url=/projects"` |
| `/about.html` | **404** | 8,986 | V2 custom 404 |
| `/contact.html` | **404** | 8,986 | V2 custom 404 |
| `/journey.html` | **404** | 8,986 | V2 custom 404 |
| `/blog.html` | **404** | 8,986 | V2 custom 404 |
| `/assets/resume.pdf` | **404** | 8,986 | V2 custom 404 |
| `/ai` | **404** | 8,986 | V2 custom 404 |
| `/404` | **200** | 8,986 | V2 custom 404 |

`LEGACY_ROUTES` unchanged — `work.html` only. The M11 collision decision stands
as closed in §1O.4.

*Method note:* curl does not follow `<meta http-equiv="refresh">`, so
`/work.html` resolves to itself under `-L`. The redirect target is asserted from
the served markup and by `verify-output.mjs`, not from a followed hop.

### 1P.8 Security — **VERIFIED for this repository and artifact**

| Check | Result |
|---|---|
| `npm audit --audit-level=high` | **0 vulnerabilities** |
| Credentials in source (`src`, `scripts`, `public`, `.github`, configs) | **none** |
| Credentials in `dist/` | **none** |
| Source maps | **none** — no `.map`, no `sourceMappingURL` |
| `api.github.com` in `dist/` | **none** |
| `.env` references in `dist/` | **none** |
| Inline `<script>` in `dist/` HTML | **none** (CSP is `script-src 'self'`) |
| `git diff --check` | clean |

**Client-side network constructs in the six shipped JS files: zero.** Scanned
for `fetch(`, `XMLHttpRequest`, `new WebSocket`, `EventSource`, `sendBeacon`,
`navigator.send*` and dynamic `import(`. None present.

`localhost:11434` appears in `dist/ai-lab/index.html` and
`dist/learning/index.html` **inside `<span class="pipeline__detail">` and
`<code>` elements** — prose describing the Ollama endpoint that Jarvis and
NepalSathi talk to on-device. It is not called by any code and is **not** a
network call. Correctly not flagged.

### 1P.9 Production resource audit — **VERIFIED**

Across all nine live pages: **zero** third-party loaded resources, **zero**
iframes. No Google Fonts, no jsDelivr, no analytics, no tracking pixel, no
third-party stylesheet or script. The only absolute URLs in resource positions
are `ayushrijal.com.np`'s own (canonical / `og:url`).

Outbound **anchors**, which are links and not dependencies:
`github.com` ×37, `linkedin.com` ×1, `overthewire.org` ×1.

### 1P.10 Accessibility regression — **VERIFIED**, one correction to M13-C's method

Against live production, 10 pages: exactly one `<h1>` each · **no duplicate
`id`** · **no broken `aria-labelledby`** · **no positive `tabindex`** · skip
link present and → `#main` · `#main` carries `tabindex="-1"` · skip link
actually moves focus · **11 internal links resolve** · no `target="_blank"`
without `rel="noopener"`.

Table semantics intact on the data-heavy worlds:

| World | `<table>` | `<th>` | `scope=` | `<caption>` |
|---|---|---|---|---|
| `/projects/` | 1 | 10 | 9 | 1 |
| `/github/` | 1 | 18 | 17 | 1 |
| `/learning/` | 1 | 45 | 43 | 2 |
| `/ai-lab/` | 1 | 27 | 25 | 2 |

**A measurement correction, recorded because it nearly became a false defect.**
An initial pass reported "16 of 16 focusables without a visible focus ring",
which would have been a serious regression. It was an artifact of the test, not
the site: the archive styles focus with `:where(:focus-visible) { outline:
var(--focus-ring); … }`, and a scripted `element.focus()` does not match
`:focus-visible` in a pointer-primary session — `matches(':focus-visible')`
returned `false`. There is exactly **one** focus rule and it is the
`:focus-visible` one; there are **zero** plain `:focus` outline rules. The token
resolves to **`2px solid rgb(156, 48, 22)`** with a `3px` offset, identical to
what M13-C measured. **Focus styling is intact; the first reading was wrong.**

### 1P.11 Responsive — **VERIFIED**

Chrome, live production, 9 pages:

- **No horizontal overflow at 320, 375, 768 or 1280 px** — 36 page/width
  combinations, zero.
- **No horizontal overflow at text-only 200% at 320 px** — 9 pages, zero.
- **Zero console errors, zero unhandled rejections, zero CSP violations** across
  8 iframe loads plus direct navigations.
- **Zero mixed content.**

### 1P.12 Reduced motion — **PARTIAL, and not claimed as verified**

The guard is present and substantial: **21 `prefers-reduced-motion` media
blocks, 469 declarations**, neutralising `animation-*` (40 declarations each of
name, duration, delay, timing, iteration, direction, fill-mode, play-state,
timeline, range), `transition-*`, `scroll-behavior`, `translate`, `clip-path`,
and the motion tokens `--motion-scale`, `--dur-*`, `--enter-*`.

**The behaviour was NOT exercised.** The machine reports
`prefers-reduced-motion: reduce` as `false`, and the media query could not be
emulated with the tooling available. Structural presence is verified; rendered
behaviour under the query is **NOT TESTED**.

### 1P.13 Contact — **VERIFIED (mechanism), OWNER ACTION (delivery)**

`/contact/` **200**, *Contact — Ayush Rijal*. Target:
`mailto:ayushrijal83@gmail.com?subject=Correspondence` — correct address,
correct subject prefill. The address is also the link text, so the copy-paste
path is intact. **Zero `<form>` elements.** No third-party contact service, no
iframe, no relay. Withheld channels confirmed **absent**: `wa.me`, `tel:`,
WhatsApp, Facebook, Instagram.

**Real delivery remains an owner action.** No email was sent; no mail tool or
authorised account was available, and none was used. Delivery is **NOT TESTED**.

*One thing for the owner to confirm while testing:* the published address is
`ayushrijal83@gmail.com`, consistent with the GitHub handle `ayushrijal83-ops`.
The address associated with this working session is spelled differently
(`ayushruchal83@…`). That is very likely two different addresses rather than a
defect, and nothing was changed — but the email test is the moment to be sure
the published one is the mailbox actually read.

### 1P.14 OpenWeatherMap — **repository clean; rotation remains OWNER ACTION**

Searched this repository for the credential and for references to it. Every hit
is **documentation prose describing the vulnerability**, never a value:

- `src/content/projects/agrovision-nepal.md` — the project record stating the
  key is a string literal in `app.py` in a public repository.
- `scripts/verify-output.mjs` — a comment.

**No API-key-shaped literal exists anywhere in source.** No 32-hex literal
appears in the published project record or anywhere else in `dist/`. The
archive documents the finding without reproducing the secret.

**Repository clean; external credential rotation remains owner action.** The
credential lives in `Agriculture_simulator`, outside this repository, and is
still active. **The project is not security-clean while it stands** — this
milestone does not change that, and no history was rewritten.

### 1P.15 Browser coverage

**Chrome only.** Firefox **NOT TESTED**. Safari / WebKit **NOT TESTED** — no
such environment was available. No axe, Lighthouse, Playwright, Selenium or
screen-reader audit has ever been run on this project; none was installed for
this milestone. **No WCAG compliance is claimed.**

### 1P.16 Known limitations, carried forward honestly

| Item | State |
|---|---|
| `github-data.yml` executed against `main` | **NOT OBSERVED** — 0 runs ever; next scheduled 2026-08-24T18:00Z; cannot dispatch without credentials |
| Real email delivery | **NOT TESTED — OWNER ACTION** |
| OpenWeatherMap rotation | **OWNER ACTION — EXTERNAL, unresolved** |
| Safari / WebKit | **NOT TESTED** |
| Firefox | **NOT TESTED** |
| Reduced-motion behaviour | **PARTIAL** — 21 blocks / 469 declarations present, behaviour not exercised |
| axe / Lighthouse / screen reader | **NEVER PERFORMED** |
| WCAG compliance | **NOT CLAIMED** |
| CYBERSECURITY | **ON HOLD — deliberately unbuilt** |

### 1P.17 Git state

| | |
|---|---|
| Branch | `main`, working tree clean |
| M14 commit | **`7ce6e11`** — `fix(ci): point the snapshot refresh at main` |
| Files changed by M14 | `.github/workflows/github-data.yml` (+12 −7), then `docs/PROJECT_PROGRESS.md` |
| `origin/main` | `7ce6e11` → this record |
| `origin/v2` | `b9a3328` — retained, untouched |
| Rollback of the cutover | `git revert -m 1 927477a` |

No force-push, no reset, no history rewrite, no branch deleted.

### 1P.18 CYBERSECURITY

**ON HOLD. Not started. Not touched.** `/cybersecurity/` is live, returns 200,
and correctly declares itself empty — `0 entries` plus the corrected AR-04
summary. That is the designed state, not an omission.

Nothing on the M14 do-not-touch list was touched: no new page, no favicon, no
`og:image`, no world redesign, no contact-channel change, no DNS or `CNAME`
change, no new dependency, no unrelated CSS or code refactor, no speculative
improvement.

---

## 1Q. M15 — CYBERSECURITY

**Built. Not deployed, not merged, not pushed.** On branch `m15-cybersecurity`,
commit `492e100`. `main` is untouched and production still serves the
M14 artifact.

The world that was on hold since M08 is now a real page. **Nothing was
fabricated**, and the reason the page is the shape it is deserves stating
plainly: the audit found no unpublished security evidence, exactly as M08 said
it would.

### 1Q.1 Evidence inventory — the audit, re-run rather than inherited

§1H.8's finding was checked again from source rather than taken on trust, and
it holds. One thing M08 could not have seen was also checked: the `x-man`
repository, created 2026-08-21, after that audit. It is **NepalSathi**, a Flask
civic-information platform already filed in AI LAB and the experiments
collection. **Not security work.** Correctly excluded.

**A. VERIFIED PROJECT EVIDENCE**

| Item | Source |
|---|---|
| YushaCyber — Flask platform, 14 registered blueprints, 48 test files, ~3.4 MB Python. Runs locally and in Docker; **not deployed, no users** | `src/content/projects/yushacyber.md`, `verified: true` |
| Global CSRF via Flask-WTF, applied at registration rather than per form | same |
| Rendered markdown sanitised with `bleach` against a tag-and-attribute allow-list, because lesson and CTF content is markdown | same |
| CTF arena with a real schema — categories, challenges, per-user solves, staged hints | same |
| Lab content: SQL injection, XSS, CSRF, file-upload, Wireshark, nmap, network reconnaissance, forensics, SOC workflow | same |

**B. VERIFIED LEARNING ACTIVITY**

| Item | Source |
|---|---|
| OverTheWire Bandit levels 0→13 — **13 log entries, 19 commits, 6 distinct days, 2026-08-13 → 2026-08-20**, each level with its own written note | `src/lib/learning.ts` `FIELD_LOG`, counted programmatically |
| Side notes beyond the levels' needs: SSH, `/dev/null`, `sort`, `uniq`, `strings`, Base64 | same |
| Five networking lab modules — fundamentals, reconnaissance, troubleshooting, topology, HTTP deep dive | `learning.ts`, Cybersecurity strand |

**C. VERIFIED LAB / CTF ACTIVITY**

Bandit, a public wargame, worked in the open. **That is the whole of it.** The
CTF arena in YushaCyber is a thing *built*, not a competition *entered*.

**D. DOCUMENTATION ONLY**

The `labs` collection schema — `discipline`, `environment`, `authorisation`,
`cve`, `severity` — written in M02 so this world could prove its claims. It has
nothing to populate it. `cyber-security`'s repository description ("I will
going to upload daily basis for 6 months") is a stated intention and is not
published as a commitment.

**E. UNSUPPORTED — NOT PUBLISHED**

No certification. No completed course. No CTF placement, ranking or team
result. No engagement, client or authorised test of a third party. No CVE, no
disclosure, no advisory, no report. No vulnerability found in anyone else's
software. No professional security employment. No years-of-experience figure.
No proficiency level or self-rating. No real-network scan. No packet capture of
my own. **Every one of these was checked, and every one is absent.**

### 1Q.2 The architectural decision, and why it differs from M08's

M08 concluded the world had "no content of its own" because everything
verifiable was already filed in LEARNING and PROJECTS. **That was right about
the findings and wrong about the world.**

A security archive holding no findings still has one thing to publish that no
other world can: **the boundary itself** — what is evidenced, what is
simulated, and what is explicitly not claimed. That is original content, it is
checkable, and on a security page it is the most load-bearing thing there is.

So the page **indexes** the evidence and **states** the boundary. It does not
restate the Bandit log or the project record; it links to them. The alternative
M08 correctly feared — restating three worlds or fabricating — is avoided by
publishing neither the work nor an invention, but the perimeter around them.

### 1Q.3 Published content — six sections, one `h1`

| § | Section | What it holds |
|---|---|---|
| 01 | Standing | One thesis sentence, every noun in it appearing in the register below |
| 02 | What the evidence supports | **5 claims**, each with basis, the artifact, and a link to where it is checkable |
| 03 | Simulated, not real | **4 boundaries**, each an affirmative paired with its denial |
| 04 | Not claimed | **7 denials**, the negative register |
| 05 | The filing standard | **5 schema constraints** that explain the empty register structurally |
| 06 | Filed findings | The existing `ArchiveIndex`, **0 entries**, empty note unchanged |

Meta description rewritten truthfully: it says what the page contains and ends
with "No findings are filed." The world summary in `worlds.ts` was **not**
touched — it was corrected in M11 and is still accurate.

### 1Q.4 Deliberately NOT published

Every item in inventory class E. In particular: no role noun anywhere on the
page describes Ayush ("researcher", "engineer", "pentester", "ethical hacker",
"red team" appear only inside denials); the nmap flags are stated as exercised
**against a simulator**, never as a scan; the CTF arena is stated as built,
never as entered; and no `labs` entry was authored to fill the register.

### 1Q.5 Architecture — **VERIFIED**, zero new dependencies

Reused without modification: the world registry, `WorldLayout`, `TitleBlock`,
`ArchiveIndex`, the shared gate, `tablewrap` scroll-port, typography and
spacing tokens, the `data-label` narrow-screen table recomposition, and the
`prefers-reduced-motion` guard convention.

New files are three, and the layout grammar is deliberately LEARNING's one
world over — a reader arriving from the field notebook should not have to learn
a second way to read a register. The worlds are separated by their ground
(`dossier`) and accent, not by a second set of layout ideas.

**No new framework. No new dependency.** `package.json` gained exactly one
line, an npm script; `package-lock.json` is untouched.

### 1Q.6 Content audit extended — §8c and §8d

The hard part, and the reason it is worth reading: **the page legitimately
contains every dangerous noun** — "certification", "penetration", "CVE",
"vulnerability" — because its negative register names each one in order to deny
it. A pattern matching the noun would fail on the honest sentence and would
have to be silenced with a page-level exclusion, which is how an audit becomes
inert.

So **§8c matches the grammar of a claim, not the noun**: a first-person
identity, a possessive, a completed action, an awarded credential, a placement,
a quantified year count. *"No CVE, disclosure, advisory or report."* does not
parse as any of those. *"I hold the OSCP"* does. **Ten patterns, applied to
every page, with no exclusions anywhere.** Plus a CVE-identifier guard: a real
`CVE-YYYY-NNNN` in prose fails while no lab entry is filed.

**§8d is the inverse**: six required denials must be **present** on the built
page. Delete one and every affirmative sentence left behind stays literally
true while the page as a whole stops being — the precise failure §1H.8 warned
about. The build fails if a denial goes missing.

### 1Q.7 Audit negative-tested — **VERIFIED, 35/35**

`scripts/test-security-audit.mjs`, run as `npm run test:security`, and wired
into both `ci.yml` and `deploy.yml`.

| Property | Result |
|---|---|
| Control: the honest page passes the gate | **pass** |
| **14 planted fabrications must fail** | **all 14 fail correctly** — role claims first and third person, certifications held and possessed, engagements performed, security audits delivered, third-party work, findings in others' software, zero-days, placements, quantified experience, self-rated levels, a CVE identifier |
| **14 legitimate sentences must pass** | **all 14 pass** — all seven denials verbatim, lab subjects named, the simulated scanner, a defensive decision, learning stated plainly, an ordinary ordinal, "vulnerability" and "penetration" as topics |
| **3 denials removed must fail** | **all 3 fail correctly** |
| The failure explains itself and cites §1H.8 | **pass** |
| The page is byte-intact after testing | **pass** |

**The test found a real defect in the audit and it was fixed.** The
third-party-finding pattern accepted only digit quantifiers, so *"Discovered two
vulnerabilities in Apache"* walked straight through it. Spelled-out numbers were
added — enumerated rather than a generic `\w+` gap, because a generic gap also
matches *"found nothing wrong with vulnerabilities in …"*. This is recorded
because it is the whole argument for negative-testing an audit: it passed 34/35
and was still broken.

**Ordering defect also caught and fixed.** `test:security` plants sentences into
the built page and restores them in a `finally`. Placed after `Build and verify`
in `deploy.yml` — as it first was — the uploaded artifact would be one a test
last wrote to rather than one `verify` scanned, the same defect §1N.1 recorded
for `test:github`. It now runs **before** `verify` in the deploy path, so
`verify` re-emits `dist/` and scans the exact bytes that ship. In `ci.yml`,
which publishes nothing, order does not matter.

### 1Q.8 Tests — **VERIFIED**

| Command | Result |
|---|---|
| `npm ci` | 272 packages, **0 vulnerabilities** |
| `astro check` | **0 errors, 0 warnings, 0 hints** (50 files) |
| `npm run test:github` | **18/18** |
| `npm run test:security` | **35/35** |
| `npm run verify` | **pass** — 8 worlds, 17 pages |
| `npm audit --audit-level=high` | **0 vulnerabilities** |
| `git diff --check` | clean |

### 1Q.9 Responsive — **VERIFIED**, Chrome against a local preview

Zero horizontal overflow at **320, 375, 768, 1280 and 1920 px**. Zero at
**text-only 200%** at 320, 375 and 1280 px. Measured as
`scrollWidth − clientWidth` on the document element, with the offending
elements collected on failure; there were none.

### 1Q.10 Accessibility — **VERIFIED** (structural), and what that does not mean

| Check | Result |
|---|---|
| `<h1>` | **exactly 1**; 7 `<h2>` |
| Duplicate `id` | **none** (13 ids) |
| Broken `aria-labelledby` | **none** |
| Positive `tabindex` | **0** of 16 focusables |
| Skip link | present, `href="#main"`, **moves focus** |
| `#main` | `tabindex="-1"`, **accepts focus** |
| Focus ring | resolves to **`2px solid rgb(156,48,22)`**, 3 px offset |
| Table | 1 table, 1 `<caption>`, **9 `scope`** attributes, `<th scope="row">` per row |
| Scroll port | `role="region"` + `tabindex="0"` + `aria-label="Register of evidenced security claims"` |
| Console errors / CSP violations | **zero** |
| Internal links | all resolve, including `/learning#log` and `/learning#register` |
| Reduced motion | **12 media blocks, 371 declarations**; this world's own `dossier-bar` animation **is** inside a `no-preference` guard; **0 unguarded infinite animations** |

**Reduced-motion behaviour was NOT exercised** — the machine does not report
`prefers-reduced-motion: reduce`. The guard's presence is verified; the
rendered result under the query is **NOT TESTED**.

**No WCAG compliance is claimed.** No axe, Lighthouse or screen-reader audit
was run; none was installed. A defect found and fixed during review: the
register's `<th>` cells were centring, because the UA stylesheet's
`th { text-align: center }` beats an inherited value — an explicit
`text-align: start` now sits on the cells.

### 1Q.11 Security scan of the build — **VERIFIED**

Credentials **none** · local machine paths **none** · source maps **none** ·
`api.github.com` **none** · `.env` references **none** · network-capable
constructs in shipped JS **none** (`fetch(`, `XMLHttpRequest`, `WebSocket`,
`EventSource`, `sendBeacon`, dynamic `import(`) · inline scripts **none** — the
page's single `<script>` is the shared external world-gate module · external
resource origins **none** (only `ayushrijal.com.np` itself) · `localhost`
occurrences on the new page **0**.

No existing assertion was weakened. §8's "no overstated holdings" patterns and
the "still declaring itself empty" check both still pass unchanged.

### 1Q.12 Browser coverage

**Chrome only**, against `astro preview` on localhost. Firefox **NOT TESTED**.
Safari / WebKit **NOT TESTED**.

### 1Q.13 Known limitations

| Item | State |
|---|---|
| Reduced-motion behaviour | **NOT TESTED** — guard present, query not emulable here |
| Firefox / Safari | **NOT TESTED** |
| axe / Lighthouse / screen reader | **NEVER PERFORMED** |
| WCAG compliance | **NOT CLAIMED** |
| Production behaviour of this page | **NOT TESTED** — not deployed, by instruction |
| `labs` register | **0 entries**, and correctly so |

### 1Q.14 Files changed

| File | Change |
|---|---|
| `src/pages/cybersecurity.astro` | rewritten, +217 |
| `src/lib/security.ts` | **new** — the typed evidence registry |
| `src/styles/cybersecurity.css` | **new** — the dossier sheet |
| `scripts/test-security-audit.mjs` | **new** — the negative test |
| `scripts/verify-output.mjs` | +139, §8c and §8d |
| `.github/workflows/ci.yml` | +8, one step |
| `.github/workflows/deploy.yml` | +12, one step, placed before `verify` |
| `package.json` | +1 line, `test:security`. **No dependency change**; `package-lock.json` untouched |

Nothing else. No CNAME, no DNS, no HTTPS setting, no deployment workflow logic,
no legacy routing, no other world, no contact channel, no favicon, no
`og:image`. `Agriculture_simulator` not touched.

### 1Q.15 Deployment status — **NOT DEPLOYED, BY INSTRUCTION**

Not merged, not pushed, not deployed. Branch `m15-cybersecurity`, local only.
`origin/main` remains **`ee95c44`**; production still serves the M14 artifact
from 2026-08-24T14:11:08Z. **The page has never been served over HTTP** and
nothing here claims it has.

### 1Q.16 Remaining owner actions — unchanged by M15

| Item | State |
|---|---|
| Architect review of this branch | **BLOCKED** — awaiting review before merge |
| `github-data.yml` execution against `main` | **NOT OBSERVED** — 0 runs at the time of writing |
| Real email delivery | **OWNER ACTION — NOT TESTED** |
| OpenWeatherMap rotation in `Agriculture_simulator` | **OWNER ACTION — EXTERNAL, unresolved.** Not touched. **The project is not security-clean while it stands** |

### 1Q.17 CYBERSECURITY status

**Built, and still holds zero findings.** That is the correct state, not an
incomplete one. The register fills when work exists that can satisfy the `labs`
schema — a discipline, an environment, and an authorisation — and not before.

---

## 1R. M16 — Production integration, deployment & Cybersecurity verification

**The Cybersecurity world is live and verified over HTTPS.** `/cybersecurity/`
returns **200, 20,059 bytes, byte-identical to the local artifact**, and both
new audit sections were re-run against the deployed HTML rather than inferred
from the build.

M15 was reviewed, not merely trusted: every gate was re-run, the audit
semantics were proved rather than read, and one of M16's own preconditions
could not be met and is recorded as unmet.

### 1R.1 Starting state — OBSERVED

Branch `m15-cybersecurity` at `2aac8e7`, tree clean. `origin/main` at `ee95c44`
(M14). `m15-cybersecurity` absent from the remote. Matched the M15 report
exactly; no correction to §1Q was required.

*(The M16 brief's instruction not to modify "the dragon/interaction work" has no
referent — `grep -ri dragon` over `src`, `scripts`, `docs` and `.github`
returns nothing. Recorded as not applicable rather than silently ignored.)*

### 1R.2 M15 review — VERIFIED

**Scope.** 9 files, **+1378 / −7**, **zero deletions**, no dependency change,
`package-lock.json` untouched, `git diff --check` clean. `package.json` gained
one line, an npm script. Nothing unrelated.

**Content boundary — VERIFIED against the built page.** Every dangerous role or
credential noun checked individually in context:

| Term | On the page |
|---|---|
| penetration tester · ethical hacker · security researcher · security engineer · red team · certified · OSCP · CEH · years of experience · expert · proficient | **absent** |
| certification | **1×**, inside *"No certification, and no completed course"* |
| CVE | **1×**, inside *"No CVE, disclosure, advisory or report"* |
| client | **1×**, *"It is a client, not a model"* — a software client describing the AI mentor |

All **nine** denials present.

**Audit semantics — PROVED, not read.** The ten §8c patterns were extracted and
executed directly:

| Test | Result |
|---|---|
| 21 bare nouns (`certification`, `OSCP`, `CVE`, `vulnerability`, `penetration testing`, `expert`, …) | **0 fire** → grammar-based, not noun bans |
| The 7 denial sentences | **0 fire** → honest prose survives |
| 10 fabricated claim shapes | **all 10 caught** |
| Page-level exclusions anywhere in the audit | **none** |
| CVE identifier guard | **intact** (`verify-output.mjs:1013`) |

An earlier heuristic of mine flagged two patterns as possible noun bans; that
was a defect in the *checking script*, which missed `\s+is\s+` and `\bmy\s+`.
The direct execution above is the evidence; the heuristic result was discarded.

### 1R.3 Local gate — VERIFIED, re-run not assumed

Node **v24.19.0**, npm **11.17.0**.

| Command | Result |
|---|---|
| `npm ci` | 272 packages, **0 vulnerabilities** |
| `astro check` | **0 errors / 0 warnings / 0 hints** |
| `npm run test:github` | **18/18** |
| `npm run test:security` | **35/35** |
| `npm run verify` | **pass**, 17 pages, 8 worlds |
| `npm audit --audit-level=high` | **0 vulnerabilities** |
| `git diff --check` | clean |

All match §1Q's figures exactly.

### 1R.4 Static security review — VERIFIED

Credentials **none** · source maps **none** · `api.github.com` **none** ·
`.env` references **none** · machine paths **none** · inline `<script>` across
`dist` **0** · network-capable constructs in shipped JS **none** ·
third-party resource origins **none** (only `ayushrijal.com.np`) ·
`package-lock.json` **unchanged**.

`localhost:11434` appears only inside `<span class="pipeline__detail">` and
`<code>` on AI LAB and LEARNING — explanatory prose. **0 occurrences** on the
Cybersecurity page.

### 1R.5 Branch workflow — **NOT OBSERVED**, and why

**The branch push exercised no workflow at all. Zero runs exist for
`2aac8e7`.** `ci.yml` triggers on `push: [v2]` and pull requests; `deploy.yml`
on `push: [main, v2]`. Neither matches `m15-cybersecurity`.

**What this does confirm:** a branch push provably cannot publish — more
strongly than the deploy job's `refs/heads/main` guard, because the workflow
never starts.

**What it does not confirm, and is not claimed:** that the gates pass on a
runner for this work. Triggering them needed a pull request, which needs API
credentials this environment does not have (`POST …/dispatches` → **401**, no
`gh`, no token). **No artificial trigger was added** to manufacture a run.

The protection that did apply is real and was then observed: `deploy.yml`'s
build job runs all four gates on `main` **before** the deploy job publishes, so
a gate failure would have left production on M14. §1R.7 records that they ran
and passed.

### 1R.6 Merge — `4caff65`

`git checkout main` → `git pull --ff-only` (already up to date) →
`git merge --no-ff m15-cybersecurity`, staged with `--no-commit` and inspected
first: **zero deletions, zero conflicts**, and `index.html`, `about.html`,
`work.html`, `CNAME`, `.nojekyll`, `src/pages/index.astro`,
`src/pages/learning.astro`, `src/lib/worlds.ts`, `src/lib/legacy.ts` and
`deploy.yml` all still present.

`--no-ff` again, so the world is one revertable commit:
**`git revert -m 1 4caff65`** returns production to M14 without touching
history. No reset, no rebase, no force-push.

`origin/main`: `ee95c44` → **`4caff65`**.

### 1R.7 Main deployment — OBSERVED

| | |
|---|---|
| Workflow / run ID | Deploy / **32741152755** |
| Event / branch | `push` / `main` |
| Commit | `4caff651b434b6551cd81790cb4895784c076a81` |
| Started → ended | 2026-08-24T14:50:10Z → 14:51:10Z (**60 s**) |
| Conclusion | **success** |

| Job | Result |
|---|---|
| `build` (14:50:12 → 14:50:41Z) | **success** — Install · Refresh GitHub repository data · **Test the GitHub fallback and secret isolation** · **Test the security content audit** · **Build and verify** · **Audit dependencies** · upload-pages-artifact, every step success |
| `deploy` (14:50:45 → 14:51:09Z) | **success** — `actions/deploy-pages@v4` executed |

**`Test the security content audit` ran on a real runner for the first time and
passed.** That closes the one thing M15 structurally could not verify.

Production republished **14:51:04Z**; root `Last-Modified` advanced
`14:11:08Z → 14:51:04Z`, ETag `6a8c50fc-4b0e` → `6a8c5a58-4b0e`.

### 1R.8 Production HTTPS verification — VERIFIED

| Route | Code | Bytes | `<h1>` | Title |
|---|---|---|---|---|
| `/` | 200 | 19,214 | 1 | Ayush Rijal — Software · AI · Cybersecurity |
| `/about/` | 200 | 13,999 | 1 | About — Ayush Rijal |
| `/projects/` | 200 | 20,178 | 1 | Projects — Ayush Rijal |
| `/ai-lab/` | 200 | 59,644 | 1 | AI Lab — Ayush Rijal |
| `/learning/` | 200 | 36,951 | 1 | Learning — Ayush Rijal |
| `/github/` | 200 | 36,924 | 1 | GitHub — Ayush Rijal |
| `/contact/` | 200 | 17,440 | 1 | Contact — Ayush Rijal |
| **`/cybersecurity/`** | **200** | **20,059** | **1** | **Security — Ayush Rijal** |
| `/404.html` | 200 | 8,986 | 1 | Not in this archive — Ayush Rijal |

Extensionless routes **301** to the trailing-slash form, unchanged from M13-C.

### 1R.9 Byte comparison — and the one honest difference

Compared with `cmp` against the local artifact, not by size:

**IDENTICAL** — `/cybersecurity/`, `/`, `/about/`, `/404.html`, `/work.html`,
`/sitemap.xml`, `/robots.txt`.

**`/github/` DIFFERS** — production 36,924 B, local 35,421 B. **This is
build-time data, and it was checked rather than assumed.** Diffing the rendered
text:

- production says **"11 repositories"**, dated **24 Aug 2026**, and lists
  **QuickJunction** ("complete hotel management software", pushed 2026-08-23);
- local says **"10 repositories"**, dated 22 Aug 2026.

The runner's `Refresh GitHub repository data` step fetched fresher data than
the local `github.generated.json` (dated 22 Aug). **The integration working as
designed, not a mismatch.** `/cybersecurity/` carries **zero** build-time data
markers, which is why it matches byte-for-byte.

### 1R.10 The audit, verified against the DEPLOYED artifact — VERIFIED

Both sections were executed against the production HTML, not the build:

- **§8d** — all **nine** required denials **PRESENT** in the live page.
- **§8c** — the ten fabrication patterns run against production prose:
  **0 fire**. No CVE identifier in production prose.

### 1R.11 Production security — VERIFIED

Every live asset of `/cybersecurity/` fetched and scanned:
`BaseLayout.C8FStwLh.css`, `cybersecurity.CBNCQIOq.css`,
`WorldLayout…CstVKYIA.js` — **all clean** (no `sourceMappingURL`,
`api.github.com`, credential shape, `fetch(`, `XMLHttpRequest`, `WebSocket`,
`EventSource` or `sendBeacon`).

Source and config exposure, all **404**: `/package.json`,
`/src/lib/security.ts`, `/scripts/test-security-audit.mjs`, `/.env`,
`/astro.config.mjs`, and the `.css.map`.

Live page: **0** inline scripts, **0** `localhost` occurrences, external
resource origins **none**.

### 1R.12 Legacy routes — VERIFIED, no regression

| Route | Code | Bytes | Serves |
|---|---|---|---|
| `/work.html` | **200** | 1,640 | V2 stub, `content="0; url=/projects"` |
| `/about.html` · `/contact.html` · `/journey.html` · `/blog.html` · `/assets/resume.pdf` · `/ai` | **404** | 8,986 | V2 custom 404 |

`src/lib/legacy.ts` **unchanged since M14**. `LEGACY_ROUTES` still contains only
`work.html`. Checked programmatically: **no stub collides with a live world
route.**

### 1R.13 Production accessibility — VERIFIED (structural)

10 live pages: exactly one `<h1>` each · no duplicate `id` · no broken
`aria-labelledby` · no positive `tabindex` · skip link → `#main` · `#main`
`tabindex="-1"` · tables captioned with per-row `scope` (**9** on the new page)
· scroll port `tabindex="0"` + `aria-label="Register of evidenced security
claims"` · **11 internal links resolve** · focus ring resolves to
**`2px solid rgb(156,48,22)`** · navigation intact with `aria-current` on
Security · **zero console errors, rejections or CSP violations**.

### 1R.14 Production responsive — VERIFIED

Zero horizontal overflow at **320, 375, 768, 1280 and 1920 px** across 9 live
pages, and zero at **text-only 200% at 320 px**.

### 1R.15 Reduced motion — PARTIAL

12 `prefers-reduced-motion` blocks on the live page; the Cybersecurity
`dossier-bar` animation **is** inside a `no-preference` guard; **0 unguarded
infinite animations**. The browser reported
`prefers-reduced-motion: reduce` as **false** and the query could not be
emulated, so the **behaviour was NOT TESTED**. Guard presence verified only.

### 1R.16 Browser coverage

| | |
|---|---|
| Chrome | **TESTED** (local preview and production) |
| Firefox | **NOT TESTED** |
| Safari / WebKit | **NOT TESTED** |
| axe | **NOT RUN** |
| Lighthouse | **NOT RUN** |
| Screen reader | **NOT RUN** |

**No WCAG compliance is claimed.**

### 1R.17 Owner actions — configuration verified, none performed

| Item | State |
|---|---|
| `github-data.yml` | Config **VERIFIED**: `ref: main`, `cron: 0 */6 * * *`, `workflow_dispatch` present, `contents: write`. **Execution NOT OBSERVED — 0 runs ever** as of 2026-08-24T14:56Z. No artificial trigger added. **OWNER ACTION** to dispatch, or await the schedule |
| Real email delivery | **OWNER ACTION — NOT TESTED.** No email sent |
| OpenWeatherMap | **OWNER ACTION — EXTERNAL, unresolved.** `Agriculture_simulator` **not touched** (0 files in this milestone's diff). Only a documentation mention survives in the project record; no key-shaped literal anywhere in `dist` |

**The project is not security-clean while the OpenWeatherMap credential
stands.**

### 1R.18 Current architecture and known risks

Production is V2 on `main`, deployed by `deploy.yml` through GitHub Actions,
HTTPS enforced, eight worlds plus three project records and four `/lab/*`
harnesses. Gates before any publish: `test:github` (18), `test:security` (35),
`verify`, `npm audit`.

| Risk | State |
|---|---|
| Branch pushes run no CI at all | **OPEN** — `ci.yml` triggers only on `v2` and PRs. Work on a feature branch is unverified by a runner until it reaches `main`. The deploy gates make this fail-safe for production, but it is a gap |
| `github-data.yml` never executed | **OPEN — NOT OBSERVED** |
| Reduced-motion behaviour | **NOT TESTED** |
| Firefox / Safari | **NOT TESTED** |
| OpenWeatherMap credential | **OPEN — EXTERNAL** |

### 1R.19 Next milestone

**M17 — CI coverage for feature branches.** The one defect this milestone
surfaced: `m15-cybersecurity` was merged without a single runner having
executed its gates, because no workflow triggers on an arbitrary branch. The
fix is a trigger change, not new machinery — and it should be made deliberately
rather than folded into a content milestone.

---

## 1S. M17 — Feature-branch CI hardening

**Status: COMPLETE — feature-branch CI OBSERVED on a real runner, deploy
exclusion proven from source and by the absence of any Deploy run on the
branch.**

### 1S.1 The problem M16 surfaced

§1R.18 recorded it as the one open architectural gap: `ci.yml` triggered on
`push: [v2]` and on pull requests, nothing else. An arbitrary development
branch therefore received no runner validation at all. `m15-cybersecurity` was
merged in M16 having never had a single gate executed by a runner — the gates
in `deploy.yml` caught it on the way to production, so this was fail-safe for
the live site, but it meant every branch stayed unverified until the moment it
became production.

### 1S.2 The change — one file, one trigger, one reordering

`.github/workflows/ci.yml`, commit **`dcd44e2`**. Nothing else was touched: no
page, no component, no stylesheet, no client script, no `package.json`, no
`package-lock.json`, no dependency, no action version.

```
-  push:
-    branches: [v2]
+  push:
+    branches-ignore: [main]
```

`branches-ignore` rather than an enumerated list, so a branch is covered the
day it is created — no workflow edit, no branch-naming convention to remember.
`main` is excluded *deliberately*: `deploy.yml` already runs this identical set
of gates on every push to `main` before publishing, so triggering CI there too
would buy a second identical run and nothing else. This was **confirmed
empirically** — the M17 merge to `main` produced a Deploy run and **no** CI run.

The gate order was also brought into line with `deploy.yml`:

```
test:github  ->  test:security  ->  verify  ->  npm audit
```

Previously CI ran `verify` first. CI publishes nothing, so it could get away
with that — but `test:github` plants a `ghp_…` canary into `dist/` and ends on
a bare `astro build` that no assertion inspects, and `test:security` plants
fabricated sentences into the built page. With `verify` last, the tree CI
asserts against is one `verify` re-emitted itself. The point is that "CI passed
on my branch" and "the deploy build passed" now mean the same thing, which is
the entire purpose of feature-branch CI.

### 1S.3 Permission model — unchanged, and that is the finding

CI was already minimal and stays minimal. The M17 diff changes **no**
permission line.

| Workflow | Permissions | Can reach `deploy-pages`? |
|---|---|---|
| `ci.yml` | `contents: read` (workflow level, no job override) | **No** |
| `deploy.yml` — `build` | `contents: read` | No — uploads the artifact only |
| `deploy.yml` — `deploy` | `contents: read`, `pages: write`, `id-token: write` | **Yes — and it is gated to `main`** |
| `github-data.yml` | `contents: write` | No — no Pages step at all |

CI has no `pages: write`, no `id-token: write`, no `contents: write`, no
`environment:`, and no third-party action beyond `actions/checkout@v4` and
`actions/setup-node@v4`, both already present before M17.

### 1S.4 Deploy exclusion — proven, four independent barriers

There is exactly **one** `actions/deploy-pages` invocation in the repository:
`deploy.yml`, job `deploy`. A grep across `.github/workflows/` confirms it.

| # | Barrier | What it covers |
|---|---|---|
| 1 | `deploy.yml` `on.push.branches: [main, v2]` — exact literals, no globs | `feature/test`, `m17-ci-hardening`, `bugfix/example` match neither, so the workflow never starts |
| 2 | `deploy` job `if: github.ref == 'refs/heads/main'` | The `workflow_dispatch` path, which barrier 1 does **not** cover — a dispatch can target any branch, and the job then skips |
| 3 | `pages: write` + `id-token: write` exist only on that one job | Even a step added to `ci.yml` would hold a token that cannot call the Pages API |
| 4 | `ci.yml` contains no `upload-pages-artifact`, no `deploy-pages`, no `environment:` | CI produces no Pages artifact for a deployment to consume |

Barrier 2 is worth stating separately: trigger filters alone would be an
incomplete proof, because `workflow_dispatch` bypasses them.

The M17 change widens a workflow that has **no** Pages capability to widen.

**Empirical confirmation:** `GET /actions/runs?branch=m17-ci-hardening`
returned `total_count: 1` — the CI run, and nothing else. Zero Deploy runs,
zero Pages deployments.

### 1S.5 Local validation — baseline held exactly

| Gate | M16 baseline | M17 | Status |
|---|---|---|---|
| `astro check` | 0 / 0 / 0 | 0 errors, 0 warnings, 0 hints (51 files) | **VERIFIED** |
| `npm run test:github` | 18 | 18 assertions | **VERIFIED** |
| `npm run test:security` | 35 | 35 assertions | **VERIFIED** |
| `npm run verify` | 17 pages | 17 pages, 8 worlds | **VERIFIED** |
| `npm audit --audit-level=high` | 0 | 0 vulnerabilities | **VERIFIED** |
| `git diff --check` | clean | clean | **VERIFIED** |

Nothing was weakened, skipped or relaxed to make this pass. `test:github` and
`test:security` were run in the new order locally before the workflow was
committed, confirming that `test:github` builds its own `dist/` from nothing
and `test:security` reads what it leaves behind.

### 1S.6 Feature-branch CI — OBSERVED

| | |
|---|---|
| **Run ID** | **32812105029** |
| Workflow | CI (`.github/workflows/ci.yml`) |
| Branch | `m17-ci-hardening` |
| Commit | `dcd44e2` (remote SHA verified equal to local) |
| Event | `push` |
| Started / ended | 2026-08-25T05:15:11Z → 05:15:36Z |
| Duration | **25 s** |
| Conclusion | **success** |

Every step, in execution order:

| # | Step | Result |
|---|---|---|
| 4 | Install (`npm ci`) | **PASS** |
| 5 | Refresh GitHub repository data | **PASS** |
| 6 | Test the GitHub fallback and secret isolation (`test:github`) | **PASS** |
| 7 | Test the security content audit (`test:security`) | **PASS** |
| 8 | Build and verify (`astro check` + `astro build` + `verify-output.mjs`) | **PASS** |
| 9 | Audit dependencies (`npm audit --audit-level=high`) | **PASS** |

This is the assertion M17 exists to make, and it is now evidence rather than
YAML: a runner executed the full gate set on a branch that is not `v2`, not
`main`, and not part of any pull request.

### 1S.7 Production during feature-branch CI — UNCHANGED, measured

Captured before the push and again after the CI run concluded:

| Route | Before | After |
|---|---|---|
| `/` | 200, 19 214 B, ETag `"6a8c5c5e-4b0e"`, Last-Modified Mon 24 Aug 2026 14:59:42 GMT | **identical on all four** |
| `/cybersecurity/` | 200, 20 059 B, ETag `"6a8c5c5e-4e5b"`, Last-Modified Mon 24 Aug 2026 14:59:42 GMT | **identical on all four** |

Status, `Content-Length`, `ETag` and `Last-Modified` were all unchanged.
**FEATURE BRANCH CI ≠ PRODUCTION DEPLOYMENT — VERIFIED by measurement.**

### 1S.8 Pull-request CI — NOT OBSERVED, OWNER ACTION

No pull request was opened. `gh` is not installed on this machine, and reading
the stored git credential in order to call the REST API was refused by the
sandbox — correctly, and no attempt was made to work around it.

The `pull_request` trigger is unchanged from M16 (`branches: [v2, main]`) and
so carries M16's evidence, but a PR run has **not** been observed on a runner
under M17. Status: **NOT OBSERVED — OWNER ACTION.** Opening any pull request
against `main` or `v2` will exercise it. No `workflow_dispatch` trigger was
added to fake this; the push-to-feature-branch run in §1S.6 is the real
evidence, and it was obtained.

### 1S.9 Main merge and production deployment — OBSERVED

Merged with `git merge --no-ff m17-ci-hardening`, matching the convention used
for `927477a` and `4caff65`. No force-push, no rebase, no reset, no history
rewrite anywhere in this milestone.

| | |
|---|---|
| Merge commit | **`44f928e`** |
| Feature commit | **`dcd44e2`** |
| **Deploy run ID** | **32812259354** |
| Branch / event | `main` / `push` |
| `build` job | success, 2026-08-25T05:17:33Z → 05:18:04Z (**31 s**) |
| `deploy` job | **success, executed — not skipped**, 05:18:08Z → 05:18:18Z (**10 s**) |
| Total | **47 s** |

`build` step results: `npm ci` PASS, GitHub refresh PASS, `test:github` PASS,
`test:security` PASS, `verify` PASS, `npm audit` PASS, `upload-pages-artifact`
PASS. Then `deploy-pages` PASS.

**No CI run was produced on `main`** — `branches-ignore: [main]` behaved
exactly as designed, so the merge cost one workflow run, not two.

To be explicit about a distinction the milestone brief asked for: CI and
deployment **are** two separate workflow files, `ci.yml` and `deploy.yml`, and
they ran as two separate runs on two different refs. `deploy.yml` re-runs every
gate `ci.yml` runs; that duplication is deliberate, so nothing can reach
production having been validated only on a branch.

### 1S.10 Production regression after the M17 deployment — VERIFIED

All routes over HTTPS, `Last-Modified` now Tue 25 Aug 2026 05:18:13 GMT:

| Route | Status | Bytes | `<h1>` |
|---|---|---|---|
| `/` | 200 | 19 214 | 1 |
| `/about/` | 200 | 13 999 | 1 |
| `/projects/` | 200 | 20 178 | 1 |
| `/ai-lab/` | 200 | 59 644 | 1 |
| `/learning/` | 200 | 36 951 | 1 |
| `/github/` | 200 | 36 924 | 1 |
| `/contact/` | 200 | 17 440 | 1 |
| `/cybersecurity/` | 200 | **20 059** | 1 |
| `/404.html` | 200 | 8 986 | 1 |

- `/cybersecurity/` is **20 059 B**, the same size M16 recorded — the security
  world is untouched, as intended.
- HTTP → HTTPS: **301**, still enforced.
- Legacy routes intact: `/work.html` 200, `/lab/pretext/` 200.
- **Byte-identical to the locally built `dist/`**, measured with `cmp`:
  `/cybersecurity/`, `/about/`, `/contact/`. Those three carry no build-time
  GitHub data, so they are the pages where a byte comparison is meaningful
  regardless of what the runner's live fetch returned.
- Console: **no errors or exceptions** on `/` or `/cybersecurity/`, with
  console tracking active across the page load.
- Horizontal overflow: none at 1265 px and 1280 px on `/` and
  `/cybersecurity/` (`scrollWidth === clientWidth`).
- One `<h1>` per page, on all nine routes.

### 1S.11 Security regression on the workflow itself — VERIFIED

| Check | Result |
|---|---|
| New secrets | **None.** The only secret reference is the pre-existing `secrets.GITHUB_TOKEN` |
| New credentials | None |
| `pages: write` in CI | **Absent** |
| `id-token: write` in CI | **Absent** |
| `contents: write` in CI | **Absent** |
| Permission lines changed by the diff | **Zero** |
| Third-party actions added | **None** — the diff touches no `uses:` line |
| Dependencies added or changed | **None** — `package.json` and `package-lock.json` untouched |
| Untrusted-input interpolation | **None.** No `${{ }}` appears inside any `run:` block anywhere in `ci.yml` |
| Fork-PR exposure | Trigger is `pull_request`, **not** `pull_request_target` — forked code runs against the merge ref with a read-only token and no repository secrets |

The whole file contains exactly two expressions: `github.ref` in
`concurrency.group` (a YAML value, never a shell context) and
`secrets.GITHUB_TOKEN` in an `env:` block. No branch name, PR title, commit
message or other attacker-influenced string is interpolated into a shell
command. **No command-injection surface exists.**

### 1S.12 Two findings discovered in passing

**`github-data.yml` has now executed — previously NOT OBSERVED.** M14 and M16
both recorded that this scheduled workflow had never run. It has since run
twice, both on `main`, both success: run **32764751379** (2026-08-24T18:51:12Z)
and run **32798634576** (2026-08-25T01:43:17Z). Each committed a refreshed
`src/data/github.snapshot.json` (`9ff17e2`, `b310619`). That risk is now
**CLOSED — OBSERVED**. §1R is left as written; this is the later observation,
not a correction of it.

**NEW, OPEN: the snapshot refresh does not redeploy production.** Neither
snapshot commit triggered a Deploy run. This is not a defect in the workflow —
GitHub deliberately does not start workflows from pushes made with the default
`GITHUB_TOKEN`, to prevent recursion. The consequence is real, though:
`github-data.yml` commits fresher repository figures to `main`, and production
keeps serving the older ones until some *other* push to `main` happens. Between
2026-08-24T18:51Z and the M17 merge, production was two snapshot commits behind
`main`. The M17 deployment carried both forward, so production is current now.

Fixing it needs either a PAT with `contents: write` (a credential the owner
must create) or a `workflow_run`/`schedule` trigger on `deploy.yml`. Out of
M17's scope — M17 is CI hardening, not deployment redesign. Status: **OPEN —
OWNER ACTION.**

### 1S.13 Limitations — what M17 did not establish

| Item | Status |
|---|---|
| Pull-request CI under the M17 workflow | **NOT OBSERVED — OWNER ACTION** (§1S.8) |
| Narrow-viewport responsive re-test | **NOT RE-TESTED.** The browser resize reported success but the viewport did not change (`clientWidth` stayed 1265), so no narrow-width claim is made. M16 §1R.14 stands; M17 changed no stylesheet and no markup |
| A *forked* pull request actually running | **NOT TESTED.** Reasoned from `pull_request` semantics, not observed |
| Snapshot refresh redeploying production | **OPEN — OWNER ACTION** (§1S.12) |
| Reduced-motion behaviour | **NOT TESTED** (unchanged from M16) |
| Firefox / Safari | **NOT TESTED** (unchanged from M16) |
| OpenWeatherMap credential | **OPEN — EXTERNAL** (unchanged from M16) |

### 1S.14 Current risk register after M17

| Risk | State |
|---|---|
| Branch pushes run no CI | **CLOSED — VERIFIED.** CI run 32812105029 executed all four gates on `m17-ci-hardening` |
| A feature branch could deploy | **CLOSED — VERIFIED.** Four source barriers (§1S.4); zero Deploy runs on the branch; production bytes unchanged |
| `github-data.yml` never executed | **CLOSED — OBSERVED.** Runs 32764751379 and 32798634576 |
| Snapshot commits do not redeploy | **NEW — OPEN, OWNER ACTION** |
| PR CI unobserved under the M17 config | **OPEN — OWNER ACTION** |
| Reduced motion / Firefox / Safari | **NOT TESTED** |
| OpenWeatherMap credential | **OPEN — EXTERNAL** |

### 1S.15 Next milestone

**M18 — close the snapshot-to-production gap (§1S.12), and observe a pull
request.** Both are small, both are evidence-gathering rather than
construction, and the first is the only genuinely new defect this milestone
found. Neither touches the site.

---

## 1T. M18 — Snapshot deployment gap + PR CI observation

**Status: COMPLETE — VERIFIED. Both objectives closed on evidence. Objective B
by PR #1 (§1T.9); Objective A by the scheduled chain firing in full on
2026-08-25, unassisted (§1T.10).**

### 1T.1 Objective

Two things, both evidence rather than construction:

- **A.** Close the gap M17 recorded — `github-data.yml` commits a refreshed
  snapshot to `main`, but production keeps serving the older figures because
  that commit starts no deployment.
- **B.** Close M17's one unobserved CI criterion: a real `pull_request` run.

No redesign, no features, no dependency, no content change.

### 1T.2 Starting state

| | |
|---|---|
| Branch at start | `main` |
| HEAD | **`8cd6300`** (M17 record) |
| `origin/main` | `8cd6300` — equal |
| Working tree | clean |
| Milestone branch | `m18-snapshot-deploy`, cut from `8cd6300` |

### 1T.3 Files changed

**One file.** `.github/workflows/github-data.yml`, commit **`fc1166a`**, +42/−4
(most of it comment). Not touched: `deploy.yml`, `ci.yml`, every page,
component and stylesheet, every client script, `package.json`,
`package-lock.json`, `scripts/*`, all Cybersecurity content.

`deploy.yml` being untouched matters: the deployment workflow's M17-proven
properties carry over unmodified rather than needing to be re-established.

### 1T.4 The investigation

Four questions had to be answered from source and from the API before anything
was edited.

**How does `github-data.yml` commit?** A plain `run:` block: `git config` to
`github-actions[bot]`, `git add src/data/github.snapshot.json`, `git commit`,
`git push` — guarded by `git diff --quiet`, so it commits only when the file
actually changed. The push is authenticated by the runner's automatic
`GITHUB_TOKEN` supplied by `actions/checkout@v4`. No PAT anywhere.

**What decides whether the snapshot changes?** `scripts/fetch-github.mjs`
compares *repository facts only*, ignoring `generatedAt` (`sameFacts`). The
fact list in `normalise` includes **`pushedAt`** — so any push to this
repository changes a fact, and the next scheduled run commits. This is why the
workflow commits far more often than "a few times a week": the repository's own
development traffic moves its own `pushedAt`.

**Why does that commit not deploy?** GitHub's recursion guard: events created
by the default `GITHUB_TOKEN` do not start workflow runs. **Proven three
times, not assumed** — for each bot commit, `GET /actions/runs?head_sha=…`:

| Bot commit to `main` | Snapshot fact changed | Workflow runs for that SHA |
|---|---|---|
| `9ff17e2` | yes | 0 Deploy |
| `b310619` | yes | **`total_count: 0`** |
| `f2cc8da` (**observed live during M18**) | yes — `pushedAt` `2026-08-24T18:51:34Z` → `2026-08-25T05:49:32Z` | **`total_count: 0`** |

`deploy.yml` triggers on `push: branches: [main]`, and `f2cc8da` *is* a push to
`main`. It still produced nothing. That is the defect, reproduced live.

**What was the consequence?** Measured. Run `32819427767` committed `f2cc8da`
at 06:59:55Z. Production continued serving the 05:25:01Z build — a snapshot
commit behind `main`, with no mechanism to catch up until an unrelated human
push happened along.

### 1T.5 Root cause — VERIFIED

Not a bug in the workflow, and not something a permission fixes. It is
documented GitHub behaviour: *"events triggered by the `GITHUB_TOKEN`, with the
exception of `workflow_dispatch` and `repository_dispatch`, will not create a
new workflow run."* The workflow was relying on its own push being noticed, and
that is precisely the thing the guard prevents.

### 1T.6 Chosen solution — ask, do not rely on being noticed

The two documented exceptions are the two forms of dispatch. The workflow now
requests the deployment explicitly, in the guarded tail of the commit step:

```
          git push
          echo "Snapshot committed; requesting a production deployment."
          gh workflow run deploy.yml --ref main
```

with `actions: write` added to its permissions.

Why this and not the alternatives:

| Option | Verdict |
|---|---|
| **`workflow_dispatch` from `github-data` (chosen)** | Fires only when a commit actually happened. Touches one file. `deploy.yml` unmodified |
| `workflow_run` trigger on `deploy.yml` | Needs no new permission, but fires on *every* `github-data` completion — four pointless deployments a day — unless further guarded, and it requires editing the deployment workflow |
| `repository_dispatch` | Might have needed no new permission, but that assumption was not certain enough to stake the fix on, and it too requires editing `deploy.yml` |
| A PAT | **Rejected.** No credential was created, and none is needed |

**Least privilege.** `actions: write` is the minimum grant for the one API call
it makes. It is *narrower* than the `contents: write` this workflow already
holds — a workflow that can push to `main` is strictly more powerful than one
that can start a workflow — and it grants nothing towards Pages. `pages: write`
and `id-token: write` remain confined to `deploy.yml`'s `deploy` job, still the
only `actions/deploy-pages` invocation in the repository.

**No fact change → no deploy.** The dispatch sits *after* the `exit 0` for the
unchanged case. A quiet period produces no commit and no deployment.

**No loop.** It dispatches `deploy.yml` and nothing else; `deploy.yml` neither
pushes nor dispatches; `github-data.yml` is reachable only by `schedule` or a
human `workflow_dispatch`. The chain is two steps deep and terminates.

**No new supply chain.** `gh` is preinstalled on GitHub-hosted runners — no
third-party action, no dependency, no lockfile change.

### 1T.7 Local validation — every baseline held

| Gate | Baseline | M18 | Status |
|---|---|---|---|
| `astro check` | 0 / 0 / 0 | 0 errors, 0 warnings, 0 hints | **VERIFIED** |
| `npm run test:github` | 18 | 18 assertions | **VERIFIED** |
| `npm run test:security` | 35 | 35 assertions | **VERIFIED** |
| `npm run verify` | 17 pages | 17 pages, 8 worlds | **VERIFIED** |
| `npm audit --audit-level=high` | 0 | 0 vulnerabilities | **VERIFIED** |
| `git diff --check` | clean | clean | **VERIFIED** |
| YAML parse, all three workflows | — | parse clean | **VERIFIED** |

Nothing weakened, no assertion relaxed, no exclusion added.

### 1T.8 Pull request — OBSERVED (Objective B complete)

The repository's first pull request, and a real change rather than a synthetic
one: the M18 fix itself.

| | |
|---|---|
| PR | **#1** — `ci(github-data): deploy the snapshot it just committed` |
| Head → base | `m18-snapshot-deploy` → `main` |
| Head SHA | `fc1166a` |
| Created / merged | 2026-08-25T08:11:28Z / 08:12:52Z |
| Merge commit | **`093215d`** |
| Size | 1 file, +42 −4 |
| Opened by | repository owner (PR creation needs credentials Claude Code does not hold) |

**PR CI run — OBSERVED:**

| | |
|---|---|
| **Run ID** | **32825354280** |
| Workflow / event | CI / **`pull_request`** |
| Branch / SHA | `m18-snapshot-deploy` / `fc1166a` |
| Duration | 2026-08-25T08:11:33Z → 08:12:03Z (**30 s**) |
| Conclusion | **success** |

All four gates, in the M17 order:

| # | Step | Result |
|---|---|---|
| 4 | Install (`npm ci`) | **PASS** |
| 6 | `test:github` | **PASS** |
| 7 | `test:security` | **PASS** |
| 8 | `verify` (astro check + build + `verify-output.mjs`) | **PASS** |
| 9 | `npm audit --audit-level=high` | **PASS** |

M17's `NOT OBSERVED — OWNER ACTION` on PR CI is now **CLOSED — VERIFIED**.

An earlier push run on the same branch is also recorded: run **32814369987**,
event `push`, 05:49:37Z → 05:50:05Z (28 s), success.

### 1T.9 PR and feature-branch deployment exclusion — VERIFIED

`GET /actions/runs?branch=m18-snapshot-deploy` → **`total_count: 2`**:

| Run | Workflow | Event | Result |
|---|---|---|---|
| 32825354280 | CI | `pull_request` | success |
| 32814369987 | CI | `push` | success |

**Zero Deploy runs. Zero Pages deployments.** Both the push and the pull
request ran validation only.

From source, this is over-determined: `deploy.yml`'s trigger list is exactly
`['push', 'workflow_dispatch']` — it has **no `pull_request` trigger at all**,
so a PR event cannot start it even before the `deploy` job's
`if: github.ref == 'refs/heads/main'` is considered. `ci.yml` remains
`contents: read` with no `environment:` and no Pages step, and uses
`pull_request`, never `pull_request_target`, so fork code would run against the
merge ref with a read-only token and no secrets.

Production during the PR: `Last-Modified` stayed at the pre-PR value until the
*merge* deployed. **VERIFIED.**

### 1T.10 The scheduled chain — OBSERVED END TO END

The desired chain is:

```
github-data (schedule) -> snapshot fact changes -> bot commit to main
   -> gh workflow run deploy.yml -> gates -> deploy-pages -> production updates
```

It fired in full on **2026-08-25**, on the first scheduled run to carry the fix.
Nothing was staged to produce this evidence: no workflow was manually
dispatched, the cron was not touched, and no commit was manufactured. The run
below is GitHub's own `schedule` delivery of the `0 */6 * * *` 12:00Z slot.

**Link 1 — the scheduled run**

| | |
|---|---|
| **Run ID** | **32850891668** |
| Workflow / event | GitHub data / **`schedule`** |
| Created | 2026-08-25T13:01:33Z — the 12:00Z slot, 61 min late, in line with the 50–60 min lateness recorded above |
| `head_sha` | `6350f1d` — the `main` tip, which carries the M18 dispatch step |
| Conclusion | **success** |

**Link 2 — the bot commit (the source identity for everything below)**

| | |
|---|---|
| **SHA** | **`9d642371156c3927c66130b44631659d72404de9`** |
| Author | `github-actions[bot]` |
| Date | 2026-08-25T13:01:53Z |
| Message | `chore(data): refresh the GitHub fallback snapshot` |
| Diff | `src/data/github.snapshot.json` only — 2 lines: `generatedAt` `2026-08-25T06:59:41.381Z` → `2026-08-25T13:01:40.004Z`, `pushedAt` `2026-08-25T05:49:32Z` → `2026-08-25T08:24:01Z` |

That `pushedAt` move is exactly the change this section predicted would force a
commit: the merge traffic of 08:12–08:24Z.

**Link 3 — the dispatch, attributed by identity rather than by timing**

All three attribution conditions hold:

| Condition | Required | Observed |
|---|---|---|
| Deploy run `event` | `workflow_dispatch` | **`workflow_dispatch`** |
| Created after the bot commit | > 13:01:53Z | **13:01:56Z** — 3 s later |
| Deploy `head_sha` | exactly the bot commit | **`9d642371156c3927c66130b44631659d72404de9`** — exact match |

| | |
|---|---|
| **Run ID** | **32850928044** |
| Actor / triggering actor | `github-actions[bot]` / `github-actions[bot]` |
| Conclusion | **success** |

This is the repository's **first** `workflow_dispatch` Deploy run. Every one of
the other twelve runs in `deploy.yml`'s history is `event: push` with a human
actor, so it cannot be confused with a merge deployment.

**Link 4 — the gates, re-run in full for the bot commit**

`build`, 13:01:59Z → 13:02:28Z (**29 s**), every step success:

| # | Step | Result |
|---|---|---|
| 2 | `actions/checkout@v4` | success |
| 3 | `actions/setup-node@v4` | success |
| 4 | Install (`npm ci`) | success |
| 5 | Refresh GitHub repository data | success |
| 6 | Test the GitHub fallback and secret isolation | success |
| 7 | Test the security content audit | success |
| 8 | Build and verify | success |
| 9 | Audit dependencies | success |
| 10 | `actions/upload-pages-artifact@v3` | success |

The dispatch buys no shortcut. The bot commit cleared the same four gates a
human push clears, which is the property §1T.6 argued for on paper and this run
demonstrates in fact.

**Link 5 — the deploy job**

`deploy`, 13:02:32Z → 13:03:21Z (**49 s**). `actions/deploy-pages@v4`
**executed** — success, not skipped. Run total: 13:01:56Z → 13:03:21Z (**85 s**).

**Link 6 — production, verified independently of the Actions API**

| | |
|---|---|
| `github-pages` deployment | **6083695789** |
| Deployment `sha` | **`9d642371156c3927c66130b44631659d72404de9`** — the bot commit |
| Status trail | `waiting` 13:02:30Z → `queued` 13:02:32Z → `in_progress` 13:02:33Z → **`success` 13:03:22Z** |
| `environment_url` | `https://ayushrijal.com.np/` |
| Live `Last-Modified` | **Tue, 25 Aug 2026 13:02:42 GMT** on `/`, `/github/` and `/projects/` — it was 08:13:41 GMT after the merge deployment of §1T.12 |
| Live status | 200 over HTTPS |

The `Last-Modified` move from 08:13:41 to 13:02:42 GMT is production
republishing from the dispatched run's artifact, observed from the public site
rather than from the API that reported the run.

**What this evidence deliberately does not rest on.** Rendered `/github/`
dates and figures are **not** used as proof. The snapshot is a build-time
fallback, and a page can legitimately render identical numbers after a refresh
whose only real changes were `generatedAt` and one `pushedAt`. Commit identity
— the bot SHA, the Deploy `head_sha` and the Pages deployment `sha`, all three
the same 40 characters — is the source of truth, and it is unambiguous.

Status: **OBSERVED.** The dispatch link executes, and a refreshed snapshot
reaches production with no human involvement. Scheduled run start to production
success: **1 min 49 s**.

### 1T.11 Merge deployment — OBSERVED

| | |
|---|---|
| **Run ID** | **32825466193** |
| Workflow / event | Deploy / `push` on `main` |
| Commit | `093215d` (parents `f2cc8da` + `fc1166a`) |
| `build` | success, 08:12:57Z → 08:13:35Z (**38 s**) |
| `deploy` | **success, executed**, 08:13:38Z → 08:13:47Z (**9 s**) |
| Total | 08:12:54Z → 08:13:48Z (**54 s**) |

`build`: `npm ci`, GitHub refresh, `test:github`, `test:security`, `verify`,
`npm audit`, `upload-pages-artifact` — all PASS. Then `actions/deploy-pages@v4`
PASS.

Because the merge commit's first parent is `f2cc8da`, this deployment also
carried the *pending* snapshot to production. The staleness described in §1T.4
is resolved as of 08:13:41Z — **by the merge, not by the new mechanism**, which
is a distinction worth keeping straight.

### 1T.12 Production verification — VERIFIED

All routes over HTTPS, `Last-Modified` Tue 25 Aug 2026 08:13:41 GMT:

| Route | Status | Bytes | `<h1>` |
|---|---|---|---|
| `/` | 200 | 19 214 | 1 |
| `/about/` | 200 | 13 999 | 1 |
| `/projects/` | 200 | 20 178 | 1 |
| `/ai-lab/` | 200 | 59 644 | 1 |
| `/learning/` | 200 | 36 951 | 1 |
| `/github/` | 200 | 36 924 | 1 |
| `/contact/` | 200 | 17 440 | 1 |
| `/cybersecurity/` | 200 | 20 059 | 1 |
| `/404.html` | 200 | 8 986 | 1 |

- HTTP → HTTPS **301**. Still enforced.
- Live legacy: `/work.html` 200, `/lab/pretext/` 200.
- Retired routes still gone: `/about.html`, `/contact.html`, `/journey.html`,
  `/blog.html`, `/assets/resume.pdf`, `/ai` — **all 404**.
- **Byte-identical to local `dist/`** (`cmp`): `/cybersecurity/`, `/about/`,
  `/contact/`, `/learning/`, `/ai-lab/`.
- `/github/` differs from local `dist/` (36 924 vs 35 421) — **expected, not a
  regression**: `deploy.yml` runs a live `github:fetch`, the local build read
  the committed snapshot. §1T.4's whole subject is that these two move apart.
- Client-side audit over all nine fetched pages (233 395 B): **0**
  `api.github.com`, **0** `sourceMappingURL`, **0** `.map` references, **0**
  inline `<script>`, **0** credential-shaped strings, **0**
  `fetch(`/`XMLHttpRequest`/`WebSocket`. Every script is a same-origin
  `/_astro/…` module. No off-origin subresource is loaded anywhere; external
  hosts (`github.com`, `overthewire.org`, `linkedin.com`) appear only as `href`
  link targets, and `http://localhost:11434` appears only as prose inside a
  `<code>` element on AI Lab describing a project's source.
- Console: **no errors or exceptions** on `/`, `/cybersecurity/` and `/github/`,
  with tracking active across each load.
- Horizontal overflow: none at 1265 px on those three pages.

### 1T.13 Security regression — VERIFIED

| Check | Result |
|---|---|
| Credentials or PATs added | **None** |
| Secrets printed | **None** |
| Secret references | Only the pre-existing `secrets.GITHUB_TOKEN`, passed via `env:` |
| `${{ }}` inside any `run:` block | **None**, across all three workflows |
| Pages / `id-token` grants | Confined to `deploy.yml`'s `deploy` job |
| Pages permission in CI or `github-data` | **None** |
| Third-party actions | **None** — every `uses:` is first-party `actions/*` |
| Dependencies / lockfile | **Unchanged** |
| `continue-on-error` added | **None** — the two occurrences are the pre-existing GitHub-refresh steps |
| Deployment reachable from a non-`main` ref | **No** — trigger list plus job `if`, and empirically zero Deploy runs on the branch |
| Recursive workflow risk | **None** — two-step terminating chain (§1T.6) |
| Security or accessibility assertions weakened | **None** |

The one permission change in the milestone is `actions: write` on
`github-data.yml`, justified in §1T.6.

### 1T.14 Accessibility and responsive — status honestly bounded

| Item | Status |
|---|---|
| One `<h1>` per page, nine routes | **VERIFIED** |
| No console errors | **VERIFIED** on `/`, `/cybersecurity/`, `/github/` |
| No horizontal overflow | **VERIFIED at 1265 px** on those three pages |
| Narrow-viewport responsive | **NOT TESTED** in M18 |
| Reduced motion | **NOT TESTED** |
| axe / Lighthouse / screen reader | **NOT TESTED** — none was run |
| WCAG conformance | **NOT CLAIMED** |

M18 changed no markup, stylesheet or client script, so M16 §1R.13–1R.14 remain
the governing evidence for accessibility and responsive behaviour.

### 1T.15 Browser coverage

**Chrome only.** Firefox **NOT TESTED**, Safari/WebKit **NOT TESTED**.

### 1T.16 Git state

| | |
|---|---|
| `main` (local) | `6350f1d` |
| `origin/main` | `9d64237` — one commit ahead: the unattended bot snapshot commit of §1T.10 |
| Working tree | clean |
| Branch retained | `m18-snapshot-deploy` at `fc1166a` |
| Force-push / rebase / reset / history rewrite | **None** |
| Merge style | GitHub merge commit via PR #1 |

`8cd6300` (M17) remains an ancestor of `HEAD`.

### 1T.17 Remaining owner actions

| Item | Status |
|---|---|
| Observe the scheduled dispatch chain firing | **DONE — OBSERVED** 2026-08-25T13:01–13:03Z, §1T.10 |
| Reduced-motion behaviour | **NOT TESTED** |
| Firefox / Safari | **NOT TESTED** |
| OpenWeatherMap credential | **OPEN — EXTERNAL** |

### 1T.18 Risk register after M18

| Risk | State |
|---|---|
| Branch pushes run no CI | **CLOSED — VERIFIED** (M17) |
| PR CI never observed | **CLOSED — VERIFIED.** Run 32825354280, event `pull_request` |
| A PR or feature branch could deploy | **CLOSED — VERIFIED.** 2 runs on the branch, both CI, zero Deploy |
| Snapshot commits do not redeploy | **CLOSED — VERIFIED.** Scheduled run `32850891668` → bot commit `9d64237` → `workflow_dispatch` Deploy `32850928044` (`head_sha` exact) → Pages deployment `6083695789` success (§1T.10) |
| Reduced motion / Firefox / Safari | **NOT TESTED** |
| OpenWeatherMap credential | **OPEN — EXTERNAL** |

### 1T.19 Next milestone

**M18 is closed. The pipeline needs no further work.** The CI → snapshot →
deployment chain is now demonstrated end to end rather than argued for: pushes
to any branch run CI (M17), pull requests run CI and cannot deploy (§1T.9),
merges to `main` deploy (§1T.11), and — the link that was missing — an
unattended snapshot commit now deploys itself (§1T.10). Every claim in that
chain is backed by a run ID, a commit SHA or a live HTTP header.

**M19 — browser behaviour, not pipeline.** What remains untested is untested
*rendering*, and it is deliberately not folded into a CI milestone: narrow
viewports, `prefers-reduced-motion`, Firefox and Safari/WebKit, and an actual
accessibility audit (axe or Lighthouse, neither of which has ever been run
here). Those are questions about what a browser does with the built site, and
they need their own milestone and their own honest evidence table. **Not
started.**

`OpenWeatherMap` remains **OPEN — EXTERNAL** and is not a milestone item.

---

## 1U. M19 — Final QA, accessibility, cross-browser verification & release

**Status: COMPLETE — PRODUCTION RELEASE VERIFIED.** The final engineering
milestone. QA only: three defects were found by this milestone's own
verification and fixed; nothing else in the product changed. No new page, no
new world, no feature, no dependency, no analytics, no network call, no
redesign. Total product diff: **3 files, +11 −4**, all of it inside `/lab/`.

### 1U.1 Starting state — recorded before anything was touched

| | |
|---|---|
| Branch | `main` |
| HEAD | **`458d1c5`** — the M18 closeout record |
| `origin/main` | `458d1c5` — equal |
| Working tree | clean |
| Production | serving the artifact from bot commit `9d64237`, `Last-Modified` 2026-08-25T13:02:42 GMT |
| Workflows | `ci.yml`, `deploy.yml`, `github-data.yml` |
| Gates | `npm run verify` (astro check + build + `verify-output.mjs`), `test:github`, `test:security`, `npm audit` |
| Dependencies | `astro 7.2.4`; dev: `@astrojs/check`, `@types/node`, `typescript`. Unchanged all milestone. |

**The floating Kali dragon does not exist and never has.** Verified, not
assumed: `grep -rniE "dragon|kali"` over the whole repository excluding
`node_modules`, `.git`, `dist` and `.astro` returns **zero** hits, and the same
grep over the built `dist/` returns **zero**. The only mention anywhere is
§1R's note that the M16 brief's reference to it had no referent either. There
is therefore no dragon to QA, and none was added — adding one would be exactly
the scope expansion this milestone forbids.

What does exist, and what Phase 4's checks were applied to instead, is the one
genuinely **pointer-reactive island on the site**: the home wordmark
(`src/scripts/wordmark.ts`), whose glyphs lift as the pointer crosses them.
§1U.6 records it under the Phase 4 criteria.

### 1U.2 Baseline gates — before any M19 change

| Gate | Result |
|---|---|
| `npm run verify` | **PASS** — 16 pages built, 17 audited |
| `astro check` | **PASS** — 0 errors, 0 warnings, 0 hints |
| `npm run test:github` | **PASS** — 18 assertions |
| `npm run test:security` | **PASS** — 35 assertions |
| `npm audit` | **PASS** — 0 vulnerabilities |
| `git diff --check` | **PASS** — clean |

No baseline failure, so nothing had to be investigated before starting. No
assertion was weakened at any point in the milestone: `scripts/`, `src/lib/`,
`docs/SECURITY.md`, `.github/` and both dependency manifests are **byte-identical
to `origin/main`** at the end of M19 (`git diff --name-only origin/main -- …`
returns nothing), and the two negative-test counts are unchanged at 18 and 35.

### 1U.3 Test instrumentation — and why it is not a dependency

Real browsers were needed for Phases 3–6. Playwright 1.62.1 with **Chromium
151.0.7922.34, Firefox 153.0 and WebKit 26.5**, plus **axe-core 4.13.0**, was
installed into a **scratchpad directory outside the repository**. It is not in
`package.json`, not in `package-lock.json`, not in the tree, and not in the
diff — confirmed by `grep -nE "playwright|axe" package.json package-lock.json`,
which returns nothing. The project's own dependency count is unchanged.

### 1U.4 Responsive / narrow viewport — VERIFIED

**17 routes × 8 widths = 136 cells**, measured on production, each checked for
`documentElement.scrollWidth − innerWidth`, every element escaping the viewport
box, `<h1>` count, duplicate `id`s, broken `aria-labelledby`, table captions and
`scope`, landmark shape, scroll ports, touch-target size and console errors.

Widths: **320, 375, 390, 430, 768, 1024, 1280, 1920**.

**Before the fixes — 5 cells with horizontal overflow, all in `/lab/`:**

| Route | Widths | Overflow | Cause |
|---|---|---|---|
| `/lab/wordmark/` | 320, 375, 390, 430 | +116, +62, +47, +8 px | a stage pinned to a fixed `inline-size: 26rem` (416 px) |
| `/lab/viewports/` | 320 | +40 px | the 340 px preview column, which is fixed because each frame's scale factor is computed against it |

**Every one of the eight worlds, all three project records, `/404.html` and
`/work.html` overflowed at no width at all.** `<h1>` was exactly 1 in all 136
cells. Zero duplicate `id`s, zero broken `aria-labelledby`, zero console errors
site-wide. Every table on the site carries a `<caption>` and every `<th>` in
those tables carries `scope`.

**After the fixes: 136 cells re-measured on the built artifact — 0 findings.**

| Zoom | Result |
|---|---|
| Text-only 200% (root 16 px → 32 px, all 17 routes) | **VERIFIED** — no horizontal overflow, no clipped content. The one box that reports clipping is `h1.wordmark__fallback.visually-hidden`, which clips identically at 100% because clipping is what `.visually-hidden` is for — a false positive of the probe, not a defect |
| Browser zoom 200% (1280 CSS px at `deviceScaleFactor` 2 → 640 CSS px) | **VERIFIED** — no horizontal overflow on any route |

### 1U.5 Reduced motion — VERIFIED, by engine emulation rather than by grep

Not a CSS-media-query inspection. Each engine's own reduced-motion emulation
was switched on, `matchMedia('(prefers-reduced-motion: reduce)')` was confirmed
to report `true` inside the page, and then **`document.getAnimations()`** was
read after the entrance choreography had had 1.8 s to settle, and the geometry
of the first 400 elements was sampled twice 700 ms apart to catch movement that
no animation object would explain.

| Preference | Animations present | Running | Infinite & running | Geometry moved after settling |
|---|---|---|---|---|
| `no-preference`, 8 worlds | 1–6 | **0** | **0** | **false** on all 8 |
| `reduce`, 8 worlds | **0** | **0** | **0** | **false** on all 8 |

Under `reduce` there is not a reduced animation to audit — **there is no
animation object on the page at all**, on any of the eight worlds. Nothing
continues indefinitely, nothing moves rapidly, and the site remains fully
functional. Confirmed independently in **all three engines** (§1U.7).

The mechanism is the reason it holds: the stylesheets gate decorative motion
behind `@media (prefers-reduced-motion: no-preference)` — motion opts *in* — and
the two motion-bearing islands (`wordmark.ts`, `world-gate.ts`) return early on
`prefersReducedMotion()`, which is re-read per call so a mid-session preference
change is honoured.

### 1U.6 The pointer-reactive island — Phase 4 criteria applied, VERIFIED

There is no dragon (§1U.1). These are the Phase 4 checks run against the
wordmark, the site's only pointer-following interaction.

| Phase 4 criterion | Result |
|---|---|
| Follows the pointer | **VERIFIED** — dispatching `pointermove` across the host changes `--glift` on the glyphs (e.g. `0 → 0.0489`), in all three engines |
| Does not trap the cursor / prevent clicking | **VERIFIED** — both listeners are `{ passive: true }`; `elementFromPoint` over a masthead link returns the link itself, so the nav is topmost and clickable, before and after pointer travel |
| Does not interfere with links or buttons | **VERIFIED** — same hit test; no overlay element exists |
| Does not cover controls permanently | **VERIFIED** — the island paints only inside its own inline stage; it has no fixed or floating layer |
| Causes no layout overflow | **VERIFIED** — `scrollWidth − innerWidth` is **0 before and 0 after** pointer travel |
| Text stays readable, no layout jump | **VERIFIED** — document height is **2257 px before and 2257 px after**; the effect is a compositor-only transform driven by a custom property, and the accessible `<h1>` is separate static text |
| Bounded and predictable | **VERIFIED** — lift is `max(0, 1 − |centre − ratio| / reach)²`, clamped at 0, rAF-coalesced through `onFrame` |
| Keyboard not obstructed | **VERIFIED** — the island adds no tab stop; tab order on `/` is skip-link → nav, unchanged (§1U.8) |
| Touch / coarse pointer degrades | **VERIFIED** — emulated iPhone (390×844, `hasTouch`, `pointer: coarse`, `hover: none`): `bindPointer` returns early, every `--glift` is `0`, overflow 0, **0 running animations and 0 infinite animations** after settle |
| Respects reduced motion | **VERIFIED** — under `reduce` the island's pointer binding is never installed, and the page carries 0 animations |
| Never a barrier to primary content | **VERIFIED** — axe reports **0 violations** on `/` at 320, 390 and 1280 |

No safeguard was removed and no animation was preserved at accessibility's
expense; nothing about the island needed changing.

### 1U.7 Cross-browser — Chrome VERIFIED, Firefox VERIFIED, WebKit VERIFIED, Safari NOT TESTED

Each engine ran the full route set at 390, 768 and 1280 — **51 cells per
engine** — checking HTTP status, horizontal overflow, `<h1>` count, `<main>`
presence, console errors, page errors, failed requests and any cross-origin
resource load, then navigation by real click, focus indicator, reduced motion at
both settings, and the pointer island.

| Engine | Build | Cells | Findings |
|---|---|---|---|
| **Chromium** | 151.0.7922.34 | 51 | **0** |
| **Firefox** | 153.0 | 51 | **0** |
| **WebKit** | 26.5 | 51 | **0** |

In all three: navigation click `/` → `/about` resolves with exactly one `<h1>`;
reduced motion honoured (0 animations under `reduce`, 0 infinite under
`no-preference`); the pointer island responds, causes no overflow and leaves the
nav clickable; **zero cross-origin resource loads**.

**One engine difference, and it is not a site defect.** Under WebKit a plain
`Tab` leaves focus on `<body>` and reaches no link. This is WebKit's documented
default — Safari's *"Press Tab to highlight each item"* is off by default, so
sequential navigation visits form controls only, and no markup on the page can
change it. Measured on the same page in the same run: the skip link **is**
focusable (`.focus()` succeeds), **is** visible when focused (39 px tall, on
screen), **does** paint a focus ring, and activating it moves focus to `main`
with `location.hash === '#main'`; all **16** focusable elements are present.
Firefox and Chromium reach the skip link on the first `Tab`. Recorded as an
engine preference, **not** as a defect and **not** as a pass.

**Safari itself: NOT TESTED.** There is no Apple hardware and no Safari
installation in this environment. WebKit 26.5 — the engine Safari is built on —
was tested directly, which is the closest available evidence and is not the same
claim. Edge is installed but is Chromium, so it adds no engine coverage and was
not separately recorded.

### 1U.8 Accessibility — axe-core audit, VERIFIED with stated bounds

**axe-core 4.13.0**, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`,
`wcag22aa`, `best-practice`, over **17 routes × 2 widths = 34 page-runs** on
production, then re-run on the fixed build at 320, 390 and 1280.

**Before the fixes — two violation types, both in `/lab/`:**

| Rule | Impact | Where |
|---|---|---|
| `scrollable-region-focusable` | **serious** | `/lab/pretext/` — the two `pre.lab__code` blocks scroll horizontally at ≤430 px and no keyboard could reach them. The page has **zero** focusable elements, so twelve `Tab` presses all landed on `<body>` — confirmed directly, not inferred |
| `landmark-unique` | moderate | `/lab/viewports/` only — see below |

**After the fixes — 0 violations on every route at every width tested.**

`landmark-unique` on `/lab/viewports/` is a **measurement artifact, not a page
defect**, and it is still reported: the harness embeds seven real site pages in
same-origin iframes and axe traverses into them, so it sees seven copies of the
site's `<header>`/`<nav>` merged with the harness's own `<main>`. Landmarks
inside an iframe are scoped to that iframe's document. Nothing is duplicated in
any document the browser actually exposes. It is recorded rather than silenced.

| Check | Result |
|---|---|
| Heading hierarchy | **VERIFIED** — no skipped level on any route |
| Exactly one `<h1>` | **VERIFIED** — 1 on all 136 responsive cells |
| Landmarks | **VERIFIED** — header/nav/main/footer on all eight worlds; `/404.html` has no footer by design; `/lab/*` are `bare` pages carrying `<main>` alone |
| Duplicate `id`s | **VERIFIED — none** |
| Broken `aria-labelledby` | **VERIFIED — none** |
| Skip link | **VERIFIED** — first tab stop on every site page, visible ring, `Enter` moves focus to `#main` |
| Skip link on `/lab/*` | **Absent by design** — `bare` pages render no header and no nav, so there is nothing to skip; `<main id="main" tabindex="-1">` is still present |
| Visible focus | **VERIFIED** — every one of 12 tab stops on `/`, `/github/`, `/cybersecurity/`, `/contact/` paints an outline or box-shadow; **zero** without an indicator |
| Focus order | **VERIFIED** — follows DOM order: skip link → masthead → nav |
| Keyboard activation | **VERIFIED** — skip link and scroll ports operable (§1U.9) |
| Tables | **VERIFIED** — every table carries `<caption>`; every `<th>` carries `scope`. The one markdown-generated table (`/projects/jarvis-assistant/`) **passes** `th-has-data-cells` |
| Scroll regions | **VERIFIED after fix** — all three are `role="region"` + `aria-label` + `tabindex="0"` |
| Reduced motion | **VERIFIED** (§1U.5) |
| Contrast | **0 violations**, 164 passing nodes on `/github/` alone. A number of nodes return **INCOMPLETE — "background could not be determined due to a background gradient / pseudo element"**, because every world is printed on a CSS-drawn ground. axe cannot adjudicate those and neither will this record. `verify-output.mjs` separately asserts all **7 world stocks clear WCAG AA** |
| Touch targets | **MEASURED, NOT ADJUDICATED.** Smallest interactive targets are masthead nav links at 21 px tall and footer/prose inline links at 15 px. Under WCAG 2.5.8 these depend on the inline-text and spacing exceptions, which axe does not evaluate and which were not independently assessed here. Recorded as measured |
| Screen reader | **NOT TESTED** — no NVDA/JAWS/VoiceOver pass was run |
| Lighthouse | **NOT TESTED** — axe was the tool used |

**WCAG conformance is NOT CLAIMED.** What is claimed is exactly this: axe-core
4.13.0 reports zero violations across those tags on every route at every width
tested, with contrast and touch targets bounded as above.

### 1U.9 The three defects fixed — the entire product diff

All three are in `/lab/*`, the `noindex`, `Disallow`-ed, unlinked internal
prototypes. All three were found by this milestone's verification. Nothing else
was touched.

**1. `/lab/wordmark/` — a fixed 26 rem stage overflowed four phone widths.**

```diff
-      <div class="lab__stage" style="inline-size: 26rem">
+      <div class="lab__stage" style="inline-size: min(26rem, 100%)">
```

The stage exists to show the wordmark at a constrained width. `min()` keeps that
intent and stops it exceeding the page below ~456 px.

**2. `/lab/viewports/` — the 340 px preview column overflowed at 320 px.**
`.vp__grid` gains `overflow-x: auto` and becomes a keyboard-reachable scroll
port, matching what `.tablewrap` already does everywhere else on the site —
including its `role="region"` + `aria-label` + `tabindex="0"`, for the reason
`global.css` already gives: a container that can scroll must be reachable from
the keyboard when it does. The column cannot simply shrink, because each frame's
scale factor is computed against its width.

**3. `/lab/pretext/` — two scrollable code blocks unreachable by keyboard.**
Both `<pre class="lab__code">` gain `role="region"`, an `aria-label` and
`tabindex="0"`. This is the root cause rather than the symptom: the project
already had the pattern for scroll ports, and `.lab__code` was the one
`overflow-x: auto` container that had never been given it. `.tablewrap` (6 uses)
already carried it. `.prose__scroll` in `projects.css` is **dead CSS** — it
appears in no built HTML — and was left alone rather than expanded into a change
nobody asked for.

**Verification of the fixes, on the built artifact:**

| Check | Result |
|---|---|
| 136 responsive cells re-measured | **0 findings** (was 5) |
| axe on `/lab/pretext/`, `/lab/viewports/`, `/lab/wordmark/`, `/`, `/github/` at 320/390/1280 | **0 violations** (was 2 rules) |
| `pre.lab__code` reached by `Tab` | **yes**, 1 hop; `ArrowRight` scrolls it `scrollLeft 0 → 270` |
| `.vp__grid` reached by `Tab` | **yes**, 1 hop; `ArrowRight` scrolls it `scrollLeft 0 → 60` |
| Composition at 1280 unchanged | **VERIFIED** — page overflow 0, neither container scrolls at desktop width |

### 1U.10 Security regression — VERIFIED, over source *and* `dist/`

| Check | Result |
|---|---|
| Source maps in `dist/` | **0** |
| `.env` / `*.key` / `*.pem` / `*secret*` in `dist/` | **0** |
| Credential-shaped strings (`gh[pousr]_…`, `AKIA…`, `sk-…`, `BEGIN … PRIVATE KEY`, `Bearer …`) in `dist/` | **0** |
| `api.github.com` in any shipped asset | **0** — the GitHub integration is build-time only |
| Network-capable JS in `dist/` (`fetch(`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, `EventSource`) | **0 occurrences** |
| Inline `<script>` with a body | **0** across all 17 pages |
| Inline event handlers (`onclick=` etc.) | **0** |
| External resource origins | **0** — the only absolute URLs are `<a href>` destinations: `github.com`, `linkedin.com`, `overthewire.org` |
| Cross-origin loads observed at runtime | **0**, across 153 page loads in three engines |
| CSP present | **17 of 17 pages**, `default-src 'self'; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'` |
| `npm audit` | **0 vulnerabilities** |
| Existing assertions | **unchanged** — 18 and 35, files byte-identical to `origin/main` |
| Content-boundary rules | **unchanged** — `test:security` 35/35 |

`localhost:11434` appears in `dist/ai-lab/index.html` and
`dist/learning/index.html`. It is **prose** — the documented Ollama port of the
author's own local Jarvis setup, inside `<span class="pipeline__detail">` and a
sentence — not an endpoint anything calls. With zero network-capable JS in the
bundle and `connect-src 'self'` in force, it is not reachable as one.

### 1U.11 Production regression — VERIFIED

Over HTTPS, against the live site.

| Check | Result |
|---|---|
| 8 worlds, 3 project records, `/404.html`, `/work.html`, 4 `/lab/*` pages, `robots.txt`, `sitemap.xml`, `CNAME` | **200** on all 20 |
| Internal link crawl | **34 URLs, 0 broken** — every non-200 was a GitHub Pages 301 to the canonical trailing slash, each resolving 200 |
| Extensionless world routes | `/about`, `/projects`, `/ai-lab`, `/cybersecurity`, `/learning`, `/github`, `/contact` → **301 → `/…/` → 200**. The M11 collision rule holds: no stub shadows a live route |
| HTTP → HTTPS | **301** to `https://ayushrijal.com.np/` |
| Retired routes | `/blog.html`, `/journey.html`, `/about.html`, `/contact.html`, `/assets/resume.pdf` → **404**, each a documented decision in `src/lib/legacy.ts`, not a break |
| Legacy stub | `/work.html` → **200**, 1 640 B, intact |
| Assets | fonts 200 (`font/woff2`); no missing asset in the crawl |
| Console errors on production | **0**, across 136 cells |
| Unexpected external requests | **0** |

**Byte comparison against the local build — 15 of 20 identical.** The five that
differ, and why none is a regression:

- `/lab/pretext/`, `/lab/viewports/`, `/lab/wordmark/` — the three M19 fixes,
  not yet deployed at the time of comparison. Expected.
- `/github/` (11 vs 10 repositories) and `/projects/` (`Repository data`
  25 Aug vs 22 Aug) — **legitimate build-time GitHub data**, and the mechanism
  was confirmed rather than assumed: `src/lib/github.ts` prefers
  `github.generated.json` over the committed snapshot, that file is
  **gitignored**, and the local copy is a stale fetch from
  `2026-08-22T13:06:04Z`. CI runs `npm run github:fetch` before building, so
  **production is fresher than the local build, not different from it**. Exactly
  the case the brief warned against misclassifying.

### 1U.12 Deployment / automation regression — VERIFIED

The M18 chain was **not** re-simulated: no manual dispatch, no cron change, no
manufactured commit. Only the configuration was re-inspected.

`git diff --stat origin/main -- .github/workflows/` returns **nothing**. All
three workflows are byte-identical to the M18 closeout.

| Property | State |
|---|---|
| `ci.yml` | `push` on `[v2, main]` + `pull_request` + `workflow_dispatch`; `permissions: contents: read`; concurrency `ci-${{ github.ref }}` |
| `deploy.yml` | `push` on `[main, v2]` + `workflow_dispatch`; top-level `contents: read`; `pages: write` + `id-token: write` confined to the `deploy` job; concurrency `pages` |
| `github-data.yml` | `schedule: '0 */6 * * *'` + `workflow_dispatch`; `contents: write` + `actions: write`; concurrency `github-data` |
| Dispatch mechanism | unchanged — `gh workflow run deploy.yml --ref main`, inside the commit-only branch |
| Recursion protection | unchanged — chain is two steps and terminates; `deploy.yml` neither pushes nor dispatches |

No regression found, so nothing in the automation was modified.

### 1U.13 Final test suite — re-run after every fix

No result below predates a fix.

| Gate | Result |
|---|---|
| `npm run verify` | **PASS** — 16 pages built, 17 audited |
| `astro check` | **PASS** — 0 errors, 0 warnings, 0 hints |
| `npm run test:github` | **PASS** — 18 assertions |
| `npm run test:security` | **PASS** — 35 assertions |
| `npm audit` | **PASS** — 0 vulnerabilities |
| `git diff --check` | **PASS** |
| Responsive, 136 cells | **PASS** — 0 findings |
| axe-core, 3 engines' worth of routes | **PASS** — 0 violations |
| Cross-browser, 153 cells | **PASS** — 0 findings |

Two pre-existing build-time notices remain and are **not** M19 regressions —
they are present identically in the baseline: *"The collection `labs` does not
exist or is empty"* and the same for `learning`. Both directories hold only a
`.gitkeep`; the pages that read them render their static records regardless, and
`verify-output.mjs` passes.

### 1U.14 Files changed

| File | Change |
|---|---|
| `src/pages/lab/wordmark.astro` | +1 −1 — `inline-size: min(26rem, 100%)` |
| `src/pages/lab/viewports.astro` | +8 −1 — `overflow-x: auto` on `.vp__grid`, plus `role`/`aria-label`/`tabindex` and the comment explaining why |
| `src/pages/lab/pretext.astro` | +2 −2 — `role`/`aria-label`/`tabindex="0"` on both `pre.lab__code` |
| `docs/PROJECT_PROGRESS.md` | this record |

No change to application logic, layouts, components, styles outside the one
`/lab/` page, scripts, workflows, dependencies, or any test.

### 1U.15 Remaining owner actions

| Item | Status |
|---|---|
| Safari on Apple hardware | **NOT TESTED — NOT AVAILABLE.** WebKit 26.5 tested directly |
| Screen-reader pass (NVDA / JAWS / VoiceOver) | **NOT TESTED — OWNER ACTION** if a formal a11y sign-off is ever wanted |
| Lighthouse | **NOT TESTED** — axe was the tool used |
| WCAG 2.5.8 touch-target adjudication | **MEASURED, NOT ADJUDICATED** (§1U.8) |
| OpenWeatherMap credential | **OPEN — EXTERNAL**, unchanged since M14 and not a site defect |

### 1U.16 Release decision

Every Phase 13 gate is met: all gates pass, no known critical security defect,
no known critical accessibility defect (0 axe violations), responsive verified
at eight widths and at both zoom modes, reduced motion verified by engine
emulation in three engines, cross-browser results recorded honestly with Safari
explicitly marked NOT TESTED, the pointer island compromises nothing,
production healthy, git clean, dependencies and workflows untouched.

**RELEASE APPROVED.**

### 1U.17 There is no M20

M19 is the final engineering milestone. The pipeline is verified end to end
(M18), the product is verified end to end (M19), and the remaining items are
either external (`OpenWeatherMap`), unavailable (`Safari`), or a formal
sign-off nobody has asked for (screen reader, Lighthouse). None of them is a
reason to keep the project open.

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

**9.4 Content verification session with Ayush. CYBERSECURITY COVERED IN M08; one decision now sits with the architect.** Timeline entries, tech lists and the cybersecurity section had to be confirmed line by line before entering V2. M08 ran that pass against source rather than against Ayush’s recollection — see §1H.8 for the item-by-item verdict on V1’s `journey.html`. Two V1 claims do not survive (“launched personal technology brand”, “learning advanced networking”) and the V1 identity line conflicts with the approved M03-A record. Neither has entered V2.

The finding that matters is not a copy correction: **every verifiable security claim in this archive is already published in another world**, and no certification, course, CTF placement, engagement, CVE or disclosure exists anywhere to fill the `labs` schema. CYBERSECURITY therefore has no content of its own. Whether it is held back as a stub, given new work, or folded into LEARNING and PROJECTS is an architect decision — §14.

Still uncovered by §9.4: CONTACT copy, which is small and unambiguous.

**9.5 Information architecture and URL scheme.** *M06 amendment: the AI world moved from `/ai` to `/ai-lab` when it was built (§1F.0). The eight-world list is otherwise unchanged, and the redirect map (R10) is still outstanding.*  The brief names 8 worlds; the site has 5 content pages. Confirm the final section list, the URL for each, and the redirect map for the 6 currently-indexed URLs (R10).

**9.6 GitHub Actions budget. Decided in M05 — and CORRECTED in M10: it has never run.** The cadence was implemented as recommended: `github-data.yml` every 6 hours plus on demand, `ci.yml` on every push to `v2`. Four scheduled runs a day at roughly twenty seconds each. **Neither workflow has ever executed.** `git ls-remote --heads origin` returns only `main`: the `v2` branch has never been pushed, so GitHub has never seen either file. The repository’s entire Actions history is seven `pages build and deployment` runs from `main` on 2026-08-08. The budget decision stands; the observation does not exist yet, and cannot until the branch is pushed (§1J.6, §14).

**9.7 YushaCyber. Still open, and now the most-linked thing on the site.** Four worlds reference it — LEARNING joined them in M08, where the platform is the evidence behind five register rows and all three re-implementation instances (§1H.5). Three worlds reference it — the PROJECTS record, the AI LAB system index and the GITHUB register, where its GitHub description claims "a thriving community" against a curated record that says it has no users (§1G.4).  Its "Explore" CTA is currently a disabled `#`. Is a real destination expected during V2, or does it remain GitHub-only?

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

## 14. Where the project actually stands, and the six steps left

**THE CUTOVER IS DONE.** Production served its first V2 response at
2026-08-24T13:16:17Z and every route has been verified over HTTP (§1O).

Of the six steps this section has tracked since M11, **four are closed**.
Two remain, plus one that arrived with the cutover itself. All three are
owner actions; none of them blocks the archive from working.

### 1. Switch the Pages source — BLOCKED on you, and now the ONLY blocker

> GitHub → **Settings** → **Pages** → **Build and deployment** → **Source** →
> change from *Deploy from a branch* to **GitHub Actions**.

Nothing deploys until this happens. Re-checked in M13-B:
`GET /repos/…/pages` returns **HTTP 404** unauthenticated, and that endpoint
needs a credential even on a public repository — so the 404 cannot distinguish
"not configured" from "configured but unreadable". No claim is made either way.

**Confirm it reads `GitHub Actions` before the merge.** If it still reads
*Deploy from a branch*, do not merge: the branch builder would try to serve
Astro source as a Jekyll site. If it reads *GitHub Actions* and the merge has
not happened, the site simply keeps serving the 2026-08-08 V1 build — which is
the state observed throughout M13.

### 2. Add a deploy workflow, and verify it on `v2` before merging — **DONE**

**Closed in M13-B (§1N).** `.github/workflows/deploy.yml`, commit `63bb423`,
pushed to `v2`. Observed passing on a real runner in **27 seconds**
(run `32706958024`): the `build` job succeeded on every step and produced a
183,453-byte `github-pages` artifact, and the `deploy` job was **skipped** by
its `if: github.ref == 'refs/heads/main'` guard — so the rehearsal provably did
not publish. CI stayed green alongside it (run `32706957981`, 31 s).

The draft written at the end of M13 was audited before pushing and was wrong in
four ways, one of which would have cut production over early. §1N.1 records all
four.

Still unrehearsed, unavoidably: `actions/deploy-pages` itself. There is no way
to test a deployment without deploying, so its first execution is the cutover.

### 3. Merge `v2` into `main` — **DONE**

**Merged `927477a`** on 2026-08-24, `--no-ff`, 93 files, 27,111 insertions,
**zero deletions**. `origin/main`: `41d4dc1` → `927477a`. Rollback is
`git revert -m 1 927477a` — a forward commit, no force-push needed.

`f42314e` went up with it as expected, and touched no V1 file.

`github-data.yml` **did** register: it now reads `state=active`. But it also
carried a defect across the merge — it still targets `ref: v2`. See step 7.

### 4. Observe Pages resolution order, then decide two redirects — **DONE: they stay off**

Observed on the real host (§1O.4): with no `about.html` deployed, `/about`
**301s to `/about/`** and the About world loads. `/about.html` and
`/contact.html` currently return V2's own 404.

That settles the safe half, not the contested half. Deploying the two stubs
would put a file and a directory in contention at the same URL — the exact
configuration M11 measured resolving to the *file*, which would loop `/about`
and `/contact` against their own redirects. Testing it requires deploying it,
so no proven Pages-safe mechanism exists.

**Decision: `LEGACY_ROUTES` stays as it is** — `work.html` only, the one stub
with no live route to shadow. Closed on evidence, not assumption.

### 5. Verify production — **DONE**, except the email, which is still yours

All verified live (§1O.3–§1O.7): custom domain, eight world routes, three
project records, `/work.html` → `/projects`, the orphans reaching V2's 404,
`sitemap.xml` and `robots.txt`, and — the one `.nojekyll` exists for —
**`/_astro/` assets loading with correct content types**. No V1 machinery, no
CDN, no Google Fonts, no `api.github.com`, no source maps, no credentials.
`www` 301s to the apex.

**Still yours: send one real email.** Open `/contact/`, use the published
address, and confirm the mailbox receives it. A static page and a link check
cannot prove delivery, and this document has never claimed otherwise.

### 6a. Turn on Enforce HTTPS — **DONE, VERIFIED (M14)**

Enabled by the owner and confirmed by request rather than by reading a setting:
`http://ayushrijal.com.np/` → **301** → `https://ayushrijal.com.np/` → **200**,
`ssl_verify=0`, certificate `CN=ayushrijal.com.np` (Let's Encrypt, valid to
2026-11-06). Enforcement is site-wide — `http://…/about/` redirects too — and
`www` folds to the apex over both schemes. Zero mixed content on any world.

### 6b. Point `github-data.yml` at `main` — **DONE (M14), execution still UNOBSERVED**

Changed in `7ce6e11`: `ref: v2` → `ref: main`, plus the two comments that would
otherwise have described the opposite behaviour. Schedule, `workflow_dispatch`,
permissions, concurrency, steps and data model all unchanged and asserted so
after editing.

**It has still never run — 0 executions, ever.** It could not be dispatched from
the build environment (`POST …/dispatches` → **401**, no `gh`, no token). Next
scheduled firing **2026-08-24T18:00:00Z**.

> Optional, if you want it proven sooner: GitHub → **Actions** → **GitHub
> data** → **Run workflow** on `main`. Then confirm it commits only when a
> repository fact actually moved, and that the resulting Pages deploy is green.

### 7. Revoke the OpenWeatherMap key — EXTERNAL

`Agriculture_simulator` still contains an exposed credential committed as a
string literal. Outside this repository, untouched, value never reproduced
here. Open since M05, and the oldest item in this document.

**OpenWeatherMap credential revocation remains an external manual action.** The
project is not fully security-clean while it stands.

### Deferred, deliberately

- **Favicon and `og:image`.** Both absent, both correct to be absent — no
  verified asset exists and inventing one would put the archive's only
  decorative image into its social preview. Post-cutover polish.
- **CYBERSECURITY.** ON HOLD, on the terms M09 set: hold as a stub, give it one
  real lab write-up, or fold it into the worlds that already carry the
  material. Its summary no longer overstates, so holding is stable.
- **A screen-reader pass and an axe run.** The two forms of accessibility
  evidence this project has never had. Everything claimed is measured in one
  browser or read from source, and §1L.6 says so.
- **Safari/WebKit.** Never tested; unavailable on the build machine.
- **The Jarvis markdown table's caption and `scope`** (§1L.6).
- **§9.7 — YushaCyber**, referenced from four worlds with no destination beyond
  a repository.

### Keep

`v1-final` stays until V2 has been stable in production for a week. Rollback is
one command for as long as it exists.

---

## 14A. M12 recommendation (M11 record, now complete)

M11 finished the engineering. `READY FOR FINAL CUTOVER` is the state; nothing
is deployed and nothing is merged. What remains is decisions and settings.

### Decisions, in the order they block things

**1. `/journey.html` and `/blog.html`.** The two V1 URLs with no V2
destination (§1K.1). `journey` was a timeline of claims, two of which M08 found
unsupported; `blog` has no successor. Both currently reach `/404.html`, which
names every sheet — a defensible answer, but it should be a chosen one.

**2. `/about.html` and `/contact.html`.** Destinations are known. Stubs are
NOT shipped because they would shadow the live routes and loop (§1K.1) — this
was measured, not predicted. Enabling them needs one observation: deploy to a
Pages preview and request `/about`. If the directory wins, both go back in
unchanged; if the file wins, they stay off.

**3. The three withheld contact channels** (§1K.3). A personal mobile and two
social accounts, all real, all public on V1, all held back on a judgement made
on your behalf. Default is KEEP WITHHELD and the build enforces it.

**4. Favicon and `og:image`.** Both absent. Both correct to be absent —
inventing card artwork would put the only decorative image on the site into its
social preview — and both visible to every visitor and every shared link.

**5. CYBERSECURITY.** Unchanged terms: hold it as a stub, give it one real lab
write-up, or fold it into the worlds that already carry the material. Its
summary no longer overstates (§1K.2), so holding is now a stable position
rather than a temporary one.

### Then, the cutover itself

1. **Push `v2`.** Nothing else can be observed until this happens. It is also
   what makes CI and `github-data.yml` run for the first time — watch both
   before going further, and confirm the scheduled snapshot job commits only
   when a repository fact has actually moved.
2. **Revoke the OpenWeatherMap key** in `Agriculture_simulator`. Oldest open
   item in this document, outside this repository, blocking nothing and
   waiting on nobody.
3. **Confirm DNS** for `ayushrijal.com.np`. Not verified from here.
4. **Add the deploy workflow** on `v2` and verify it builds. Then, and only
   then, switch the Pages source from the `main` branch to **GitHub Actions**
   — a repository setting the owner must change, in the same window as the
   merge, or the site serves a half-migrated tree.
5. **Merge `v2` into `main`** and let the workflow deploy.
6. **Verify in production:** the custom domain resolves; `/`, all eight world
   routes and the three project records serve; `/work.html` redirects to
   `/projects`; `/about.html` and the other orphans reach the 404; the sitemap
   and `robots.txt` are served; `/_astro/` assets load, which is what
   `.nojekyll` exists to guarantee.
7. **Send one real email** to the published address (§1K.14). The only
   end-to-end test the Contact world has.
8. **Keep `v1-final`** until V2 has been stable in production for a week.

### After cutover, when there is time

- **A screen-reader pass and an axe run.** The two forms of accessibility
  evidence this project has never had. Everything claimed so far is measured in
  one browser or reasoned from source, and §1K.12 says so explicitly.
- **Safari/WebKit.** Never tested; unavailable on the build machine.
- **§9.7 — YushaCyber.** Referenced from four worlds, and none can offer a
  destination beyond a repository.
- **Measure something on the AI Lab bench** (§1F.14.4). LEARNING §05 publishes
  five unmeasured results as open questions, which is a standing invitation to
  close one.

---

## 14B. M11 recommendation (M10 record, now complete)

M10 was the last engineering milestone. The archive is truthful, accessible,
secure, fast and reproducible; what stands between it and production is a set
of decisions, not code.

### Four decisions, in the order they block things

**1. `/journey.html` and `/blog.html`.** The two V1 URLs with no obvious V2
destination (§1J.9). `journey` was a timeline of claims, two of which M08 found
unsupported; `blog` has no successor at all. Until these are answered, the
redirect stubs cannot be written and the cutover cannot be scheduled.

**2. Push `v2`.** CI and `github-data.yml` have never run because the branch
they live on has never existed on the remote (§1J.6). Pushing is what makes
four milestones of workflow work observable — and it starts four scheduled
commits a day against the branch. Nothing else can be verified until it
happens.

**3. The AR-04 summary.** One string in `worlds.ts` tells the HOME index, the
`/cybersecurity` meta description and that page's own masthead that the archive
holds *"Defensive security research, lab write-ups and findings"*. It holds
none (§1H.8). Suggested replacement, in the register of the rest:

> *"Nothing is filed here yet. The security work this archive can show is in
> the field notebook and the workshop."*

That is the only claim in the whole build that M10's audit could not reconcile,
and it is thirty seconds of work once approved.

**4. The three withheld contact channels, and the email address** (§1J.2).
A personal mobile number and two social accounts, all real, all public on V1,
all held back on a judgement made on your behalf. And the published address
differs from your account address by one letter — worth confirming out loud
before the site starts pointing strangers at it.

### Then, in order

1. **Revoke the OpenWeatherMap key** in `Agriculture_simulator`. Oldest open
   item in this document, outside this repository, blocking nothing and
   waiting on nobody.
2. **Execute the cutover** as set out in §1J.9 — stubs, then a deploy workflow,
   then the Pages source switch, then the merge, in that order and in one
   window.
3. **Send one email to the published address.** The only end-to-end test the
   contact world has, and nothing in CI can do it.
4. **Decide the favicon and `og:image`** (§1J.8). Both absent, both correct to
   be absent today, both visible to every visitor and every shared link.
5. **The three tables under text-only 200%** (§1J.3). PROJECTS, AI LAB and
   LEARNING. The correct treatment is a scrollable region with an accessible
   name on each data table — a visible design change to three built worlds,
   which is why M10 stopped and measured instead of patching.
6. **CYBERSECURITY**, on the terms M09's §14 set out: hold it back as a stub,
   give it one real lab write-up, or fold it into the worlds that already carry
   the material.
7. **A screen-reader pass and an axe run.** The two forms of accessibility
   evidence this project has never had. Everything claimed so far is either
   measured in one browser or reasoned from source.

**Exit criteria for cutover:** all four decisions answered; stubs and deploy
workflow in place and verified on `v2`; a scheduled `github-data.yml` run
observed; the OpenWeatherMap key revoked; the custom domain serving V2 and the
six V1 URLs resolving to something deliberate. `v1-final` kept for a week.

---

## 14C. M10 recommendation (M09 record, now complete)

**M10 — CUTOVER PREPARATION, not another world.** Seven of eight worlds are
built. The eighth is blocked on a decision rather than on engineering, and the
things now standing between this branch and production are all infrastructure.

### Two decisions that are yours, not the implementation's

**1. CYBERSECURITY.** Unchanged from §14 as written in M08, and now the only
world left. §1H.8 found it has no content of its own: every verifiable security
claim in the archive is already published in LEARNING, PROJECTS or GITHUB, and
no certification, course, CTF placement, engagement, CVE or disclosure exists
to populate the `labs` schema. Three ways forward — hold it back as a stub, give
it new work (one real lab write-up), or fold it into the worlds that already
carry the material. Recommended: hold it back now, and treat the write-up as a
standing task for Ayush rather than a milestone.

**2. THE THREE HELD-BACK CONTACT CHANNELS** (§1I.1). A WhatsApp link containing
a personal mobile number, and two personal social accounts, are public on V1
and were not carried forward. That was a judgement made on your behalf and it
should be confirmed or reversed explicitly. Reversing it is three lines in
`lib/contact.ts` plus deleting the guard that documents why.

While you are there: **confirm the email address out loud once** (§1I.15.6).
The published value and the account address differ by one letter, and the site
is about to start pointing strangers at one of them.

### Then, in order

1. **Build the redirect map (R10).** Six V1 URLs — `/`, `/about`, `/work`,
   `/journey`, `/blog`, `/contact` — need destinations before `v2` can merge.
   `/work` → `/projects` and `/journey` → `/learning` are the two that need a
   decision rather than a rewrite; `/blog` has no destination at all. This is
   now the single largest piece of work between here and production, and it
   has been deferred since M02.
2. **Revoke the OpenWeatherMap key** in `Agriculture_simulator` (§1E.5, §1G.9,
   §1H.13, §1I.9). The oldest open item in this document, outside this
   repository, and not waiting on a milestone.
3. **Observe a scheduled `github-data.yml` run.** Unobserved since M05. The
   fallback path is still the only one that has ever been exercised, which
   means the happy path has been tested exactly once, by hand, four milestones
   ago.
4. **Fix the text-only 200% resize** (§1I.10). All seven built worlds overflow
   under `html { font-size: 32px }` at 320px, by 97–214px. It is a system-wide
   typography change — the fluid `clamp()` scale, the fixed `rem` grid columns
   and the `ch`-based measures interact — so it belongs in one deliberate pass
   over `tokens.css` and the world stylesheets, not in whichever world happens
   to be built next. Browser zoom is unaffected and already passes.
5. **Add a second browser.** Firefox at minimum. Six milestones of visual work
   have now been verified in Chrome alone, and the archive has since shipped a
   3D transform (`leaf`) and an animated `polygon()` clip-path (`transmit`).
6. **Send one email to the published address.** Nothing in CI can prove the
   contact page works. Thirty seconds, and it is the only end-to-end test this
   world has.
7. **Answer §9.7.** YushaCyber is referenced from four worlds and none can
   offer a destination beyond a repository.
8. **Measure something on the AI Lab bench** (§1F.14.4). LEARNING §05 now
   publishes the five unmeasured results as open questions, which raises the
   cost of leaving them unmeasured — the page names them.
9. **Then** tune the gate choreography across seven implemented entrances,
   which is the first time the whole set can be judged against one another.

**M10 exit criteria:** a written decision on CYBERSECURITY and on the held-back
channels; the redirect map complete and reviewed; the OpenWeatherMap key
revoked; a scheduled `github-data.yml` run observed; CI green including
`npm run test:github`. V1 still live and unmodified throughout.

---

## 14D. M09 recommendation (M08 record, now complete)

**M09 — CONTACT, and an architect decision about CYBERSECURITY.** Two worlds
remain and the §9.4 verification run during M08 changed which of them is
buildable.

### The decision that has to come first

**CYBERSECURITY has no content of its own.** §1H.8 checked every security claim
in the archive against source. Everything that survives is already published in
another world: the Bandit log in LEARNING §04, the lab content and the
simulated terminal in LEARNING §03 and the YushaCyber record, the two platform
security decisions in both. Nothing else exists — no certification, no course,
no CTF placement, no engagement, no CVE, no disclosure, no report. The `labs`
schema's `cve`, `authorisation` and `severity` fields have nothing to populate
them.

Built today, that world would either restate three others or fabricate, and
fabricating is what a security page under content pressure actually does. Three
ways forward, and this is the architect's call, not an engineering one:

1. **Hold it back.** Cut over with seven worlds and the eighth as a stub that
   says what it is waiting for. Honest, and the nav already renders it.
2. **Give it new work.** One real lab write-up — an environment, an
   authorisation, a finding, a fix — populates the schema and justifies the
   world. That is a task for Ayush, not for a milestone.
3. **Fold it in.** Retire the world and let LEARNING and PROJECTS carry the
   security work they already carry, which would take the archive to seven.

Recommended: **(1) now, (2) as the standing task.** It costs nothing, breaks no
URL, and leaves the door open. (3) is a bigger IA change than it looks — the
brief names eight worlds, and dropping one is an architectural decision.

### Then, in order

1. **Build CONTACT.** The smallest world left, its one overflow fix already
   landed in M05, and the only one whose content is unambiguous. `transmit` is
   the last unimplemented entrance.
2. **Revoke the OpenWeatherMap key** in `Agriculture_simulator` (§1E.5, §1G.9,
   §1H.13). Outstanding since M05, outside this repository, not waiting on a
   milestone. This is now the oldest open item in the document.
3. **Observe a scheduled `github-data.yml` run.** Also unobserved since M05,
   and the fallback path is now the only thing that has ever been exercised.
4. **Add a second browser.** Firefox at minimum. Five milestones of visual work
   have been verified in Chrome alone, and M08 shipped the archive's first 3D
   transform.
5. **Answer §9.7.** YushaCyber is referenced from four worlds now and none of
   them can offer a destination beyond a repository.
6. **Measure something on the AI Lab bench** (§1F.14.4). LEARNING §05 now
   *publishes* the five unmeasured results as open questions, which raises the
   cost of leaving them unmeasured — the page names them.
7. **Build the redirect map** (R10) before any cutover discussion.
8. **Then** tune the gate choreography across six implemented entrances.

**M09 exit criteria:** CONTACT built and reviewed; a written decision on
CYBERSECURITY; CI green including `npm run test:github`; a scheduled
`github-data.yml` run observed; the OpenWeatherMap key revoked. V1 still live
and unmodified throughout.

---

## 14E. M08 recommendation (M07 record, now complete)

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

## 14F. M07 recommendation (M06 record, now complete)

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

## 14G. M06 recommendation (M05 record, now complete)

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

## 14H. M03 recommendation (M02 record, now complete)

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

## 14I. M02 recommendation (M01 record, now complete)

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

*End of M12 — FINAL CUTOVER READY, MANUAL ACTIONS REMAIN. V2 is built, verified and pushed; `origin/v2` is `0ad99ef` and CI passed on a real GitHub runner in 24 seconds — the first observed workflow execution in this project. Production has NOT been cut over and still serves V1: switching the Pages source is a repository setting no credential in this environment can reach. `main` is untouched, V1 is byte-identical, nothing is merged. Six actions remain, four of them only the owner can perform, set out in §14 — including revoking the exposed OpenWeatherMap credential, which is external and still open. Do not begin CYBERSECURITY, do not redesign a built world, and do not merge until the architect approves the cutover.*
