/**
 * The V1 redirect stubs, generated from `lib/legacy.ts`.
 *
 * One file per legacy URL, emitted at the exact old path — `dist/about.html`,
 * not `dist/about.html/index.html` — because that is the URL that is indexed
 * and linked. An endpoint with a literal `.html` in its filename keeps the
 * extension under `build.format: 'directory'`; an `.astro` page would not.
 *
 * These are hand-written HTML rather than the site's layout on purpose. A
 * redirect stub has one job, and it has to do it when the stylesheet bundle,
 * the fonts and the scripts have all failed. There is nothing here to fail:
 * no script, no external resource, no dependency on the archive's CSS.
 *
 * Three things every stub carries:
 *   - `<meta http-equiv="refresh" content="0; …">`. Zero delay, which is what
 *     keeps it out of WCAG failure F40 — a timed refresh cannot be stopped by
 *     a reader who needs longer, a zero one is a redirect.
 *   - `<link rel="canonical">` to the destination, so a crawler that follows
 *     the refresh consolidates the two URLs rather than indexing both.
 *   - a visible, focusable link. Refresh can be blocked — by an extension, by
 *     a hardened browser, by a reader-mode proxy — and the page has to be
 *     usable when it is.
 *
 * `noindex` is deliberately NOT set: it would tell a crawler to drop the old
 * URL instead of transferring it to the new one.
 */
import type { APIRoute } from 'astro';
import { LEGACY_ROUTES } from '@lib/legacy';
import { SITE } from '@lib/site';

export function getStaticPaths() {
  return LEGACY_ROUTES.map((route) => ({
    // The `.html` is in the filename, so the param is the stem before it.
    params: { legacy: route.from.replace(/\.html$/, '') },
    props: route,
  }));
}

export const GET: APIRoute = ({ props }) => {
  const { to, label } = props as (typeof LEGACY_ROUTES)[number];
  const target = `${SITE.url}${to}`;

  const body = `<!doctype html>
<html lang="${SITE.lang}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="refresh" content="0; url=${to}" />
    <link rel="canonical" href="${target}" />
    <title>Moved to ${label} — ${SITE.title}</title>
    <meta name="description" content="This page has moved to ${target}" />
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'none'; style-src 'unsafe-inline'; object-src 'none'; base-uri 'none'; form-action 'none'"
    />
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-content: center;
        gap: 0.75rem;
        padding: 2rem;
        background: #ece7dc;
        color: #1c1a17;
        font: 1rem/1.5 Georgia, 'Times New Roman', serif;
      }
      p {
        margin: 0;
        max-width: 44ch;
      }
      .ref {
        font: 0.8rem/1.4 ui-monospace, Consolas, monospace;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: #615b52;
      }
      a {
        color: #9c3016;
        text-underline-offset: 3px;
      }
      a:focus-visible {
        outline: 2px solid #9c3016;
        outline-offset: 3px;
      }
    </style>
  </head>
  <body>
    <p class="ref">This page has moved</p>
    <p>
      The archive was rebuilt and this address is no longer used. You should
      arrive at <a href="${to}">${label}</a> automatically; if you do not,
      follow that link.
    </p>
  </body>
</html>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};
