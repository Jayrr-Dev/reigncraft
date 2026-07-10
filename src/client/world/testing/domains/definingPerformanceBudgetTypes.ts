/**
 * Declarative types for reusable Vitest performance budget tests.
 *
 * @module components/world/testing/domains/definingPerformanceBudgetTypes
 */

/** Spec for one timed workload under a median / p95 budget. */
export type DefiningPerformanceBudgetSpec = {
  /** Label used in assertion failure messages. */
  readonly name: string;
  /** Untimed iterations so JIT / caches settle before sampling. */
  readonly warmupIterations: number;
  /** Timed iterations that feed median / p95 / max. */
  readonly sampleIterations: number;
  /** Soft ceiling for the median sample duration (ms). */
  readonly medianBudgetMs: number;
  /** Soft ceiling for the 95th-percentile sample duration (ms). */
  readonly percentile95BudgetMs: number;
};

/** Aggregated timings from one measured run. */
export type DefiningPerformanceBudgetResult = {
  readonly name: string;
  readonly sampleIterations: number;
  readonly medianMs: number;
  readonly percentile95Ms: number;
  readonly maxMs: number;
  readonly samplesMs: readonly number[];
};
