'use client';

import { checkingWorldPlazaGroundItemsUseLocalPersistence } from '@/components/world/inventory/domains/checkingWorldPlazaGroundItemsUseLocalPersistence';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import { insertingWorldPlazaGroundItemOptimistically } from '@/components/world/inventory/domains/managingWorldPlazaGroundItemOptimisticBridge';
import { usingWorldPlazaDevvitGroundItems } from '@/components/world/inventory/hooks/usingWorldPlazaDevvitGroundItems';
import { usingWorldPlazaLocalGroundItems } from '@/components/world/inventory/hooks/usingWorldPlazaLocalGroundItems';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

export {
  checkingWorldPlazaGroundItemsUseLocalPersistence,
  insertingWorldPlazaGroundItemOptimistically,
};

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
