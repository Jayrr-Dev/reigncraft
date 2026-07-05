/**
 * Maps inventory item type ids to hunger restoration values.
 *
 * @module components/world/hunger/domains/definingWorldPlazaInventoryFoodRegistry
 */

import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_APPLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRIES,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_MEAT,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import {
  DEFINING_WORLD_PLAZA_HUNGER_RESTORE_APPLE,
  DEFINING_WORLD_PLAZA_HUNGER_RESTORE_BERRIES,
  DEFINING_WORLD_PLAZA_HUNGER_RESTORE_COOKED_MEAT,
} from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';

/** Food metadata describing how much hunger one unit restores when eaten. */
export type DefiningWorldPlazaInventoryFoodDefinition = {
  readonly itemTypeId: string;
  readonly hungerRestoreRatio: number;
};

/** Registry of all consumable food item types. */
export const DEFINING_WORLD_PLAZA_INVENTORY_FOOD_REGISTRY: Readonly<
  Record<string, DefiningWorldPlazaInventoryFoodDefinition>
> = {
  [DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRIES]: {
    itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRIES,
    hungerRestoreRatio: DEFINING_WORLD_PLAZA_HUNGER_RESTORE_BERRIES,
  },
  [DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_APPLE]: {
    itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_APPLE,
    hungerRestoreRatio: DEFINING_WORLD_PLAZA_HUNGER_RESTORE_APPLE,
  },
  [DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_MEAT]: {
    itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_MEAT,
    hungerRestoreRatio: DEFINING_WORLD_PLAZA_HUNGER_RESTORE_COOKED_MEAT,
  },
};

/**
 * Resolves the food definition for an item type id, if it is edible.
 *
 * @param itemTypeId - Inventory item type id.
 */
export function resolvingWorldPlazaInventoryFoodDefinition(
  itemTypeId: string
): DefiningWorldPlazaInventoryFoodDefinition | null {
  return DEFINING_WORLD_PLAZA_INVENTORY_FOOD_REGISTRY[itemTypeId] ?? null;
}

/**
 * Whether an item type id is edible food.
 *
 * @param itemTypeId - Inventory item type id.
 */
export function checkingWorldPlazaInventoryItemIsFood(
  itemTypeId: string
): boolean {
  return itemTypeId in DEFINING_WORLD_PLAZA_INVENTORY_FOOD_REGISTRY;
}
