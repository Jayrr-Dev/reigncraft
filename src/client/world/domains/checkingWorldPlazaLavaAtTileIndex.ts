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

/** Hard cap on memoized tile columns before the whole cache is reset. */
const CHECKING_WORLD_PLAZA_LAVA_AT_TILE_INDEX_CACHE_MAX_COLUMNS = 4000;

/**
 * Memoized lava placement in a nested column→row map. Placement is
 * deterministic, and hazard damage, frozen-water ring scans, the lava overlay,
 * and floor bakes re-check the same tiles many times per frame, so caching
 * turns repeated ruin-blueprint searches and fractal-noise sampling into cheap
 * lookups.
 */
const checkingWorldPlazaLavaAtTileIndexCacheByColumn = new Map<
  number,
  Map<number, boolean>
>();

/**
 * Clears the lava placement memoization cache after generation rule changes.
 */
export function invalidatingWorldPlazaLavaAtTileIndexCache(): void {
  checkingWorldPlazaLavaAtTileIndexCacheByColumn.clear();
}

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

  let columnCache = checkingWorldPlazaLavaAtTileIndexCacheByColumn.get(tileX);

  if (columnCache) {
    const cached = columnCache.get(tileY);

    if (cached !== undefined) {
      return cached;
    }
  } else {
    if (
      checkingWorldPlazaLavaAtTileIndexCacheByColumn.size >=
      CHECKING_WORLD_PLAZA_LAVA_AT_TILE_INDEX_CACHE_MAX_COLUMNS
    ) {
      checkingWorldPlazaLavaAtTileIndexCacheByColumn.clear();
    }

    columnCache = new Map();
    checkingWorldPlazaLavaAtTileIndexCacheByColumn.set(tileX, columnCache);
  }

  const isLavaTile = computingWorldPlazaLavaAtTileIndex(tileX, tileY);
  columnCache.set(tileY, isLavaTile);

  return isLavaTile;
}

/**
 * Computes lava placement for a tile without memoization.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function computingWorldPlazaLavaAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
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
