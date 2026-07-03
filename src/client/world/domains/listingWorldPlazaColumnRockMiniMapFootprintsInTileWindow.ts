import type { DefiningWorldPlazaColumnRockMetadata } from "@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex";
import { resolvingWorldPlazaColumnRockMetadataAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtTileIndex";
import { formattingWorldPlazaTileIndexCacheKey } from "@/components/world/domains/formattingWorldPlazaTileIndexCacheKey";

/**
 * Lists unique column-rock footprints visible in one minimap terrain rebuild.
 *
 * @module components/world/domains/listingWorldPlazaColumnRockMiniMapFootprintsInTileWindow
 */

/**
 * Returns one metadata entry per spacing anchor boulder in the tile window.
 *
 * @param centerTileX - Rebuild center tile column index.
 * @param centerTileY - Rebuild center tile row index.
 * @param viewRadiusTiles - Half-width of the rebuild window in tiles.
 */
export function listingWorldPlazaColumnRockMiniMapFootprintsInTileWindow(
  centerTileX: number,
  centerTileY: number,
  viewRadiusTiles: number,
): readonly DefiningWorldPlazaColumnRockMetadata[] {
  const footprints: DefiningWorldPlazaColumnRockMetadata[] = [];
  const seenAnchorKeys = new Set<string>();

  for (
    let tileOffsetY = -viewRadiusTiles;
    tileOffsetY <= viewRadiusTiles;
    tileOffsetY += 1
  ) {
    for (
      let tileOffsetX = -viewRadiusTiles;
      tileOffsetX <= viewRadiusTiles;
      tileOffsetX += 1
    ) {
      const tileX = centerTileX + tileOffsetX;
      const tileY = centerTileY + tileOffsetY;
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
      footprints.push(columnRockMetadata);
    }
  }

  return footprints;
}
