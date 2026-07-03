import type { DefiningWorldPlazaVisibleTileBounds } from "@/components/world/domains/definingWorldPlazaVisibleTileBounds";

/**
 * One grid tile index pair inside a visible bounds window.
 *
 * @module components/world/domains/listingWorldPlazaTileIndicesInBounds
 */

/** Grid tile indices for one visible map cell. */
export interface ListingWorldPlazaTileIndicesInBoundsEntry {
  readonly tileX: number;
  readonly tileY: number;
}

/**
 * Lists every tile coordinate inside inclusive visible bounds.
 *
 * @param bounds - Visible tile index range.
 */
export function listingWorldPlazaTileIndicesInBounds(
  bounds: DefiningWorldPlazaVisibleTileBounds,
): ListingWorldPlazaTileIndicesInBoundsEntry[] {
  const entries: ListingWorldPlazaTileIndicesInBoundsEntry[] = [];

  for (let tileY = bounds.minTileY; tileY <= bounds.maxTileY; tileY += 1) {
    for (let tileX = bounds.minTileX; tileX <= bounds.maxTileX; tileX += 1) {
      entries.push({ tileX, tileY });
    }
  }

  return entries;
}
