/**
 * THE LEGACY ROUTE MAP
 * ============================================================================
 * V1's published URLs, and where each one goes in V2.
 *
 * This is the single authority: the redirect stubs are generated from it
 * (`src/pages/[legacy].html.ts`) and `verify-output.mjs` asserts against it, so
 * the map, the output and the test cannot drift apart. Nothing here is
 * hardcoded twice.
 *
 * ── Why stubs at all ───────────────────────────────────────────────────────
 * GitHub Pages has no rewrite layer. It serves files. The only static
 * mechanisms available for a URL that has moved are a meta refresh at the old
 * path, or nothing — and "nothing" means every inbound link and every indexed
 * result lands on the 404 page.
 *
 * ── Why `content="0"` and not a delay ──────────────────────────────────────
 * A timed meta refresh is a WCAG 2.2.1 failure (technique F40): a reader who
 * needs longer than the delay cannot stop it. A refresh of ZERO is explicitly
 * exempt, because a browser treats it as a redirect rather than as a timed
 * page change. So these are instant, and the visible link underneath is for
 * the reader whose browser or extension blocks refreshes entirely.
 *
 * ── What is deliberately NOT here ──────────────────────────────────────────
 * Three V1 URLs have no entry, and each absence is a decision rather than an
 * oversight. They resolve to `/404.html`, which lists the eight sheets:
 *
 *   /journey.html      A timeline. V2 has no timeline, and M08 (§1H.8) found
 *                      two of its entries unsupported by any source. LEARNING
 *                      is the nearest thing in V2 and is not the same thing.
 *                      ARCHITECT DECISION — see §14.
 *   /blog.html         No successor exists and none is planned.
 *                      ARCHITECT DECISION — see §14.
 *   /assets/resume.pdf Not carried forward. It is not in V2's `public/`, and
 *                      its contents are V1 copy that §9.4 records as never
 *                      having been verified. Republishing an unverified
 *                      document to satisfy a redirect would be the exact
 *                      failure this archive is built against.
 *
 * `/ai` is also absent, and needs nothing: it was renamed to `/ai-lab` in M06
 * before anything was ever published, so no such URL exists in the wild.
 */

export type LegacyRoute = {
  /** The V1 path, without the leading slash — this becomes the built file. */
  readonly from: string;
  /** The V2 route it moved to. */
  readonly to: string;
  /** Shown on the stub, so a reader who lands on it knows what happened. */
  readonly label: string;
};

/**
 * ── The collision rule, learned the hard way in M11 ────────────────────────
 * A stub may only exist where its filename cannot shadow a live route.
 *
 * `about.html` and `contact.html` were written first and then removed, because
 * a static host resolving `/about` tries `about.html` BEFORE
 * `about/index.html`. Measured, not guessed: with all three stubs present,
 * `/about` and `/contact` served the redirect stub instead of the world — and
 * since the stub redirects to `/about`, which resolves to the stub again, that
 * is an infinite loop on two of the site's seven worlds, reached from the
 * site's own navigation. `/work.html` is safe for one reason only: there is no
 * `/work` route for it to shadow.
 *
 * `verify-output.mjs` now fails the build if any entry here collides with a
 * world route, so the loop cannot be reintroduced by adding a plausible line.
 */
export const LEGACY_ROUTES: readonly LegacyRoute[] = [
  { from: 'work.html', to: '/projects', label: 'Engineering Workshop' },
];

/** V1 URLs that reach `/404.html`, and why each one does. */
export const LEGACY_UNRESOLVED: readonly { from: string; why: string }[] = [
  {
    from: '/journey.html',
    why: 'A timeline. V2 has none, and two of its entries were found unsupported in M08. ARCHITECT DECISION.',
  },
  {
    from: '/blog.html',
    why: 'No successor exists in V2 and none is planned. ARCHITECT DECISION.',
  },
  {
    from: '/assets/resume.pdf',
    why: 'Not carried forward. Its contents are unverified V1 copy.',
  },
  {
    from: '/about.html',
    why: 'Destination is known (/about) but a stub here would shadow the live route — see the collision rule above. Needs a Pages preview to confirm resolution order before it can be enabled.',
  },
  {
    from: '/contact.html',
    why: 'Same collision as /about.html. Destination is /contact.',
  },
];
