"use client";

import type { DefiningInventoryItemInput } from "@/components/inventory/domains/definingInventoryItem";
import type { DefiningInventoryItemRegistry } from "@/components/inventory/domains/definingInventoryItemRegistry";
import type { DefiningInventoryPersistenceAdapter } from "@/components/inventory/domains/definingInventoryPersistenceAdapter";
import {
  DEFINING_INVENTORY_DEFAULT_CAPACITY,
  DEFINING_INVENTORY_PERSIST_DEBOUNCE_MS,
  DEFINING_INVENTORY_QUERY_KEY_ROOT,
} from "@/components/inventory/domains/definingInventoryConstants";
import {
  parsingInventoryItemDraggableId,
  parsingInventorySlotDroppableId,
} from "@/components/inventory/domains/definingInventoryDndIds";
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
} from "@/components/inventory/domains/reducingInventoryState";
import type { DefiningInventoryState } from "@/components/inventory/domains/definingInventoryItem";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DragEndEvent } from "@dnd-kit/core";
import { useCallback, useEffect, useMemo, useRef } from "react";

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
  readonly moveItem: (fromSlotIndex: number, toSlotIndex: number) => void;
  readonly removeItem: (slotIndex: number) => void;
  readonly addItem: (
    itemInput: DefiningInventoryItemInput,
    targetSlotIndex?: number,
  ) => void;
  readonly addItemWithStacking: (
    itemInput: DefiningInventoryItemInput,
  ) => { quantityAccepted: number; quantityOverflow: number };
  readonly sortItems: (
    comparator?: DefiningInventoryItemComparator,
  ) => void;
  readonly handleDragEnd: (event: DragEndEvent) => void;
  readonly setState: (nextState: DefiningInventoryState) => void;
}

/**
 * Resolves the TanStack Query key for an inventory instance.
 *
 * @param queryKeySuffix - Consumer-specific suffix
 */
function resolvingInventoryQueryKey(
  queryKeySuffix: string,
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
  options: UsingInventoryEngineOptions,
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
    [queryKeySuffix],
  );

  const persistTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: loadedState, isLoading } = useQuery({
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

  const committingState = useCallback(
    (nextState: DefiningInventoryState): void => {
      queryClient.setQueryData(queryKey, nextState);

      if (persistTimeoutRef.current) {
        clearTimeout(persistTimeoutRef.current);
      }

      persistTimeoutRef.current = setTimeout(() => {
        persistMutation.mutate(nextState);
      }, DEFINING_INVENTORY_PERSIST_DEBOUNCE_MS);
    },
    [queryClient, queryKey, persistMutation],
  );

  useEffect(() => {
    return () => {
      if (persistTimeoutRef.current) {
        clearTimeout(persistTimeoutRef.current);
      }
    };
  }, []);

  const setState = useCallback(
    (nextState: DefiningInventoryState): void => {
      committingState(nextState);
    },
    [committingState],
  );

  const moveItem = useCallback(
    (fromSlotIndex: number, toSlotIndex: number): void => {
      const nextState = movingInventoryItemToSlot(
        state,
        fromSlotIndex,
        toSlotIndex,
        registry,
      );
      committingState(nextState);
    },
    [state, registry, committingState],
  );

  const removeItem = useCallback(
    (slotIndex: number): void => {
      const currentState =
        queryClient.getQueryData<DefiningInventoryState>(queryKey) ??
        creatingEmptyInventoryState(capacity);
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
    [capacity, queryClient, queryKey, registry, committingState],
  );

  const addItem = useCallback(
    (
      itemInput: DefiningInventoryItemInput,
      targetSlotIndex?: number,
    ): void => {
      const nextState = addingInventoryItem(state, itemInput, targetSlotIndex);
      committingState(nextState);
    },
    [state, committingState],
  );

  const addItemWithStacking = useCallback(
    (itemInput: DefiningInventoryItemInput) => {
      const result = addingInventoryItemWithStacking(state, itemInput, registry);
      committingState(result.state);
      return {
        quantityAccepted: result.quantityAccepted,
        quantityOverflow: result.quantityOverflow,
      };
    },
    [state, registry, committingState],
  );

  const sortItems = useCallback(
    (comparator: DefiningInventoryItemComparator = comparingInventoryItemsByTypeId): void => {
      const nextState = sortingInventoryItems(state, comparator);
      committingState(nextState);
    },
    [state, committingState],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent): void => {
      const { active, over } = event;
      const activeId = String(active.id);

      const fromItemId = parsingInventoryItemDraggableId(activeId);
      const fromSlotIndex =
        fromItemId !== null
          ? resolvingInventoryItemSlotIndex(state, fromItemId)
          : null;

      if (fromSlotIndex === null) {
        return;
      }

      if (!over) {
        removeItem(fromSlotIndex);
        return;
      }

      const toSlotIndex = parsingInventorySlotDroppableId(String(over.id));

      if (toSlotIndex === null) {
        removeItem(fromSlotIndex);
        return;
      }

      moveItem(fromSlotIndex, toSlotIndex);
    },
    [state, moveItem, removeItem],
  );

  return {
    state,
    isLoading,
    moveItem,
    removeItem,
    addItem,
    addItemWithStacking,
    sortItems,
    handleDragEnd,
    setState,
  };
}
