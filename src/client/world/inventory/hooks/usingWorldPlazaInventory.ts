"use client";

import { creatingInventoryDevvitAdapter } from "@/components/world/inventory/repositories/creatingInventoryDevvitAdapter";
import { creatingInventoryLocalStorageAdapter } from "@/components/inventory/domains/creatingInventoryLocalStorageAdapter";
import type { DefiningInventoryState } from "@/components/inventory/domains/definingInventoryItem";
import {
  addingInventoryItem,
  creatingEmptyInventoryState,
} from "@/components/inventory/domains/reducingInventoryState";
import { usingInventoryEngine } from "@/components/inventory/hooks/usingInventoryEngine";
import type { UsingInventoryEngineResult } from "@/components/inventory/hooks/usingInventoryEngine";
import {
  DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY,
  DEFINING_WORLD_PLAZA_INVENTORY_SEED_DEMO_ITEMS,
  resolvingWorldPlazaInventoryQueryKeySuffix,
} from "@/components/world/inventory/domains/definingWorldPlazaInventoryConstants";
import {
  checkingWorldPlazaInventoryUserIsKingpin,
  DEFINING_WORLD_PLAZA_INVENTORY_KINGPIN_TEST_SEED_ITEMS,
  DEFINING_WORLD_PLAZA_INVENTORY_KINGPIN_TEST_SEED_VERSION,
  readingWorldPlazaInventoryKingpinTestSeedVersion,
  writingWorldPlazaInventoryKingpinTestSeedVersion,
} from "@/components/world/inventory/domains/definingWorldPlazaInventoryKingpinTestSeed";
import type { DefiningWorldPlazaInventoryDemoSeedItem } from "@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes";
import {
  DEFINING_WORLD_PLAZA_INVENTORY_DEMO_SEED_ITEMS,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY,
} from "@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes";
import { useEffect, useMemo, useRef } from "react";

/** Options for {@link usingWorldPlazaInventory}. */
export interface UsingWorldPlazaInventoryOptions {
  /** Authenticated user id for online persistence. */
  readonly onlineUserId?: string | null;
  /** Offline session owner id for localStorage persistence. */
  readonly localPersistenceOwnerId?: string | null;
  /** Public username; used to apply the Kingpin founder test load. */
  readonly onlineUsername?: string | null;
  /** When true, seeds demo items on first empty load. */
  readonly seedDemoItems?: boolean;
}

/** Return shape for {@link usingWorldPlazaInventory}. */
export type UsingWorldPlazaInventoryResult = UsingInventoryEngineResult;

/**
 * Seeds inventory slots from a configured item list.
 *
 * @param state - Starting empty state
 * @param seedItems - Item types and quantities to place
 */
function seedingWorldPlazaInventoryItems(
  state: DefiningInventoryState,
  seedItems: readonly DefiningWorldPlazaInventoryDemoSeedItem[],
): DefiningInventoryState {
  let nextState = state;

  for (const seedItem of seedItems) {
    nextState = addingInventoryItem(nextState, {
      id: crypto.randomUUID(),
      itemTypeId: seedItem.itemTypeId,
      quantity: seedItem.quantity,
    });
  }

  return nextState;
}

/**
 * Checks whether inventory state has any occupied slots.
 *
 * @param state - Inventory state
 */
function checkingWorldPlazaInventoryHasItems(
  state: DefiningInventoryState,
): boolean {
  return state.slots.some((slot) => slot !== null);
}

/**
 * World plaza inventory hook: wires generic engine to Devvit Redis persistence
 * scoped per user, with optional demo seed on first load.
 *
 * @param options - User id and seed flag
 */
export function usingWorldPlazaInventory(
  options: UsingWorldPlazaInventoryOptions,
): UsingWorldPlazaInventoryResult {
  const {
    onlineUserId = null,
    localPersistenceOwnerId = null,
    onlineUsername = null,
    seedDemoItems = DEFINING_WORLD_PLAZA_INVENTORY_SEED_DEMO_ITEMS,
  } = options;

  const persistenceOwnerId = onlineUserId ?? localPersistenceOwnerId;
  const isOfflineSession =
    onlineUserId === null && localPersistenceOwnerId !== null;

  const hasSeededRef = useRef(false);
  const hasKingpinSeededRef = useRef(false);
  const isKingpinAccount = checkingWorldPlazaInventoryUserIsKingpin(onlineUsername);

  const adapter = useMemo(() => {
    if (isOfflineSession && localPersistenceOwnerId) {
      return creatingInventoryLocalStorageAdapter({
        storageKey: resolvingWorldPlazaInventoryStorageKey(
          localPersistenceOwnerId,
        ),
        capacity: DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY,
        registry: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY,
      });
    }

    return creatingInventoryDevvitAdapter({
      capacity: DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY,
      registry: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY,
    });
  }, [isOfflineSession, localPersistenceOwnerId]);

  const engine = usingInventoryEngine({
    registry: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY,
    adapter,
    capacity: DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY,
    queryKeySuffix: persistenceOwnerId
      ? resolvingWorldPlazaInventoryQueryKeySuffix(persistenceOwnerId)
      : DEFINING_WORLD_PLAZA_INVENTORY_QUERY_KEY_ROOT,
    enabled: Boolean(persistenceOwnerId),
  });

  const { state, isLoading, setState } = engine;

  useEffect(() => {
    if (isLoading || !persistenceOwnerId) {
      return;
    }

    if (isKingpinAccount && onlineUserId && !hasKingpinSeededRef.current) {
      hasKingpinSeededRef.current = true;

      const appliedSeedVersion =
        readingWorldPlazaInventoryKingpinTestSeedVersion(onlineUserId);

      if (appliedSeedVersion < DEFINING_WORLD_PLAZA_INVENTORY_KINGPIN_TEST_SEED_VERSION) {
        hasSeededRef.current = true;

        const seededState = seedingWorldPlazaInventoryItems(
          creatingEmptyInventoryState(DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY),
          DEFINING_WORLD_PLAZA_INVENTORY_KINGPIN_TEST_SEED_ITEMS,
        );
        setState(seededState);
        writingWorldPlazaInventoryKingpinTestSeedVersion(
          onlineUserId,
          DEFINING_WORLD_PLAZA_INVENTORY_KINGPIN_TEST_SEED_VERSION,
        );
      }

      return;
    }

    if (!seedDemoItems || hasSeededRef.current) {
      return;
    }

    const isEmpty = !checkingWorldPlazaInventoryHasItems(state);

    if (isEmpty) {
      hasSeededRef.current = true;
      const seededState = seedingWorldPlazaInventoryItems(
        creatingEmptyInventoryState(DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY),
        DEFINING_WORLD_PLAZA_INVENTORY_DEMO_SEED_ITEMS,
      );
      setState(seededState);
    }
  }, [
    isKingpinAccount,
    isLoading,
    onlineUserId,
    persistenceOwnerId,
    seedDemoItems,
    setState,
    state,
  ]);

  return engine;
}
