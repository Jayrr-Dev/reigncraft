'use client';

import { checkingWorldPlazaGroundItemIsLegacyDemoSeed } from '@/components/world/inventory/domains/checkingWorldPlazaGroundItemIsLegacyDemoSeed';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import { registeringWorldPlazaDevvitGroundItemOptimisticHandlers } from '@/components/world/inventory/domains/managingWorldPlazaGroundItemOptimisticBridge';
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

export {
  insertingWorldPlazaDevvitGroundItemOptimistically,
  reducingWorldPlazaDevvitGroundItemQuantityOptimistically,
} from '@/components/world/inventory/domains/managingWorldPlazaGroundItemOptimisticBridge';

/** Params for {@link usingWorldPlazaDevvitGroundItems}. */
export type UsingWorldPlazaDevvitGroundItemsParams = {
  readonly enabled: boolean;
  /** Single-player save slot; scopes ground items per user instead of the shared room. */
  readonly saveSlotIndex?: number | null;
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

/**
 * Polls shared ground items from the Devvit server (no Colyseus required).
 *
 * @param params - Enable flag and pickup grant callback.
 */
export function usingWorldPlazaDevvitGroundItems({
  enabled,
  saveSlotIndex = null,
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
      registeringWorldPlazaDevvitGroundItemOptimisticHandlers(null, null);
      setItems([]);
      setIsReady(false);
      return;
    }

    registeringWorldPlazaDevvitGroundItemOptimisticHandlers(
      (groundItem) => {
        setItems((currentItems) => {
          if (
            currentItems.some(
              (existingItem) => existingItem.id === groundItem.id
            )
          ) {
            return currentItems;
          }

          return [...currentItems, groundItem];
        });
        setIsReady(true);
      },
      (groundItemId, quantity) => {
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
      }
    );

    let cancelled = false;

    const pollingGroundItems = async (): Promise<void> => {
      try {
        const rows = await fetchingWorldInventoryDevvitGroundItems(
          WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_API_PATH,
          saveSlotIndex
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
      registeringWorldPlazaDevvitGroundItemOptimisticHandlers(null, null);
      window.clearInterval(intervalId);
    };
  }, [enabled, saveSlotIndex]);

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
          saveSlotIndex,
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
    [saveSlotIndex]
  );

  return {
    items,
    isReady,
    sendingGroundPickup,
  };
}
