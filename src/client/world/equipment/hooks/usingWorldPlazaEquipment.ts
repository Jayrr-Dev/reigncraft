'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { checkingWorldPlazaEquippedSlotHasToolKind } from '@/components/world/equipment/domains/checkingWorldPlazaEquippedSlotHasToolKind';
import type { DefiningWorldPlazaEquipmentToolKind } from '@/components/world/equipment/domains/definingWorldPlazaEquipmentToolKind';
import { DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import { useCallback, useMemo } from 'react';

export type UsingWorldPlazaEquipmentParams = {
  readonly inventoryState: DefiningInventoryState;
};

export type UsingWorldPlazaEquipmentResult = {
  readonly selectedSlotIndex: number | null;
  readonly selectingHotbarSlot: (slotIndex: number) => void;
  readonly clearingSelectedHotbarSlot: () => void;
  readonly checkingEquippedToolKind: (
    toolKind: DefiningWorldPlazaEquipmentToolKind
  ) => ReturnType<typeof checkingWorldPlazaEquippedSlotHasToolKind>;
};

/**
 * Equipped tool always comes from the reserved weapon/tool hotbar slot.
 * Items placed there are equipped with no separate select toggle.
 */
export function usingWorldPlazaEquipment({
  inventoryState,
}: UsingWorldPlazaEquipmentParams): UsingWorldPlazaEquipmentResult {
  const selectedSlotIndex = DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX;

  const selectingHotbarSlot = useCallback((_slotIndex: number): void => {
    // Equipment is always the reserved weapon/tool slot; ignore hotbar toggles.
  }, []);

  const clearingSelectedHotbarSlot = useCallback((): void => {
    // Reserved slot stays equipped (empty = unarmed fist).
  }, []);

  const checkingEquippedToolKind = useCallback(
    (toolKind: DefiningWorldPlazaEquipmentToolKind) =>
      checkingWorldPlazaEquippedSlotHasToolKind(
        inventoryState,
        selectedSlotIndex,
        toolKind
      ),
    [inventoryState, selectedSlotIndex]
  );

  return useMemo(
    () => ({
      selectedSlotIndex,
      selectingHotbarSlot,
      clearingSelectedHotbarSlot,
      checkingEquippedToolKind,
    }),
    [
      checkingEquippedToolKind,
      clearingSelectedHotbarSlot,
      selectedSlotIndex,
      selectingHotbarSlot,
    ]
  );
}
