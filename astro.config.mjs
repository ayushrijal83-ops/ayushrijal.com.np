// @ts-check
import { defineConfig } from 'astro/config';

/**
 * ayushrijal.com.np — V2
 *
 * Static output only. The build emits plain HTML/CSS to `dist/`, which is
 * what GitHub Pages serves. There is no server runtime, so there is nowhere
 * for a secret to live at request time — all GitHub data is fetched at build
 * time and baked in (see docs/SECURITY.md).
 *
 * `prefetch` is deliberately off for now: the section-transition system owns
 * navigation timing, and speculative fetching would fight it. Revisit once
 * the transition system is finalised in M03.
 */
export default defineConfig({
  site: 'https://ayushrijal.com.np',
  output: 'static',
  trailingSlash: 'never',
  build: {
    // Emit `/about/index.html` so clean URLs work on GitHub Pages, which has
    // no rewrite layer of its own.
    format: 'directory',
    inlineStylesheets: 'auto',
  },

  vite: {
    build: {
      /**
       * Never inline a script; always emit an external module.
       *
       * Astro inlines any client script whose bundled chunk is under 4 KB.
       * Our Content-Security-Policy is `script-src 'self'`, which blocks
       * inline scripts outright — so a small script is silently dropped by the
       * browser with no build error and nothing visible to the author. The
       * page just does nothing. That cost real debugging time on
       * /lab/viewports during M03-B.
       *
       * Weakening the CSP with 'unsafe-inline' would "fix" it and defeat the
       * point of having one. Fixing it here means the policy and the output
       * cannot disagree, for any page anyone adds later.
       *
       * This must live under `vite.build`, not `build`: Astro's script and
       * style plugins read the limit from the resolved VITE config in
       * `configResolved`, so an `assetsInlineLimit` set on Astro's own `build`
       * object is silently ignored. `npm run verify` asserts the result rather
       * than trusting this comment.
       *
       * Returning `undefined` for everything else keeps the default 4 KB
       * behaviour for stylesheets and assets, which the CSP does permit.
       */
      assetsInlineLimit: (filePath) =>
        filePath.endsWith('.js') ? false : undefined,
    },
  },
  devToolbar: {
    enabled: false,
  },
});
