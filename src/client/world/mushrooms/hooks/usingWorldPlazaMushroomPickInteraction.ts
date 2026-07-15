'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { recordingWorldPlazaHerbariumMushroomSighted } from '@/components/world/domains/managingWorldPlazaHerbariumDiscoveryStore';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { addingWorldPlazaInventoryItemWithStacking } from '@/components/world/inventory/domains/addingWorldPlazaInventoryItemWithStacking';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { notifyingWorldPlazaInventoryItemAdded } from '@/components/world/inventory/domains/notifyingWorldPlazaInventoryItemAdded';
import { showingWorldPlazaInventoryItemPickupToast } from '@/components/world/inventory/domains/showingWorldPlazaInventoryItemPickupToast';
import { resolvingWorldPlazaMushroomCatalogEntryBySpeciesId } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomRegistry';
import type { ListingWorldPlazaMushroomsInInteractionRangeEntry } from '@/components/world/mushrooms/domains/listingWorldPlazaMushroomsInInteractionRange';
import {
  checkingWorldPlazaMushroomPickEligibility,
  formattingWorldPlazaPickedMushroomTileKey,
  pickingWorldPlazaLocalMushroom,
  type DefiningWorldPlazaPickedMushroomTileState,
} from '@/components/world/mushrooms/domains/managingWorldPlazaLocalPickedMushrooms';
import { checkingWorldPlazaRuntimeMushroomIsPicked } from '@/components/world/mushrooms/domains/registeringWorldPlazaPickedMushroomsLookup';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, type RefObject } from 'react';

export const DEFINING_WORLD_PLAZA_PICKED_MUSHROOMS_QUERY_KEY_ROOT =
  'world-plaza-picked-mushrooms' as const;

export type UsingWorldPlazaMushroomPickInteractionParams = {
  readonly localPersistenceOwnerId: string | null;
  readonly pickedMushroomStateByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedMushroomTileState
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

export type UsingWorldPlazaMushroomPickInteractionResult = {
  readonly validatingMushroomPickStart: (
    entry: ListingWorldPlazaMushroomsInInteractionRangeEntry
  ) => boolean;
  readonly completingMushroomPick: (
    entry: ListingWorldPlazaMushroomsInInteractionRangeEntry
  ) => Promise<void>;
};

function probingWorldPlazaMushroomPickInventoryCapacity(
  inventoryState: DefiningInventoryState,
  itemTypeId: string,
  quantity: number
): boolean {
  if (quantity <= 0) {
    return false;
  }

  const capacityProbe = addingWorldPlazaInventoryItemWithStacking(
    inventoryState,
    {
      id: 'mushroom-pick-capacity-probe',
      itemTypeId,
      quantity,
    },
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
  );

  return capacityProbe.quantityAccepted >= quantity;
}

export function usingWorldPlazaMushroomPickInteraction({
  localPersistenceOwnerId,
  pickedMushroomStateByTileKey,
  playerPositionRef,
  inventoryState,
  updatingInventoryState,
  showingGameplayHudToast,
}: UsingWorldPlazaMushroomPickInteractionParams): UsingWorldPlazaMushroomPickInteractionResult {
  const queryClient = useQueryClient();
  const isCompletionPendingRef = useRef(false);
  const inventoryStateRef = useRef(inventoryState);
  inventoryStateRef.current = inventoryState;
  const persistenceOwnerId = localPersistenceOwnerId;

  const validatingMushroomPickStart = useCallback(
    (entry: ListingWorldPlazaMushroomsInInteractionRangeEntry): boolean => {
      if (!persistenceOwnerId) {
        showingGameplayHudToast(
          'Mushroom picking is unavailable in this session.'
        );
        return false;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      if (checkingWorldPlazaRuntimeMushroomIsPicked(entry.tileX, entry.tileY)) {
        showingGameplayHudToast('This mushroom is already picked.');
        return false;
      }

      const eligibility = checkingWorldPlazaMushroomPickEligibility({
        persistenceOwnerId,
        tileX: entry.tileX,
        tileY: entry.tileY,
        playerX: playerPosition.x,
        playerY: playerPosition.y,
        existingTileState: pickedMushroomStateByTileKey.get(
          formattingWorldPlazaPickedMushroomTileKey(entry.tileX, entry.tileY)
        ),
      });

      if (eligibility.outcome === 'out-of-range') {
        showingGameplayHudToast('Move closer to pick that mushroom.');
        return false;
      }

      if (eligibility.outcome === 'already-picked') {
        showingGameplayHudToast('This mushroom is already picked.');
        return false;
      }

      return true;
    },
    [
      persistenceOwnerId,
      playerPositionRef,
      pickedMushroomStateByTileKey,
      showingGameplayHudToast,
    ]
  );

  const completingMushroomPick = useCallback(
    async (
      entry: ListingWorldPlazaMushroomsInInteractionRangeEntry
    ): Promise<void> => {
      if (!persistenceOwnerId || isCompletionPendingRef.current) {
        return;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      isCompletionPendingRef.current = true;

      try {
        const pickResult = pickingWorldPlazaLocalMushroom(persistenceOwnerId, {
          tileX: entry.tileX,
          tileY: entry.tileY,
          playerX: playerPosition.x,
          playerY: playerPosition.y,
        });

        if (pickResult.outcome !== 'picked') {
          if (pickResult.outcome === 'out-of-range') {
            showingGameplayHudToast('Move closer to pick that mushroom.');
          } else if (pickResult.outcome === 'already-picked') {
            showingGameplayHudToast('This mushroom is already picked.');
          }
          return;
        }

        recordingWorldPlazaHerbariumMushroomSighted(pickResult.speciesId);

        const catalogEntry = resolvingWorldPlazaMushroomCatalogEntryBySpeciesId(
          pickResult.speciesId
        );

        if (
          !probingWorldPlazaMushroomPickInventoryCapacity(
            inventoryStateRef.current,
            catalogEntry.rawItemTypeId,
            pickResult.mushroomQuantity
          )
        ) {
          showingGameplayHudToast('Your bags are full.');
          return;
        }

        let quantityAccepted = 0;

        updatingInventoryState((currentState) => {
          const addResult = addingWorldPlazaInventoryItemWithStacking(
            currentState,
            {
              id: crypto.randomUUID(),
              itemTypeId: catalogEntry.rawItemTypeId,
              quantity: pickResult.mushroomQuantity,
            },
            DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
          );

          quantityAccepted = addResult.quantityAccepted;

          if (addResult.quantityAccepted < pickResult.mushroomQuantity) {
            return null;
          }

          return addResult.state;
        });

        if (quantityAccepted < pickResult.mushroomQuantity) {
          showingGameplayHudToast('Your inventory is full.');
          return;
        }

        notifyingWorldPlazaInventoryItemAdded(quantityAccepted);
        showingWorldPlazaInventoryItemPickupToast({
          itemTypeId: catalogEntry.rawItemTypeId,
          quantity: quantityAccepted,
        });

        await queryClient.invalidateQueries({
          queryKey: [DEFINING_WORLD_PLAZA_PICKED_MUSHROOMS_QUERY_KEY_ROOT],
        });
      } finally {
        isCompletionPendingRef.current = false;
      }
    },
    [
      persistenceOwnerId,
      playerPositionRef,
      updatingInventoryState,
      showingGameplayHudToast,
      queryClient,
    ]
  );

  return {
    validatingMushroomPickStart,
    completingMushroomPick,
  };
}
