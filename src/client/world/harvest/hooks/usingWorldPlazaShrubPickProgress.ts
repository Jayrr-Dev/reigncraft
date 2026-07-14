'use client';

import type { DefiningWorldPlazaAvatarToolAction } from '@/components/world/animation/domains/definingWorldPlazaAvatarToolActionAnimationRegistry';
import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { playingWorldPlazaEquipmentSfx } from '@/components/world/equipment/domains/playingWorldPlazaEquipmentSfx';
import { computingWorldPlazaShrubPickDurationMs } from '@/components/world/harvest/domains/computingWorldPlazaShrubPickDurationMs';
import {
  DEFINING_WORLD_PLAZA_SHRUB_PICK_PLAYER_RANGE_TILES,
  DEFINING_WORLD_PLAZA_SHRUB_PICK_TIMED_INTERACTION_PROGRESS_ICON,
} from '@/components/world/harvest/domains/definingWorldPlazaShrubPickConstants';
import type { ListingWorldPlazaShrubsInInteractionRangeEntry } from '@/components/world/harvest/domains/listingWorldPlazaShrubsInInteractionRange';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { formattingWorldPlazaInteractableShrubSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableShrubSelectionKey';
import { usingWorldPlazaTimedInteractionProgress } from '@/components/world/interaction/hooks/usingWorldPlazaTimedInteractionProgress';
import { useCallback, type RefObject } from 'react';

export type { ListingWorldPlazaShrubsInInteractionRangeEntry };

export type UsingWorldPlazaShrubPickProgressSnapshot =
  DefiningWorldPlazaTimedInteractionProgressSnapshot;

export type UsingWorldPlazaShrubPickProgressParams = {
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly selectedInteractableBlockKeysRef: RefObject<ReadonlySet<string>>;
  readonly avatarToolActionRef?: RefObject<DefiningWorldPlazaAvatarToolAction | null>;
  readonly onPickComplete: (
    entry: ListingWorldPlazaShrubsInInteractionRangeEntry
  ) => void;
};

export type UsingWorldPlazaShrubPickProgressResult = {
  readonly snapshot: UsingWorldPlazaShrubPickProgressSnapshot;
  readonly progressRatioRef: RefObject<number>;
  readonly startingShrubPick: (
    entry: ListingWorldPlazaShrubsInInteractionRangeEntry
  ) => boolean;
  readonly cancellingShrubPick: () => void;
};

function checkingWorldPlazaShrubPickStillInRange(
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

  return distance <= DEFINING_WORLD_PLAZA_SHRUB_PICK_PLAYER_RANGE_TILES;
}

function checkingWorldPlazaShrubPickStillSelected(
  selectedKeys: ReadonlySet<string>,
  tileX: number,
  tileY: number
): boolean {
  return selectedKeys.has(
    formattingWorldPlazaInteractableShrubSelectionKey(tileX, tileY)
  );
}

/**
 * Berry-shrub pick adapter over the shared timed interaction progress mechanic.
 */
export function usingWorldPlazaShrubPickProgress({
  playerPositionRef,
  selectedInteractableBlockKeysRef,
  avatarToolActionRef,
  onPickComplete,
}: UsingWorldPlazaShrubPickProgressParams): UsingWorldPlazaShrubPickProgressResult {
  const {
    snapshot,
    progressRatioRef,
    startingTimedInteraction,
    cancellingTimedInteraction,
  } =
    usingWorldPlazaTimedInteractionProgress<ListingWorldPlazaShrubsInInteractionRangeEntry>(
      {
        onComplete: onPickComplete,
        ...(avatarToolActionRef ? { avatarToolActionRef } : {}),
      }
    );

  const startingShrubPick = useCallback(
    (entry: ListingWorldPlazaShrubsInInteractionRangeEntry): boolean => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      if (
        !checkingWorldPlazaShrubPickStillInRange(
          playerPosition,
          entry.targetCenterX,
          entry.targetCenterY
        )
      ) {
        return false;
      }

      return startingTimedInteraction({
        targetKey: formattingWorldPlazaInteractableShrubSelectionKey(
          entry.tileX,
          entry.tileY
        ),
        durationMs: computingWorldPlazaShrubPickDurationMs(),
        context: entry,
        progressIcon:
          DEFINING_WORLD_PLAZA_SHRUB_PICK_TIMED_INTERACTION_PROGRESS_ICON,
        avatarToolAction: {
          toolActionId: 'flower-pick',
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
            checkingWorldPlazaShrubPickStillInRange(
              currentPlayerPosition,
              entry.targetCenterX,
              entry.targetCenterY
            ) &&
            checkingWorldPlazaShrubPickStillSelected(
              selectedKeys,
              entry.tileX,
              entry.tileY
            )
          );
        },
        handlingMilestone: (milestone) => {
          playingWorldPlazaEquipmentSfx({
            toolActionId: 'flower-pick',
            milestone,
          });
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
    startingShrubPick,
    cancellingShrubPick: cancellingTimedInteraction,
  };
}
