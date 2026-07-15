import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { resolvingWorldBuildingPlacedBlockWorldLayer } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { checkingWorldBuildingPlacedBlockIsPassableTileSurfaceOverlay } from "@/components/world/building/domains/checkingWorldBuildingPlacedBlockIsPassableTileSurfaceOverlay";
import { checkingWorldBuildingPlacedBlockIsPassableTile } from "@/components/world/building/domains/definingWorldBuildingBlockHeightConstants";
import { resolvingWorldBuildingPlacedBlockBlockHeight } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";

/**
 * Groups placed blocks by tile column for stacked 3D rendering.
 *
 * @module components/world/building/domains/groupingWorldBuildingPlacedBlocksByTileColumn
 */

/** Stable key for one tile column. */
export type GroupingWorldBuildingPlacedBlocksTileColumnKey = string;

/** Blocks stacked on one tile, sorted from lowest layer to highest. */
export interface GroupingWorldBuildingPlacedBlocksTileColumn {
  readonly tileX: number;
  readonly tileY: number;
  readonly blocks: readonly DefiningWorldBuildingPlacedBlock[];
}

/**
 * Builds a stable tile column key.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function formattingWorldBuildingPlacedBlocksTileColumnKey(
  tileX: number,
  tileY: number,
): GroupingWorldBuildingPlacedBlocksTileColumnKey {
  return `${tileX}:${tileY}`;
}

/**
 * Sorts blocks within one tile column so extrusions draw before surface overlays.
 *
 * @param leftBlock - First block in the sort comparison.
 * @param rightBlock - Second block in the sort comparison.
 */
function comparingWorldBuildingPlacedBlocksForColumnDrawOrder(
  leftBlock: DefiningWorldBuildingPlacedBlock,
  rightBlock: DefiningWorldBuildingPlacedBlock,
): number {
  const leftWorldLayer = resolvingWorldBuildingPlacedBlockWorldLayer(leftBlock);
  const rightWorldLayer =
    resolvingWorldBuildingPlacedBlockWorldLayer(rightBlock);
  const worldLayerDelta = leftWorldLayer - rightWorldLayer;

  if (worldLayerDelta !== 0) {
    return worldLayerDelta;
  }

  const leftIsSurfaceOverlay =
    checkingWorldBuildingPlacedBlockIsPassableTileSurfaceOverlay(leftBlock);
  const rightIsSurfaceOverlay =
    checkingWorldBuildingPlacedBlockIsPassableTileSurfaceOverlay(rightBlock);

  if (leftIsSurfaceOverlay !== rightIsSurfaceOverlay) {
    return leftIsSurfaceOverlay ? 1 : -1;
  }

  const leftIsPassableTile = checkingWorldBuildingPlacedBlockIsPassableTile(
    resolvingWorldBuildingPlacedBlockBlockHeight(leftBlock),
  );
  const rightIsPassableTile = checkingWorldBuildingPlacedBlockIsPassableTile(
    resolvingWorldBuildingPlacedBlockBlockHeight(rightBlock),
  );

  if (leftIsPassableTile !== rightIsPassableTile) {
    return leftIsPassableTile ? 1 : -1;
  }

  return 0;
}

/**
 * Groups placed blocks by tile and sorts each stack by world layer.
 *
 * Cached by source array identity so repeated callers (shadow + column sync)
 * do not regroup the same list.
 *
 * @param placedBlocks - Blocks visible in the viewport.
 */
const GROUPING_WORLD_BUILDING_PLACED_BLOCKS_BY_TILE_COLUMN_CACHE = new WeakMap<
  readonly DefiningWorldBuildingPlacedBlock[],
  GroupingWorldBuildingPlacedBlocksTileColumn[]
>();

export function groupingWorldBuildingPlacedBlocksByTileColumn(
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[]
): GroupingWorldBuildingPlacedBlocksTileColumn[] {
  if (placedBlocks.length === 0) {
    return [];
  }

  const cachedColumns =
    GROUPING_WORLD_BUILDING_PLACED_BLOCKS_BY_TILE_COLUMN_CACHE.get(placedBlocks);

  if (cachedColumns) {
    return cachedColumns;
  }

  const blocksByTileColumnKey = new Map<
    GroupingWorldBuildingPlacedBlocksTileColumnKey,
    DefiningWorldBuildingPlacedBlock[]
  >();

  for (const block of placedBlocks) {
    const tileColumnKey = formattingWorldBuildingPlacedBlocksTileColumnKey(
      block.tilePosition.tileX,
      block.tilePosition.tileY
    );
    const existingBlocks = blocksByTileColumnKey.get(tileColumnKey) ?? [];
    existingBlocks.push(block);
    blocksByTileColumnKey.set(tileColumnKey, existingBlocks);
  }

  const tileColumns = Array.from(blocksByTileColumnKey.entries())
    .map(([tileColumnKey, blocks]) => {
      const [tileXText, tileYText] = tileColumnKey.split(':');
      const sortedBlocks = [...blocks].sort(
        comparingWorldBuildingPlacedBlocksForColumnDrawOrder
      );

      return {
        tileX: Number(tileXText),
        tileY: Number(tileYText),
        blocks: sortedBlocks,
      };
    })
    .sort(
      (leftColumn, rightColumn) =>
        leftColumn.tileX +
        leftColumn.tileY -
        (rightColumn.tileX + rightColumn.tileY)
    );

  GROUPING_WORLD_BUILDING_PLACED_BLOCKS_BY_TILE_COLUMN_CACHE.set(
    placedBlocks,
    tileColumns
  );

  return tileColumns;
}
