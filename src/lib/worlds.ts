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
 * perforation, a tabulation — drawn in hairlines. The geometry is what
 * distinguishes a world; the ink never changes, and the stock changes only
 * where a world has a material reason (ABOUT is filed on card). See the M04
 * amendment to the token contract in `styles/tokens.css`.
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
  /** Specimen-plate pitch: a dot matrix on a regular sample grid. */
  | 'matrix'
  /** Bare stock with heavy register bars — a classified folder. */
  | 'dossier'
  /** Fine graph paper, as in a lab notebook. */
  | 'graph'
  /** Ledger tabulation: vertical column rules. */
  | 'ledger'
  /** Teletype stock with sprocket-perforated margins. */
  | 'tape';

/**
 * Which entrance choreography a world's gate plays.
 *
 * The gate component and `gate.css` are shared; only the *character* of the
 * entrance differs per world, selected by `[data-gate-kind]`. That is the
 * reusable half of the transition system: adding a world's entrance is a CSS
 * block keyed on its kind, not a new component and not a new script.
 *
 * As of M08, `register` (Home), `drawer` (About), `sheet` (Projects),
 * `traverse` (AI Lab), `ruling` (GitHub) and `leaf` (Learning) are
 * implemented. The other two are declared and fall through to the base gate
 * behaviour, which is a complete, fail-safe entrance in its own right, not a
 * stub. Building them is M09+.
 *
 * A kind carries no duration here. Its timing lives in its CSS block, off the
 * shared clock in tokens.css — see the note in styles/gate.css.
 */
export type Entrance =
  /** HOME — a sheet registered onto a drafting table. Implemented. */
  | 'register'
  /** ABOUT — a catalogue drawer drawn open. Implemented. */
  | 'drawer'
  /** PROJECTS — a folded drawing opened out onto the board. Implemented. */
  | 'sheet'
  /** AI LAB — a specimen slide traversed across the stage. Implemented. */
  | 'traverse'
  /** CYBERSECURITY — a sealed folder broken open. Declared. */
  | 'seal'
  /** LEARNING — a notebook leaf turned on its spine. Implemented. */
  | 'leaf'
  /** GITHUB — the plate ruled away column by column. Implemented. */
  | 'ruling'
  /** CONTACT — a line opened. Declared. */
  | 'transmit';

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
  /** The character of this world's gate entrance. */
  readonly entrance: Entrance;
  /** Registration number printed on the sheet, e.g. `AR-03`. */
  readonly ref: string;
};

/**
 * Gate copy is still placeholder-grade for the two unbuilt worlds: the brief
 * supplied these as "conceptual examples, not final copy". HOME, ABOUT,
 * PROJECTS and AI LAB carry written copy, set when their world was built —
 * which is the right time to write it, because the words and the choreography
 * are one decision.
 *
 * M06 renamed the AI world. It was `ai` at `/ai`, "Experimental Machine Room",
 * which is a mainframe hall — the wrong building for what the work actually
 * is. The route is `/ai-lab` and the world is a laboratory. Nothing is
 * published yet, so the URL was still free to change; after cutover it would
 * have cost a redirect (R10).
 */
export const WORLDS: readonly World[] = [
  {
    id: 'home',
    href: '/',
    nav: 'Home',
    world: 'The Living Archive',
    gateTitle: 'GENERAL ARCHIVE',
    gateEnter: 'OPENING THE ARCHIVE',
    summary:
      'A working archive of software, machine-learning and security engineering by Ayush Rijal.',
    ground: 'grid',
    entrance: 'register',
    ref: 'AR-00',
  },
  {
    id: 'about',
    href: '/about',
    nav: 'About',
    world: 'Personal Archive',
    gateTitle: 'PERSONAL RECORD',
    gateEnter: 'OPENING THE RECORD',
    summary:
      'The personal record of Ayush Rijal — identity, current chapter, working method and what is being learned.',
    ground: 'ruled',
    entrance: 'drawer',
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
    entrance: 'sheet',
    ref: 'AR-02',
  },
  {
    id: 'ai-lab',
    href: '/ai-lab',
    nav: 'AI Lab',
    world: 'Experimental Laboratory',
    gateTitle: 'EXPERIMENTAL LABORATORY',
    gateEnter: 'ENTERING THE LABORATORY',
    summary:
      'How intelligence gets built here: the systems, the pipelines, and the experiments — including the ones with no measured result.',
    ground: 'matrix',
    entrance: 'traverse',
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
    entrance: 'seal',
    ref: 'AR-04',
  },
  {
    id: 'learning',
    href: '/learning',
    nav: 'Learning',
    world: 'Field Notebook',
    gateTitle: 'FIELD NOTES',
    gateEnter: 'OPENING THE NOTEBOOK',
    summary:
      'What is being learned and what the evidence for it is — a register of subjects with their standing, a dated field log, and the questions still open.',
    ground: 'graph',
    entrance: 'leaf',
    ref: 'AR-05',
  },
  {
    id: 'github',
    href: '/github',
    nav: 'GitHub',
    world: 'Public Code Archive',
    gateTitle: 'PUBLIC SOURCE',
    gateEnter: 'OPENING THE SOURCE ARCHIVE',
    summary:
      'Every public repository, as GitHub reports it — the part of the story that can be inspected rather than described.',
    ground: 'ledger',
    entrance: 'ruling',
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
    entrance: 'transmit',
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
