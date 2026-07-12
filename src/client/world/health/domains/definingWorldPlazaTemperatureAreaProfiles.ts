import type { DefiningWorldPlazaTemperatureAreaProfile } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';

/**
 * Painted temperature zones over tile rectangles.
 *
 * Keep empty for normal play. Add entries only when intentionally testing
 * heat/cold areas away from common build spots.
 */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_AREA_PROFILES: readonly DefiningWorldPlazaTemperatureAreaProfile[] =
  [];

/**
 * Returns the area temperature profile covering a tile, if any.
 */
export function resolvingWorldPlazaTemperatureAreaProfileAtTileIndex(
  tileX: number,
  tileY: number
): DefiningWorldPlazaTemperatureAreaProfile | null {
  for (const profile of DEFINING_WORLD_PLAZA_TEMPERATURE_AREA_PROFILES) {
    if (
      tileX >= profile.minTileX &&
      tileX <= profile.maxTileX &&
      tileY >= profile.minTileY &&
      tileY <= profile.maxTileY
    ) {
      return profile;
    }
  }

  return null;
}
