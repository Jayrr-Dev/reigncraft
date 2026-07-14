'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaPickedPebbleTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedPebbles';
import {
  checkingWorldPlazaPebblePickEligibility,
  formattingWorldPlazaPickedPebbleTileKey,
  pickingWorldPlazaLocalPebble,
} from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedPebbles';
import type { ListingWorldPlazaPebblesInInteractionRangeEntry } from '@/components/world/harvest/hooks/usingWorldPlazaPebblePickProgress';
import {
  checkingWorldPlazaPickedPebblesUseLocalPersistence,
  DEFINING_WORLD_PLAZA_PICKED_PEBBLES_QUERY_KEY_ROOT,
} from '@/components/world/harvest/hooks/usingWorldPlazaPickedPebbles';
import { pickingWorldHarvestDevvitPebble } from '@/components/world/harvest/repositories/callingWorldHarvestDevvitApi';
import { addingWorldPlazaInventoryItemWithStacking } from '@/components/world/inventory/domains/addingWorldPlazaInventoryItemWithStacking';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { showingWorldPlazaInventoryItemPickupToast } from '@/components/world/inventory/domains/showingWorldPlazaInventoryItemPickupToast';
import { notifyingWorldPlazaInventoryItemAdded } from '@/components/world/inventory/domains/notifyingWorldPlazaInventoryItemAdded';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, type RefObject } from 'react';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';
import { WORLD_HARVEST_DEVVIT_PICK_PEBBLE_API_PATH } from '../../../../shared/worldHarvestDevvit';
import { WORLD_PEBBLE_PICK_STONE_QUANTITY } from '../../../../shared/worldPebblePick';

export type UsingWorldPlazaPebblePickInteractionParams = {
  readonly localPersistenceOwnerId: string | null;
  readonly redditUserId: string | null;
  readonly saveSlotIndex: PlazaSaveSlotIndex | null;
  readonly pickedPebbleStateByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedPebbleTileState
  >;
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly inventoryState: DefiningInventoryState;
  readonly updatingInventoryState: (
    updater: (
      currentState: DefiningInventoryState
    ) => DefiningInventoryState | null
  ) => void;
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

function probingWorldPlazaPebblePickInventoryCapacity(
  inventoryState: DefiningInventoryState,
  stoneQuantity: number
): boolean {
  if (stoneQuantity <= 0) {
    return false;
  }

  const capacityProbe = addingWorldPlazaInventoryItemWithStacking(
    inventoryState,
    {
      id: 'pebble-pick-capacity-probe',
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
      quantity: stoneQuantity,
    },
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
  );

  return capacityProbe.quantityAccepted >= stoneQuantity;
}

/**
 * Validates and completes pebble picks after the progress indicator finishes.
 * Stone goes straight into inventory; pick fails when the bag cannot hold it.
 */
export function usingWorldPlazaPebblePickInteraction({
  localPersistenceOwnerId,
  redditUserId,
  saveSlotIndex,
  pickedPebbleStateByTileKey,
  playerPositionRef,
  inventoryState,
  updatingInventoryState,
  showingGameplayHudToast,
}: UsingWorldPlazaPebblePickInteractionParams): UsingWorldPlazaPebblePickInteractionResult {
  const queryClient = useQueryClient();
  const isCompletionPendingRef = useRef(false);
  const inventoryStateRef = useRef(inventoryState);
  inventoryStateRef.current = inventoryState;
  const useLocalPersistence =
    checkingWorldPlazaPickedPebblesUseLocalPersistence(
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

      if (
        !probingWorldPlazaPebblePickInventoryCapacity(
          inventoryStateRef.current,
          WORLD_PEBBLE_PICK_STONE_QUANTITY
        )
      ) {
        showingGameplayHudToast('Your inventory is full.');
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
        const stoneQuantity = WORLD_PEBBLE_PICK_STONE_QUANTITY;

        if (
          !probingWorldPlazaPebblePickInventoryCapacity(
            inventoryStateRef.current,
            stoneQuantity
          )
        ) {
          showingGameplayHudToast('Your inventory is full.');
          return;
        }

        let quantityAccepted = 0;

        updatingInventoryState((currentState) => {
          const addResult = addingWorldPlazaInventoryItemWithStacking(
            currentState,
            {
              id: crypto.randomUUID(),
              itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
              quantity: stoneQuantity,
            },
            DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
          );

          quantityAccepted = addResult.quantityAccepted;

          if (addResult.quantityAccepted < stoneQuantity) {
            return null;
          }

          return addResult.state;
        });

        if (quantityAccepted < stoneQuantity) {
          showingGameplayHudToast('Your inventory is full.');
          return;
        }

        notifyingWorldPlazaInventoryItemAdded(quantityAccepted);
        showingWorldPlazaInventoryItemPickupToast({
          itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
          quantity: quantityAccepted,
        });

        const pickRequest = {
          tileX: entry.tileX,
          tileY: entry.tileY,
          playerX: playerPosition.x,
          playerY: playerPosition.y,
        };

        const pickResult =
          useLocalPersistence && localPersistenceOwnerId
            ? pickingWorldPlazaLocalPebble(localPersistenceOwnerId, pickRequest)
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
      saveSlotIndex,
      showingGameplayHudToast,
      updatingInventoryState,
      useLocalPersistence,
    ]
  );

  return {
    validatingPebblePickStart,
    completingPebblePick,
  };
}
