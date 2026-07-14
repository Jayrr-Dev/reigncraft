import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { listingWorldBuildingPlacedBlocksAtTileFromIndex } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { checkingWorldPlazaLavaAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLavaAtTileIndex';
import { checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex';
import { checkingWorldPlazaWaterIsClimateFrozenAtTileIndex } from '@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex';
import { DEFINING_WORLD_PLAZA_FIRELANDS_AMBIENT_TEMPERATURE_CELSIUS } from '@/components/world/domains/definingWorldPlazaFirelandsBiomeConstants';
import { applyingWorldPlazaForestCanopyAmbientCelsius } from '@/components/world/domains/definingWorldPlazaForestTemperatureConstants';
import { applyingWorldPlazaPlainsAmbientCelsius } from '@/components/world/domains/definingWorldPlazaPlainsTemperatureConstants';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import { resolvingWorldPlazaClimateAtTile } from '@/components/world/domains/resolvingWorldPlazaClimateAtTileIndex';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { resolvingWorldPlazaLitCampfireHeatCelsiusAtTileIndex } from '@/components/world/fire/domains/managingWorldPlazaLitCampfireHeatTilesStore';
import { resolvingWorldPlazaActiveOreSmeltingHeatCelsiusAtTileIndex } from '@/components/world/crafting/domains/managingWorldPlazaActiveOreSmeltingHeatTilesStore';
import { applyingWorldPlazaTemperatureDebugOverrideToCelsius } from '@/components/world/health/domains/applyingWorldPlazaTemperatureDebugOverride';
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
 *
 * Woodland and plains temperate ceilings clamp climate ambient here; lava /
 * campfire still raise the tile afterward. Averaging re-applies the ceiling
 * when no nearby assignable heat source is diluting the blend.
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

  const biomeKind = resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY).kind;

  ambientCelsius = applyingWorldPlazaForestCanopyAmbientCelsius(
    ambientCelsius,
    biomeKind
  );
  ambientCelsius = applyingWorldPlazaPlainsAmbientCelsius(
    ambientCelsius,
    biomeKind
  );

  if (checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex(tileX, tileY)) {
    ambientCelsius = Math.max(
      ambientCelsius,
      DEFINING_WORLD_PLAZA_FIRELANDS_AMBIENT_TEMPERATURE_CELSIUS
    );
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

  effectiveCelsius =
    applyingWorldPlazaTemperatureDebugOverrideToCelsius(effectiveCelsius);

  if (checkingWorldPlazaLavaAtTileIndex(tileX, tileY)) {
    effectiveCelsius = Math.max(
      effectiveCelsius,
      DEFINING_WORLD_PLAZA_TEMPERATURE_LAVA_CELSIUS
    );
  }

  const litCampfireCelsius =
    resolvingWorldPlazaLitCampfireHeatCelsiusAtTileIndex(tileX, tileY);

  if (litCampfireCelsius !== null) {
    effectiveCelsius = Math.max(effectiveCelsius, litCampfireCelsius);
  }

  const activeOreSmeltingCelsius =
    resolvingWorldPlazaActiveOreSmeltingHeatCelsiusAtTileIndex(tileX, tileY);

  if (activeOreSmeltingCelsius !== null) {
    effectiveCelsius = Math.max(effectiveCelsius, activeOreSmeltingCelsius);
  }

  return effectiveCelsius;
}
