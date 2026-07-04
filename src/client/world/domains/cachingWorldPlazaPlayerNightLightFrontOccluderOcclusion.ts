import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { computingWorldPlazaPlayerNightLightFrontOccluderOcclusionStrength } from '@/components/world/domains/computingWorldPlazaPlayerNightLightFrontOccluderOcclusion';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { formattingWorldPlazaTileIndexCacheKey } from '@/components/world/domains/formattingWorldPlazaTileIndexCacheKey';

/**
 * Per-frame cache for torch front-occluder strength (shared by Pixi + DOM).
 *
 * @module components/world/domains/cachingWorldPlazaPlayerNightLightFrontOccluderOcclusion
 */

/** Quantizes occlusion strength so CSS mask strings stay stable between frames. */
const CACHING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_FRONT_OCCLUDER_STRENGTH_QUANTUM = 0.02;

type CachingWorldPlazaPlayerNightLightFrontOccluderOcclusionFrame = {
  frameId: number;
  cacheKey: string;
  strength: number;
};

let cachingWorldPlazaPlayerNightLightFrontOccluderOcclusionFrame: CachingWorldPlazaPlayerNightLightFrontOccluderOcclusionFrame =
  {
    frameId: -1,
    cacheKey: '',
    strength: 0,
  };

/**
 * Builds a cache key from player tile and placed-block identity.
 *
 * @param playerPosition - Player position in grid space.
 * @param placedBlocks - Placed blocks near the player.
 */
function buildingWorldPlazaPlayerNightLightFrontOccluderCacheKey(
  playerPosition: DefiningWorldPlazaWorldPoint,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[]
): string {
  const playerTileKey = formattingWorldPlazaTileIndexCacheKey(
    Math.floor(playerPosition.x),
    Math.floor(playerPosition.y)
  );

  if (placedBlocks.length === 0) {
    return `${playerTileKey}|0`;
  }

  const firstBlock = placedBlocks[0];
  const lastBlock = placedBlocks[placedBlocks.length - 1];

  return `${playerTileKey}|${placedBlocks.length}|${firstBlock?.blockId ?? ''}|${lastBlock?.blockId ?? ''}`;
}

/**
 * Returns front-occluder strength, computed at most once per animation frame.
 *
 * @param playerPosition - Player position in grid space.
 * @param placedBlocks - Placed blocks near the player.
 * @param placedBlocksByTile - Optional tile index for O(1) lookups.
 */
export function readingWorldPlazaPlayerNightLightFrontOccluderOcclusionStrengthCached(
  playerPosition: DefiningWorldPlazaWorldPoint,
  placedBlocks: DefiningWorldBuildingPlacedBlock[] = [],
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): number {
  const frameId = performance.now() | 0;
  const cacheKey = buildingWorldPlazaPlayerNightLightFrontOccluderCacheKey(
    playerPosition,
    placedBlocks
  );

  if (
    cachingWorldPlazaPlayerNightLightFrontOccluderOcclusionFrame.frameId ===
      frameId &&
    cachingWorldPlazaPlayerNightLightFrontOccluderOcclusionFrame.cacheKey ===
      cacheKey
  ) {
    return cachingWorldPlazaPlayerNightLightFrontOccluderOcclusionFrame.strength;
  }

  const rawStrength =
    computingWorldPlazaPlayerNightLightFrontOccluderOcclusionStrength(
      playerPosition,
      placedBlocks,
      placedBlocksByTile
    );
  const quantizedStrength =
    Math.round(
      rawStrength /
        CACHING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_FRONT_OCCLUDER_STRENGTH_QUANTUM
    ) * CACHING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_FRONT_OCCLUDER_STRENGTH_QUANTUM;

  cachingWorldPlazaPlayerNightLightFrontOccluderOcclusionFrame = {
    frameId,
    cacheKey,
    strength: quantizedStrength,
  };

  return quantizedStrength;
}
