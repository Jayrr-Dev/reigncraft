'use client';

import type { DefiningWorldPlazaAvatarToolAction } from '@/components/world/animation/domains/definingWorldPlazaAvatarToolActionAnimationRegistry';
import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WORLD_PLAZA_FARMING_HARVEST_BASE_DURATION_MS,
  DEFINING_WORLD_PLAZA_FARMING_HARVEST_PROGRESS_ICON,
  DEFINING_WORLD_PLAZA_FARMING_PLANT_BASE_DURATION_MS,
  DEFINING_WORLD_PLAZA_FARMING_PLANT_PROGRESS_ICON,
  DEFINING_WORLD_PLAZA_FARMING_PLAYER_RANGE_TILES,
  DEFINING_WORLD_PLAZA_FARMING_TILL_BASE_DURATION_MS,
  DEFINING_WORLD_PLAZA_FARMING_TILL_PROGRESS_ICON,
} from '@/components/world/farming/domains/definingWorldPlazaFarmingConstants';
import { formattingWorldPlazaFarmlandTileSelectionKey } from '@/components/world/farming/domains/formattingWorldPlazaFarmlandTileSelectionKey';
import type { ListingWorldPlazaFarmlandTilesInInteractionRangeEntry } from '@/components/world/farming/domains/listingWorldPlazaFarmlandTilesInInteractionRange';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { usingWorldPlazaTimedInteractionProgress } from '@/components/world/interaction/hooks/usingWorldPlazaTimedInteractionProgress';
import { useCallback, type RefObject } from 'react';

export type UsingWorldPlazaFarmingProgressParams = {
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly selectedInteractableBlockKeysRef: RefObject<ReadonlySet<string>>;
  readonly avatarToolActionRef?: RefObject<DefiningWorldPlazaAvatarToolAction | null>;
  readonly resolvingHarvestSpeedMultiplier?: () => number;
  readonly onActionComplete: (
    entry: ListingWorldPlazaFarmlandTilesInInteractionRangeEntry
  ) => void;
};

function resolvingFarmingActionDurationMs(
  entry: ListingWorldPlazaFarmlandTilesInInteractionRangeEntry,
  harvestSpeedMultiplier: number
): number {
  const baseDurationMs =
    entry.interactionKind === 'till'
      ? DEFINING_WORLD_PLAZA_FARMING_TILL_BASE_DURATION_MS
      : entry.interactionKind === 'plant'
        ? DEFINING_WORLD_PLAZA_FARMING_PLANT_BASE_DURATION_MS
        : DEFINING_WORLD_PLAZA_FARMING_HARVEST_BASE_DURATION_MS;
  const resolvedSpeed = Math.max(0.25, harvestSpeedMultiplier);

  return Math.round(baseDurationMs / resolvedSpeed);
}

function resolvingFarmingActionProgressIcon(
  entry: ListingWorldPlazaFarmlandTilesInInteractionRangeEntry
): string {
  if (entry.interactionKind === 'till') {
    return DEFINING_WORLD_PLAZA_FARMING_TILL_PROGRESS_ICON;
  }

  if (entry.interactionKind === 'plant') {
    return DEFINING_WORLD_PLAZA_FARMING_PLANT_PROGRESS_ICON;
  }

  return DEFINING_WORLD_PLAZA_FARMING_HARVEST_PROGRESS_ICON;
}

/**
 * Timed farming action adapter (till, plant, harvest).
 */
export function usingWorldPlazaFarmingProgress({
  playerPositionRef,
  selectedInteractableBlockKeysRef,
  avatarToolActionRef,
  resolvingHarvestSpeedMultiplier,
  onActionComplete,
}: UsingWorldPlazaFarmingProgressParams) {
  const { snapshot, progressRatioRef, startingTimedInteraction } =
    usingWorldPlazaTimedInteractionProgress({
      onComplete: onActionComplete,
      avatarToolActionRef,
    });

  const startingFarmingAction = useCallback(
    (entry: ListingWorldPlazaFarmlandTilesInInteractionRangeEntry): boolean => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      const targetKey = formattingWorldPlazaFarmlandTileSelectionKey(
        entry.tileX,
        entry.tileY,
        entry.interactionKind
      );
      const harvestSpeedMultiplier = resolvingHarvestSpeedMultiplier?.() ?? 1;

      return startingTimedInteraction({
        targetKey,
        context: entry,
        durationMs: resolvingFarmingActionDurationMs(
          entry,
          harvestSpeedMultiplier
        ),
        progressIcon: resolvingFarmingActionProgressIcon(entry),
        checkingShouldContinue: () => {
          const livePosition = playerPositionRef.current;

          if (!livePosition) {
            return false;
          }

          const distance = computingWorldPlazaGridChebyshevDistance(
            livePosition.x,
            livePosition.y,
            entry.tileX + 0.5,
            entry.tileY + 0.5
          );

          if (distance > DEFINING_WORLD_PLAZA_FARMING_PLAYER_RANGE_TILES) {
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
      resolvingHarvestSpeedMultiplier,
      selectedInteractableBlockKeysRef,
      startingTimedInteraction,
    ]
  );

  return {
    snapshot: snapshot as DefiningWorldPlazaTimedInteractionProgressSnapshot,
    progressRatioRef,
    startingFarmingAction,
  };
}
