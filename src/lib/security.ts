/**
 * THE SECURITY RECORD
 * ============================================================================
 * What this archive can and cannot evidence about security, as one typed
 * registry. The CYBERSECURITY world renders it; nothing on that page is
 * written directly into the markup.
 *
 * ── Why this world exists at all, given §1H.8 ──────────────────────────────
 * M08 audited every repository for security evidence and found that all of it
 * was already published elsewhere: the Bandit log in LEARNING, the lab content
 * and the two platform decisions in PROJECTS. It also established what does
 * NOT exist — no certification, course, CTF placement, engagement, CVE,
 * disclosure, report or client. On that basis M08 concluded the world had no
 * content of its own, and it was held empty through M14.
 *
 * That conclusion was right about the FINDINGS and wrong about the world. A
 * security archive holding no findings still has one thing to publish that no
 * other world can: **the boundary itself** — what is evidenced, what is
 * simulated, and what is explicitly not claimed. That is original content, it
 * is checkable, and on a page about security it is the most load-bearing thing
 * there is. So this world states the boundary and points at the evidence; it
 * does not restate the evidence, which lives in LEARNING and PROJECTS.
 *
 * ── The rule every row here obeys ──────────────────────────────────────────
 * Each entry carries the source it was read out of. If a claim cannot name
 * where it comes from, it does not go in this file, and therefore cannot reach
 * the page. `scripts/verify-output.mjs` §8 and §8c fail the build on the
 * fabrication patterns a security page attracts under content pressure.
 *
 * Sources used, and nothing else:
 *   - `src/content/projects/yushacyber.md`   (verified: true)
 *   - `src/lib/learning.ts`                  (the Cybersecurity strand, FIELD_LOG)
 *   - `src/content.config.ts`                (the `labs` schema)
 *   - PROJECT_PROGRESS §1H.8                 (the M08 content verification)
 */

/** How well the archive can stand behind a row. Mirrors LEARNING's vocabulary. */
export type Basis = 'verified' | 'partly-verified';

/** Somewhere in this archive a reader can go and check the claim. */
export type Pointer = {
  readonly label: string;
  readonly href: string;
};

export type EvidenceRow = {
  /** Stated so it can be checked, never so it sounds impressive. */
  readonly claim: string;
  readonly basis: Basis;
  /** The specific artifact. Numbers here are counted, not estimated. */
  readonly evidence: string;
  readonly where: Pointer;
};

/**
 * What the archive DOES support. Every row is already checkable in another
 * world; this table is the index to it, not a second copy of it.
 */
export const EVIDENCE: readonly EvidenceRow[] = [
  {
    claim: 'Worked OverTheWire Bandit, levels 0 to 13',
    basis: 'verified',
    evidence:
      '19 commits across six days, 13 to 20 August 2026, in the cyber-security repository. Each level has its own written note; the log records what each one turned on.',
    where: { label: 'Field log', href: '/learning#log' },
  },
  {
    claim: 'Built a cybersecurity learning platform',
    basis: 'verified',
    evidence:
      'YushaCyber — a Flask application of fourteen registered blueprints, carrying 48 test files. It runs locally and in Docker; it is not deployed and has no users.',
    where: { label: 'YushaCyber', href: '/projects/yushacyber' },
  },
  {
    claim: 'Authored graded lab content on web-application attack classes',
    basis: 'verified',
    evidence:
      'SQL injection, cross-site scripting, CSRF and file-upload modules inside YushaCyber, each with its own test file. Writing a test for a lab forces the lab to have a correct answer.',
    where: { label: 'YushaCyber', href: '/projects/yushacyber' },
  },
  {
    claim: 'Authored graded lab content on networking',
    basis: 'partly-verified',
    evidence:
      'Five modules — fundamentals, reconnaissance, troubleshooting, topology and an HTTP deep dive — each with its own test file. The first-hand part is SSH, hosts and ports from Bandit 0; the rest is content written, not networks operated.',
    where: { label: 'Register of subjects', href: '/learning#register' },
  },
  {
    claim: 'Applied two security decisions in the platform’s own code',
    basis: 'verified',
    evidence:
      'CSRF protection registered globally through Flask-WTF rather than per form, and rendered markdown sanitised with bleach against an explicit tag-and-attribute allow-list — because lesson and challenge content is markdown, which makes the viewer an injection surface.',
    where: { label: 'YushaCyber', href: '/projects/yushacyber' },
  },
];

export type Boundary = {
  readonly subject: string;
  /** What was actually exercised. */
  readonly done: string;
  /** The denial. Stated flatly, because this is the half that gets dropped. */
  readonly notDone: string;
};

/**
 * THE SIMULATED / REAL BOUNDARY.
 *
 * The most overstatable thing in this archive is tooling: "nmap" and
 * "Wireshark" in a subject list read as scanning and capturing. What actually
 * exists is a simulator written so a mission could be graded. LEARNING already
 * records each denial next to its subject; collecting them here is the point of
 * this world, because a reader checking a security claim should not have to
 * assemble the negative from five separate rows.
 */
export const BOUNDARIES: readonly Boundary[] = [
  {
    subject: 'Port scanning',
    done: 'The flags -p-, -sn, -sV, -sU, -sT, -O and -Pn were exercised against a simulated network written for grading, with filtered ports, a host that drops ICMP, and an OS guess.',
    notDone: 'No scan of a real network is recorded anywhere in this archive.',
  },
  {
    subject: 'Packet analysis',
    done: 'A packet lab, plus the capture, filter, follow and packets commands in the simulated terminal, behind a 536-line test file.',
    notDone: 'No capture of my own is published.',
  },
  {
    subject: 'Capture the flag',
    done: 'YushaCyber’s CTF arena has a schema behind it — challenge categories, challenges, per-user solves and staged hints — and authored challenges to fill it.',
    notDone:
      'That is an arena built, not a competition entered. No placement, ranking or team result exists.',
  },
  {
    subject: 'The AI mentor',
    done: 'A chat endpoint in front of a provider interface, with OpenAI and Anthropic implementations and a mock. It needs a key in the environment; without one the feature reports itself unavailable.',
    notDone:
      'Nothing about it runs locally and nothing about it is trained here. It is a client, not a model.',
  },
];

/**
 * THE NEGATIVE REGISTER.
 *
 * Read straight out of §1H.8, which checked rather than assumed. This is not
 * modesty: on a security page the absent credentials are the ones a reader most
 * needs stated, because every one of them is routinely implied by a tool list.
 *
 * Anything moved off this list must arrive with an artifact, and the `labs`
 * schema is what it has to satisfy — see FILING_STANDARD.
 */
export const NOT_CLAIMED: readonly string[] = [
  'No certification, and no completed course.',
  'No CTF placement, ranking or team result.',
  'No engagement, client, or authorised test of anyone else’s system.',
  'No CVE, disclosure, advisory or report.',
  'No vulnerability found in software belonging to someone else.',
  'No professional security employment, and no years-of-experience figure.',
  'No proficiency level, score or self-rating anywhere on this site.',
];

/**
 * Why the drawer below is empty, stated structurally rather than apologetically.
 * Every clause is a real constraint in `src/content.config.ts`.
 */
export const FILING_STANDARD: readonly string[] = [
  'Every entry declares a discipline — defensive, detection, analysis, hardening, ctf or writeup. There is no general category to fall into.',
  'Anything touching a live target must record its authorisation: own-lab, ctf, authorised-engagement or public-disclosure. Absent that field, the work cannot be filed.',
  'The environment the work was carried out in is recorded on the entry itself, so a finding can never be read apart from where it was obtained.',
  'A CVE identifier is accepted only in the real CVE-YYYY-NNNN form, and only where a disclosed identifier actually exists. It is never inferred.',
  'Nothing renders as fact until a human has marked it verified; drafts are excluded from the build entirely.',
];

/** The standing note, kept in one place because it is also the meta description. */
export const POSTURE = {
  /** What the world is for. */
  purpose:
    'This is where security findings would be filed. None are, and the page says so rather than filling the space.',
  /**
   * The one-sentence statement of what the archive can stand behind. Written to
   * be checkable: every noun in it appears in EVIDENCE with a pointer.
   */
  standing:
    'What this archive can evidence about security is a wargame worked in public, a learning platform built to teach it, and two security decisions taken inside that platform’s own code. Everything else on this page is a boundary or a denial.',
} as const;
