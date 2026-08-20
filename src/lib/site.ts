/**
 * Site-wide constants. Single source of truth for anything that would
 * otherwise get copy-pasted into a <head> — the exact failure mode V1 had
 * across its six hand-written documents (PROJECT_PROGRESS §3).
 */

export const SITE = {
  url: 'https://ayushrijal.com.np',
  title: 'Ayush Rijal',
  /** Used as the <title> suffix and in structured data. */
  role: 'Software · AI · Cybersecurity',
  description:
    'A working archive of software, machine-learning and security engineering by Ayush Rijal.',
  locale: 'en',
  lang: 'en',
  author: 'Ayush Rijal',
  github: 'ayushrijal83-ops',
} as const;

/**
 * Archive reference number for a page, e.g. `AR-03`. The archive conceit needs
 * every sheet to carry a registration mark; this generates it from the world
 * index so no component hardcodes one.
 */
export function sheetRef(index: number): string {
  return `AR-${String(index).padStart(2, '0')}`;
}
