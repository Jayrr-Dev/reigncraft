/**
 * Builds popover lines explaining profile Attack bonus from equipped weapon.
 *
 * @module components/world/domains/resolvingWorldPlazaProfilePanelAttackBonusDetailLines
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { computingWorldPlazaEquipmentAttackEvWithFlat } from '@/components/world/equipment/domains/computingWorldPlazaEquipmentModifiedEv';
import { resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId } from '@/components/world/equipment/domains/resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId';
import { resolvingWorldPlazaEquipmentAttackEvModifier } from '@/components/world/equipment/domains/resolvingWorldPlazaEquippedAttackEv';
import { formattingWorldPlazaInventoryItemEvModifierLabel } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemInstanceInspectFields';
import { resolvingWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemTypeDefinition';

/**
 * Source lines for the Attack bonus popover (weapon name + EV parts).
 * Empty when unarmed or bonus is zero.
 */
export function resolvingWorldPlazaProfilePanelAttackBonusDetailLines(
  baseAttackPower: number,
  inventoryState: DefiningInventoryState,
  equippedWeaponSlotIndex: number | null
): readonly string[] {
  if (equippedWeaponSlotIndex === null) {
    return [];
  }

  const slotItem = inventoryState.slots[equippedWeaponSlotIndex];

  if (!slotItem) {
    return [];
  }

  const capabilities = resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId(
    slotItem.itemTypeId
  );
  const modifier = resolvingWorldPlazaEquipmentAttackEvModifier(capabilities);
  const flatDamage = capabilities?.meleeFlatDamage ?? 0;
  const multiplicative =
    modifier?.mode === 'multiplicative' ? modifier.value : 1;
  const equippedEv =
    modifier?.mode === 'additive'
      ? baseAttackPower + modifier.value + flatDamage
      : computingWorldPlazaEquipmentAttackEvWithFlat(
          baseAttackPower,
          multiplicative,
          flatDamage
        );
  const bonus = Math.round(equippedEv) - Math.round(baseAttackPower);

  if (bonus === 0) {
    return [];
  }

  const itemName =
    resolvingWorldPlazaInventoryItemTypeDefinition(slotItem.itemTypeId)?.name ??
    slotItem.itemTypeId;
  const lines: string[] = [itemName];

  if (modifier) {
    lines.push(formattingWorldPlazaInventoryItemEvModifierLabel(modifier));
  }

  if (flatDamage !== 0) {
    const sign = flatDamage > 0 ? '+' : '';
    lines.push(`${sign}${Math.round(flatDamage)} flat damage`);
  }

  return lines;
}
