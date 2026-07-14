/**
 * Wet clay inventory item (shore-wetted dry clay).
 *
 * @module components/world/inventory/domains/registeringWorldPlazaInventoryWetClayItemDefinitions
 */

import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { resolvingWorldPlazaInventoryWetClaySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryWetClaySpriteSheetConstants';

/**
 * Registers the wet clay resource item.
 */
export function registeringWorldPlazaInventoryWetClayItemDefinitions(): readonly DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return [
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY,
      name: 'Wet Clay',
      rarity: 'basic',
      description:
        'Clay soaked at the shore. Soft enough to mold; dry it and it holds shape.',
      maxStack: 99,
      isDroppable: true,
      isStackable: true,
      iconSpriteSheet:
        resolvingWorldPlazaInventoryWetClaySpriteSheetIcon(
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY
        ) ?? undefined,
    },
  ];
}
