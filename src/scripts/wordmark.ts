/**
 * SYSTEM A — the island that binds the wordmark layout to the DOM.
 *
 * Renders one absolutely-positioned element per grapheme, then never measures
 * text again. Resize is a scale multiply; pointer response is a compositor-only
 * transform. Both are deliberate: text measurement is the expensive thing here,
 * so it happens exactly once per font, per arrangement.
 *
 * ── Two arrangements, not one shrunk ───────────────────────────────────────
 * On a wide viewport the wordmark is one line. On a narrow one it is stacked —
 * `Ayush` over `Rijal` — with each line independently scaled to fill the full
 * measure. Because the two names are almost exactly the same width, that
 * produces a flush-both-edges masthead block instead of a thin line of type
 * shrunk to fit a phone. It is a different composition, which is what the
 * brief asks for; scaling the desktop layout down is what it asks us not to do.
 *
 * Both arrangements are measured up front (four `layoutWordmark` calls, ~1 ms
 * total) so crossing the breakpoint is a repaint, never a measurement.
 *
 * ── Accessibility contract ─────────────────────────────────────────────────
 * The glyph layer is `aria-hidden`. The real, readable heading is always in the
 * DOM and is what assistive technology and search engines get. Without JS —
 * or without `Intl.Segmenter`, or if the webfont never loads — that heading is
 * simply the visible wordmark, styled by CSS. Nothing is hidden that has no
 * replacement, and the fallback is demoted only once glyphs actually exist.
 */

import { canMeasureText, fontReady, onFrame, prefersReducedMotion } from './motion.js';
import { layoutWordmark, type WordmarkLayout } from './wordmark-layout.js';

/** Matches --tracking-tight. */
const TRACKING = -0.015;

/** Below this the stacked arrangement is used. Matches home.css. */
const WIDE = '(min-width: 48rem)';

/** Peak vertical displacement under the pointer, in em. Deliberately tiny. */
const LIFT_EM = 0.05;
/** How far the pointer's influence reaches, as a fraction of line width. */
const LIFT_REACH = 0.18;

/** One measured arrangement: the lines it is composed of, in order. */
type Arrangement = WordmarkLayout[];

type Mounted = {
  host: HTMLElement;
  stage: HTMLElement;
  wide: Arrangement;
  narrow: Arrangement;
  /** Which arrangement is currently painted, so we only repaint on a change. */
  current: Arrangement | null;
  /** Painted line elements and their glyphs, for scaling and pointer work. */
  rows: { line: HTMLElement; glyphs: HTMLElement[]; layout: WordmarkLayout }[];
};

/**
 * The face is read from the cascade rather than hardcoded, so the type-set
 * comparison harness in tokens.css moves the measured glyph layout with it.
 * A wordmark measured in one family and painted in another is silently,
 * confidently wrong — this keeps the two definitionally in step.
 */
function typeFace(): { family: string; weight: number } {
  const root = getComputedStyle(document.documentElement);
  const family = root.getPropertyValue('--wordmark-family').trim();
  const weight = Number(root.getPropertyValue('--wordmark-weight').trim());
  return {
    family: family || "'IBM Plex Sans Condensed'",
    weight: Number.isFinite(weight) && weight > 0 ? weight : 700,
  };
}

export async function mountWordmarks(root: ParentNode = document): Promise<void> {
  const hosts = [...root.querySelectorAll<HTMLElement>('[data-wordmark]')];
  if (hosts.length === 0) return;
  if (!canMeasureText()) return; // the static heading stands; nothing to do.

  const { family, weight } = typeFace();

  // Measuring before the face resolves bakes in the *fallback* metrics, and
  // because the layout is then cached the wordmark stays wrong all session.
  if (!(await fontReady(`${weight} 100px ${family}`, 'Ayush Rijal'))) return;

  const mounted = hosts
    .map((host) => mount(host, family, weight))
    .filter((m): m is Mounted => m !== null);

  if (mounted.length === 0) return;

  // One listener for every wordmark on the page, rather than one each.
  matchMedia(WIDE).addEventListener('change', () => {
    for (const m of mounted) render(m);
  });
}

function mount(host: HTMLElement, family: string, weight: number): Mounted | null {
  const text = host.dataset.wordmark?.trim();
  const stage = host.querySelector<HTMLElement>('[data-wordmark-glyphs]');
  if (!text || !stage) return null;

  const lay = (s: string) => layoutWordmark(s, family, weight, TRACKING);

  const wide = [lay(text)].filter((l): l is WordmarkLayout => l !== null);
  // `data-wordmark-stack` is optional. Absent, both arrangements are the same
  // single line and the breakpoint simply has no effect.
  const stackSource = host.dataset.wordmarkStack?.trim();
  const narrow = stackSource
    ? stackSource
        .split('|')
        .map((s) => lay(s.trim()))
        .filter((l): l is WordmarkLayout => l !== null)
    : wide;

  if (wide.length === 0 || wide.some((l) => l.naturalWidth <= 0)) return null;
  if (narrow.some((l) => l.naturalWidth <= 0)) return null;

  const m: Mounted = { host, stage, wide, narrow, current: null, rows: [] };

  // Reveal before measuring the host: the stage is `display: none` while it
  // carries `data-enhanced`, and a hidden host measures 0 wide.
  stage.removeAttribute('data-enhanced');
  render(m);

  if (m.rows.length === 0) {
    stage.setAttribute('data-enhanced', 'pending');
    return null;
  }
  host.querySelector('[data-wordmark-fallback]')?.classList.add('visually-hidden');

  // Observing the host rather than listening for `resize` also catches layout
  // changes that never touch the viewport — a sidebar opening, a font swap.
  new ResizeObserver(onFrame(() => fit(m))).observe(host);

  if (!prefersReducedMotion()) {
    stage.dataset.state = 'entering';
    // Bubbles from whichever glyph finishes first. Registered here rather than
    // inside `bindPointer`, which returns early on coarse pointers — the
    // entrance still has to resolve on a touch device.
    stage.addEventListener(
      'animationend',
      () => {
        stage.dataset.state = 'settled';
      },
      { once: true },
    );
    bindPointer(m);
  }

  return m;
}

/** Paint the arrangement the current viewport calls for, then fit it. */
function render(m: Mounted): void {
  const next = matchMedia(WIDE).matches ? m.wide : m.narrow;
  if (next === m.current) return;
  m.current = next;

  const frag = document.createDocumentFragment();
  const rows: Mounted['rows'] = [];

  // The strike stagger runs continuously across lines, so a stacked wordmark
  // reads as one sequence rather than two restarts.
  let order = 0;
  const total = next.reduce(
    (n, l) => n + l.glyphs.filter((g) => !g.isSpace).length,
    0,
  );

  for (const layout of next) {
    const line = document.createElement('span');
    line.className = 'wordmark__line';
    const glyphs: HTMLElement[] = [];

    for (const g of layout.glyphs) {
      if (g.isSpace) continue;
      const el = document.createElement('span');
      el.className = 'wordmark__glyph';
      el.textContent = g.char;
      // Positions are a fraction of the line's natural width, so CSS needs no
      // unit conversion and the layer stays size- and resolution-independent.
      el.style.setProperty('--gx', String(g.x / layout.naturalWidth));
      el.style.setProperty('--gi', String(order++));
      el.style.setProperty('--gn', String(total));
      line.append(el);
      glyphs.push(el);
    }

    frag.append(line);
    rows.push({ line, glyphs, layout });
  }

  m.stage.replaceChildren(frag);
  m.rows = rows;
  fit(m);
}

/**
 * Fit every line to the host. Pure arithmetic — `layoutWordmark` is never
 * called again for the life of the page, in either arrangement.
 */
function fit(m: Mounted): void {
  const width = m.host.clientWidth;
  if (width <= 0) return;

  let stageHeight = 0;
  for (const { line, layout } of m.rows) {
    const size = (width / layout.naturalWidth) * layout.refSize;
    const height = ((layout.ascent + layout.descent) / layout.refSize) * size;
    line.style.setProperty('--wm-size', `${size}px`);
    line.style.setProperty('--wm-width', `${width}px`);
    // Lines are stacked by their own measured height, tightened by the display
    // leading so a stacked wordmark sets as a solid block rather than as two
    // separate headings that happen to be adjacent.
    line.style.blockSize = `${height}px`;
    stageHeight += height;
  }
  m.stage.style.blockSize = `${stageHeight}px`;
}

/**
 * Pointer response: glyphs lift slightly as the pointer passes over them, the
 * way typebars lift on a mechanical typewriter. Restrained on purpose — the
 * brief asks for a subtle response, not an effect.
 *
 * Skipped entirely for reduced-motion users and for coarse pointers, where a
 * hover-driven effect has no meaning and would only cost battery.
 */
function bindPointer(m: Mounted): void {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const apply = onFrame((ratio: number | null) => {
    for (const { glyphs, layout } of m.rows) {
      const centres = layout.glyphs.filter((g) => !g.isSpace);
      for (let i = 0; i < glyphs.length; i++) {
        const g = centres[i];
        if (!g) continue;
        const centre = (g.x + g.width / 2) / layout.naturalWidth;
        const lift =
          ratio === null
            ? 0
            : Math.max(0, 1 - Math.abs(centre - ratio) / LIFT_REACH) ** 2;
        glyphs[i]!.style.setProperty('--glift', String(lift * LIFT_EM));
      }
    }
  });

  m.host.addEventListener(
    'pointermove',
    (e) => {
      const box = m.host.getBoundingClientRect();
      apply(box.width > 0 ? (e.clientX - box.left) / box.width : null);
    },
    { passive: true },
  );
  m.host.addEventListener('pointerleave', () => apply(null), { passive: true });
}
