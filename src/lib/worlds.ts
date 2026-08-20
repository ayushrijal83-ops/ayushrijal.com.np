/**
 * THE EIGHT WORLDS
 * ============================================================================
 * The approved information architecture, as one typed registry. Navigation,
 * routing metadata, the section-transition gate copy and each world's visual
 * ground all read from here, so the eight worlds can never drift apart across
 * eight hand-edited pages (the exact defect catalogued in PROJECT_PROGRESS §3).
 *
 * Adding or removing a world is an architectural review decision, not a code
 * change — see the M02 brief §3.
 */

/**
 * The paper each world is printed on.
 *
 * This is the mechanism that keeps "every section has its own distinct visual
 * world" from degrading into "every section has a different background colour",
 * which the brief explicitly forbids. A ground is a *structure* — a ruling, a
 * perforation, a tabulation — drawn in hairlines on the same warm stock. The
 * geometry differs; the paper and the ink never do.
 *
 * Implemented in `src/styles/worlds.css`, keyed on `[data-world]`.
 */
export type Ground =
  /** Blueprint module. Registration grid of the whole archive. */
  | 'grid'
  /** Index-card ruling: horizontal lines only, like a catalogue card. */
  | 'ruled'
  /** Engineering drawing sheet: coarse module, fine subdivisions. */
  | 'drafting'
  /** Punch-card / dot-matrix perforation. */
  | 'matrix'
  /** Bare stock with heavy register bars — a classified folder. */
  | 'dossier'
  /** Fine graph paper, as in a lab notebook. */
  | 'graph'
  /** Ledger tabulation: vertical column rules. */
  | 'ledger'
  /** Teletype stock with sprocket-perforated margins. */
  | 'tape';

export type World = {
  /** Stable key. Also the `data-world` attribute value. */
  readonly id: string;
  /** Route. `/` for HOME. */
  readonly href: string;
  /** Navigation label. */
  readonly nav: string;
  /**
   * The world's own name for itself — the conceptual world, not the nav item.
   * Rendered by the transition gate and the world masthead.
   */
  readonly world: string;
  /** Gate line 1: the archival classification of the section. */
  readonly gateTitle: string;
  /** Gate line 2: the act of entering it. */
  readonly gateEnter: string;
  /** One-sentence description. Used for `<meta name="description">`. */
  readonly summary: string;
  readonly ground: Ground;
  /** Registration number printed on the sheet, e.g. `AR-03`. */
  readonly ref: string;
};

/**
 * Gate copy below is placeholder-grade by instruction: the brief supplies these
 * as "conceptual examples, not final copy". The *system* is the deliverable;
 * the wording is a design-review item for M03.
 */
export const WORLDS: readonly World[] = [
  {
    id: 'home',
    href: '/',
    nav: 'Home',
    world: 'The Living Archive',
    gateTitle: 'GENERAL ARCHIVE',
    gateEnter: 'ENTERING THE COLLECTION',
    summary:
      'A working archive of software, machine-learning and security engineering by Ayush Rijal.',
    ground: 'grid',
    ref: 'AR-00',
  },
  {
    id: 'about',
    href: '/about',
    nav: 'About',
    world: 'Personal Archive',
    gateTitle: 'PERSONAL RECORD',
    gateEnter: 'ENTERING THE ARCHIVE',
    summary: 'Background, working method and current focus.',
    ground: 'ruled',
    ref: 'AR-01',
  },
  {
    id: 'projects',
    href: '/projects',
    nav: 'Projects',
    world: 'Engineering Workshop',
    gateTitle: 'PROJECT ARCHIVE',
    gateEnter: 'ENTERING THE WORKSHOP',
    summary: 'Engineering work, in build order, with the reasoning kept in.',
    ground: 'drafting',
    ref: 'AR-02',
  },
  {
    id: 'ai',
    href: '/ai',
    nav: 'AI Lab',
    world: 'Experimental Machine Room',
    gateTitle: 'EXPERIMENTAL COMPUTING',
    gateEnter: 'ENTERING THE MACHINE ROOM',
    summary: 'Machine-learning experiments, their setups and their results.',
    ground: 'matrix',
    ref: 'AR-03',
  },
  {
    id: 'cybersecurity',
    href: '/cybersecurity',
    nav: 'Security',
    world: 'Security Research Archive',
    gateTitle: 'SECURITY RESEARCH',
    gateEnter: 'ENTERING THE SECURITY ARCHIVE',
    summary: 'Defensive security research, lab write-ups and findings.',
    ground: 'dossier',
    ref: 'AR-04',
  },
  {
    id: 'learning',
    href: '/learning',
    nav: 'Learning',
    world: 'Field Notebook',
    gateTitle: 'FIELD NOTES',
    gateEnter: 'OPENING THE NOTEBOOK',
    summary: 'Notes taken while learning, kept in the order they were written.',
    ground: 'graph',
    ref: 'AR-05',
  },
  {
    id: 'github',
    href: '/github',
    nav: 'GitHub',
    world: 'Code Repository',
    gateTitle: 'SOURCE INDEX',
    gateEnter: 'ENTERING THE REPOSITORY',
    summary: 'Public repositories and activity, compiled at build time.',
    ground: 'ledger',
    ref: 'AR-06',
  },
  {
    id: 'contact',
    href: '/contact',
    nav: 'Contact',
    world: 'Transmission Room',
    gateTitle: 'OPEN CHANNEL',
    gateEnter: 'ENTERING THE TRANSMISSION ROOM',
    summary: 'How to make contact.',
    ground: 'tape',
    ref: 'AR-07',
  },
] as const;

const BY_ID = new Map(WORLDS.map((w) => [w.id, w]));

/**
 * Throws rather than returning undefined: a missing world is a build-time
 * authoring error, and failing the build is the correct response to it.
 */
export function getWorld(id: string): World {
  const world = BY_ID.get(id);
  if (!world) {
    throw new Error(
      `Unknown world "${id}". Known worlds: ${WORLDS.map((w) => w.id).join(', ')}.`,
    );
  }
  return world;
}
