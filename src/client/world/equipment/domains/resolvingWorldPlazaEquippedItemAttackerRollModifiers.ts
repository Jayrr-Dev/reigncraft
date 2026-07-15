/**
 * Resolves passive attacker roll crumbs from equipped item capabilities.
 *
 * @module components/world/equipment/domains/resolvingWorldPlazaEquippedItemAttackerRollModifiers
 */

import { resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId } from '@/components/world/equipment/domains/resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId';
import type { DefiningWorldPlazaEntityHealthDamageRollModifier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

const DEFINING_WORLD_PLAZA_EQUIPPED_ITEM_ROLL_MODIFIER_ID_PREFIX =
  'equipped-item-roll:';

/**
 * Maps equipment `attackerRollModifiers` crumbs into timed damage-roll modifiers.
 * Specialty weapons keep their own resolver; this covers tiered gold tools.
 */
export function resolvingWorldPlazaEquippedItemAttackerRollModifiers(
  itemTypeId: string | null | undefined
): DefiningWorldPlazaEntityHealthDamageRollModifier[] {
  if (!itemTypeId) {
    return [];
  }

  const capabilities =
    resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId(itemTypeId);
  const crumbs = capabilities?.attackerRollModifiers;

  if (!crumbs || crumbs.length === 0) {
    return [];
  }

  return crumbs.map((crumb, index) => ({
    id: `${DEFINING_WORLD_PLAZA_EQUIPPED_ITEM_ROLL_MODIFIER_ID_PREFIX}${itemTypeId}:${crumb.kind}:${index}`,
    kind: crumb.kind,
    value: crumb.value,
    expiresAtMs: null,
  }));
}
