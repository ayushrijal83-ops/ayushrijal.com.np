import { defineCollection } from 'astro:content';
// Namespace import rather than `import { z } from 'astro:content'`: Astro 7
// bundles Zod 4, whose `z` *binding* is deprecated in favour of a namespace
// import. Same schema builders, no deprecation warnings, and it keeps `astro
// check` at zero warnings so a real warning is never lost in noise.
import * as z from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * CONTENT SCHEMAS
 * ============================================================================
 * Schema-driven content infrastructure for the four content-bearing worlds.
 *
 * Deliberately EMPTY of entries at M02. The brief forbids inventing or
 * migrating unverified content, and PROJECT_PROGRESS §9.4 records that V1's
 * biography, timeline and skills copy has never been checked against reality.
 * The schemas are the M02 deliverable; entries land only after the content
 * verification session with Ayush.
 *
 * Schema design rules applied throughout:
 *   1. Anything that could become a fabricated claim is OPTIONAL. A missing
 *      field renders as "not recorded", never as an invented value.
 *   2. Every entry carries `verified`. Nothing renders as fact until a human
 *      has confirmed it. `draft` entries are excluded from production builds.
 *   3. Dates are real `Date` objects, so ordering is not string luck.
 *   4. No field is free-form where an enum would do — enums are what let a
 *      world render a consistent visual register per status.
 */

/** Fields every archive entry carries, whichever world files it. */
const archiveBase = {
  title: z.string().min(1),
  /** Sentence-length. Used for cards, indexes and meta description. */
  summary: z.string().min(1).max(280),
  /** When the work happened — not when the file was written. */
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  /**
   * False until a human has confirmed every claim in the entry. Unverified
   * entries render with an explicit provisional marker rather than silently
   * passing as fact.
   */
  verified: z.boolean().default(false),
  /** Excluded from production builds entirely. */
  draft: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  /** Overrides the slug derived from the filename. */
  slug: z.string().optional(),
};

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...archiveBase,
    status: z.enum(['active', 'shipped', 'archived', 'paused']),
    role: z.string().optional(),
    /** Free-text on purpose: a stack list is not a closed set. */
    stack: z.array(z.string()).default([]),
    repo: z.url().optional(),
    demo: z.url().optional(),
    /**
     * Only for work that should lead the workshop index. Ordering among
     * featured entries is by `date`.
     */
    featured: z.boolean().default(false),
  }),
});

const labs = defineCollection({
  loader: glob({ base: './src/content/labs', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...archiveBase,
    /**
     * Defensive posture is recorded explicitly so the security world can never
     * present offensive work without its context.
     */
    discipline: z.enum([
      'defensive',
      'detection',
      'analysis',
      'hardening',
      'ctf',
      'writeup',
    ]),
    /** The environment the work was done in. Kept honest and specific. */
    environment: z.string().optional(),
    /**
     * Present only where a real, disclosed identifier exists. Never inferred.
     */
    cve: z.array(z.string().regex(/^CVE-\d{4}-\d{4,}$/)).default([]),
    /** Authorisation context. Required for anything touching a live target. */
    authorisation: z
      .enum(['own-lab', 'ctf', 'authorised-engagement', 'public-disclosure'])
      .optional(),
    severity: z.enum(['informational', 'low', 'medium', 'high']).optional(),
  }),
});

const learning = defineCollection({
  loader: glob({ base: './src/content/learning', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...archiveBase,
    /** The notebook is chronological; this is the field-note register. */
    kind: z.enum(['note', 'reading', 'problem', 'retrospective']),
    /** What the note is about, one subject per entry. */
    subject: z.string().optional(),
    /**
     * Deliberately NOT a completion percentage or a skill level. The brief
     * forbids fabricated credentials, and self-rated proficiency is exactly
     * the kind of unverifiable claim that becomes one.
     */
    source: z
      .object({ label: z.string(), url: z.url().optional() })
      .optional(),
  }),
});

const experiments = defineCollection({
  loader: glob({ base: './src/content/experiments', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...archiveBase,
    /** An experiment reports an outcome, including a negative one. */
    outcome: z.enum(['succeeded', 'failed', 'inconclusive', 'running']),
    hypothesis: z.string().optional(),
    /** Models/datasets/hardware, only where actually used. */
    apparatus: z.array(z.string()).default([]),
    /**
     * Free-form measured results. Optional because an experiment with no
     * numbers must be able to say so rather than have some invented.
     */
    result: z.string().optional(),
    notebook: z.url().optional(),
  }),
});

export const collections = { projects, labs, learning, experiments };
