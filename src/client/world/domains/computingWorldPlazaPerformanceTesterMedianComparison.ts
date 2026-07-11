/**
 * Median aggregation for repeated perf tester trials.
 *
 * @module components/world/domains/computingWorldPlazaPerformanceTesterMedianComparison
 */

import type { ComputingWorldPlazaPerformanceTesterStepResult } from '@/components/world/domains/computingWorldPlazaPerformanceTesterStepResult';

/**
 * Nearest-rank median for numeric trial values.
 *
 * @param values - Trial measurements.
 */
export function computingWorldPlazaPerformanceTesterMedianMs(
  values: readonly number[]
): number {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((left, right) => left - right);
  const middleIndex = Math.floor((sorted.length - 1) / 2);

  return sorted[middleIndex] ?? 0;
}

/**
 * Builds one median row from repeated trial results for the same step.
 *
 * @param stepId - Registry step id shared by all trials.
 * @param label - Human-readable step label.
 * @param trials - Trial rows for one step.
 */
export function computingWorldPlazaPerformanceTesterMedianStepResult(
  stepId: ComputingWorldPlazaPerformanceTesterStepResult['stepId'],
  label: string,
  trials: readonly ComputingWorldPlazaPerformanceTesterStepResult[]
): ComputingWorldPlazaPerformanceTesterStepResult {
  const firstTrial = trials[0];

  if (!firstTrial || trials.length === 1) {
    return (
      firstTrial ?? {
        stepId,
        label,
        capturedAtMs: Date.now(),
        framesPerSecond: 0,
        frameAverageMs: 0,
        framePercentile95Ms: 0,
        framePercentile99Ms: 0,
        frameMaxMs: 0,
        slowFrameCount: 0,
        verySlowFrameCount: 0,
        jsHeapUsedMb: null,
        benchmarkMetadata: null,
        sampleAveragesMs: {
          terrainSync: null,
          terrainFloorSync: null,
          terrainTrunkSync: null,
          terrainParentSort: null,
          terrainPrune: null,
          wildlifeTick: null,
          lightingRtt: null,
          domOverlay: null,
          gpuDisposal: null,
          collisionDebug: null,
        },
      }
    );
  }

  const medianMetadata = firstTrial.benchmarkMetadata
    ? {
        ...firstTrial.benchmarkMetadata,
        trialIndex: 0,
        trialCount: trials.length,
        capturedAtIso: new Date().toISOString(),
      }
    : null;

  const medianSample = (
    picker: (
      result: ComputingWorldPlazaPerformanceTesterStepResult
    ) => number | null
  ): number | null => {
    const values = trials
      .map(picker)
      .filter((value): value is number => value !== null);

    if (values.length === 0) {
      return null;
    }

    return computingWorldPlazaPerformanceTesterMedianMs(values);
  };

  return {
    stepId,
    label: `${label} (median ${trials.length})`,
    capturedAtMs: Date.now(),
    framesPerSecond: medianSample((trial) => trial.framesPerSecond) ?? 0,
    frameAverageMs: medianSample((trial) => trial.frameAverageMs) ?? 0,
    framePercentile95Ms:
      medianSample((trial) => trial.framePercentile95Ms) ?? 0,
    framePercentile99Ms:
      medianSample((trial) => trial.framePercentile99Ms) ?? 0,
    frameMaxMs: medianSample((trial) => trial.frameMaxMs) ?? 0,
    slowFrameCount: Math.round(
      medianSample((trial) => trial.slowFrameCount) ?? 0
    ),
    verySlowFrameCount: Math.round(
      medianSample((trial) => trial.verySlowFrameCount) ?? 0
    ),
    jsHeapUsedMb: medianSample((trial) => trial.jsHeapUsedMb),
    benchmarkMetadata: medianMetadata,
    sampleAveragesMs: {
      terrainSync: medianSample((trial) => trial.sampleAveragesMs.terrainSync),
      terrainFloorSync: medianSample(
        (trial) => trial.sampleAveragesMs.terrainFloorSync
      ),
      terrainTrunkSync: medianSample(
        (trial) => trial.sampleAveragesMs.terrainTrunkSync
      ),
      terrainParentSort: medianSample(
        (trial) => trial.sampleAveragesMs.terrainParentSort
      ),
      terrainPrune: medianSample(
        (trial) => trial.sampleAveragesMs.terrainPrune
      ),
      wildlifeTick: medianSample(
        (trial) => trial.sampleAveragesMs.wildlifeTick
      ),
      lightingRtt: medianSample((trial) => trial.sampleAveragesMs.lightingRtt),
      domOverlay: medianSample((trial) => trial.sampleAveragesMs.domOverlay),
      gpuDisposal: medianSample((trial) => trial.sampleAveragesMs.gpuDisposal),
      collisionDebug: medianSample(
        (trial) => trial.sampleAveragesMs.collisionDebug
      ),
    },
  };
}
