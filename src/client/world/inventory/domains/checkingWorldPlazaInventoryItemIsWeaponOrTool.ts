import { resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId } from '@/components/world/equipment/domains/resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId';

/**
 * Returns true when an item type is a weapon or tool (has equipment capabilities).
 *
 * @param itemTypeId - Inventory item type id
 */
export function checkingWorldPlazaInventoryItemIsWeaponOrTool(
  itemTypeId: string
): boolean {
  const capabilities =
    resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId(itemTypeId);

  return capabilities !== null && capabilities.toolKinds.length > 0;
}
