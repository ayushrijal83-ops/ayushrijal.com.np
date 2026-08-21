/**
 * Responsive review harness — points every preview frame at the chosen route.
 *
 * Lives in its own module rather than inline in the .astro page for a reason
 * that bit once already: Astro INLINES a `<script>` that has no imports, and
 * our Content-Security-Policy is `script-src 'self'`, which blocks inline
 * scripts. An inlined script therefore fails silently in the build — no error
 * the author will see, just a page that quietly does nothing.
 *
 * So the rule for this codebase is: client code lives in `src/scripts/` and is
 * pulled in with a bare `import`, which always produces an external module.
 * `npm run verify` enforces it — see the inline-script check in package.json.
 */

/**
 * Resolve the requested route to a same-origin pathname.
 *
 * Anything the caller supplies is reduced to a pathname against this origin,
 * so `?route=https://elsewhere.example` cannot make the harness frame a
 * third-party document — it becomes `/` instead.
 */
function safeRoute(): string {
  const requested = new URLSearchParams(location.search).get('route') ?? '/';
  try {
    const url = new URL(requested, location.origin);
    return url.origin === location.origin ? url.pathname : '/';
  } catch {
    return '/';
  }
}

const route = safeRoute();
for (const frame of document.querySelectorAll<HTMLIFrameElement>('[data-vp-frame]')) {
  frame.src = route;
}
