import { checkingWorldPlazaWaterIsFrozenAtTileIndex } from '@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex';
import { samplingWorldPlazaFractalNoise } from '@/components/world/domains/generatingWorldPlazaValueNoise';
import { resolvingWorldPlazaClimateAtTile } from '@/components/world/domains/resolvingWorldPlazaClimateAtTileIndex';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import {
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_COLD_CLIMATE_TEMPERATURE_MAX,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_COLD_DAMAGE_PER_SECOND,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_HEAT_CLIMATE_TEMPERATURE_MIN,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_HEAT_DAMAGE_PER_SECOND,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LAVA_CLIMATE_TEMPERATURE_MIN,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LAVA_DAMAGE_PER_SECOND,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LAVA_TILE_NOISE_THRESHOLD,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';
import type { DefiningWorldPlazaEnvironmentalHazard } from '@/components/world/health/domains/definingWorldPlazaEnvironmentalHazardTypes';

const RESOLVING_WORLD_PLAZA_ENVIRONMENTAL_HAZARD_LAVA_NOISE_SEED = 4242;

/**
 * Samples environmental hazard damage for one terrain tile.
 *
 * Hot climates become heat zones with sparse lava tiles. Cold climates deal
 * cold damage at night, including frozen water tiles.
 */
export function resolvingWorldPlazaEnvironmentalHazardAtTileIndex(
  tileX: number,
  tileY: number,
  isDaytime: boolean
): DefiningWorldPlazaEnvironmentalHazard | null {
  const waterTile = resolvingWorldPlazaWaterAtTileIndex(tileX, tileY);

  if (waterTile) {
    if (
      !isDaytime &&
      checkingWorldPlazaWaterIsFrozenAtTileIndex(tileX, tileY)
    ) {
      const climate = resolvingWorldPlazaClimateAtTile(tileX, tileY);

      if (
        climate.temperature <=
        DEFINING_WORLD_PLAZA_ENTITY_HEALTH_COLD_CLIMATE_TEMPERATURE_MAX
      ) {
        return {
          kind: 'cold',
          damagePerSecond:
            DEFINING_WORLD_PLAZA_ENTITY_HEALTH_COLD_DAMAGE_PER_SECOND,
        };
      }
    }

    return null;
  }

  const climate = resolvingWorldPlazaClimateAtTile(tileX, tileY);

  if (
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
      return {
        kind: 'lava',
        damagePerSecond:
          DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LAVA_DAMAGE_PER_SECOND,
      };
    }
  }

  if (
    climate.temperature >=
    DEFINING_WORLD_PLAZA_ENTITY_HEALTH_HEAT_CLIMATE_TEMPERATURE_MIN
  ) {
    return {
      kind: 'heat',
      damagePerSecond:
        DEFINING_WORLD_PLAZA_ENTITY_HEALTH_HEAT_DAMAGE_PER_SECOND,
    };
  }

  if (
    !isDaytime &&
    climate.temperature <=
      DEFINING_WORLD_PLAZA_ENTITY_HEALTH_COLD_CLIMATE_TEMPERATURE_MAX
  ) {
    return {
      kind: 'cold',
      damagePerSecond:
        DEFINING_WORLD_PLAZA_ENTITY_HEALTH_COLD_DAMAGE_PER_SECOND,
    };
  }

  return null;
}
