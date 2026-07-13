import {
  DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNRISE_PHASE,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNSET_PHASE,
} from '@/components/world/domains/definingWorldPlazaDayNightCycleConstants';
import {
  DEFINING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_MOON_ICON,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_SUN_ICON,
} from '@/components/world/domains/definingWorldPlazaDayNightIndicatorConstants';
import { resolvingWorldPlazaDayNightIndicatorPresentation } from '@/components/world/domains/resolvingWorldPlazaDayNightIndicatorPresentation';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaDayNightIndicatorPresentation', () => {
  it('keeps midnight black with the moon near zenith', () => {
    const midnight = resolvingWorldPlazaDayNightIndicatorPresentation(0);

    expect(midnight.isDaytime).toBe(false);
    expect(midnight.daylightFillRatio).toBe(0);
    expect(midnight.celestialIcon).toBe(
      DEFINING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_MOON_ICON
    );
    expect(midnight.celestialTopRatio).toBeLessThan(0.25);
  });

  it('fills sunny at noon with the sun near the zenith', () => {
    const noon = resolvingWorldPlazaDayNightIndicatorPresentation(0.5);

    expect(noon.isDaytime).toBe(true);
    expect(noon.daylightFillRatio).toBeCloseTo(1, 2);
    expect(noon.celestialIcon).toBe(
      DEFINING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_SUN_ICON
    );
    expect(noon.celestialTopRatio).toBeLessThan(0.25);
    expect(noon.celestialLeftRatio).toBeCloseTo(0.5, 1);
  });

  it('starts the sun low at sunrise and ends low at sunset', () => {
    const sunrise = resolvingWorldPlazaDayNightIndicatorPresentation(
      DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNRISE_PHASE
    );
    const sunset = resolvingWorldPlazaDayNightIndicatorPresentation(
      DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNSET_PHASE - 0.0001
    );

    expect(sunrise.isDaytime).toBe(true);
    expect(sunrise.daylightFillRatio).toBeCloseTo(0, 2);
    expect(sunrise.celestialLeftRatio).toBeLessThan(0.25);
    expect(sunrise.celestialTopRatio).toBeGreaterThan(0.7);

    expect(sunset.isDaytime).toBe(true);
    expect(sunset.daylightFillRatio).toBeCloseTo(0, 2);
    expect(sunset.celestialLeftRatio).toBeGreaterThan(0.75);
    expect(sunset.celestialTopRatio).toBeGreaterThan(0.7);
  });

  it('puts the moon high near the middle of the night arc', () => {
    const nightSpan =
      1 -
      (DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNSET_PHASE -
        DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNRISE_PHASE);
    const midNightPhase =
      (DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNSET_PHASE + nightSpan / 2) % 1;
    const highMoon =
      resolvingWorldPlazaDayNightIndicatorPresentation(midNightPhase);
    const duskMoon = resolvingWorldPlazaDayNightIndicatorPresentation(
      DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNSET_PHASE
    );

    expect(highMoon.isDaytime).toBe(false);
    expect(highMoon.daylightFillRatio).toBe(0);
    expect(highMoon.celestialTopRatio).toBeLessThan(duskMoon.celestialTopRatio);
  });
});
