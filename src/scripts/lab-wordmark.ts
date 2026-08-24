/**
 * WORDMARK PROTOTYPE INSTRUMENT
 * ============================================================================
 * Quantifies the two claims System A rests on.
 *
 * 1. Kerning matters. Compares the naive layout (sum of isolated glyph
 *    advances) against the prefix + boundary-kern layout the real engine uses,
 *    and reports the largest disagreement in px at a realistic display size.
 *    If that number were near zero, the extra measurement passes would be
 *    unjustified and the naive version should win.
 *
 * 2. The layout is cheap and happens once. Reports the measured cost of a full
 *    `layoutWordmark()` call, which is what a font load costs — and which a
 *    resize, by design, never pays again.
 */

import { layoutWordmark } from './wordmark-layout.js';

export type WordmarkReport = {
  glyphs: number;
  naturalWidth: number;
  layoutMs: number;
  /** Worst-case glyph displacement from ignoring kerning, in px at `atSize`. */
  kernErrorPx: number;
  atSize: number;
};

export function reportWordmark(
  text: string,
  family: string,
  weight = 700,
  tracking = 0,
  atSize = 160,
): WordmarkReport | null {
  const t0 = performance.now();
  const layout = layoutWordmark(text, family, weight, tracking);
  const layoutMs = performance.now() - t0;
  if (!layout) return null;

  // The naive alternative: accumulate isolated advances, ignoring kerning.
  //
  // It must apply the SAME tracking as the real engine, otherwise the delta
  // below measures the letter-spacing setting rather than kerning and reports
  // a large, flattering, meaningless number. Isolating the one variable under
  // test is the whole point of the comparison.
  const trackPx = tracking * layout.refSize;
  const naive: number[] = [];
  let cursor = 0;
  for (const g of layout.glyphs) {
    naive.push(cursor);
    cursor += g.width + trackPx;
  }

  const scale = atSize / layout.refSize;
  let kernErrorPx = 0;
  for (let i = 0; i < layout.glyphs.length; i++) {
    const delta = Math.abs(naive[i]! - layout.glyphs[i]!.x) * scale;
    if (delta > kernErrorPx) kernErrorPx = delta;
  }

  return {
    glyphs: layout.glyphs.length,
    naturalWidth: layout.naturalWidth,
    layoutMs,
    kernErrorPx,
    atSize,
  };
}

/**
 * Format a millisecond duration the way a measurement should read: ms when the
 * number is comfortable in ms, µs when it would otherwise be `0.00`.
 *
 * Lived in `lab-pretext.ts` until M03-B.1 deleted that module along with the
 * Pretext dependency. It is a formatter and has nothing to do with either
 * prototype, so it moved here rather than earning a module of its own.
 */
export function ms(value: number): string {
  if (value >= 1) return `${value.toFixed(2)} ms`;
  return `${(value * 1000).toFixed(0)} µs`;
}
