import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import { resolvingWorldBuildingSurfaceLayerAtTileIndex } from "@/components/world/building/domains/resolvingWorldBuildingSurfaceLayerAtTileIndex";
import { listingWorldBuildingPlacedBlocksAtTileIndex } from "@/components/world/building/domains/resolvingWorldBuildingSurfaceLayerAtTileIndex";
import {
  checkingWorldBuildingPlacedBlockIsPassableTile,
  resolvingWorldBuildingEffectiveBlockHeight,
} from "@/components/world/building/domains/definingWorldBuildingBlockHeightConstants";
import { clampingWorldBuildingWorldLayer } from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";

/**
 * Resolves the effective placement layer while hovering tiles in build mode.
 *
 * @module components/world/building/domains/resolvingWorldBuildingHoverPlacementWorldLayer
 */

export interface ResolvingWorldBuildingHoverPlacementWorldLayerParams {
  readonly tilePosition: DefiningWorldBuildingTilePosition | null;
  readonly selectedWorldLayer: number;
  readonly selectedBlockHeight: number;
  readonly placedBlocks: DefiningWorldBuildingPlacedBlock[];
}

/**
 * Returns the top anchor layer used for preview and placement on a hovered tile.
 *
 * World layer is the **top** anchor and columns extrude downward, so a block of
 * height H resting on a stack whose top is at layer S must anchor at S + H (its
 * bottom then rests at S + 1, directly on top of the existing column). Empty
 * tiles keep the sidebar layer, and a manually raised layer is still honored.
 *
 * @param params - Hover tile, sidebar layer, block height, and placed blocks.
 */
export function resolvingWorldBuildingHoverPlacementWorldLayer(
  params: ResolvingWorldBuildingHoverPlacementWorldLayerParams,
): number {
  const selectedWorldLayer = clampingWorldBuildingWorldLayer(
    params.selectedWorldLayer,
  );

  if (!params.tilePosition) {
    return selectedWorldLayer;
  }

  const blocksOnTile = listingWorldBuildingPlacedBlocksAtTileIndex(
    params.tilePosition.tileX,
    params.tilePosition.tileY,
    params.placedBlocks,
  );

  if (blocksOnTile.length === 0) {
    return selectedWorldLayer;
  }

  const stackTopLayer = resolvingWorldBuildingSurfaceLayerAtTileIndex(
    params.tilePosition.tileX,
    params.tilePosition.tileY,
    params.placedBlocks,
  );
  const effectiveBlockHeight = resolvingWorldBuildingEffectiveBlockHeight(
    params.selectedBlockHeight,
    selectedWorldLayer,
  );

  if (checkingWorldBuildingPlacedBlockIsPassableTile(effectiveBlockHeight)) {
    return clampingWorldBuildingWorldLayer(
      Math.max(selectedWorldLayer, stackTopLayer),
    );
  }

  // Extruded blocks anchor above the stack by their height (H).
  const stackingBlockHeight = Math.max(1, effectiveBlockHeight);
  const stackedTopAnchorLayer = clampingWorldBuildingWorldLayer(
    stackTopLayer + stackingBlockHeight,
  );

  return clampingWorldBuildingWorldLayer(
    Math.max(selectedWorldLayer, stackedTopAnchorLayer),
  );
}
