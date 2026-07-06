import type { ComputingWorldPlazaDayNightSunState } from '@/components/world/domains/computingWorldPlazaDayNightSunState';
import { computingWorldPlazaPlayerNightLightStateFromSunState } from '@/components/world/domains/computingWorldPlazaPlayerNightLightStrengthFromSunState';

/**
 * Maps sun state to a 1..midnightBoost multiplier for self-lit sprites.
 *
 * Returns 1 during daytime. Ramps with normalized night darkness so twilight
 * stays subtle and midnight gets the full boost.
 *
 * @param sunState - Current day/night lighting snapshot.
 * @param midnightBoost - Target multiplier at deepest night (must be >= 1).
 */
export function computingWorldPlazaEmissiveNightBrightnessMultiplierFromSunState(
  sunState: ComputingWorldPlazaDayNightSunState,
  midnightBoost: number
): number {
  if (sunState.isDaytime || midnightBoost <= 1) {
    return 1;
  }

  const { darknessNormalized } =
    computingWorldPlazaPlayerNightLightStateFromSunState(sunState);

  return 1 + (midnightBoost - 1) * darknessNormalized;
}
