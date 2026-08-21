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

// ── Report ─────────────────────────────────────────────────────────────────
if (failures.length > 0) {
  console.error('\nBuild output verification FAILED:\n');
  for (const message of failures) console.error(`  ✗ ${message}`);
  console.error('');
  process.exit(1);
}

console.log(
  `Build output verified: ${WORLDS.length} worlds, no-JS fallbacks intact, ` +
    `no inline scripts, no third-party origins (${pages.length} pages).`,
);
