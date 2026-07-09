/**
 * Warmup + timed sampling for pure game hot paths, with Vitest budget asserts.
 *
 * @module components/world/testing/domains/measuringPerformanceBudget
 */

import type {
  DefiningPerformanceBudgetResult,
  DefiningPerformanceBudgetSpec,
} from '@/components/world/testing/domains/definingPerformanceBudgetTypes';
import { expect } from 'vitest';

/** Env key that multiplies all budgets (default 1). Slow CI can set e.g. 2. */
export const DEFINING_PERFORMANCE_BUDGET_SCALE_ENV = 'PERF_BUDGET_SCALE';

/**
 * Reads {@link DEFINING_PERFORMANCE_BUDGET_SCALE_ENV}; invalid / missing → 1.
 */
export function resolvingPerformanceBudgetScale(): number {
  const raw = process.env[DEFINING_PERFORMANCE_BUDGET_SCALE_ENV];

  if (raw === undefined || raw === '') {
    return 1;
  }

  const parsed = Number(raw);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 1;
  }

  return parsed;
}

function computingSortedPercentileMs(
  sortedAscendingMs: readonly number[],
  percentile: number
): number {
  if (sortedAscendingMs.length === 0) {
    return 0;
  }

  const index = Math.min(
    sortedAscendingMs.length - 1,
    Math.max(0, Math.ceil(percentile * sortedAscendingMs.length) - 1)
  );

  return sortedAscendingMs[index] ?? 0;
}

function computingMedianMs(sortedAscendingMs: readonly number[]): number {
  if (sortedAscendingMs.length === 0) {
    return 0;
  }

  const mid = Math.floor(sortedAscendingMs.length / 2);
  const midValue = sortedAscendingMs[mid] ?? 0;

  if (sortedAscendingMs.length % 2 === 1) {
    return midValue;
  }

  const lower = sortedAscendingMs[mid - 1] ?? midValue;

  return (lower + midValue) / 2;
}

/**
 * Runs `run` for warmup + sample iterations and returns median / p95 / max.
 */
export function measuringPerformanceBudget(
  spec: DefiningPerformanceBudgetSpec,
  run: () => void
): DefiningPerformanceBudgetResult {
  for (let i = 0; i < spec.warmupIterations; i += 1) {
    run();
  }

  const samplesMs: number[] = [];

  for (let i = 0; i < spec.sampleIterations; i += 1) {
    const startedAtMs = performance.now();
    run();
    samplesMs.push(performance.now() - startedAtMs);
  }

  const sortedAscendingMs = [...samplesMs].sort((a, b) => a - b);
  const maxMs = sortedAscendingMs[sortedAscendingMs.length - 1] ?? 0;

  return {
    name: spec.name,
    sampleIterations: spec.sampleIterations,
    medianMs: computingMedianMs(sortedAscendingMs),
    percentile95Ms: computingSortedPercentileMs(sortedAscendingMs, 0.95),
    maxMs,
    samplesMs,
  };
}

/**
 * Measures `run` and asserts median / p95 stay under scaled budgets.
 */
export function expectingPerformanceWithinBudget(
  spec: DefiningPerformanceBudgetSpec,
  run: () => void
): DefiningPerformanceBudgetResult {
  const result = measuringPerformanceBudget(spec, run);
  const scale = resolvingPerformanceBudgetScale();
  const medianBudgetMs = spec.medianBudgetMs * scale;
  const percentile95BudgetMs = spec.percentile95BudgetMs * scale;

  expect(
    result.medianMs,
    [
      `[perf] ${spec.name} median ${result.medianMs.toFixed(3)}ms`,
      `exceeds budget ${medianBudgetMs.toFixed(3)}ms`,
      `(base ${spec.medianBudgetMs}ms × scale ${scale})`,
      `p95=${result.percentile95Ms.toFixed(3)}ms max=${result.maxMs.toFixed(3)}ms`,
      `n=${result.sampleIterations}`,
    ].join(' ')
  ).toBeLessThanOrEqual(medianBudgetMs);

  expect(
    result.percentile95Ms,
    [
      `[perf] ${spec.name} p95 ${result.percentile95Ms.toFixed(3)}ms`,
      `exceeds budget ${percentile95BudgetMs.toFixed(3)}ms`,
      `(base ${spec.percentile95BudgetMs}ms × scale ${scale})`,
      `median=${result.medianMs.toFixed(3)}ms max=${result.maxMs.toFixed(3)}ms`,
      `n=${result.sampleIterations}`,
    ].join(' ')
  ).toBeLessThanOrEqual(percentile95BudgetMs);

  return result;
}
