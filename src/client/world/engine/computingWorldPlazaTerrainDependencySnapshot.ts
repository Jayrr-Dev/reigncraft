import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { settingWorldPlazaWaterFrozenStateCacheEpoch } from '@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex';
import { computingWorldPlazaDayNightSunState } from '@/components/world/domains/computingWorldPlazaDayNightSunState';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { buildingWorldPlazaVisibleTileBoundsCacheKey } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { formattingWorldPlazaTileIndexCacheKey } from '@/components/world/domains/formattingWorldPlazaTileIndexCacheKey';
import {
  buildingWorldPlazaBurntGrassTileKeysCacheKey,
  buildingWorldPlazaChoppedTreesCacheKey,
  buildingWorldPlazaClearedLongGrassCacheKey,
  buildingWorldPlazaPickedFlowersCacheKey,
  buildingWorldPlazaPickedPebblesCacheKey,
  buildingWorldPlazaPlacedTreeBlocksCacheKey,
} from '@/components/world/engine/buildingWorldPlazaTerrainLayerCacheKeys';
import {
  DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY,
  formattingWorldPlazaTerrainDependencyBoundsKey,
  type DefiningWorldPlazaTerrainDependencySnapshot,
} from '@/components/world/engine/definingWorldPlazaTerrainDependencyKeys';
import {
  checkingWorldPlazaTerrainTextureAssetManifestIsReady,
  registeringWorldPlazaFirelandsSpriteTextureLoader,
  registeringWorldPlazaLongGrassSpriteTextureLoader,
  registeringWorldPlazaLavaStaticTileTextureLoader,
} from '@/components/world/engine/registeringWorldPlazaTextureAssetManifest';
import type { DefiningWorldPlazaChoppedTreeTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import type { DefiningWorldPlazaClearedLongGrassTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalClearedLongGrass';
import type { DefiningWorldPlazaPickedFlowerTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedFlowers';
import type { DefiningWorldPlazaPickedPebbleTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedPebbles';
import { buildingWorldPlazaPlacedEnvironmentalTemperatureBlocksCacheKey } from '@/components/world/health/domains/cachingWorldPlazaEnvironmentalTemperatureSamplingContext';
import { gettingWorldPlazaTemperatureDebugOverrideRevision } from '@/components/world/health/domains/managingWorldPlazaTemperatureDebugOverrideStore';

/**
 * Computes the terrain dependency snapshot for one engine tick.
 *
 * @module components/world/engine/computingWorldPlazaTerrainDependencySnapshot
 */

export type ComputingWorldPlazaTerrainDependencySnapshotInput = {
  readonly viewportWidth: number;
  readonly viewportHeight: number;
  readonly playerPosition: DefiningWorldPlazaWorldPoint;
  readonly scenePlacedBlocks: DefiningWorldBuildingPlacedBlock[];
  readonly choppedTreesByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaChoppedTreeTileState
  >;
  readonly pickedPebblesByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedPebbleTileState
  >;
  readonly pickedFlowersByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedFlowerTileState
  >;
  readonly clearedLongGrassByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaClearedLongGrassTileState
  >;
  readonly burntGrassTileKeys: ReadonlySet<string> | undefined;
  readonly islandModeRevision: number;
  readonly proceduralTreesAndRocksRevision: number;
  readonly floorBounds: DefiningWorldPlazaVisibleTileBounds | null;
  readonly elevationBounds: DefiningWorldPlazaVisibleTileBounds | null;
  readonly treeBounds: DefiningWorldPlazaVisibleTileBounds | null;
};

/**
 * Builds the dependency key snapshot used to invalidate terrain layers.
 */
export function computingWorldPlazaTerrainDependencySnapshot(
  input: ComputingWorldPlazaTerrainDependencySnapshotInput
): DefiningWorldPlazaTerrainDependencySnapshot {
  const sunState = computingWorldPlazaDayNightSunState();
  const thawVisualSyncKey = `${sunState.bucketIndex}|${buildingWorldPlazaPlacedEnvironmentalTemperatureBlocksCacheKey(input.scenePlacedBlocks)}|${gettingWorldPlazaTemperatureDebugOverrideRevision()}`;

  // Keep the memoized frozen-water lookups in step with freeze/thaw inputs so
  // hot draw paths (water surface, shimmer, floor bake) reuse ring scans.
  settingWorldPlazaWaterFrozenStateCacheEpoch(thawVisualSyncKey);

  const playerTileKey = formattingWorldPlazaTileIndexCacheKey(
    Math.floor(input.playerPosition.x),
    Math.floor(input.playerPosition.y)
  );

  return {
    [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.VIEWPORT_SIZE]: `${input.viewportWidth}x${input.viewportHeight}`,
    [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.FLOOR_BOUNDS]:
      formattingWorldPlazaTerrainDependencyBoundsKey(input.floorBounds),
    [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.ELEVATION_BOUNDS]:
      formattingWorldPlazaTerrainDependencyBoundsKey(input.elevationBounds),
    [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.TREE_BOUNDS]:
      formattingWorldPlazaTerrainDependencyBoundsKey(input.treeBounds),
    [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.PLACED_TREE_BLOCKS]:
      buildingWorldPlazaPlacedTreeBlocksCacheKey(input.scenePlacedBlocks),
    [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.CHOPPED_TREES]:
      buildingWorldPlazaChoppedTreesCacheKey(input.choppedTreesByTileKey),
    [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.PICKED_PEBBLES]: `${buildingWorldPlazaPickedPebblesCacheKey(input.pickedPebblesByTileKey)}|${buildingWorldPlazaPickedFlowersCacheKey(input.pickedFlowersByTileKey)}`,
    [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.PICKED_LONG_GRASS]:
      buildingWorldPlazaClearedLongGrassCacheKey(input.clearedLongGrassByTileKey),
    [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.BURNT_GRASS]:
      buildingWorldPlazaBurntGrassTileKeysCacheKey(input.burntGrassTileKeys),
    [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.THAW_VISUAL]:
      thawVisualSyncKey,
    [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.SUN_BUCKET]: String(
      sunState.bucketIndex
    ),
    [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.PLAYER_TILE]: playerTileKey,
    [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.ISLAND_MODE_REVISION]: String(
      input.islandModeRevision
    ),
    [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.PROCEDURAL_TREES_AND_ROCKS_REVISION]:
      String(input.proceduralTreesAndRocksRevision),
    [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.FIRELANDS_TEXTURES_READY]:
      registeringWorldPlazaFirelandsSpriteTextureLoader.isReady() ? '1' : '0',
    [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.LONG_GRASS_TEXTURES_READY]:
      registeringWorldPlazaLongGrassSpriteTextureLoader.isReady() ? '1' : '0',
    [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.LAVA_TEXTURES_READY]:
      registeringWorldPlazaLavaStaticTileTextureLoader.isReady() ? '1' : '0',
  };
}

/**
 * Returns true when every manifest terrain texture asset is ready.
 */
export function checkingWorldPlazaTerrainDependencyTexturesAreReady(): boolean {
  return checkingWorldPlazaTerrainTextureAssetManifestIsReady();
}

/**
 * Builds the idle heavy-sync cache key.
 *
 * Uses snapped floor bounds (not every player tile step) so walking inside the
 * current snap window can skip heavy layers once they are complete.
 */
export function buildingWorldPlazaTerrainIdleHeavySyncKey(options: {
  readonly floorBoundsKey: string;
  readonly worldZoom: number;
  readonly viewportWidth: number;
  readonly viewportHeight: number;
  readonly placedTreeBlocksKey: string;
  readonly thawVisualSyncKey: string;
  /** Changes when floor pebbles are picked so heavy floor sync cannot idle-skip. */
  readonly pickedPebblesCacheKey?: string;
}): string {
  const pickedPebblesCacheKey = options.pickedPebblesCacheKey ?? '';

  return `${options.floorBoundsKey}|${options.worldZoom}|${options.viewportWidth}x${options.viewportHeight}|${options.placedTreeBlocksKey}|${options.thawVisualSyncKey}|${pickedPebblesCacheKey}`;
}

/**
 * Builds a floor bounds cache key from bounds or an empty string.
 */
export function buildingWorldPlazaTerrainFloorBoundsCacheKey(
  floorBounds: DefiningWorldPlazaVisibleTileBounds | null
): string {
  return floorBounds
    ? buildingWorldPlazaVisibleTileBoundsCacheKey(floorBounds)
    : '';
}
