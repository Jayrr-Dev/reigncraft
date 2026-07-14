/**
 * Opens a closed world chest: validates range, grants loot, persists opened.
 *
 * @module components/world/chest/hooks/usingWorldPlazaChestOpenInteraction
 */

'use client';

import {
  DEFINING_WORLD_PLAZA_CHEST_INTERACT_REACH_GRID,
} from '@/components/world/chest/domains/definingWorldPlazaChestConstants';
import type { ListingWorldPlazaChestsInInteractionRangeEntry } from '@/components/world/chest/domains/listingWorldPlazaChestsInInteractionRange';
import {
  gettingWorldPlazaChestInstance,
  openingWorldPlazaChest,
} from '@/components/world/chest/domains/managingWorldPlazaChestInstanceStore';
import { openingWorldPlazaLocalChest } from '@/components/world/chest/domains/managingWorldPlazaLocalOpenedChests';
import { resolvingWorldPlazaChestLootGrant } from '@/components/world/chest/domains/resolvingWorldPlazaChestLootGrant';
import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { addingWorldPlazaInventoryItemWithStacking } from '@/components/world/inventory/domains/addingWorldPlazaInventoryItemWithStacking';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { showingWorldPlazaInventoryItemPickupToast } from '@/components/world/inventory/domains/showingWorldPlazaInventoryItemPickupToast';
import { notifyingWorldPlazaInventoryItemAdded } from '@/components/world/inventory/domains/notifyingWorldPlazaInventoryItemAdded';
import { useCallback, useRef } from 'react';

export type UsingWorldPlazaChestOpenInteractionParams = {
  readonly localPersistenceOwnerId: string | null;
  readonly playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  readonly inventoryState: DefiningInventoryState;
  readonly updatingInventoryState: (
    updater: (
      currentState: DefiningInventoryState
    ) => DefiningInventoryState | null
  ) => void;
  readonly showingGameplayHudToast: (message: string) => void;
};

export type UsingWorldPlazaChestOpenInteractionResult = {
  readonly openingChest: (
    entry: ListingWorldPlazaChestsInInteractionRangeEntry
  ) => void;
};

function probingWorldPlazaChestInventoryCapacity(
  inventoryState: DefiningInventoryState,
  grants: readonly { readonly itemTypeId: string; readonly quantity: number }[]
): boolean {
  let probeState = inventoryState;

  for (const grant of grants) {
    if (grant.quantity <= 0) {
      continue;
    }

    const capacityProbe = addingWorldPlazaInventoryItemWithStacking(
      probeState,
      {
        id: 'chest-open-capacity-probe',
        itemTypeId: grant.itemTypeId,
        quantity: grant.quantity,
      },
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
    );

    if (capacityProbe.quantityAccepted < grant.quantity) {
      return false;
    }

    probeState = capacityProbe.state;
  }

  return true;
}

/**
 * Validates range / capacity and opens a closed chest once.
 */
export function usingWorldPlazaChestOpenInteraction({
  localPersistenceOwnerId,
  playerPositionRef,
  inventoryState,
  updatingInventoryState,
  showingGameplayHudToast,
}: UsingWorldPlazaChestOpenInteractionParams): UsingWorldPlazaChestOpenInteractionResult {
  const isCompletionPendingRef = useRef(false);
  const inventoryStateRef = useRef(inventoryState);
  inventoryStateRef.current = inventoryState;
  const persistenceOwnerId = localPersistenceOwnerId;

  const openingChest = useCallback(
    (entry: ListingWorldPlazaChestsInInteractionRangeEntry): void => {
      if (entry.isDisabled || entry.action !== 'open') {
        return;
      }

      if (isCompletionPendingRef.current || !persistenceOwnerId) {
        if (!persistenceOwnerId) {
          showingGameplayHudToast(
            'Chests are unavailable in this session.'
          );
        }
        return;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      const instance = gettingWorldPlazaChestInstance(entry.chestId);

      if (!instance || instance.state !== 'closed') {
        return;
      }

      const dx = instance.position.x - playerPosition.x;
      const dy = instance.position.y - playerPosition.y;
      const reach = DEFINING_WORLD_PLAZA_CHEST_INTERACT_REACH_GRID;

      if (dx * dx + dy * dy > reach * reach) {
        showingGameplayHudToast('Move closer to open this chest.');
        return;
      }

      const grants = resolvingWorldPlazaChestLootGrant(
        instance.loot,
        instance.chestId
      );

      if (
        grants.length > 0 &&
        !probingWorldPlazaChestInventoryCapacity(
          inventoryStateRef.current,
          grants
        )
      ) {
        showingGameplayHudToast('Your inventory is full.');
        return;
      }

      isCompletionPendingRef.current = true;

      try {
        for (const grant of grants) {
          let quantityAccepted = 0;

          updatingInventoryState((currentState) => {
            const addResult = addingWorldPlazaInventoryItemWithStacking(
              currentState,
              {
                id: crypto.randomUUID(),
                itemTypeId: grant.itemTypeId,
                quantity: grant.quantity,
              },
              DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
            );

            quantityAccepted = addResult.quantityAccepted;

            if (addResult.quantityAccepted < grant.quantity) {
              return null;
            }

            return addResult.state;
          });

          if (quantityAccepted < grant.quantity) {
            showingGameplayHudToast('Your inventory is full.');
            return;
          }

          notifyingWorldPlazaInventoryItemAdded(quantityAccepted);
          showingWorldPlazaInventoryItemPickupToast({
            itemTypeId: grant.itemTypeId,
            quantity: quantityAccepted,
          });
        }

        const opened = openingWorldPlazaChest(entry.chestId);

        if (!opened) {
          return;
        }

        openingWorldPlazaLocalChest(persistenceOwnerId, entry.chestId);
      } finally {
        isCompletionPendingRef.current = false;
      }
    },
    [
      persistenceOwnerId,
      playerPositionRef,
      showingGameplayHudToast,
      updatingInventoryState,
    ]
  );

  return { openingChest };
}
