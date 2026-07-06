/**
 * Bridge for optimistic ground-item UI updates without importing React hooks.
 *
 * @module components/world/inventory/domains/managingWorldPlazaGroundItemOptimisticBridge
 */

import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';

type GroundItemInserter = (groundItem: DefiningWorldPlazaGroundItem) => void;
type GroundItemReducer = (groundItemId: string, quantity: number) => void;

let localGroundItemInserter: GroundItemInserter | null = null;
let devvitGroundItemInserter: GroundItemInserter | null = null;
let localGroundItemReducer: GroundItemReducer | null = null;
let devvitGroundItemReducer: GroundItemReducer | null = null;

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

export function insertingWorldPlazaLocalGroundItemOptimistically(
  groundItem: DefiningWorldPlazaGroundItem
): void {
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
  devvitGroundItemInserter?.(groundItem);
}

export function reducingWorldPlazaDevvitGroundItemQuantityOptimistically(
  groundItemId: string,
  quantity = 1
): void {
  devvitGroundItemReducer?.(groundItemId, quantity);
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
