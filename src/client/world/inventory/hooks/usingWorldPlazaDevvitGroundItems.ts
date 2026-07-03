"use client";

import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import { checkingWorldPlazaGroundItemIsLegacyDemoSeed } from '@/components/world/inventory/domains/checkingWorldPlazaGroundItemIsLegacyDemoSeed';
import {
  fetchingWorldInventoryDevvitGroundItems,
  pickingUpWorldInventoryDevvitGroundItem,
} from '@/components/world/inventory/repositories/callingWorldInventoryDevvitApi';
import {
  WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_API_PATH,
  WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_PICKUP_API_PATH,
  WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_POLL_INTERVAL_MS,
} from '../../../../shared/worldInventoryDevvit';
import { useCallback, useEffect, useRef, useState } from 'react';

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
    playerY: number,
  ) => Promise<void>;
};

function mappingWorldInventoryDevvitGroundItemRow(
  row: Awaited<ReturnType<typeof fetchingWorldInventoryDevvitGroundItems>>[number],
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
  onPickupGranted,
}: UsingWorldPlazaDevvitGroundItemsParams): UsingWorldPlazaDevvitGroundItemsResult {
  const [items, setItems] = useState<readonly DefiningWorldPlazaGroundItem[]>([]);
  const [isReady, setIsReady] = useState(false);
  const onPickupGrantedRef = useRef(onPickupGranted);
  onPickupGrantedRef.current = onPickupGranted;

  useEffect(() => {
    if (!enabled) {
      setItems([]);
      setIsReady(false);
      return;
    }

    let cancelled = false;

    const pollingGroundItems = async (): Promise<void> => {
      try {
        const rows = await fetchingWorldInventoryDevvitGroundItems(
          WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_API_PATH,
        );

        if (cancelled) {
          return;
        }

        setItems(
          rows
            .map(mappingWorldInventoryDevvitGroundItemRow)
            .filter((groundItem) => !checkingWorldPlazaGroundItemIsLegacyDemoSeed(groundItem)),
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
      window.clearInterval(intervalId);
    };
  }, [enabled]);

  const sendingGroundPickup = useCallback(
    async (
      groundItemId: string,
      requestedQuantity: number,
      playerX: number,
      playerY: number,
    ): Promise<void> => {
      const grant = await pickingUpWorldInventoryDevvitGroundItem(
        WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_PICKUP_API_PATH,
        {
          groundItemId,
          requestedQuantity,
          playerX,
          playerY,
        },
      );

      onPickupGrantedRef.current(grant);
    },
    [],
  );

  return {
    items,
    isReady,
    sendingGroundPickup,
  };
}
