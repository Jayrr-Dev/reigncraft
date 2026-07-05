import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { computingWorldPlazaDayNightSunState } from '@/components/world/domains/computingWorldPlazaDayNightSunState';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { buildingWorldPlazaVisibleTileBoundsCacheKey } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { formattingWorldPlazaTileIndexCacheKey } from '@/components/world/domains/formattingWorldPlazaTileIndexCacheKey';
import {
  buildingWorldPlazaBurntGrassTileKeysCacheKey,
  buildingWorldPlazaChoppedTreesCacheKey,
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
  registeringWorldPlazaLavaStaticTileTextureLoader,
} from '@/components/world/engine/registeringWorldPlazaTextureAssetManifest';
import type { DefiningWorldPlazaChoppedTreeTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import { buildingWorldPlazaPlacedEnvironmentalTemperatureBlocksCacheKey } from '@/components/world/health/domains/cachingWorldPlazaEnvironmentalTemperatureSamplingContext';

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
  readonly burntGrassTileKeys: ReadonlySet<string> | undefined;
  readonly islandModeRevision: number;
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
  const thawVisualSyncKey = `${sunState.bucketIndex}|${buildingWorldPlazaPlacedEnvironmentalTemperatureBlocksCacheKey(input.scenePlacedBlocks)}`;
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
    [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.FIRELANDS_TEXTURES_READY]:
      registeringWorldPlazaFirelandsSpriteTextureLoader.isReady() ? '1' : '0',
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
 */
export function buildingWorldPlazaTerrainIdleHeavySyncKey(options: {
  readonly playerTileKey: string;
  readonly worldZoom: number;
  readonly viewportWidth: number;
  readonly viewportHeight: number;
  readonly placedTreeBlocksKey: string;
  readonly thawVisualSyncKey: string;
}): string {
  return `${options.playerTileKey}|${options.worldZoom}|${options.viewportWidth}x${options.viewportHeight}|${options.placedTreeBlocksKey}|${options.thawVisualSyncKey}`;
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
