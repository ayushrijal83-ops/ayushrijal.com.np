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
  devToolbar: {
    enabled: false,
  },
});
