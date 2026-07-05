import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import {
  resolvingWorldDepthBaseSurfaceLayerAtTileIndex,
  resolvingWorldDepthSurfaceLayerAtTileIndex,
} from '@/components/world/depth/domains/resolvingWorldDepthSurfaceLayerAtTile';
import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex';

/**
 * Unified surface layer for procedural terrain and player-placed blocks.
 *
 * @module components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex
 */

/**
 * Returns the highest walkable surface from terrain, column rocks, and placed
 * blocks without flat-canopy tree tops.
 */
export function resolvingWorldPlazaBaseSurfaceLayerAtTileIndex(
  tileX: number,
  tileY: number,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[] = [],
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): number {
  return resolvingWorldDepthBaseSurfaceLayerAtTileIndex(
    tileX,
    tileY,
    placedBlocks,
    placedBlocksByTile
  );
}

/**
 * Returns the highest walkable surface on a tile from terrain, column rocks,
 * flat-canopy trees, and placed blocks.
 */
export function resolvingWorldPlazaSurfaceLayerAtTileIndex(
  tileX: number,
  tileY: number,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[] = [],
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): number {
  return resolvingWorldDepthSurfaceLayerAtTileIndex(
    tileX,
    tileY,
    placedBlocks,
    placedBlocksByTile
  );
}

/**
 * Returns true when a cardinal neighbor meets this tile at or above a surface layer.
 */
export function checkingWorldPlazaUnifiedCardinalNeighborSurfaceConnectsAtTileIndex(
  tileX: number,
  tileY: number,
  deltaX: number,
  deltaY: number,
  surfaceLayer: number,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[] = [],
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): boolean {
  const neighborSurfaceLayer = resolvingWorldPlazaSurfaceLayerAtTileIndex(
    tileX + deltaX,
    tileY + deltaY,
    placedBlocks,
    placedBlocksByTile
  );

  return neighborSurfaceLayer >= surfaceLayer;
}

/**
 * Returns true when procedural terrain alone raises the tile above ground.
 */
export function checkingWorldPlazaTerrainElevationHasRaisedSurfaceAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  return (
    resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(tileX, tileY) > 1
  );
}

/**
 * Returns true when the player can walk up onto procedural terrain at most one
 * layer above their current standing layer.
 */
export function checkingWorldPlazaTerrainElevationIsWalkableStepForPlayerLayer(
  playerLayer: number,
  tileX: number,
  tileY: number
): boolean {
  const terrainSurfaceLayer =
    resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(tileX, tileY);

  return terrainSurfaceLayer - playerLayer <= 1;
}
