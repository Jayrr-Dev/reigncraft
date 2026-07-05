import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { listingWorldBuildingPlacedBlocksAtTileFromIndex } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { checkingWorldPlazaLavaAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLavaAtTileIndex';
import { checkingWorldPlazaWaterIsClimateFrozenAtTileIndex } from '@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex';
import { resolvingWorldPlazaClimateAtTile } from '@/components/world/domains/resolvingWorldPlazaClimateAtTileIndex';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { mergingWorldPlazaEnvironmentalTemperatureLevels } from '@/components/world/health/domains/combiningWorldPlazaEnvironmentalTemperatureLevel';
import { convertingWorldPlazaClimateNormalizedToCelsius } from '@/components/world/health/domains/convertingWorldPlazaClimateNormalizedToCelsius';
import { resolvingWorldPlazaTemperatureAreaProfileAtTileIndex } from '@/components/world/health/domains/definingWorldPlazaTemperatureAreaProfiles';
import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_FROZEN_WATER_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_LAVA_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_NIGHT_COOLING_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import { listingWorldPlazaBlockEnvironmentalTemperatureLevelsAtTile } from '@/components/world/health/domains/resolvingWorldPlazaBlockEnvironmentalTemperatureLevel';

export type ComputingWorldPlazaRawEnvironmentalTemperatureAtTileIndexParams = {
  tileX: number;
  tileY: number;
  isDaytime: boolean;
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile;
};

/**
 * Returns the per-tile source temperature before neighbor averaging (°C).
 */
export function computingWorldPlazaRawEnvironmentalTemperatureAtTileIndex({
  tileX,
  tileY,
  isDaytime,
  placedBlocksByTile,
}: ComputingWorldPlazaRawEnvironmentalTemperatureAtTileIndexParams): number {
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
    checkingWorldPlazaWaterIsClimateFrozenAtTileIndex(tileX, tileY)
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

  if (checkingWorldPlazaLavaAtTileIndex(tileX, tileY)) {
    effectiveCelsius = Math.max(
      effectiveCelsius,
      DEFINING_WORLD_PLAZA_TEMPERATURE_LAVA_CELSIUS
    );
  }

  return effectiveCelsius;
}
