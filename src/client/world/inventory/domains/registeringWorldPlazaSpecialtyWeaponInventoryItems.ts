/**
 * Inventory rows for specialty unique weapons (find-only early + craftable late).
 *
 * @module components/world/inventory/domains/registeringWorldPlazaSpecialtyWeaponInventoryItems
 */

import { DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_REGISTRY } from '@/components/world/equipment/domains/definingWorldPlazaSpecialtyWeaponRegistry';
import { resolvingWorldPlazaInventoryEarlyWeaponSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryEarlyWeaponSpriteSheetConstants';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

export function registeringWorldPlazaSpecialtyWeaponInventoryItems(): readonly DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_REGISTRY.map((weapon) => {
    const earlySpriteSheetIcon =
      resolvingWorldPlazaInventoryEarlyWeaponSpriteSheetIcon(weapon.itemTypeId);

    return {
      typeId: weapon.itemTypeId,
      name: weapon.displayName,
      rarity: weapon.rarity,
      ...(earlySpriteSheetIcon
        ? { iconSpriteSheet: earlySpriteSheetIcon }
        : { iconifyIcon: weapon.iconifyIcon }),
      tooltip: weapon.tooltip,
      maxStack: 1,
      isDroppable: true,
      isStackable: false,
      tags: ['unique'] as const,
      equipment: {
        toolKinds: ['sword'] as const,
        harvestSpeedMultiplier: 1,
        heldItemVisualId: 'sword' as const,
        heldItemTier: weapon.heldItemTier,
        attackEvModifier: weapon.attackEvModifier,
        meleeDamageMultiplier: weapon.attackEvModifier.value,
      },
      durability: {
        max: weapon.maxDurability,
        breakChanceAtZero: 0.1,
      },
    };
  });
}
