import { checkingWorldPlazaStillWaterPlacementAtTileIndex } from '@/components/world/domains/checkingWorldPlazaStillWaterPlacementAtTileIndex';
import { checkingWorldPlazaTileIsRockyBiomeAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTileIsRockyBiomeAtTileIndex';
import { computingWorldPlazaWaterPatchNoiseThresholdFromBiomeTemperature } from '@/components/world/domains/computingWorldPlazaWaterPatchNoiseThresholdFromBiomeTemperature';
import { DEFINING_WORLD_PLAZA_BIOME_CATALOG } from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import {
  DEFINING_WORLD_PLAZA_WATER_LAKE_BASIN_NOISE_MIN,
  DEFINING_WORLD_PLAZA_WATER_LAKE_FLOWING_WATER_BASIN_EXCLUSION_NOISE_MIN,
  DEFINING_WORLD_PLAZA_WATER_LAKE_FLOWING_WATER_EXCLUSION_RADIUS_BLOCKS,
  DEFINING_WORLD_PLAZA_WATER_SPAWN_CLEARING_RADIUS_SQUARED,
} from '@/components/world/domains/definingWorldPlazaWaterConstants';
import { DEFINING_WORLD_PLAZA_WATER_KIND_LAKE } from '@/components/world/domains/definingWorldPlazaWaterKind';
import { pickingWorldPlazaBiomeKindFromClimate } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import { resolvingWorldPlazaClimateAtTile } from '@/components/world/domains/resolvingWorldPlazaClimateAtTileIndex';
import {
  samplingWorldPlazaWaterLakeBasinNoiseAtTile,
  samplingWorldPlazaWaterPatchNoiseAtTile,
} from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';

/**
 * Lake basin occupancy checks without calling the full water resolver.
 *
 * Used to gate rivers and streams so they terminate at lakes instead of
 * passing through them.
 *
 * @module components/world/domains/checkingWorldPlazaLakeBasinOccupiesTileAtTileIndex
 */

/** Grid coordinate pair for lake reference searches. */
export interface CheckingWorldPlazaLakeBasinTileCoordinate {
  /** Tile column index. */
  tileX: number;
  /** Tile row index. */
  tileY: number;
}

/** Hard cap on memoized tile columns before the whole cache is reset. */
const CHECKING_WORLD_PLAZA_LAKE_BASIN_OCCUPY_CACHE_MAX_COLUMNS = 4000;

/**
 * Memoized lake basin occupancy results in a nested column→row map. Nearest-lake
 * searches re-query the same tiles many times per frame, so caching turns
 * repeated climate and basin noise sampling into cheap lookups.
 */
const checkingWorldPlazaLakeBasinOccupiesTileCacheByColumn = new Map<
  number,
  Map<number, boolean>
>();

/**
 * Memoized lake basin fringe influence results in a nested column→row map.
 */
const checkingWorldPlazaLakeBasinFringeInfluencesTileCacheByColumn = new Map<
  number,
  Map<number, boolean>
>();

/**
 * Clears the lake basin occupancy and fringe memoization caches after generation
 * rule changes.
 */
export function invalidatingWorldPlazaLakeBasinOccupyCache(): void {
  checkingWorldPlazaLakeBasinOccupiesTileCacheByColumn.clear();
  checkingWorldPlazaLakeBasinFringeInfluencesTileCacheByColumn.clear();
}

/**
 * Reads or writes one boolean tile cache in a column→row map.
 *
 * @param cacheByColumn - Column→row cache map.
 * @param maxColumns - Hard cap before the whole cache is reset.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param compute - Pure predicate when the tile is not cached yet.
 */
function resolvingWorldPlazaLakeBasinBooleanTileCacheAtTileIndex(
  cacheByColumn: Map<number, Map<number, boolean>>,
  maxColumns: number,
  tileX: number,
  tileY: number,
  compute: () => boolean
): boolean {
  let columnCache = cacheByColumn.get(tileX);

  if (columnCache) {
    const cached = columnCache.get(tileY);

    if (cached !== undefined) {
      return cached;
    }
  } else {
    if (cacheByColumn.size >= maxColumns) {
      cacheByColumn.clear();
    }

    columnCache = new Map();
    cacheByColumn.set(tileX, columnCache);
  }

  const value = compute();
  columnCache.set(tileY, value);

  return value;
}

/**
 * Returns true when patch and climate gates would allow any surface water here.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function checkingWorldPlazaLakeBasinWetPatchAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  const climate = resolvingWorldPlazaClimateAtTile(tileX, tileY);
  const biomeKind = pickingWorldPlazaBiomeKindFromClimate(
    climate.temperature,
    climate.humidity,
    tileX,
    tileY
  );

  if (biomeKind === 'ocean') {
    return false;
  }

  const biomeTemperature =
    DEFINING_WORLD_PLAZA_BIOME_CATALOG[biomeKind].temperature;
  const patchNoise = samplingWorldPlazaWaterPatchNoiseAtTile(tileX, tileY);
  const temperatureAdjustedPatchNoiseMin =
    computingWorldPlazaWaterPatchNoiseThresholdFromBiomeTemperature(
      biomeTemperature
    );

  return patchNoise >= temperatureAdjustedPatchNoiseMin;
}

/**
 * Returns true when lake basin noise meets the given minimum on a wet tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param basinNoiseMin - Minimum lake basin noise sample.
 */
function checkingWorldPlazaLakeBasinNoiseMeetsMinimumAtTileIndex(
  tileX: number,
  tileY: number,
  basinNoiseMin: number
): boolean {
  if (checkingWorldPlazaTileIsRockyBiomeAtTileIndex(tileX, tileY)) {
    return false;
  }

  if (
    tileX * tileX + tileY * tileY <
    DEFINING_WORLD_PLAZA_WATER_SPAWN_CLEARING_RADIUS_SQUARED
  ) {
    return false;
  }

  if (!checkingWorldPlazaLakeBasinWetPatchAtTileIndex(tileX, tileY)) {
    return false;
  }

  return (
    samplingWorldPlazaWaterLakeBasinNoiseAtTile(tileX, tileY) >= basinNoiseMin
  );
}

/**
 * Computes whether noise and placement gates would place a lake on this tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function computingWorldPlazaLakeBasinOccupiesTileAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  if (
    !checkingWorldPlazaLakeBasinNoiseMeetsMinimumAtTileIndex(
      tileX,
      tileY,
      DEFINING_WORLD_PLAZA_WATER_LAKE_BASIN_NOISE_MIN
    )
  ) {
    return false;
  }

  return checkingWorldPlazaStillWaterPlacementAtTileIndex(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_WATER_KIND_LAKE
  );
}

/**
 * Returns true when noise and placement gates would place a lake on this tile.
 *
 * Does not call {@link resolvingWorldPlazaWaterAtTileIndex}, so flowing-water
 * gates can use it without import cycles.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaLakeBasinOccupiesTileAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  return resolvingWorldPlazaLakeBasinBooleanTileCacheAtTileIndex(
    checkingWorldPlazaLakeBasinOccupiesTileCacheByColumn,
    CHECKING_WORLD_PLAZA_LAKE_BASIN_OCCUPY_CACHE_MAX_COLUMNS,
    tileX,
    tileY,
    () => computingWorldPlazaLakeBasinOccupiesTileAtTileIndex(tileX, tileY)
  );
}

/**
 * Returns true when the tile sits in the lake basin fringe that influences
 * flowing water placement.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaLakeBasinFringeInfluencesTileAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  return resolvingWorldPlazaLakeBasinBooleanTileCacheAtTileIndex(
    checkingWorldPlazaLakeBasinFringeInfluencesTileCacheByColumn,
    CHECKING_WORLD_PLAZA_LAKE_BASIN_OCCUPY_CACHE_MAX_COLUMNS,
    tileX,
    tileY,
    () =>
      checkingWorldPlazaLakeBasinNoiseMeetsMinimumAtTileIndex(
        tileX,
        tileY,
        DEFINING_WORLD_PLAZA_WATER_LAKE_FLOWING_WATER_BASIN_EXCLUSION_NOISE_MIN
      )
  );
}

/**
 * Returns the nearest lake-occupying tile within the search radius, if any.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param searchRadiusBlocks - Chebyshev search radius in blocks.
 */
export function findingWorldPlazaNearestLakeBasinOccupyingTileNearTileIndex(
  tileX: number,
  tileY: number,
  searchRadiusBlocks: number = DEFINING_WORLD_PLAZA_WATER_LAKE_FLOWING_WATER_EXCLUSION_RADIUS_BLOCKS
): CheckingWorldPlazaLakeBasinTileCoordinate | null {
  for (
    let chebyshevDistanceBlocks = 0;
    chebyshevDistanceBlocks <= searchRadiusBlocks;
    chebyshevDistanceBlocks += 1
  ) {
    for (
      let deltaY = -chebyshevDistanceBlocks;
      deltaY <= chebyshevDistanceBlocks;
      deltaY += 1
    ) {
      for (
        let deltaX = -chebyshevDistanceBlocks;
        deltaX <= chebyshevDistanceBlocks;
        deltaX += 1
      ) {
        if (
          Math.max(Math.abs(deltaX), Math.abs(deltaY)) !==
          chebyshevDistanceBlocks
        ) {
          continue;
        }

        const neighborTileX = tileX + deltaX;
        const neighborTileY = tileY + deltaY;

        if (
          checkingWorldPlazaLakeBasinOccupiesTileAtTileIndex(
            neighborTileX,
            neighborTileY
          )
        ) {
          return {
            tileX: neighborTileX,
            tileY: neighborTileY,
          };
        }
      }
    }
  }

  return null;
}
