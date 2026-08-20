/**
 * SYSTEM A — the island that binds the wordmark layout to the DOM.
 *
 * Renders one absolutely-positioned element per grapheme, then never measures
 * text again. Resize is a scale multiply; pointer response is a compositor-only
 * transform. Both are deliberate: text measurement is the expensive thing here,
 * so it happens exactly once per font load.
 *
 * Accessibility contract: the glyph layer is `aria-hidden`. The real, readable
 * heading is always in the DOM and is what assistive technology and search
 * engines get. Without JS — or without `Intl.Segmenter`, or if the webfont
 * never loads — that heading is simply the visible wordmark, styled by CSS.
 * Nothing is hidden that has no replacement.
 */

import { canMeasureText, fontReady, onFrame, prefersReducedMotion } from './motion.js';
import { layoutWordmark, renderedCount, type WordmarkLayout } from './wordmark-layout.js';

const FAMILY = "'IBM Plex Sans Condensed'";
const WEIGHT = 700;
const TRACKING = -0.015; // matches --tracking-tight

/** Any size works for a webfont load probe; the layout declares its own. */
const REF_PROBE = 100;

/** Peak vertical displacement under the pointer, in em. Deliberately tiny. */
const LIFT_EM = 0.05;
/** How far the pointer's influence reaches, as a fraction of wordmark width. */
const LIFT_REACH = 0.18;

export async function mountWordmarks(root: ParentNode = document): Promise<void> {
  const hosts = [...root.querySelectorAll<HTMLElement>('[data-wordmark]')];
  if (hosts.length === 0) return;
  if (!canMeasureText()) return; // static heading stands; nothing to do.

  const ok = await fontReady(`${WEIGHT} ${REF_PROBE}px ${FAMILY}`, 'AYUSH RIJAL');
  if (!ok) return; // measuring against fallback metrics would bake in a wrong layout.

  for (const host of hosts) mount(host);
}

function mount(host: HTMLElement): void {
  const text = host.dataset.wordmark?.trim();
  const stage = host.querySelector<HTMLElement>('[data-wordmark-glyphs]');
  if (!text || !stage) return;

  const layout = layoutWordmark(text, FAMILY, WEIGHT, TRACKING);
  if (!layout || layout.naturalWidth <= 0) return;

  const nodes = paint(stage, layout);
  const fit = () => scale(host, stage, layout);

  // Reveal before fitting: the stage is `display: none` until `data-enhanced`
  // is cleared, and a hidden host measures 0 wide.
  stage.removeAttribute('data-enhanced');
  fit();

  // Only now is it safe to demote the real heading. If nothing was painted,
  // the static <h1> stays visible and this island simply never happened.
  if (nodes.length === 0) {
    stage.setAttribute('data-enhanced', 'pending');
    return;
  }
  host.querySelector('[data-wordmark-fallback]')?.classList.add('visually-hidden');

  // Observing the host rather than listening for `resize` also catches layout
  // changes that never touch the viewport — a sidebar opening, a font swap.
  new ResizeObserver(onFrame(fit)).observe(host);

  if (!prefersReducedMotion()) {
    stage.dataset.state = 'entering';
    // Bubbles from the last glyph. Registered here rather than inside
    // `bindPointer`, which returns early on coarse pointers — the entrance
    // still has to resolve on a touch device.
    stage.addEventListener(
      'animationend',
      () => {
        stage.dataset.state = 'settled';
      },
      { once: true },
    );
    bindPointer(host, nodes, layout);
  }
}

/** One element per grapheme. Whitespace advances the cursor but paints nothing. */
function paint(stage: HTMLElement, layout: WordmarkLayout): HTMLElement[] {
  const total = renderedCount(layout);
  const frag = document.createDocumentFragment();
  const nodes: HTMLElement[] = [];

  for (const g of layout.glyphs) {
    if (g.isSpace) continue;
    const el = document.createElement('span');
    el.className = 'wordmark__glyph';
    el.textContent = g.char;
    // Positions are expressed as a fraction of the wordmark's natural width,
    // so the CSS needs no unit conversion and the layer stays resolution- and
    // size-independent. One multiply in the compositor, no JS on resize.
    el.style.setProperty('--gx', String(g.x / layout.naturalWidth));
    el.style.setProperty('--gi', String(g.order));
    el.style.setProperty('--gn', String(total));
    frag.append(el);
    nodes.push(el);
  }

  stage.replaceChildren(frag);
  return nodes;
}

/**
 * Fit the wordmark to its host. Pure arithmetic — `layoutWordmark` is never
 * called again for the life of the page.
 */
function scale(host: HTMLElement, stage: HTMLElement, layout: WordmarkLayout): void {
  const width = host.clientWidth;
  if (width <= 0) return;
  const size = (width / layout.naturalWidth) * layout.refSize;
  stage.style.setProperty('--wm-size', `${size}px`);
  stage.style.setProperty('--wm-width', `${width}px`);
  stage.style.blockSize = `${((layout.ascent + layout.descent) / layout.refSize) * size}px`;
  stage.style.setProperty(
    '--wm-baseline',
    `${(layout.ascent / layout.refSize) * size}px`,
  );
}

/**
 * Pointer response: glyphs lift slightly as the pointer passes over them, the
 * way typebars lift on a mechanical typewriter. Restrained on purpose — the
 * brief asks for a subtle response, not an effect.
 *
 * Skipped entirely for reduced-motion users and for coarse pointers, where a
 * hover-driven effect has no meaning and would only cost battery.
 */
function bindPointer(
  host: HTMLElement,
  nodes: HTMLElement[],
  layout: WordmarkLayout,
): void {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const centres = layout.glyphs
    .filter((g) => !g.isSpace)
    .map((g) => (g.x + g.width / 2) / layout.naturalWidth);

  const apply = onFrame((ratio: number | null) => {
    for (let i = 0; i < nodes.length; i++) {
      const lift =
        ratio === null
          ? 0
          : Math.max(0, 1 - Math.abs(centres[i]! - ratio) / LIFT_REACH) ** 2;
      nodes[i]!.style.setProperty('--glift', String(lift * LIFT_EM));
    }
  });

  host.addEventListener(
    'pointermove',
    (e) => {
      const box = host.getBoundingClientRect();
      apply(box.width > 0 ? (e.clientX - box.left) / box.width : null);
    },
    { passive: true },
  );
  host.addEventListener('pointerleave', () => apply(null), { passive: true });
}
