'use client';

import type { DefiningWorldPlazaAvatarToolAction } from '@/components/world/animation/domains/definingWorldPlazaAvatarToolActionAnimationRegistry';
import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { computingWorldPlazaRockMineDurationMs } from '@/components/world/harvest/domains/computingWorldPlazaRockMineDurationMs';
import { DEFINING_WORLD_PLAZA_ROCK_MINE_PLAYER_RANGE_TILES } from '@/components/world/harvest/domains/definingWorldPlazaRockMineConstants';
import { DEFINING_WORLD_PLAZA_ROCK_MINE_TIMED_INTERACTION_PROGRESS_ICON } from '@/components/world/harvest/domains/definingWorldPlazaRockMineTimedInteractionConstants';
import type { ListingWorldPlazaRocksInInteractionRangeEntry } from '@/components/world/harvest/domains/listingWorldPlazaRocksInInteractionRange';
import { formattingWorldPlazaInteractableRockSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableRockSelectionKey';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { usingWorldPlazaTimedInteractionProgress } from '@/components/world/interaction/hooks/usingWorldPlazaTimedInteractionProgress';
import { useCallback, type RefObject } from 'react';

export type { ListingWorldPlazaRocksInInteractionRangeEntry };

export type UsingWorldPlazaRockMineProgressSnapshot =
  DefiningWorldPlazaTimedInteractionProgressSnapshot;

export type UsingWorldPlazaRockMineProgressParams = {
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly selectedInteractableBlockKeysRef: RefObject<ReadonlySet<string>>;
  /** Shared slot the avatar tick reads to play the mine animation in place. */
  readonly avatarToolActionRef?: RefObject<DefiningWorldPlazaAvatarToolAction | null>;
  readonly resolvingHarvestSpeedMultiplier?: () => number;
  readonly onMineComplete: (
    entry: ListingWorldPlazaRocksInInteractionRangeEntry
  ) => void;
};

export type UsingWorldPlazaRockMineProgressResult = {
  readonly snapshot: UsingWorldPlazaRockMineProgressSnapshot;
  readonly progressRatioRef: RefObject<number>;
  readonly startingRockMine: (
    entry: ListingWorldPlazaRocksInInteractionRangeEntry,
    harvestSpeedMultiplier?: number
  ) => boolean;
  readonly cancellingRockMine: () => void;
};

function checkingWorldPlazaRockMineStillInRange(
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

  return distance <= DEFINING_WORLD_PLAZA_ROCK_MINE_PLAYER_RANGE_TILES;
}

function checkingWorldPlazaRockMineStillSelected(
  selectedKeys: ReadonlySet<string>,
  tileX: number,
  tileY: number
): boolean {
  return selectedKeys.has(
    formattingWorldPlazaInteractableRockSelectionKey(tileX, tileY)
  );
}

/**
 * Rock mining adapter over the shared timed interaction progress mechanic.
 */
export function usingWorldPlazaRockMineProgress({
  playerPositionRef,
  selectedInteractableBlockKeysRef,
  avatarToolActionRef,
  resolvingHarvestSpeedMultiplier,
  onMineComplete,
}: UsingWorldPlazaRockMineProgressParams): UsingWorldPlazaRockMineProgressResult {
  const {
    snapshot,
    progressRatioRef,
    startingTimedInteraction,
    cancellingTimedInteraction,
  } =
    usingWorldPlazaTimedInteractionProgress<ListingWorldPlazaRocksInInteractionRangeEntry>(
      {
        onComplete: onMineComplete,
        ...(avatarToolActionRef ? { avatarToolActionRef } : {}),
      }
    );

  const startingRockMine = useCallback(
    (
      entry: ListingWorldPlazaRocksInInteractionRangeEntry,
      harvestSpeedMultiplier?: number
    ): boolean => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      if (
        !checkingWorldPlazaRockMineStillInRange(
          playerPosition,
          entry.targetCenterX,
          entry.targetCenterY
        )
      ) {
        return false;
      }

      return startingTimedInteraction({
        targetKey: formattingWorldPlazaInteractableRockSelectionKey(
          entry.tileX,
          entry.tileY
        ),
        durationMs: computingWorldPlazaRockMineDurationMs(
          entry.remainingMineableLayers,
          harvestSpeedMultiplier ??
            resolvingHarvestSpeedMultiplier?.() ??
            1
        ),
        context: entry,
        progressIcon:
          DEFINING_WORLD_PLAZA_ROCK_MINE_TIMED_INTERACTION_PROGRESS_ICON,
        avatarToolAction: {
          toolActionId: 'rock-mine',
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
            checkingWorldPlazaRockMineStillInRange(
              currentPlayerPosition,
              entry.targetCenterX,
              entry.targetCenterY
            ) &&
            checkingWorldPlazaRockMineStillSelected(
              selectedKeys,
              entry.tileX,
              entry.tileY
            )
          );
        },
      });
    },
    [
      playerPositionRef,
      selectedInteractableBlockKeysRef,
      resolvingHarvestSpeedMultiplier,
      startingTimedInteraction,
    ]
  );

  return {
    snapshot,
    progressRatioRef,
    startingRockMine,
    cancellingRockMine: cancellingTimedInteraction,
  };
}
