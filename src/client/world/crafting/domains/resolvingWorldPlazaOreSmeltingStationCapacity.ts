/**
 * Station chamber capacity from inventory maxStack.
 *
 * @module components/world/crafting/domains/resolvingWorldPlazaOreSmeltingStationCapacity
 */

import { resolvingWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemTypeDefinition';

/** Fallback when an item type is unknown (should not happen for recipe inputs). */
export const DEFINING_WORLD_PLAZA_ORE_SMELTING_STATION_DEFAULT_CAPACITY = 99;

/**
 * Max units a station input / fuel / output chamber may hold for one item type.
 * Uses the item's inventory `maxStack` so cups stay at 8 and ores at 99.
 */
export function resolvingWorldPlazaOreSmeltingStationCapacity(
  itemTypeId: string
): number {
  const typeDefinition =
    resolvingWorldPlazaInventoryItemTypeDefinition(itemTypeId);

  if (!typeDefinition) {
    return DEFINING_WORLD_PLAZA_ORE_SMELTING_STATION_DEFAULT_CAPACITY;
  }

  if (!typeDefinition.isStackable || typeDefinition.maxStack <= 1) {
    return 1;
  }

  return typeDefinition.maxStack;
}
