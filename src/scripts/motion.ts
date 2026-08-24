/**
 * Shared capability + motion guards for every island on the site.
 *
 * The rule the whole client layer follows: a page is complete before any of
 * this runs. Islands *enhance*; they never supply content. If any check here
 * fails, the static HTML is what the visitor gets, and that HTML is designed
 * to be good on its own.
 */

/** Live reduced-motion state. Re-read per call — users change it mid-session. */
export function prefersReducedMotion(): boolean {
  return (
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Notifies when the reduced-motion preference flips. Returns a disposer. */
export function onMotionPreferenceChange(fn: (reduced: boolean) => void): () => void {
  if (typeof matchMedia !== 'function') return () => {};
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  const handler = (e: MediaQueryListEvent) => fn(e.matches);
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}

/**
 * Everything the typography layer needs in order to measure text.
 *
 * `Intl.Segmenter` is the hard one: Pretext requires it, and so does our own
 * wordmark layer, since both are grapheme-based. It reached Firefox only in
 * 125 (2024) — see PROJECT_PROGRESS §7.1 — so a real fallback is required,
 * not assumed away.
 */
export function canMeasureText(): boolean {
  if (typeof document === 'undefined') return false;
  if (typeof Intl === 'undefined' || !('Segmenter' in Intl)) return false;
  try {
    const ctx = document.createElement('canvas').getContext('2d');
    return ctx !== null && typeof ctx.measureText === 'function';
  } catch {
    return false;
  }
}

/**
 * Resolves once the given font is actually usable for measurement.
 *
 * Measuring before the webfont loads silently bakes in the *fallback* font's
 * metrics, and because the layout is then cached, the wordmark stays wrong for
 * the rest of the session. This is the single most common way a custom text
 * layout ships broken, so it is a guard, not an optimisation.
 *
 * Resolves `false` if the font never arrives, so callers can keep the CSS
 * fallback instead of rendering with wrong metrics.
 */
export async function fontReady(font: string, sample: string): Promise<boolean> {
  if (typeof document === 'undefined' || !('fonts' in document)) return false;
  try {
    await document.fonts.load(font, sample);
    await document.fonts.ready;
    return document.fonts.check(font, sample);
  } catch {
    return false;
  }
}

/**
 * rAF-coalesced callback. Resize and pointer events both fire far faster than
 * the compositor can use, and doing layout work per event is how a text layout
 * ends up janking on exactly the low-end hardware it should be cheapest on.
 */
export function onFrame<T extends unknown[]>(fn: (...args: T) => void) {
  let queued = false;
  let latest: T;
  return (...args: T) => {
    latest = args;
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      fn(...latest);
    });
  };
}
