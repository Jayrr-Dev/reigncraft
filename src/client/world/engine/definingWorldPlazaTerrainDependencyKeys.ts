import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { buildingWorldPlazaVisibleTileBoundsCacheKey } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';

/**
 * Named dependency keys that drive terrain layer invalidation.
 *
 * @module components/world/engine/definingWorldPlazaTerrainDependencyKeys
 */

/** Dependency key ids computed once per engine tick. */
export const DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY = {
  VIEWPORT_SIZE: 'viewportSize',
  FLOOR_BOUNDS: 'floorBounds',
  ELEVATION_BOUNDS: 'elevationBounds',
  TREE_BOUNDS: 'treeBounds',
  PLACED_TREE_BLOCKS: 'placedTreeBlocks',
  CHOPPED_TREES: 'choppedTrees',
  PICKED_PEBBLES: 'pickedPebbles',
  PICKED_LONG_GRASS: 'pickedLongGrass',
  PICKED_SHRUBS: 'pickedShrubs',
  PICKED_MUSHROOMS: 'pickedMushrooms',
  BURNT_GRASS: 'burntGrass',
  THAW_VISUAL: 'thawVisual',
  SUN_BUCKET: 'sunBucket',
  DAY_NUMBER: 'dayNumber',
  PLAYER_TILE: 'playerTile',
  ISLAND_MODE_REVISION: 'islandModeRevision',
  PROCEDURAL_TREES_AND_ROCKS_REVISION: 'proceduralTreesAndRocksRevision',
  FIRELANDS_TEXTURES_READY: 'firelandsTexturesReady',
  LONG_GRASS_TEXTURES_READY: 'longGrassTexturesReady',
  SHRUB_TEXTURES_READY: 'shrubTexturesReady',
  MUSHROOM_TEXTURES_READY: 'mushroomTexturesReady',
  CHEST_TEXTURES_READY: 'chestTexturesReady',
  BLACKSMITH_UTILITY_TEXTURES_READY: 'blacksmithUtilityTexturesReady',
  BEAR_TRAP_TEXTURES_READY: 'bearTrapTexturesReady',
  CALTROP_TEXTURES_READY: 'caltropTexturesReady',
  LAVA_TEXTURES_READY: 'lavaTexturesReady',
} as const;

/** One terrain dependency key id. */
export type DefiningWorldPlazaTerrainDependencyKeyId =
  (typeof DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY)[keyof typeof DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY];

/** String snapshot of every dependency key for the current tick. */
export type DefiningWorldPlazaTerrainDependencySnapshot = Readonly<
  Record<DefiningWorldPlazaTerrainDependencyKeyId, string>
>;

/**
 * Returns true when any listed dependency key changed since the prior snapshot.
 *
 * @param snapshot - Current tick dependency values.
 * @param previousSnapshot - Prior tick dependency values, if any.
 * @param keys - Dependency keys that should trigger a layer resync.
 */
export function checkingWorldPlazaTerrainDependencyKeysChanged(
  snapshot: DefiningWorldPlazaTerrainDependencySnapshot,
  previousSnapshot: DefiningWorldPlazaTerrainDependencySnapshot | null,
  keys: readonly DefiningWorldPlazaTerrainDependencyKeyId[]
): boolean {
  if (!previousSnapshot) {
    return true;
  }

  for (const key of keys) {
    if (snapshot[key] !== previousSnapshot[key]) {
      return true;
    }
  }

  return false;
}

/**
 * Builds a stable cache key for visible tile bounds.
 *
 * @param bounds - Visible tile bounds, or null when disabled.
 */
export function formattingWorldPlazaTerrainDependencyBoundsKey(
  bounds: DefiningWorldPlazaVisibleTileBounds | null
): string {
  return bounds ? buildingWorldPlazaVisibleTileBoundsCacheKey(bounds) : '';
}
