/**
 * Coffee processing inventory items: beans, brewed cup, empty clay cup.
 *
 * @module components/world/inventory/domains/registeringWorldPlazaInventoryCoffeeItemDefinitions
 */

import { resolvingWorldPlazaInventoryCoffeeSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryCoffeeSpriteSheetConstants';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_COFFEE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COFFEE_BEANS,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_CUP,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_HUNGER_RESTORE_BREWED_COFFEE } from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';
import { resolvingWorldPlazaInventoryFoodHealDeclaration } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryFoodHealDeclaration';

export function registeringWorldPlazaInventoryCoffeeItemDefinitions(): readonly DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return [
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COFFEE_BEANS,
      name: 'Coffee Beans',
      rarity: 'common',
      maxStack: 99,
      isDroppable: true,
      isStackable: true,
      iconSpriteSheet:
        resolvingWorldPlazaInventoryCoffeeSpriteSheetIcon(
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COFFEE_BEANS
        ) ?? undefined,
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_COFFEE,
      name: 'Brewed Coffee',
      rarity: 'uncommon',
      maxStack: 16,
      isDroppable: true,
      isStackable: true,
      iconSpriteSheet:
        resolvingWorldPlazaInventoryCoffeeSpriteSheetIcon(
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_COFFEE
        ) ?? undefined,
      food: {
        hungerRestoreRatio: DEFINING_WORLD_PLAZA_HUNGER_RESTORE_BREWED_COFFEE,
        healthHeal: resolvingWorldPlazaInventoryFoodHealDeclaration({
          hungerRestoreRatio: DEFINING_WORLD_PLAZA_HUNGER_RESTORE_BREWED_COFFEE,
        }),
        cookedWellFedBuffId: 'coffee-buzz-buff',
        cookedWellFedChance: 1,
      },
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_CUP,
      name: 'Empty Clay Cup',
      rarity: 'basic',
      maxStack: 16,
      isDroppable: true,
      isStackable: true,
      iconSpriteSheet:
        resolvingWorldPlazaInventoryCoffeeSpriteSheetIcon(
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_CUP
        ) ?? undefined,
    },
  ];
}
