'use client';

import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { droppingWorldPlazaPebblePickStoneGroundItem } from '@/components/world/harvest/domains/droppingWorldPlazaPebblePickStoneGroundItem';
import type { DefiningWorldPlazaPickedPebbleTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedPebbles';
import {
  checkingWorldPlazaPebblePickEligibility,
  formattingWorldPlazaPickedPebbleTileKey,
  pickingWorldPlazaLocalPebble,
} from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedPebbles';
import {
  checkingWorldPlazaPickedPebblesUseLocalPersistence,
  DEFINING_WORLD_PLAZA_PICKED_PEBBLES_QUERY_KEY_ROOT,
} from '@/components/world/harvest/hooks/usingWorldPlazaPickedPebbles';
import type { ListingWorldPlazaPebblesInInteractionRangeEntry } from '@/components/world/harvest/hooks/usingWorldPlazaPebblePickProgress';
import { pickingWorldHarvestDevvitPebble } from '@/components/world/harvest/repositories/callingWorldHarvestDevvitApi';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, type RefObject } from 'react';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';
import { WORLD_HARVEST_DEVVIT_PICK_PEBBLE_API_PATH } from '../../../../shared/worldHarvestDevvit';

export type UsingWorldPlazaPebblePickInteractionParams = {
  readonly localPersistenceOwnerId: string | null;
  readonly redditUserId: string | null;
  readonly saveSlotIndex: PlazaSaveSlotIndex | null;
  readonly pickedPebbleStateByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedPebbleTileState
  >;
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly showingGameplayHudToast: (message: string) => void;
};

export type UsingWorldPlazaPebblePickInteractionResult = {
  readonly validatingPebblePickStart: (
    entry: ListingWorldPlazaPebblesInInteractionRangeEntry
  ) => boolean;
  readonly completingPebblePick: (
    entry: ListingWorldPlazaPebblesInInteractionRangeEntry
  ) => Promise<void>;
};

/**
 * Validates and completes pebble picks after the progress indicator finishes.
 */
export function usingWorldPlazaPebblePickInteraction({
  localPersistenceOwnerId,
  redditUserId,
  saveSlotIndex,
  pickedPebbleStateByTileKey,
  playerPositionRef,
  showingGameplayHudToast,
}: UsingWorldPlazaPebblePickInteractionParams): UsingWorldPlazaPebblePickInteractionResult {
  const queryClient = useQueryClient();
  const isCompletionPendingRef = useRef(false);
  const useLocalPersistence = checkingWorldPlazaPickedPebblesUseLocalPersistence(
    localPersistenceOwnerId,
    redditUserId
  );
  const persistenceOwnerId = useLocalPersistence
    ? localPersistenceOwnerId
    : redditUserId;

  const validatingPebblePickStart = useCallback(
    (entry: ListingWorldPlazaPebblesInInteractionRangeEntry): boolean => {
      if (!persistenceOwnerId) {
        showingGameplayHudToast(
          'Pebble picking is unavailable in this session.'
        );
        return false;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      const tileKey = formattingWorldPlazaPickedPebbleTileKey(
        entry.tileX,
        entry.tileY
      );

      const rangeCheck = checkingWorldPlazaPebblePickEligibility({
        persistenceOwnerId,
        tileX: entry.tileX,
        tileY: entry.tileY,
        playerX: playerPosition.x,
        playerY: playerPosition.y,
        existingTileState: pickedPebbleStateByTileKey.get(tileKey),
      });

      if (rangeCheck.outcome === 'out-of-range') {
        showingGameplayHudToast('Move closer to pick this pebble.');
        return false;
      }

      if (rangeCheck.outcome === 'already-picked') {
        showingGameplayHudToast('This pebble is already picked.');
        return false;
      }

      return true;
    },
    [
      pickedPebbleStateByTileKey,
      persistenceOwnerId,
      playerPositionRef,
      showingGameplayHudToast,
    ]
  );

  const completingPebblePick = useCallback(
    async (
      entry: ListingWorldPlazaPebblesInInteractionRangeEntry
    ): Promise<void> => {
      if (isCompletionPendingRef.current || !persistenceOwnerId) {
        return;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      isCompletionPendingRef.current = true;

      try {
        const pickRequest = {
          tileX: entry.tileX,
          tileY: entry.tileY,
          playerX: playerPosition.x,
          playerY: playerPosition.y,
        };

        const pickResult =
          useLocalPersistence && localPersistenceOwnerId
            ? pickingWorldPlazaLocalPebble(
                localPersistenceOwnerId,
                pickRequest
              )
            : await pickingWorldHarvestDevvitPebble(
                WORLD_HARVEST_DEVVIT_PICK_PEBBLE_API_PATH,
                {
                  ...pickRequest,
                  saveSlotIndex,
                }
              );

        if (pickResult.outcome !== 'picked') {
          if (pickResult.outcome === 'out-of-range') {
            showingGameplayHudToast('Move closer to pick this pebble.');
          } else if (pickResult.outcome === 'already-picked') {
            showingGameplayHudToast('This pebble is already picked.');
          }

          return;
        }

        const dropResult = await droppingWorldPlazaPebblePickStoneGroundItem({
          localPersistenceOwnerId,
          redditUserId,
          saveSlotIndex,
          tileX: entry.tileX,
          tileY: entry.tileY,
          layer: DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
          stoneQuantity: pickResult.stoneQuantity ?? 0,
          playerPosition,
        });

        if (dropResult.outcome === 'failed') {
          showingGameplayHudToast('Could not drop stone from this pebble.');
        }

        void queryClient.invalidateQueries({
          queryKey: [DEFINING_WORLD_PLAZA_PICKED_PEBBLES_QUERY_KEY_ROOT],
        });
      } finally {
        isCompletionPendingRef.current = false;
      }
    },
    [
      localPersistenceOwnerId,
      persistenceOwnerId,
      playerPositionRef,
      queryClient,
      redditUserId,
      saveSlotIndex,
      showingGameplayHudToast,
      useLocalPersistence,
    ]
  );

  return {
    validatingPebblePickStart,
    completingPebblePick,
  };
}
