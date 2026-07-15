import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';

/**
 * Filters placed blocks to an inclusive tile window.
 *
 * @module components/world/building/domains/filteringWorldBuildingPlacedBlocksInTileBounds
 */

/**
 * True when a tile lies inside inclusive bounds.
 */
export function checkingWorldBuildingTileIsInVisibleBounds(
  tileX: number,
  tileY: number,
  bounds: DefiningWorldPlazaVisibleTileBounds
): boolean {
  return (
    tileX >= bounds.minTileX &&
    tileX <= bounds.maxTileX &&
    tileY >= bounds.minTileY &&
    tileY <= bounds.maxTileY
  );
}

/**
 * Keeps only blocks whose anchor tile sits inside the bounds.
 */
export function filteringWorldBuildingPlacedBlocksInTileBounds(
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
  bounds: DefiningWorldPlazaVisibleTileBounds
): DefiningWorldBuildingPlacedBlock[] {
  return placedBlocks.filter((block) =>
    checkingWorldBuildingTileIsInVisibleBounds(
      block.tilePosition.tileX,
      block.tilePosition.tileY,
      bounds
    )
  );
}
