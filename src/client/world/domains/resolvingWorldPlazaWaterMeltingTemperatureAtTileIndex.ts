import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { DEFINING_WORLD_PLAZA_TEMPERATURE_NEIGHBOR_AVERAGING_RING } from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import { resolvingWorldPlazaEnvironmentalTemperatureAtTileIndex } from '@/components/world/health/domains/resolvingWorldPlazaEnvironmentalHazardAtTileIndex';

export type ResolvingWorldPlazaWaterMeltingTemperatureAtTileIndexParams = {
  tileX: number;
  tileY: number;
  isDaytime: boolean;
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile;
};

/**
 * Returns the warmest effective local temperature near a water tile (°C).
 *
 * Ice melts from the hottest nearby heat source, not the averaged neighborhood.
 */
export function resolvingWorldPlazaWaterMeltingTemperatureAtTileIndex({
  tileX,
  tileY,
  isDaytime,
  placedBlocksByTile,
}: ResolvingWorldPlazaWaterMeltingTemperatureAtTileIndexParams): number {
  const ring = DEFINING_WORLD_PLAZA_TEMPERATURE_NEIGHBOR_AVERAGING_RING;
  let warmestCelsius = Number.NEGATIVE_INFINITY;

  for (let offsetTileY = -ring; offsetTileY <= ring; offsetTileY += 1) {
    for (let offsetTileX = -ring; offsetTileX <= ring; offsetTileX += 1) {
      warmestCelsius = Math.max(
        warmestCelsius,
        resolvingWorldPlazaEnvironmentalTemperatureAtTileIndex({
          tileX: tileX + offsetTileX,
          tileY: tileY + offsetTileY,
          isDaytime,
          placedBlocksByTile,
        })
      );
    }
  }

  return warmestCelsius;
}
