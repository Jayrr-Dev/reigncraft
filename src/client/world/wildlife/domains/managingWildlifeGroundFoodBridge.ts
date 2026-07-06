/**
 * Module bridge between ground-item React state and the wildlife sim tick.
 *
 * @module components/world/wildlife/domains/managingWildlifeGroundFoodBridge
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import { DEFINING_WILDLIFE_MELEE_RANGE_GRID } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';

export type ManagingWildlifeGroundFoodBridge = {
  listGroundItems: () => readonly DefiningWorldPlazaGroundItem[];
  consumeGroundFoodUnit: (
    groundItemId: string,
    consumerPosition: DefiningWorldPlazaWorldPoint
  ) => boolean;
};

let managingWildlifeGroundFoodBridge: ManagingWildlifeGroundFoodBridge | null =
  null;
let wildlifeEphemeralGroundFoodItems: DefiningWorldPlazaGroundItem[] = [];

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

function consumingWildlifeEphemeralGroundFoodUnit(
  groundItemId: string,
  consumerPosition: DefiningWorldPlazaWorldPoint
): boolean {
  const itemIndex = wildlifeEphemeralGroundFoodItems.findIndex(
    (entry) => entry.id === groundItemId
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
      (entry) => entry.id !== groundItemId
    );
  } else {
    wildlifeEphemeralGroundFoodItems = wildlifeEphemeralGroundFoodItems.map(
      (entry, index) =>
        index === itemIndex ? { ...entry, quantity: entry.quantity - 1 } : entry
    );
  }

  return true;
}

/** Registers the active ground-item bridge for wildlife foraging. */
export function registeringWildlifeGroundFoodBridge(
  bridge: ManagingWildlifeGroundFoodBridge | null
): void {
  managingWildlifeGroundFoodBridge = bridge;
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
}

/** Lists ground items visible to the wildlife simulation this frame. */
export function listingWildlifeGroundFoodItems(): readonly DefiningWorldPlazaGroundItem[] {
  const persistedItems =
    managingWildlifeGroundFoodBridge?.listGroundItems() ?? [];
  const persistedIds = new Set(persistedItems.map((entry) => entry.id));
  const ephemeralOnly = wildlifeEphemeralGroundFoodItems.filter(
    (entry) => !persistedIds.has(entry.id)
  );

  return [...persistedItems, ...ephemeralOnly];
}

/** Consumes one unit from a ground stack when wildlife is in range. */
export function consumingWildlifeGroundFoodBridgeUnit(
  groundItemId: string,
  consumerPosition: DefiningWorldPlazaWorldPoint
): boolean {
  const consumedEphemeral = consumingWildlifeEphemeralGroundFoodUnit(
    groundItemId,
    consumerPosition
  );
  const consumedPersisted =
    managingWildlifeGroundFoodBridge?.consumeGroundFoodUnit(
      groundItemId,
      consumerPosition
    ) ?? false;

  return consumedEphemeral || consumedPersisted;
}
