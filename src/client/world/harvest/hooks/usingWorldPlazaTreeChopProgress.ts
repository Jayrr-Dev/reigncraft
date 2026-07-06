'use client';

import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { computingWorldPlazaTreeChopDurationMs } from '@/components/world/harvest/domains/computingWorldPlazaTreeChopDurationMs';
import { DEFINING_WORLD_PLAZA_TREE_CHOP_PLAYER_RANGE_TILES } from '@/components/world/harvest/domains/definingWorldPlazaTreeChopConstants';
import { DEFINING_WORLD_PLAZA_TREE_CHOP_TIMED_INTERACTION_PROGRESS_ICON } from '@/components/world/harvest/domains/definingWorldPlazaTreeChopTimedInteractionConstants';
import type { ListingWorldPlazaTreesInInteractionRangeEntry } from '@/components/world/harvest/domains/listingWorldPlazaTreesInInteractionRange';
import { registeringWorldPlazaTreeShake } from '@/components/world/harvest/domains/managingWorldPlazaTreeShakeRegistry';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { formattingWorldPlazaInteractableTreeSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableTreeSelectionKey';
import { usingWorldPlazaTimedInteractionProgress } from '@/components/world/interaction/hooks/usingWorldPlazaTimedInteractionProgress';
import { useCallback, type RefObject } from 'react';

export type UsingWorldPlazaTreeChopProgressSnapshot =
  DefiningWorldPlazaTimedInteractionProgressSnapshot;

export type UsingWorldPlazaTreeChopProgressParams = {
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly selectedInteractableBlockKeysRef: RefObject<ReadonlySet<string>>;
  readonly onChopComplete: (
    entry: ListingWorldPlazaTreesInInteractionRangeEntry
  ) => void;
};

export type UsingWorldPlazaTreeChopProgressResult = {
  readonly snapshot: UsingWorldPlazaTreeChopProgressSnapshot;
  readonly progressRatioRef: RefObject<number>;
  readonly startingTreeChop: (
    entry: ListingWorldPlazaTreesInInteractionRangeEntry
  ) => boolean;
  readonly cancellingTreeChop: () => void;
};

function checkingWorldPlazaTreeChopStillInRange(
  playerPosition: DefiningWorldPlazaWorldPoint,
  tileX: number,
  tileY: number
): boolean {
  const distance = computingWorldPlazaGridChebyshevDistance(
    playerPosition.x,
    playerPosition.y,
    tileX + 0.5,
    tileY + 0.5
  );

  return distance <= DEFINING_WORLD_PLAZA_TREE_CHOP_PLAYER_RANGE_TILES;
}

function checkingWorldPlazaTreeChopStillSelected(
  selectedKeys: ReadonlySet<string>,
  tileX: number,
  tileY: number
): boolean {
  return selectedKeys.has(
    formattingWorldPlazaInteractableTreeSelectionKey(tileX, tileY)
  );
}

/**
 * Tree chopping adapter over the shared timed interaction progress mechanic.
 */
export function usingWorldPlazaTreeChopProgress({
  playerPositionRef,
  selectedInteractableBlockKeysRef,
  onChopComplete,
}: UsingWorldPlazaTreeChopProgressParams): UsingWorldPlazaTreeChopProgressResult {
  const {
    snapshot,
    progressRatioRef,
    startingTimedInteraction,
    cancellingTimedInteraction,
  } =
    usingWorldPlazaTimedInteractionProgress<ListingWorldPlazaTreesInInteractionRangeEntry>(
      {
        onComplete: onChopComplete,
      }
    );

  const startingTreeChop = useCallback(
    (entry: ListingWorldPlazaTreesInInteractionRangeEntry): boolean => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      if (
        !checkingWorldPlazaTreeChopStillInRange(
          playerPosition,
          entry.tileX,
          entry.tileY
        )
      ) {
        return false;
      }

      return startingTimedInteraction({
        targetKey: formattingWorldPlazaInteractableTreeSelectionKey(
          entry.tileX,
          entry.tileY
        ),
        durationMs: computingWorldPlazaTreeChopDurationMs(
          entry.remainingChoppableLayers
        ),
        context: entry,
        progressIcon:
          DEFINING_WORLD_PLAZA_TREE_CHOP_TIMED_INTERACTION_PROGRESS_ICON,
        checkingShouldContinue: () => {
          const currentPlayerPosition = playerPositionRef.current;
          const selectedKeys = selectedInteractableBlockKeysRef.current;

          if (!currentPlayerPosition) {
            return false;
          }

          return (
            checkingWorldPlazaTreeChopStillInRange(
              currentPlayerPosition,
              entry.tileX,
              entry.tileY
            ) &&
            checkingWorldPlazaTreeChopStillSelected(
              selectedKeys,
              entry.tileX,
              entry.tileY
            )
          );
        },
        handlingMilestone: (_milestone, context, nowMs) => {
          registeringWorldPlazaTreeShake(context.tileX, context.tileY, nowMs);
        },
      });
    },
    [
      playerPositionRef,
      selectedInteractableBlockKeysRef,
      startingTimedInteraction,
    ]
  );

  return {
    snapshot,
    progressRatioRef,
    startingTreeChop,
    cancellingTreeChop: cancellingTimedInteraction,
  };
}
