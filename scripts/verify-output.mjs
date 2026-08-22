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
  ['ai/index.html', 'ai'],
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
  [/(?:api[_-]?key|secret|password|access[_-]?token)["'\s:=]{1,4}["']?[A-Za-z0-9_\-]{16,}/i,
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

// ── 4. No third-party origins ──────────────────────────────────────────────
// The whole supply-chain posture (docs/SECURITY.md §2) depends on there being
// no runtime origin but our own.
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const external = html.match(/(?:src|href)="https?:\/\/(?!ayushrijal\.com\.np)[^"]+"/g);
  const offending = (external ?? []).filter(
    // Anchor targets are links a visitor clicks, not resources the page loads.
    (match) => !match.startsWith('href="https://github.com/'),
  );
  if (offending.length > 0) {
    fail(`Third-party resource in ${page}: ${offending[0]}`);
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
    `${stocks.length} world stocks clear WCAG AA, ` +
    `no inline scripts, no third-party origins, no Pretext ` +
    `(${pages.length} pages).`,
);
