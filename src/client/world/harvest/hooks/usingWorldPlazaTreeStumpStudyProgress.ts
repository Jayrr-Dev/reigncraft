'use client';

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks } from '@/components/world/domains/listingWorldPlazaPlacedTreeBlocksInTileBounds';
import { applyingWorldPlazaTreeChopStateToInstance } from '@/components/world/harvest/domains/applyingWorldPlazaTreeChopStateToInstance';
import {
  DEFINING_WORLD_PLAZA_TREE_STUMP_STUDY_DURATION_MS,
  DEFINING_WORLD_PLAZA_TREE_STUMP_STUDY_PLAYER_RANGE_GRID,
  DEFINING_WORLD_PLAZA_TREE_STUMP_STUDY_PROGRESS_ICON,
} from '@/components/world/harvest/domains/definingWorldPlazaTreeStumpStudyConstants';
import { formattingWorldPlazaTreeStumpStudySelectionKey } from '@/components/world/harvest/domains/formattingWorldPlazaTreeStumpStudySelectionKey';
import type { ListingWorldPlazaTreeStumpsInStudyRangeEntry } from '@/components/world/harvest/domains/listingWorldPlazaTreeStumpsInStudyRange';
import type { DefiningWorldPlazaChoppedTreeTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import { formattingWorldPlazaChoppedTreeTileKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import { checkingWorldPlazaLocalTreeStumpStudied } from '@/components/world/harvest/domains/managingWorldPlazaLocalStudiedTreeStumps';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { usingWorldPlazaTimedInteractionProgress } from '@/components/world/interaction/hooks/usingWorldPlazaTimedInteractionProgress';
import { useCallback, type RefObject } from 'react';

export type UsingWorldPlazaTreeStumpStudyProgressSnapshot =
  DefiningWorldPlazaTimedInteractionProgressSnapshot;

export type UsingWorldPlazaTreeStumpStudyProgressParams = {
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint | null>;
  readonly selectedInteractableBlockKeysRef: RefObject<ReadonlySet<string>>;
  readonly placedBlocksRef: RefObject<
    readonly DefiningWorldBuildingPlacedBlock[]
  >;
  readonly choppedTreeStateByTileKeyRef: RefObject<
    ReadonlyMap<string, DefiningWorldPlazaChoppedTreeTileState>
  >;
  readonly persistenceOwnerId: string | null;
  readonly onStudyComplete: (
    entry: ListingWorldPlazaTreeStumpsInStudyRangeEntry
  ) => void;
};

export type UsingWorldPlazaTreeStumpStudyProgressResult = {
  readonly snapshot: UsingWorldPlazaTreeStumpStudyProgressSnapshot;
  readonly progressRatioRef: RefObject<number>;
  readonly startingStumpStudy: (
    entry: ListingWorldPlazaTreeStumpsInStudyRangeEntry
  ) => boolean;
  readonly cancellingStumpStudy: () => void;
};

function checkingWorldPlazaTreeStumpStudyStillValid(
  playerPosition: DefiningWorldPlazaWorldPoint,
  selectedKeys: ReadonlySet<string>,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
  choppedTreeStateByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaChoppedTreeTileState
  >,
  persistenceOwnerId: string | null,
  entry: ListingWorldPlazaTreeStumpsInStudyRangeEntry
): boolean {
  const selectionKey = formattingWorldPlazaTreeStumpStudySelectionKey(
    entry.tileX,
    entry.tileY
  );

  if (!selectedKeys.has(selectionKey)) {
    return false;
  }

  if (
    checkingWorldPlazaLocalTreeStumpStudied(
      persistenceOwnerId,
      entry.tileX,
      entry.tileY
    )
  ) {
    return false;
  }

  const baseTree = resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks(
    entry.tileX,
    entry.tileY,
    placedBlocks
  );

  if (!baseTree) {
    return false;
  }

  const tree = applyingWorldPlazaTreeChopStateToInstance(
    baseTree,
    choppedTreeStateByTileKey.get(
      formattingWorldPlazaChoppedTreeTileKey(entry.tileX, entry.tileY)
    )
  );

  if (!tree?.isStump) {
    return false;
  }

  const distance = computingWorldPlazaGridChebyshevDistance(
    playerPosition.x,
    playerPosition.y,
    entry.tileX + 0.5,
    entry.tileY + 0.5
  );

  return distance <= DEFINING_WORLD_PLAZA_TREE_STUMP_STUDY_PLAYER_RANGE_GRID;
}

/**
 * Stump Study adapter over the shared timed interaction progress mechanic.
 */
export function usingWorldPlazaTreeStumpStudyProgress({
  playerPositionRef,
  selectedInteractableBlockKeysRef,
  placedBlocksRef,
  choppedTreeStateByTileKeyRef,
  persistenceOwnerId,
  onStudyComplete,
}: UsingWorldPlazaTreeStumpStudyProgressParams): UsingWorldPlazaTreeStumpStudyProgressResult {
  const {
    snapshot,
    progressRatioRef,
    startingTimedInteraction,
    cancellingTimedInteraction,
  } =
    usingWorldPlazaTimedInteractionProgress<ListingWorldPlazaTreeStumpsInStudyRangeEntry>(
      {
        onComplete: onStudyComplete,
      }
    );

  const startingStumpStudy = useCallback(
    (entry: ListingWorldPlazaTreeStumpsInStudyRangeEntry): boolean => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      if (
        !checkingWorldPlazaTreeStumpStudyStillValid(
          playerPosition,
          selectedInteractableBlockKeysRef.current,
          placedBlocksRef.current,
          choppedTreeStateByTileKeyRef.current,
          persistenceOwnerId,
          entry
        )
      ) {
        return false;
      }

      return startingTimedInteraction({
        targetKey: formattingWorldPlazaTreeStumpStudySelectionKey(
          entry.tileX,
          entry.tileY
        ),
        durationMs: DEFINING_WORLD_PLAZA_TREE_STUMP_STUDY_DURATION_MS,
        context: entry,
        progressIcon: DEFINING_WORLD_PLAZA_TREE_STUMP_STUDY_PROGRESS_ICON,
        checkingShouldContinue: () => {
          const currentPlayerPosition = playerPositionRef.current;

          if (!currentPlayerPosition) {
            return false;
          }

          return checkingWorldPlazaTreeStumpStudyStillValid(
            currentPlayerPosition,
            selectedInteractableBlockKeysRef.current,
            placedBlocksRef.current,
            choppedTreeStateByTileKeyRef.current,
            persistenceOwnerId,
            entry
          );
        },
      });
    },
    [
      choppedTreeStateByTileKeyRef,
      persistenceOwnerId,
      placedBlocksRef,
      playerPositionRef,
      selectedInteractableBlockKeysRef,
      startingTimedInteraction,
    ]
  );

  return {
    snapshot,
    progressRatioRef,
    startingStumpStudy,
    cancellingStumpStudy: cancellingTimedInteraction,
  };
}
