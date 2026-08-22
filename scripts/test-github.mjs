/**
 * The two safety properties of the GitHub integration, tested by breaking it.
 *
 * Both of these are claims the architecture makes about what happens when
 * something goes wrong, and neither can be observed on a healthy build — a
 * fallback that never fires and a scanner that never fires look identical to
 * one that does not work. So this script causes the failures on purpose:
 *
 *   1. FALLBACK — with no GitHub data on disk at all (the worst case: the API
 *      is down AND the committed snapshot is gone), the Projects world must
 *      still build, still list every record, and say plainly that the facts
 *      are unavailable rather than rendering a blank or a zero.
 *
 *   2. SECRET ISOLATION — a credential planted in the build output must fail
 *      `verify-output.mjs`, and the failure must not echo the credential.
 *
 * The M02 loader bug is why this exists. `loadGitHubSnapshot` resolved its
 * paths against the bundle rather than the working directory and therefore
 * always returned null — and because "no data" is a legitimate designed state,
 * the pages looked exactly the same as if it had worked. Nothing short of
 * deliberately removing the data would have caught it.
 *
 * Not run by `npm run verify`: it rebuilds twice and deliberately fails a
 * gate. Run it with `npm run test:github` when the integration changes.
 *
 * Node-only, no dependencies, no framework — assertions and a process exit.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';

const SNAPSHOT = 'src/data/github.snapshot.json';
const GENERATED = 'src/data/github.generated.json';
const HIDDEN = (path) => `${path}.hidden-by-test`;

const results = [];
const check = (label, condition) => {
  results.push([label, Boolean(condition)]);
};

/** Runs a command, returning its output and exit code rather than throwing. */
const run = (command, args) => {
  try {
    return { code: 0, out: execFileSync(command, args, { encoding: 'utf8', stdio: 'pipe' }) };
  } catch (error) {
    return {
      code: error.status ?? 1,
      out: `${error.stdout ?? ''}${error.stderr ?? ''}`,
    };
  }
};

const build = () => run(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build']);

// ── 1. The fallback, with nothing to fall back to ──────────────────────────
// Both data files are moved aside rather than deleted, and restored in the
// `finally` below, so an interrupted run cannot lose the committed snapshot.
const hidden = [SNAPSHOT, GENERATED].filter(existsSync);
for (const path of hidden) renameSync(path, HIDDEN(path));

try {
  const built = build();
  check('the site builds with no GitHub data at all', built.code === 0);

  if (built.code === 0) {
    const index = readFileSync('dist/projects/index.html', 'utf8');
    check('the register still renders', index.includes('<table class="register"'));
    for (const slug of ['yushacyber', 'jarvis-assistant', 'agrovision-nepal']) {
      check(`${slug} is still listed`, index.includes(`/projects/${slug}`));
    }
    // The point of the designed null state: the page SAYS the data is missing.
    // An empty cell or a zero would be the page quietly inventing a fact.
    check(
      'the index declares the data unavailable',
      index.includes('Repository data unavailable') && index.includes('Unavailable'),
    );

    const record = readFileSync('dist/projects/yushacyber/index.html', 'utf8');
    check('a record still renders its narrative', record.includes('fourteen'));
    check('a record declares its facts unavailable', record.includes('facts__unavailable'));
    // No fabricated figures anywhere. `0 stars` from a missing snapshot would
    // be a lie the page had no way of knowing it was telling.
    check('no fabricated star count', !/\b0\s*(?:stars?|★)/i.test(record));

    // The GITHUB world is the hardest case: it has no curated layer to fall
    // back on. Every word on it comes from the snapshot, so with no snapshot
    // it must render its designed unavailable state rather than an empty
    // register — which would read as "this person has no public code", the
    // opposite of true and the worst thing this world could accidentally say.
    const archive = readFileSync('dist/github/index.html', 'utf8');
    check('the archive still builds and titles itself', archive.includes('Public Code Archive'));
    check(
      'the archive declares the data unavailable',
      archive.includes('Repository data unavailable'),
    );
    check(
      'the archive still reaches the profile',
      archive.includes('https://github.com/ayushrijal83-ops'),
    );
    check('the archive shows no empty register', !archive.includes('<table class="holdings"'));
    check('the archive claims no holdings it cannot list', !/0 repositories/.test(archive));
  }
} finally {
  for (const path of hidden) renameSync(HIDDEN(path), path);
}

// Rebuild with the real data back, so `dist/` is left in a truthful state
// whatever happened above.
check('the site rebuilds with the data restored', build().code === 0);

// ── 2. A planted credential fails the gate, and is not echoed ──────────────
// The value below is a syntactically valid but revoked-by-construction shape,
// never a real token. It exists only to be found.
const CANARY = `ghp_${'0'.repeat(36)}`;
const PLANTED = 'dist/planted-by-test.json';

writeFileSync(PLANTED, JSON.stringify({ token: CANARY }), 'utf8');
try {
  const gate = run(process.execPath, ['scripts/verify-output.mjs']);
  check('a planted credential fails verification', gate.code !== 0);
  check('the failure names the file', gate.out.includes('planted-by-test.json'));
  // The whole reason the scanner prints an offset instead of a match: a CI log
  // on a public repository is published output too.
  check('the failure does not print the credential', !gate.out.includes(CANARY));
} finally {
  rmSync(PLANTED, { force: true });
}

// ── Report ─────────────────────────────────────────────────────────────────
const failed = results.filter(([, ok]) => !ok);
for (const [label, ok] of results) console.log(`  ${ok ? '✓' : '✗'} ${label}`);

if (failed.length > 0) {
  console.error(`\nGitHub integration test FAILED: ${failed.length} of ${results.length}.\n`);
  process.exit(1);
}
console.log(`\nGitHub integration verified: ${results.length} assertions.`);
