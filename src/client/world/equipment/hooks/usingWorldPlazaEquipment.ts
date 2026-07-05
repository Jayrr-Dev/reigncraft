'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { checkingWorldPlazaEquippedSlotHasToolKind } from '@/components/world/equipment/domains/checkingWorldPlazaEquippedSlotHasToolKind';
import type { DefiningWorldPlazaEquipmentToolKind } from '@/components/world/equipment/domains/definingWorldPlazaEquipmentToolKind';
import { useCallback, useMemo, useState } from 'react';

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
 * Tracks which hotbar slot is equipped for world actions (axe, flint, etc.).
 */
export function usingWorldPlazaEquipment({
  inventoryState,
}: UsingWorldPlazaEquipmentParams): UsingWorldPlazaEquipmentResult {
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(
    null
  );

  const selectingHotbarSlot = useCallback((slotIndex: number): void => {
    setSelectedSlotIndex((current) =>
      current === slotIndex ? null : slotIndex
    );
  }, []);

  const clearingSelectedHotbarSlot = useCallback((): void => {
    setSelectedSlotIndex(null);
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
