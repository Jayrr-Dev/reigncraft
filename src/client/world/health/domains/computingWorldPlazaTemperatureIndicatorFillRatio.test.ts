import { computingWorldPlazaTemperatureIndicatorFillRatio } from '@/components/world/health/domains/computingWorldPlazaTemperatureIndicatorFillRatio';
import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MAX_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MIN_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureIndicatorConstants';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaTemperatureIndicatorFillRatio', () => {
  it('maps the indicator min to empty', () => {
    expect(
      computingWorldPlazaTemperatureIndicatorFillRatio(
        DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MIN_CELSIUS
      )
    ).toBe(0);
  });

  it('maps the indicator max to full', () => {
    expect(
      computingWorldPlazaTemperatureIndicatorFillRatio(
        DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MAX_CELSIUS
      )
    ).toBe(1);
  });

  it('clamps below the min and above the max', () => {
    expect(
      computingWorldPlazaTemperatureIndicatorFillRatio(
        DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MIN_CELSIUS - 40
      )
    ).toBe(0);
    expect(
      computingWorldPlazaTemperatureIndicatorFillRatio(
        DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MAX_CELSIUS + 800
      )
    ).toBe(1);
  });

  it('maps the midpoint linearly', () => {
    const mid =
      (DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MIN_CELSIUS +
        DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MAX_CELSIUS) /
      2;

    expect(computingWorldPlazaTemperatureIndicatorFillRatio(mid)).toBeCloseTo(
      0.5,
      5
    );
  });

  it('treats non-finite input as empty', () => {
    expect(computingWorldPlazaTemperatureIndicatorFillRatio(Number.NaN)).toBe(
      0
    );
    expect(
      computingWorldPlazaTemperatureIndicatorFillRatio(Number.POSITIVE_INFINITY)
    ).toBe(0);
  });
});
