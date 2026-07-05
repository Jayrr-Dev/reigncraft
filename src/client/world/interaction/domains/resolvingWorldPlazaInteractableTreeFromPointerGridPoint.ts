import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks } from '@/components/world/domains/listingWorldPlazaPlacedTreeBlocksInTileBounds';
import type { DefiningWorldPlazaTreeInstance } from '@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex';
import {
  applyingWorldPlazaTreeChopStateToInstance,
  computingWorldPlazaTreeChoppableLayerCount,
} from '@/components/world/harvest/domains/applyingWorldPlazaTreeChopStateToInstance';
import {
  computingWorldPlazaTreeChopPointerHitDistance,
  type DefiningWorldPlazaTreeChopPointerHitContext,
} from '@/components/world/harvest/domains/computingWorldPlazaTreeChopPointerDistanceFromFootprint';
import { DEFINING_WORLD_PLAZA_TREE_CHOP_PLAYER_RANGE_TILES } from '@/components/world/harvest/domains/definingWorldPlazaTreeChopConstants';
import { listingWorldPlazaTreeChopCandidateTilePositionsAroundPointer } from '@/components/world/harvest/domains/listingWorldPlazaTreeChopCandidateTilePositionsAroundPointer';
import type { DefiningWorldPlazaChoppedTreeTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import {
  formattingWorldPlazaChoppedTreeTileKey,
  readingWorldPlazaChoppedTreeState,
} from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';

export type ResolvingWorldPlazaInteractableTreeFromPointerGridPointResult = {
  readonly tree: DefiningWorldPlazaTreeInstance;
  readonly tilePosition: DefiningWorldBuildingTilePosition;
  readonly remainingChoppableLayers: number;
};

/**
 * Resolves the nearest choppable tree under a pointer within player range.
 */
export function resolvingWorldPlazaInteractableTreeFromPointerGridPoint(
  pointerContext: DefiningWorldPlazaTreeChopPointerHitContext,
  playerPosition: DefiningWorldPlazaWorldPoint,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
  persistenceOwnerId: string | null,
  choppedTreeStateByTileKey?: ReadonlyMap<
    string,
    DefiningWorldPlazaChoppedTreeTileState
  >
): ResolvingWorldPlazaInteractableTreeFromPointerGridPointResult | null {
  const candidateTiles =
    listingWorldPlazaTreeChopCandidateTilePositionsAroundPointer(
      pointerContext.gridPoint,
      playerPosition
    );

  let closestMatch: ResolvingWorldPlazaInteractableTreeFromPointerGridPointResult | null =
    null;
  let closestPointerDistance = Number.POSITIVE_INFINITY;

  for (const tilePosition of candidateTiles) {
    const playerDistance = computingWorldPlazaGridChebyshevDistance(
      playerPosition.x,
      playerPosition.y,
      tilePosition.tileX + 0.5,
      tilePosition.tileY + 0.5
    );

    if (playerDistance > DEFINING_WORLD_PLAZA_TREE_CHOP_PLAYER_RANGE_TILES) {
      continue;
    }

    const baseTree = resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks(
      tilePosition.tileX,
      tilePosition.tileY,
      placedBlocks
    );

    if (!baseTree) {
      continue;
    }

    const choppedState =
      choppedTreeStateByTileKey?.get(
        formattingWorldPlazaChoppedTreeTileKey(
          tilePosition.tileX,
          tilePosition.tileY
        )
      ) ??
      readingWorldPlazaChoppedTreeState(
        persistenceOwnerId,
        tilePosition.tileX,
        tilePosition.tileY
      );

    const tree = applyingWorldPlazaTreeChopStateToInstance(
      baseTree,
      choppedState
    );

    if (!tree) {
      continue;
    }

    const remainingChoppableLayers =
      computingWorldPlazaTreeChoppableLayerCount(tree);

    if (remainingChoppableLayers <= 0) {
      continue;
    }

    const pointerDistance = computingWorldPlazaTreeChopPointerHitDistance(
      pointerContext,
      tree
    );

    if (pointerDistance === null) {
      continue;
    }

    if (pointerDistance < closestPointerDistance) {
      closestPointerDistance = pointerDistance;
      closestMatch = {
        tree,
        tilePosition,
        remainingChoppableLayers,
      };
    }
  }

  return closestMatch;
}
