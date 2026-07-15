/**
 * Tall-grass forage inventory item definitions.
 *
 * @module components/world/inventory/domains/registeringWorldPlazaInventoryTallGrassItemDefinitions
 */

import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import { DEFINING_WORLD_PLAZA_TALL_GRASS_INVENTORY_ITEM_SEEDS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryTallGrassItemCatalog';
import { resolvingWorldPlazaInventoryTallGrassSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryTallGrassSpriteSheetConstants';

export function registeringWorldPlazaInventoryTallGrassItemDefinitions(): readonly DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return DEFINING_WORLD_PLAZA_TALL_GRASS_INVENTORY_ITEM_SEEDS.map((seed) => ({
    typeId: seed.typeId,
    name: seed.name,
    rarity: seed.rarity,
    description: seed.description,
    maxStack: 99,
    isDroppable: true,
    isStackable: true,
    iconSpriteSheet:
      resolvingWorldPlazaInventoryTallGrassSpriteSheetIcon(seed.typeId) ??
      undefined,
  }));
}
