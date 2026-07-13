/**
 * Resolves day/night orb fill height and sun/moon sky position from cycle phase.
 *
 * @module components/world/domains/resolvingWorldPlazaDayNightIndicatorPresentation
 */

import type { DefiningWorldPlazaDayNightCelestialBody } from '@/components/world/domains/definingWorldPlazaDayNightCelestialSpriteSheetConstants';
import {
  DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNRISE_PHASE,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNSET_PHASE,
} from '@/components/world/domains/definingWorldPlazaDayNightCycleConstants';

/** Layout values for the action-bar day/night orb. */
export type ResolvingWorldPlazaDayNightIndicatorPresentation = {
  /** True between sunrise and sunset. */
  readonly isDaytime: boolean;
  /** Daylight fill height (0 = black night, 1 = full sunny noon). */
  readonly daylightFillRatio: number;
  /** Left position of the sun/moon center inside the disc (0..1). */
  readonly celestialLeftRatio: number;
  /** Top position of the sun/moon center inside the disc (0..1). */
  readonly celestialTopRatio: number;
  /** Active celestial body for the sprite sheet crop. */
  readonly celestialBody: DefiningWorldPlazaDayNightCelestialBody;
};

/**
 * Arc progress (0..1) and daytime flag for one cycle phase.
 *
 * Matches {@link computingWorldPlazaDayNightSunState} sun/moon arcs.
 */
function resolvingWorldPlazaDayNightIndicatorArcProgress(cyclePhase: number): {
  readonly arcProgress: number;
  readonly isDaytime: boolean;
} {
  const sunrise = DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNRISE_PHASE;
  const sunset = DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNSET_PHASE;
  const phase =
    Number.isFinite(cyclePhase) && cyclePhase >= 0 ? cyclePhase % 1 : 0;

  if (phase >= sunrise && phase < sunset) {
    return {
      arcProgress: (phase - sunrise) / (sunset - sunrise),
      isDaytime: true,
    };
  }

  const nightSpan = 1 - (sunset - sunrise);
  const nightElapsed = phase >= sunset ? phase - sunset : phase + (1 - sunset);

  return { arcProgress: nightElapsed / nightSpan, isDaytime: false };
}

/**
 * Maps cycle phase to thermometer daylight fill and which celestial body shows.
 *
 * Daytime fill rises with sun altitude (black at dawn/dusk, full sunny at noon).
 * Night stays black. Sun/moon stay centered in the disc (same as hunger glyph).
 *
 * @param cyclePhase - Shared day/night phase (0 = midnight, 0.5 = noon)
 */
export function resolvingWorldPlazaDayNightIndicatorPresentation(
  cyclePhase: number
): ResolvingWorldPlazaDayNightIndicatorPresentation {
  const { arcProgress, isDaytime } =
    resolvingWorldPlazaDayNightIndicatorArcProgress(cyclePhase);
  const altitude = Math.sin(arcProgress * Math.PI);

  return {
    isDaytime,
    daylightFillRatio: isDaytime ? altitude : 0,
    celestialLeftRatio: 0.5,
    celestialTopRatio: 0.5,
    celestialBody: isDaytime ? 'sun' : 'moon',
  };
}
