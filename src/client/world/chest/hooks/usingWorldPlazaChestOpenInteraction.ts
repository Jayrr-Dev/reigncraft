/**
 * Opens a closed world chest: validates range, grants loot, persists opened.
 *
 * @module components/world/chest/hooks/usingWorldPlazaChestOpenInteraction
 */

'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { DEFINING_WORLD_PLAZA_CHEST_INTERACT_REACH_GRID } from '@/components/world/chest/domains/definingWorldPlazaChestConstants';
import { DEFINING_WORLD_PLAZA_FIRST_WORLD_CHEST_RECIPE_ID } from '@/components/world/chest/domains/definingWorldPlazaFirstWorldChestRecipeRewardConstants';
import { ensuringWorldPlazaInventoryFirstWorldChestRecipeReward } from '@/components/world/chest/domains/ensuringWorldPlazaInventoryFirstWorldChestRecipeReward';
import type { ListingWorldPlazaChestsInInteractionRangeEntry } from '@/components/world/chest/domains/listingWorldPlazaChestsInInteractionRange';
import {
  gettingWorldPlazaChestInstance,
  openingWorldPlazaChest,
  unlockingAndOpeningWorldPlazaChest,
} from '@/components/world/chest/domains/managingWorldPlazaChestInstanceStore';
import {
  listingWorldPlazaLocalOpenedChestIds,
  openingWorldPlazaLocalChest,
} from '@/components/world/chest/domains/managingWorldPlazaLocalOpenedChests';
import { resolvingWorldPlazaChestLockedHintToastMessage } from '@/components/world/chest/domains/resolvingWorldPlazaChestLockedHintToastMessage';
import { resolvingWorldPlazaChestLootGrant } from '@/components/world/chest/domains/resolvingWorldPlazaChestLootGrant';
import { countingWorldPlazaInventoryItemTypeQuantity } from '@/components/world/crafting/domains/countingWorldPlazaInventoryItemTypeQuantity';
import { resolvingWorldPlazaCraftRecipePageItemTypeId } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_RECIPE_IDS } from '@/components/world/crafting/domains/definingWorldPlazaRecipePageLootPoolConstants';
import {
  resolvingWorldPlazaRecipePageLootDrop,
  resolvingWorldPlazaRecipePageLootExcludedAttachedRecipeIds,
} from '@/components/world/crafting/domains/resolvingWorldPlazaRecipePageLootDrop';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaRecipePageAttachedInStore } from '@/components/world/domains/managingWorldPlazaRecipeDiscoveryStore';
import { readingWorldPlazaRecipeDiscoveryFromStorage } from '@/components/world/domains/readingWorldPlazaRecipeDiscoveryFromStorage';
import { addingWorldPlazaInventoryItemWithStacking } from '@/components/world/inventory/domains/addingWorldPlazaInventoryItemWithStacking';
import { countingWorldPlazaInventoryItemQuantityByTypeId } from '@/components/world/inventory/domains/countingWorldPlazaInventoryItemQuantityByTypeId';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CHEST_KEY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { notifyingWorldPlazaInventoryItemAdded } from '@/components/world/inventory/domains/notifyingWorldPlazaInventoryItemAdded';
import { removingWorldPlazaInventoryItemQuantityByTypeId } from '@/components/world/inventory/domains/removingWorldPlazaInventoryItemQuantityByTypeId';
import { showingWorldPlazaInventoryItemPickupToast } from '@/components/world/inventory/domains/showingWorldPlazaInventoryItemPickupToast';
import { playingWildlifeStudySfx } from '@/components/world/wildlife/domains/playingWildlifeStudySfx';
import { useCallback, useRef } from 'react';

export type UsingWorldPlazaChestOpenInteractionParams = {
  readonly localPersistenceOwnerId: string | null;
  readonly playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  readonly inventoryState: DefiningInventoryState;
  readonly updatingInventoryState: (
    updater: (
      currentState: DefiningInventoryState
    ) => DefiningInventoryState | null
  ) => void;
  readonly showingGameplayHudToast: (message: string) => void;
};

export type UsingWorldPlazaChestOpenInteractionResult = {
  readonly openingChest: (
    entry: ListingWorldPlazaChestsInInteractionRangeEntry
  ) => void;
  readonly showingLockedChestHint: (
    entry: ListingWorldPlazaChestsInInteractionRangeEntry
  ) => void;
};

function probingWorldPlazaChestInventoryCapacity(
  inventoryState: DefiningInventoryState,
  grants: readonly { readonly itemTypeId: string; readonly quantity: number }[]
): boolean {
  let probeState = inventoryState;

  for (const grant of grants) {
    if (grant.quantity <= 0) {
      continue;
    }

    const capacityProbe = addingWorldPlazaInventoryItemWithStacking(
      probeState,
      {
        id: 'chest-open-capacity-probe',
        itemTypeId: grant.itemTypeId,
        quantity: grant.quantity,
      },
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
    );

    if (capacityProbe.quantityAccepted < grant.quantity) {
      return false;
    }

    probeState = capacityProbe.state;
  }

  return true;
}

function grantingWorldPlazaChestLootToInventory(
  inventoryState: DefiningInventoryState,
  grants: readonly { readonly itemTypeId: string; readonly quantity: number }[]
): DefiningInventoryState | null {
  let nextState = inventoryState;

  for (const grant of grants) {
    if (grant.quantity <= 0) {
      continue;
    }

    const addResult = addingWorldPlazaInventoryItemWithStacking(
      nextState,
      {
        id: crypto.randomUUID(),
        itemTypeId: grant.itemTypeId,
        quantity: grant.quantity,
      },
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
    );

    if (addResult.quantityAccepted < grant.quantity) {
      return null;
    }

    notifyingWorldPlazaInventoryItemAdded(addResult.quantityAccepted);
    showingWorldPlazaInventoryItemPickupToast({
      itemTypeId: grant.itemTypeId,
      quantity: addResult.quantityAccepted,
    });
    nextState = addResult.state;
  }

  return nextState;
}

/**
 * Validates range / capacity and opens a closed chest once.
 */
export function usingWorldPlazaChestOpenInteraction({
  localPersistenceOwnerId,
  playerPositionRef,
  inventoryState,
  updatingInventoryState,
  showingGameplayHudToast,
}: UsingWorldPlazaChestOpenInteractionParams): UsingWorldPlazaChestOpenInteractionResult {
  const isCompletionPendingRef = useRef(false);
  const inventoryStateRef = useRef(inventoryState);
  inventoryStateRef.current = inventoryState;
  const persistenceOwnerId = localPersistenceOwnerId;

  const openingChest = useCallback(
    (entry: ListingWorldPlazaChestsInInteractionRangeEntry): void => {
      if (entry.isDisabled) {
        return;
      }

      if (entry.action !== 'open' && entry.action !== 'unlock') {
        return;
      }

      if (isCompletionPendingRef.current || !persistenceOwnerId) {
        if (!persistenceOwnerId) {
          showingGameplayHudToast('Chests are unavailable in this session.');
        }
        return;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      const instance = gettingWorldPlazaChestInstance(entry.chestId);

      if (!instance) {
        return;
      }

      if (entry.action === 'open' && instance.state !== 'closed') {
        return;
      }

      if (entry.action === 'unlock' && instance.state !== 'locked') {
        return;
      }

      const dx = instance.position.x - playerPosition.x;
      const dy = instance.position.y - playerPosition.y;
      const reach = DEFINING_WORLD_PLAZA_CHEST_INTERACT_REACH_GRID;

      if (dx * dx + dy * dy > reach * reach) {
        showingGameplayHudToast(
          entry.action === 'unlock'
            ? 'Move closer to unlock this chest.'
            : 'Move closer to open this chest.'
        );
        return;
      }

      const grants = resolvingWorldPlazaChestLootGrant(
        instance.loot,
        instance.chestId,
        {
          worldX: instance.position.x,
          worldY: instance.position.y,
        }
      );
      const isFirstWorldChestOpen =
        listingWorldPlazaLocalOpenedChestIds(persistenceOwnerId).size === 0;
      const firstChestRecipePageTypeId =
        resolvingWorldPlazaCraftRecipePageItemTypeId(
          DEFINING_WORLD_PLAZA_FIRST_WORLD_CHEST_RECIPE_ID
        );
      const alreadyHasFirstChestRecipePage =
        countingWorldPlazaInventoryItemTypeQuantity(
          inventoryStateRef.current,
          firstChestRecipePageTypeId
        ) > 0 ||
        checkingWorldPlazaRecipePageAttachedInStore(
          DEFINING_WORLD_PLAZA_FIRST_WORLD_CHEST_RECIPE_ID
        ) ||
        readingWorldPlazaRecipeDiscoveryFromStorage(
          persistenceOwnerId
        ).attachedRecipeIds.has(
          DEFINING_WORLD_PLAZA_FIRST_WORLD_CHEST_RECIPE_ID
        );
      const firstChestRecipeGrants =
        isFirstWorldChestOpen && !alreadyHasFirstChestRecipePage
          ? [
              {
                itemTypeId: firstChestRecipePageTypeId,
                quantity: 1,
              },
            ]
          : [];
      const excludedRecipePageLootIds =
        resolvingWorldPlazaRecipePageLootExcludedAttachedRecipeIds();
      for (const recipeId of DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_RECIPE_IDS) {
        if (
          countingWorldPlazaInventoryItemTypeQuantity(
            inventoryStateRef.current,
            resolvingWorldPlazaCraftRecipePageItemTypeId(recipeId)
          ) > 0
        ) {
          excludedRecipePageLootIds.add(recipeId);
        }
      }
      const recipePageLootDrop = resolvingWorldPlazaRecipePageLootDrop({
        source: 'chest',
        excludedRecipeIds: excludedRecipePageLootIds,
      });
      const recipePageLootGrants = recipePageLootDrop
        ? [
            {
              itemTypeId: recipePageLootDrop.itemTypeId,
              quantity: recipePageLootDrop.quantity,
            },
          ]
        : [];
      const allGrants = [
        ...grants,
        ...firstChestRecipeGrants,
        ...recipePageLootGrants,
      ];

      let inventoryProbeState = inventoryStateRef.current;

      if (entry.action === 'unlock') {
        const keyCount = countingWorldPlazaInventoryItemQuantityByTypeId(
          inventoryProbeState,
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CHEST_KEY
        );

        if (keyCount < 1) {
          showingGameplayHudToast('You need a chest key.');
          return;
        }

        const keyRemovalProbe = removingWorldPlazaInventoryItemQuantityByTypeId(
          inventoryProbeState,
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CHEST_KEY,
          1
        );

        if (!keyRemovalProbe) {
          showingGameplayHudToast('You need a chest key.');
          return;
        }

        inventoryProbeState = keyRemovalProbe.state;
      }

      if (
        allGrants.length > 0 &&
        !probingWorldPlazaChestInventoryCapacity(inventoryProbeState, allGrants)
      ) {
        showingGameplayHudToast('Your inventory is full.');
        return;
      }

      isCompletionPendingRef.current = true;

      try {
        let didApplyInventoryUpdate = false;
        let firstChestRewardToast: string | null = null;

        updatingInventoryState((currentState) => {
          let nextState = currentState;

          if (entry.action === 'unlock') {
            const keyRemoval = removingWorldPlazaInventoryItemQuantityByTypeId(
              nextState,
              DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CHEST_KEY,
              1
            );

            if (!keyRemoval) {
              return null;
            }

            nextState = keyRemoval.state;
          }

          const grantedState = grantingWorldPlazaChestLootToInventory(
            nextState,
            grants
          );

          if (!grantedState) {
            return null;
          }

          nextState = grantedState;

          if (isFirstWorldChestOpen) {
            const recipeReward =
              ensuringWorldPlazaInventoryFirstWorldChestRecipeReward(
                nextState,
                {
                  storageOwnerId: persistenceOwnerId,
                  openedWorldChestCount: 1,
                }
              );
            nextState = recipeReward.state;
            firstChestRewardToast = recipeReward.rewardToast;

            if (recipeReward.grantedRecipeId) {
              notifyingWorldPlazaInventoryItemAdded(1);
              showingWorldPlazaInventoryItemPickupToast({
                itemTypeId: resolvingWorldPlazaCraftRecipePageItemTypeId(
                  recipeReward.grantedRecipeId
                ),
                quantity: 1,
              });
            }
          }

          didApplyInventoryUpdate = true;
          return nextState;
        });

        if (!didApplyInventoryUpdate) {
          showingGameplayHudToast('Your inventory is full.');
          return;
        }

        const opened =
          entry.action === 'unlock'
            ? unlockingAndOpeningWorldPlazaChest(entry.chestId)
            : openingWorldPlazaChest(entry.chestId);

        if (!opened) {
          return;
        }

        openingWorldPlazaLocalChest(persistenceOwnerId, entry.chestId);
        playingWildlifeStudySfx({ sectionId: 'chest' });

        if (firstChestRewardToast) {
          playingWildlifeStudySfx({ sectionId: 'recipe' });
          showingGameplayHudToast(firstChestRewardToast);
        }
      } finally {
        isCompletionPendingRef.current = false;
      }
    },
    [
      persistenceOwnerId,
      playerPositionRef,
      showingGameplayHudToast,
      updatingInventoryState,
    ]
  );

  const showingLockedChestHint = useCallback(
    (entry: ListingWorldPlazaChestsInInteractionRangeEntry): void => {
      if (entry.action !== 'locked') {
        return;
      }

      const instance = gettingWorldPlazaChestInstance(entry.chestId);

      if (!instance || instance.state !== 'locked') {
        return;
      }

      showingGameplayHudToast(
        resolvingWorldPlazaChestLockedHintToastMessage(instance)
      );
    },
    [showingGameplayHudToast]
  );

  return { openingChest, showingLockedChestHint };
}
