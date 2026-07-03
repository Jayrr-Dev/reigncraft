import { checkingWorldPlazaTileIsWithinColumnRockFootprintFromMetadata } from "@/components/world/domains/checkingWorldPlazaTileIsWithinColumnRockFootprintAtTileIndex";
import type { DefiningWorldPlazaColumnRockMetadata } from "@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex";
import { resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex } from "@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex";
import { resolvingWorldPlazaColumnRockSpacingAnchorTileIndex } from "@/components/world/domains/resolvingWorldPlazaColumnRockSpacingAnchorTileIndex";

/**
 * Resolves column-rock metadata for any tile inside a mega-boulder footprint.
 *
 * @module components/world/domains/resolvingWorldPlazaColumnRockMetadataAtTileIndex
 */

/**
 * Returns anchor boulder metadata when {@code tileX}/{@code tileY} lies in its footprint.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaColumnRockMetadataAtTileIndex(
  tileX: number,
  tileY: number,
): DefiningWorldPlazaColumnRockMetadata | null {
  const { anchorTileX, anchorTileY } =
    resolvingWorldPlazaColumnRockSpacingAnchorTileIndex(tileX, tileY);
  const metadata = resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex(
    anchorTileX,
    anchorTileY,
  );

  if (!metadata) {
    return null;
  }

  if (
    !checkingWorldPlazaTileIsWithinColumnRockFootprintFromMetadata(
      tileX,
      tileY,
      metadata,
    )
  ) {
    return null;
  }

  return metadata;
}
