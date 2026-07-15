/**
 * Resolves equipped attack EV from character base EV and hotbar equipment.
 *
 * @module components/world/equipment/domains/resolvingWorldPlazaEquippedAttackEv
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import {
  computingWorldPlazaEquipmentAttackEvWithFlat,
  computingWorldPlazaEquipmentModifiedEv,
} from '@/components/world/equipment/domains/computingWorldPlazaEquipmentModifiedEv';
import type { DefiningWorldPlazaEquipmentEvModifier } from '@/components/world/equipment/domains/definingWorldPlazaEquipmentEvModifier';
import { resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId } from '@/components/world/equipment/domains/resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId';

/**
 * Prefers explicit attackEvModifier; falls back to legacy meleeDamageMultiplier.
 */
export function resolvingWorldPlazaEquipmentAttackEvModifier(
  capabilities: {
    readonly attackEvModifier?: DefiningWorldPlazaEquipmentEvModifier;
    readonly meleeDamageMultiplier?: number;
  } | null
): DefiningWorldPlazaEquipmentEvModifier | undefined {
  if (!capabilities) {
    return undefined;
  }

  if (capabilities.attackEvModifier) {
    return capabilities.attackEvModifier;
  }

  if (
    capabilities.meleeDamageMultiplier !== undefined &&
    capabilities.meleeDamageMultiplier !== 1
  ) {
    return {
      mode: 'multiplicative',
      value: capabilities.meleeDamageMultiplier,
    };
  }

  if (capabilities.meleeDamageMultiplier === 1) {
    return { mode: 'multiplicative', value: 1 };
  }

  return undefined;
}

/**
 * Applies equipped weapon attack EV modifier + flat tier bonus to base attack EV.
 * Formula: `(base * multiplicative) + flat` when multiplicative; additive modes
 * still add their value, then flat.
 */
export function resolvingWorldPlazaEquippedAttackEv(
  baseAttackEv: number,
  inventoryState: DefiningInventoryState,
  selectedSlotIndex: number | null
): number {
  if (selectedSlotIndex === null) {
    return baseAttackEv;
  }

  const slotItem = inventoryState.slots[selectedSlotIndex];

  if (!slotItem) {
    return baseAttackEv;
  }

  const capabilities = resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId(
    slotItem.itemTypeId
  );
  const modifier = resolvingWorldPlazaEquipmentAttackEvModifier(capabilities);
  const flatDamage = capabilities?.meleeFlatDamage ?? 0;

  if (!modifier) {
    return computingWorldPlazaEquipmentAttackEvWithFlat(
      baseAttackEv,
      1,
      flatDamage
    );
  }

  if (modifier.mode === 'multiplicative') {
    return computingWorldPlazaEquipmentAttackEvWithFlat(
      baseAttackEv,
      modifier.value,
      flatDamage
    );
  }

  return (
    computingWorldPlazaEquipmentModifiedEv(baseAttackEv, modifier) + flatDamage
  );
}
