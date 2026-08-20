/**
 * The Home island. Boots System A, then System B, and joins them: the
 * wordmark's real geometry becomes the exclusion the editorial text flows
 * around.
 *
 * Order matters. The wordmark is measured and scaled first, so by the time the
 * field asks for an exclusion the wordmark's box is final rather than mid-fit.
 */

import { mountEditorialFields, type Exclusion } from './editorial-field.js';
import { mountWordmarks } from './wordmark.js';

const NONE: Exclusion = { top: 0, bottom: 0, width: 0 };

/** Space between the wordmark and the first character set beside it. */
const GUTTER = 32;

async function boot(): Promise<void> {
  const wordmark = document.querySelector<HTMLElement>('[data-wordmark]');

  await mountWordmarks();

  await mountEditorialFields(document, {
    observe: wordmark ? [wordmark] : [],
    exclusion: (stage) => {
      if (!wordmark) return NONE;

      const w = wordmark.getBoundingClientRect();
      const s = stage.getBoundingClientRect();
      if (w.width === 0) return NONE;

      // Below the breakpoint the wordmark is static and sits *above* the
      // field, so its box never overlaps the text column. Detecting that
      // geometrically means the breakpoint lives in CSS only — this module
      // does not need to know what it is.
      if (w.bottom <= s.top || w.right <= s.left) return NONE;

      return {
        top: w.top - s.top,
        bottom: w.bottom - s.top + GUTTER,
        width: Math.max(0, w.right - s.left + GUTTER),
      };
    },
  });
}

void boot();
