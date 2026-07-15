'use client';

import { creatingInventoryLocalStorageAdapter } from '@/components/inventory/domains/creatingInventoryLocalStorageAdapter';
import type {
  DefiningInventoryItemInput,
  DefiningInventoryState,
} from '@/components/inventory/domains/definingInventoryItem';
import { creatingEmptyInventoryState } from '@/components/inventory/domains/reducingInventoryState';
import type { UsingInventoryEngineResult } from '@/components/inventory/hooks/usingInventoryEngine';
import { usingInventoryEngine } from '@/components/inventory/hooks/usingInventoryEngine';
import { listingWorldPlazaCraftModeRecipeIngredientSeedItems } from '@/components/world/crafting/domains/listingWorldPlazaCraftModeRecipeIngredientSeedItems';
import {
  checkingWorldPlazaDevQaLoadEnabled,
  readingWorldPlazaDevQaLoadRevision,
} from '@/components/world/domains/managingWorldPlazaDevQaLoadStore';
import {
  addingWorldPlazaInventoryItem,
  addingWorldPlazaInventoryItemWithStacking,
} from '@/components/world/inventory/domains/addingWorldPlazaInventoryItemWithStacking';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_QUERY_KEY_ROOT,
  DEFINING_WORLD_PLAZA_INVENTORY_SEED_DEMO_ITEMS,
  DEFINING_WORLD_PLAZA_INVENTORY_STARTER_ITEMS,
  resolvingWorldPlazaInventoryQueryKeySuffix,
  resolvingWorldPlazaInventoryStorageKey,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import type { DefiningWorldPlazaInventoryDemoSeedItem } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_DEMO_SEED_ITEMS,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import {
  checkingWorldPlazaInventoryUserIsKingpin,
  DEFINING_WORLD_PLAZA_INVENTORY_KINGPIN_TEST_SEED_ITEMS,
  DEFINING_WORLD_PLAZA_INVENTORY_KINGPIN_TEST_SEED_VERSION,
  readingWorldPlazaInventoryKingpinTestSeedVersion,
  writingWorldPlazaInventoryKingpinTestSeedVersion,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryKingpinTestSeed';
import { DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_MAX_CAPACITY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryStorageExpansionConstants';
import { ensuringWorldPlazaInventoryBestiarySightedRecipeRewards } from '@/components/world/inventory/domains/ensuringWorldPlazaInventoryBestiarySightedRecipeRewards';
import { ensuringWorldPlazaInventoryCampfireRecipePage } from '@/components/world/inventory/domains/ensuringWorldPlazaInventoryCampfireRecipePage';
import { ensuringWorldPlazaInventoryLapidaryOreStudyRecipeRewards } from '@/components/world/inventory/domains/ensuringWorldPlazaInventoryLapidaryOreStudyRecipeRewards';
import { listingWorldPlazaOreItemSeedItems } from '@/components/world/inventory/domains/listingWorldPlazaOreItemSeedItems';
import { acquiringWorldPlazaInventoryLiveGrantHandler } from '@/components/world/inventory/domains/managingWorldPlazaInventoryLiveGrantStore';
import {
  gettingWorldPlazaInventoryBonusStorageRows,
  subscribingWorldPlazaInventoryStorageExpansion,
} from '@/components/world/inventory/domains/managingWorldPlazaInventoryStorageExpansionStore';
import { movingWorldPlazaInventoryItemToSlot } from '@/components/world/inventory/domains/movingWorldPlazaInventoryItemToSlot';
import { normalizingWorldPlazaInventoryWeaponToolSlot } from '@/components/world/inventory/domains/normalizingWorldPlazaInventoryWeaponToolSlot';
import { notifyingWorldPlazaInventoryItemAdded } from '@/components/world/inventory/domains/notifyingWorldPlazaInventoryItemAdded';
import { notifyingWorldPlazaInventoryItemMoved } from '@/components/world/inventory/domains/notifyingWorldPlazaInventoryItemMoved';
import { resizingWorldPlazaInventoryStateToCapacity } from '@/components/world/inventory/domains/resizingWorldPlazaInventoryStateToCapacity';
import { resolvingWorldPlazaInventoryCapacity } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryCapacity';
import { creatingInventoryDevvitAdapter } from '@/components/world/inventory/repositories/creatingInventoryDevvitAdapter';
import { creatingInventoryPlazaSinglePlayerSaveAdapter } from '@/components/world/inventory/repositories/creatingInventoryPlazaSinglePlayerSaveAdapter';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from 'react';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

/**
 * Dev QA craft-ingredient seed is once per owner+revision.
 * Scene + remounted ITEMS hotbar both call this hook; a per-instance ref would
 * wipe crafted items every CRAFT -> ITEMS switch.
 */
const seededDevQaCraftInventoryKeys = new Set<string>();

/** Test helper: allow Dev QA inventory seed to run again. */
export function resettingWorldPlazaInventoryDevQaCraftSeedGuardForTests(): void {
  seededDevQaCraftInventoryKeys.clear();
}

/** Options for {@link usingWorldPlazaInventory}. */
export interface UsingWorldPlazaInventoryOptions {
  /** Authenticated user id for online persistence. */
  readonly onlineUserId?: string | null;
  /** Offline session owner id for localStorage persistence. */
  readonly localPersistenceOwnerId?: string | null;
  /** Reddit user id for signed-in single-player cloud saves. */
  readonly redditUserId?: string | null;
  /** Active single-player save slot (1–3). */
  readonly saveSlotIndex?: PlazaSaveSlotIndex | null;
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
  seedItems: readonly DefiningWorldPlazaInventoryDemoSeedItem[]
): DefiningInventoryState {
  let nextState = state;

  for (const seedItem of seedItems) {
    nextState = addingWorldPlazaInventoryItem(nextState, {
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
  state: DefiningInventoryState
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
  options: UsingWorldPlazaInventoryOptions
): UsingWorldPlazaInventoryResult {
  const {
    onlineUserId = null,
    localPersistenceOwnerId = null,
    redditUserId = null,
    saveSlotIndex = null,
    onlineUsername = null,
    seedDemoItems = DEFINING_WORLD_PLAZA_INVENTORY_SEED_DEMO_ITEMS,
  } = options;

  const persistenceOwnerId = onlineUserId ?? localPersistenceOwnerId;
  const isOfflineSession =
    onlineUserId === null && localPersistenceOwnerId !== null;
  const isSignedInSinglePlayer =
    isOfflineSession && redditUserId !== null && saveSlotIndex !== null;

  const hasSeededRef = useRef(false);
  const hasNormalizedWeaponToolSlotRef = useRef(false);
  const hasEnsuredCampfireRecipePageRef = useRef(false);
  const hasEnsuredLapidaryOreStudyRecipeRewardsRef = useRef(false);
  const hasEnsuredBestiarySightedRecipeRewardsRef = useRef(false);
  const hasKingpinSeededRef = useRef(false);
  const hasDevQaCraftSeededRef = useRef(false);
  const isKingpinAccount =
    checkingWorldPlazaInventoryUserIsKingpin(onlineUsername);
  const bonusStorageRows = useSyncExternalStore(
    subscribingWorldPlazaInventoryStorageExpansion,
    gettingWorldPlazaInventoryBonusStorageRows,
    () => 0
  );
  const unlockedCapacity =
    resolvingWorldPlazaInventoryCapacity(bonusStorageRows);

  const adapter = useMemo(() => {
    if (isSignedInSinglePlayer && localPersistenceOwnerId && saveSlotIndex) {
      return creatingInventoryPlazaSinglePlayerSaveAdapter({
        storageKey: resolvingWorldPlazaInventoryStorageKey(
          localPersistenceOwnerId
        ),
        capacity: DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_MAX_CAPACITY,
        registry: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY,
        saveSlotIndex,
      });
    }

    if (isOfflineSession && localPersistenceOwnerId) {
      return creatingInventoryLocalStorageAdapter({
        storageKey: resolvingWorldPlazaInventoryStorageKey(
          localPersistenceOwnerId
        ),
        capacity: DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_MAX_CAPACITY,
        registry: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY,
      });
    }

    return creatingInventoryDevvitAdapter({
      capacity: DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_MAX_CAPACITY,
      registry: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY,
    });
  }, [
    isOfflineSession,
    isSignedInSinglePlayer,
    localPersistenceOwnerId,
    redditUserId,
    saveSlotIndex,
  ]);

  const engine = usingInventoryEngine({
    registry: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY,
    adapter,
    capacity: DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_MAX_CAPACITY,
    queryKeySuffix: persistenceOwnerId
      ? resolvingWorldPlazaInventoryQueryKeySuffix(persistenceOwnerId)
      : DEFINING_WORLD_PLAZA_INVENTORY_QUERY_KEY_ROOT,
    enabled: Boolean(persistenceOwnerId),
  });

  const { state, isLoading, isLoaded, setState, updateState } = engine;
  const updateStateRef = useRef(updateState);
  updateStateRef.current = updateState;

  // Grow/shrink slot array when bonus storage rows change (or after first load
  // from max-capacity parse). Value-equality commit avoids update-depth loops
  // when retained capacity cannot shrink below occupied slots.
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    updateStateRef.current((currentState) => {
      const nextState = resizingWorldPlazaInventoryStateToCapacity(
        currentState,
        unlockedCapacity
      );

      if (
        nextState.capacity === currentState.capacity &&
        nextState.slots.length === currentState.slots.length
      ) {
        return null;
      }

      return nextState;
    });
  }, [isLoaded, unlockedCapacity]);

  useEffect(() => {
    return acquiringWorldPlazaInventoryLiveGrantHandler((itemTypeId) => {
      let grantResult: 'granted' | 'inventory-full' = 'inventory-full';

      updateStateRef.current((currentState) => {
        const addResult = addingWorldPlazaInventoryItemWithStacking(
          currentState,
          {
            id: crypto.randomUUID(),
            itemTypeId,
            quantity: 1,
          },
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
        );

        if (addResult.quantityAccepted < 1) {
          grantResult = 'inventory-full';
          return null;
        }

        grantResult = 'granted';
        notifyingWorldPlazaInventoryItemAdded(addResult.quantityAccepted);
        return addResult.state;
      });

      return grantResult;
    });
  }, []);

  const moveItem = useCallback(
    (fromSlotIndex: number, toSlotIndex: number): void => {
      let didMove = false;

      updateState((currentState) => {
        const nextState = movingWorldPlazaInventoryItemToSlot(
          currentState,
          fromSlotIndex,
          toSlotIndex,
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
        );
        didMove = nextState !== currentState;
        return nextState;
      });

      if (didMove) {
        notifyingWorldPlazaInventoryItemMoved();
      }
    },
    [updateState]
  );

  const addItem = useCallback(
    (itemInput: DefiningInventoryItemInput, targetSlotIndex?: number): void => {
      updateState((currentState) =>
        addingWorldPlazaInventoryItem(currentState, itemInput, targetSlotIndex)
      );
    },
    [updateState]
  );

  const addItemWithStacking = useCallback(
    (itemInput: DefiningInventoryItemInput) => {
      let quantityAccepted = 0;
      let quantityOverflow = 0;

      updateState((currentState) => {
        const result = addingWorldPlazaInventoryItemWithStacking(
          currentState,
          itemInput,
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
        );
        quantityAccepted = result.quantityAccepted;
        quantityOverflow = result.quantityOverflow;
        return result.state;
      });

      if (quantityAccepted > 0) {
        notifyingWorldPlazaInventoryItemAdded(quantityAccepted);
      }

      return {
        quantityAccepted,
        quantityOverflow,
      };
    },
    [updateState]
  );

  useEffect(() => {
    // Only seed after a confirmed successful load; a transient load error
    // must never overwrite a real save with seed items.
    if (isLoading || !isLoaded || !persistenceOwnerId) {
      return;
    }

    if (checkingWorldPlazaDevQaLoadEnabled()) {
      hasDevQaCraftSeededRef.current = true;
      hasSeededRef.current = true;
      hasNormalizedWeaponToolSlotRef.current = true;
      hasEnsuredCampfireRecipePageRef.current = true;
      hasEnsuredLapidaryOreStudyRecipeRewardsRef.current = true;
      hasEnsuredBestiarySightedRecipeRewardsRef.current = true;

      const devQaSeedKey = `${persistenceOwnerId}:${readingWorldPlazaDevQaLoadRevision()}`;

      if (!seededDevQaCraftInventoryKeys.has(devQaSeedKey)) {
        seededDevQaCraftInventoryKeys.add(devQaSeedKey);

        let seededState = creatingEmptyInventoryState(unlockedCapacity);
        seededState = seedingWorldPlazaInventoryItems(
          seededState,
          DEFINING_WORLD_PLAZA_INVENTORY_STARTER_ITEMS
        );
        seededState = seedingWorldPlazaInventoryItems(
          seededState,
          listingWorldPlazaCraftModeRecipeIngredientSeedItems()
        );
        seededState = seedingWorldPlazaInventoryItems(
          seededState,
          listingWorldPlazaOreItemSeedItems()
        );
        setState(seededState);
      }

      return;
    }

    if (isKingpinAccount && onlineUserId && !hasKingpinSeededRef.current) {
      hasKingpinSeededRef.current = true;

      const appliedSeedVersion =
        readingWorldPlazaInventoryKingpinTestSeedVersion(onlineUserId);

      if (
        appliedSeedVersion <
        DEFINING_WORLD_PLAZA_INVENTORY_KINGPIN_TEST_SEED_VERSION
      ) {
        hasSeededRef.current = true;
        hasNormalizedWeaponToolSlotRef.current = true;

        const seededState = seedingWorldPlazaInventoryItems(
          creatingEmptyInventoryState(unlockedCapacity),
          DEFINING_WORLD_PLAZA_INVENTORY_KINGPIN_TEST_SEED_ITEMS
        );
        setState(seededState);
        writingWorldPlazaInventoryKingpinTestSeedVersion(
          onlineUserId,
          DEFINING_WORLD_PLAZA_INVENTORY_KINGPIN_TEST_SEED_VERSION
        );
      }

      return;
    }

    if (!hasSeededRef.current) {
      const isEmpty = !checkingWorldPlazaInventoryHasItems(state);

      if (isEmpty) {
        hasSeededRef.current = true;
        hasNormalizedWeaponToolSlotRef.current = true;

        let seededState = creatingEmptyInventoryState(unlockedCapacity);
        seededState = seedingWorldPlazaInventoryItems(
          seededState,
          DEFINING_WORLD_PLAZA_INVENTORY_STARTER_ITEMS
        );

        if (seedDemoItems) {
          seededState = seedingWorldPlazaInventoryItems(
            seededState,
            DEFINING_WORLD_PLAZA_INVENTORY_DEMO_SEED_ITEMS
          );
        }

        setState(seededState);
        return;
      }

      hasSeededRef.current = true;
    }

    if (!hasNormalizedWeaponToolSlotRef.current) {
      hasNormalizedWeaponToolSlotRef.current = true;
      const normalizedState =
        normalizingWorldPlazaInventoryWeaponToolSlot(state);

      if (normalizedState !== state) {
        setState(normalizedState);
        return;
      }
    }

    if (!hasEnsuredCampfireRecipePageRef.current) {
      hasEnsuredCampfireRecipePageRef.current = true;
      const withCampfirePage = ensuringWorldPlazaInventoryCampfireRecipePage(
        state,
        { storageOwnerId: persistenceOwnerId }
      );

      if (withCampfirePage !== state) {
        setState(withCampfirePage);
        return;
      }
    }

    if (!hasEnsuredLapidaryOreStudyRecipeRewardsRef.current) {
      hasEnsuredLapidaryOreStudyRecipeRewardsRef.current = true;
      const lapidaryRewards =
        ensuringWorldPlazaInventoryLapidaryOreStudyRecipeRewards(state, {
          storageOwnerId: persistenceOwnerId,
        });

      if (lapidaryRewards.grantedRecipeIds.length > 0) {
        setState(lapidaryRewards.state);
        return;
      }
    }

    if (!hasEnsuredBestiarySightedRecipeRewardsRef.current) {
      hasEnsuredBestiarySightedRecipeRewardsRef.current = true;
      const bestiaryRewards =
        ensuringWorldPlazaInventoryBestiarySightedRecipeRewards(state, {
          storageOwnerId: persistenceOwnerId,
        });

      if (bestiaryRewards.grantedRecipeIds.length > 0) {
        setState(bestiaryRewards.state);
      }
    }
  }, [
    isKingpinAccount,
    isLoading,
    isLoaded,
    onlineUserId,
    persistenceOwnerId,
    seedDemoItems,
    setState,
    state,
    unlockedCapacity,
  ]);

  return {
    ...engine,
    moveItem,
    addItem,
    addItemWithStacking,
  };
}
