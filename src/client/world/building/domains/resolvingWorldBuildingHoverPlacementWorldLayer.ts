import {
  checkingWorldBuildingPlacedBlockIsPassableTile,
  resolvingWorldBuildingEffectiveBlockHeight,
} from '@/components/world/building/domains/definingWorldBuildingBlockHeightConstants';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import {
  clampingWorldBuildingWorldLayer,
  DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
} from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import { listingWorldBuildingPlacedBlocksAtTileIndex } from '@/components/world/building/domains/resolvingWorldBuildingSurfaceLayerAtTileIndex';
import { resolvingWorldPlazaBaseSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';

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
 * flat-ground tiles keep the sidebar layer, and a manually raised layer is still
 * honored. Elevated terrain / rock columns count as a stack top so previews sit
 * on the plateau instead of drawing at ground height inside the cliff face.
 *
 * @param params - Hover tile, sidebar layer, block height, and placed blocks.
 */
export function resolvingWorldBuildingHoverPlacementWorldLayer(
  params: ResolvingWorldBuildingHoverPlacementWorldLayerParams
): number {
  const selectedWorldLayer = clampingWorldBuildingWorldLayer(
    params.selectedWorldLayer
  );

  if (!params.tilePosition) {
    return selectedWorldLayer;
  }

  const { tileX, tileY } = params.tilePosition;
  const blocksOnTile = listingWorldBuildingPlacedBlocksAtTileIndex(
    tileX,
    tileY,
    params.placedBlocks
  );
  const stackTopLayer = resolvingWorldPlazaBaseSurfaceLayerAtTileIndex(
    tileX,
    tileY,
    params.placedBlocks
  );

  // Empty flat ground: sidebar L wins (manual raise still works).
  if (
    blocksOnTile.length === 0 &&
    stackTopLayer <= DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND
  ) {
    return selectedWorldLayer;
  }

  const effectiveBlockHeight = resolvingWorldBuildingEffectiveBlockHeight(
    params.selectedBlockHeight,
    selectedWorldLayer
  );

  if (checkingWorldBuildingPlacedBlockIsPassableTile(effectiveBlockHeight)) {
    return clampingWorldBuildingWorldLayer(
      Math.max(selectedWorldLayer, stackTopLayer)
    );
  }

  // Extruded blocks anchor above the stack by their height (H).
  const stackingBlockHeight = Math.max(1, effectiveBlockHeight);
  const stackedTopAnchorLayer = clampingWorldBuildingWorldLayer(
    stackTopLayer + stackingBlockHeight
  );

  return clampingWorldBuildingWorldLayer(
    Math.max(selectedWorldLayer, stackedTopAnchorLayer)
  );
}
