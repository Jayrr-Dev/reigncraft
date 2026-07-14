'use client';

import type { DefiningWorldPlazaAvatarToolAction } from '@/components/world/animation/domains/definingWorldPlazaAvatarToolActionAnimationRegistry';
import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { playingWorldPlazaEquipmentSfx } from '@/components/world/equipment/domains/playingWorldPlazaEquipmentSfx';
import { computingWorldPlazaFlowerPickDurationMs } from '@/components/world/harvest/domains/computingWorldPlazaFlowerPickDurationMs';
import { DEFINING_WORLD_PLAZA_FLOWER_PICK_PLAYER_RANGE_TILES } from '@/components/world/harvest/domains/definingWorldPlazaFlowerPickConstants';
import { DEFINING_WORLD_PLAZA_FLOWER_PICK_TIMED_INTERACTION_PROGRESS_ICON } from '@/components/world/harvest/domains/definingWorldPlazaFlowerPickTimedInteractionConstants';
import type { ListingWorldPlazaFlowersInInteractionRangeEntry } from '@/components/world/harvest/domains/listingWorldPlazaFlowersInInteractionRange';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { formattingWorldPlazaInteractableFlowerSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableFlowerSelectionKey';
import { usingWorldPlazaTimedInteractionProgress } from '@/components/world/interaction/hooks/usingWorldPlazaTimedInteractionProgress';
import { useCallback, type RefObject } from 'react';

export type { ListingWorldPlazaFlowersInInteractionRangeEntry };

export type UsingWorldPlazaFlowerPickProgressSnapshot =
  DefiningWorldPlazaTimedInteractionProgressSnapshot;

export type UsingWorldPlazaFlowerPickProgressParams = {
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly selectedInteractableBlockKeysRef: RefObject<ReadonlySet<string>>;
  readonly avatarToolActionRef?: RefObject<DefiningWorldPlazaAvatarToolAction | null>;
  readonly onPickComplete: (
    entry: ListingWorldPlazaFlowersInInteractionRangeEntry
  ) => void;
};

export type UsingWorldPlazaFlowerPickProgressResult = {
  readonly snapshot: UsingWorldPlazaFlowerPickProgressSnapshot;
  readonly progressRatioRef: RefObject<number>;
  readonly startingFlowerPick: (
    entry: ListingWorldPlazaFlowersInInteractionRangeEntry
  ) => boolean;
  readonly cancellingFlowerPick: () => void;
};

function checkingWorldPlazaFlowerPickStillInRange(
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

  return distance <= DEFINING_WORLD_PLAZA_FLOWER_PICK_PLAYER_RANGE_TILES;
}

function checkingWorldPlazaFlowerPickStillSelected(
  selectedKeys: ReadonlySet<string>,
  tileX: number,
  tileY: number
): boolean {
  return selectedKeys.has(
    formattingWorldPlazaInteractableFlowerSelectionKey(tileX, tileY)
  );
}

/**
 * Flower pick adapter over the shared timed interaction progress mechanic.
 */
export function usingWorldPlazaFlowerPickProgress({
  playerPositionRef,
  selectedInteractableBlockKeysRef,
  avatarToolActionRef,
  onPickComplete,
}: UsingWorldPlazaFlowerPickProgressParams): UsingWorldPlazaFlowerPickProgressResult {
  const {
    snapshot,
    progressRatioRef,
    startingTimedInteraction,
    cancellingTimedInteraction,
  } =
    usingWorldPlazaTimedInteractionProgress<ListingWorldPlazaFlowersInInteractionRangeEntry>(
      {
        onComplete: onPickComplete,
        ...(avatarToolActionRef ? { avatarToolActionRef } : {}),
      }
    );

  const startingFlowerPick = useCallback(
    (entry: ListingWorldPlazaFlowersInInteractionRangeEntry): boolean => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      if (
        !checkingWorldPlazaFlowerPickStillInRange(
          playerPosition,
          entry.targetCenterX,
          entry.targetCenterY
        )
      ) {
        return false;
      }

      return startingTimedInteraction({
        targetKey: formattingWorldPlazaInteractableFlowerSelectionKey(
          entry.tileX,
          entry.tileY
        ),
        durationMs: computingWorldPlazaFlowerPickDurationMs(),
        context: entry,
        progressIcon:
          DEFINING_WORLD_PLAZA_FLOWER_PICK_TIMED_INTERACTION_PROGRESS_ICON,
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
            checkingWorldPlazaFlowerPickStillInRange(
              currentPlayerPosition,
              entry.targetCenterX,
              entry.targetCenterY
            ) &&
            checkingWorldPlazaFlowerPickStillSelected(
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
    startingFlowerPick,
    cancellingFlowerPick: cancellingTimedInteraction,
  };
}
