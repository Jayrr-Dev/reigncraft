import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaGroundItemIsExpired } from '@/components/world/inventory/domains/checkingWorldPlazaGroundItemIsExpired';
import { checkingWorldPlazaGroundItemPickupInRange } from '@/components/world/inventory/domains/checkingWorldPlazaGroundItemPickupInRange';
import { computingWorldPlazaInventoryDropChebyshevDistanceToTile } from '@/components/world/inventory/domains/computingWorldPlazaInventoryDropChebyshevDistanceToTile';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import { resolvingWorldPlazaGroundItemsLocalStorageKey } from '@/components/world/inventory/domains/definingWorldPlazaGroundItemLocalStorageConstants';
import {
  WORLD_INVENTORY_DEVVIT_GROUND_ITEM_DROP_RADIUS_TILES,
  checkingWorldInventoryGroundDropSkipsPlayerRadius,
} from '../../../../shared/worldInventoryDevvit';

/** Result of a local ground drop attempt. */
export type ManagingWorldPlazaLocalGroundDropResult = {
  readonly success: boolean;
  readonly groundItemId: string;
  readonly slotIndex: number;
};

/** Result of a local ground pickup grant. */
export type ManagingWorldPlazaLocalGroundPickupGrant = {
  readonly groundItemId: string;
  readonly itemTypeId: string;
  readonly quantity: number;
  readonly metadata?: Readonly<Record<string, unknown>>;
};

function parsingLocalGroundItemRow(
  value: unknown
): DefiningWorldPlazaGroundItem | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const row = value as Partial<DefiningWorldPlazaGroundItem>;

  if (
    typeof row.id !== 'string' ||
    typeof row.itemTypeId !== 'string' ||
    typeof row.quantity !== 'number' ||
    typeof row.gridX !== 'number' ||
    typeof row.gridY !== 'number' ||
    typeof row.spawnedAt !== 'number'
  ) {
    return null;
  }

  return {
    id: row.id,
    itemTypeId: row.itemTypeId,
    quantity: row.quantity,
    gridX: row.gridX,
    gridY: row.gridY,
    layer: typeof row.layer === 'number' ? row.layer : 1,
    spawnedAt: row.spawnedAt,
    ...(row.metadata &&
    typeof row.metadata === 'object' &&
    !Array.isArray(row.metadata)
      ? { metadata: row.metadata as Readonly<Record<string, unknown>> }
      : {}),
  };
}

function listingPersistedLocalGroundItems(
  persistenceOwnerId: string
): DefiningWorldPlazaGroundItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const storageKey =
      resolvingWorldPlazaGroundItemsLocalStorageKey(persistenceOwnerId);
    const rawJson = window.localStorage.getItem(storageKey);

    if (!rawJson) {
      return [];
    }

    const parsed: unknown = JSON.parse(rawJson);

    if (!Array.isArray(parsed)) {
      return [];
    }

    const nowMs = Date.now();
    const activeItems: DefiningWorldPlazaGroundItem[] = [];

    for (const row of parsed) {
      const groundItem = parsingLocalGroundItemRow(row);

      if (!groundItem) {
        continue;
      }

      if (checkingWorldPlazaGroundItemIsExpired(groundItem, nowMs)) {
        continue;
      }

      activeItems.push(groundItem);
    }

    return activeItems;
  } catch {
    return [];
  }
}

function persistingLocalGroundItems(
  persistenceOwnerId: string,
  groundItems: readonly DefiningWorldPlazaGroundItem[]
): void {
  if (typeof window === 'undefined') {
    return;
  }

  const storageKey =
    resolvingWorldPlazaGroundItemsLocalStorageKey(persistenceOwnerId);

  window.localStorage.setItem(storageKey, JSON.stringify(groundItems));
}

/**
 * Lists active ground items stored locally for one single-player owner.
 *
 * @param persistenceOwnerId - Scoped local persistence owner id.
 */
export function listingWorldPlazaLocalGroundItems(
  persistenceOwnerId: string
): DefiningWorldPlazaGroundItem[] {
  const activeItems = listingPersistedLocalGroundItems(persistenceOwnerId);
  persistingLocalGroundItems(persistenceOwnerId, activeItems);
  return activeItems;
}

/**
 * Drops an inventory stack onto the ground in localStorage.
 *
 * @param persistenceOwnerId - Scoped local persistence owner id.
 * @param request - Drop payload mirroring the Devvit API shape.
 */
export function droppingWorldPlazaLocalGroundItem(
  persistenceOwnerId: string,
  request: {
    itemTypeId: string;
    quantity: number;
    gridX: number;
    gridY: number;
    layer: number;
    slotIndex: number;
    playerX: number;
    playerY: number;
    metadata?: Readonly<Record<string, unknown>>;
  }
): ManagingWorldPlazaLocalGroundDropResult {
  if (!checkingWorldInventoryGroundDropSkipsPlayerRadius(request.slotIndex)) {
    const dropDistance =
      computingWorldPlazaInventoryDropChebyshevDistanceToTile(
        request.playerX,
        request.playerY,
        request.gridX,
        request.gridY
      );

    if (dropDistance > WORLD_INVENTORY_DEVVIT_GROUND_ITEM_DROP_RADIUS_TILES) {
      return {
        success: false,
        groundItemId: '',
        slotIndex: request.slotIndex,
      };
    }
  }

  const groundItemId = crypto.randomUUID();
  const nextGroundItem: DefiningWorldPlazaGroundItem = {
    id: groundItemId,
    itemTypeId: request.itemTypeId,
    quantity: request.quantity,
    gridX: request.gridX,
    gridY: request.gridY,
    layer: request.layer,
    spawnedAt: Date.now(),
    ...(request.metadata ? { metadata: request.metadata } : {}),
  };

  const nextItems = [
    ...listingPersistedLocalGroundItems(persistenceOwnerId),
    nextGroundItem,
  ];
  persistingLocalGroundItems(persistenceOwnerId, nextItems);

  return {
    success: true,
    groundItemId,
    slotIndex: request.slotIndex,
  };
}

/**
 * Picks up a locally stored ground item into inventory.
 *
 * @param persistenceOwnerId - Scoped local persistence owner id.
 * @param request - Pickup payload mirroring the Devvit API shape.
 */
export function pickingUpWorldPlazaLocalGroundItem(
  persistenceOwnerId: string,
  request: {
    groundItemId: string;
    requestedQuantity: number;
    playerX: number;
    playerY: number;
  }
): ManagingWorldPlazaLocalGroundPickupGrant {
  const groundItems = listingPersistedLocalGroundItems(persistenceOwnerId);
  const groundItem = groundItems.find(
    (item) => item.id === request.groundItemId
  );

  if (!groundItem) {
    throw new Error('Ground item not found.');
  }

  const playerPosition: DefiningWorldPlazaWorldPoint = {
    x: request.playerX,
    y: request.playerY,
    layer: groundItem.layer ?? 1,
  };

  if (!checkingWorldPlazaGroundItemPickupInRange(playerPosition, groundItem)) {
    throw new Error('Too far away to pick up that item.');
  }

  const grantedQuantity = Math.min(
    request.requestedQuantity,
    groundItem.quantity
  );

  if (grantedQuantity <= 0) {
    throw new Error('Nothing left to pick up.');
  }

  const remainingQuantity = groundItem.quantity - grantedQuantity;
  const nextItems =
    remainingQuantity <= 0
      ? groundItems.filter((item) => item.id !== request.groundItemId)
      : groundItems.map((item) =>
          item.id === request.groundItemId
            ? { ...item, quantity: remainingQuantity }
            : item
        );

  persistingLocalGroundItems(persistenceOwnerId, nextItems);

  return {
    groundItemId: request.groundItemId,
    itemTypeId: groundItem.itemTypeId,
    quantity: grantedQuantity,
    ...(groundItem.metadata ? { metadata: groundItem.metadata } : {}),
  };
}

/**
 * Consumes one unit from a locally stored ground stack for wildlife foraging.
 */
export function consumingWorldPlazaLocalGroundFoodUnit(
  persistenceOwnerId: string,
  request: {
    groundItemId: string;
    consumerX: number;
    consumerY: number;
  }
): { success: boolean; itemTypeId: string | null } {
  const groundItems = listingPersistedLocalGroundItems(persistenceOwnerId);
  const groundItem = groundItems.find(
    (item) => item.id === request.groundItemId
  );

  if (!groundItem || groundItem.quantity <= 0) {
    return { success: false, itemTypeId: null };
  }

  const consumerPosition: DefiningWorldPlazaWorldPoint = {
    x: request.consumerX,
    y: request.consumerY,
    layer: groundItem.layer ?? 1,
  };

  if (
    !checkingWorldPlazaGroundItemPickupInRange(consumerPosition, groundItem)
  ) {
    return { success: false, itemTypeId: null };
  }

  const remainingQuantity = groundItem.quantity - 1;
  const nextItems =
    remainingQuantity <= 0
      ? groundItems.filter((item) => item.id !== request.groundItemId)
      : groundItems.map((item) =>
          item.id === request.groundItemId
            ? { ...item, quantity: remainingQuantity }
            : item
        );

  persistingLocalGroundItems(persistenceOwnerId, nextItems);

  return { success: true, itemTypeId: groundItem.itemTypeId };
}
