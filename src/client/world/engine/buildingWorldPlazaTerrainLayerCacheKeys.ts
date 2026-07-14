import { checkingWorldBuildingBlockDefinitionIdIsNaturalTree } from '@/components/world/building/domains/checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_METADATA_KEY } from '@/components/world/domains/definingWorldPlazaTreeLayerGrowthConstants';
import type { DefiningWorldPlazaChoppedTreeTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import type { DefiningWorldPlazaPickedFlowerTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedFlowers';
import type { DefiningWorldPlazaClearedLongGrassTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalClearedLongGrass';
import type { DefiningWorldPlazaPickedPebbleTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedPebbles';

/**
 * Cache keys for terrain layer dependency snapshots.
 *
 * @module components/world/engine/buildingWorldPlazaTerrainLayerCacheKeys
 */

const placedTreeBlocksCacheKeys = new WeakMap<
  DefiningWorldBuildingPlacedBlock[],
  string
>();
const choppedTreesCacheKeys = new WeakMap<
  ReadonlyMap<string, DefiningWorldPlazaChoppedTreeTileState>,
  string
>();
const pickedPebblesCacheKeys = new WeakMap<
  ReadonlyMap<string, DefiningWorldPlazaPickedPebbleTileState>,
  string
>();
const pickedFlowersCacheKeys = new WeakMap<
  ReadonlyMap<string, DefiningWorldPlazaPickedFlowerTileState>,
  string
>();
const clearedLongGrassCacheKeys = new WeakMap<
  ReadonlyMap<string, DefiningWorldPlazaClearedLongGrassTileState>,
  string
>();
const burntGrassCacheKeys = new WeakMap<ReadonlySet<string>, string>();

/**
 * Builds a cache key for placed tree blocks so tree layers resync on placement.
 */
export function buildingWorldPlazaPlacedTreeBlocksCacheKey(
  placedBlocks: DefiningWorldBuildingPlacedBlock[]
): string {
  const cachedKey = placedTreeBlocksCacheKeys.get(placedBlocks);

  if (cachedKey !== undefined) {
    return cachedKey;
  }

  const cacheKey = placedBlocks
    .filter((block) =>
      checkingWorldBuildingBlockDefinitionIdIsNaturalTree(block.definitionId)
    )
    .map((block) => {
      const growthStage =
        block.metadata[DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_METADATA_KEY];

      return `${block.blockId}:${typeof growthStage === 'number' ? growthStage : 0}:${block.worldLayer}`;
    })
    .sort()
    .join('|');

  placedTreeBlocksCacheKeys.set(placedBlocks, cacheKey);
  return cacheKey;
}

/**
 * Builds a cache key for chopped-tree state so tree layers resync after chops.
 */
export function buildingWorldPlazaChoppedTreesCacheKey(
  choppedTreesByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaChoppedTreeTileState
  >
): string {
  const cachedKey = choppedTreesCacheKeys.get(choppedTreesByTileKey);

  if (cachedKey !== undefined) {
    return cachedKey;
  }

  const cacheKey = Array.from(choppedTreesByTileKey.entries())
    .sort(([tileKeyA], [tileKeyB]) => tileKeyA.localeCompare(tileKeyB))
    .map(
      ([tileKey, state]) =>
        `${tileKey}:${state.remainingVisualLayer}:${state.isStump ? 'stump' : 'tree'}`
    )
    .join('|');

  choppedTreesCacheKeys.set(choppedTreesByTileKey, cacheKey);
  return cacheKey;
}

/**
 * Builds a cache key for picked-pebble state so floor chunks resync after picks.
 */
export function buildingWorldPlazaPickedPebblesCacheKey(
  pickedPebblesByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedPebbleTileState
  >
): string {
  const cachedKey = pickedPebblesCacheKeys.get(pickedPebblesByTileKey);

  if (cachedKey !== undefined) {
    return cachedKey;
  }

  const cacheKey = Array.from(pickedPebblesByTileKey.keys())
    .sort((tileKeyA, tileKeyB) => tileKeyA.localeCompare(tileKeyB))
    .join('|');

  pickedPebblesCacheKeys.set(pickedPebblesByTileKey, cacheKey);
  return cacheKey;
}

/**
 * Builds a cache key for picked-flower state so floor chunks resync after picks.
 */
export function buildingWorldPlazaPickedFlowersCacheKey(
  pickedFlowersByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedFlowerTileState
  >
): string {
  const cachedKey = pickedFlowersCacheKeys.get(pickedFlowersByTileKey);

  if (cachedKey !== undefined) {
    return cachedKey;
  }

  const cacheKey = Array.from(pickedFlowersByTileKey.keys())
    .sort((tileKeyA, tileKeyB) => tileKeyA.localeCompare(tileKeyB))
    .join('|');

  pickedFlowersCacheKeys.set(pickedFlowersByTileKey, cacheKey);
  return cacheKey;
}

/**
 * Builds a cache key for cleared long-grass state so grass layers resync after search/eat.
 */
export function buildingWorldPlazaClearedLongGrassCacheKey(
  clearedLongGrassByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaClearedLongGrassTileState
  >
): string {
  const cachedKey = clearedLongGrassCacheKeys.get(clearedLongGrassByTileKey);

  if (cachedKey !== undefined) {
    return cachedKey;
  }

  const cacheKey = Array.from(clearedLongGrassByTileKey.keys())
    .sort((tileKeyA, tileKeyB) => tileKeyA.localeCompare(tileKeyB))
    .join('|');

  clearedLongGrassCacheKeys.set(clearedLongGrassByTileKey, cacheKey);
  return cacheKey;
}

/**
 * Builds a cache key for scorched grass tile keys.
 */
export function buildingWorldPlazaBurntGrassTileKeysCacheKey(
  burntGrassTileKeys: ReadonlySet<string> | undefined
): string {
  if (!burntGrassTileKeys) {
    return '';
  }

  const cachedKey = burntGrassCacheKeys.get(burntGrassTileKeys);

  if (cachedKey !== undefined) {
    return cachedKey;
  }

  const cacheKey = Array.from(burntGrassTileKeys).sort().join('|');
  burntGrassCacheKeys.set(burntGrassTileKeys, cacheKey);
  return cacheKey;
}
