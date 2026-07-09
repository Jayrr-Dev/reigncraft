'use client';

import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { usingWorldPlazaTimedInteractionProgress } from '@/components/world/interaction/hooks/usingWorldPlazaTimedInteractionProgress';
import { computingWildlifeCorpseStudyDurationMs } from '@/components/world/wildlife/domains/computingWildlifeCorpseStudyDurationMs';
import {
  DEFINING_WILDLIFE_CORPSE_STUDY_PLAYER_RANGE_GRID,
  DEFINING_WILDLIFE_CORPSE_STUDY_PROGRESS_ICON,
} from '@/components/world/wildlife/domains/definingWildlifeCorpseStudyConstants';
import { formattingWildlifeCorpseStudySelectionKey } from '@/components/world/wildlife/domains/formattingWildlifeCorpseStudySelectionKey';
import type { ListingWildlifeCorpsesInStudyRangeEntry } from '@/components/world/wildlife/domains/listingWildlifeCorpsesInStudyRange';
import {
  gettingWildlifeInstance,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { useCallback, type RefObject } from 'react';

export type UsingWorldPlazaWildlifeCorpseStudyProgressSnapshot =
  DefiningWorldPlazaTimedInteractionProgressSnapshot;

export type UsingWorldPlazaWildlifeCorpseStudyProgressParams = {
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint | null>;
  readonly selectedInteractableBlockKeysRef: RefObject<ReadonlySet<string>>;
  readonly wildlifeStoreRef: RefObject<ManagingWildlifeInstanceStore>;
  readonly onStudyComplete: (
    entry: ListingWildlifeCorpsesInStudyRangeEntry
  ) => void;
};

export type UsingWorldPlazaWildlifeCorpseStudyProgressResult = {
  readonly snapshot: UsingWorldPlazaWildlifeCorpseStudyProgressSnapshot;
  readonly progressRatioRef: RefObject<number>;
  readonly startingCorpseStudy: (
    entry: ListingWildlifeCorpsesInStudyRangeEntry
  ) => boolean;
  readonly cancellingCorpseStudy: () => void;
};

function checkingWildlifeCorpseStudyStillValid(
  store: ManagingWildlifeInstanceStore,
  playerPosition: DefiningWorldPlazaWorldPoint,
  selectedKeys: ReadonlySet<string>,
  entry: ListingWildlifeCorpsesInStudyRangeEntry
): boolean {
  const selectionKey = formattingWildlifeCorpseStudySelectionKey(
    entry.instanceId
  );

  if (!selectedKeys.has(selectionKey)) {
    return false;
  }

  const instance = gettingWildlifeInstance(store, entry.instanceId);

  if (
    !instance ||
    !instance.isDead ||
    instance.hasBeenStudied ||
    instance.diedAtMs === null
  ) {
    return false;
  }

  const distance = computingWorldPlazaGridChebyshevDistance(
    playerPosition.x,
    playerPosition.y,
    instance.position.x,
    instance.position.y
  );

  return distance <= DEFINING_WILDLIFE_CORPSE_STUDY_PLAYER_RANGE_GRID;
}

/**
 * Corpse Study adapter over the shared timed interaction progress mechanic.
 */
export function usingWorldPlazaWildlifeCorpseStudyProgress({
  playerPositionRef,
  selectedInteractableBlockKeysRef,
  wildlifeStoreRef,
  onStudyComplete,
}: UsingWorldPlazaWildlifeCorpseStudyProgressParams): UsingWorldPlazaWildlifeCorpseStudyProgressResult {
  const {
    snapshot,
    progressRatioRef,
    startingTimedInteraction,
    cancellingTimedInteraction,
  } =
    usingWorldPlazaTimedInteractionProgress<ListingWildlifeCorpsesInStudyRangeEntry>(
      {
        onComplete: onStudyComplete,
      }
    );

  const startingCorpseStudy = useCallback(
    (entry: ListingWildlifeCorpsesInStudyRangeEntry): boolean => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      if (
        !checkingWildlifeCorpseStudyStillValid(
          wildlifeStoreRef.current,
          playerPosition,
          selectedInteractableBlockKeysRef.current,
          entry
        )
      ) {
        return false;
      }

      return startingTimedInteraction({
        targetKey: formattingWildlifeCorpseStudySelectionKey(entry.instanceId),
        durationMs: computingWildlifeCorpseStudyDurationMs(entry.massKg),
        context: entry,
        progressIcon: DEFINING_WILDLIFE_CORPSE_STUDY_PROGRESS_ICON,
        checkingShouldContinue: () => {
          const currentPlayerPosition = playerPositionRef.current;

          if (!currentPlayerPosition) {
            return false;
          }

          return checkingWildlifeCorpseStudyStillValid(
            wildlifeStoreRef.current,
            currentPlayerPosition,
            selectedInteractableBlockKeysRef.current,
            entry
          );
        },
      });
    },
    [
      playerPositionRef,
      selectedInteractableBlockKeysRef,
      startingTimedInteraction,
      wildlifeStoreRef,
    ]
  );

  return {
    snapshot,
    progressRatioRef,
    startingCorpseStudy,
    cancellingCorpseStudy: cancellingTimedInteraction,
  };
}
