import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningWorldPlazaEquipmentToolKind } from '@/components/world/equipment/domains/definingWorldPlazaEquipmentToolKind';
import type { DefiningWorldPlazaHeldItemTier } from '@/components/world/equipment/domains/definingWorldPlazaHeldItemTypes';
import {
  checkingWorldPlazaItemTypeHasEquipmentToolKind,
  resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId,
} from '@/components/world/equipment/domains/resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId';

export type CheckingWorldPlazaEquippedSlotHasToolKindResult = {
  readonly hasToolKind: boolean;
  readonly equippedItemTypeId: string | null;
  readonly harvestSpeedMultiplier: number;
  readonly heldItemTier: DefiningWorldPlazaHeldItemTier | null;
};

/**
 * Checks whether the selected hotbar slot holds an item with the given tool kind.
 */
export function checkingWorldPlazaEquippedSlotHasToolKind(
  inventoryState: DefiningInventoryState,
  selectedSlotIndex: number | null,
  toolKind: DefiningWorldPlazaEquipmentToolKind
): CheckingWorldPlazaEquippedSlotHasToolKindResult {
  if (selectedSlotIndex === null) {
    return {
      hasToolKind: false,
      equippedItemTypeId: null,
      harvestSpeedMultiplier: 1,
      heldItemTier: null,
    };
  }

  const slot = inventoryState.slots[selectedSlotIndex];

  if (!slot || slot.quantity <= 0) {
    return {
      hasToolKind: false,
      equippedItemTypeId: null,
      harvestSpeedMultiplier: 1,
      heldItemTier: null,
    };
  }

  const capabilities = resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId(
    slot.itemTypeId
  );

  return {
    hasToolKind: checkingWorldPlazaItemTypeHasEquipmentToolKind(
      slot.itemTypeId,
      toolKind
    ),
    equippedItemTypeId: slot.itemTypeId,
    harvestSpeedMultiplier: capabilities?.harvestSpeedMultiplier ?? 1,
    heldItemTier: capabilities?.heldItemTier ?? null,
  };
}
