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
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_WARM_EDGE_COLOR,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureIndicatorConstants';
import { resolvingWorldPlazaTemperatureIndicatorFillColor } from '@/components/world/health/domains/resolvingWorldPlazaTemperatureIndicatorFillColor';
import { describe, expect, it } from 'vitest';

const DEFAULT_COMFORT_BAND = {
  comfortLowCelsius: DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_LOW_CELSIUS,
  comfortHighCelsius: DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS,
} as const;

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

  it('uses yellow at the character comfort low', () => {
    expect(
      resolvingWorldPlazaTemperatureIndicatorFillColor(
        DEFAULT_COMFORT_BAND.comfortLowCelsius,
        DEFAULT_COMFORT_BAND
      )
    ).toBe('rgb(255, 229, 102)');
    expect(DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_COOL_EDGE_COLOR).toBe(
      '#ffe566'
    );
  });

  it('uses orange at the comfort midpoint', () => {
    const comfortMidCelsius =
      (DEFAULT_COMFORT_BAND.comfortLowCelsius +
        DEFAULT_COMFORT_BAND.comfortHighCelsius) /
      2;

    expect(
      resolvingWorldPlazaTemperatureIndicatorFillColor(
        comfortMidCelsius,
        DEFAULT_COMFORT_BAND
      )
    ).toBe('rgb(255, 158, 0)');
    expect(DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MID_COLOR).toBe(
      '#ff9e00'
    );
  });

  it('uses orange-red at the character comfort high', () => {
    expect(
      resolvingWorldPlazaTemperatureIndicatorFillColor(
        DEFAULT_COMFORT_BAND.comfortHighCelsius,
        DEFAULT_COMFORT_BAND
      )
    ).toBe('rgb(255, 69, 0)');
    expect(DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_WARM_EDGE_COLOR).toBe(
      '#ff4500'
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

  it('passes through light blue and blue between white and yellow', () => {
    const coldSpan =
      DEFAULT_COMFORT_BAND.comfortLowCelsius -
      DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MIN_CELSIUS;
    const lightBlueCelsius =
      DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MIN_CELSIUS + coldSpan / 3;
    const blueCelsius =
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
        blueCelsius,
        DEFAULT_COMFORT_BAND
      )
    ).toBe('rgb(59, 158, 255)');
  });
});
