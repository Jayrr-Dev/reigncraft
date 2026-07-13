import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_COLD_COLOR,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_COOL_EDGE_COLOR,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_COOL_STOP_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_HOT_COLOR,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MAX_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MID_COLOR,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MIN_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_WARM_EDGE_COLOR,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_WARM_STOP_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureIndicatorConstants';
import { resolvingWorldPlazaTemperatureIndicatorFillColor } from '@/components/world/health/domains/resolvingWorldPlazaTemperatureIndicatorFillColor';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaTemperatureIndicatorFillColor', () => {
  it('uses the cold stop at the indicator min', () => {
    expect(
      resolvingWorldPlazaTemperatureIndicatorFillColor(
        DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MIN_CELSIUS
      )
    ).toBe('rgb(59, 127, 212)');
    expect(DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_COLD_COLOR).toBe(
      '#3b7fd4'
    );
  });

  it('uses the cool-white edge at 15°C where bluish tones begin', () => {
    expect(
      resolvingWorldPlazaTemperatureIndicatorFillColor(
        DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_COOL_STOP_CELSIUS
      )
    ).toBe('rgb(232, 238, 245)');
    expect(DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_COOL_EDGE_COLOR).toBe(
      '#e8eef5'
    );
  });

  it('uses the white mid stop in the middle of the comfort band', () => {
    const comfortMidCelsius =
      (DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_COOL_STOP_CELSIUS +
        DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_WARM_STOP_CELSIUS) /
      2;

    expect(
      resolvingWorldPlazaTemperatureIndicatorFillColor(comfortMidCelsius)
    ).toBe('rgb(243, 239, 232)');
    expect(DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MID_COLOR).toBe(
      '#f3efe8'
    );
  });

  it('uses the soft red edge at 25°C', () => {
    expect(
      resolvingWorldPlazaTemperatureIndicatorFillColor(
        DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_WARM_STOP_CELSIUS
      )
    ).toBe('rgb(212, 90, 74)');
    expect(DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_WARM_EDGE_COLOR).toBe(
      '#d45a4a'
    );
  });

  it('uses the hot stop at the indicator max', () => {
    expect(
      resolvingWorldPlazaTemperatureIndicatorFillColor(
        DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MAX_CELSIUS
      )
    ).toBe('rgb(224, 51, 40)');
    expect(DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_HOT_COLOR).toBe(
      '#e03328'
    );
  });
});
