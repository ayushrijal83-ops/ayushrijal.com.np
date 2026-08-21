/**
 * SYSTEM A — CUSTOM WORDMARK LAYOUT
 * ============================================================================
 * A deliberately small glyph-positioning layer, for one job: giving every
 * grapheme of `AYUSH RIJAL` its own x-position so the wordmark can be
 * choreographed letter by letter.
 *
 * This exists because Pretext does not — and by design will not — provide it.
 * Pretext is a line-breaking engine: it returns line boxes, line widths and
 * grapheme *cursors*, not glyph *coordinates* (PROJECT_PROGRESS §7.1). Asking
 * it for letter positions would be using the wrong tool. So this file is the
 * right tool, and it is intentionally ~90 lines rather than a framework.
 *
 * NOT a general typography system. It handles one short single-line string in
 * one font. If a second use case appears, that is an architecture decision.
 *
 * ── The measurement problem ────────────────────────────────────────────────
 * The naive approach — measure each glyph alone and accumulate the widths —
 * produces visibly wrong positions, because it throws away kerning. `AY` in a
 * condensed grotesque kerns hard; summed isolated advances push the `Y` too
 * far right and the whole wordmark loosens.
 *
 * So positions come from *cumulative prefix* measurements instead. Measuring
 * `AYU` gives a width that already contains the A/Y and Y/U kern pairs. The
 * only pair a prefix cannot contain is the one straddling its own boundary —
 * between the last glyph of the prefix and the glyph being placed — so that
 * single pair is measured separately and added back:
 *
 *     kern(a, b) = width(a + b) − width(a) − width(b)
 *
 * The result matches what the browser actually paints, at the cost of ~2n
 * `measureText` calls on an 11-glyph string. That is measured in microseconds.
 *
 * ── The scaling property ───────────────────────────────────────────────────
 * Layout runs once at a reference size and is then *scaled*, never re-measured.
 * Glyph advances are linear in font size, so a resize is a multiply, not a
 * measurement pass. Resizing the window does no text measurement at all.
 */

/** Reference size everything is measured at, then scaled from. */
const REF_PX = 100;

export type Glyph = {
  /** The grapheme itself. May be a multi-code-point cluster. */
  char: string;
  /** x offset at REF_PX, from the wordmark's left edge. */
  x: number;
  /** Advance width at REF_PX. */
  width: number;
  /** Index among *rendered* glyphs, whitespace excluded. Drives stagger. */
  order: number;
  isSpace: boolean;
};

export type WordmarkLayout = {
  glyphs: Glyph[];
  /** Total advance at REF_PX. Divide a target width by this to get the scale. */
  naturalWidth: number;
  ascent: number;
  descent: number;
  /** The size the geometry above is expressed in. */
  refSize: number;
};

/**
 * @param text    the wordmark, e.g. `AYUSH RIJAL`
 * @param family  CSS font-family, e.g. `'IBM Plex Sans Condensed'`
 * @param weight  CSS font-weight applied when measuring
 * @param tracking letter-spacing in em, applied manually rather than through
 *   `ctx.letterSpacing` — that property is recent and unevenly implemented,
 *   and doing it by hand keeps the maths identical in every browser.
 */
export function layoutWordmark(
  text: string,
  family: string,
  weight = 700,
  tracking = 0,
): WordmarkLayout | null {
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx || typeof Intl === 'undefined' || !('Segmenter' in Intl)) return null;

  ctx.font = `${weight} ${REF_PX}px ${family}`;
  const advance = (s: string) => ctx.measureText(s).width;

  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
  const chars = [...segmenter.segment(text)].map((s) => s.segment);
  const trackPx = tracking * REF_PX;

  const glyphs: Glyph[] = [];
  let order = 0;
  let prefix = '';

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i]!;
    const prev = i > 0 ? chars[i - 1]! : '';

    // Kerning straddling the prefix boundary — the one pair a prefix width
    // cannot already account for. Zero for the first glyph.
    const boundaryKern = prev
      ? advance(prev + char) - advance(prev) - advance(char)
      : 0;

    const isSpace = char.trim() === '';
    glyphs.push({
      char,
      x: advance(prefix) + boundaryKern + i * trackPx,
      width: advance(char),
      order: isSpace ? -1 : order++,
      isSpace,
    });
    prefix += char;
  }

  const metrics = ctx.measureText(text);
  return {
    glyphs,
    naturalWidth: advance(text) + Math.max(0, chars.length - 1) * trackPx,
    // `fontBoundingBox*` is the font's own line box and is stable across
    // strings; `actualBoundingBox*` depends on which glyphs are present and
    // would make the wordmark's height jitter if the text ever changed.
    ascent: metrics.fontBoundingBoxAscent || metrics.actualBoundingBoxAscent,
    descent: metrics.fontBoundingBoxDescent || metrics.actualBoundingBoxDescent,
    refSize: REF_PX,
  };
}
