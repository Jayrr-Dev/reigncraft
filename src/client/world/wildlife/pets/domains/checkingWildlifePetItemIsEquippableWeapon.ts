/**
 * Validates whether an inventory item may be equipped as a pet weapon.
 *
 * @module components/world/wildlife/pets/domains/checkingWildlifePetItemIsEquippableWeapon
 */

import type { DefiningInventoryItem } from '@/components/inventory/domains/definingInventoryItem';
import { checkingWorldPlazaInventoryItemIsWeaponOrTool } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemIsWeaponOrTool';

/** True when the item is a weapon or tool the pet can wield. */
export function checkingWildlifePetItemIsEquippableWeapon(
  item: DefiningInventoryItem | null | undefined
): boolean {
  if (!item) {
    return false;
  }

  return checkingWorldPlazaInventoryItemIsWeaponOrTool(item.itemTypeId);
}

/** Validates an item type id without a full inventory instance. */
export function checkingWildlifePetItemTypeIdIsEquippableWeapon(
  itemTypeId: string | null | undefined
): boolean {
  if (!itemTypeId) {
    return false;
  }

  return checkingWorldPlazaInventoryItemIsWeaponOrTool(itemTypeId);
}
