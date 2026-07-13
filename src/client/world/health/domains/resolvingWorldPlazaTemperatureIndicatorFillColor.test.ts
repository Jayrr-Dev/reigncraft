import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_LOW_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_COLD_COLOR,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_COOL_EDGE_COLOR,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_HOT_COLOR,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MAX_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MID_COLOR,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MIN_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_SKY_BLUE,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_WARM_EDGE_COLOR,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureIndicatorConstants';
import { resolvingWorldPlazaTemperatureIndicatorFillColor } from '@/components/world/health/domains/resolvingWorldPlazaTemperatureIndicatorFillColor';
import { describe, expect, it } from 'vitest';

const DEFAULT_COMFORT_BAND = {
  comfortLowCelsius: DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_LOW_CELSIUS,
  comfortHighCelsius: DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS,
} as const;

const SKY_BLUE_RGB = 'rgb(135, 206, 235)';

describe('resolvingWorldPlazaTemperatureIndicatorFillColor', () => {
  it('uses white at the indicator min', () => {
    expect(
      resolvingWorldPlazaTemperatureIndicatorFillColor(
        DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MIN_CELSIUS,
        DEFAULT_COMFORT_BAND
      )
    ).toBe('rgb(255, 255, 255)');
    expect(DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_COLD_COLOR).toBe(
      '#ffffff'
    );
  });

  it('keeps sky blue across the whole comfort band', () => {
    const comfortMidCelsius =
      (DEFAULT_COMFORT_BAND.comfortLowCelsius +
        DEFAULT_COMFORT_BAND.comfortHighCelsius) /
      2;

    expect(
      resolvingWorldPlazaTemperatureIndicatorFillColor(
        DEFAULT_COMFORT_BAND.comfortLowCelsius,
        DEFAULT_COMFORT_BAND
      )
    ).toBe(SKY_BLUE_RGB);
    expect(
      resolvingWorldPlazaTemperatureIndicatorFillColor(
        comfortMidCelsius,
        DEFAULT_COMFORT_BAND
      )
    ).toBe(SKY_BLUE_RGB);
    expect(
      resolvingWorldPlazaTemperatureIndicatorFillColor(
        DEFAULT_COMFORT_BAND.comfortHighCelsius,
        DEFAULT_COMFORT_BAND
      )
    ).toBe(SKY_BLUE_RGB);
    expect(
      resolvingWorldPlazaTemperatureIndicatorFillColor(26, DEFAULT_COMFORT_BAND)
    ).toBe(SKY_BLUE_RGB);

    expect(DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_SKY_BLUE).toBe('#87ceeb');
    expect(DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_COOL_EDGE_COLOR).toBe(
      '#87ceeb'
    );
    expect(DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MID_COLOR).toBe(
      '#87ceeb'
    );
    expect(DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_WARM_EDGE_COLOR).toBe(
      '#87ceeb'
    );
  });

  it('uses pure red at the indicator max', () => {
    expect(
      resolvingWorldPlazaTemperatureIndicatorFillColor(
        DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MAX_CELSIUS,
        DEFAULT_COMFORT_BAND
      )
    ).toBe('rgb(255, 0, 0)');
    expect(DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_HOT_COLOR).toBe(
      '#ff0000'
    );
  });

  it('passes through light blue then sky blue between white and comfort low', () => {
    const coldSpan =
      DEFAULT_COMFORT_BAND.comfortLowCelsius -
      DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MIN_CELSIUS;
    const lightBlueCelsius =
      DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MIN_CELSIUS + coldSpan / 3;
    const skyBlueApproachCelsius =
      DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MIN_CELSIUS +
      (2 * coldSpan) / 3;

    expect(
      resolvingWorldPlazaTemperatureIndicatorFillColor(
        lightBlueCelsius,
        DEFAULT_COMFORT_BAND
      )
    ).toBe('rgb(200, 230, 255)');
    expect(
      resolvingWorldPlazaTemperatureIndicatorFillColor(
        skyBlueApproachCelsius,
        DEFAULT_COMFORT_BAND
      )
    ).toBe(SKY_BLUE_RGB);
  });
});
