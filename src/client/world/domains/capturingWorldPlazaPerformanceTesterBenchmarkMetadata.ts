/**
 * Captures device and tier metadata for perf tester benchmark reports.
 *
 * @module components/world/domains/capturingWorldPlazaPerformanceTesterBenchmarkMetadata
 */

import type { DefiningWorldPlazaPerformanceTier } from '@/components/world/domains/definingWorldPlazaPerformanceProfileConstants';

/** Metadata attached to each perf tester result row. */
export type CapturingWorldPlazaPerformanceTesterBenchmarkMetadata = {
  readonly capturedAtIso: string;
  readonly performanceTier: DefiningWorldPlazaPerformanceTier | 'unknown';
  readonly viewportWidthPx: number;
  readonly viewportHeightPx: number;
  readonly devicePixelRatio: number;
  readonly userAgent: string;
  readonly trialIndex: number;
  readonly trialCount: number;
};

/**
 * Captures benchmark metadata for one tester sample window.
 *
 * @param performanceTier - Active adaptive tier, if known.
 * @param trialIndex - One-based trial index.
 * @param trialCount - Total trials for this step.
 */
export function capturingWorldPlazaPerformanceTesterBenchmarkMetadata(
  performanceTier: DefiningWorldPlazaPerformanceTier | 'unknown',
  trialIndex: number,
  trialCount: number
): CapturingWorldPlazaPerformanceTesterBenchmarkMetadata {
  return {
    capturedAtIso: new Date().toISOString(),
    performanceTier,
    viewportWidthPx:
      typeof window !== 'undefined' ? window.innerWidth : 0,
    viewportHeightPx:
      typeof window !== 'undefined' ? window.innerHeight : 0,
    devicePixelRatio:
      typeof window !== 'undefined' ? window.devicePixelRatio : 1,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    trialIndex,
    trialCount,
  };
}
