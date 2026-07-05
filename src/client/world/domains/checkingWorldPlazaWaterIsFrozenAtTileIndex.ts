import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { computingWorldPlazaDayNightSunState } from '@/components/world/domains/computingWorldPlazaDayNightSunState';
import { DEFINING_WORLD_PLAZA_WATER_FROZEN_CLIMATE_TEMPERATURE_MAX } from '@/components/world/domains/definingWorldPlazaWaterConstants';
import { resolvingWorldPlazaClimateAtTile } from '@/components/world/domains/resolvingWorldPlazaClimateAtTileIndex';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { resolvingWorldPlazaWaterMeltingTemperatureAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterMeltingTemperatureAtTileIndex';
import { readingWorldPlazaEnvironmentalTemperatureSamplingContext } from '@/components/world/health/domains/cachingWorldPlazaEnvironmentalTemperatureSamplingContext';
import { DEFINING_WORLD_PLAZA_WATER_MELTING_POINT_CELSIUS } from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';

/**
 * Detects frozen surface water from climate and local environmental heat.
 *
 * @module components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex
 */

export type CheckingWorldPlazaWaterIsFrozenAtTileIndexOptions = {
  isDaytime?: boolean;
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile;
};

/**
 * Returns true when procedural climate alone would freeze surface water.
 */
export function checkingWorldPlazaWaterIsClimateFrozenAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  if (!resolvingWorldPlazaWaterAtTileIndex(tileX, tileY)) {
    return false;
  }

  const climate = resolvingWorldPlazaClimateAtTile(tileX, tileY);

  return (
    climate.temperature <=
    DEFINING_WORLD_PLAZA_WATER_FROZEN_CLIMATE_TEMPERATURE_MAX
  );
}

/**
 * Returns true when surface water on the tile is frozen solid.
 *
 * Climate-frozen tiles thaw when nearby heat pushes effective local temperature
 * to the melting point. Removing the heat lets them freeze again.
 *
 * Frozen tiles stay visually wet but become walkable and skip flow animation.
 */
export function checkingWorldPlazaWaterIsFrozenAtTileIndex(
  tileX: number,
  tileY: number,
  options: CheckingWorldPlazaWaterIsFrozenAtTileIndexOptions = {}
): boolean {
  if (!checkingWorldPlazaWaterIsClimateFrozenAtTileIndex(tileX, tileY)) {
    return false;
  }

  const samplingContext =
    readingWorldPlazaEnvironmentalTemperatureSamplingContext();
  const isDaytime =
    options.isDaytime ?? computingWorldPlazaDayNightSunState().isDaytime;
  const placedBlocksByTile =
    options.placedBlocksByTile ?? samplingContext.placedBlocksByTile;
  const effectiveCelsius =
    resolvingWorldPlazaWaterMeltingTemperatureAtTileIndex({
      tileX,
      tileY,
      isDaytime,
      placedBlocksByTile,
    });

  return effectiveCelsius < DEFINING_WORLD_PLAZA_WATER_MELTING_POINT_CELSIUS;
}
