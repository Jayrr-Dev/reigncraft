import { computingWorldPlazaConfusionDeflectedGridDelta } from '@/components/world/health/domains/computingWorldPlazaConfusionDeflectedGridDelta';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaConfusionDeflectedGridDelta', () => {
  it('returns zero delta unchanged', () => {
    const result = computingWorldPlazaConfusionDeflectedGridDelta({
      gridDelta: { x: 0, y: 0 },
      deltaSeconds: 0.016,
      effectiveIntensity: 100,
      phaseRadians: 0,
      phaseSeed: 0,
    });

    expect(result.gridDelta).toEqual({ x: 0, y: 0 });
    expect(result.nextPhaseRadians).toBe(0);
  });

  it('deflects heading while preserving magnitude', () => {
    const inputDelta = { x: 1, y: 0 };
    const result = computingWorldPlazaConfusionDeflectedGridDelta({
      gridDelta: inputDelta,
      deltaSeconds: 0.05,
      effectiveIntensity: 100,
      phaseRadians: 0.75,
      phaseSeed: 0.25,
    });

    const inputMagnitude = Math.hypot(inputDelta.x, inputDelta.y);
    const outputMagnitude = Math.hypot(result.gridDelta.x, result.gridDelta.y);

    expect(outputMagnitude).toBeCloseTo(inputMagnitude, 5);
    expect(result.gridDelta.x).not.toBeCloseTo(inputDelta.x, 3);
    expect(result.nextPhaseRadians).toBeGreaterThan(0.75);
  });

  it('advances phase each frame', () => {
    const first = computingWorldPlazaConfusionDeflectedGridDelta({
      gridDelta: { x: 0, y: 1 },
      deltaSeconds: 0.1,
      effectiveIntensity: 50,
      phaseRadians: 1,
      phaseSeed: 0,
    });
    const second = computingWorldPlazaConfusionDeflectedGridDelta({
      gridDelta: { x: 0, y: 1 },
      deltaSeconds: 0.1,
      effectiveIntensity: 50,
      phaseRadians: first.nextPhaseRadians,
      phaseSeed: 0,
    });

    expect(second.nextPhaseRadians).toBeGreaterThan(first.nextPhaseRadians);
  });
});
