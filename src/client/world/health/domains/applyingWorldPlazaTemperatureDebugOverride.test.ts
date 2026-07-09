import { describe, expect, it } from 'vitest';
import { applyingWorldPlazaTemperatureDebugOverrideToCelsius } from '@/components/world/health/domains/applyingWorldPlazaTemperatureDebugOverride';

describe('applyingWorldPlazaTemperatureDebugOverrideToCelsius', () => {
  it('leaves live values unchanged at severity 1 and offset 0', () => {
    expect(
      applyingWorldPlazaTemperatureDebugOverrideToCelsius(30, {
        ambientOffsetCelsius: 0,
        climateSeverity: 1,
        climateMidpointCelsius: 11.5,
      })
    ).toBe(30);
  });

  it('pulls extremes toward midpoint when severity drops', () => {
    const milder = applyingWorldPlazaTemperatureDebugOverrideToCelsius(-25, {
      ambientOffsetCelsius: 0,
      climateSeverity: 0.5,
      climateMidpointCelsius: 11.5,
    });

    expect(milder).toBeCloseTo(11.5 + (-25 - 11.5) * 0.5, 5);
    expect(milder).toBeGreaterThan(-25);
  });

  it('adds ambient offset after severity', () => {
    expect(
      applyingWorldPlazaTemperatureDebugOverrideToCelsius(10, {
        ambientOffsetCelsius: -20,
        climateSeverity: 1,
        climateMidpointCelsius: 11.5,
      })
    ).toBe(-10);
  });
});
