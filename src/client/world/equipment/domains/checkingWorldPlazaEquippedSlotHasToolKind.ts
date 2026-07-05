import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningWorldPlazaEquipmentToolKind } from '@/components/world/equipment/domains/definingWorldPlazaEquipmentToolKind';
import {
  checkingWorldPlazaItemTypeHasEquipmentToolKind,
  resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId,
} from '@/components/world/equipment/domains/resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId';

export type CheckingWorldPlazaEquippedSlotHasToolKindResult = {
  readonly hasToolKind: boolean;
  readonly equippedItemTypeId: string | null;
  readonly harvestSpeedMultiplier: number;
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
    };
  }

  const slot = inventoryState.slots[selectedSlotIndex];

  if (!slot || slot.quantity <= 0) {
    return {
      hasToolKind: false,
      equippedItemTypeId: null,
      harvestSpeedMultiplier: 1,
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
  };
}
