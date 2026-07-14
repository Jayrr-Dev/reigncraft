'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { recordingWorldPlazaHerbariumCloverStudied } from '@/components/world/domains/managingWorldPlazaHerbariumDiscoveryStore';
import type { DefiningWorldPlazaClearedLongGrassTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalClearedLongGrass';
import {
  checkingWorldLongGrassSearchEligibility,
  formattingWorldPlazaClearedLongGrassTileKey,
  searchingWorldPlazaLocalLongGrass,
} from '@/components/world/harvest/domains/managingWorldPlazaLocalClearedLongGrass';
import type { ListingWorldPlazaLongGrassInInteractionRangeEntry } from '@/components/world/harvest/hooks/usingWorldPlazaLongGrassSearchProgress';
import { addingWorldPlazaInventoryItemWithStacking } from '@/components/world/inventory/domains/addingWorldPlazaInventoryItemWithStacking';
import { DEFINING_WORLD_PLAZA_FOUR_LEAF_CLOVER_PICKED_AT_MS_METADATA_KEY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryCloverConstants';
import { resolvingWorldPlazaCloverItemTypeIdFromLootKind } from '@/components/world/inventory/domains/definingWorldPlazaInventoryCloverSpriteSheetConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { notifyingWorldPlazaInventoryItemAdded } from '@/components/world/inventory/domains/notifyingWorldPlazaInventoryItemAdded';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, type RefObject } from 'react';
import {
  resolvingWorldCloverSearchLootKindAtTileIndex,
  WORLD_CLOVER_SEARCH_LOOT_QUANTITY,
} from '../../../../shared/worldCloverSearchLoot';

export const DEFINING_WORLD_PLAZA_CLEARED_LONG_GRASS_QUERY_KEY_ROOT =
  'world-plaza-cleared-long-grass' as const;

export type UsingWorldPlazaLongGrassSearchInteractionParams = {
  readonly localPersistenceOwnerId: string | null;
  readonly clearedLongGrassStateByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaClearedLongGrassTileState
  >;
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly inventoryState: DefiningInventoryState;
  readonly updatingInventoryState: (
    updater: (
      currentState: DefiningInventoryState
    ) => DefiningInventoryState | null
  ) => void;
  readonly showingGameplayHudToast: (message: string) => void;
};

export type UsingWorldPlazaLongGrassSearchInteractionResult = {
  readonly validatingLongGrassSearchStart: (
    entry: ListingWorldPlazaLongGrassInInteractionRangeEntry
  ) => boolean;
  readonly completingLongGrassSearch: (
    entry: ListingWorldPlazaLongGrassInInteractionRangeEntry
  ) => Promise<void>;
};

function probingWorldPlazaLongGrassSearchInventoryCapacity(
  inventoryState: DefiningInventoryState,
  itemTypeId: string,
  quantity: number
): boolean {
  if (quantity <= 0) {
    return false;
  }

  const capacityProbe = addingWorldPlazaInventoryItemWithStacking(
    inventoryState,
    {
      id: 'long-grass-search-capacity-probe',
      itemTypeId,
      quantity,
    },
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
  );

  return capacityProbe.quantityAccepted >= quantity;
}

export function usingWorldPlazaLongGrassSearchInteraction({
  localPersistenceOwnerId,
  clearedLongGrassStateByTileKey,
  playerPositionRef,
  inventoryState,
  updatingInventoryState,
  showingGameplayHudToast,
}: UsingWorldPlazaLongGrassSearchInteractionParams): UsingWorldPlazaLongGrassSearchInteractionResult {
  const queryClient = useQueryClient();
  const isCompletionPendingRef = useRef(false);
  const inventoryStateRef = useRef(inventoryState);
  inventoryStateRef.current = inventoryState;
  const persistenceOwnerId = localPersistenceOwnerId;

  const validatingLongGrassSearchStart = useCallback(
    (entry: ListingWorldPlazaLongGrassInInteractionRangeEntry): boolean => {
      if (!persistenceOwnerId) {
        showingGameplayHudToast('Grass search is unavailable in this session.');
        return false;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      const tileKey = formattingWorldPlazaClearedLongGrassTileKey(
        entry.tileX,
        entry.tileY
      );
      const lootKind = resolvingWorldCloverSearchLootKindAtTileIndex(
        entry.tileX,
        entry.tileY
      );
      const itemTypeId =
        resolvingWorldPlazaCloverItemTypeIdFromLootKind(lootKind);

      const rangeCheck = checkingWorldLongGrassSearchEligibility({
        tileX: entry.tileX,
        tileY: entry.tileY,
        playerX: playerPosition.x,
        playerY: playerPosition.y,
        existingTileState: clearedLongGrassStateByTileKey.get(tileKey),
      });

      if (rangeCheck.outcome === 'out-of-range') {
        showingGameplayHudToast('Move closer to search this grass.');
        return false;
      }

      if (rangeCheck.outcome === 'already-searched') {
        return false;
      }

      if (
        !probingWorldPlazaLongGrassSearchInventoryCapacity(
          inventoryStateRef.current,
          itemTypeId,
          WORLD_CLOVER_SEARCH_LOOT_QUANTITY
        )
      ) {
        showingGameplayHudToast('Your inventory is full.');
        return false;
      }

      return true;
    },
    [
      clearedLongGrassStateByTileKey,
      persistenceOwnerId,
      playerPositionRef,
      showingGameplayHudToast,
    ]
  );

  const completingLongGrassSearch = useCallback(
    async (
      entry: ListingWorldPlazaLongGrassInInteractionRangeEntry
    ): Promise<void> => {
      if (isCompletionPendingRef.current || !persistenceOwnerId) {
        return;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      isCompletionPendingRef.current = true;

      try {
        const lootKind = resolvingWorldCloverSearchLootKindAtTileIndex(
          entry.tileX,
          entry.tileY
        );
        const itemTypeId =
          resolvingWorldPlazaCloverItemTypeIdFromLootKind(lootKind);
        const lootQuantity = WORLD_CLOVER_SEARCH_LOOT_QUANTITY;

        if (
          !probingWorldPlazaLongGrassSearchInventoryCapacity(
            inventoryStateRef.current,
            itemTypeId,
            lootQuantity
          )
        ) {
          showingGameplayHudToast('Your inventory is full.');
          return;
        }

        let quantityAccepted = 0;

        updatingInventoryState((currentState) => {
          const addResult = addingWorldPlazaInventoryItemWithStacking(
            currentState,
            {
              id: crypto.randomUUID(),
              itemTypeId,
              quantity: lootQuantity,
              ...(lootKind === 'four_leaf'
                ? {
                    metadata: {
                      [DEFINING_WORLD_PLAZA_FOUR_LEAF_CLOVER_PICKED_AT_MS_METADATA_KEY]:
                        Date.now(),
                    },
                  }
                : {}),
            },
            DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
          );

          quantityAccepted = addResult.quantityAccepted;

          if (addResult.quantityAccepted < lootQuantity) {
            return null;
          }

          return addResult.state;
        });

        if (quantityAccepted < lootQuantity) {
          showingGameplayHudToast('Your inventory is full.');
          return;
        }

        notifyingWorldPlazaInventoryItemAdded(quantityAccepted);

        const searchResult = searchingWorldPlazaLocalLongGrass(
          persistenceOwnerId,
          {
            tileX: entry.tileX,
            tileY: entry.tileY,
            playerX: playerPosition.x,
            playerY: playerPosition.y,
          }
        );

        if (searchResult.outcome !== 'searched') {
          if (searchResult.outcome === 'out-of-range') {
            showingGameplayHudToast('Move closer to search this grass.');
          }

          return;
        }

        recordingWorldPlazaHerbariumCloverStudied(lootKind);

        const searchedTileKey = formattingWorldPlazaClearedLongGrassTileKey(
          entry.tileX,
          entry.tileY
        );

        queryClient.setQueryData(
          [
            DEFINING_WORLD_PLAZA_CLEARED_LONG_GRASS_QUERY_KEY_ROOT,
            persistenceOwnerId,
          ],
          (
            previous:
              | ReadonlyMap<string, DefiningWorldPlazaClearedLongGrassTileState>
              | undefined
          ) => {
            const next = new Map(previous ?? []);
            const existing = next.get(searchedTileKey);

            next.set(searchedTileKey, {
              ...existing,
              isSearched: true,
            });

            return next;
          }
        );

        void queryClient.invalidateQueries({
          queryKey: [DEFINING_WORLD_PLAZA_CLEARED_LONG_GRASS_QUERY_KEY_ROOT],
        });
      } finally {
        isCompletionPendingRef.current = false;
      }
    },
    [
      persistenceOwnerId,
      playerPositionRef,
      queryClient,
      showingGameplayHudToast,
      updatingInventoryState,
    ]
  );

  return {
    validatingLongGrassSearchStart,
    completingLongGrassSearch,
  };
}
