/**
 * Plain-text report formatter for multistep performance tester results.
 *
 * @module components/world/domains/formattingWorldPlazaPerformanceTesterReport
 */

import type { ComputingWorldPlazaPerformanceTesterStepResult } from '@/components/world/domains/computingWorldPlazaPerformanceTesterStepResult';

/**
 * Formats one nullable millisecond sample for report columns.
 *
 * @param valueMs - Sample average in milliseconds, if measured.
 */
function formattingWorldPlazaPerformanceTesterNullableMs(
  valueMs: number | null
): string {
  if (valueMs === null) {
    return '-';
  }

  return valueMs.toFixed(2);
}

/**
 * Builds a copy-friendly plain-text performance tester report.
 *
 * @param results - Recorded step rows.
 */
export function formattingWorldPlazaPerformanceTesterReport(
  results: readonly ComputingWorldPlazaPerformanceTesterStepResult[]
): string {
  if (results.length === 0) {
    return 'Reigncraft plaza perf tester\n(no results yet)';
  }

  const header =
    'step | fps | p95 ms | max ms | slow | terrain-sync avg | terrain-floor avg | terrain-trunk avg | collision-debug avg';
  const rows = results.map((result) => {
    const samples = result.sampleAveragesMs;

    return [
      result.stepId,
      result.framesPerSecond.toFixed(1),
      result.framePercentile95Ms.toFixed(2),
      result.frameMaxMs.toFixed(2),
      String(result.slowFrameCount),
      formattingWorldPlazaPerformanceTesterNullableMs(samples.terrainSync),
      formattingWorldPlazaPerformanceTesterNullableMs(samples.terrainFloorSync),
      formattingWorldPlazaPerformanceTesterNullableMs(samples.terrainTrunkSync),
      formattingWorldPlazaPerformanceTesterNullableMs(samples.collisionDebug),
    ].join(' | ');
  });

  return ['Reigncraft plaza perf tester', header, ...rows].join('\n');
}
