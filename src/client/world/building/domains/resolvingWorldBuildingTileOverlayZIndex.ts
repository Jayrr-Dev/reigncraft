import { DEFINING_WORLD_DEPTH_BUILD_TILE_OVERLAY_Z_INDEX_OFFSET } from '@/components/world/depth/domains/definingWorldDepthBiasLadder';
import { computingWorldDepthSortKey } from '@/components/world/depth/domains/computingWorldDepthSortKey';
import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';

/**
 * Depth sort key for build overlays that should sit just beneath avatars.
 *
 * @module components/world/building/domains/resolvingWorldBuildingTileOverlayZIndex
 */

/**
 * Returns a z-index for a tile overlay so avatars on the same depth sort above it.
 *
 * @param tilePosition - Tile anchor for the overlay.
 * @param zIndexOffset - Optional override for the default under-avatar offset.
 */
export function resolvingWorldBuildingTileOverlayZIndex(
  tilePosition: DefiningWorldBuildingTilePosition | DefiningWorldPlazaWorldPoint,
  zIndexOffset: number = DEFINING_WORLD_DEPTH_BUILD_TILE_OVERLAY_Z_INDEX_OFFSET,
): number {
  const gridPoint: DefiningWorldPlazaWorldPoint =
    "x" in tilePosition
      ? tilePosition
      : { x: tilePosition.tileX, y: tilePosition.tileY };

  return computingWorldDepthSortKey(gridPoint) + zIndexOffset;
}
