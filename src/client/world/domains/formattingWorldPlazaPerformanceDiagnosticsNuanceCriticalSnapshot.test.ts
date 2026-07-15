import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsMetricNuanceRegistry';
import { formattingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshot } from '@/components/world/domains/formattingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshot';
import type { MeasuringWorldPlazaPerformanceDiagnosticsSnapshot } from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { describe, expect, it } from 'vitest';

function buildingMinimalDiagnosticsSnapshot(
  overrides: Partial<MeasuringWorldPlazaPerformanceDiagnosticsSnapshot> = {}
): MeasuringWorldPlazaPerformanceDiagnosticsSnapshot {
  return {
    isEnabled: true,
    capturedAtMs: 1_700_000_000_000,
    framesPerSecond: 30,
    sessionFramesPerSecond: 29,
    sessionFrameCount: 60,
    frameAverageMs: 33,
    framePercentile95Ms: 40,
    framePercentile99Ms: 50,
    frameMaxMs: 60,
    slowFrameCount: 2,
    verySlowFrameCount: 1,
    jsHeapUsedMb: null,
    sampleAverageSumMs: 10,
    unaccountedFrameAverageMs: 23,
    samples: [
      {
        sampleId: 'wildlife-tick',
        averageMs: 8,
        percentile95Ms: 18,
        percentile99Ms: 22,
        maxMs: 25,
        lastMs: 12,
        measurementCount: 10,
        spikeCount: 2,
      },
    ],
    gauges: {
      'wildlife-sim-backlog-ms': 40,
      'wildlife-sim-steps-this-frame': 4,
    },
    countersPerSecond: {},
    recentSpikeLines: ['wildlife-tick 12.00ms'],
    renderLayerFlags: {},
    ...overrides,
  };
}

describe('formattingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshot', () => {
  it('includes nuance label, index, gauges, and samples for paste', () => {
    const text =
      formattingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshot({
        nuanceId:
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE.WILDLIFE_SIM,
        index: 0.83,
        capturedAtMs: 1_700_000_000_000,
        snapshot: buildingMinimalDiagnosticsSnapshot(),
      });

    expect(text).toContain('[plaza-perf nuance critical]');
    expect(text).toContain('Wildlife sim');
    expect(text).toContain('index=0.83');
    expect(text).toContain('wildlife-sim-backlog-ms: 40');
    expect(text).toContain('wildlife-tick:');
    expect(text).toContain('spikes:');
  });
});
