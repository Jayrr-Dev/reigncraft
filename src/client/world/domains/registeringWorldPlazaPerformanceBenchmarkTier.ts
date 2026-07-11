/**
 * Active performance tier for benchmark metadata capture.
 *
 * @module components/world/domains/registeringWorldPlazaPerformanceBenchmarkTier
 */

import type { DefiningWorldPlazaPerformanceTier } from '@/components/world/domains/definingWorldPlazaPerformanceProfileConstants';

let registeringWorldPlazaPerformanceBenchmarkTierValue:
  | DefiningWorldPlazaPerformanceTier
  | 'unknown' = 'unknown';

/**
 * Registers the active adaptive tier for perf tester metadata rows.
 */
export function registeringWorldPlazaPerformanceBenchmarkTier(
  performanceTier: DefiningWorldPlazaPerformanceTier | 'unknown'
): void {
  registeringWorldPlazaPerformanceBenchmarkTierValue = performanceTier;
}

/**
 * Reads the last registered tier for benchmark metadata.
 */
export function readingWorldPlazaPerformanceBenchmarkTier():
  | DefiningWorldPlazaPerformanceTier
  | 'unknown' {
  return registeringWorldPlazaPerformanceBenchmarkTierValue;
}
