import { resolvingWorldBuildingPlacedBlockTopWorldLayer } from "@/components/world/building/domains/computingWorldBuildingPlacedBlockOccupiedLayerBand";
import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import {
  resolvingWorldBuildingPlacedBlockBlockHeight,
  resolvingWorldBuildingPlacedBlockWorldLayer,
} from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { checkingWorldBuildingPlacedBlockIsPassableTile } from "@/components/world/building/domains/definingWorldBuildingBlockHeightConstants";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import { checkingWorldBuildingPlacedBlockIsPassableTileSurfaceOverlay } from "@/components/world/building/domains/checkingWorldBuildingPlacedBlockIsPassableTileSurfaceOverlay";

/**
 * Finds extruded blocks whose top face sits on a tile layer.
 *
 * @module components/world/building/domains/findingWorldBuildingPlacedBlockExtrudedTopFaceAtTileLayer
 */

/**
 * Returns true when an extruded block exposes its top face on the requested layer.
 *
 * @param block - Candidate placed block on the tile.
 * @param worldLayer - Target top face layer.
 */
export function checkingWorldBuildingPlacedBlockExtrudedTopFaceAtWorldLayer(
  block: DefiningWorldBuildingPlacedBlock,
  worldLayer: number,
): boolean {
  if (checkingWorldBuildingPlacedBlockIsPassableTileSurfaceOverlay(block)) {
    return false;
  }

  const blockHeight = resolvingWorldBuildingPlacedBlockBlockHeight(block);

  if (checkingWorldBuildingPlacedBlockIsPassableTile(blockHeight)) {
    return false;
  }

  const anchorWorldLayer = resolvingWorldBuildingPlacedBlockWorldLayer(block);
  const topWorldLayer =
    resolvingWorldBuildingPlacedBlockTopWorldLayer(block);

  return (
    worldLayer === topWorldLayer && anchorWorldLayer === topWorldLayer
  );
}

/**
 * Returns the extruded block whose top face occupies the requested tile layer.
 *
 * @param placedBlocks - Blocks on the candidate tile.
 * @param worldLayer - Target top face layer.
 */
export function findingWorldBuildingPlacedBlockExtrudedTopFaceAtTileLayer(
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
  worldLayer: number,
): DefiningWorldBuildingPlacedBlock | null {
  for (const block of placedBlocks) {
    if (
      checkingWorldBuildingPlacedBlockExtrudedTopFaceAtWorldLayer(
        block,
        worldLayer,
      )
    ) {
      return block;
    }
  }

  return null;
}

/**
 * Lists placed blocks on one tile from a plot block map.
 *
 * @param placedBlocks - All blocks stored on the plot.
 * @param position - Tile position to filter.
 */
export function listingWorldBuildingPlacedBlocksAtTilePosition(
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
  position: DefiningWorldBuildingTilePosition,
): DefiningWorldBuildingPlacedBlock[] {
  return placedBlocks.filter(
    (block) =>
      block.tilePosition.tileX === position.tileX &&
      block.tilePosition.tileY === position.tileY,
  );
}
