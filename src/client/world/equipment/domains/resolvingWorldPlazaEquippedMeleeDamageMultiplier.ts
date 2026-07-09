/**
 * Resolves equipped melee damage multiplier from the hotbar selection.
 *
 * @module components/world/equipment/domains/resolvingWorldPlazaEquippedMeleeDamageMultiplier
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId } from '@/components/world/equipment/domains/resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId';

/**
 * Returns 1 when unarmed or when the equipped item has no melee multiplier.
 */
export function resolvingWorldPlazaEquippedMeleeDamageMultiplier(
  inventoryState: DefiningInventoryState,
  selectedSlotIndex: number | null
): number {
  if (selectedSlotIndex === null) {
    return 1;
  }

  const slotItem = inventoryState.slots[selectedSlotIndex];

  if (!slotItem) {
    return 1;
  }

  const capabilities = resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId(
    slotItem.itemTypeId
  );

  return capabilities?.meleeDamageMultiplier ?? 1;
}
