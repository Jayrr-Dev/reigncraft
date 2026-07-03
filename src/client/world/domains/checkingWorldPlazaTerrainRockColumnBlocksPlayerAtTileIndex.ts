import {
  DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
  DEFINING_WORLD_BUILDING_WORLD_LAYER_JUMP_HEIGHT_MAX,
} from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";
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

  // Too tall to mount in a single jump: always an impassable wall.
  if (
    rockSurfaceLayer - playerLayer >
    DEFINING_WORLD_BUILDING_WORLD_LAYER_JUMP_HEIGHT_MAX
  ) {
    return true;
  }

  // Within jump reach: a wall while walking, passable during the mid-jump window
  // so the player can arc up and land on top.
  return applyBlockCollision;
}
