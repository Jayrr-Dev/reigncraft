import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { listingWorldBuildingPlacedBlocksAtTileFromIndex } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { checkingWorldPlazaWaterIsFrozenAtTileIndex } from '@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex';
import { samplingWorldPlazaFractalNoise } from '@/components/world/domains/generatingWorldPlazaValueNoise';
import { resolvingWorldPlazaClimateAtTile } from '@/components/world/domains/resolvingWorldPlazaClimateAtTileIndex';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { mergingWorldPlazaEnvironmentalTemperatureLevels } from '@/components/world/health/domains/combiningWorldPlazaEnvironmentalTemperatureLevel';
import { buildingWorldPlazaEnvironmentalTemperatureSample } from '@/components/world/health/domains/computingWorldPlazaTemperatureDamagePerSecond';
import { convertingWorldPlazaClimateNormalizedToCelsius } from '@/components/world/health/domains/convertingWorldPlazaClimateNormalizedToCelsius';
import {
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LAVA_CLIMATE_TEMPERATURE_MIN,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LAVA_TILE_NOISE_THRESHOLD,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';
import type { DefiningWorldPlazaEnvironmentalHazard } from '@/components/world/health/domains/definingWorldPlazaEnvironmentalHazardTypes';
import { resolvingWorldPlazaTemperatureAreaProfileAtTileIndex } from '@/components/world/health/domains/definingWorldPlazaTemperatureAreaProfiles';
import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_FROZEN_WATER_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_LAVA_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_NIGHT_COOLING_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import { listingWorldPlazaBlockEnvironmentalTemperatureLevelsAtTile } from '@/components/world/health/domains/resolvingWorldPlazaBlockEnvironmentalTemperatureLevel';

const RESOLVING_WORLD_PLAZA_ENVIRONMENTAL_HAZARD_LAVA_NOISE_SEED = 4242;

export type ResolvingWorldPlazaEnvironmentalTemperatureAtTileIndexParams = {
  tileX: number;
  tileY: number;
  isDaytime: boolean;
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile;
};

/**
 * Resolves effective local temperature (°C) for one terrain tile.
 */
export function resolvingWorldPlazaEnvironmentalTemperatureAtTileIndex({
  tileX,
  tileY,
  isDaytime,
  placedBlocksByTile,
}: ResolvingWorldPlazaEnvironmentalTemperatureAtTileIndexParams): number {
  const climate = resolvingWorldPlazaClimateAtTile(tileX, tileY);
  let ambientCelsius = convertingWorldPlazaClimateNormalizedToCelsius(
    climate.temperature
  );

  if (!isDaytime) {
    ambientCelsius -= DEFINING_WORLD_PLAZA_TEMPERATURE_NIGHT_COOLING_CELSIUS;
  }
  const waterTile = resolvingWorldPlazaWaterAtTileIndex(tileX, tileY);

  if (
    waterTile &&
    !isDaytime &&
    checkingWorldPlazaWaterIsFrozenAtTileIndex(tileX, tileY)
  ) {
    ambientCelsius = DEFINING_WORLD_PLAZA_TEMPERATURE_FROZEN_WATER_CELSIUS;
  }

  const placedBlocks =
    placedBlocksByTile === undefined
      ? []
      : listingWorldBuildingPlacedBlocksAtTileFromIndex(
          placedBlocksByTile,
          tileX,
          tileY
        );
  const blockLevels =
    listingWorldPlazaBlockEnvironmentalTemperatureLevelsAtTile(placedBlocks);
  const areaProfile = resolvingWorldPlazaTemperatureAreaProfileAtTileIndex(
    tileX,
    tileY
  );
  const areaLevels = areaProfile ? [areaProfile.temperature] : [];

  let effectiveCelsius = mergingWorldPlazaEnvironmentalTemperatureLevels(
    ambientCelsius,
    [...blockLevels, ...areaLevels]
  );

  if (
    !waterTile &&
    climate.temperature >=
      DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LAVA_CLIMATE_TEMPERATURE_MIN
  ) {
    const lavaNoise = samplingWorldPlazaFractalNoise(
      tileX,
      tileY,
      RESOLVING_WORLD_PLAZA_ENVIRONMENTAL_HAZARD_LAVA_NOISE_SEED,
      {
        frequency: 1 / 12,
        octaves: 2,
      }
    );

    if (
      lavaNoise >= DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LAVA_TILE_NOISE_THRESHOLD
    ) {
      effectiveCelsius = Math.max(
        effectiveCelsius,
        DEFINING_WORLD_PLAZA_TEMPERATURE_LAVA_CELSIUS
      );
    }
  }

  return effectiveCelsius;
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
    !temperatureSample.exposureKind ||
    temperatureSample.damagePerSecond <= 0
  ) {
    return null;
  }

  const kind =
    effectiveCelsius >= DEFINING_WORLD_PLAZA_TEMPERATURE_LAVA_CELSIUS - 1
      ? 'lava'
      : temperatureSample.exposureKind;

  return {
    kind,
    damagePerSecond: temperatureSample.damagePerSecond,
    temperatureCelsius: effectiveCelsius,
  };
}
