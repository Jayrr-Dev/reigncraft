'use client';

import type { DefiningWorldPlazaAvatarToolAction } from '@/components/world/animation/domains/definingWorldPlazaAvatarToolActionAnimationRegistry';
import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { computingWorldPlazaPebblePickDurationMs } from '@/components/world/harvest/domains/computingWorldPlazaPebblePickDurationMs';
import { DEFINING_WORLD_PLAZA_PEBBLE_PICK_PLAYER_RANGE_TILES } from '@/components/world/harvest/domains/definingWorldPlazaPebblePickConstants';
import { DEFINING_WORLD_PLAZA_PEBBLE_PICK_TIMED_INTERACTION_PROGRESS_ICON } from '@/components/world/harvest/domains/definingWorldPlazaPebblePickTimedInteractionConstants';
import type { ListingWorldPlazaPebblesInInteractionRangeEntry } from '@/components/world/harvest/domains/listingWorldPlazaPebblesInInteractionRange';
import { formattingWorldPlazaInteractablePebbleSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractablePebbleSelectionKey';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { usingWorldPlazaTimedInteractionProgress } from '@/components/world/interaction/hooks/usingWorldPlazaTimedInteractionProgress';
import { useCallback, type RefObject } from 'react';

export type { ListingWorldPlazaPebblesInInteractionRangeEntry };

export type UsingWorldPlazaPebblePickProgressSnapshot =
  DefiningWorldPlazaTimedInteractionProgressSnapshot;

export type UsingWorldPlazaPebblePickProgressParams = {
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly selectedInteractableBlockKeysRef: RefObject<ReadonlySet<string>>;
  /** Shared slot the avatar tick reads to play the pick animation in place. */
  readonly avatarToolActionRef?: RefObject<DefiningWorldPlazaAvatarToolAction | null>;
  readonly onPickComplete: (
    entry: ListingWorldPlazaPebblesInInteractionRangeEntry
  ) => void;
};

export type UsingWorldPlazaPebblePickProgressResult = {
  readonly snapshot: UsingWorldPlazaPebblePickProgressSnapshot;
  readonly progressRatioRef: RefObject<number>;
  readonly startingPebblePick: (
    entry: ListingWorldPlazaPebblesInInteractionRangeEntry
  ) => boolean;
  readonly cancellingPebblePick: () => void;
};

function checkingWorldPlazaPebblePickStillInRange(
  playerPosition: DefiningWorldPlazaWorldPoint,
  targetCenterX: number,
  targetCenterY: number
): boolean {
  const distance = computingWorldPlazaGridChebyshevDistance(
    playerPosition.x,
    playerPosition.y,
    targetCenterX,
    targetCenterY
  );

  return distance <= DEFINING_WORLD_PLAZA_PEBBLE_PICK_PLAYER_RANGE_TILES;
}

function checkingWorldPlazaPebblePickStillSelected(
  selectedKeys: ReadonlySet<string>,
  tileX: number,
  tileY: number
): boolean {
  return selectedKeys.has(
    formattingWorldPlazaInteractablePebbleSelectionKey(tileX, tileY)
  );
}

/**
 * Pebble pick adapter over the shared timed interaction progress mechanic.
 */
export function usingWorldPlazaPebblePickProgress({
  playerPositionRef,
  selectedInteractableBlockKeysRef,
  avatarToolActionRef,
  onPickComplete,
}: UsingWorldPlazaPebblePickProgressParams): UsingWorldPlazaPebblePickProgressResult {
  const {
    snapshot,
    progressRatioRef,
    startingTimedInteraction,
    cancellingTimedInteraction,
  } =
    usingWorldPlazaTimedInteractionProgress<ListingWorldPlazaPebblesInInteractionRangeEntry>(
      {
        onComplete: onPickComplete,
        ...(avatarToolActionRef ? { avatarToolActionRef } : {}),
      }
    );

  const startingPebblePick = useCallback(
    (entry: ListingWorldPlazaPebblesInInteractionRangeEntry): boolean => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      if (
        !checkingWorldPlazaPebblePickStillInRange(
          playerPosition,
          entry.targetCenterX,
          entry.targetCenterY
        )
      ) {
        return false;
      }

      return startingTimedInteraction({
        targetKey: formattingWorldPlazaInteractablePebbleSelectionKey(
          entry.tileX,
          entry.tileY
        ),
        durationMs: computingWorldPlazaPebblePickDurationMs(),
        context: entry,
        progressIcon:
          DEFINING_WORLD_PLAZA_PEBBLE_PICK_TIMED_INTERACTION_PROGRESS_ICON,
        avatarToolAction: {
          toolActionId: 'pebble-pick',
          targetGridX: entry.targetCenterX,
          targetGridY: entry.targetCenterY,
        },
        checkingShouldContinue: () => {
          const currentPlayerPosition = playerPositionRef.current;
          const selectedKeys = selectedInteractableBlockKeysRef.current;

          if (!currentPlayerPosition) {
            return false;
          }

          return (
            checkingWorldPlazaPebblePickStillInRange(
              currentPlayerPosition,
              entry.targetCenterX,
              entry.targetCenterY
            ) &&
            checkingWorldPlazaPebblePickStillSelected(
              selectedKeys,
              entry.tileX,
              entry.tileY
            )
          );
        },
      });
    },
    [playerPositionRef, selectedInteractableBlockKeysRef, startingTimedInteraction]
  );

  return {
    snapshot,
    progressRatioRef,
    startingPebblePick,
    cancellingPebblePick: cancellingTimedInteraction,
  };
}
