import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import {
  DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
  DEFINING_WORLD_BUILDING_WORLD_LAYER_JUMP_HEIGHT_MAX,
} from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";
import { resolvingWorldPlazaTreeFlatCanopySurfaceLayerAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaTreeFlatCanopySurfaceLayerAtTileIndex";

/**
 * Flat-canopy tree collision aligned with placed tile columns and boulders.
 *
 * The trunk blocks horizontal movement below the flat canopy top. The player
 * can jump up within reach, stand on the canopy, and walk across the platform.
 *
 * @module components/world/domains/checkingWorldPlazaTreeFlatCanopyColumnBlocksPlayerAtTileIndex
 */

/**
 * Returns true when a flat-canopy tree on a tile blocks the player horizontally.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param playerLayer - Current player standing layer.
 * @param applyBlockCollision - Whether full block collision is active this frame.
 * @param placedBlocks - Placed blocks considered for tree overrides and layers.
 */
export function checkingWorldPlazaTreeFlatCanopyColumnBlocksPlayerAtTileIndex(
  tileX: number,
  tileY: number,
  playerLayer: number,
  applyBlockCollision: boolean,
  placedBlocks: DefiningWorldBuildingPlacedBlock[] = [],
): boolean {
  const canopySurfaceLayer =
    resolvingWorldPlazaTreeFlatCanopySurfaceLayerAtTileIndex(
      tileX,
      tileY,
      placedBlocks,
    );

  if (canopySurfaceLayer <= DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND) {
    return false;
  }

  if (playerLayer >= canopySurfaceLayer) {
    return false;
  }

  if (
    canopySurfaceLayer - playerLayer >
    DEFINING_WORLD_BUILDING_WORLD_LAYER_JUMP_HEIGHT_MAX
  ) {
    return true;
  }

  return applyBlockCollision;
}
