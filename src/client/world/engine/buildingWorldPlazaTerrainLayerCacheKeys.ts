import { checkingWorldBuildingBlockDefinitionIdIsNaturalTree } from '@/components/world/building/domains/checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_METADATA_KEY } from '@/components/world/domains/definingWorldPlazaTreeLayerGrowthConstants';
import type { DefiningWorldPlazaChoppedTreeTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import type { DefiningWorldPlazaPickedPebbleTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedPebbles';

/**
 * Cache keys for terrain layer dependency snapshots.
 *
 * @module components/world/engine/buildingWorldPlazaTerrainLayerCacheKeys
 */

/**
 * Builds a cache key for placed tree blocks so tree layers resync on placement.
 */
export function buildingWorldPlazaPlacedTreeBlocksCacheKey(
  placedBlocks: DefiningWorldBuildingPlacedBlock[]
): string {
  return placedBlocks
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
  return Array.from(choppedTreesByTileKey.entries())
    .sort(([tileKeyA], [tileKeyB]) => tileKeyA.localeCompare(tileKeyB))
    .map(
      ([tileKey, state]) =>
        `${tileKey}:${state.remainingVisualLayer}:${state.isStump ? 'stump' : 'tree'}`
    )
    .join('|');
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
  return Array.from(pickedPebblesByTileKey.keys())
    .sort((tileKeyA, tileKeyB) => tileKeyA.localeCompare(tileKeyB))
    .join('|');
}

/**
 * Builds a cache key for scorched grass tile keys.
 */
export function buildingWorldPlazaBurntGrassTileKeysCacheKey(
  burntGrassTileKeys: ReadonlySet<string> | undefined
): string {
  return burntGrassTileKeys
    ? Array.from(burntGrassTileKeys).sort().join('|')
    : '';
}
