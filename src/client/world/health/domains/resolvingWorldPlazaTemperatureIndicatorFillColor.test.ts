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
  it('uses the coldest stop at the indicator min', () => {
    expect(
      resolvingWorldPlazaTemperatureIndicatorFillColor(
        DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MIN_CELSIUS,
        DEFAULT_COMFORT_BAND
      )
    ).toBe('rgb(0, 183, 255)');
    expect(DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_COLD_COLOR).toBe(
      '#00b7ff'
    );
  });

  it('uses the cool comfort edge at the character comfort low', () => {
    expect(
      resolvingWorldPlazaTemperatureIndicatorFillColor(
        DEFAULT_COMFORT_BAND.comfortLowCelsius,
        DEFAULT_COMFORT_BAND
      )
    ).toBe('rgb(215, 237, 255)');
    expect(DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_COOL_EDGE_COLOR).toBe(
      '#d7edff'
    );
  });

  it('uses white at the comfort midpoint', () => {
    const comfortMidCelsius =
      (DEFAULT_COMFORT_BAND.comfortLowCelsius +
        DEFAULT_COMFORT_BAND.comfortHighCelsius) /
      2;

    expect(
      resolvingWorldPlazaTemperatureIndicatorFillColor(
        comfortMidCelsius,
        DEFAULT_COMFORT_BAND
      )
    ).toBe('rgb(255, 255, 255)');
    expect(DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MID_COLOR).toBe(
      '#ffffff'
    );
  });

  it('uses the warm comfort edge at the character comfort high', () => {
    expect(
      resolvingWorldPlazaTemperatureIndicatorFillColor(
        DEFAULT_COMFORT_BAND.comfortHighCelsius,
        DEFAULT_COMFORT_BAND
      )
    ).toBe('rgb(255, 207, 191)');
    expect(DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_WARM_EDGE_COLOR).toBe(
      '#ffcfbf'
    );
  });

  it('uses the hottest stop at the indicator max', () => {
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

  it('shifts the soft range when the character comfort band widens', () => {
    const wideComfortBand = {
      comfortLowCelsius: -20,
      comfortHighCelsius: 70,
    } as const;

    expect(
      resolvingWorldPlazaTemperatureIndicatorFillColor(
        wideComfortBand.comfortLowCelsius,
        wideComfortBand
      )
    ).toBe('rgb(215, 237, 255)');
    expect(
      resolvingWorldPlazaTemperatureIndicatorFillColor(
        wideComfortBand.comfortHighCelsius,
        wideComfortBand
      )
    ).toBe('rgb(255, 207, 191)');
  });
});
