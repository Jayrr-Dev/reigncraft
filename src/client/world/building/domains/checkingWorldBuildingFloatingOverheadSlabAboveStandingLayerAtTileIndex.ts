import { computingWorldBuildingPlacedBlockOccupiedLayerBand } from '@/components/world/building/domains/computingWorldBuildingPlacedBlockOccupiedLayerBand';
import {
  checkingWorldBuildingPlacedBlockIsPassableTile,
  type DefiningWorldBuildingWorldLayerBand,
} from '@/components/world/building/domains/definingWorldBuildingBlockHeightConstants';
import { resolvingWorldBuildingBlockDefinition } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  resolvingWorldBuildingPlacedBlockBlockHeight,
  resolvingWorldBuildingPlacedBlockWorldLayer,
} from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { checkingWorldBuildingBlockUsesTileColumnExtrusion } from '@/components/world/building/domains/drawingWorldBuildingIsometricTileColumnExtrusionOnGraphics';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { listingWorldBuildingPlacedBlocksAtTileIndex } from '@/components/world/building/domains/resolvingWorldBuildingSurfaceLayerAtTileIndex';

/**
 * Detects walk-under / floating overhead slabs above the avatar standing layer.
 *
 * @module components/world/building/domains/checkingWorldBuildingFloatingOverheadSlabAboveStandingLayerAtTileIndex
 */

/** True roofs need at least two layers between feet and their bottom layer. */
const CHECKING_WORLD_BUILDING_FLOATING_OVERHEAD_MIN_BOTTOM_LAYER_DELTA = 2;

type CheckingWorldBuildingOverheadCandidate = {
  readonly bottomLayer: number;
};

/**
 * Walks downward from a candidate's underside through contiguous solid layers
 * and returns the bottom of the supported stack. A piece resting on other
 * blocks inherits the stack's bottom, so only the air gap under the whole
 * stack decides whether it is a floating roof.
 */
function resolvingWorldBuildingSupportedStackBottomLayer(
  candidateBottomLayer: number,
  solidBands: readonly DefiningWorldBuildingWorldLayerBand[]
): number {
  let stackBottomLayer = candidateBottomLayer;

  while (
    solidBands.some(
      (band) =>
        band.bottomLayer <= stackBottomLayer - 1 &&
        band.topLayer >= stackBottomLayer - 1
    )
  ) {
    stackBottomLayer -= 1;
  }

  return stackBottomLayer;
}

/**
 * Returns true when a tile has a genuinely floating slab with clear air under
 * it. Upper pieces in a continuous stack do not count as roofs.
 */
export function checkingWorldBuildingFloatingOverheadSlabAboveStandingLayerAtTileIndex(
  tileX: number,
  tileY: number,
  standingLayer: number,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): boolean {
  const blocksAtTile = listingWorldBuildingPlacedBlocksAtTileIndex(
    tileX,
    tileY,
    placedBlocks,
    placedBlocksByTile
  );
  const solidBands: DefiningWorldBuildingWorldLayerBand[] = [];
  const overheadCandidates: CheckingWorldBuildingOverheadCandidate[] = [];

  for (const block of blocksAtTile) {
    const definition = resolvingWorldBuildingBlockDefinition(
      block.definitionId
    );

    if (
      !definition ||
      !checkingWorldBuildingBlockUsesTileColumnExtrusion(definition)
    ) {
      continue;
    }

    const blockHeight = resolvingWorldBuildingPlacedBlockBlockHeight(block);
    const worldLayer = resolvingWorldBuildingPlacedBlockWorldLayer(block);

    if (checkingWorldBuildingPlacedBlockIsPassableTile(blockHeight)) {
      overheadCandidates.push({ bottomLayer: worldLayer });
      continue;
    }

    const occupiedBand = computingWorldBuildingPlacedBlockOccupiedLayerBand(
      worldLayer,
      blockHeight
    );
    solidBands.push(occupiedBand);
    overheadCandidates.push({ bottomLayer: occupiedBand.bottomLayer });
  }

  const overheadBottomLayerMin =
    standingLayer +
    CHECKING_WORLD_BUILDING_FLOATING_OVERHEAD_MIN_BOTTOM_LAYER_DELTA;

  return overheadCandidates.some((candidate) => {
    const stackBottomLayer = resolvingWorldBuildingSupportedStackBottomLayer(
      candidate.bottomLayer,
      solidBands
    );

    return stackBottomLayer >= overheadBottomLayerMin;
  });
}
