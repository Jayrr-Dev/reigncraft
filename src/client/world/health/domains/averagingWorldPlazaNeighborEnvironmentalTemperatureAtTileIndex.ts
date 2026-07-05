import { checkingWorldPlazaTileHasAssignableEnvironmentalTemperatureSourceAtTileIndex } from '@/components/world/health/domains/checkingWorldPlazaTileHasAssignableEnvironmentalTemperatureSourceAtTileIndex';
import type { ComputingWorldPlazaRawEnvironmentalTemperatureAtTileIndexParams } from '@/components/world/health/domains/computingWorldPlazaRawEnvironmentalTemperatureAtTileIndex';
import { computingWorldPlazaRawEnvironmentalTemperatureAtTileIndex } from '@/components/world/health/domains/computingWorldPlazaRawEnvironmentalTemperatureAtTileIndex';
import { DEFINING_WORLD_PLAZA_TEMPERATURE_NEIGHBOR_AVERAGING_RING } from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';

/**
 * Blends a tile toward the average raw temperature of its neighborhood.
 *
 * Tiles that directly host lava, campfires, or painted heat/cold zones keep
 * their source temperature so hot blocks stay lethal while surrounding grass
 * warms from nearby sources.
 */
export function averagingWorldPlazaNeighborEnvironmentalTemperatureAtTileIndex(
  params: ComputingWorldPlazaRawEnvironmentalTemperatureAtTileIndexParams
): number {
  if (
    checkingWorldPlazaTileHasAssignableEnvironmentalTemperatureSourceAtTileIndex(
      params
    )
  ) {
    return computingWorldPlazaRawEnvironmentalTemperatureAtTileIndex(params);
  }

  const ring = DEFINING_WORLD_PLAZA_TEMPERATURE_NEIGHBOR_AVERAGING_RING;
  let temperatureSumCelsius = 0;
  let sampledTileCount = 0;

  for (let offsetTileY = -ring; offsetTileY <= ring; offsetTileY += 1) {
    for (let offsetTileX = -ring; offsetTileX <= ring; offsetTileX += 1) {
      temperatureSumCelsius +=
        computingWorldPlazaRawEnvironmentalTemperatureAtTileIndex({
          ...params,
          tileX: params.tileX + offsetTileX,
          tileY: params.tileY + offsetTileY,
        });
      sampledTileCount += 1;
    }
  }

  return temperatureSumCelsius / sampledTileCount;
}
