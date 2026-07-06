import { DEFINING_WORLD_PLAZA_INVENTORY_BAG_DEFINITION_BY_TYPE_ID } from '@/components/world/inventory/domains/definingWorldPlazaInventoryBagConstants';

/**
 * Returns true when the item type id is a registered bag container.
 *
 * @param itemTypeId - Inventory item type id
 */
export function checkingWorldPlazaInventoryItemIsBag(
  itemTypeId: string
): boolean {
  return itemTypeId in DEFINING_WORLD_PLAZA_INVENTORY_BAG_DEFINITION_BY_TYPE_ID;
}
