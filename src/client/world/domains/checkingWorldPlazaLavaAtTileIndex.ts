import { checkingWorldPlazaFirelandsRuinForcesLavaAtTileIndex } from '@/components/world/domains/checkingWorldPlazaFirelandsRuinForcesLavaAtTileIndex';
import { checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex';
import { DEFINING_WORLD_PLAZA_FIRELANDS_LAVA_TILE_NOISE_THRESHOLD } from '@/components/world/domains/definingWorldPlazaFirelandsBiomeConstants';
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import { samplingWorldPlazaFractalNoise } from '@/components/world/domains/generatingWorldPlazaValueNoise';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { resolvingWorldPlazaClimateAtTile } from '@/components/world/domains/resolvingWorldPlazaClimateAtTileIndex';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import {
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LAVA_CLIMATE_TEMPERATURE_MIN,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LAVA_TILE_NOISE_THRESHOLD,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';

/**
 * Deterministic lava tile placement shared by rendering and hazard damage.
 *
 * @module components/world/domains/checkingWorldPlazaLavaAtTileIndex
 */

/** Seed for the sparse lava pool placement noise. */
export const CHECKING_WORLD_PLAZA_LAVA_TILE_NOISE_SEED = 4242;

/** Frequency for lava pool placement noise. */
export const CHECKING_WORLD_PLAZA_LAVA_TILE_NOISE_FREQUENCY = 1 / 12;

/** Octaves for lava pool placement noise. */
export const CHECKING_WORLD_PLAZA_LAVA_TILE_NOISE_OCTAVES = 2;

/**
 * Returns true when the tile is a procedural lava pool tile.
 *
 * Lava only spawns on dry tiles in the hottest climate band where the sparse
 * placement noise peaks.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaLavaAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  if (
    !checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.LAVA
    )
  ) {
    return false;
  }

  if (checkingWorldPlazaFirelandsRuinForcesLavaAtTileIndex(tileX, tileY)) {
    return true;
  }

  if (checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex(tileX, tileY)) {
    if (resolvingWorldPlazaWaterAtTileIndex(tileX, tileY)) {
      return false;
    }

    const lavaNoise = samplingWorldPlazaFractalNoise(
      tileX,
      tileY,
      CHECKING_WORLD_PLAZA_LAVA_TILE_NOISE_SEED,
      {
        frequency: CHECKING_WORLD_PLAZA_LAVA_TILE_NOISE_FREQUENCY,
        octaves: CHECKING_WORLD_PLAZA_LAVA_TILE_NOISE_OCTAVES,
      }
    );

    return (
      lavaNoise >= DEFINING_WORLD_PLAZA_FIRELANDS_LAVA_TILE_NOISE_THRESHOLD
    );
  }

  const climate = resolvingWorldPlazaClimateAtTile(tileX, tileY);

  if (
    climate.temperature <
    DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LAVA_CLIMATE_TEMPERATURE_MIN
  ) {
    return false;
  }

  if (resolvingWorldPlazaWaterAtTileIndex(tileX, tileY)) {
    return false;
  }

  const lavaNoise = samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    CHECKING_WORLD_PLAZA_LAVA_TILE_NOISE_SEED,
    {
      frequency: CHECKING_WORLD_PLAZA_LAVA_TILE_NOISE_FREQUENCY,
      octaves: CHECKING_WORLD_PLAZA_LAVA_TILE_NOISE_OCTAVES,
    }
  );

  return (
    lavaNoise >= DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LAVA_TILE_NOISE_THRESHOLD
  );
}
