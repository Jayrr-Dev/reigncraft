/**
 * Refined metal ingot / mercury inventory item definitions.
 *
 * Metallic ores smelt to bars. Scarlet (cinnabar) yields mercury flask.
 *
 * @module components/world/inventory/domains/registeringWorldPlazaInventoryIngotItemDefinitions
 */

import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_COPPER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_GOLD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_LEAD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_SILVER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_MERCURY,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { resolvingWorldPlazaInventoryIngotSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryIngotSpriteSheetConstants';

type IngotItemSeed = {
  readonly typeId: string;
  readonly name: string;
  readonly rarity: DefiningWorldPlazaInventoryItemTypeDefinition['rarity'];
  readonly description: string;
};

const DEFINING_WORLD_PLAZA_INGOT_INVENTORY_ITEM_SEEDS: readonly IngotItemSeed[] =
  [
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
      name: 'Iron ingot',
      rarity: 'common',
      description:
        'A dense bar of smelted iron. The workhorse metal of tools and nails.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_COPPER,
      name: 'Copper ingot',
      rarity: 'common',
      description:
        'Warm orange metal poured clean of green stone. Good for early alloys and wire.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_SILVER,
      name: 'Silver ingot',
      rarity: 'rare',
      description:
        'Cool bright metal with a clean sheen. Fine work and bright fittings.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_GOLD,
      name: 'Gold ingot',
      rarity: 'epic',
      description:
        'Soft yellow wealth cast into a bar. Soft under the hammer, heavy in the hand.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_LEAD,
      name: 'Lead ingot',
      rarity: 'uncommon',
      description:
        'Dull grey weight cast from galena. Soft seals, sinkers, and blunt craft.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_MERCURY,
      name: 'Mercury',
      rarity: 'rare',
      description:
        'Quicksilver drawn from scarlet cinnabar. Mirror liquid in a sealed flask.',
    },
  ];

/**
 * Registers refined metal ingot and mercury inventory items.
 */
export function registeringWorldPlazaInventoryIngotItemDefinitions(): readonly DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return DEFINING_WORLD_PLAZA_INGOT_INVENTORY_ITEM_SEEDS.map((seed) => ({
    typeId: seed.typeId,
    name: seed.name,
    rarity: seed.rarity,
    description: seed.description,
    maxStack: 99,
    isDroppable: true,
    isStackable: true,
    iconSpriteSheet:
      resolvingWorldPlazaInventoryIngotSpriteSheetIcon(seed.typeId) ??
      undefined,
  }));
}
