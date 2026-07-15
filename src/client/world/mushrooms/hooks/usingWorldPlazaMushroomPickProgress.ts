'use client';

import type { DefiningWorldPlazaAvatarToolAction } from '@/components/world/animation/domains/definingWorldPlazaAvatarToolActionAnimationRegistry';
import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { playingWorldPlazaEquipmentSfx } from '@/components/world/equipment/domains/playingWorldPlazaEquipmentSfx';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { formattingWorldPlazaInteractableMushroomSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableMushroomSelectionKey';
import { usingWorldPlazaTimedInteractionProgress } from '@/components/world/interaction/hooks/usingWorldPlazaTimedInteractionProgress';
import { computingWorldPlazaMushroomPickDurationMs } from '@/components/world/mushrooms/domains/computingWorldPlazaMushroomPickDurationMs';
import { DEFINING_WORLD_PLAZA_MUSHROOM_PICK_PLAYER_RANGE_TILES } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomConstants';
import { DEFINING_WORLD_PLAZA_MUSHROOM_PICK_TIMED_INTERACTION_PROGRESS_ICON } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomPickTimedInteractionConstants';
import type { ListingWorldPlazaMushroomsInInteractionRangeEntry } from '@/components/world/mushrooms/domains/listingWorldPlazaMushroomsInInteractionRange';
import { useCallback, type RefObject } from 'react';

export type UsingWorldPlazaMushroomPickProgressSnapshot =
  DefiningWorldPlazaTimedInteractionProgressSnapshot;

export type UsingWorldPlazaMushroomPickProgressParams = {
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly selectedInteractableBlockKeysRef: RefObject<ReadonlySet<string>>;
  readonly avatarToolActionRef?: RefObject<DefiningWorldPlazaAvatarToolAction | null>;
  readonly onPickComplete: (
    entry: ListingWorldPlazaMushroomsInInteractionRangeEntry
  ) => void;
};

export type UsingWorldPlazaMushroomPickProgressResult = {
  readonly snapshot: UsingWorldPlazaMushroomPickProgressSnapshot;
  readonly progressRatioRef: RefObject<number>;
  readonly startingMushroomPick: (
    entry: ListingWorldPlazaMushroomsInInteractionRangeEntry
  ) => boolean;
  readonly cancellingMushroomPick: () => void;
};

function checkingWorldPlazaMushroomPickStillInRange(
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

  return distance <= DEFINING_WORLD_PLAZA_MUSHROOM_PICK_PLAYER_RANGE_TILES;
}

function checkingWorldPlazaMushroomPickStillSelected(
  selectedKeys: ReadonlySet<string>,
  tileX: number,
  tileY: number
): boolean {
  return selectedKeys.has(
    formattingWorldPlazaInteractableMushroomSelectionKey(tileX, tileY)
  );
}

/**
 * Mushroom pick adapter over the shared timed interaction progress mechanic.
 */
export function usingWorldPlazaMushroomPickProgress({
  playerPositionRef,
  selectedInteractableBlockKeysRef,
  avatarToolActionRef,
  onPickComplete,
}: UsingWorldPlazaMushroomPickProgressParams): UsingWorldPlazaMushroomPickProgressResult {
  const {
    snapshot,
    progressRatioRef,
    startingTimedInteraction,
    cancellingTimedInteraction,
  } =
    usingWorldPlazaTimedInteractionProgress<ListingWorldPlazaMushroomsInInteractionRangeEntry>(
      {
        onComplete: onPickComplete,
        ...(avatarToolActionRef ? { avatarToolActionRef } : {}),
      }
    );

  const startingMushroomPick = useCallback(
    (entry: ListingWorldPlazaMushroomsInInteractionRangeEntry): boolean => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      if (
        !checkingWorldPlazaMushroomPickStillInRange(
          playerPosition,
          entry.targetCenterX,
          entry.targetCenterY
        )
      ) {
        return false;
      }

      return startingTimedInteraction({
        targetKey: formattingWorldPlazaInteractableMushroomSelectionKey(
          entry.tileX,
          entry.tileY
        ),
        durationMs: computingWorldPlazaMushroomPickDurationMs(),
        context: entry,
        progressIcon:
          DEFINING_WORLD_PLAZA_MUSHROOM_PICK_TIMED_INTERACTION_PROGRESS_ICON,
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
            checkingWorldPlazaMushroomPickStillInRange(
              currentPlayerPosition,
              entry.targetCenterX,
              entry.targetCenterY
            ) &&
            checkingWorldPlazaMushroomPickStillSelected(
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
    startingMushroomPick,
    cancellingMushroomPick: cancellingTimedInteraction,
  };
}
