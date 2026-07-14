/**
 * Pick up handler for world caltrops.
 *
 * @module components/world/trap/hooks/usingWorldPlazaCaltropInteraction
 */

'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { addingWorldPlazaInventoryItemWithStacking } from '@/components/world/inventory/domains/addingWorldPlazaInventoryItemWithStacking';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CALTROPS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { formattingWorldPlazaInventoryItemPickupToastMessage } from '@/components/world/inventory/domains/formattingWorldPlazaInventoryItemPickupToastMessage';
import { notifyingWorldPlazaInventoryItemAdded } from '@/components/world/inventory/domains/notifyingWorldPlazaInventoryItemAdded';
import { DEFINING_WORLD_PLAZA_CALTROP_INTERACT_REACH_GRID } from '@/components/world/trap/domains/definingWorldPlazaCaltropConstants';
import type { ListingWorldPlazaCaltropsInInteractionRangeAction } from '@/components/world/trap/domains/listingWorldPlazaCaltropsInInteractionRange';
import type { ListingWorldPlazaCaltropsInInteractionRangeEntry } from '@/components/world/trap/domains/listingWorldPlazaCaltropsInInteractionRange';
import {
  gettingWorldPlazaCaltropInstance,
  removingWorldPlazaCaltrop,
} from '@/components/world/trap/domains/managingWorldPlazaCaltropInstanceStore';
import { persistingWorldPlazaLocalCaltrops } from '@/components/world/trap/domains/managingWorldPlazaLocalCaltrops';
import { useCallback, useRef } from 'react';

export type UsingWorldPlazaCaltropInteractionParams = {
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

export type UsingWorldPlazaCaltropInteractionResult = {
  readonly handlingCaltropAction: (
    entry: ListingWorldPlazaCaltropsInInteractionRangeEntry,
    action: ListingWorldPlazaCaltropsInInteractionRangeAction
  ) => void;
};

/**
 * Validates range and applies Pick up on a caltrop.
 */
export function usingWorldPlazaCaltropInteraction({
  localPersistenceOwnerId,
  playerPositionRef,
  inventoryState,
  updatingInventoryState,
  showingGameplayHudToast,
}: UsingWorldPlazaCaltropInteractionParams): UsingWorldPlazaCaltropInteractionResult {
  const inventoryStateRef = useRef(inventoryState);
  inventoryStateRef.current = inventoryState;

  const handlingCaltropAction = useCallback(
    (
      entry: ListingWorldPlazaCaltropsInInteractionRangeEntry,
      action: ListingWorldPlazaCaltropsInInteractionRangeAction
    ): void => {
      if (!entry.actions.includes(action) || action !== 'pick-up') {
        return;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      const instance = gettingWorldPlazaCaltropInstance(entry.trapId);

      if (!instance) {
        return;
      }

      const dx = instance.position.x - playerPosition.x;
      const dy = instance.position.y - playerPosition.y;
      const reach = DEFINING_WORLD_PLAZA_CALTROP_INTERACT_REACH_GRID;

      if (dx * dx + dy * dy > reach * reach) {
        showingGameplayHudToast('Move closer to the caltrops.');
        return;
      }

      const capacityProbe = addingWorldPlazaInventoryItemWithStacking(
        inventoryStateRef.current,
        {
          id: `caltrop-pickup-${entry.trapId}`,
          itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CALTROPS,
          quantity: 1,
        },
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
      );

      if (capacityProbe.quantityAccepted < 1) {
        showingGameplayHudToast('Inventory is full.');
        return;
      }

      updatingInventoryState(() => capacityProbe.state);
      notifyingWorldPlazaInventoryItemAdded(capacityProbe.quantityAccepted);
      removingWorldPlazaCaltrop(entry.trapId);

      if (localPersistenceOwnerId) {
        persistingWorldPlazaLocalCaltrops(localPersistenceOwnerId);
      }

      showingGameplayHudToast(
        formattingWorldPlazaInventoryItemPickupToastMessage({
          itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CALTROPS,
          quantity: 1,
        })
      );
    },
    [
      localPersistenceOwnerId,
      playerPositionRef,
      showingGameplayHudToast,
      updatingInventoryState,
    ]
  );

  return { handlingCaltropAction };
}
