/**
 * Grants the Campfire recipe page once when the player still needs it.
 *
 * @module components/world/inventory/domains/ensuringWorldPlazaInventoryCampfireRecipePage
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { countingWorldPlazaInventoryItemTypeQuantity } from '@/components/world/crafting/domains/countingWorldPlazaInventoryItemTypeQuantity';
import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID,
  resolvingWorldPlazaCraftRecipePageItemTypeId,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { checkingWorldPlazaRecipePageAttachedInStore } from '@/components/world/domains/managingWorldPlazaRecipeDiscoveryStore';
import { readingWorldPlazaRecipeDiscoveryFromStorage } from '@/components/world/domains/readingWorldPlazaRecipeDiscoveryFromStorage';
import { addingWorldPlazaInventoryItemWithStacking } from '@/components/world/inventory/domains/addingWorldPlazaInventoryItemWithStacking';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';

const CAMPFIRE_RECIPE_PAGE_ITEM_TYPE_ID =
  resolvingWorldPlazaCraftRecipePageItemTypeId(
    DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CAMPFIRE
  );

export type EnsuringWorldPlazaInventoryCampfireRecipePageOptions = {
  /** Persistence owner used when the in-memory attach store is not hydrated yet. */
  readonly storageOwnerId?: string | null;
};

function checkingCampfireRecipeAlreadyAttached(
  storageOwnerId: string | null | undefined
): boolean {
  if (
    checkingWorldPlazaRecipePageAttachedInStore(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CAMPFIRE
    )
  ) {
    return true;
  }

  if (!storageOwnerId) {
    return false;
  }

  return readingWorldPlazaRecipeDiscoveryFromStorage(
    storageOwnerId
  ).attachedRecipeIds.has(DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CAMPFIRE);
}

/**
 * Adds one Campfire recipe page when the player has neither attached the recipe
 * nor already holds the page item.
 *
 * @param state - Loaded inventory state
 * @param options - Optional storage owner for attach lookup
 */
export function ensuringWorldPlazaInventoryCampfireRecipePage(
  state: DefiningInventoryState,
  options: EnsuringWorldPlazaInventoryCampfireRecipePageOptions = {}
): DefiningInventoryState {
  if (checkingCampfireRecipeAlreadyAttached(options.storageOwnerId)) {
    return state;
  }

  if (
    countingWorldPlazaInventoryItemTypeQuantity(
      state,
      CAMPFIRE_RECIPE_PAGE_ITEM_TYPE_ID
    ) > 0
  ) {
    return state;
  }

  return addingWorldPlazaInventoryItemWithStacking(
    state,
    {
      id: crypto.randomUUID(),
      itemTypeId: CAMPFIRE_RECIPE_PAGE_ITEM_TYPE_ID,
      quantity: 1,
    },
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
  ).state;
}
