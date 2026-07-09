'use client';

import type { DefiningWorldPlazaAvatarToolAction } from '@/components/world/animation/domains/definingWorldPlazaAvatarToolActionAnimationRegistry';
import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaFishingCastEligibility } from '@/components/world/fishing/domains/checkingWorldPlazaFishingCastEligibility';
import {
  DEFINING_WORLD_PLAZA_FISHING_PLAYER_RANGE_TILES,
  DEFINING_WORLD_PLAZA_FISHING_TIMED_INTERACTION_PROGRESS_ICON,
} from '@/components/world/fishing/domains/definingWorldPlazaFishingConstants';
import { formattingWorldPlazaFishingTileSelectionKey } from '@/components/world/fishing/domains/formattingWorldPlazaFishingTileSelectionKey';
import type { ListingWorldPlazaFishingTilesInInteractionRangeEntry } from '@/components/world/fishing/domains/listingWorldPlazaFishingTilesInInteractionRange';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { usingWorldPlazaTimedInteractionProgress } from '@/components/world/interaction/hooks/usingWorldPlazaTimedInteractionProgress';
import { useCallback, type RefObject } from 'react';

export type UsingWorldPlazaFishingProgressParams = {
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly selectedInteractableBlockKeysRef: RefObject<ReadonlySet<string>>;
  readonly avatarToolActionRef?: RefObject<DefiningWorldPlazaAvatarToolAction | null>;
  readonly resolvingCastDurationMs: (
    entry: ListingWorldPlazaFishingTilesInInteractionRangeEntry
  ) => number;
  readonly onCastComplete: (
    entry: ListingWorldPlazaFishingTilesInInteractionRangeEntry
  ) => void;
};

export type UsingWorldPlazaFishingProgressResult = {
  readonly snapshot: DefiningWorldPlazaTimedInteractionProgressSnapshot;
  readonly progressRatioRef: RefObject<number>;
  readonly startingFishingCast: (
    entry: ListingWorldPlazaFishingTilesInInteractionRangeEntry
  ) => boolean;
};

function checkingWorldPlazaFishingStillInRange(
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

  return distance <= DEFINING_WORLD_PLAZA_FISHING_PLAYER_RANGE_TILES;
}

/**
 * Timed fishing cast adapter over the shared interaction progress mechanic.
 */
export function usingWorldPlazaFishingProgress({
  playerPositionRef,
  selectedInteractableBlockKeysRef,
  avatarToolActionRef,
  resolvingCastDurationMs,
  onCastComplete,
}: UsingWorldPlazaFishingProgressParams): UsingWorldPlazaFishingProgressResult {
  const { snapshot, progressRatioRef, startingTimedInteraction } =
    usingWorldPlazaTimedInteractionProgress({
      onComplete: onCastComplete,
      avatarToolActionRef,
    });

  const startingFishingCast = useCallback(
    (entry: ListingWorldPlazaFishingTilesInInteractionRangeEntry): boolean => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      const eligibility = checkingWorldPlazaFishingCastEligibility(
        playerPosition,
        entry.tileX,
        entry.tileY
      );

      if (!eligibility.isEligible) {
        return false;
      }

      const targetKey = formattingWorldPlazaFishingTileSelectionKey(
        entry.tileX,
        entry.tileY
      );

      return startingTimedInteraction({
        targetKey,
        context: entry,
        durationMs: resolvingCastDurationMs(entry),
        progressIcon:
          DEFINING_WORLD_PLAZA_FISHING_TIMED_INTERACTION_PROGRESS_ICON,
        checkingShouldContinue: () => {
          const livePosition = playerPositionRef.current;

          if (!livePosition) {
            return false;
          }

          if (
            !checkingWorldPlazaFishingStillInRange(
              livePosition,
              entry.tileX,
              entry.tileY
            )
          ) {
            return false;
          }

          return selectedInteractableBlockKeysRef.current.has(targetKey);
        },
        avatarToolAction: {
          toolActionId: 'tree-chop',
          targetGridX: entry.tileX + 0.5,
          targetGridY: entry.tileY + 0.5,
        },
      });
    },
    [
      playerPositionRef,
      resolvingCastDurationMs,
      selectedInteractableBlockKeysRef,
      startingTimedInteraction,
    ]
  );

  return {
    snapshot,
    progressRatioRef,
    startingFishingCast,
  };
}
