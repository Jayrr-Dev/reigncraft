/**
 * Unfired and fired ceramics ware inventory items.
 *
 * @module components/world/inventory/domains/registeringWorldPlazaInventoryCeramicsItemDefinitions
 */

import { resolvingWorldPlazaInventoryCeramicsSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryCeramicsSpriteSheetConstants';
import { resolvingWorldPlazaInventoryCoffeeSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryCoffeeSpriteSheetConstants';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_CLAY_TEAPOT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CUP_OF_TEA,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_BOTTLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_TEAPOT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_TEAPOT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_BOTTLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CUP,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_TEAPOT,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { resolvingWorldPlazaInventoryFoodHealDeclaration } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryFoodHealDeclaration';

export function registeringWorldPlazaInventoryCeramicsItemDefinitions(): readonly DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return [
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CUP,
      name: 'Wet Clay Cup',
      rarity: 'basic',
      tooltip:
        'Soft unfired clay shaped into a cup. Fire it in a kiln with coal before it holds drink.',
      maxStack: 8,
      isDroppable: true,
      isStackable: true,
      iconSpriteSheet:
        resolvingWorldPlazaInventoryCeramicsSpriteSheetIcon(
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CUP
        ) ?? undefined,
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_TEAPOT,
      name: 'Wet Clay Tea Pot',
      rarity: 'basic',
      tooltip:
        'Unfired clay teapot, still damp from the shore. Needs kiln heat and coal before it pours.',
      maxStack: 8,
      isDroppable: true,
      isStackable: true,
      iconSpriteSheet:
        resolvingWorldPlazaInventoryCeramicsSpriteSheetIcon(
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_TEAPOT
        ) ?? undefined,
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_TEAPOT,
      name: 'Empty Clay Tea Pot',
      rarity: 'common',
      tooltip:
        'Fired terracotta teapot. Add water near a shore, load herbs, then brew at a campfire.',
      maxStack: 8,
      isDroppable: true,
      isStackable: true,
      iconSpriteSheet:
        resolvingWorldPlazaInventoryCeramicsSpriteSheetIcon(
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_TEAPOT
        ) ?? undefined,
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_TEAPOT,
      name: 'Watered Clay Tea Pot',
      rarity: 'common',
      tooltip:
        'A teapot filled with water. Load flowers, berries, or leaves, then brew it over a campfire.',
      maxStack: 1,
      isDroppable: true,
      isStackable: false,
      iconSpriteSheet:
        resolvingWorldPlazaInventoryCeramicsSpriteSheetIcon(
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_TEAPOT
        ) ?? undefined,
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_CLAY_TEAPOT,
      name: 'Brewed Clay Tea Pot',
      rarity: 'uncommon',
      tooltip:
        'Hot steep finished at the campfire. Pour into an empty clay cup to serve.',
      maxStack: 1,
      isDroppable: true,
      isStackable: false,
      iconSpriteSheet:
        resolvingWorldPlazaInventoryCeramicsSpriteSheetIcon(
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_CLAY_TEAPOT
        ) ?? undefined,
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CUP_OF_TEA,
      name: 'Cup of Tea',
      rarity: 'uncommon',
      tooltip: 'A poured clay cup of tea. Drink to take the steeped traits.',
      maxStack: 8,
      isDroppable: true,
      isStackable: true,
      iconSpriteSheet:
        resolvingWorldPlazaInventoryCoffeeSpriteSheetIcon(
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CUP_OF_TEA
        ) ?? undefined,
      food: {
        hungerRestoreRatio: 0.03,
        healthHeal: resolvingWorldPlazaInventoryFoodHealDeclaration({
          hungerRestoreRatio: 0.03,
        }),
      },
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_BOTTLE,
      name: 'Wet Clay Bottle',
      rarity: 'basic',
      tooltip:
        'Unfired clay bottle pulled from wet clay. Fire it in a kiln with coal before it can hold drink.',
      maxStack: 16,
      isDroppable: true,
      isStackable: true,
      iconSpriteSheet:
        resolvingWorldPlazaInventoryCeramicsSpriteSheetIcon(
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_BOTTLE
        ) ?? undefined,
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_BOTTLE,
      name: 'Empty Clay Bottle',
      rarity: 'common',
      tooltip:
        'Fired terracotta bottle. Ready for water, oil, or whatever you dare to cork.',
      maxStack: 16,
      isDroppable: true,
      isStackable: true,
      iconSpriteSheet:
        resolvingWorldPlazaInventoryCeramicsSpriteSheetIcon(
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_BOTTLE
        ) ?? undefined,
    },
  ];
}
