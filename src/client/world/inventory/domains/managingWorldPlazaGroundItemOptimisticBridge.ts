/**
 * Bridge for optimistic ground-item UI updates without importing React hooks.
 *
 * @module components/world/inventory/domains/managingWorldPlazaGroundItemOptimisticBridge
 */

import { checkingWorldPlazaGroundItemIsExpired } from '@/components/world/inventory/domains/checkingWorldPlazaGroundItemIsExpired';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';

type GroundItemInserter = (groundItem: DefiningWorldPlazaGroundItem) => void;
type GroundItemReducer = (groundItemId: string, quantity: number) => void;

let localGroundItemInserter: GroundItemInserter | null = null;
let devvitGroundItemInserter: GroundItemInserter | null = null;
let localGroundItemReducer: GroundItemReducer | null = null;
let devvitGroundItemReducer: GroundItemReducer | null = null;

/**
 * Drop ids inserted client-side before the next poll confirms them.
 * Only these may survive when missing from a poll snapshot.
 */
const pendingOptimisticDropIds = new Set<string>();

/**
 * Ids removed client-side (pickup / consume) that must not reappear from a
 * stale in-flight poll that still includes them.
 */
const pendingRemovedIds = new Set<string>();

export function registeringWorldPlazaLocalGroundItemOptimisticHandlers(
  inserter: GroundItemInserter | null,
  reducer: GroundItemReducer | null
): void {
  localGroundItemInserter = inserter;
  localGroundItemReducer = reducer;
}

export function registeringWorldPlazaDevvitGroundItemOptimisticHandlers(
  inserter: GroundItemInserter | null,
  reducer: GroundItemReducer | null
): void {
  devvitGroundItemInserter = inserter;
  devvitGroundItemReducer = reducer;
}

/** Marks a ground item as an optimistic drop awaiting poll confirmation. */
export function markingWorldPlazaGroundItemPendingOptimisticDrop(
  groundItemId: string
): void {
  pendingOptimisticDropIds.add(groundItemId);
  pendingRemovedIds.delete(groundItemId);
}

/**
 * Marks a ground item as removed so stale polls cannot resurrect it.
 */
export function markingWorldPlazaGroundItemPendingRemoved(
  groundItemId: string
): void {
  pendingRemovedIds.add(groundItemId);
  pendingOptimisticDropIds.delete(groundItemId);
}

/** Test / teardown helper: clears optimistic drop and removal tracking. */
export function clearingWorldPlazaGroundItemOptimisticTracking(): void {
  pendingOptimisticDropIds.clear();
  pendingRemovedIds.clear();
}

export function insertingWorldPlazaLocalGroundItemOptimistically(
  groundItem: DefiningWorldPlazaGroundItem
): void {
  markingWorldPlazaGroundItemPendingOptimisticDrop(groundItem.id);
  localGroundItemInserter?.(groundItem);
}

export function reducingWorldPlazaLocalGroundItemQuantityOptimistically(
  groundItemId: string,
  quantity = 1
): void {
  localGroundItemReducer?.(groundItemId, quantity);
}

export function insertingWorldPlazaDevvitGroundItemOptimistically(
  groundItem: DefiningWorldPlazaGroundItem
): void {
  markingWorldPlazaGroundItemPendingOptimisticDrop(groundItem.id);
  devvitGroundItemInserter?.(groundItem);
}

export function reducingWorldPlazaDevvitGroundItemQuantityOptimistically(
  groundItemId: string,
  quantity = 1
): void {
  devvitGroundItemReducer?.(groundItemId, quantity);
}

/**
 * Merges a server/local poll snapshot with tracked optimistic drops only.
 *
 * Pending removals are filtered out of the poll so a stale response cannot
 * resurrect an item the client already picked up or that returned 404.
 */
export function mergingWorldPlazaGroundItemsWithPendingOptimistic(
  polledItems: readonly DefiningWorldPlazaGroundItem[],
  currentItems: readonly DefiningWorldPlazaGroundItem[],
  nowMs: number = Date.now()
): DefiningWorldPlazaGroundItem[] {
  const safePolledItems = (polledItems ?? []).filter(
    (groundItem) => !checkingWorldPlazaGroundItemIsExpired(groundItem, nowMs)
  );
  const safeCurrentItems = currentItems ?? [];
  const polledIds = new Set(safePolledItems.map((groundItem) => groundItem.id));

  for (const polledId of polledIds) {
    pendingOptimisticDropIds.delete(polledId);
  }

  for (const pendingRemovedId of [...pendingRemovedIds]) {
    if (!polledIds.has(pendingRemovedId)) {
      pendingRemovedIds.delete(pendingRemovedId);
    }
  }

  const confirmedPolledItems = safePolledItems.filter(
    (groundItem) => !pendingRemovedIds.has(groundItem.id)
  );
  const confirmedPolledIds = new Set(
    confirmedPolledItems.map((groundItem) => groundItem.id)
  );

  const pendingOptimistic = safeCurrentItems.filter(
    (groundItem) =>
      pendingOptimisticDropIds.has(groundItem.id) &&
      !confirmedPolledIds.has(groundItem.id) &&
      !pendingRemovedIds.has(groundItem.id) &&
      !checkingWorldPlazaGroundItemIsExpired(groundItem, nowMs)
  );

  return [...confirmedPolledItems, ...pendingOptimistic];
}

/**
 * Inserts a newly dropped ground item into whichever backend is active.
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
