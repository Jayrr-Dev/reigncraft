/**
 * Unfired and fired ceramics ware inventory items.
 *
 * @module components/world/inventory/domains/registeringWorldPlazaInventoryCeramicsItemDefinitions
 */

import { resolvingWorldPlazaInventoryCeramicsSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryCeramicsSpriteSheetConstants';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_TEAPOT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CUP,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_TEAPOT,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

export function registeringWorldPlazaInventoryCeramicsItemDefinitions(): readonly DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return [
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CUP,
      name: 'Wet Clay Cup',
      rarity: 'basic',
      description:
        'Soft unfired clay shaped into a cup. Fire it in a kiln with coal before it holds drink.',
      maxStack: 16,
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
      description:
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
      description:
        'Fired terracotta teapot. Ready for tea leaves and a careful pour.',
      maxStack: 8,
      isDroppable: true,
      isStackable: true,
      iconSpriteSheet:
        resolvingWorldPlazaInventoryCeramicsSpriteSheetIcon(
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_TEAPOT
        ) ?? undefined,
    },
  ];
}
