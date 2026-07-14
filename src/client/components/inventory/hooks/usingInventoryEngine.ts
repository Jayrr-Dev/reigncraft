'use client';

import {
  DEFINING_INVENTORY_DEFAULT_CAPACITY,
  DEFINING_INVENTORY_PERSIST_DEBOUNCE_MS,
  DEFINING_INVENTORY_QUERY_KEY_ROOT,
} from '@/components/inventory/domains/definingInventoryConstants';
import { parsingInventoryItemDraggableId } from '@/components/inventory/domains/definingInventoryDndIds';
import type {
  DefiningInventoryItemInput,
  DefiningInventoryState,
} from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import type { DefiningInventoryPersistenceAdapter } from '@/components/inventory/domains/definingInventoryPersistenceAdapter';
import {
  addingInventoryItem,
  addingInventoryItemWithStacking,
  comparingInventoryItemsByTypeId,
  creatingEmptyInventoryState,
  movingInventoryItemToSlot,
  removingInventoryItemFromSlot,
  resolvingInventoryItemSlotIndex,
  sortingInventoryItems,
  type DefiningInventoryItemComparator,
} from '@/components/inventory/domains/reducingInventoryState';
import { resolvingInventoryHotbarSlotIndexFromOverId } from '@/components/inventory/domains/resolvingInventoryHotbarSlotIndexFromOverId';
import type { DragEndEvent } from '@dnd-kit/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef } from 'react';

/** Options for {@link usingInventoryEngine}. */
export interface UsingInventoryEngineOptions {
  /** Item type registry. */
  readonly registry: DefiningInventoryItemRegistry;
  /** Persistence adapter. */
  readonly adapter: DefiningInventoryPersistenceAdapter;
  /** Slot capacity (default 9). */
  readonly capacity?: number;
  /** TanStack Query key suffix (scopes cache per consumer). */
  readonly queryKeySuffix: string;
  /** When true, query is enabled. */
  readonly enabled?: boolean;
}

/** Return shape for {@link usingInventoryEngine}. */
export interface UsingInventoryEngineResult {
  readonly state: DefiningInventoryState;
  readonly isLoading: boolean;
  /** True once the initial load resolved successfully (safe to seed/mutate). */
  readonly isLoaded: boolean;
  readonly moveItem: (fromSlotIndex: number, toSlotIndex: number) => void;
  readonly removeItem: (slotIndex: number) => void;
  readonly addItem: (
    itemInput: DefiningInventoryItemInput,
    targetSlotIndex?: number
  ) => void;
  readonly addItemWithStacking: (itemInput: DefiningInventoryItemInput) => {
    quantityAccepted: number;
    quantityOverflow: number;
  };
  readonly sortItems: (comparator?: DefiningInventoryItemComparator) => void;
  readonly handleDragEnd: (event: DragEndEvent) => void;
  readonly setState: (nextState: DefiningInventoryState) => void;
  /**
   * Atomically derives the next state from the freshest cached state.
   * Return null from the updater to skip the commit.
   */
  readonly updateState: (
    updater: (
      currentState: DefiningInventoryState
    ) => DefiningInventoryState | null
  ) => void;
  /** Writes the latest cached state immediately (skips debounce). */
  readonly flushingPersist: () => void;
}

/**
 * Resolves the TanStack Query key for an inventory instance.
 *
 * @param queryKeySuffix - Consumer-specific suffix
 */
function resolvingInventoryQueryKey(
  queryKeySuffix: string
): readonly [string, string] {
  return [DEFINING_INVENTORY_QUERY_KEY_ROOT, queryKeySuffix];
}

/**
 * Generic inventory engine hook: loads state via adapter, exposes reducer
 * actions, persists on change (debounced), and maps dnd-kit drag events.
 *
 * @param options - Registry, adapter, capacity, and query key
 */
export function usingInventoryEngine(
  options: UsingInventoryEngineOptions
): UsingInventoryEngineResult {
  const {
    registry,
    adapter,
    capacity = DEFINING_INVENTORY_DEFAULT_CAPACITY,
    queryKeySuffix,
    enabled = true,
  } = options;

  const queryClient = useQueryClient();
  const queryKey = useMemo(
    () => resolvingInventoryQueryKey(queryKeySuffix),
    [queryKeySuffix]
  );

  const persistTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasPendingPersistRef = useRef(false);
  const adapterRef = useRef(adapter);
  adapterRef.current = adapter;

  const {
    data: loadedState,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey,
    queryFn: async (): Promise<DefiningInventoryState> => {
      const persisted = await adapter.load();
      return persisted ?? creatingEmptyInventoryState(capacity);
    },
    enabled,
    staleTime: Infinity,
  });

  const state = loadedState ?? creatingEmptyInventoryState(capacity);

  const persistMutation = useMutation({
    mutationFn: async (nextState: DefiningInventoryState): Promise<void> => {
      await adapter.save(nextState);
    },
  });
  const persistMutateRef = useRef(persistMutation.mutate);
  persistMutateRef.current = persistMutation.mutate;

  /**
   * Reads the freshest committed state from the shared query cache so
   * concurrent mutations (multiple hook consumers, rapid pickups between
   * renders) never overwrite each other with stale render-closure state.
   */
  const readingCurrentState = useCallback((): DefiningInventoryState => {
    return (
      queryClient.getQueryData<DefiningInventoryState>(queryKey) ??
      creatingEmptyInventoryState(capacity)
    );
  }, [queryClient, queryKey, capacity]);

  const flushingPendingPersist = useCallback((): void => {
    if (!hasPendingPersistRef.current) {
      return;
    }

    if (persistTimeoutRef.current) {
      clearTimeout(persistTimeoutRef.current);
      persistTimeoutRef.current = null;
    }

    hasPendingPersistRef.current = false;
    const latestState =
      queryClient.getQueryData<DefiningInventoryState>(queryKey);

    if (latestState) {
      void adapterRef.current.save(latestState);
    }
  }, [queryClient, queryKey]);

  const committingState = useCallback(
    (nextState: DefiningInventoryState): void => {
      queryClient.setQueryData(queryKey, nextState);
      hasPendingPersistRef.current = true;

      if (persistTimeoutRef.current) {
        clearTimeout(persistTimeoutRef.current);
      }

      persistTimeoutRef.current = setTimeout(() => {
        persistTimeoutRef.current = null;
        hasPendingPersistRef.current = false;
        // Persist the freshest cache state so a stale debounce never wins.
        const latestState =
          queryClient.getQueryData<DefiningInventoryState>(queryKey);
        persistMutateRef.current(latestState ?? nextState);
      }, DEFINING_INVENTORY_PERSIST_DEBOUNCE_MS);
    },
    [queryClient, queryKey]
  );

  // Flush (never drop) any pending debounced save when the consumer unmounts
  // or the page is being hidden/closed, so last-moment pickups still persist.
  useEffect(() => {
    if (typeof window === 'undefined') {
      return flushingPendingPersist;
    }

    window.addEventListener('pagehide', flushingPendingPersist);
    window.addEventListener('beforeunload', flushingPendingPersist);

    return () => {
      window.removeEventListener('pagehide', flushingPendingPersist);
      window.removeEventListener('beforeunload', flushingPendingPersist);
      flushingPendingPersist();
    };
  }, [flushingPendingPersist]);

  const setState = useCallback(
    (nextState: DefiningInventoryState): void => {
      committingState(nextState);
    },
    [committingState]
  );

  const updateState = useCallback(
    (
      updater: (
        currentState: DefiningInventoryState
      ) => DefiningInventoryState | null
    ): void => {
      const nextState = updater(readingCurrentState());

      if (nextState !== null) {
        committingState(nextState);
      }
    },
    [readingCurrentState, committingState]
  );

  const moveItem = useCallback(
    (fromSlotIndex: number, toSlotIndex: number): void => {
      const nextState = movingInventoryItemToSlot(
        readingCurrentState(),
        fromSlotIndex,
        toSlotIndex,
        registry
      );
      committingState(nextState);
    },
    [readingCurrentState, registry, committingState]
  );

  const removeItem = useCallback(
    (slotIndex: number): void => {
      const currentState = readingCurrentState();
      const item = currentState.slots[slotIndex];

      if (!item) {
        return;
      }

      const typeDef = registry.resolvingItemType(item.itemTypeId);

      if (typeDef && !typeDef.isDroppable) {
        return;
      }

      const nextState = removingInventoryItemFromSlot(currentState, slotIndex);
      committingState(nextState);
    },
    [readingCurrentState, registry, committingState]
  );

  const addItem = useCallback(
    (itemInput: DefiningInventoryItemInput, targetSlotIndex?: number): void => {
      const nextState = addingInventoryItem(
        readingCurrentState(),
        itemInput,
        targetSlotIndex
      );
      committingState(nextState);
    },
    [readingCurrentState, committingState]
  );

  const addItemWithStacking = useCallback(
    (itemInput: DefiningInventoryItemInput) => {
      const result = addingInventoryItemWithStacking(
        readingCurrentState(),
        itemInput,
        registry
      );
      committingState(result.state);
      return {
        quantityAccepted: result.quantityAccepted,
        quantityOverflow: result.quantityOverflow,
      };
    },
    [readingCurrentState, registry, committingState]
  );

  const sortItems = useCallback(
    (
      comparator: DefiningInventoryItemComparator = comparingInventoryItemsByTypeId
    ): void => {
      const nextState = sortingInventoryItems(
        readingCurrentState(),
        comparator
      );
      committingState(nextState);
    },
    [readingCurrentState, committingState]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent): void => {
      const { active, over } = event;
      const activeId = String(active.id);

      const fromItemId = parsingInventoryItemDraggableId(activeId);
      const fromSlotIndex =
        fromItemId !== null
          ? resolvingInventoryItemSlotIndex(readingCurrentState(), fromItemId)
          : null;

      if (fromSlotIndex === null) {
        return;
      }

      if (!over) {
        removeItem(fromSlotIndex);
        return;
      }

      const toSlotIndex = resolvingInventoryHotbarSlotIndexFromOverId(
        String(over.id),
        readingCurrentState()
      );

      if (toSlotIndex === null) {
        removeItem(fromSlotIndex);
        return;
      }

      moveItem(fromSlotIndex, toSlotIndex);
    },
    [readingCurrentState, moveItem, removeItem]
  );

  return {
    state,
    isLoading,
    isLoaded: isSuccess,
    moveItem,
    removeItem,
    addItem,
    addItemWithStacking,
    sortItems,
    handleDragEnd,
    setState,
    updateState,
    flushingPersist: flushingPendingPersist,
  };
}
