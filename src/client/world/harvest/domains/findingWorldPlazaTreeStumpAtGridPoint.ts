import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks } from '@/components/world/domains/listingWorldPlazaPlacedTreeBlocksInTileBounds';
import type { DefiningWorldPlazaTreeInstance } from '@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex';
import { applyingWorldPlazaTreeChopStateToInstance } from '@/components/world/harvest/domains/applyingWorldPlazaTreeChopStateToInstance';
import {
  computingWorldPlazaTreeChopPointerHitDistance,
  type DefiningWorldPlazaTreeChopPointerHitContext,
} from '@/components/world/harvest/domains/computingWorldPlazaTreeChopPointerDistanceFromFootprint';
import { DEFINING_WORLD_PLAZA_TREE_STUMP_STUDY_PLAYER_RANGE_GRID } from '@/components/world/harvest/domains/definingWorldPlazaTreeStumpStudyConstants';
import { listingWorldPlazaTreeChopCandidateTilePositionsAroundPointer } from '@/components/world/harvest/domains/listingWorldPlazaTreeChopCandidateTilePositionsAroundPointer';
import type { DefiningWorldPlazaChoppedTreeTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import {
  formattingWorldPlazaChoppedTreeTileKey,
  readingWorldPlazaChoppedTreeState,
} from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import { checkingWorldPlazaLocalTreeStumpStudied } from '@/components/world/harvest/domains/managingWorldPlazaLocalStudiedTreeStumps';

export type FindingWorldPlazaTreeStumpAtGridPointResult = {
  readonly tree: DefiningWorldPlazaTreeInstance;
  readonly tileX: number;
  readonly tileY: number;
};

/**
 * Finds the closest unstudied stump under a pointer within study range.
 */
export function findingWorldPlazaTreeStumpAtGridPoint(
  pointerContext: DefiningWorldPlazaTreeChopPointerHitContext,
  playerPosition: DefiningWorldPlazaWorldPoint,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
  persistenceOwnerId: string | null,
  choppedTreeStateByTileKey?: ReadonlyMap<
    string,
    DefiningWorldPlazaChoppedTreeTileState
  >
): FindingWorldPlazaTreeStumpAtGridPointResult | null {
  const candidateTiles =
    listingWorldPlazaTreeChopCandidateTilePositionsAroundPointer(
      pointerContext.gridPoint,
      playerPosition
    );

  let closestMatch: FindingWorldPlazaTreeStumpAtGridPointResult | null = null;
  let closestPointerDistance = Number.POSITIVE_INFINITY;

  for (const tilePosition of candidateTiles) {
    if (
      checkingWorldPlazaLocalTreeStumpStudied(
        persistenceOwnerId,
        tilePosition.tileX,
        tilePosition.tileY
      )
    ) {
      continue;
    }

    const playerDistance = computingWorldPlazaGridChebyshevDistance(
      playerPosition.x,
      playerPosition.y,
      tilePosition.tileX + 0.5,
      tilePosition.tileY + 0.5
    );

    if (
      playerDistance > DEFINING_WORLD_PLAZA_TREE_STUMP_STUDY_PLAYER_RANGE_GRID
    ) {
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

    if (!tree?.isStump) {
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
        tileX: tilePosition.tileX,
        tileY: tilePosition.tileY,
      };
    }
  }

  return closestMatch;
}
