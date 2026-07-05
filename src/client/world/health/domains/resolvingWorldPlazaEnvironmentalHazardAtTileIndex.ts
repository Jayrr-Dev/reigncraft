import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { averagingWorldPlazaNeighborEnvironmentalTemperatureAtTileIndex } from '@/components/world/health/domains/averagingWorldPlazaNeighborEnvironmentalTemperatureAtTileIndex';
import {
  buildingWorldPlazaEnvironmentalTemperatureSample,
  checkingWorldPlazaEnvironmentalTemperatureSampleHasDamage,
} from '@/components/world/health/domains/computingWorldPlazaTemperatureDamagePerSecond';
import type { DefiningWorldPlazaEnvironmentalHazard } from '@/components/world/health/domains/definingWorldPlazaEnvironmentalHazardTypes';
import { DEFINING_WORLD_PLAZA_TEMPERATURE_LAVA_CELSIUS } from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';

export type ResolvingWorldPlazaEnvironmentalTemperatureAtTileIndexParams = {
  tileX: number;
  tileY: number;
  isDaytime: boolean;
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile;
};

/**
 * Resolves effective local temperature (°C) for one terrain tile.
 */
export function resolvingWorldPlazaEnvironmentalTemperatureAtTileIndex(
  params: ResolvingWorldPlazaEnvironmentalTemperatureAtTileIndexParams
): number {
  return averagingWorldPlazaNeighborEnvironmentalTemperatureAtTileIndex(params);
}

/**
 * Samples environmental hazard damage for one terrain tile.
 */
export function resolvingWorldPlazaEnvironmentalHazardAtTileIndex(
  tileX: number,
  tileY: number,
  isDaytime: boolean,
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): DefiningWorldPlazaEnvironmentalHazard | null {
  const effectiveCelsius =
    resolvingWorldPlazaEnvironmentalTemperatureAtTileIndex({
      tileX,
      tileY,
      isDaytime,
      placedBlocksByTile,
    });
  const temperatureSample =
    buildingWorldPlazaEnvironmentalTemperatureSample(effectiveCelsius);

  if (
    !checkingWorldPlazaEnvironmentalTemperatureSampleHasDamage(
      temperatureSample
    )
  ) {
    return null;
  }

  const kind =
    effectiveCelsius >= DEFINING_WORLD_PLAZA_TEMPERATURE_LAVA_CELSIUS - 1
      ? 'lava'
      : temperatureSample.exposureKind;

  if (!kind) {
    return null;
  }

  return {
    kind,
    damagePerSecond: temperatureSample.damagePerSecond,
    maxHealthPercentPerSecond: temperatureSample.maxHealthPercentPerSecond,
    temperatureCelsius: effectiveCelsius,
  };
}
