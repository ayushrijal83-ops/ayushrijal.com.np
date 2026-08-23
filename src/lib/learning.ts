/**
 * THE LEARNING RECORD
 * ============================================================================
 * What the FIELD NOTEBOOK world prints, and the only place its claims live.
 * Same mechanism as `lib/profile.ts`: a page cannot state something about what
 * is being learned without adding it here on purpose.
 *
 * ── The rule this file exists to enforce ───────────────────────────────────
 * A skills page is the single easiest place in a portfolio to lie, because the
 * usual format — a technology name and a percentage — has no truth conditions
 * at all. "Python 90%" cannot be checked, so it cannot be wrong.
 *
 * So nothing here carries a level. Every subject carries two fields instead,
 * and both CAN be wrong:
 *
 *   STANDING — what was actually done with it. One of five, and they are not
 *              a ranking: BUILT is not better than CURRENTLY LEARNING, it is
 *              a different verifiable claim.
 *   BASIS    — whether anyone else can check. `verified` means an inspectable
 *              artifact exists and is named. `stated` means the owner said so
 *              and nothing in the archive backs it, which is a perfectly
 *              honest thing for a notebook to record — as long as it says so.
 *
 * Every `verified` line below was read out of source during M08: the public
 * repositories through the GitHub API, `YushaCyber` from the local clone
 * verified in M05, and the AI capabilities from the M06 audit recorded in
 * PROJECT_PROGRESS §1F.3. Nothing was carried over from V1's copy, which
 * §9.4 records as never having been checked.
 */

/**
 * What was done with a subject. Deliberately NOT a proficiency scale.
 *
 * `not-attempted` is one of these because the most useful line on a page about
 * learning is often the one saying a thing was never done. Training a model is
 * the example that earned it: every model in this archive arrived trained, and
 * saying so is worth more than any claim the page could make instead.
 */
export type Standing =
  | 'built'
  | 'experimented'
  | 'learning'
  | 'exploring'
  | 'not-attempted';

/** Whether the standing can be checked by someone else. */
export type Basis = 'verified' | 'partly-verified' | 'stated';

export const STANDING_LABEL: Readonly<Record<Standing, string>> = {
  built: 'Built',
  experimented: 'Experimented',
  learning: 'Currently learning',
  exploring: 'Exploring',
  'not-attempted': 'Not attempted',
};

export const BASIS_LABEL: Readonly<Record<Basis, string>> = {
  verified: 'Verified',
  'partly-verified': 'Partly verified',
  stated: 'Stated',
};

export type Subject = {
  readonly name: string;
  readonly standing: Standing;
  readonly basis: Basis;
  /** What can be inspected, named precisely enough to be checked. */
  readonly evidence: string;
  /** Where in this archive the evidence is set out at length. */
  readonly href?: string;
};

export type Strand = {
  readonly name: string;
  readonly subjects: readonly Subject[];
};

/**
 * The register. Grouped by strand rather than sorted by standing: the strands
 * are how the work actually divides, and sorting by standing would rank the
 * subjects, which is the percentage bar reintroduced as an ordering.
 */
export const STRANDS: readonly Strand[] = [
  {
    name: 'AI and language models',
    subjects: [
      {
        name: 'Local language models',
        standing: 'experimented',
        basis: 'verified',
        evidence:
          'ollama==0.3.3 with AIBrain(model="mistral") in jarvis_assistant; qwen2.5:0.5b served at localhost:11434, temperature 0.3, an 80-token cap and a 20-second timeout, in x-man.',
        href: '/ai-lab',
      },
      {
        name: 'Hosted language models',
        standing: 'experimented',
        basis: 'verified',
        evidence:
          'OpenAI and Anthropic behind one provider interface in YushaCyber; GPT-4o and Gemini 1.5 Flash in beach_buggy_ai. Every one of them key-gated, and each reports itself unavailable without a key.',
        href: '/ai-lab',
      },
      {
        name: 'Computer vision',
        standing: 'experimented',
        basis: 'verified',
        evidence:
          'MediaPipe Hands and Face Mesh, OpenCV, DeepFace, and MobileNetV2 carrying stock ImageNet weights.',
        href: '/ai-lab',
      },
      {
        name: 'Speech recognition and synthesis',
        standing: 'experimented',
        basis: 'verified',
        evidence:
          'Vosk KaldiRecognizer running continuously at 16 kHz, faster-whisper small loaded per command, pyttsx3 on the way out.',
        href: '/ai-lab',
      },
      {
        name: 'Training a model',
        standing: 'not-attempted',
        basis: 'verified',
        evidence:
          'No .fit(, no train_test_split, no fine-tune and no saved weights in any repository. Every model in this archive arrived already trained.',
        href: '/ai-lab',
      },
    ],
  },
  {
    name: 'Programming',
    subjects: [
      {
        name: 'Python',
        standing: 'built',
        basis: 'verified',
        evidence:
          'The primary language of five public repositories, the largest of them a Flask application of roughly 3.4 MB of Python.',
        href: '/github',
      },
      {
        name: 'Web development',
        standing: 'built',
        basis: 'verified',
        evidence:
          'This site is Astro and TypeScript, built to static files. Three repositories are Flask with Jinja templates, their own stylesheets and their own client JavaScript.',
        href: '/projects',
      },
      {
        name: 'Automation',
        standing: 'built',
        basis: 'verified',
        evidence:
          'PyAutoGUI and pynput driving a real desktop, held behind an application whitelist, a key allow-list, a 120-character typing cap, rate limiting and a confirmation on the close-window hotkey.',
        href: '/ai-lab',
      },
      {
        name: 'C',
        standing: 'exploring',
        basis: 'stated',
        evidence:
          'No public artifact. It is in this register because it is being studied, not because it has been used for anything the archive can show you.',
      },
    ],
  },
  {
    name: 'Cybersecurity',
    subjects: [
      {
        name: 'The Linux shell',
        standing: 'learning',
        basis: 'verified',
        evidence:
          'OverTheWire Bandit, levels 0 to 13, worked in public: 19 commits across six days between 13 and 20 August 2026, each level with its own written note.',
        href: '#log',
      },
      {
        name: 'Networking',
        standing: 'learning',
        basis: 'partly-verified',
        evidence:
          'SSH, hosts and ports from Bandit 0. Beyond that, five lab modules in YushaCyber — fundamentals, reconnaissance, troubleshooting, topology and an HTTP deep dive — each with its own test file.',
      },
      {
        name: 'Nmap',
        standing: 'learning',
        basis: 'verified',
        evidence:
          'A simulated scanner was written so the mission could be graded: -p-, -sn, -sV, -sU, -sT, -O and -Pn against a virtual network with filtered ports, a host that drops ICMP, and an OS guess. Running nmap against a real network is not recorded here.',
        href: '#method',
      },
      {
        name: 'Packet analysis',
        standing: 'learning',
        basis: 'verified',
        evidence:
          'A packet lab, and the capture, filter, follow and packets commands in the simulated terminal, behind a 536-line test file. No capture of my own is published.',
        href: '#method',
      },
      {
        name: 'Web application security',
        standing: 'exploring',
        basis: 'verified',
        evidence:
          'SQL injection, XSS, CSRF and file-upload modules in YushaCyber, each with its own tests — and two decisions in the platform itself: CSRF protection applied globally, and rendered markdown sanitised with bleach against an allow-list.',
        href: '/projects/yushacyber',
      },
    ],
  },
  {
    name: 'Systems and hardware',
    subjects: [
      {
        name: 'Machines and peripherals',
        standing: 'exploring',
        basis: 'partly-verified',
        evidence:
          'The vision and speech work runs against a real camera and microphone, and its constants belong to one machine — 1280×720 captured and 320×240 inferred, capture stopping 450 ms after the signal drops below energy 400. Beyond that, hardware is an interest in the personal record with nothing filed under it.',
        href: '/about',
      },
    ],
  },
  {
    name: 'Away from the machine',
    subjects: [
      {
        name: 'German',
        standing: 'learning',
        basis: 'stated',
        evidence:
          'Recorded in the personal record. It produces no artifact this archive can hold, and no level, module or examination is claimed.',
        href: '/about',
      },
      {
        name: "Bachelor's degree, Lincoln University",
        standing: 'learning',
        basis: 'stated',
        evidence:
          'From the personal record. No dates, modules, marks or graduation date appear anywhere on this site, because none were supplied.',
        href: '/about',
      },
    ],
  },
];

/**
 * THE FIELD LOG — OverTheWire Bandit, levels 0 to 13.
 *
 * Read out of `ayushrijal83-ops/cyber-security` during M08: the level notes
 * for the content, the commit log for the dates. Each row states what the
 * level turned on, from the note that was written for it.
 *
 * The level PASSWORDS are in those notes and are NOT reproduced here. They are
 * public wargame answers rather than anyone's secret, which is exactly why
 * republishing them would be pointless as well as rude.
 */
export type LogEntry = {
  /** e.g. `0 → 1`. */
  readonly level: string;
  /** ISO date of the commit that filed it. */
  readonly date: string;
  readonly learned: string;
  /** A command that got a separate note of its own, beyond the level's needs. */
  readonly sideNote?: string;
};

export const FIELD_LOG: readonly LogEntry[] = [
  {
    level: '0 → 1',
    date: '2026-08-13',
    learned:
      'SSH as three parts — user, host, port. The default is 22; this server answers on 2220.',
    sideNote: 'SSH',
  },
  {
    level: '1 → 2',
    date: '2026-08-13',
    learned:
      'A file named "-". cat - waits on standard input instead of reading it; cat ./- says "this is a path, not a flag".',
  },
  {
    level: '2 → 3',
    date: '2026-08-13',
    learned:
      'Spaces inside a filename. The shell splits on them, so each one has to be escaped or one argument becomes four.',
  },
  {
    level: '3 → 4',
    date: '2026-08-14',
    learned:
      'Hidden files, and ls -la as the only way to see that they are there at all.',
  },
  {
    level: '4 → 5',
    date: '2026-08-14',
    learned:
      'Ten files, one of them readable. file ./* reports what is actually inside each one rather than what its name suggests.',
  },
  {
    level: '5 → 6',
    date: '2026-08-14',
    learned:
      'Finding by size and permission — and the trap underneath it: two files matched every criterion and one was noise. Narrowing a search is not the same as identifying a file.',
  },
  {
    level: '6 → 7',
    date: '2026-08-16',
    learned:
      'The same search across the whole filesystem from /, by owner, group and exact size, with the permission errors suppressed.',
    sideNote: '/dev/null',
  },
  {
    level: '7 → 8',
    date: '2026-08-17',
    learned:
      'A file far too large to read. grep for the one word standing next to the answer.',
  },
  {
    level: '8 → 9',
    date: '2026-08-17',
    learned:
      'The line that occurs exactly once, found by sorting first and counting second — because uniq only ever compares neighbours.',
    sideNote: 'sort, uniq',
  },
  {
    level: '9 → 10',
    date: '2026-08-19',
    learned:
      'Binary data with readable text buried in it. strings pulls out what a human can read, then grep narrows it.',
    sideNote: 'strings',
  },
  {
    level: '10 → 11',
    date: '2026-08-19',
    learned:
      'Base64: what it is for, why it is not encryption, and how to reverse it.',
    sideNote: 'Base64',
  },
  {
    level: '11 → 12',
    date: '2026-08-20',
    learned:
      'ROT13, rotated through tr — a substitution written as a character mapping rather than as a program.',
  },
  {
    level: '12 → 13',
    date: '2026-08-20',
    learned:
      'A hex dump of a file compressed over and over with different tools. xxd -r back to binary, then identify and unpack, repeatedly, until the format stops changing.',
  },
];

/** Where the log came from, and what the repository claims about itself. */
export const LOG_SOURCE = {
  repo: 'https://github.com/ayushrijal83-ops/cyber-security',
  wargame: 'https://overthewire.org/wargames/bandit/',
  commits: 19,
  activeDays: 6,
  from: '2026-08-13',
  to: '2026-08-20',
  created: '2026-08-11',
  /**
   * The repository's own description, verbatim, including its grammar. Held
   * next to the record rather than instead of it — the same two-layer
   * treatment the GitHub world gives YushaCyber's "thriving community".
   */
  statedIntent: 'I will going to upload daily basis for 6 months.',
  /** Commands that got a separate note of their own, beyond the level. */
  sideNotes: 6,
} as const;

/**
 * RE-IMPLEMENTATION — the method, in three verified instances.
 *
 * This is the one editorial claim the world makes, and it is made because the
 * source keeps making it: the response to not understanding a tool here is to
 * write a version of it. Each instance below is a file that exists, with its
 * length as read from the repository.
 */
export const METHOD: readonly {
  tool: string;
  built: string;
  scale: string;
}[] = [
  {
    tool: 'The shell',
    built:
      'A shell over a virtual filesystem: 54 commands, pipes, redirection, variable assignment and expansion, command substitution, and single-line if and for. Its own docstring says it exists so the terminal behaves "like a real (sandboxed) shell rather than fake string-matching".',
    scale: '297 lines of shell, 1,195 of commands',
  },
  {
    tool: 'Nmap',
    built:
      'A scanner over a virtual network — hosts, services and versions, filtered ports, a host that drops ICMP, UDP, and an OS guess — so a scanning exercise could be graded on what was actually run.',
    scale: '358 lines of network, 484 of tests',
  },
  {
    tool: 'A packet analyser',
    built:
      'A packet lab with capture, display filters and stream following, addressed by the same simulated terminal as everything else.',
    scale: '409 lines of packets, 536 of tests',
  },
];

/**
 * OPEN QUESTIONS.
 *
 * Each is keyed to an entry in the `experiments` collection whose `result`
 * field records the absence the question is about. The page looks every id up
 * and throws if one is missing, so deleting an experiment breaks the build
 * rather than leaving a question hanging over nothing.
 *
 * This is the notebook's most valuable page. Every one of these is a thing
 * that was built, shipped, and never measured.
 */
export const OPEN_QUESTIONS: readonly { experiment: string; question: string }[] =
  [
    {
      experiment: 'classifier-aimed-at-a-domain',
      question:
        'How often is the five-crop mapping right? There is no labelled test set, so there is no number — and building one is the work, not running the model again.',
    },
    {
      experiment: 'attention-as-an-input',
      question:
        'Does an assistant that knows whether it is being looked at actually answer better? The mechanism works. Whether it helps was never tested.',
    },
    {
      experiment: 'two-recognisers-instead-of-one',
      question:
        'What does the two-recogniser split actually cost and save? Latency and word error rate were never measured for either model.',
    },
    {
      experiment: 'hand-tilt-as-a-steering-axis',
      question:
        'What frame rate and false-trigger rate does hand steering run at? The thresholds were set by playing the game, not by instrumenting it.',
    },
    {
      experiment: 'a-small-model-on-purpose',
      question:
        'How often does the 0.5B model hand over to its rule-based fallback, and how good are its answers when it does not? Neither was recorded.',
    },
  ];

/**
 * What this notebook does not contain. Named individually, for the same reason
 * ABOUT names its unrecorded fields: these are the specific things a reader
 * would otherwise assume were being implied.
 */
export const NOT_RECORDED: readonly string[] = [
  'Certifications',
  'Completed courses',
  'Proficiency levels',
  'Years of experience',
  'CTF placements',
  'Security engagements',
  'Trained models',
];
