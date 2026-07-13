import type { DefiningWorldBuildingBlockDefinitionId } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import { checkingWorldBuildingPlacedBlockIsPassableTile } from '@/components/world/building/domains/definingWorldBuildingBlockHeightConstants';
import { checkingWorldBuildingCutFootprintIsEmpty } from '@/components/world/building/domains/definingWorldBuildingCutFootprintConstants';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  findingWorldBuildingPlotContainingTilePosition,
  type DefiningWorldBuildingPlot,
} from '@/components/world/building/domains/definingWorldBuildingPlot';
import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { checkingWorldBuildingBlockPlacementExtrusionFitsTopLayer } from '@/components/world/building/domains/computingWorldBuildingPlacedBlockOccupiedLayerBand';
import { checkingWorldBuildingPlacedBlockIsPassableTileSurfaceOverlay } from '@/components/world/building/domains/checkingWorldBuildingPlacedBlockIsPassableTileSurfaceOverlay';
import {
  findingWorldBuildingPlacedBlockExtrudedTopFaceAtTileLayer,
  listingWorldBuildingPlacedBlocksAtTilePosition,
} from '@/components/world/building/domains/findingWorldBuildingPlacedBlockExtrudedTopFaceAtTileLayer';
import { resolvingWorldBuildingPlacedBlockWorldLayer } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { checkingWorldBuildingBlockDefinitionAllowsSessionPlacementOutsideClaim } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';

/**
 * Returns true when a session placeable may be built on unclaimed land.
 *
 * @param plots - Viewport plots including other players' claims.
 * @param placedBlocks - All placed blocks visible to the builder.
 * @param position - Target tile position.
 * @param definitionId - Block type id.
 * @param worldLayer - Target world layer.
 * @param blockHeight - Requested block height.
 * @param cutFootprintMask - Cut footprint mask for the placement.
 */
export function checkingWorldBuildingSessionBlockCanPlaceAtTilePosition(
  plots: readonly DefiningWorldBuildingPlot[],
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
  position: DefiningWorldBuildingTilePosition,
  definitionId: DefiningWorldBuildingBlockDefinitionId,
  worldLayer: number,
  blockHeight: number,
  cutFootprintMask: number,
): boolean {
  if (
    !checkingWorldBuildingBlockDefinitionAllowsSessionPlacementOutsideClaim(
      definitionId,
    )
  ) {
    return false;
  }

  if (checkingWorldBuildingCutFootprintIsEmpty(cutFootprintMask)) {
    return false;
  }

  const plot = findingWorldBuildingPlotContainingTilePosition(plots, position);

  if (plot) {
    return false;
  }

  if (
    !checkingWorldBuildingBlockPlacementExtrusionFitsTopLayer(
      worldLayer,
      blockHeight,
    )
  ) {
    return false;
  }

  const blocksOnTile = listingWorldBuildingPlacedBlocksAtTilePosition(
    placedBlocks,
    position,
  );

  if (checkingWorldBuildingPlacedBlockIsPassableTile(blockHeight)) {
    const hasOverlay = blocksOnTile.some(
      (block) =>
        checkingWorldBuildingPlacedBlockIsPassableTileSurfaceOverlay(block) &&
        resolvingWorldBuildingPlacedBlockWorldLayer(block) === worldLayer,
    );

    if (hasOverlay) {
      return false;
    }

    const hasPassableBlock = blocksOnTile.some(
      (block) =>
        checkingWorldBuildingPlacedBlockIsPassableTile(block.blockHeight) &&
        resolvingWorldBuildingPlacedBlockWorldLayer(block) === worldLayer,
    );

    if (hasPassableBlock) {
      return false;
    }
  } else if (
    findingWorldBuildingPlacedBlockExtrudedTopFaceAtTileLayer(
      blocksOnTile,
      worldLayer,
    )
  ) {
    return false;
  }

  return true;
}
