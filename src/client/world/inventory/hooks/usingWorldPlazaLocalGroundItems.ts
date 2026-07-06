'use client';

import { checkingWorldPlazaGroundItemIsLegacyDemoSeed } from '@/components/world/inventory/domains/checkingWorldPlazaGroundItemIsLegacyDemoSeed';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import {
  listingWorldPlazaLocalGroundItems,
  pickingUpWorldPlazaLocalGroundItem,
} from '@/components/world/inventory/domains/managingWorldPlazaLocalGroundItems';
import { useCallback, useEffect, useRef, useState } from 'react';
import { WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_POLL_INTERVAL_MS } from '../../../../shared/worldInventoryDevvit';

/** Params for {@link usingWorldPlazaLocalGroundItems}. */
export type UsingWorldPlazaLocalGroundItemsParams = {
  readonly enabled: boolean;
  readonly persistenceOwnerId: string;
  readonly onPickupGranted: (grant: {
    groundItemId: string;
    itemTypeId: string;
    quantity: number;
  }) => void;
};

/** Return shape for {@link usingWorldPlazaLocalGroundItems}. */
export type UsingWorldPlazaLocalGroundItemsResult = {
  readonly items: readonly DefiningWorldPlazaGroundItem[];
  readonly isReady: boolean;
  readonly sendingGroundPickup: (
    groundItemId: string,
    requestedQuantity: number,
    playerX: number,
    playerY: number
  ) => Promise<void>;
};

let optimisticLocalGroundItemInserter:
  | ((groundItem: DefiningWorldPlazaGroundItem) => void)
  | null = null;

let optimisticLocalGroundItemReducer:
  | ((groundItemId: string, quantity: number) => void)
  | null = null;

/**
 * Inserts a newly dropped local ground item into the active client list immediately.
 *
 * @param groundItem - Optimistic ground item row from a successful local drop.
 */
export function insertingWorldPlazaLocalGroundItemOptimistically(
  groundItem: DefiningWorldPlazaGroundItem
): void {
  optimisticLocalGroundItemInserter?.(groundItem);
}

/** Decrements a local ground stack in the active client list immediately. */
export function reducingWorldPlazaLocalGroundItemQuantityOptimistically(
  groundItemId: string,
  quantity = 1
): void {
  optimisticLocalGroundItemReducer?.(groundItemId, quantity);
}

/**
 * Loads and mutates offline single-player ground items from localStorage.
 */
export function usingWorldPlazaLocalGroundItems({
  enabled,
  persistenceOwnerId,
  onPickupGranted,
}: UsingWorldPlazaLocalGroundItemsParams): UsingWorldPlazaLocalGroundItemsResult {
  const [items, setItems] = useState<readonly DefiningWorldPlazaGroundItem[]>(
    []
  );
  const [isReady, setIsReady] = useState(false);
  const onPickupGrantedRef = useRef(onPickupGranted);
  onPickupGrantedRef.current = onPickupGranted;

  useEffect(() => {
    if (!enabled) {
      optimisticLocalGroundItemInserter = null;
      optimisticLocalGroundItemReducer = null;
      setItems([]);
      setIsReady(false);
      return;
    }

    optimisticLocalGroundItemInserter = (groundItem) => {
      setItems((currentItems) => {
        if (
          currentItems.some((existingItem) => existingItem.id === groundItem.id)
        ) {
          return currentItems;
        }

        return [...currentItems, groundItem];
      });
      setIsReady(true);
    };

    optimisticLocalGroundItemReducer = (groundItemId, quantity) => {
      setItems((currentItems) => {
        const existingItem = currentItems.find(
          (groundItem) => groundItem.id === groundItemId
        );

        if (!existingItem) {
          return currentItems;
        }

        const grantedQuantity = Math.min(quantity, existingItem.quantity);

        if (grantedQuantity >= existingItem.quantity) {
          return currentItems.filter(
            (groundItem) => groundItem.id !== groundItemId
          );
        }

        return currentItems.map((groundItem) =>
          groundItem.id === groundItemId
            ? {
                ...groundItem,
                quantity: groundItem.quantity - grantedQuantity,
              }
            : groundItem
        );
      });
    };

    let cancelled = false;

    const refreshingLocalGroundItems = (): void => {
      if (cancelled) {
        return;
      }

      setItems(
        listingWorldPlazaLocalGroundItems(persistenceOwnerId).filter(
          (groundItem) =>
            !checkingWorldPlazaGroundItemIsLegacyDemoSeed(groundItem)
        )
      );
      setIsReady(true);
    };

    refreshingLocalGroundItems();
    const intervalId = window.setInterval(
      refreshingLocalGroundItems,
      WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_POLL_INTERVAL_MS
    );

    return () => {
      cancelled = true;
      optimisticLocalGroundItemInserter = null;
      optimisticLocalGroundItemReducer = null;
      window.clearInterval(intervalId);
    };
  }, [enabled, persistenceOwnerId]);

  const sendingGroundPickup = useCallback(
    async (
      groundItemId: string,
      requestedQuantity: number,
      playerX: number,
      playerY: number
    ): Promise<void> => {
      const grant = pickingUpWorldPlazaLocalGroundItem(persistenceOwnerId, {
        groundItemId,
        requestedQuantity,
        playerX,
        playerY,
      });

      onPickupGrantedRef.current(grant);

      setItems((currentItems) => {
        const existingItem = currentItems.find(
          (groundItem) => groundItem.id === groundItemId
        );

        if (!existingItem) {
          return currentItems;
        }

        const grantedQuantity = Math.min(
          requestedQuantity,
          existingItem.quantity
        );

        if (grantedQuantity >= existingItem.quantity) {
          return currentItems.filter(
            (groundItem) => groundItem.id !== groundItemId
          );
        }

        return currentItems.map((groundItem) =>
          groundItem.id === groundItemId
            ? {
                ...groundItem,
                quantity: groundItem.quantity - grantedQuantity,
              }
            : groundItem
        );
      });
    },
    [persistenceOwnerId]
  );

  return {
    items,
    isReady,
    sendingGroundPickup,
  };
}
