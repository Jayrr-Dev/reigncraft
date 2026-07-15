/**
 * Unfired and fired ceramics ware inventory items.
 *
 * @module components/world/inventory/domains/registeringWorldPlazaInventoryCeramicsItemDefinitions
 */

import { resolvingWorldPlazaInventoryCeramicsSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryCeramicsSpriteSheetConstants';
import { resolvingWorldPlazaInventoryCoffeeSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryCoffeeSpriteSheetConstants';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BOWL_OF_PORRIDGE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_CLAY_TEAPOT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CUP_OF_TEA,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_BOWL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_BOTTLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_CROCK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_TEAPOT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SMOKE_OIL_CROCK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_BOTTLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_TEAPOT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_BOWL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_BOTTLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CROCK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CUP,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_TEAPOT,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { resolvingWorldPlazaInventoryFoodHealDeclaration } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryFoodHealDeclaration';
import {
  DEFINING_WORLD_PLAZA_HUNGER_RESTORE_BOWL_OF_PORRIDGE,
  DEFINING_WORLD_PLAZA_HUNGER_RESTORE_CLAY_BOTTLE_WATER,
  DEFINING_WORLD_PLAZA_HUNGER_RESTORE_SMOKE_OIL_CROCK,
} from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';

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
        'Fired terracotta bottle. Fill it at a shore, then drink on the trail. Bottle comes back empty.',
      maxStack: 16,
      isDroppable: true,
      isStackable: true,
      iconSpriteSheet:
        resolvingWorldPlazaInventoryCeramicsSpriteSheetIcon(
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_BOTTLE
        ) ?? undefined,
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_BOTTLE,
      name: 'Clay Bottle of Water',
      rarity: 'common',
      tooltip:
        'Shore water corked in clay. Drink for a light fill and a rinse against food sickness. Bottle returns empty.',
      maxStack: 8,
      isDroppable: true,
      isStackable: true,
      iconSpriteSheet:
        resolvingWorldPlazaInventoryCeramicsSpriteSheetIcon(
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_BOTTLE
        ) ?? undefined,
      food: {
        hungerRestoreRatio: DEFINING_WORLD_PLAZA_HUNGER_RESTORE_CLAY_BOTTLE_WATER,
        healthHeal: resolvingWorldPlazaInventoryFoodHealDeclaration({
          hungerRestoreRatio: DEFINING_WORLD_PLAZA_HUNGER_RESTORE_CLAY_BOTTLE_WATER,
        }),
        returnItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_BOTTLE,
      },
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_BOWL,
      name: 'Wet Clay Bowl',
      rarity: 'basic',
      tooltip:
        'Unfired clay bowl. Fire it in a kiln with coal before it can hold porridge.',
      maxStack: 8,
      isDroppable: true,
      isStackable: true,
      iconSpriteSheet:
        resolvingWorldPlazaInventoryCeramicsSpriteSheetIcon(
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_BOWL
        ) ?? undefined,
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_BOWL,
      name: 'Empty Clay Bowl',
      rarity: 'common',
      tooltip:
        'Fired terracotta bowl. Cook berry porridge at a campfire, then eat and keep the bowl.',
      maxStack: 8,
      isDroppable: true,
      isStackable: true,
      iconSpriteSheet:
        resolvingWorldPlazaInventoryCeramicsSpriteSheetIcon(
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_BOWL
        ) ?? undefined,
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BOWL_OF_PORRIDGE,
      name: 'Bowl of Berry Porridge',
      rarity: 'uncommon',
      tooltip:
        'Warm berry mash cooked in clay at a campfire. Better trail food than raw berries. Bowl returns empty.',
      maxStack: 4,
      isDroppable: true,
      isStackable: true,
      iconSpriteSheet:
        resolvingWorldPlazaInventoryCeramicsSpriteSheetIcon(
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BOWL_OF_PORRIDGE
        ) ?? undefined,
      food: {
        hungerRestoreRatio: DEFINING_WORLD_PLAZA_HUNGER_RESTORE_BOWL_OF_PORRIDGE,
        healthHeal: resolvingWorldPlazaInventoryFoodHealDeclaration({
          hungerRestoreRatio: DEFINING_WORLD_PLAZA_HUNGER_RESTORE_BOWL_OF_PORRIDGE,
        }),
        meatKind: 'cooked',
        returnItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_BOWL,
      },
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CROCK,
      name: 'Wet Clay Crock',
      rarity: 'basic',
      tooltip:
        'Unfired lidded crock. Fire it in a kiln with coal before sealing smoke-oil inside.',
      maxStack: 8,
      isDroppable: true,
      isStackable: true,
      iconSpriteSheet:
        resolvingWorldPlazaInventoryCeramicsSpriteSheetIcon(
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CROCK
        ) ?? undefined,
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_CROCK,
      name: 'Empty Clay Crock',
      rarity: 'common',
      tooltip:
        'Fired terracotta crock. Render pig fat with niter at a campfire into warming smoke-oil.',
      maxStack: 8,
      isDroppable: true,
      isStackable: true,
      iconSpriteSheet:
        resolvingWorldPlazaInventoryCeramicsSpriteSheetIcon(
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_CROCK
        ) ?? undefined,
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SMOKE_OIL_CROCK,
      name: 'Smoke-Oil Crock',
      rarity: 'uncommon',
      tooltip:
        'Rendered fat and niter sealed in clay. Taste for cold resistance. Crock returns empty.',
      maxStack: 4,
      isDroppable: true,
      isStackable: true,
      iconSpriteSheet:
        resolvingWorldPlazaInventoryCeramicsSpriteSheetIcon(
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SMOKE_OIL_CROCK
        ) ?? undefined,
      food: {
        hungerRestoreRatio: DEFINING_WORLD_PLAZA_HUNGER_RESTORE_SMOKE_OIL_CROCK,
        healthHeal: resolvingWorldPlazaInventoryFoodHealDeclaration({
          hungerRestoreRatio: DEFINING_WORLD_PLAZA_HUNGER_RESTORE_SMOKE_OIL_CROCK,
        }),
        cookedWellFedBuffId: 'cold-resistance-buff',
        cookedWellFedChance: 1,
        returnItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_CROCK,
      },
    },
  ];
}
