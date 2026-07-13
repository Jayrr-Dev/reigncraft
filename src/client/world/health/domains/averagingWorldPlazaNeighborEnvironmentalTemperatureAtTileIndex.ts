import { applyingWorldPlazaForestCanopyAmbientCelsius } from '@/components/world/domains/definingWorldPlazaForestTemperatureConstants';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import { readingWorldPlazaEnvironmentalTemperatureSamplingContext } from '@/components/world/health/domains/cachingWorldPlazaEnvironmentalTemperatureSamplingContext';
import { checkingWorldPlazaTileHasAssignableEnvironmentalTemperatureSourceAtTileIndex } from '@/components/world/health/domains/checkingWorldPlazaTileHasAssignableEnvironmentalTemperatureSourceAtTileIndex';
import type { ComputingWorldPlazaRawEnvironmentalTemperatureAtTileIndexParams } from '@/components/world/health/domains/computingWorldPlazaRawEnvironmentalTemperatureAtTileIndex';
import { computingWorldPlazaRawEnvironmentalTemperatureAtTileIndex } from '@/components/world/health/domains/computingWorldPlazaRawEnvironmentalTemperatureAtTileIndex';
import { DEFINING_WORLD_PLAZA_TEMPERATURE_NEIGHBOR_AVERAGING_RING } from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';

/**
 * Blends a tile toward the average raw temperature of its neighborhood.
 *
 * Tiles that directly host lava, campfires, or painted heat/cold zones keep
 * their source temperature so hot blocks stay lethal while surrounding grass
 * warms from nearby sources (including procedural lava). Neighbor averaging
 * always runs for non-source tiles so floor heat tints can red-shift by temp.
 *
 * Woodland biomes then get a temperate ceiling unless the neighborhood holds an
 * assignable heat source (lava / campfire / painted zone), so desert bleed
 * cannot cook forest while lava still radiates.
 */
export function averagingWorldPlazaNeighborEnvironmentalTemperatureAtTileIndex(
  params: ComputingWorldPlazaRawEnvironmentalTemperatureAtTileIndexParams
): number {
  // Prefer the scene placed-block index when the caller did not pass one, so
  // campfire/ice heat still participates in source detection and blends.
  const placedBlocksByTile =
    params.placedBlocksByTile ??
    readingWorldPlazaEnvironmentalTemperatureSamplingContext()
      .placedBlocksByTile;
  const samplingParams = {
    ...params,
    placedBlocksByTile,
  };

  if (
    checkingWorldPlazaTileHasAssignableEnvironmentalTemperatureSourceAtTileIndex(
      samplingParams
    )
  ) {
    return computingWorldPlazaRawEnvironmentalTemperatureAtTileIndex(
      samplingParams
    );
  }

  const ring = DEFINING_WORLD_PLAZA_TEMPERATURE_NEIGHBOR_AVERAGING_RING;
  let temperatureSumCelsius = 0;
  let sampledTileCount = 0;
  let neighborhoodHasAssignableSource = false;

  for (let offsetTileY = -ring; offsetTileY <= ring; offsetTileY += 1) {
    for (let offsetTileX = -ring; offsetTileX <= ring; offsetTileX += 1) {
      const sampleTileX = params.tileX + offsetTileX;
      const sampleTileY = params.tileY + offsetTileY;

      if (
        checkingWorldPlazaTileHasAssignableEnvironmentalTemperatureSourceAtTileIndex(
          {
            tileX: sampleTileX,
            tileY: sampleTileY,
            placedBlocksByTile,
          }
        )
      ) {
        neighborhoodHasAssignableSource = true;
      }

      temperatureSumCelsius +=
        computingWorldPlazaRawEnvironmentalTemperatureAtTileIndex({
          ...samplingParams,
          tileX: sampleTileX,
          tileY: sampleTileY,
        });
      sampledTileCount += 1;
    }
  }

  const averagedCelsius = temperatureSumCelsius / sampledTileCount;

  if (neighborhoodHasAssignableSource) {
    return averagedCelsius;
  }

  return applyingWorldPlazaForestCanopyAmbientCelsius(
    averagedCelsius,
    resolvingWorldPlazaBiomeAtTileIndex(params.tileX, params.tileY).kind
  );
}
