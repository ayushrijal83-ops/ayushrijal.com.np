/**
 * THE CORRESPONDENCE RECORD
 * ============================================================================
 * What the CONTACT world prints, and the only place its claims live. Same
 * mechanism as `lib/profile.ts` and `lib/learning.ts`: a channel cannot reach
 * the page without being added here on purpose.
 *
 * ── Why contact details need the same discipline as credentials ────────────
 * A wrong address is worse than a missing one. A visitor who writes to it gets
 * nothing back and concludes they were ignored, which is a failure the archive
 * never sees and cannot correct. So every value below was read out of a source
 * that Ayush published himself, and the source is named next to it.
 *
 * ── What was checked, in M09 ───────────────────────────────────────────────
 * `contact.html` on the live V1 site (branch `main`) carries six outbound
 * channels. The GitHub REST profile carries none — `email`, `blog`,
 * `location`, `company`, `twitter_username` and `bio` are all null, which is
 * itself worth knowing: nothing on the page may be sourced from there.
 *
 * Three of V1's six are listed here. The other three — two personal social
 * accounts and a WhatsApp link containing a mobile number — are NOT, and the
 * reason is not that they failed verification. They are real. They are:
 *
 *   1. not correspondence. This world is a channel for writing to a person
 *      about work, and a social index is a different page that this archive
 *      does not have;
 *   2. in the case of the phone number, a standing privacy cost with no
 *      matching benefit. It is public on V1 today, so listing it here would
 *      disclose nothing new — but V2 is a deliberate rebuild, and carrying a
 *      personal mobile number forward should be an explicit decision by its
 *      owner rather than a default inherited from a page being replaced.
 *
 * That decision is recorded in PROJECT_PROGRESS §1I.4 and flagged for the
 * architect. Reversing it is three lines in the array below.
 */

export type Channel = {
  readonly label: string;
  /** What the visitor reads and can copy. */
  readonly value: string;
  readonly href: string;
  /** Where this value was read from. Never "because I remembered it". */
  readonly verifiedBy: string;
  /** True for the one channel the page actually recommends. */
  readonly primary?: boolean;
};

export const CHANNELS: readonly Channel[] = [
  {
    label: 'Email',
    value: 'ayushrijal83@gmail.com',
    // A subject line, so a correspondence arrives already filed. No JavaScript
    // is involved: this is a plain `mailto:` the browser hands to a mail
    // client, and the address is also the link text, so it can be copied by
    // anyone who has no client registered.
    href: 'mailto:ayushrijal83@gmail.com?subject=Correspondence',
    verifiedBy: 'Published on the current site',
    primary: true,
  },
  {
    label: 'GitHub',
    value: 'github.com/ayushrijal83-ops',
    href: 'https://github.com/ayushrijal83-ops',
    verifiedBy: 'The account this archive is compiled from',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/ayush-rijal-429516410',
    href: 'https://www.linkedin.com/in/ayush-rijal-429516410/',
    verifiedBy: 'Published on the current site',
  },
];

/**
 * What a correspondence here can be about.
 *
 * Deliberately NOT headed "open for" or "available for". Those are claims
 * about availability, and this archive holds no employment status, no notice
 * period and no capacity — see `UNLISTED`. These five are subjects, which is a
 * different kind of statement and one that cannot be false.
 */
export const MATTERS: readonly { name: string; gloss: string }[] = [
  {
    name: 'Building',
    gloss:
      'Something you want made, or something half-made that needs a second pair of hands on it.',
  },
  {
    name: 'Collaboration',
    gloss:
      'Work with more than one person in it. I have not done much of this, which is part of why I would like to.',
  },
  {
    name: 'Technical discussion',
    gloss:
      'An argument about an approach. Disagreement is the useful kind of message — this archive publishes what it got wrong, and would rather hear it early.',
  },
  {
    name: 'The work filed here',
    gloss:
      'A question about something in this archive, or a correction to it. Corrections are answered first.',
  },
  {
    name: 'Questions and ideas',
    gloss: 'Including the ones that are not finished yet. Especially those.',
  },
];

/**
 * Facts a contact page is normally expected to assert, none of which exists.
 *
 * Named individually rather than left out, for the same reason ABOUT names its
 * unrecorded fields and LEARNING names what its notebook does not contain: the
 * specific absences are the ones a reader would otherwise assume were being
 * implied. A page that simply omits "rates" reads as expensive.
 */
export const UNLISTED: readonly string[] = [
  'Availability',
  'Rates',
  'Location',
  'Employment status',
  'Response time',
];
