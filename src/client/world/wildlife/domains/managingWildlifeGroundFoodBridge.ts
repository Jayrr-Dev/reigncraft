/**
 * Module bridge between ground-item React state and the wildlife sim tick.
 *
 * @module components/world/wildlife/domains/managingWildlifeGroundFoodBridge
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaGroundItemIsExpired } from '@/components/world/inventory/domains/checkingWorldPlazaGroundItemIsExpired';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import { DEFINING_WILDLIFE_MELEE_RANGE_GRID } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';

export type ManagingWildlifeGroundFoodBridge = {
  listGroundItems: () => readonly DefiningWorldPlazaGroundItem[];
  consumeGroundFoodUnit: (
    groundItemId: string,
    consumerPosition: DefiningWorldPlazaWorldPoint
  ) => boolean;
  /**
   * Optional whole-stack / multi-unit consume for Spritcore feasts.
   * Falls back to looping `consumeGroundFoodUnit` when absent.
   */
  consumeGroundFoodQuantity?: (
    groundItemId: string,
    quantity: number,
    consumerPosition: DefiningWorldPlazaWorldPoint
  ) => number;
};

let managingWildlifeGroundFoodBridge: ManagingWildlifeGroundFoodBridge | null =
  null;
let wildlifeEphemeralGroundFoodItems: DefiningWorldPlazaGroundItem[] = [];
/** Previous ephemeral ids → canonical ids after persist remaps. */
let wildlifeEphemeralGroundFoodIdAliases = new Map<string, string>();

function resolvingDistanceGrid(
  a: DefiningWorldPlazaWorldPoint,
  b: DefiningWorldPlazaWorldPoint
): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function resolvingEphemeralGroundFoodWorldPoint(
  groundItem: DefiningWorldPlazaGroundItem
): DefiningWorldPlazaWorldPoint {
  return {
    x: groundItem.gridX + 0.5,
    y: groundItem.gridY + 0.5,
    layer: groundItem.layer ?? 1,
  };
}

/**
 * Follows persist remaps so hunters still find meat after the stack id changes.
 */
export function resolvingWildlifeGroundFoodCanonicalItemId(
  groundItemId: string
): string {
  let current = groundItemId;
  const seen = new Set<string>();

  while (wildlifeEphemeralGroundFoodIdAliases.has(current)) {
    if (seen.has(current)) {
      break;
    }

    seen.add(current);
    current = wildlifeEphemeralGroundFoodIdAliases.get(current) ?? current;
  }

  return current;
}

function consumingWildlifeEphemeralGroundFoodUnit(
  groundItemId: string,
  consumerPosition: DefiningWorldPlazaWorldPoint
): boolean {
  const canonicalId = resolvingWildlifeGroundFoodCanonicalItemId(groundItemId);
  const itemIndex = wildlifeEphemeralGroundFoodItems.findIndex(
    (entry) => entry.id === canonicalId
  );

  if (itemIndex < 0) {
    return false;
  }

  const item = wildlifeEphemeralGroundFoodItems[itemIndex];

  if (!item || item.quantity <= 0) {
    return false;
  }

  const distance = resolvingDistanceGrid(
    consumerPosition,
    resolvingEphemeralGroundFoodWorldPoint(item)
  );

  if (distance > DEFINING_WILDLIFE_MELEE_RANGE_GRID) {
    return false;
  }

  if (item.quantity <= 1) {
    wildlifeEphemeralGroundFoodItems = wildlifeEphemeralGroundFoodItems.filter(
      (entry) => entry.id !== canonicalId
    );
  } else {
    wildlifeEphemeralGroundFoodItems = wildlifeEphemeralGroundFoodItems.map(
      (entry, index) =>
        index === itemIndex ? { ...entry, quantity: entry.quantity - 1 } : entry
    );
  }

  return true;
}

function consumingWildlifeEphemeralGroundFoodQuantity(
  groundItemId: string,
  quantity: number,
  consumerPosition: DefiningWorldPlazaWorldPoint
): number {
  if (quantity <= 0) {
    return 0;
  }

  const canonicalId = resolvingWildlifeGroundFoodCanonicalItemId(groundItemId);
  const itemIndex = wildlifeEphemeralGroundFoodItems.findIndex(
    (entry) => entry.id === canonicalId
  );

  if (itemIndex < 0) {
    return 0;
  }

  const item = wildlifeEphemeralGroundFoodItems[itemIndex];

  if (!item || item.quantity <= 0) {
    return 0;
  }

  const distance = resolvingDistanceGrid(
    consumerPosition,
    resolvingEphemeralGroundFoodWorldPoint(item)
  );

  if (distance > DEFINING_WILDLIFE_MELEE_RANGE_GRID) {
    return 0;
  }

  const consumedQuantity = Math.min(quantity, item.quantity);
  const remainingQuantity = item.quantity - consumedQuantity;

  if (remainingQuantity <= 0) {
    wildlifeEphemeralGroundFoodItems = wildlifeEphemeralGroundFoodItems.filter(
      (entry) => entry.id !== canonicalId
    );
  } else {
    wildlifeEphemeralGroundFoodItems = wildlifeEphemeralGroundFoodItems.map(
      (entry, index) =>
        index === itemIndex
          ? { ...entry, quantity: remainingQuantity }
          : entry
    );
  }

  return consumedQuantity;
}

/** Registers the active ground-item bridge for wildlife foraging. */
export function registeringWildlifeGroundFoodBridge(
  bridge: ManagingWildlifeGroundFoodBridge | null
): void {
  managingWildlifeGroundFoodBridge = bridge;
}

/** Clears ephemeral kill-meat stacks (tests / sim teardown). */
export function clearingWildlifeEphemeralGroundFoodItems(): void {
  wildlifeEphemeralGroundFoodItems = [];
  wildlifeEphemeralGroundFoodIdAliases = new Map();
}

/** Adds a corpse-meat stack visible to wildlife AI before React state catches up. */
export function enqueueingWildlifeEphemeralGroundFoodItem(
  groundItem: DefiningWorldPlazaGroundItem
): void {
  wildlifeEphemeralGroundFoodItems = [
    ...wildlifeEphemeralGroundFoodItems.filter(
      (entry) => entry.id !== groundItem.id
    ),
    groundItem,
  ];
}

/** Rewrites an ephemeral stack id after a persisted local drop assigns a new id. */
export function replacingWildlifeEphemeralGroundFoodItemId(
  previousGroundItemId: string,
  nextGroundItemId: string
): void {
  if (previousGroundItemId === nextGroundItemId) {
    return;
  }

  const existing = wildlifeEphemeralGroundFoodItems.find(
    (entry) => entry.id === previousGroundItemId
  );

  if (!existing) {
    return;
  }

  wildlifeEphemeralGroundFoodItems = [
    ...wildlifeEphemeralGroundFoodItems.filter(
      (entry) => entry.id !== previousGroundItemId
    ),
    { ...existing, id: nextGroundItemId },
  ];
  wildlifeEphemeralGroundFoodIdAliases.set(
    previousGroundItemId,
    nextGroundItemId
  );
}

/** Lists ground items visible to the wildlife simulation this frame. */
export function listingWildlifeGroundFoodItems(
  nowMs: number = Date.now()
): readonly DefiningWorldPlazaGroundItem[] {
  wildlifeEphemeralGroundFoodItems = wildlifeEphemeralGroundFoodItems.filter(
    (entry) => !checkingWorldPlazaGroundItemIsExpired(entry, nowMs)
  );

  const persistedItems = (
    managingWildlifeGroundFoodBridge?.listGroundItems() ?? []
  ).filter((entry) => !checkingWorldPlazaGroundItemIsExpired(entry, nowMs));
  const persistedIds = new Set(persistedItems.map((entry) => entry.id));
  const ephemeralOnly = wildlifeEphemeralGroundFoodItems.filter(
    (entry) => !persistedIds.has(entry.id)
  );

  return [...persistedItems, ...ephemeralOnly];
}

/** Looks up a ground stack by id, following ephemeral → persisted remaps. */
export function findingWildlifeGroundFoodItemById(
  groundItemId: string,
  nowMs: number = Date.now()
): DefiningWorldPlazaGroundItem | null {
  const canonicalId = resolvingWildlifeGroundFoodCanonicalItemId(groundItemId);

  return (
    listingWildlifeGroundFoodItems(nowMs).find(
      (entry) => entry.id === canonicalId
    ) ?? null
  );
}

function checkingWildlifeGroundFoodItemIsPersisted(
  groundItemId: string
): boolean {
  const canonicalId = resolvingWildlifeGroundFoodCanonicalItemId(groundItemId);

  return (managingWildlifeGroundFoodBridge?.listGroundItems() ?? []).some(
    (entry) => entry.id === canonicalId
  );
}

/** Consumes one unit from a ground stack when wildlife is in range. */
export function consumingWildlifeGroundFoodBridgeUnit(
  groundItemId: string,
  consumerPosition: DefiningWorldPlazaWorldPoint
): boolean {
  const canonicalId = resolvingWildlifeGroundFoodCanonicalItemId(groundItemId);

  if (!checkingWildlifeGroundFoodItemIsPersisted(canonicalId)) {
    return consumingWildlifeEphemeralGroundFoodUnit(
      canonicalId,
      consumerPosition
    );
  }

  const consumed =
    managingWildlifeGroundFoodBridge?.consumeGroundFoodUnit(
      canonicalId,
      consumerPosition
    ) ?? false;

  // Keep ephemeral mirror in sync so listingWildlifeGroundFoodItems does not
  // resurrect a unit already taken from the persisted stack this tick.
  if (consumed) {
    consumingWildlifeEphemeralGroundFoodUnit(canonicalId, consumerPosition);
  }

  return consumed;
}

/**
 * Consumes up to `quantity` units from a ground stack (Spritcore whole-stack feast).
 * Returns how many units were actually removed.
 */
export function consumingWildlifeGroundFoodBridgeQuantity(
  groundItemId: string,
  quantity: number,
  consumerPosition: DefiningWorldPlazaWorldPoint
): number {
  if (quantity <= 0) {
    return 0;
  }

  const canonicalId = resolvingWildlifeGroundFoodCanonicalItemId(groundItemId);

  if (!checkingWildlifeGroundFoodItemIsPersisted(canonicalId)) {
    return consumingWildlifeEphemeralGroundFoodQuantity(
      canonicalId,
      quantity,
      consumerPosition
    );
  }

  const bridgeConsume =
    managingWildlifeGroundFoodBridge?.consumeGroundFoodQuantity;

  if (bridgeConsume) {
    const consumed = bridgeConsume(
      canonicalId,
      quantity,
      consumerPosition
    );

    if (consumed > 0) {
      consumingWildlifeEphemeralGroundFoodQuantity(
        canonicalId,
        consumed,
        consumerPosition
      );
    }

    return consumed;
  }

  let consumedTotal = 0;

  for (let index = 0; index < quantity; index += 1) {
    if (
      !consumingWildlifeGroundFoodBridgeUnit(canonicalId, consumerPosition)
    ) {
      break;
    }

    consumedTotal += 1;
  }

  return consumedTotal;
}
