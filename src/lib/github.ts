/**
 * GITHUB DATA — ARCHITECTURE ONLY (M02)
 * ============================================================================
 * The M02 brief says: prepare the architecture, do not implement the complete
 * integration. This file is the prepared architecture — the types, the load
 * order and the fallback contract. It performs no network I/O.
 *
 * Target pipeline:
 *
 *   GitHub Actions (push + scheduled cron)
 *     └─ fetch REST + GraphQL using secrets.GITHUB_TOKEN   ← runner only
 *          └─ normalise → src/data/github.generated.json
 *               └─ THIS MODULE, at build time
 *                    └─ static HTML with the data baked in
 *
 * Why it is shaped this way (PROJECT_PROGRESS §8.3, R6):
 *   - The token never reaches a visitor. Static output has no request-time
 *     runtime, so there is nowhere for a secret to live even by accident.
 *   - Visitor-facing rate limits disappear. V1 shared 60 req/hr per IP across
 *     everyone behind a NAT.
 *   - Contribution/activity data needs GraphQL, which mandates a token, and so
 *     is unreachable from the client at all.
 *
 * FALLBACK CONTRACT — the reason this module exists now rather than later:
 *   1. `github.generated.json` — fresh, written by the workflow. Gitignored.
 *   2. `github.snapshot.json`  — last known-good, committed to the repo.
 *   3. `null`                  — render an explicit "unavailable" state.
 *
 * A failed fetch must never blank the site, and must never be papered over
 * with invented numbers. Step 3 is a real, designed state, not an error.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export type Repo = {
  name: string;
  description: string | null;
  url: string;
  /** Primary language as reported by GitHub. Often null; that is fine. */
  language: string | null;
  stars: number;
  forks: number;
  /** ISO 8601. Kept as a string so the JSON snapshot round-trips exactly. */
  pushedAt: string;
  topics: string[];
  archived: boolean;
  fork: boolean;
};

export type GitHubSnapshot = {
  /** Schema version, so a stale snapshot can be detected and rejected. */
  version: 1;
  /** When the snapshot was produced. ISO 8601, or null if never produced. */
  generatedAt: string | null;
  login: string;
  repos: Repo[];
  /**
   * Contribution totals require the GraphQL API and therefore a token.
   * Null until the workflow lands — never estimated, never faked.
   */
  contributions: { total: number; from: string; to: string } | null;
};

/**
 * Repositories excluded from the public index. Moved out of the hardcoded
 * array that lived in V1's `main.js` so it is reviewable config, not code.
 */
export const EXCLUDED_REPOS: readonly string[] = [
  'ayushrijal83-ops',
  'ayushrijal.com.np',
  'A-Universe-For-You',
];

/** Load order per the fallback contract above. Build-time only. */
const SOURCES = ['../data/github.generated.json', '../data/github.snapshot.json'];

let cached: GitHubSnapshot | null | undefined;

/**
 * Reads the newest available snapshot. Returns `null` when neither file is
 * present or parseable, which callers must render as an explicit unavailable
 * state rather than as an empty list.
 */
export function loadGitHubSnapshot(): GitHubSnapshot | null {
  if (cached !== undefined) return cached;

  for (const source of SOURCES) {
    try {
      const path = fileURLToPath(new URL(source, import.meta.url));
      const parsed: unknown = JSON.parse(readFileSync(path, 'utf8'));
      if (isSnapshot(parsed)) {
        cached = parsed;
        return cached;
      }
    } catch {
      // Missing or malformed: fall through to the next source. `generated`
      // is gitignored and absent on a clean checkout, so this is the normal
      // path locally, not an error worth failing the build over.
    }
  }

  cached = null;
  return cached;
}

/**
 * Structural check rather than a trust-the-file cast. The generated file is
 * written by a workflow we control, but a truncated or half-written file is a
 * realistic failure and must degrade to the committed snapshot, not crash the
 * build with a confusing downstream error.
 */
function isSnapshot(value: unknown): value is GitHubSnapshot {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return v.version === 1 && Array.isArray(v.repos) && typeof v.login === 'string';
}

/** Public repositories, most recently pushed first, exclusions applied. */
export function publicRepos(snapshot: GitHubSnapshot | null): Repo[] {
  if (!snapshot) return [];
  return snapshot.repos
    .filter((r) => !r.fork && !r.archived && !EXCLUDED_REPOS.includes(r.name))
    .sort((a, b) => b.pushedAt.localeCompare(a.pushedAt));
}
