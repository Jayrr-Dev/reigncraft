import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { computingWorldPlazaDayNightSunState } from '@/components/world/domains/computingWorldPlazaDayNightSunState';
import { DEFINING_WORLD_PLAZA_WATER_FROZEN_CLIMATE_TEMPERATURE_MAX } from '@/components/world/domains/definingWorldPlazaWaterConstants';
import { resolvingWorldPlazaClimateAtTile } from '@/components/world/domains/resolvingWorldPlazaClimateAtTileIndex';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { resolvingWorldPlazaWaterPhaseTemperatureAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterPhaseTemperatureAtTileIndex';
import { readingWorldPlazaEnvironmentalTemperatureSamplingContext } from '@/components/world/health/domains/cachingWorldPlazaEnvironmentalTemperatureSamplingContext';
import { DEFINING_WORLD_PLAZA_WATER_MELTING_POINT_CELSIUS } from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';

/**
 * Detects frozen surface water from climate and local environmental heat/cold.
 *
 * @module components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex
 */

export type CheckingWorldPlazaWaterIsFrozenAtTileIndexOptions = {
  isDaytime?: boolean;
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile;
};

/** Hard cap on memoized tile columns before the whole cache is reset. */
const CHECKING_WORLD_PLAZA_WATER_FROZEN_CACHE_MAX_COLUMNS = 4000;

/**
 * Memoized frozen-state results for the ambient sampling context, split by
 * daytime flag. Each uncached check scans a 5x5 neighbor ring for assignable
 * temperature sources (lava, zones, blocks), and the water surface, shimmer,
 * floor bake, minimap, and navigation paths re-check the same tiles many times
 * per frame, so caching collapses those ring scans into cheap lookups.
 *
 * The cache epoch is the terrain thaw-visual key (sun bucket + placed
 * temperature blocks + debug override revision), so campfire placement and
 * day/night transitions clear it.
 */
const checkingWorldPlazaWaterFrozenCacheByDaytime: readonly [
  Map<number, Map<number, boolean>>,
  Map<number, Map<number, boolean>>,
] = [new Map(), new Map()];

let checkingWorldPlazaWaterFrozenCacheEpoch = '';

/**
 * Clears the frozen-state memoization cache.
 */
export function invalidatingWorldPlazaWaterFrozenStateAtTileIndexCache(): void {
  checkingWorldPlazaWaterFrozenCacheByDaytime[0].clear();
  checkingWorldPlazaWaterFrozenCacheByDaytime[1].clear();
}

/**
 * Rolls the frozen-state cache epoch; clears memoized results when it changes.
 *
 * Called from the terrain dependency snapshot with the thaw-visual key so the
 * cache tracks placed temperature blocks and day/night transitions.
 *
 * @param epoch - Opaque key that changes whenever freeze inputs change.
 */
export function settingWorldPlazaWaterFrozenStateCacheEpoch(
  epoch: string
): void {
  if (epoch === checkingWorldPlazaWaterFrozenCacheEpoch) {
    return;
  }

  checkingWorldPlazaWaterFrozenCacheEpoch = epoch;
  invalidatingWorldPlazaWaterFrozenStateAtTileIndexCache();
}

/**
 * Returns true when procedural climate alone would freeze surface water.
 */
export function checkingWorldPlazaWaterIsClimateFrozenAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  if (!resolvingWorldPlazaWaterAtTileIndex(tileX, tileY)) {
    return false;
  }

  const climate = resolvingWorldPlazaClimateAtTile(tileX, tileY);

  return (
    climate.temperature <=
    DEFINING_WORLD_PLAZA_WATER_FROZEN_CLIMATE_TEMPERATURE_MAX
  );
}

/**
 * Returns true when surface water on the tile is frozen solid.
 *
 * Phase rules (neighbor ring, assignable sources only):
 * 1. Nearby heat at or above the melting point keeps water liquid (thaw).
 * 2. Else nearby cold below the melting point freezes water.
 * 3. Else climate-frozen tiles stay ice.
 *
 * Frozen tiles stay visually wet but become walkable and skip flow animation.
 */
export function checkingWorldPlazaWaterIsFrozenAtTileIndex(
  tileX: number,
  tileY: number,
  options: CheckingWorldPlazaWaterIsFrozenAtTileIndexOptions = {}
): boolean {
  if (!resolvingWorldPlazaWaterAtTileIndex(tileX, tileY)) {
    return false;
  }

  const samplingContext =
    readingWorldPlazaEnvironmentalTemperatureSamplingContext();
  const isDaytime =
    options.isDaytime ?? computingWorldPlazaDayNightSunState().isDaytime;
  const placedBlocksByTile =
    options.placedBlocksByTile ?? samplingContext.placedBlocksByTile;

  // Only the ambient sampling context is memoized; explicit block indexes
  // (avatar ice checks, tests) bypass the cache.
  const isAmbientContext = options.placedBlocksByTile === undefined;
  const cacheByColumn =
    checkingWorldPlazaWaterFrozenCacheByDaytime[isDaytime ? 1 : 0];
  let columnCache: Map<number, boolean> | undefined;

  if (isAmbientContext) {
    columnCache = cacheByColumn.get(tileX);

    if (columnCache) {
      const cached = columnCache.get(tileY);

      if (cached !== undefined) {
        return cached;
      }
    } else {
      if (
        cacheByColumn.size >= CHECKING_WORLD_PLAZA_WATER_FROZEN_CACHE_MAX_COLUMNS
      ) {
        cacheByColumn.clear();
      }

      columnCache = new Map();
      cacheByColumn.set(tileX, columnCache);
    }
  }

  const isFrozen = computingWorldPlazaWaterIsFrozenAtTileIndex(
    tileX,
    tileY,
    isDaytime,
    placedBlocksByTile
  );
  columnCache?.set(tileY, isFrozen);

  return isFrozen;
}

/**
 * Computes the frozen state for one water tile without memoization.
 */
function computingWorldPlazaWaterIsFrozenAtTileIndex(
  tileX: number,
  tileY: number,
  isDaytime: boolean,
  placedBlocksByTile: IndexingWorldBuildingPlacedBlocksByTile | undefined
): boolean {
  const phaseTemperature = resolvingWorldPlazaWaterPhaseTemperatureAtTileIndex({
    tileX,
    tileY,
    isDaytime,
    placedBlocksByTile,
  });

  if (phaseTemperature.hasAssignableSource) {
    if (
      phaseTemperature.warmestSourceCelsius >=
      DEFINING_WORLD_PLAZA_WATER_MELTING_POINT_CELSIUS
    ) {
      return false;
    }

    if (
      phaseTemperature.coldestSourceCelsius <
      DEFINING_WORLD_PLAZA_WATER_MELTING_POINT_CELSIUS
    ) {
      return true;
    }
  }

  return checkingWorldPlazaWaterIsClimateFrozenAtTileIndex(tileX, tileY);
}
