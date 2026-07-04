'use client';

import { checkingWorldPlazaGroundItemIsLegacyDemoSeed } from '@/components/world/inventory/domains/checkingWorldPlazaGroundItemIsLegacyDemoSeed';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import {
  fetchingWorldInventoryDevvitGroundItems,
  pickingUpWorldInventoryDevvitGroundItem,
} from '@/components/world/inventory/repositories/callingWorldInventoryDevvitApi';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_API_PATH,
  WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_PICKUP_API_PATH,
  WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_POLL_INTERVAL_MS,
} from '../../../../shared/worldInventoryDevvit';

/** Params for {@link usingWorldPlazaDevvitGroundItems}. */
export type UsingWorldPlazaDevvitGroundItemsParams = {
  readonly enabled: boolean;
  readonly onPickupGranted: (grant: {
    groundItemId: string;
    itemTypeId: string;
    quantity: number;
  }) => void;
};

/** Return shape for {@link usingWorldPlazaDevvitGroundItems}. */
export type UsingWorldPlazaDevvitGroundItemsResult = {
  readonly items: readonly DefiningWorldPlazaGroundItem[];
  readonly isReady: boolean;
  readonly sendingGroundPickup: (
    groundItemId: string,
    requestedQuantity: number,
    playerX: number,
    playerY: number
  ) => Promise<void>;
};

function mappingWorldInventoryDevvitGroundItemRow(
  row: Awaited<
    ReturnType<typeof fetchingWorldInventoryDevvitGroundItems>
  >[number]
): DefiningWorldPlazaGroundItem {
  return {
    id: row.id,
    itemTypeId: row.itemTypeId,
    quantity: row.quantity,
    gridX: row.gridX,
    gridY: row.gridY,
    layer: row.layer,
    spawnedAt: row.spawnedAt,
  };
}

let optimisticGroundItemInserter:
  | ((groundItem: DefiningWorldPlazaGroundItem) => void)
  | null = null;

/**
 * Inserts a newly dropped ground item into the active client list immediately.
 *
 * @param groundItem - Optimistic ground item row from a successful drop ack.
 */
export function insertingWorldPlazaDevvitGroundItemOptimistically(
  groundItem: DefiningWorldPlazaGroundItem
): void {
  optimisticGroundItemInserter?.(groundItem);
}

/**
 * Polls shared ground items from the Devvit server (no Colyseus required).
 *
 * @param params - Enable flag and pickup grant callback.
 */
export function usingWorldPlazaDevvitGroundItems({
  enabled,
  onPickupGranted,
}: UsingWorldPlazaDevvitGroundItemsParams): UsingWorldPlazaDevvitGroundItemsResult {
  const [items, setItems] = useState<readonly DefiningWorldPlazaGroundItem[]>(
    []
  );
  const [isReady, setIsReady] = useState(false);
  const onPickupGrantedRef = useRef(onPickupGranted);
  onPickupGrantedRef.current = onPickupGranted;

  useEffect(() => {
    if (!enabled) {
      optimisticGroundItemInserter = null;
      setItems([]);
      setIsReady(false);
      return;
    }

    optimisticGroundItemInserter = (groundItem) => {
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

    let cancelled = false;

    const pollingGroundItems = async (): Promise<void> => {
      try {
        const rows = await fetchingWorldInventoryDevvitGroundItems(
          WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_API_PATH
        );

        if (cancelled) {
          return;
        }

        setItems(
          rows
            .map(mappingWorldInventoryDevvitGroundItemRow)
            .filter(
              (groundItem) =>
                !checkingWorldPlazaGroundItemIsLegacyDemoSeed(groundItem)
            )
        );
        setIsReady(true);
      } catch {
        if (!cancelled) {
          setIsReady(true);
        }
      }
    };

    void pollingGroundItems();
    const intervalId = window.setInterval(() => {
      void pollingGroundItems();
    }, WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      optimisticGroundItemInserter = null;
      window.clearInterval(intervalId);
    };
  }, [enabled]);

  const sendingGroundPickup = useCallback(
    async (
      groundItemId: string,
      requestedQuantity: number,
      playerX: number,
      playerY: number
    ): Promise<void> => {
      const grant = await pickingUpWorldInventoryDevvitGroundItem(
        WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_PICKUP_API_PATH,
        {
          groundItemId,
          requestedQuantity,
          playerX,
          playerY,
        }
      );

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
    []
  );

  return {
    items,
    isReady,
    sendingGroundPickup,
  };
}
