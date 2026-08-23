/**
 * The sitemap, generated from the same registry the navigation reads.
 *
 * V1 shipped a hand-written `sitemap.xml` listing six `.html` files, which is
 * exactly the class of artefact that goes stale the first time a route
 * changes — and V2 has already renamed one route (`/ai` → `/ai-lab`) before
 * publishing anything. So this is derived, not written: the eight worlds come
 * from `lib/worlds.ts` and the project records from the content collection, so
 * a route that exists is listed and a route that does not cannot be.
 *
 * No dependency. `@astrojs/sitemap` would do this and a little more, and this
 * is twenty lines against a package in the supply chain of a site whose whole
 * security posture is "there is nothing here but our own files".
 *
 * `/lab/*` is deliberately absent, matching the `Disallow` in `robots.txt`:
 * those pages are measurement harnesses, part of the working record rather
 * than of the archive.
 *
 * `changefreq` and `priority` are omitted on purpose. Both are hints Google
 * has said publicly it ignores, and inventing a priority ordering for eight
 * worlds would be a fabricated claim in the one file nobody ever reads.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { WORLDS } from '@lib/worlds';
import { SITE } from '@lib/site';

export const GET: APIRoute = async () => {
  const projects = await getCollection('projects', (e) => !e.data.draft);

  const routes = [
    ...WORLDS.map((w) => ({
      path: w.href,
      /** No date is invented: only entries that carry one report one. */
      lastmod: undefined as string | undefined,
    })),
    ...projects.map((e) => ({
      path: `/projects/${e.id}`,
      lastmod: (e.data.updated ?? e.data.date).toISOString().slice(0, 10),
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(({ path, lastmod }) => {
    const loc = `${SITE.url}${path === '/' ? '/' : path}`;
    return `  <url>\n    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`;
  })
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
