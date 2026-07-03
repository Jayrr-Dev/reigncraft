import { resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex } from "@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex";
import type { InvalidatingWorldPlazaFloorChunkGraphicsTileIndex } from "@/components/world/domains/invalidatingWorldPlazaFloorChunkGraphicsForTileIndices";

/**
 * Lists every tile covered by a column-rock footprint from its anchor.
 *
 * @module components/world/domains/listingWorldPlazaColumnRockFootprintTileIndicesAtAnchorTileIndex
 */

/**
 * Returns tile indices covered by a column-rock footprint, or the anchor only.
 *
 * @param anchorTileX - Spacing anchor column index.
 * @param anchorTileY - Spacing anchor row index.
 */
export function listingWorldPlazaColumnRockFootprintTileIndicesAtAnchorTileIndex(
  anchorTileX: number,
  anchorTileY: number,
): InvalidatingWorldPlazaFloorChunkGraphicsTileIndex[] {
  const metadata = resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex(
    anchorTileX,
    anchorTileY,
  );

  if (!metadata) {
    return [{ tileX: anchorTileX, tileY: anchorTileY }];
  }

  const tileIndices: InvalidatingWorldPlazaFloorChunkGraphicsTileIndex[] = [];

  for (
    let footprintTileY = 0;
    footprintTileY < metadata.footprintTileHeight;
    footprintTileY += 1
  ) {
    for (
      let footprintTileX = 0;
      footprintTileX < metadata.footprintTileWidth;
      footprintTileX += 1
    ) {
      tileIndices.push({
        tileX: metadata.anchorTileX + footprintTileX,
        tileY: metadata.anchorTileY + footprintTileY,
      });
    }
  }

  return tileIndices;
}
