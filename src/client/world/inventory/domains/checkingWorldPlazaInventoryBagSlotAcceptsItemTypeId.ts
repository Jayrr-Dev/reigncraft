import { checkingWorldPlazaInventoryItemIsBag } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemIsBag';

/**
 * Returns true when an item type may be stored inside a bag slot.
 *
 * @param itemTypeId - Dragged or placed item type id
 */
export function checkingWorldPlazaInventoryBagSlotAcceptsItemTypeId(
  itemTypeId: string
): boolean {
  return !checkingWorldPlazaInventoryItemIsBag(itemTypeId);
}
