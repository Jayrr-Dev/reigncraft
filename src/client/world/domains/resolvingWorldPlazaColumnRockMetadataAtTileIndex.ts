import { checkingWorldPlazaTileIsWithinColumnRockFootprintFromMetadata } from "@/components/world/domains/checkingWorldPlazaTileIsWithinColumnRockFootprintAtTileIndex";
import type { DefiningWorldPlazaColumnRockMetadata } from "@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex";
import { resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex } from "@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex";
import { resolvingWorldPlazaColumnRockSpacingAnchorTileIndex } from "@/components/world/domains/resolvingWorldPlazaColumnRockSpacingAnchorTileIndex";
import { applyingWorldPlazaRockMineStateToColumnRockMetadata } from "@/components/world/harvest/domains/applyingWorldPlazaRockMineStateToColumnRockMetadata";
import { readingWorldPlazaRuntimeMinedRockState } from "@/components/world/harvest/domains/registeringWorldPlazaMinedRocksVisualLayerLookup";

/**
 * Resolves column-rock metadata for any tile inside a mega-boulder footprint.
 *
 * @module components/world/domains/resolvingWorldPlazaColumnRockMetadataAtTileIndex
 */

/**
 * Returns anchor boulder metadata when {@code tileX}/{@code tileY} lies in its footprint.
 * Applies runtime mine state; returns null when the rock is depleted.
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

  return applyingWorldPlazaRockMineStateToColumnRockMetadata(
    metadata,
    readingWorldPlazaRuntimeMinedRockState(anchorTileX, anchorTileY),
  );
}
