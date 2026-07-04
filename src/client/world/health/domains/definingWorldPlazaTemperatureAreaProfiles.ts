import type { DefiningWorldPlazaTemperatureAreaProfile } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';

/**
 * Dev/demo temperature zones painted over tile rectangles.
 *
 * Add entries here to assign heat or cold to arbitrary map areas.
 */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_AREA_PROFILES: readonly DefiningWorldPlazaTemperatureAreaProfile[] =
  [
    {
      id: 'demo-heat-spring',
      label: 'Demo hot spring',
      minTileX: 8,
      minTileY: 8,
      maxTileX: 10,
      maxTileY: 10,
      temperature: {
        heatLevelCelsius: 58,
      },
    },
    {
      id: 'demo-cold-grotto',
      label: 'Demo ice grotto',
      minTileX: -12,
      minTileY: 4,
      maxTileX: -10,
      maxTileY: 6,
      temperature: {
        coldLevelCelsius: -22,
      },
    },
  ];

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
