/**
 * BUILD-TIME GITHUB RETRIEVAL
 * ============================================================================
 * Fetches public repository metadata and writes it where `lib/github.ts`
 * expects to find it. This is the implementation of the pipeline that module
 * has described since M02 (PROJECT_PROGRESS §8.3):
 *
 *   this script (locally, or on a CI runner)
 *     └─ src/data/github.generated.json      ← gitignored, fresh
 *          └─ lib/github.ts at build time
 *               └─ static HTML with the facts baked in
 *
 * Three properties this design has to keep, all of them security or
 * reliability properties rather than preferences:
 *
 *   1. NOTHING RUNS IN THE VISITOR'S BROWSER. V1 called the GitHub API from
 *      the client, which shared a 60-req/hr unauthenticated limit across
 *      everyone behind a NAT and put the whole feature at the mercy of a
 *      third-party origin at page load. The data is baked in at build time.
 *   2. NO CREDENTIAL REACHES THE OUTPUT. A token, if present, is used only to
 *      raise this process's rate limit. Only the fields listed in `normalise`
 *      are written, so a token can never be echoed into JSON by accident.
 *   3. FAILURE IS NEVER FATAL. This script is not part of `npm run build`.
 *      If it never runs, or fails, the build reads the committed snapshot at
 *      `src/data/github.snapshot.json` instead and the site is complete. That
 *      is the difference between an integration and a fragile deployment
 *      dependency.
 *
 * Usage:
 *   node scripts/fetch-github.mjs                 → writes generated.json
 *   node scripts/fetch-github.mjs --promote       → also updates the committed
 *                                                   snapshot (a deliberate act)
 *
 * Node-only, zero dependencies: Node 22 has global `fetch`.
 */

import { writeFileSync, copyFileSync } from 'node:fs';

const LOGIN = process.env.GITHUB_LOGIN ?? 'ayushrijal83-ops';
const TOKEN = process.env.GITHUB_TOKEN;
const GENERATED = 'src/data/github.generated.json';
const SNAPSHOT = 'src/data/github.snapshot.json';

const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': `${LOGIN}-site-build`,
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

/**
 * Only these fields cross into the output. An allow-list rather than a
 * spread: the API response carries owner objects, URLs and permission blocks
 * that have no business in a public static file.
 */
const normalise = (repo) => ({
  name: repo.name,
  description: repo.description ?? null,
  url: repo.html_url,
  language: repo.language ?? null,
  stars: repo.stargazers_count ?? 0,
  forks: repo.forks_count ?? 0,
  pushedAt: repo.pushed_at,
  createdAt: repo.created_at,
  topics: Array.isArray(repo.topics) ? repo.topics : [],
  archived: Boolean(repo.archived),
  fork: Boolean(repo.fork),
});

async function main() {
  const url = `https://api.github.com/users/${LOGIN}/repos?per_page=100&sort=pushed`;
  const response = await fetch(url, { headers });

  if (!response.ok) {
    // Non-zero exit so a human notices, but the caller (CI) is expected to
    // continue anyway — the committed snapshot is still there.
    console.error(
      `GitHub fetch failed: ${response.status} ${response.statusText}. ` +
        `The build will fall back to ${SNAPSHOT}.`,
    );
    process.exit(1);
  }

  const payload = await response.json();
  if (!Array.isArray(payload)) {
    console.error('Unexpected GitHub response shape; leaving the snapshot alone.');
    process.exit(1);
  }

  const snapshot = {
    version: 1,
    generatedAt: new Date().toISOString(),
    login: LOGIN,
    repos: payload.map(normalise),
    // Contribution totals need the GraphQL API and therefore a token. Left
    // null rather than estimated — an invented number is worse than none.
    contributions: null,
  };

  writeFileSync(GENERATED, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  console.log(
    `Wrote ${GENERATED}: ${snapshot.repos.length} repositories` +
      `${TOKEN ? ' (authenticated)' : ' (unauthenticated)'}.`,
  );

  if (process.argv.includes('--promote')) {
    copyFileSync(GENERATED, SNAPSHOT);
    console.log(`Promoted to ${SNAPSHOT} — commit this to update the fallback.`);
  }
}

await main();
