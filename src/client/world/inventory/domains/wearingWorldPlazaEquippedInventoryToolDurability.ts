import type { DefiningWorldPlazaEquipmentToolKind } from '@/components/world/equipment/domains/definingWorldPlazaEquipmentToolKind';
import { checkingWorldPlazaItemTypeHasEquipmentToolKind } from '@/components/world/equipment/domains/resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId';
import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import {
  applyingWorldPlazaInventorySlotDurabilityUse,
  type ApplyingWorldPlazaInventorySlotDurabilityUseResult,
} from '@/components/world/inventory/domains/applyingWorldPlazaInventorySlotDurabilityUse';

export type WearingWorldPlazaEquippedInventoryToolDurabilityResult =
  ApplyingWorldPlazaInventorySlotDurabilityUseResult & {
    readonly slotIndex: number | null;
  };

/**
 * Wears durability on the equipped hotbar slot when it holds the given tool kind.
 */
export function wearingWorldPlazaEquippedInventoryToolDurability(
  state: DefiningInventoryState,
  selectedSlotIndex: number | null,
  toolKind: DefiningWorldPlazaEquipmentToolKind,
  random: () => number = Math.random
): WearingWorldPlazaEquippedInventoryToolDurabilityResult {
  if (selectedSlotIndex === null) {
    return {
      applied: false,
      broken: false,
      nextState: state,
      remainingDurability: null,
      slotIndex: null,
    };
  }

  const slotItem = state.slots[selectedSlotIndex];

  if (
    !slotItem ||
    !checkingWorldPlazaItemTypeHasEquipmentToolKind(slotItem.itemTypeId, toolKind)
  ) {
    return {
      applied: false,
      broken: false,
      nextState: state,
      remainingDurability: null,
      slotIndex: selectedSlotIndex,
    };
  }

  const wearResult = applyingWorldPlazaInventorySlotDurabilityUse(
    state,
    selectedSlotIndex,
    random
  );

  return {
    ...wearResult,
    slotIndex: selectedSlotIndex,
  };
}
