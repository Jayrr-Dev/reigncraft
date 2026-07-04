import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { formattingWorldBuildingPlacedBlocksTileColumnKey } from '@/components/world/building/domains/groupingWorldBuildingPlacedBlocksByTileColumn';

/**
 * Tile-keyed spatial index for O(1) placed-block lookups in hot paths.
 *
 * @module components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile
 */

/** Map from `"tileX:tileY"` to every block anchored on that tile. */
export type IndexingWorldBuildingPlacedBlocksByTile = ReadonlyMap<
  string,
  readonly DefiningWorldBuildingPlacedBlock[]
>;

const INDEXING_WORLD_BUILDING_PLACED_BLOCKS_BY_TILE_EMPTY_LIST: readonly DefiningWorldBuildingPlacedBlock[] =
  [];

/**
 * Builds a tile-keyed index from a placed-block list.
 *
 * @param placedBlocks - Blocks visible in the scene.
 */
export function indexingWorldBuildingPlacedBlocksByTile(
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[]
): IndexingWorldBuildingPlacedBlocksByTile {
  const blocksByTile = new Map<string, DefiningWorldBuildingPlacedBlock[]>();

  for (const block of placedBlocks) {
    const tileKey = formattingWorldBuildingPlacedBlocksTileColumnKey(
      block.tilePosition.tileX,
      block.tilePosition.tileY
    );
    const existingBlocks = blocksByTile.get(tileKey);

    if (existingBlocks) {
      existingBlocks.push(block);
      continue;
    }

    blocksByTile.set(tileKey, [block]);
  }

  return blocksByTile;
}

/**
 * Returns placed blocks on one tile from the index.
 *
 * @param blocksByTile - Tile-keyed index.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function listingWorldBuildingPlacedBlocksAtTileFromIndex(
  blocksByTile: IndexingWorldBuildingPlacedBlocksByTile,
  tileX: number,
  tileY: number
): readonly DefiningWorldBuildingPlacedBlock[] {
  return (
    blocksByTile.get(
      formattingWorldBuildingPlacedBlocksTileColumnKey(tileX, tileY)
    ) ?? INDEXING_WORLD_BUILDING_PLACED_BLOCKS_BY_TILE_EMPTY_LIST
  );
}

/**
 * Returns placed blocks whose tile anchor lies within the search window.
 *
 * @param blocksByTile - Tile-keyed index.
 * @param centerTileX - Avatar standing tile X.
 * @param centerTileY - Avatar standing tile Y.
 * @param searchTileRadius - Tile rings to inspect.
 */
export function listingWorldBuildingPlacedBlocksNearTileFromIndex(
  blocksByTile: IndexingWorldBuildingPlacedBlocksByTile,
  centerTileX: number,
  centerTileY: number,
  searchTileRadius: number
): DefiningWorldBuildingPlacedBlock[] {
  const nearbyBlocks: DefiningWorldBuildingPlacedBlock[] = [];

  for (
    let tileOffsetY = -searchTileRadius;
    tileOffsetY <= searchTileRadius;
    tileOffsetY += 1
  ) {
    for (
      let tileOffsetX = -searchTileRadius;
      tileOffsetX <= searchTileRadius;
      tileOffsetX += 1
    ) {
      const tileBlocks = listingWorldBuildingPlacedBlocksAtTileFromIndex(
        blocksByTile,
        centerTileX + tileOffsetX,
        centerTileY + tileOffsetY
      );

      if (tileBlocks.length > 0) {
        nearbyBlocks.push(...tileBlocks);
      }
    }
  }

  return nearbyBlocks;
}
