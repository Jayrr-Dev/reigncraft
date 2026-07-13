import { checkingWorldCollisionVerticalColumnBlocksPlayer } from '@/components/world/collision/domains/checkingWorldCollisionVerticalColumnRule';
import {
  DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
} from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import { resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex";

/**
 * Procedural column rock collision aligned with placed tile columns.
 *
 * Treats a boulder like a player-placed block stack: the player can stand on the
 * top, jumps up to it within jump reach, and is walled out from the side while
 * standing below the top. Mirrors
 * `checkingWorldPlazaTerrainElevationColumnBlocksPlayerAtTileIndex`.
 *
 * @module components/world/domains/checkingWorldPlazaTerrainRockColumnBlocksPlayerAtTileIndex
 */

/**
 * Returns true when a column rock on a tile blocks the player horizontally.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param playerLayer - Current player standing layer.
 * @param applyBlockCollision - Whether full block collision is active this frame.
 */
export function checkingWorldPlazaTerrainRockColumnBlocksPlayerAtTileIndex(
  tileX: number,
  tileY: number,
  playerLayer: number,
  applyBlockCollision: boolean,
  jumpLayerReachMax?: number,
): boolean {
  const rockSurfaceLayer =
    resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex(tileX, tileY);

  if (rockSurfaceLayer <= DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND) {
    return false;
  }

  // Standing on (or above) the boulder top: it supports the player, no wall.
  if (playerLayer >= rockSurfaceLayer) {
    return false;
  }

  return checkingWorldCollisionVerticalColumnBlocksPlayer({
    playerLayer,
    surfaceLayer: rockSurfaceLayer,
    applyBlockCollision,
    isWalkableStep: false,
    verticalBandsOverlap: true,
    jumpLayerReachMax,
  });
}
