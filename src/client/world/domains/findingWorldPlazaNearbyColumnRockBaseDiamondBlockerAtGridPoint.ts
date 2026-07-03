import { checkingWorldPlazaColumnRockBaseDiamondColliderBlocksPlayerAtGridPoint } from "@/components/world/domains/checkingWorldPlazaColumnRockBaseDiamondColliderBlocksPlayerAtGridPoint";
import { DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_COLLISION_SEARCH_TILE_RADIUS } from "@/components/world/domains/definingWorldPlazaTerrainRockConstants";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { formattingWorldPlazaTileIndexCacheKey } from "@/components/world/domains/formattingWorldPlazaTileIndexCacheKey";
import type { DefiningWorldPlazaColumnRockMetadata } from "@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex";
import { resolvingWorldPlazaColumnRockMetadataAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtTileIndex";
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from "@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint";

/**
 * Resolves which nearby column-rock diamond blocked a grid point.
 *
 * @module components/world/domains/findingWorldPlazaNearbyColumnRockBaseDiamondBlockerAtGridPoint
 */

/**
 * Returns anchor metadata for the first nearby column-rock diamond overlap.
 *
 * @param gridPoint - Avatar position in grid space.
 * @param playerLayer - Current player standing layer.
 * @param applyBlockCollision - Whether full block collision is active this frame.
 * @param searchTileRadius - Chebyshev tile radius around the standing tile.
 */
export function findingWorldPlazaNearbyColumnRockBaseDiamondBlockerAtGridPoint(
  gridPoint: DefiningWorldPlazaWorldPoint,
  playerLayer: number,
  applyBlockCollision: boolean,
  searchTileRadius: number = DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_COLLISION_SEARCH_TILE_RADIUS,
): DefiningWorldPlazaColumnRockMetadata | null {
  const standingTile =
    resolvingWorldPlazaIsometricTileIndexAtGridPoint(gridPoint);
  const seenAnchorKeys = new Set<string>();

  for (
    let offsetTileY = -searchTileRadius;
    offsetTileY <= searchTileRadius;
    offsetTileY += 1
  ) {
    for (
      let offsetTileX = -searchTileRadius;
      offsetTileX <= searchTileRadius;
      offsetTileX += 1
    ) {
      const tileX = standingTile.tileX + offsetTileX;
      const tileY = standingTile.tileY + offsetTileY;
      const columnRockMetadata = resolvingWorldPlazaColumnRockMetadataAtTileIndex(
        tileX,
        tileY,
      );

      if (!columnRockMetadata) {
        continue;
      }

      const anchorKey = formattingWorldPlazaTileIndexCacheKey(
        columnRockMetadata.anchorTileX,
        columnRockMetadata.anchorTileY,
      );

      if (seenAnchorKeys.has(anchorKey)) {
        continue;
      }

      seenAnchorKeys.add(anchorKey);

      if (
        checkingWorldPlazaColumnRockBaseDiamondColliderBlocksPlayerAtGridPoint(
          gridPoint,
          columnRockMetadata,
          playerLayer,
          applyBlockCollision,
        )
      ) {
        return columnRockMetadata;
      }
    }
  }

  return null;
}
