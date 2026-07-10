/**
 * Resolves equipped melee damage multiplier from the hotbar selection.
 *
 * @module components/world/equipment/domains/resolvingWorldPlazaEquippedMeleeDamageMultiplier
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId } from '@/components/world/equipment/domains/resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId';
import { resolvingWorldPlazaEquipmentAttackEvModifier } from '@/components/world/equipment/domains/resolvingWorldPlazaEquippedAttackEv';

/**
 * Returns 1 when unarmed or when the equipped item has no melee multiplier.
 * Prefer {@link resolvingWorldPlazaEquippedAttackEv} for full additive/multiplicative EV.
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
  const modifier = resolvingWorldPlazaEquipmentAttackEvModifier(capabilities);

  if (!modifier) {
    return 1;
  }

  if (modifier.mode === 'multiplicative') {
    return modifier.value;
  }

  // Additive modifiers are not expressible as a lone multiplier; callers
  // that need full EV should use resolvingWorldPlazaEquippedAttackEv.
  return 1;
}
