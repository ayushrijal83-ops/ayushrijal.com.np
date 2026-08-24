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
 * As of M05 the fetch half is implemented: `scripts/fetch-github.mjs`. It is
 * deliberately NOT part of `npm run build`, so a GitHub outage cannot fail a
 * build or blank a page — see the fallback contract below.
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
import { resolve } from 'node:path';

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
  /** ISO 8601. When the repository was created — the start of the work. */
  createdAt: string;
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
 * What KIND of thing a repository is. The curated half of the GITHUB world.
 *
 * This replaced `EXCLUDED_REPOS` in M07, and the replacement is the whole
 * argument of that world. The old list hid three repositories from the index:
 * the profile README, this website, and a personal page. That is defensible on
 * a portfolio grid — it is not defensible on a page whose thesis is *the source
 * is the record*. An archive that quietly omits three of its ten holdings is
 * not an archive, and the visitor has no way to know the omission happened.
 *
 * So nothing is hidden. Instead every repository is CLASSIFIED, the register
 * prints the class, and the reader decides what to weigh. A profile README
 * being a profile README is a fact worth stating, not a reason to delete a row.
 *
 * Unlisted repositories fall to `code`, which is the honest default: it claims
 * only that the thing contains source.
 */
export type RepoKind = 'project' | 'site' | 'profile' | 'notes' | 'personal' | 'code';

export const REPO_KIND: Readonly<Record<string, RepoKind>> = {
  YushaCyber: 'project',
  jarvis_assistant: 'project',
  Agriculture_simulator: 'project',
  beach_buggy_ai: 'code',
  'x-man': 'code',
  'cyber-security': 'notes',
  'ayushrijal.com.np': 'site',
  'ayushrijal83-ops': 'profile',
  'A-Universe-For-You': 'personal',
  'Jarvis-AI-Assistant': 'notes',
};

export const repoKind = (name: string): RepoKind => REPO_KIND[name] ?? 'code';

/**
 * Load order per the fallback contract above. Build-time only.
 *
 * Resolved from the PROCESS WORKING DIRECTORY, not from `import.meta.url`.
 * This module is bundled before it runs, so at build time `import.meta.url`
 * points at a chunk inside the build output and `../data/...` resolves to
 * `dist/data/...`, which does not exist. Every read then failed and the
 * loader returned `null` — indistinguishable from "GitHub is down", and
 * completely silent, because returning `null` is a legitimate outcome here.
 *
 * The bug shipped in M02 and could not be seen until M05: the snapshot held
 * zero repositories and no page rendered a fact, so a loader that always
 * failed produced exactly the same output as one that worked. Found by
 * testing the fallback contract deliberately rather than by looking at a page.
 *
 * `astro build` runs from the project root, which is what makes cwd the right
 * anchor for a build-time-only module.
 */
const SOURCES = ['src/data/github.generated.json', 'src/data/github.snapshot.json'];

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
      const parsed: unknown = JSON.parse(readFileSync(resolve(source), 'utf8'));
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

/**
 * The verified-facts half of a project record.
 *
 * PROJECTS joins curated narrative (a content entry, written by hand) to
 * repository facts (this, fetched from GitHub) on the repo URL. Keeping the
 * join here means a page never reaches into the snapshot array itself, and a
 * project whose repository is missing from the snapshot renders its narrative
 * with the facts simply absent rather than failing.
 *
 * Compares case-insensitively and ignores a trailing slash: the URL in a
 * content file is typed by a human, and `.../YushaCyber` and `.../yushacyber`
 * are the same repository to GitHub.
 */
export function repoByUrl(
  snapshot: GitHubSnapshot | null,
  url: string | undefined,
): Repo | null {
  if (!snapshot || !url) return null;
  const want = url.replace(/\/+$/, '').toLowerCase();
  return snapshot.repos.find((r) => r.url.toLowerCase() === want) ?? null;
}

/**
 * Every public repository, most recently pushed first.
 *
 * Forks are dropped: a fork is public code but it is not authored work, and
 * the register makes a claim about authorship. Archived repositories are KEPT
 * and marked — an archive that drops the archived material has misunderstood
 * the word. Nothing else is filtered; see `REPO_KIND` for why.
 */
export function publicRepos(snapshot: GitHubSnapshot | null): Repo[] {
  if (!snapshot) return [];
  return snapshot.repos
    .filter((r) => !r.fork)
    .sort((a, b) => b.pushedAt.localeCompare(a.pushedAt));
}
