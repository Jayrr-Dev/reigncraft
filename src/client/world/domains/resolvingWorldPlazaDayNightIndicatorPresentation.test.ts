import {
  DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNRISE_PHASE,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNSET_PHASE,
} from '@/components/world/domains/definingWorldPlazaDayNightCycleConstants';
import { resolvingWorldPlazaDayNightIndicatorPresentation } from '@/components/world/domains/resolvingWorldPlazaDayNightIndicatorPresentation';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaDayNightIndicatorPresentation', () => {
  it('keeps midnight black with a centered moon', () => {
    const midnight = resolvingWorldPlazaDayNightIndicatorPresentation(0);

    expect(midnight.isDaytime).toBe(false);
    expect(midnight.daylightFillRatio).toBe(0);
    expect(midnight.celestialBody).toBe('moon');
    expect(midnight.celestialLeftRatio).toBe(0.5);
    expect(midnight.celestialTopRatio).toBe(0.5);
  });

  it('fills sunny at noon with a centered sun', () => {
    const noon = resolvingWorldPlazaDayNightIndicatorPresentation(0.5);

    expect(noon.isDaytime).toBe(true);
    expect(noon.daylightFillRatio).toBeCloseTo(1, 2);
    expect(noon.celestialBody).toBe('sun');
    expect(noon.celestialLeftRatio).toBe(0.5);
    expect(noon.celestialTopRatio).toBe(0.5);
  });

  it('keeps the sun centered at sunrise and sunset while fill stays low', () => {
    const sunrise = resolvingWorldPlazaDayNightIndicatorPresentation(
      DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNRISE_PHASE
    );
    const sunset = resolvingWorldPlazaDayNightIndicatorPresentation(
      DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNSET_PHASE - 0.0001
    );

    expect(sunrise.isDaytime).toBe(true);
    expect(sunrise.daylightFillRatio).toBeCloseTo(0, 2);
    expect(sunrise.celestialBody).toBe('sun');
    expect(sunrise.celestialLeftRatio).toBe(0.5);
    expect(sunrise.celestialTopRatio).toBe(0.5);

    expect(sunset.isDaytime).toBe(true);
    expect(sunset.daylightFillRatio).toBeCloseTo(0, 2);
    expect(sunset.celestialBody).toBe('sun');
    expect(sunset.celestialLeftRatio).toBe(0.5);
    expect(sunset.celestialTopRatio).toBe(0.5);
  });

  it('keeps night fill black near the middle of the night arc', () => {
    const nightSpan =
      1 -
      (DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNSET_PHASE -
        DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNRISE_PHASE);
    const midNightPhase =
      (DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNSET_PHASE + nightSpan / 2) % 1;
    const highMoon =
      resolvingWorldPlazaDayNightIndicatorPresentation(midNightPhase);

    expect(highMoon.isDaytime).toBe(false);
    expect(highMoon.daylightFillRatio).toBe(0);
    expect(highMoon.celestialBody).toBe('moon');
    expect(highMoon.celestialLeftRatio).toBe(0.5);
    expect(highMoon.celestialTopRatio).toBe(0.5);
  });
});
