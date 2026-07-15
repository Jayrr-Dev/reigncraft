import { describe, expect, it } from 'vitest';

import { computingWorldPlazaPerformanceTesterStepResult } from '@/components/world/domains/computingWorldPlazaPerformanceTesterStepResult';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP } from '@/components/world/domains/definingWorldPlazaPerformanceTesterStepRegistry';
import type { MeasuringWorldPlazaPerformanceDiagnosticsSnapshot } from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';

function buildingFakeDiagnosticsSnapshot(): MeasuringWorldPlazaPerformanceDiagnosticsSnapshot {
  return {
    isEnabled: true,
    capturedAtMs: 1000,
    framesPerSecond: 58.2,
    sessionFramesPerSecond: 57.5,
    sessionFrameCount: 240,
    frameAverageMs: 17.15,
    framePercentile95Ms: 22.4,
    framePercentile99Ms: 28.1,
    frameMaxMs: 31.2,
    slowFrameCount: 2,
    verySlowFrameCount: 0,
    jsHeapUsedMb: 120.5,
    sampleAverageSumMs: 10,
    unaccountedFrameAverageMs: 7.15,
    samples: [
      {
        sampleId:
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_SYNC,
        averageMs: 6.4,
        percentile95Ms: 9.1,
        percentile99Ms: 11.2,
        maxMs: 12.2,
        lastMs: 5.8,
        measurementCount: 40,
        spikeCount: 1,
      },
      {
        sampleId:
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_FLOOR,
        averageMs: 2.1,
        percentile95Ms: 3.2,
        percentile99Ms: 3.8,
        maxMs: 4.1,
        lastMs: 2,
        measurementCount: 40,
        spikeCount: 0,
      },
      {
        sampleId:
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.COLLISION_DEBUG,
        averageMs: 1.5,
        percentile95Ms: 2,
        percentile99Ms: 2.2,
        maxMs: 2.4,
        lastMs: 1.4,
        measurementCount: 10,
        spikeCount: 0,
      },
    ],
    gauges: {},
    countersPerSecond: {},
    recentSpikeLines: [],
    renderLayerFlags: {},
  };
}

describe('computingWorldPlazaPerformanceTesterStepResult', () => {
  it('maps diagnostics snapshot fields into a comparable step row', () => {
    const result = computingWorldPlazaPerformanceTesterStepResult(
      DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP.PROCEDURAL_OFF,
      'Procedural off',
      buildingFakeDiagnosticsSnapshot()
    );

    expect(result.stepId).toBe(
      DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP.PROCEDURAL_OFF
    );
    expect(result.framesPerSecond).toBeCloseTo(58.2);
    expect(result.sampleAveragesMs.terrainSync).toBeCloseTo(6.4);
    expect(result.sampleAveragesMs.terrainFloorSync).toBeCloseTo(2.1);
    expect(result.sampleAveragesMs.terrainTrunkSync).toBeNull();
    expect(result.sampleAveragesMs.collisionDebug).toBeCloseTo(1.5);
  });
});
