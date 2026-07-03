import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { resolvingWorldBuildingSurfaceLayerAtTileIndex } from "@/components/world/building/domains/resolvingWorldBuildingSurfaceLayerAtTileIndex";
import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex";
import { resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex";
import { resolvingWorldPlazaTreeFlatCanopySurfaceLayerAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaTreeFlatCanopySurfaceLayerAtTileIndex";

/**
 * Unified surface layer for procedural terrain and player-placed blocks.
 *
 * @module components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex
 */

/**
 * Returns the highest walkable surface from terrain, column rocks, and placed
 * blocks without flat-canopy tree tops.
 *
 * Tree trunk feet use this layer so canopy resolution does not recurse back
 * into the unified surface path.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param placedBlocks - Optional placed blocks near the tile.
 */
export function resolvingWorldPlazaBaseSurfaceLayerAtTileIndex(
  tileX: number,
  tileY: number,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[] = [],
): number {
  const terrainSurfaceLayer = resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(
    tileX,
    tileY,
  );
  const rockSurfaceLayer =
    resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex(tileX, tileY);
  const placedSurfaceLayer = resolvingWorldBuildingSurfaceLayerAtTileIndex(
    tileX,
    tileY,
    placedBlocks,
  );

  return Math.max(
    terrainSurfaceLayer,
    rockSurfaceLayer,
    placedSurfaceLayer,
  );
}

/**
 * Returns the highest walkable surface on a tile from terrain, column rocks,
 * flat-canopy trees, and placed blocks.
 *
 * Column rocks and flat-canopy trees feed the same standing-surface path as
 * player-placed blocks so the player can jump on top and stand on them.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param placedBlocks - Optional placed blocks near the tile.
 */
export function resolvingWorldPlazaSurfaceLayerAtTileIndex(
  tileX: number,
  tileY: number,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[] = [],
): number {
  const baseSurfaceLayer = resolvingWorldPlazaBaseSurfaceLayerAtTileIndex(
    tileX,
    tileY,
    placedBlocks,
  );
  const treeCanopySurfaceLayer =
    resolvingWorldPlazaTreeFlatCanopySurfaceLayerAtTileIndex(
      tileX,
      tileY,
      placedBlocks,
    );

  return Math.max(baseSurfaceLayer, treeCanopySurfaceLayer);
}

/**
 * Returns true when a cardinal neighbor meets this tile at or above a surface layer.
 *
 * Uses unified terrain and placed-block height so cap rims match what the player
 * can stand on.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param deltaX - Neighbor column offset.
 * @param deltaY - Neighbor row offset.
 * @param surfaceLayer - Surface world layer being evaluated on this tile.
 * @param placedBlocks - Optional placed blocks near the neighbor tile.
 */
export function checkingWorldPlazaUnifiedCardinalNeighborSurfaceConnectsAtTileIndex(
  tileX: number,
  tileY: number,
  deltaX: number,
  deltaY: number,
  surfaceLayer: number,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[] = [],
): boolean {
  const neighborSurfaceLayer = resolvingWorldPlazaSurfaceLayerAtTileIndex(
    tileX + deltaX,
    tileY + deltaY,
    placedBlocks,
  );

  return neighborSurfaceLayer >= surfaceLayer;
}

/**
 * Returns true when procedural terrain alone raises the tile above ground.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaTerrainElevationHasRaisedSurfaceAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  return resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(tileX, tileY) > 1;
}

/**
 * Returns true when the player can walk up onto procedural terrain at most one
 * layer above their current standing layer.
 *
 * @param playerLayer - Current player standing layer.
 * @param tileX - Destination tile column index.
 * @param tileY - Destination tile row index.
 */
export function checkingWorldPlazaTerrainElevationIsWalkableStepForPlayerLayer(
  playerLayer: number,
  tileX: number,
  tileY: number,
): boolean {
  const terrainSurfaceLayer = resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(
    tileX,
    tileY,
  );

  return terrainSurfaceLayer - playerLayer <= 1;
}
