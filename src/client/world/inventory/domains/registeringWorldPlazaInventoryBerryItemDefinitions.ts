/**
 * Berry forage inventory item definitions from shrub picks.
 *
 * @module components/world/inventory/domains/registeringWorldPlazaInventoryBerryItemDefinitions
 */

import { resolvingWorldPlazaInventoryBerrySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryBerrySpriteSheetConstants';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_BLUE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_GOLDEN,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { resolvingWorldPlazaInventoryTeaLeavesSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryTeaLeavesSpriteSheetConstants';
import { DEFINING_WORLD_PLAZA_HUNGER_RESTORE_BERRIES } from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';
import { resolvingWorldPlazaInventoryFoodHealDeclaration } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryFoodHealDeclaration';

const DEFINING_WORLD_PLAZA_BERRY_INVENTORY_ITEM_SEEDS = [
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED,
    name: 'Coffee Cherry',
    rarity: 'common' as const,
  },
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_BLUE,
    name: 'Blue berry',
    rarity: 'uncommon' as const,
  },
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_GOLDEN,
    name: 'Golden berry',
    rarity: 'rare' as const,
  },
] as const;

export function registeringWorldPlazaInventoryBerryItemDefinitions(): readonly DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return [
    ...DEFINING_WORLD_PLAZA_BERRY_INVENTORY_ITEM_SEEDS.map((seed) => ({
      typeId: seed.typeId,
      name: seed.name,
      rarity: seed.rarity,
      maxStack: 99,
      isDroppable: true,
      isStackable: true,
      iconSpriteSheet:
        resolvingWorldPlazaInventoryBerrySpriteSheetIcon(seed.typeId) ??
        undefined,
      food: {
        hungerRestoreRatio: DEFINING_WORLD_PLAZA_HUNGER_RESTORE_BERRIES,
        healthHeal: resolvingWorldPlazaInventoryFoodHealDeclaration({
          hungerRestoreRatio: DEFINING_WORLD_PLAZA_HUNGER_RESTORE_BERRIES,
        }),
        ...(seed.typeId === DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED
          ? {
              cookedWellFedBuffId: 'coffee-cherry-buzz-buff',
              cookedWellFedChance: 1,
            }
          : {}),
      },
    })),
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES,
      name: 'Tea Leaves',
      rarity: 'common' as const,
      maxStack: 99,
      isDroppable: true,
      isStackable: true,
      iconSpriteSheet:
        resolvingWorldPlazaInventoryTeaLeavesSpriteSheetIcon(
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES
        ) ?? undefined,
    },
  ];
}
