import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { checkingWorldPlazaTileHasAssignableEnvironmentalTemperatureSourceAtTileIndex } from '@/components/world/health/domains/checkingWorldPlazaTileHasAssignableEnvironmentalTemperatureSourceAtTileIndex';
import { computingWorldPlazaRawEnvironmentalTemperatureAtTileIndex } from '@/components/world/health/domains/computingWorldPlazaRawEnvironmentalTemperatureAtTileIndex';
import { DEFINING_WORLD_PLAZA_TEMPERATURE_NEIGHBOR_AVERAGING_RING } from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';

export type ResolvingWorldPlazaWaterPhaseTemperatureAtTileIndexParams = {
  tileX: number;
  tileY: number;
  isDaytime: boolean;
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile;
};

export type ResolvingWorldPlazaWaterPhaseTemperatureAtTileIndexResult = {
  /** True when any assignable heat/cold/lava/area source sits in the ring. */
  readonly hasAssignableSource: boolean;
  /** Warmest raw °C among assignable source tiles in the ring. */
  readonly warmestSourceCelsius: number;
  /** Coldest raw °C among assignable source tiles in the ring. */
  readonly coldestSourceCelsius: number;
};

/**
 * Scans the neighbor ring for assignable temperature sources near a water tile.
 *
 * Ambient climate alone does not count. Heat and cold blocks, lava, and painted
 * zones do. Freeze/thaw uses these extremes so warm grass cannot block an ice
 * block, and a campfire still thaws climate ice.
 */
export function resolvingWorldPlazaWaterPhaseTemperatureAtTileIndex({
  tileX,
  tileY,
  isDaytime,
  placedBlocksByTile,
}: ResolvingWorldPlazaWaterPhaseTemperatureAtTileIndexParams): ResolvingWorldPlazaWaterPhaseTemperatureAtTileIndexResult {
  const ring = DEFINING_WORLD_PLAZA_TEMPERATURE_NEIGHBOR_AVERAGING_RING;
  let hasAssignableSource = false;
  let warmestSourceCelsius = Number.NEGATIVE_INFINITY;
  let coldestSourceCelsius = Number.POSITIVE_INFINITY;

  for (let offsetTileY = -ring; offsetTileY <= ring; offsetTileY += 1) {
    for (let offsetTileX = -ring; offsetTileX <= ring; offsetTileX += 1) {
      const sampleTileX = tileX + offsetTileX;
      const sampleTileY = tileY + offsetTileY;

      if (
        !checkingWorldPlazaTileHasAssignableEnvironmentalTemperatureSourceAtTileIndex(
          {
            tileX: sampleTileX,
            tileY: sampleTileY,
            placedBlocksByTile,
          }
        )
      ) {
        continue;
      }

      const sourceCelsius =
        computingWorldPlazaRawEnvironmentalTemperatureAtTileIndex({
          tileX: sampleTileX,
          tileY: sampleTileY,
          isDaytime,
          placedBlocksByTile,
        });

      hasAssignableSource = true;
      warmestSourceCelsius = Math.max(warmestSourceCelsius, sourceCelsius);
      coldestSourceCelsius = Math.min(coldestSourceCelsius, sourceCelsius);
    }
  }

  return {
    hasAssignableSource,
    warmestSourceCelsius,
    coldestSourceCelsius,
  };
}
