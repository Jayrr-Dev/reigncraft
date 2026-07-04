'use client';

import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import {
  insertingWorldPlazaDevvitGroundItemOptimistically,
  usingWorldPlazaDevvitGroundItems,
} from '@/components/world/inventory/hooks/usingWorldPlazaDevvitGroundItems';
import {
  insertingWorldPlazaLocalGroundItemOptimistically,
  usingWorldPlazaLocalGroundItems,
} from '@/components/world/inventory/hooks/usingWorldPlazaLocalGroundItems';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

/** Params for {@link usingWorldPlazaGroundItems}. */
export type UsingWorldPlazaGroundItemsParams = {
  readonly enabled: boolean;
  readonly localPersistenceOwnerId?: string | null;
  readonly redditUserId?: string | null;
  readonly saveSlotIndex?: PlazaSaveSlotIndex | null;
  readonly onPickupGranted: (grant: {
    groundItemId: string;
    itemTypeId: string;
    quantity: number;
  }) => void;
};

/** Return shape for {@link usingWorldPlazaGroundItems}. */
export type UsingWorldPlazaGroundItemsResult = {
  readonly items: readonly DefiningWorldPlazaGroundItem[];
  readonly isReady: boolean;
  readonly sendingGroundPickup: (
    groundItemId: string,
    requestedQuantity: number,
    playerX: number,
    playerY: number
  ) => Promise<void>;
};

/**
 * Returns true when ground items should persist locally instead of via Devvit.
 *
 * @param localPersistenceOwnerId - Offline single-player owner id.
 * @param redditUserId - Signed-in Reddit user id, when available.
 */
export function checkingWorldPlazaGroundItemsUseLocalPersistence(
  localPersistenceOwnerId: string | null | undefined,
  redditUserId: string | null | undefined
): boolean {
  return (
    typeof localPersistenceOwnerId === 'string' &&
    localPersistenceOwnerId.length > 0 &&
    (redditUserId === null || redditUserId.length === 0)
  );
}

/**
 * Inserts a newly dropped ground item into whichever backend is active.
 *
 * @param groundItem - Optimistic ground item row from a successful drop.
 * @param useLocalPersistence - Whether the active session uses localStorage.
 */
export function insertingWorldPlazaGroundItemOptimistically(
  groundItem: DefiningWorldPlazaGroundItem,
  useLocalPersistence: boolean
): void {
  if (useLocalPersistence) {
    insertingWorldPlazaLocalGroundItemOptimistically(groundItem);
    return;
  }

  insertingWorldPlazaDevvitGroundItemOptimistically(groundItem);
}

/**
 * Loads shared or offline ground items for the active plaza session.
 */
export function usingWorldPlazaGroundItems({
  enabled,
  localPersistenceOwnerId = null,
  redditUserId = null,
  saveSlotIndex = null,
  onPickupGranted,
}: UsingWorldPlazaGroundItemsParams): UsingWorldPlazaGroundItemsResult {
  const useLocalPersistence = checkingWorldPlazaGroundItemsUseLocalPersistence(
    localPersistenceOwnerId,
    redditUserId
  );

  const devvitGroundItems = usingWorldPlazaDevvitGroundItems({
    enabled: enabled && !useLocalPersistence,
    saveSlotIndex,
    onPickupGranted,
  });

  const localGroundItems = usingWorldPlazaLocalGroundItems({
    enabled: enabled && useLocalPersistence && localPersistenceOwnerId !== null,
    persistenceOwnerId: localPersistenceOwnerId ?? '',
    onPickupGranted,
  });

  return useLocalPersistence ? localGroundItems : devvitGroundItems;
}
