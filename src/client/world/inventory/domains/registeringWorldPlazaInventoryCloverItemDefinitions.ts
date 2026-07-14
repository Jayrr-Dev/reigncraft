/**
 * Clover forage inventory item definitions.
 *
 * @module components/world/inventory/domains/registeringWorldPlazaInventoryCloverItemDefinitions
 */

import { DEFINING_WORLD_PLAZA_FOUR_LEAF_CLOVER_DURABILITY_MAX } from '@/components/world/inventory/domains/definingWorldPlazaInventoryCloverConstants';
import { resolvingWorldPlazaInventoryCloverSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryCloverSpriteSheetConstants';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_3_LEAF,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_4_LEAF,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

const DEFINING_WORLD_PLAZA_CLOVER_INVENTORY_ITEM_SEEDS = [
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_3_LEAF,
    name: 'Three-leaf clover',
    rarity: 'common' as const,
    description:
      'A common shamrock pulled from a long-grass clump. Lucky only if you count wrong.',
  },
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_4_LEAF,
    name: 'Four-leaf clover',
    rarity: 'rare' as const,
    description:
      'A rare fourth leaf tucked in the tangle. Hold it for luck until the charm fades.',
  },
] as const;

export function registeringWorldPlazaInventoryCloverItemDefinitions(): readonly DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return DEFINING_WORLD_PLAZA_CLOVER_INVENTORY_ITEM_SEEDS.map((seed) => ({
    typeId: seed.typeId,
    name: seed.name,
    rarity: seed.rarity,
    description: seed.description,
    maxStack:
      seed.typeId === DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_4_LEAF
        ? 1
        : 99,
    isDroppable: true,
    isStackable:
      seed.typeId !== DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_4_LEAF,
    durability:
      seed.typeId === DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_4_LEAF
        ? { max: DEFINING_WORLD_PLAZA_FOUR_LEAF_CLOVER_DURABILITY_MAX }
        : undefined,
    iconSpriteSheet:
      resolvingWorldPlazaInventoryCloverSpriteSheetIcon(seed.typeId) ??
      undefined,
  }));
}
