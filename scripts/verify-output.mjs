/**
 * Build-output assertions.
 *
 * These check things a type-checker and a successful build cannot: that the
 * shipped HTML still contains what the architecture promises. Every assertion
 * here exists because the failure it catches is SILENT — the build stays green
 * and the page looks fine to whoever changed it.
 *
 * Run by `npm run verify`, and by CI through the same command, so a local
 * check and a CI check can never drift apart.
 *
 * Node-only, no dependencies. Repo-root script, not client code — which is why
 * it lives in `scripts/` rather than `src/scripts/`.
 */

import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';

/** The eight approved worlds. Removing a route should fail the build. */
const WORLDS = [
  ['index.html', 'home'],
  ['about/index.html', 'about'],
  ['projects/index.html', 'projects'],
  ['ai-lab/index.html', 'ai-lab'],
  ['cybersecurity/index.html', 'cybersecurity'],
  ['learning/index.html', 'learning'],
  ['github/index.html', 'github'],
  ['contact/index.html', 'contact'],
];

const failures = [];
const fail = (message) => failures.push(message);

const read = (relative) => {
  try {
    return readFileSync(join(DIST, relative), 'utf8');
  } catch {
    return null;
  }
};

/**
 * A page with its `<style>` and `<script>` contents removed.
 *
 * Every check that looks for a CLAIM has to run against this rather than
 * against the raw file, because Astro inlines the stylesheet under
 * `assetsInlineLimit` and a `@keyframes` block is full of `0%` and `100%`.
 * A "no percentage on this page" assertion measured against the raw HTML is
 * either permanently failing or, worse, quietly special-cased until it is
 * permanently passing.
 *
 * Found in M08 while adding the LEARNING guards, and it was the second half of
 * a pair: sixteen `\b` word boundaries in this file and two in
 * `test-github.mjs` had been written as literal U+0008 BACKSPACE bytes by a
 * shell that interpreted the escape before Node ever saw it. Every pattern
 * containing one — the whole AI Lab fabricated-metric set, the GitHub
 * percentage and activity guards, and one of the credential patterns — had
 * been inert since the milestone that added it, and reported as passing.
 * Both classes of defect share a cause: a check that CANNOT fire looks exactly
 * like a check that has nothing to report. Anything added here should be
 * negative-tested against a planted violation before it is believed.
 */
const prose = (html) =>
  html
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');

// ── 1. Every world still builds ────────────────────────────────────────────
for (const [file, id] of WORLDS) {
  const html = read(file);
  if (html === null) {
    fail(`Missing route: /${file.replace(/index\.html$/, '')} (world "${id}")`);
    continue;
  }
  if (!html.includes(`data-world="${id}"`)) {
    fail(`${file} does not identify itself as world "${id}"`);
  }
}

// ── 2. The no-JS fallbacks are still in the static HTML ────────────────────
// Both islands hide a real element and replace it. If the real element stops
// being rendered, the page still looks correct with JS on and is empty
// without it — which no test that runs a browser with JS would ever catch.
const home = read('index.html');
if (home) {
  if (!/<h1[^>]*class="wordmark__fallback"/.test(home)) {
    fail('Home lost its no-JS <h1> wordmark heading');
  }
  if (!home.includes('class="standfirst"')) {
    fail('Home lost its no-JS standfirst paragraph');
  }
  if (!home.includes('I build, experiment, break, and learn.')) {
    fail('Home lost the verbatim philosophy statement');
  }
}

// ── 2b. ABOUT still carries the verified record, verbatim ──────────────────
// The whole point of ABOUT is that every claim on it is a quotation from
// `lib/profile.ts`. A refactor that turned a statement into a paraphrase, or
// dropped one, would leave a page that still looks finished — which is exactly
// the failure this project exists to prevent (PROJECT_PROGRESS §9.4, K6).
const about = read('about/index.html');
if (about) {
  const mustSay = [
    'Ayush Rijal',
    'I build, experiment, break, and learn.',
    'Lincoln University',
    'blindly accepting the output',
    'break systems and then build them more securely',
    'my work is remembered',
  ];
  for (const claim of mustSay) {
    if (!about.includes(claim)) {
      fail(`About lost a verified statement: "${claim}"`);
    }
  }
  if (!/<h1[^>]*class="[^"]*subject__name/.test(about)) {
    fail('About lost its <h1> subject record');
  }
}

// ── 2d. PROJECTS — routes, the two layers, and the fabrication guards ──────
// The Projects world makes claims about real software. These assertions guard
// the three ways those claims could quietly become false.
const PROJECT_SLUGS = ['yushacyber', 'jarvis-assistant', 'agrovision-nepal'];

const projectsIndex = read('projects/index.html');
if (projectsIndex) {
  for (const slug of PROJECT_SLUGS) {
    if (!projectsIndex.includes(`/projects/${slug}`)) {
      fail(`The projects register does not link /projects/${slug}`);
    }
  }
  // The register is a real table. If it degrades to a list of cards, the
  // world has lost the grammar the milestone was built around.
  if (!/<table class="register"/.test(projectsIndex)) {
    fail('The projects register is no longer a table');
  }
}

for (const slug of PROJECT_SLUGS) {
  const html = read(`projects/${slug}/index.html`);
  if (html === null) {
    fail(`Missing project record: /projects/${slug}`);
    continue;
  }
  // Every record must carry a source link. A project claim with no repository
  // to check it against is exactly what this site exists not to publish.
  if (!/href="https:\/\/github\.com\/ayushrijal83-ops\//.test(html)) {
    fail(`/projects/${slug} has no repository link`);
  }
  // Unique metadata per record, not the world's own description repeated.
  if (html.includes(`content="${'Engineering work, in build order'}"`)) {
    fail(`/projects/${slug} reuses the world description instead of its own`);
  }
}

// The AgroVision guard, which is the reason the `roadmap` field exists: these
// claims have no implementation in that repository, and may appear on the page
// ONLY inside the struck-through roadmap block rendered after this marker.
//
// M05 narrowed the list. It was seeded from the README's "Future Improvements"
// section, which turned out to be stale against the README's own repository:
// `/weather-check` calls OpenWeatherMap and `/register` hashes a password, so
// two entries were guarding against publishing things that were already built.
// Reading a roadmap instead of the source got the direction of the error
// backwards — the guard was enforcing an understatement. Verify against code.
const agro = read('projects/agrovision-nepal/index.html');
if (agro) {
  const marker = 'Not built';
  const split = agro.indexOf(marker);
  if (split === -1) {
    fail('AgroVision lost its "Not built" roadmap block — see content.config.ts');
  } else {
    const beforeRoadmap = agro.slice(0, split);
    for (const claim of ['disease detection', 'Fertilizer', 'fertiliser']) {
      if (beforeRoadmap.includes(claim)) {
        fail(
          `AgroVision presents "${claim}" as built. There is no implementation ` +
            `of it in the repository — it belongs in the roadmap block.`,
        );
      }
    }
  }
}

// ── 2g. AI LAB — the two claims the world is built on ──────────────────────
// This world's whole argument is that it does not overstate. Both of the
// things it refuses to overstate are invisible failures: a page that quietly
// starts claiming a trained model, or one that quietly acquires a metric,
// looks BETTER than the honest version and reads as an improvement to whoever
// made the change. Neither would fail a build without this.
const aiLab = prose(read('ai-lab/index.html') ?? '') || null;
if (aiLab) {
  // The provenance table exists and the world still states its central claim.
  // If a model IS ever trained here, this fails — correctly: that is a change
  // to what the world asserts, and it should not pass silently.
  if (!/<table class="provenance"/.test(aiLab)) {
    fail('AI Lab lost the model provenance table — see the M06 record §1F.5');
  } else if (!aiLab.includes('Nothing here was trained')) {
    fail('AI Lab no longer states that no model was trained');
  }

  // No fabricated measurement. The brief for this world forbids inventing
  // accuracy, loss, dataset sizes and benchmark figures, and none were taken —
  // so a metric appearing here did not come from an experiment.
  const FABRICATED = [
    /\b\d+(?:\.\d+)?\s*%\s*(?:accuracy|precision|recall|f1)\b/i,
    /\b(?:accuracy|precision|recall|f1[- ]score)\s*[:=]\s*\d/i,
    /\bloss\s*[:=]\s*\d/i,
    /\b\d+\s*epochs?\b/i,
    /\btrained\s+on\s+[\d,]+\s/i,
  ];
  for (const pattern of FABRICATED) {
    const hit = aiLab.match(pattern);
    if (hit) {
      fail(
        `AI Lab reports a measurement that was never taken: "${hit[0]}". ` +
          `No model here was trained or evaluated — see station 07.`,
      );
    }
  }

  // The honest-absence path must still render. Every experiment states a
  // result, and the ones that were never instrumented say so; if that stops
  // appearing, either the records were quietly given numbers or the field
  // stopped rendering, and both matter.
  if (!/not measured|Result not documented/i.test(aiLab)) {
    fail('AI Lab no longer records an unmeasured result — the honest-absence path is gone');
  }

  // Every pipeline is a list, not a drawing. The accessibility property this
  // world was built around: no important information reachable only via SVG.
  if (aiLab.includes('<svg')) {
    fail('AI Lab shipped an SVG — its diagrams must stay lists (see Pipeline.astro)');
  }
}

// ── 2h. GITHUB — the archive is complete, and claims no proportion ─────────
// This world's claim is that it lists everything public. Two ways that stops
// being true without anyone noticing: a repository quietly stops appearing,
// or a measurement that was never taken quietly appears.
const ghWorld = prose(read('github/index.html') ?? '') || null;
if (ghWorld) {
  // Every repository in the snapshot must be on the page. Read from the
  // snapshot rather than from a hardcoded list, so adding a repository cannot
  // silently fail to reach the archive — which is the exact failure mode the
  // old EXCLUDED_REPOS list made invisible.
  let snapshot = null;
  for (const source of ['src/data/github.generated.json', 'src/data/github.snapshot.json']) {
    try {
      snapshot = JSON.parse(readFileSync(source, 'utf8'));
      break;
    } catch {
      // Absent on a clean checkout; the loop falls through to the committed one.
    }
  }

  if (snapshot?.repos?.length) {
    const expected = snapshot.repos.filter((r) => !r.fork);
    for (const repo of expected) {
      if (!ghWorld.includes(repo.url)) {
        fail(
          `The GitHub archive does not list ${repo.name}. Every public ` +
            `non-fork repository must appear — see REPO_KIND in lib/github.ts.`,
        );
      }
    }
    if (!ghWorld.includes(`${expected.length} repositories`)) {
      fail(
        `The GitHub archive does not state its own holding count ` +
          `(${expected.length}). The count is what makes the list checkable.`,
      );
    }
  }

  // The profile is the source of record and must be reachable from the world.
  if (!/href="https:\/\/github\.com\/ayushrijal83-ops"/.test(ghWorld)) {
    fail('The GitHub archive has no link to the profile it is an archive of');
  }

  // No proportion. The snapshot holds one primary language per repository and
  // no byte counts, so any percentage on this page is a measurement of
  // something that was never taken.
  const proportion = ghWorld.match(/\b\d+(?:\.\d+)?\s*%/);
  if (proportion) {
    fail(
      `The GitHub archive reports a percentage ("${proportion[0]}"). No ` +
        `proportion is measurable from this snapshot — see folio 03.`,
    );
  }
  // Activity claims the snapshot cannot support. These patterns match a
  // CLAIM, never a mention: folio 05 names commit counts, streaks and
  // contributions as things this record does not contain, and must keep being
  // able to say so. An exception clause keyed on that disclaimer would have
  // made the whole check inert the moment the disclaimer shipped.
  const INVENTED_ACTIVITY = [
    /\b\d[\d,]*\s*commits?\b/i,
    /\b\d+[-\s]day\s+streak\b/i,
    /\b\d[\d,]*\s*contributions?\b/i,
    /contributions?\s+in\s+the\s+last\s+year/i,
  ];
  for (const pattern of INVENTED_ACTIVITY) {
    const hit = ghWorld.match(pattern);
    if (hit) {
      fail(
        `The GitHub archive claims "${hit[0]}". The snapshot carries no ` +
          `commit or contribution data — see folio 05.`,
      );
    }
  }

  // The fallback state's copy must survive, because it is the only thing a
  // visitor sees when the data is gone. Asserted in the source rather than the
  // output, since the healthy build never renders it.
  const page = readFileSync('src/pages/github.astro', 'utf8');
  if (!page.includes('Repository data unavailable')) {
    fail('The GitHub world lost its designed unavailable state');
  }
}

// ── 2e. GitHub data is build-time only ─────────────────────────────────────
// The single most important property of the GitHub integration: V1 called the
// API from the visitor's browser. If that ever returns, it returns silently —
// the page still works, on someone else's rate limit and origin.
for (const page of globSync(`${DIST}/**/*.html`)) {
  const html = readFileSync(page, 'utf8');
  if (html.includes('api.github.com')) {
    fail(`${page} references api.github.com — GitHub data must be build-time only`);
  }
}

// ── 2f. No credential reaches the output ───────────────────────────────────
// The GitHub integration hands a token to a build process (K4). Every design
// decision around it — the field allow-list in `fetch-github.mjs`, the static
// output with no request-time runtime — exists so a credential cannot reach a
// visitor. This asserts the outcome rather than trusting the design, because
// a leaked token is the one failure here that cannot be taken back once the
// bytes are published.
//
// Scans every shipped file, not just HTML: a token pasted into a JSON data
// file or a stylesheet comment ships exactly as far as one in a page.
const CREDENTIAL_PATTERNS = [
  // GitHub's own formats. Classic PATs, fine-grained PATs, OAuth, app and
  // refresh tokens, and the runner's own `GITHUB_TOKEN`, all of which carry a
  // documented prefix precisely so that scanners like this one can find them.
  [/gh[pousr]_[A-Za-z0-9]{16,}/, 'a GitHub token'],
  [/github_pat_[A-Za-z0-9_]{20,}/, 'a fine-grained GitHub PAT'],
  // The header the token would travel in, in case a fetch response were ever
  // serialised into the output wholesale.
  [/Authorization:\s*(?:Bearer|token)\s+\S/i, 'an Authorization header'],
  // Generic assignments. Deliberately narrow — a value of 16+ characters
  // assigned to something spelled like a secret. `--token-colour: #fff` and
  // `data-secret="1"` do not match; a real key does.
  [/\b(?:api[_-]?key|secret|password|access[_-]?token)\b["'\s:=]{1,4}["']?[A-Za-z0-9_\-]{16,}/i,
    'a credential-shaped assignment'],
];

for (const file of globSync(`${DIST}/**/*.{html,js,css,json,xml,txt,svg}`)) {
  const text = readFileSync(file, 'utf8');
  for (const [pattern, what] of CREDENTIAL_PATTERNS) {
    const hit = text.match(pattern);
    if (hit) {
      // The match is NOT printed. If this ever fires for real, echoing the
      // secret into a CI log — which is public on a public repository — would
      // publish it a second time, and CI logs outlive a force-push.
      fail(`${file} contains ${what} (offset ${hit.index}). Nothing is printed.`);
    }
  }
}

// ── 2c. Every world's stock still clears the ink ramp at WCAG AA ───────────
// M04 opened the MATERIAL slot of the world channel: a world may choose its
// own `--paper`. The ink ramp's floor IS the AA threshold, and it was derived
// against the global paper — so a world that darkens its stock silently drops
// four text colours below 4.5:1 with nothing in the build to notice.
//
// Read from the source tokens rather than the built CSS: this is a statement
// about the design system, and it should fail whether or not the offending
// world has a page yet.
const srgb = (channel) =>
  channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;

const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => srgb(parseInt(hex.slice(i, i + 2), 16) / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** Pulls `--name: #rrggbb;` out of a CSS block. */
const hexVars = (css) =>
  Object.fromEntries(
    [...css.matchAll(/(--[\w-]+):\s*(#[0-9a-f]{6})\s*;/gi)].map((m) => [m[1], m[2]]),
  );

const tokensCss = readFileSync('src/styles/tokens.css', 'utf8');
const worldsCss = readFileSync('src/styles/worlds.css', 'utf8');

/** The first `:root { … }` block, up to the closing brace in column 1. */
const globals = hexVars(tokensCss.split(':root {')[1].split(/^\}/m)[0]);
const INK_RAMP = ['--ink', '--ink-secondary', '--ink-tertiary', '--ink-faint'];
const AA = 4.5;

/** Every `[data-world='x'] { … }` declaration block, plus the global default. */
const stocks = [['(global)', globals['--paper']]];
for (const match of worldsCss.matchAll(/\[data-world='([\w-]+)'\]\s*\{([^}]*)\}/g)) {
  const paper = hexVars(match[2])['--paper'];
  if (paper) stocks.push([match[1], paper]);
}

for (const [world, paper] of stocks) {
  for (const step of INK_RAMP) {
    const ratio = contrast(globals[step], paper);
    if (ratio < AA) {
      fail(
        `World "${world}" stock ${paper}: ${step} measures ${ratio.toFixed(2)}:1, ` +
          `below WCAG AA (${AA}:1). See the MATERIAL slot note in tokens.css.`,
      );
    }
  }
}

// ── 3. No inline scripts — the CSP blocks them ─────────────────────────────
// `script-src 'self'` rejects inline scripts, and Astro inlines any client
// script bundling under 4 KB. The browser drops it with no error and the page
// silently does nothing. astro.config.mjs disables script inlining; this
// asserts the config is actually in effect, because the failure is invisible.
const pages = globSync(`${DIST}/**/*.html`);
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  if (/<script(?![^>]*\bsrc=)[^>]*>\s*\S/.test(html)) {
    fail(`Inline script in ${page} — blocked by the CSP at runtime`);
  }
}

// ── 3b. Every id on a page is unique ───────────────────────────────────────
// A duplicate id is invalid HTML, and worse than that it is AMBIGUOUS: a skip
// link, an `aria-labelledby`, a `<label for>` or a fragment link resolves to
// whichever copy came first, silently and forever.
//
// Added in M08 after the regression sweep found `id="what-i-learned"` twice on
// /ai-lab — two experiment bodies, the same markdown heading, both slugged by
// Astro. It had shipped since M06 and nothing noticed, because the page looks
// exactly the same either way. Fixed at the source in astro.config.mjs; this
// asserts the outcome for every page, including the ones nobody is thinking
// about when they add the next markdown file.
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const seen = new Set();
  const twice = new Set();
  for (const [, id] of html.matchAll(/\sid="([^"]+)"/g)) {
    if (seen.has(id)) twice.add(id);
    seen.add(id);
  }
  if (twice.size > 0) {
    fail(`Duplicate id in ${page}: ${[...twice].join(', ')}`);
  }
}

// ── 4. No third-party origins ──────────────────────────────────────────────
// The whole supply-chain posture (docs/SECURITY.md §2) depends on there being
// no runtime origin but our own.
//
// M08 rewrote this. It used to match every `src=` and `href=` and then exempt
// anything starting `href="https://github.com/`, which got two things wrong in
// opposite directions: an external STYLESHEET on github.com would have passed
// (it is a resource, and the exemption did not care), and adding an outbound
// LINK to any other site failed the build (it is not a resource, and the
// allowlist did not know). A hostname allowlist on a supply-chain check is the
// wrong shape — it teaches you to widen it, which is how it stops working.
//
// So the two cases are now separated by what they actually are:
//   RESOURCES the page loads    — no third-party origin, ever.
//   ANCHORS the visitor clicks  — any origin, but they must be safe links.
const RESOURCE_PATTERNS = [
  [/\bsrc="https?:\/\/[^"]+"/g, 'src'],
  [/\bsrcset="[^"]*https?:\/\/[^"]*"/g, 'srcset'],
  [/<link\b[^>]*\bhref="https?:\/\/[^"]+"/g, '<link href>'],
  [/url\(\s*['"]?https?:\/\//g, 'CSS url()'],
];

for (const page of pages) {
  const html = readFileSync(page, 'utf8');

  for (const [pattern, what] of RESOURCE_PATTERNS) {
    const hit = html
      .match(pattern)
      ?.filter((m) => !m.includes('//ayushrijal.com.np'));
    if (hit?.length) {
      fail(`Third-party ${what} in ${page}: ${hit[0]}`);
    }
  }

  // Outbound links are allowed anywhere, but never as a bare target: an
  // external anchor without `noopener` hands the opened page a handle on this
  // one, and without `noreferrer` it leaks the visitor's path through the
  // archive. Both were verified by hand in M07; this is that check, kept.
  for (const anchor of html.match(/<a\b[^>]*\bhref="https?:\/\/[^"]+"[^>]*>/g) ?? []) {
    if (anchor.includes('//ayushrijal.com.np')) continue;
    const rel = anchor.match(/\brel="([^"]*)"/)?.[1] ?? '';
    if (!rel.includes('noopener') || !rel.includes('noreferrer')) {
      const href = anchor.match(/\bhref="([^"]+)"/)?.[1];
      fail(`External link without rel="noopener noreferrer" in ${page}: ${href}`);
    }
  }
}

// ── 5. Pretext has not come back ───────────────────────────────────────────
// M03-B.1 removed `@chenglou/pretext` after measuring that the composition it
// was approved for did not exist in the finished page (docs §1C.1). The risk
// is not that someone re-adds it deliberately — it is that an import added for
// a lab page pulls 44.8 KB back into `dist/` where nobody looks for it. This
// asserts the outcome, not the intention: no shipped byte mentions it, and the
// manifest does not list it.
const manifest = JSON.parse(readFileSync('package.json', 'utf8'));
for (const field of ['dependencies', 'devDependencies']) {
  if (manifest[field]?.['@chenglou/pretext']) {
    fail(`@chenglou/pretext is back in package.json ${field} — see docs §1C.1`);
  }
}
for (const asset of globSync(`${DIST}/**/*.{js,css}`)) {
  if (readFileSync(asset, 'utf8').includes('@chenglou/pretext')) {
    fail(`Pretext code shipped in ${asset}`);
  }
}

// ── Report ─────────────────────────────────────────────────────────────────
if (failures.length > 0) {
  console.error('\nBuild output verification FAILED:\n');
  for (const message of failures) console.error(`  ✗ ${message}`);
  console.error('');
  process.exit(1);
}

console.log(
  `Build output verified: ${WORLDS.length} worlds, no-JS fallbacks intact, ` +
    `About record verbatim, ${PROJECT_SLUGS.length} project records with sources, no credentials, ` +
    `AI Lab claims no training and no metrics, ` +
    `GitHub archive complete with no invented proportion, ` +
    `${stocks.length} world stocks clear WCAG AA, ` +
    `no inline scripts, no third-party origins, no Pretext ` +
    `(${pages.length} pages).`,
);
