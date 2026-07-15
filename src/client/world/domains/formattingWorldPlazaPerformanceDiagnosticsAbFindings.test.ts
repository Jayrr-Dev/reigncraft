import { formattingWorldPlazaPerformanceDiagnosticsAbFindings } from '@/components/world/domains/formattingWorldPlazaPerformanceDiagnosticsAbFindings';
import { describe, expect, it } from 'vitest';

describe('formattingWorldPlazaPerformanceDiagnosticsAbFindings', () => {
  it('formats both captures, delta, and current snapshot', () => {
    const text = formattingWorldPlazaPerformanceDiagnosticsAbFindings({
      captureA: {
        label: 'Capture A',
        framesPerSecond: 50,
        sessionFramesPerSecond: 48.5,
        sessionMinimumFramesPerSecond: 32,
        capturedAtMs: Date.parse('2026-07-14T12:00:00.000Z'),
        presetName: 'Baseline',
      },
      captureB: {
        label: 'Capture B',
        framesPerSecond: 56,
        sessionFramesPerSecond: 55.2,
        sessionMinimumFramesPerSecond: 41,
        capturedAtMs: Date.parse('2026-07-14T12:00:10.000Z'),
        presetName: 'Light',
      },
      activePresetName: 'Light',
      currentSnapshot: {
        isEnabled: true,
        capturedAtMs: 1,
        framesPerSecond: 56,
        sessionFramesPerSecond: 55.2,
        sessionMinimumFramesPerSecond: 41,
        sessionFrameCount: 120,
        frameAverageMs: 17.8,
        framePercentile95Ms: 20,
        framePercentile99Ms: 24,
        frameMaxMs: 30,
        slowFrameCount: 0,
        verySlowFrameCount: 0,
        jsHeapUsedMb: null,
        sampleAverageSumMs: 0,
        unaccountedFrameAverageMs: 17.8,
        samples: [],
        gauges: {},
        countersPerSecond: {},
        recentSpikeLines: [],
        renderLayerFlags: {},
      },
    });

    expect(text).toContain('Plaza perf FLAGS compare');
    expect(text).toContain(
      'Current: 56.0 fps live · 55.2 fps session avg · 41.0 fps session min'
    );
    expect(text).toContain('Active preset: Light');
    expect(text).toContain(
      'A: 50.0 fps live · 48.5 fps session avg · 32.0 fps session min · preset: Baseline'
    );
    expect(text).toContain(
      'B: 56.0 fps live · 55.2 fps session avg · 41.0 fps session min · preset: Light'
    );
    expect(text).toContain('Delta: B − A = +6.0 fps (+12%) · min +9.0');
  });
});
