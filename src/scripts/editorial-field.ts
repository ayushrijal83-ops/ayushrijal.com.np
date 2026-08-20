/**
 * SYSTEM B — PRETEXT EDITORIAL LAYOUT
 * ============================================================================
 * Uses `@chenglou/pretext@0.0.8` for the thing it is actually built for:
 * reflow-free multiline line-breaking at widths CSS cannot express.
 *
 * The justification test the brief demands — "does Pretext genuinely provide
 * value?" — is answered by one capability here: **per-line variable width**.
 * The editorial text flows around the wordmark, so the lines that pass beside
 * it are narrower than the lines above and below it, and the exclusion shape
 * is computed in JS from the wordmark's real geometry.
 *
 * CSS cannot do this. `shape-outside` needs a float with a shape known ahead of
 * time; it cannot take per-line widths from a sibling island's measured layout.
 * Doing it by hand means binary-searching break points with `getBoundingClientRect`
 * per candidate — a reflow per probe, which is precisely the cost Pretext exists
 * to remove.
 *
 * The second property that matters is the split between `prepareWithSegments()`
 * and the layout walk. `prepare` does the expensive part once — segmentation,
 * canvas measurement, glue rules. Every subsequent width change is pure
 * arithmetic over cached widths, with no DOM reads at all. So a resize
 * recomposes the entire text block without touching layout.
 *
 * Accessibility contract: identical to the wordmark. The real paragraph stays
 * in the DOM as the accessible text; the laid-out stage is `aria-hidden`. With
 * no JS, no `Intl.Segmenter`, or no webfont, the paragraph is simply the
 * visible text, flowed by CSS. That path is designed, not degraded.
 */

import {
  layoutNextLineRange,
  materializeLineRange,
  prepareWithSegments,
  type LayoutCursor,
  type PreparedTextWithSegments,
} from '@chenglou/pretext';
import { canMeasureText, fontReady, onFrame } from './motion.js';

/** A rectangle the text must flow around, in px relative to the stage. */
export type Exclusion = { top: number; bottom: number; width: number };

/**
 * Supplies the current exclusion at layout time.
 *
 * A callback rather than CSS custom properties on purpose. Custom properties
 * would have to be registered with `@property` before `getComputedStyle`
 * resolved them to pixels, and — worse — the wordmark island and the field
 * island would have to agree on who writes them before whose ResizeObserver
 * fires. Asking for the geometry at the moment it is used removes the ordering
 * problem entirely.
 */
export type ExclusionProvider = (stage: HTMLElement) => Exclusion;

const NO_EXCLUSION: Exclusion = { top: 0, bottom: 0, width: 0 };

/** Composes closer together than this are treated as one burst. */
const BURST_MS = 250;
/** How many distinct layouts one burst may produce before it is cut off. */
const BURST_DEPTH = 6;

export type FieldTiming = {
  /** ms spent in `prepareWithSegments` — the one-time cost. */
  prepare: number;
  /** ms spent in the most recent full re-layout — the per-resize cost. */
  layout: number;
  lineCount: number;
};

type Field = {
  host: HTMLElement;
  stage: HTMLElement;
  prepared: PreparedTextWithSegments;
  lineHeight: number;
  exclusion: ExclusionProvider;
  timing: FieldTiming;
  /**
   * Recent layout signatures, for the oscillation guard in `compose`.
   * See the note there — this is what stops a scrollbar feedback loop from
   * freezing the tab.
   */
  recent: string[];
  /** Timestamp of the last composition, used to expire `recent`. */
  lastAt: number;
};

export type FieldOptions = {
  /** Defaults to no exclusion — a plain rectangular column. */
  exclusion?: ExclusionProvider;
  /**
   * Extra elements whose resize should also trigger a re-layout. The Home page
   * passes the wordmark: when the wordmark rescales, the exclusion it casts
   * changes even though the field's own width has not.
   */
  observe?: Element[];
  /**
   * Receives real measured numbers after every layout pass. The prototype page
   * renders these; the Home page passes nothing.
   */
  onTiming?: (timing: FieldTiming, host: HTMLElement) => void;
};

export async function mountEditorialFields(
  root: ParentNode = document,
  options: FieldOptions = {},
): Promise<void> {
  const hosts = [...root.querySelectorAll<HTMLElement>('[data-editorial]')];
  if (hosts.length === 0 || !canMeasureText()) return;

  for (const host of hosts) {
    const source = host.querySelector<HTMLElement>('[data-editorial-source]');
    const stage = host.querySelector<HTMLElement>('[data-editorial-stage]');
    const text = source?.textContent?.trim();
    if (!source || !stage || !text) continue;

    // Read the font off the element that will *not* be shown, so the measured
    // font string is by construction the same one CSS resolved. Pretext's
    // headline caveat is that `font` and `letterSpacing` must be kept in sync
    // with the CSS; deriving them instead of hardcoding them makes that
    // impossible to get wrong.
    const cs = getComputedStyle(source);
    const font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const lineHeight = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.6;
    const letterSpacing = parseFloat(cs.letterSpacing) || 0;

    if (!(await fontReady(font, text.slice(0, 32)))) continue;

    const t0 = performance.now();
    const prepared = prepareWithSegments(text, font, { letterSpacing });
    const prepare = performance.now() - t0;

    const field: Field = {
      host,
      stage,
      prepared,
      lineHeight,
      exclusion: options.exclusion ?? (() => NO_EXCLUSION),
      timing: { prepare, layout: 0, lineCount: 0 },
      recent: [],
      lastAt: 0,
    };

    const run = () => {
      compose(field);
      options.onTiming?.(field.timing, host);
    };

    // Order matters, in both directions.
    //
    // Reveal the stage FIRST: while it still carries `data-enhanced="pending"`
    // it is `display: none`, so `clientWidth` is 0 and the first composition
    // would be a guaranteed no-op — leaving the whole layout dependent on the
    // ResizeObserver's initial callback to rescue it.
    stage.removeAttribute('data-enhanced');
    run();

    // Hide the fallback LAST, and only once the replacement has actually
    // produced lines. If composition yielded nothing, put the stage back and
    // leave the CSS-flowed paragraph alone — a visitor must never be left with
    // the original hidden and nothing in its place.
    if (field.timing.lineCount === 0) {
      stage.setAttribute('data-enhanced', 'pending');
      continue;
    }
    source.classList.add('visually-hidden');

    const observer = new ResizeObserver(onFrame(run));
    observer.observe(host);
    for (const extra of options.observe ?? []) observer.observe(extra);
  }
}

/**
 * Lay the paragraph out one line at a time, asking for a fresh width on every
 * line. This is `layoutNextLineRange` used as intended: a streaming cursor
 * where the caller owns the geometry.
 */
function compose(field: Field): void {
  const { prepared, stage, lineHeight } = field;
  const width = stage.clientWidth;
  if (width <= 0) return;

  const exclusion = field.exclusion(stage);

  // ── Oscillation guard ───────────────────────────────────────────────────
  // `compose` writes `stage.blockSize`. That changes the observed host's
  // height, which re-enters this function. Usually the second pass computes an
  // identical result and stops. But if an ancestor scrolls, growing the stage
  // can summon a scrollbar, which narrows the content box, which produces a
  // *different* layout, which removes the scrollbar again — an A/B flip that
  // never settles and hard-freezes the tab. This was reproduced in the lab rig
  // and is not hypothetical.
  //
  // So: remember the signatures composed in the current burst and refuse to
  // recompute one already seen. A burst expires after a quiet period, so a
  // genuine user resize that revisits an earlier width still recomposes.
  const signature = `${width}|${exclusion.top}|${exclusion.bottom}|${exclusion.width}`;
  const now = performance.now();
  if (now - field.lastAt > BURST_MS) field.recent.length = 0;
  field.lastAt = now;
  if (field.recent.includes(signature)) return;
  field.recent.push(signature);
  if (field.recent.length > BURST_DEPTH) field.recent.shift();

  const t0 = now;

  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
  let y = 0;
  const frag = document.createDocumentFragment();
  let lineCount = 0;

  // Hard stop: a pathological width (a 1px container mid-transition) could
  // otherwise stream lines forever. Bounding it keeps a layout bug from
  // becoming a hung tab.
  const MAX_LINES = 400;

  while (lineCount < MAX_LINES) {
    const overlaps = y + lineHeight > exclusion.top && y < exclusion.bottom;
    const lineWidth = overlaps ? Math.max(24, width - exclusion.width) : width;

    const range = layoutNextLineRange(prepared, cursor, lineWidth);
    if (range === null) break;

    const line = materializeLineRange(prepared, range);
    const el = document.createElement('span');
    el.className = 'field__line';
    el.textContent = line.text;
    el.style.setProperty('--ly', `${y}px`);
    // Lines beside the wordmark are inset, not just clipped — the exclusion is
    // a real column edge, so the ragged edge reads as intentional setting.
    el.style.setProperty('--lx', overlaps ? `${exclusion.width}px` : '0px');
    el.style.setProperty('--li', String(lineCount));
    frag.append(el);

    cursor = range.end;
    y += lineHeight;
    lineCount++;
  }

  stage.replaceChildren(frag);
  stage.style.blockSize = `${y}px`;
  field.timing.layout = performance.now() - t0;
  field.timing.lineCount = lineCount;
}
