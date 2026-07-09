/**
 * Resolves held-item presentation from the equipped hotbar slot.
 *
 * @module components/world/equipment/domains/resolvingWorldPlazaEquippedHeldItemPresentation
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningWorldPlazaHeldItemPresentation } from '@/components/world/equipment/domains/definingWorldPlazaHeldItemPresentationRegistry';
import { resolvingWorldPlazaHeldItemPresentationForItemTypeId } from '@/components/world/equipment/domains/resolvingWorldPlazaHeldItemPresentationForItemTypeId';

/**
 * Reads the selected hotbar slot and returns overlay presentation, if any.
 */
export function resolvingWorldPlazaEquippedHeldItemPresentation(
  inventoryState: DefiningInventoryState,
  selectedSlotIndex: number | null
): DefiningWorldPlazaHeldItemPresentation | null {
  if (selectedSlotIndex === null) {
    return null;
  }

  const slotItem = inventoryState.slots[selectedSlotIndex];

  if (!slotItem) {
    return null;
  }

  return resolvingWorldPlazaHeldItemPresentationForItemTypeId(
    slotItem.itemTypeId
  );
}
