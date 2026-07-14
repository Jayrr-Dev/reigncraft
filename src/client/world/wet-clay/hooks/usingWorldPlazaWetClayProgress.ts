'use client';

import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { usingWorldPlazaTimedInteractionProgress } from '@/components/world/interaction/hooks/usingWorldPlazaTimedInteractionProgress';
import { checkingWorldPlazaWetClayEligibility } from '@/components/world/wet-clay/domains/checkingWorldPlazaWetClayEligibility';
import { computingWorldPlazaWetClayDurationMs } from '@/components/world/wet-clay/domains/computingWorldPlazaWetClayDurationMs';
import {
  DEFINING_WORLD_PLAZA_WET_CLAY_PLAYER_RANGE_TILES,
  DEFINING_WORLD_PLAZA_WET_CLAY_TIMED_INTERACTION_PROGRESS_ICON,
} from '@/components/world/wet-clay/domains/definingWorldPlazaWetClayConstants';
import { formattingWorldPlazaWetClayTileSelectionKey } from '@/components/world/wet-clay/domains/formattingWorldPlazaWetClayTileSelectionKey';
import type { ListingWorldPlazaWetClayTilesInInteractionRangeEntry } from '@/components/world/wet-clay/domains/listingWorldPlazaWetClayTilesInInteractionRange';
import { useCallback, type RefObject } from 'react';

export type UsingWorldPlazaWetClayProgressParams = {
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly selectedInteractableBlockKeysRef: RefObject<ReadonlySet<string>>;
  readonly onWetComplete: (
    entry: ListingWorldPlazaWetClayTilesInInteractionRangeEntry
  ) => void;
};

export type UsingWorldPlazaWetClayProgressResult = {
  readonly snapshot: DefiningWorldPlazaTimedInteractionProgressSnapshot;
  readonly progressRatioRef: RefObject<number>;
  readonly startingWetClay: (
    entry: ListingWorldPlazaWetClayTilesInInteractionRangeEntry
  ) => boolean;
};

function checkingWorldPlazaWetClayStillInRange(
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

  return distance <= DEFINING_WORLD_PLAZA_WET_CLAY_PLAYER_RANGE_TILES;
}

/**
 * Timed wet-clay adapter over the shared interaction progress mechanic.
 */
export function usingWorldPlazaWetClayProgress({
  playerPositionRef,
  selectedInteractableBlockKeysRef,
  onWetComplete,
}: UsingWorldPlazaWetClayProgressParams): UsingWorldPlazaWetClayProgressResult {
  const { snapshot, progressRatioRef, startingTimedInteraction } =
    usingWorldPlazaTimedInteractionProgress({
      onComplete: onWetComplete,
    });

  const startingWetClay = useCallback(
    (entry: ListingWorldPlazaWetClayTilesInInteractionRangeEntry): boolean => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      const eligibility = checkingWorldPlazaWetClayEligibility(
        playerPosition,
        entry.tileX,
        entry.tileY
      );

      if (!eligibility.isEligible) {
        return false;
      }

      const targetKey = formattingWorldPlazaWetClayTileSelectionKey(
        entry.tileX,
        entry.tileY
      );

      return startingTimedInteraction({
        targetKey,
        context: entry,
        durationMs: computingWorldPlazaWetClayDurationMs(),
        progressIcon:
          DEFINING_WORLD_PLAZA_WET_CLAY_TIMED_INTERACTION_PROGRESS_ICON,
        checkingShouldContinue: () => {
          const livePosition = playerPositionRef.current;

          if (!livePosition) {
            return false;
          }

          if (
            !checkingWorldPlazaWetClayStillInRange(
              livePosition,
              entry.tileX,
              entry.tileY
            )
          ) {
            return false;
          }

          return selectedInteractableBlockKeysRef.current.has(targetKey);
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
    startingWetClay,
  };
}
