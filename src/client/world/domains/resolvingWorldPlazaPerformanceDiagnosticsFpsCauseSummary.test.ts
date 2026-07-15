import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE,
  type DefiningWorldPlazaPerformanceDiagnosticsSampleId,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import type {
  MeasuringWorldPlazaPerformanceDiagnosticsSampleStats,
  MeasuringWorldPlazaPerformanceDiagnosticsSnapshot,
} from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { resolvingWorldPlazaPerformanceDiagnosticsFpsCauseSummary } from '@/components/world/domains/resolvingWorldPlazaPerformanceDiagnosticsFpsCauseSummary';
import { describe, expect, it } from 'vitest';

const SAMPLE = DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE;

function creatingSampleStats(
  sampleId: DefiningWorldPlazaPerformanceDiagnosticsSampleId,
  percentile95Ms: number,
  maxMs: number,
  spikeCount: number,
  measurementCount = 30
): MeasuringWorldPlazaPerformanceDiagnosticsSampleStats {
  return {
    sampleId,
    averageMs: percentile95Ms / 3,
    percentile95Ms,
    percentile99Ms: maxMs,
    maxMs,
    lastMs: percentile95Ms,
    measurementCount,
    spikeCount,
  };
}

function creatingSnapshot(
  samples: readonly MeasuringWorldPlazaPerformanceDiagnosticsSampleStats[],
  framePercentile95Ms = 21,
  slowFrameCount = 6,
  verySlowFrameCount = 1
): MeasuringWorldPlazaPerformanceDiagnosticsSnapshot {
  return {
    isEnabled: true,
    capturedAtMs: 1_000,
    framesPerSecond: 58,
    sessionFramesPerSecond: 57,
    sessionMinimumFramesPerSecond: 12,
    sessionFrameCount: 120,
    frameAverageMs: 17.1,
    framePercentile95Ms,
    framePercentile99Ms: 26,
    frameMaxMs: 82,
    slowFrameCount,
    verySlowFrameCount,
    jsHeapUsedMb: 100,
    sampleAverageSumMs: 10,
    unaccountedFrameAverageMs: 7.1,
    samples,
    gauges: {
      'floor-chunk-count': 215,
      'water-visible-tile-count': 194,
      'river-visible-tile-count': 80,
    },
    countersPerSecond: {
      'floor-chunks-built': 4.7,
      'floor-bounds-crossing': 2.1,
      'water-surface-redraw-count': 2.3,
    },
    recentSpikeLines: [],
    renderLayerFlags: {},
  };
}

describe('resolvingWorldPlazaPerformanceDiagnosticsFpsCauseSummary', () => {
  it('ranks leaf causes and removes duplicate parent timings', () => {
    const summary = resolvingWorldPlazaPerformanceDiagnosticsFpsCauseSummary(
      creatingSnapshot([
        creatingSampleStats(SAMPLE.TERRAIN_SYNC, 2, 4, 0, 120),
        creatingSampleStats(SAMPLE.TERRAIN_FLOOR, 75.2, 96.5, 15, 35),
        creatingSampleStats(SAMPLE.DOM_OVERLAY, 0.4, 57.7, 2, 120),
        creatingSampleStats(SAMPLE.MINIMAP_REDRAW, 0.3, 57.7, 2, 120),
        creatingSampleStats(SAMPLE.WATER_SURFACE_REDRAW, 3.2, 3.2, 0, 12),
        creatingSampleStats(SAMPLE.WATER_SHIMMER_REDRAW, 0.4, 0.4, 0, 40),
      ])
    );

    expect(summary.severity).toBe('critical');
    expect(summary.causes.map((cause) => cause.sampleId)).toEqual([
      SAMPLE.TERRAIN_FLOOR,
      SAMPLE.MINIMAP_REDRAW,
    ]);
    expect(summary.causes[0]?.loadLines).toContain('chunks built 4.7/s');
    expect(summary.healthyAreas.map((area) => area.sampleId)).toContain(
      SAMPLE.WATER_SURFACE_REDRAW
    );
  });

  it('reports uninstrumented pressure instead of blaming healthy samples', () => {
    const summary = resolvingWorldPlazaPerformanceDiagnosticsFpsCauseSummary(
      creatingSnapshot(
        [creatingSampleStats(SAMPLE.PIXI_RENDER, 1, 2, 0, 120)],
        24,
        8,
        0
      )
    );

    expect(summary.severity).toBe('warning');
    expect(summary.causes).toEqual([]);
    expect(summary.headline).toContain('not explained');
  });
});
