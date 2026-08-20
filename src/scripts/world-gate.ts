/**
 * SECTION TRANSITION SYSTEM — the exit half.
 * ============================================================================
 * The *entrance* gate is pure CSS (`styles/gate.css`) and needs no JavaScript
 * at all. It is written so its no-animation state is the finished state, which
 * means a reduced-motion user, a CSS failure or an old engine all land on
 * "content visible" rather than "content hidden behind an overlay". Content
 * visibility never depends on animation — the safety principle carried over
 * from V1's scroll-reveal (PROJECT_PROGRESS §5).
 *
 * This module adds the other half: playing the gate *out* before leaving a
 * world, so the two halves join across a navigation and the visitor reads
 * "ENTERING THE WORKSHOP" as one continuous move.
 *
 * Every failure mode here degrades to an ordinary link:
 *   - reduced motion            → not bound at all
 *   - modified / non-left click → left alone, so ⌘-click still opens a tab
 *   - cross-origin or download  → left alone
 *   - animation never fires     → a timeout navigates anyway
 *
 * M02 scope: this is the reusable capability, not its final choreography.
 * Tuning the gate — and deciding whether it becomes a same-document view
 * transition — is an M03 design-review item.
 */

import { prefersReducedMotion } from './motion.js';

/** Hard ceiling on how long a navigation may be delayed, in ms. */
const MAX_DELAY = 420;

export function bindWorldGate(root: ParentNode = document): void {
  const gate = root.querySelector<HTMLElement>('[data-gate]');
  if (!gate || prefersReducedMotion()) return;

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>(
      'a[data-world-link]',
    );
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname) return; // same world; nothing to cross.

    event.preventDefault();
    leave(gate, url.href);
  });
}

function leave(gate: HTMLElement, href: string): void {
  let navigated = false;
  const go = () => {
    if (navigated) return;
    navigated = true;
    location.assign(href);
  };

  // Whichever comes first: the animation finishing, or the ceiling. A gate
  // that silently fails to animate must not strand the visitor on the page.
  gate.addEventListener('animationend', go, { once: true });
  setTimeout(go, MAX_DELAY);

  gate.dataset.state = 'leaving';
}
