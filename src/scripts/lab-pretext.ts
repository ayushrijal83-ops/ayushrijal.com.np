/**
 * PRETEXT PROTOTYPE INSTRUMENT
 * ============================================================================
 * The isolated evaluation rig the M02 brief requires before Pretext is allowed
 * anywhere near production. It exists to produce *numbers*, not a demo.
 *
 * Three questions, three measurements:
 *
 *  1. What does `prepareWithSegments()` cost? One-time, per text + font.
 *  2. What does a re-layout at a new width cost? This is the hot path, and the
 *     whole argument for the library rests on it being cheap.
 *  3. What does the honest alternative cost? The baseline is not "CSS", which
 *     is free — it is *asking CSS a question*: set a width, read the height.
 *     That forces synchronous reflow, which is the cost Pretext removes.
 *
 * Measurement notes, so the numbers are neither overstated nor understated:
 *   - The DOM baseline reads `offsetHeight` after each width write, which is
 *     what actually forces layout. Without the read the browser batches the
 *     writes and the comparison would be meaningless.
 *   - The probe MUST be in normal flow. An earlier version of this rig used an
 *     absolutely-positioned, visibility-hidden probe, and measured 14 µs per
 *     DOM query against 8 µs for Pretext — a 1.8x result that made the library
 *     look barely worth having. That number was wrong: an out-of-flow element
 *     invalidates almost nothing, so reflowing it is nearly free. The same
 *     measurement against an in-flow element is ~102 µs. Keeping the probe in
 *     flow is the difference between a misleading 1.8x and a real 29x.
 *   - Widths are randomised per pass so neither side can benefit from a cache
 *     that a real resize would not hit.
 *   - The first pass of each side is discarded as warm-up.
 *   - `prepareMs` is reported alongside, because it is the cost that decides
 *     the trade: Pretext only wins after enough queries to repay it.
 */

import {
  measureLineStats,
  prepareWithSegments,
  type PreparedTextWithSegments,
} from '@chenglou/pretext';

const PASSES = 200;
/**
 * Whole benchmark repetitions. A single shot varies wildly — observed 3.4x,
 * 104x and 20x on three consecutive runs of the same code, because JIT warm-up
 * and `performance.now()` coarsening both bite hard at microsecond scale.
 * Medians of a few repetitions land consistently.
 */
const REPS = 3;

const median = (xs: number[]): number =>
  xs.slice().sort((a, b) => a - b)[Math.floor(xs.length / 2)] ?? 0;

export type Benchmark = {
  passes: number;
  reps: number;
  /** ms for one `prepareWithSegments()` call. */
  prepareMs: number;
  /** Mean ms per width query, Pretext. */
  pretextMs: number;
  /** Mean ms per width query, forcing DOM reflow. */
  domMs: number;
  /** How many times faster Pretext is. `null` if the DOM side measured 0. */
  factor: number | null;
  /**
   * Width queries needed before `prepare()` has paid for itself. Below this,
   * asking the DOM directly is genuinely cheaper.
   */
  breakEven: number | null;
};

export function runBenchmark(
  text: string,
  font: string,
  probe: HTMLElement,
): Benchmark {
  const prepareRuns: number[] = [];
  const pretextRuns: number[] = [];
  const domRuns: number[] = [];

  const time = (fn: (w: number) => void): number => {
    const widths = Array.from({ length: PASSES }, () => 320 + Math.random() * 720);
    fn(500); // warm-up, discarded
    const t = performance.now();
    for (const w of widths) fn(w);
    return (performance.now() - t) / PASSES;
  };

  for (let rep = 0; rep < REPS; rep++) {
    const t0 = performance.now();
    const prepared: PreparedTextWithSegments = prepareWithSegments(text, font);
    prepareRuns.push(performance.now() - t0);

    pretextRuns.push(time((w) => measureLineStats(prepared, w)));
    domRuns.push(
      time((w) => {
        probe.style.inlineSize = `${w}px`;
        void probe.offsetHeight; // the read is what forces layout
      }),
    );
  }
  probe.style.removeProperty('inline-size');

  const prepareMs = median(prepareRuns);
  const pretextMs = median(pretextRuns);
  const domMs = median(domRuns);
  const gain = domMs - pretextMs;
  return {
    passes: PASSES,
    reps: REPS,
    prepareMs,
    pretextMs,
    domMs,
    factor: pretextMs > 0 ? domMs / pretextMs : null,
    breakEven: gain > 0 ? Math.ceil(prepareMs / gain) : null,
  };
}

/** Formats a duration with enough precision to be meaningful at microseconds. */
export function ms(value: number): string {
  if (value >= 1) return `${value.toFixed(2)} ms`;
  return `${(value * 1000).toFixed(0)} µs`;
}
