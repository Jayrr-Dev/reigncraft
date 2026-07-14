/**
 * Arm / Disarm / Pick up handlers for world bear traps (state-gated).
 *
 * @module components/world/trap/hooks/usingWorldPlazaBearTrapInteraction
 */

'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { addingWorldPlazaInventoryItemWithStacking } from '@/components/world/inventory/domains/addingWorldPlazaInventoryItemWithStacking';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BEAR_TRAP } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { showingWorldPlazaInventoryItemPickupToast } from '@/components/world/inventory/domains/showingWorldPlazaInventoryItemPickupToast';
import { notifyingWorldPlazaInventoryItemAdded } from '@/components/world/inventory/domains/notifyingWorldPlazaInventoryItemAdded';
import { DEFINING_WORLD_PLAZA_BEAR_TRAP_INTERACT_REACH_GRID } from '@/components/world/trap/domains/definingWorldPlazaBearTrapConstants';
import type { ListingWorldPlazaBearTrapsInInteractionRangeAction } from '@/components/world/trap/domains/listingWorldPlazaBearTrapsInInteractionRange';
import type { ListingWorldPlazaBearTrapsInInteractionRangeEntry } from '@/components/world/trap/domains/listingWorldPlazaBearTrapsInInteractionRange';
import {
  armingWorldPlazaBearTrap,
  disarmingWorldPlazaBearTrap,
  gettingWorldPlazaBearTrapInstance,
  removingWorldPlazaBearTrap,
} from '@/components/world/trap/domains/managingWorldPlazaBearTrapInstanceStore';
import { persistingWorldPlazaLocalBearTraps } from '@/components/world/trap/domains/managingWorldPlazaLocalBearTraps';
import { useCallback, useRef } from 'react';

export type UsingWorldPlazaBearTrapInteractionParams = {
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

export type UsingWorldPlazaBearTrapInteractionResult = {
  readonly handlingBearTrapAction: (
    entry: ListingWorldPlazaBearTrapsInInteractionRangeEntry,
    action: ListingWorldPlazaBearTrapsInInteractionRangeAction
  ) => void;
};

/**
 * Validates range and applies state-gated Arm / Disarm / Pick up.
 */
export function usingWorldPlazaBearTrapInteraction({
  localPersistenceOwnerId,
  playerPositionRef,
  inventoryState,
  updatingInventoryState,
  showingGameplayHudToast,
}: UsingWorldPlazaBearTrapInteractionParams): UsingWorldPlazaBearTrapInteractionResult {
  const inventoryStateRef = useRef(inventoryState);
  inventoryStateRef.current = inventoryState;

  const handlingBearTrapAction = useCallback(
    (
      entry: ListingWorldPlazaBearTrapsInInteractionRangeEntry,
      action: ListingWorldPlazaBearTrapsInInteractionRangeAction
    ): void => {
      if (!entry.actions.includes(action)) {
        return;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      const instance = gettingWorldPlazaBearTrapInstance(entry.trapId);

      if (!instance) {
        return;
      }

      if (action === 'arm' && instance.state === 'armed') {
        return;
      }

      if (action === 'disarm' && instance.state !== 'armed') {
        return;
      }

      const dx = instance.position.x - playerPosition.x;
      const dy = instance.position.y - playerPosition.y;
      const reach = DEFINING_WORLD_PLAZA_BEAR_TRAP_INTERACT_REACH_GRID;

      if (dx * dx + dy * dy > reach * reach) {
        showingGameplayHudToast('Move closer to the trap.');
        return;
      }

      if (action === 'arm') {
        armingWorldPlazaBearTrap(entry.trapId);

        if (localPersistenceOwnerId) {
          persistingWorldPlazaLocalBearTraps(localPersistenceOwnerId);
        }

        showingGameplayHudToast('Trap armed.');
        return;
      }

      if (action === 'disarm') {
        disarmingWorldPlazaBearTrap(entry.trapId);

        if (localPersistenceOwnerId) {
          persistingWorldPlazaLocalBearTraps(localPersistenceOwnerId);
        }

        showingGameplayHudToast('Trap disarmed.');
        return;
      }

      const capacityProbe = addingWorldPlazaInventoryItemWithStacking(
        inventoryStateRef.current,
        {
          id: `bear-trap-pickup-${entry.trapId}`,
          itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BEAR_TRAP,
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
      removingWorldPlazaBearTrap(entry.trapId);

      if (localPersistenceOwnerId) {
        persistingWorldPlazaLocalBearTraps(localPersistenceOwnerId);
      }

      showingWorldPlazaInventoryItemPickupToast({
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BEAR_TRAP,
        quantity: 1,
      });
    },
    [
      localPersistenceOwnerId,
      playerPositionRef,
      showingGameplayHudToast,
      updatingInventoryState,
    ]
  );

  return { handlingBearTrapAction };
}
