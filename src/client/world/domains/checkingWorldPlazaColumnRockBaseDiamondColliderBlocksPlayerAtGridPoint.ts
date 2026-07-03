import { checkingWorldPlazaTerrainRockColumnBlocksPlayerAtTileIndex } from "@/components/world/domains/checkingWorldPlazaTerrainRockColumnBlocksPlayerAtTileIndex";
import { DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID } from "@/components/world/domains/definingWorldPlazaPlayerCollisionConstants";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import {
  checkingWorldPlazaColumnRockBaseDiamondContainsPlayerFootprint,
  resolvingWorldPlazaColumnRockBaseDiamondFromMetadata,
} from "@/components/world/domains/resolvingWorldPlazaColumnRockBaseDiamondFromMetadata";
import type { DefiningWorldPlazaColumnRockMetadata } from "@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex";

/**
 * Diamond column-rock collider checks for avatar movement.
 *
 * @module components/world/domains/checkingWorldPlazaColumnRockBaseDiamondColliderBlocksPlayerAtGridPoint
 */

/**
 * Returns true when a grid point overlaps a column-rock base diamond and should
 * be treated as blocked from the side.
 *
 * Footprint tiles outside the visible boulder base stay walkable. The rock-face
 * diamond (orange debug outline) still blocks horizontal movement from the side.
 *
 * @param gridPoint - Avatar position in grid space.
 * @param metadata - Anchor column-rock metadata.
 * @param playerLayer - Current player standing layer.
 * @param applyBlockCollision - Whether full block collision is active this frame.
 */
export function checkingWorldPlazaColumnRockBaseDiamondColliderBlocksPlayerAtGridPoint(
  gridPoint: DefiningWorldPlazaWorldPoint,
  metadata: DefiningWorldPlazaColumnRockMetadata,
  playerLayer: number,
  applyBlockCollision: boolean,
): boolean {
  const baseDiamond =
    resolvingWorldPlazaColumnRockBaseDiamondFromMetadata(metadata);

  if (
    !checkingWorldPlazaColumnRockBaseDiamondContainsPlayerFootprint(
      baseDiamond,
      gridPoint.x,
      gridPoint.y,
      DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID,
    )
  ) {
    return false;
  }

  return checkingWorldPlazaTerrainRockColumnBlocksPlayerAtTileIndex(
    metadata.anchorTileX,
    metadata.anchorTileY,
    playerLayer,
    applyBlockCollision,
  );
}
