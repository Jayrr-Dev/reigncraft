import { computingWorldPlazaPerformanceDiagnosticsAbDelta } from '@/components/world/domains/computingWorldPlazaPerformanceDiagnosticsAbDelta';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaPerformanceDiagnosticsAbDelta', () => {
  it('computes signed fps and percent delta when B is faster', () => {
    const delta = computingWorldPlazaPerformanceDiagnosticsAbDelta(
      {
        label: 'A',
        framesPerSecond: 50,
        sessionFramesPerSecond: 48,
        sessionMinimumFramesPerSecond: 30,
        capturedAtMs: 1,
        presetName: 'Baseline',
      },
      {
        label: 'B',
        framesPerSecond: 56,
        sessionFramesPerSecond: 55,
        sessionMinimumFramesPerSecond: 40,
        capturedAtMs: 2,
        presetName: 'Light',
      }
    );

    expect(delta.fpsDelta).toBe(6);
    expect(delta.percentDelta).toBe(12);
    expect(delta.fpsDeltaLabel).toBe('+6.0');
    expect(delta.percentDeltaLabel).toBe('+12%');
    expect(delta.isBFaster).toBe(true);
    expect(delta.summaryLabel).toBe('B − A = +6.0 fps (+12%)');
  });

  it('computes negative delta when B is slower', () => {
    const delta = computingWorldPlazaPerformanceDiagnosticsAbDelta(
      {
        label: 'A',
        framesPerSecond: 60,
        sessionFramesPerSecond: 60,
        sessionMinimumFramesPerSecond: 50,
        capturedAtMs: 1,
        presetName: null,
      },
      {
        label: 'B',
        framesPerSecond: 52.5,
        sessionFramesPerSecond: 53,
        sessionMinimumFramesPerSecond: 40,
        capturedAtMs: 2,
        presetName: null,
      }
    );

    expect(delta.fpsDelta).toBe(-7.5);
    expect(delta.percentDelta).toBe(-12.5);
    expect(delta.isBFaster).toBe(false);
    expect(delta.summaryLabel).toBe('B − A = -7.5 fps (-12%)');
  });

  it('guards divide-by-zero when A fps is zero', () => {
    const delta = computingWorldPlazaPerformanceDiagnosticsAbDelta(
      {
        label: 'A',
        framesPerSecond: 0,
        sessionFramesPerSecond: 0,
        sessionMinimumFramesPerSecond: 0,
        capturedAtMs: 1,
        presetName: null,
      },
      {
        label: 'B',
        framesPerSecond: 40,
        sessionFramesPerSecond: 40,
        sessionMinimumFramesPerSecond: 30,
        capturedAtMs: 2,
        presetName: null,
      }
    );

    expect(delta.percentDelta).toBeNull();
    expect(delta.percentDeltaLabel).toBe('n/a');
    expect(delta.summaryLabel).toBe('B − A = +40.0 fps');
  });
});
