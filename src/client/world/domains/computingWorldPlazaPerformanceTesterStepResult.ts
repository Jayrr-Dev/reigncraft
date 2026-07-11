/**
 * Builds comparable step rows from diagnostics snapshots.
 *
 * @module components/world/domains/computingWorldPlazaPerformanceTesterStepResult
 */

import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import type { DefiningWorldPlazaPerformanceTesterStepId } from '@/components/world/domains/definingWorldPlazaPerformanceTesterStepRegistry';
import type { MeasuringWorldPlazaPerformanceDiagnosticsSnapshot } from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';

/** Key sample averages captured for each step row. */
export type ComputingWorldPlazaPerformanceTesterStepSampleAveragesMs = {
  readonly terrainSync: number | null;
  readonly terrainFloorSync: number | null;
  readonly terrainTrunkSync: number | null;
  readonly collisionDebug: number | null;
};

/** One recorded performance tester step result. */
export type ComputingWorldPlazaPerformanceTesterStepResult = {
  readonly stepId: DefiningWorldPlazaPerformanceTesterStepId;
  readonly label: string;
  readonly capturedAtMs: number;
  readonly framesPerSecond: number;
  readonly frameAverageMs: number;
  readonly framePercentile95Ms: number;
  readonly frameMaxMs: number;
  readonly slowFrameCount: number;
  readonly sampleAveragesMs: ComputingWorldPlazaPerformanceTesterStepSampleAveragesMs;
};

/**
 * Reads one sample average from a diagnostics snapshot.
 *
 * @param snapshot - Diagnostics snapshot after a sample window.
 * @param sampleId - Instrumented sample id.
 */
function gettingWorldPlazaPerformanceTesterSampleAverageMs(
  snapshot: MeasuringWorldPlazaPerformanceDiagnosticsSnapshot,
  sampleId: string
): number | null {
  const sampleStats = snapshot.samples.find(
    (sample) => sample.sampleId === sampleId
  );

  if (!sampleStats || sampleStats.measurementCount === 0) {
    return null;
  }

  return sampleStats.averageMs;
}

/**
 * Builds one comparable step result row from a diagnostics snapshot.
 *
 * @param stepId - Registry step id.
 * @param label - Human-readable step label.
 * @param snapshot - Diagnostics snapshot after sampling.
 */
export function computingWorldPlazaPerformanceTesterStepResult(
  stepId: DefiningWorldPlazaPerformanceTesterStepId,
  label: string,
  snapshot: MeasuringWorldPlazaPerformanceDiagnosticsSnapshot
): ComputingWorldPlazaPerformanceTesterStepResult {
  return {
    stepId,
    label,
    capturedAtMs: snapshot.capturedAtMs,
    framesPerSecond: snapshot.framesPerSecond,
    frameAverageMs: snapshot.frameAverageMs,
    framePercentile95Ms: snapshot.framePercentile95Ms,
    frameMaxMs: snapshot.frameMaxMs,
    slowFrameCount: snapshot.slowFrameCount,
    sampleAveragesMs: {
      terrainSync: gettingWorldPlazaPerformanceTesterSampleAverageMs(
        snapshot,
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_SYNC
      ),
      terrainFloorSync: gettingWorldPlazaPerformanceTesterSampleAverageMs(
        snapshot,
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_FLOOR
      ),
      terrainTrunkSync: gettingWorldPlazaPerformanceTesterSampleAverageMs(
        snapshot,
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_TRUNK
      ),
      collisionDebug: gettingWorldPlazaPerformanceTesterSampleAverageMs(
        snapshot,
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.COLLISION_DEBUG
      ),
    },
  };
}
