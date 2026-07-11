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

  const metadata = results.find(
    (result) => result.benchmarkMetadata !== null
  )?.benchmarkMetadata;
  const metadataLines = metadata
    ? [
        `tier ${metadata.performanceTier}`,
        `viewport ${metadata.viewportWidthPx}x${metadata.viewportHeightPx}`,
        `dpr ${metadata.devicePixelRatio}`,
      ]
    : [];

  const header =
    'step | fps | p95 ms | p99 ms | max ms | slow | very slow | heap MB | terrain-sync | terrain-sort | wildlife-tick | lighting-rtt | gpu-disposal';
  const rows = results.map((result) => {
    const samples = result.sampleAveragesMs;

    return [
      result.stepId,
      result.framesPerSecond.toFixed(1),
      result.framePercentile95Ms.toFixed(2),
      result.framePercentile99Ms.toFixed(2),
      result.frameMaxMs.toFixed(2),
      String(result.slowFrameCount),
      String(result.verySlowFrameCount),
      result.jsHeapUsedMb === null ? '-' : result.jsHeapUsedMb.toFixed(1),
      formattingWorldPlazaPerformanceTesterNullableMs(samples.terrainSync),
      formattingWorldPlazaPerformanceTesterNullableMs(
        samples.terrainParentSort
      ),
      formattingWorldPlazaPerformanceTesterNullableMs(samples.wildlifeTick),
      formattingWorldPlazaPerformanceTesterNullableMs(samples.lightingRtt),
      formattingWorldPlazaPerformanceTesterNullableMs(samples.gpuDisposal),
    ].join(' | ');
  });

  return [
    'Reigncraft plaza perf tester',
    ...metadataLines,
    header,
    ...rows,
  ].join('\n');
}
