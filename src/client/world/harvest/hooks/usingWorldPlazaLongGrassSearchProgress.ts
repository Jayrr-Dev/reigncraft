'use client';

import type { DefiningWorldPlazaAvatarToolAction } from '@/components/world/animation/domains/definingWorldPlazaAvatarToolActionAnimationRegistry';
import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { playingWorldPlazaEquipmentSfx } from '@/components/world/equipment/domains/playingWorldPlazaEquipmentSfx';
import {
  DEFINING_WORLD_PLAZA_LONG_GRASS_SEARCH_DURATION_MS,
  DEFINING_WORLD_PLAZA_LONG_GRASS_SEARCH_PLAYER_RANGE_TILES,
  DEFINING_WORLD_PLAZA_LONG_GRASS_SEARCH_TIMED_INTERACTION_PROGRESS_ICON,
} from '@/components/world/harvest/domains/definingWorldPlazaLongGrassSearchConstants';
import type { ListingWorldPlazaLongGrassInInteractionRangeEntry } from '@/components/world/harvest/domains/listingWorldPlazaLongGrassInInteractionRange';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { formattingWorldPlazaInteractableLongGrassSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableLongGrassSelectionKey';
import { usingWorldPlazaTimedInteractionProgress } from '@/components/world/interaction/hooks/usingWorldPlazaTimedInteractionProgress';
import { useCallback, type RefObject } from 'react';

export type { ListingWorldPlazaLongGrassInInteractionRangeEntry };

export type UsingWorldPlazaLongGrassSearchProgressSnapshot =
  DefiningWorldPlazaTimedInteractionProgressSnapshot;

export type UsingWorldPlazaLongGrassSearchProgressParams = {
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly selectedInteractableBlockKeysRef: RefObject<ReadonlySet<string>>;
  readonly avatarToolActionRef?: RefObject<DefiningWorldPlazaAvatarToolAction | null>;
  readonly onSearchComplete: (
    entry: ListingWorldPlazaLongGrassInInteractionRangeEntry
  ) => void;
};

export type UsingWorldPlazaLongGrassSearchProgressResult = {
  readonly snapshot: UsingWorldPlazaLongGrassSearchProgressSnapshot;
  readonly progressRatioRef: RefObject<number>;
  readonly startingLongGrassSearch: (
    entry: ListingWorldPlazaLongGrassInInteractionRangeEntry
  ) => boolean;
  readonly cancellingLongGrassSearch: () => void;
};

function checkingWorldPlazaLongGrassSearchStillInRange(
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

  return distance <= DEFINING_WORLD_PLAZA_LONG_GRASS_SEARCH_PLAYER_RANGE_TILES;
}

function checkingWorldPlazaLongGrassSearchStillSelected(
  selectedKeys: ReadonlySet<string>,
  tileX: number,
  tileY: number
): boolean {
  return selectedKeys.has(
    formattingWorldPlazaInteractableLongGrassSelectionKey(tileX, tileY)
  );
}

export function usingWorldPlazaLongGrassSearchProgress({
  playerPositionRef,
  selectedInteractableBlockKeysRef,
  avatarToolActionRef,
  onSearchComplete,
}: UsingWorldPlazaLongGrassSearchProgressParams): UsingWorldPlazaLongGrassSearchProgressResult {
  const {
    snapshot,
    progressRatioRef,
    startingTimedInteraction,
    cancellingTimedInteraction,
  } =
    usingWorldPlazaTimedInteractionProgress<ListingWorldPlazaLongGrassInInteractionRangeEntry>(
      {
        onComplete: onSearchComplete,
        ...(avatarToolActionRef ? { avatarToolActionRef } : {}),
      }
    );

  const startingLongGrassSearch = useCallback(
    (entry: ListingWorldPlazaLongGrassInInteractionRangeEntry): boolean => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      if (
        !checkingWorldPlazaLongGrassSearchStillInRange(
          playerPosition,
          entry.targetCenterX,
          entry.targetCenterY
        )
      ) {
        return false;
      }

      return startingTimedInteraction({
        targetKey: formattingWorldPlazaInteractableLongGrassSelectionKey(
          entry.tileX,
          entry.tileY
        ),
        durationMs: DEFINING_WORLD_PLAZA_LONG_GRASS_SEARCH_DURATION_MS,
        context: entry,
        progressIcon:
          DEFINING_WORLD_PLAZA_LONG_GRASS_SEARCH_TIMED_INTERACTION_PROGRESS_ICON,
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
            checkingWorldPlazaLongGrassSearchStillInRange(
              currentPlayerPosition,
              entry.targetCenterX,
              entry.targetCenterY
            ) &&
            checkingWorldPlazaLongGrassSearchStillSelected(
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
    startingLongGrassSearch,
    cancellingLongGrassSearch: cancellingTimedInteraction,
  };
}
