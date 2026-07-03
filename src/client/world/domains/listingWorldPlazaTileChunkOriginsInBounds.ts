import type { DefiningWorldPlazaVisibleTileBounds } from "@/components/world/domains/definingWorldPlazaVisibleTileBounds";

/**
 * Lists chunk origin tiles covering a visible bounds window.
 *
 * @module components/world/domains/listingWorldPlazaTileChunkOriginsInBounds
 */

/** Chunk origin indices aligned to the chunk grid. */
export interface ListingWorldPlazaTileChunkOriginsInBoundsEntry {
  readonly chunkOriginTileX: number;
  readonly chunkOriginTileY: number;
}

/**
 * Lists every chunk origin needed to cover inclusive visible bounds.
 *
 * @param bounds - Visible tile index range.
 * @param chunkSizeTiles - Width and height of each chunk in tiles.
 */
export function listingWorldPlazaTileChunkOriginsInBounds(
  bounds: DefiningWorldPlazaVisibleTileBounds,
  chunkSizeTiles: number,
): ListingWorldPlazaTileChunkOriginsInBoundsEntry[] {
  const chunkSize = Math.max(1, Math.floor(chunkSizeTiles));
  const minChunkOriginTileX =
    Math.floor(bounds.minTileX / chunkSize) * chunkSize;
  const minChunkOriginTileY =
    Math.floor(bounds.minTileY / chunkSize) * chunkSize;
  const maxChunkOriginTileX =
    Math.floor(bounds.maxTileX / chunkSize) * chunkSize;
  const maxChunkOriginTileY =
    Math.floor(bounds.maxTileY / chunkSize) * chunkSize;
  const entries: ListingWorldPlazaTileChunkOriginsInBoundsEntry[] = [];

  for (
    let chunkOriginTileY = minChunkOriginTileY;
    chunkOriginTileY <= maxChunkOriginTileY;
    chunkOriginTileY += chunkSize
  ) {
    for (
      let chunkOriginTileX = minChunkOriginTileX;
      chunkOriginTileX <= maxChunkOriginTileX;
      chunkOriginTileX += chunkSize
    ) {
      entries.push({ chunkOriginTileX, chunkOriginTileY });
    }
  }

  return entries;
}

/**
 * Depth sort key for one floor chunk graphics child.
 *
 * @param chunkOriginTileX - Chunk minimum tile column.
 * @param chunkOriginTileY - Chunk minimum tile row.
 */
export function resolvingWorldPlazaGrassFloorChunkGraphicsZIndex(
  chunkOriginTileX: number,
  chunkOriginTileY: number,
): number {
  return chunkOriginTileX + chunkOriginTileY;
}
