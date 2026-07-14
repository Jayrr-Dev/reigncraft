/**
 * Ore resource inventory item definitions.
 *
 * Rarity comes from {@link resolvingWorldOreSpeciesRarity} (shared ladder).
 *
 * @module components/world/inventory/domains/registeringWorldPlazaInventoryOreItemDefinitions
 */

import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COAL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COPPER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_GOLD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_LEAD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_NITER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SCARLET,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SILVER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SULFUR,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { resolvingWorldPlazaInventoryOreSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryOreSpriteSheetConstants';
import {
  resolvingWorldOreSpeciesRarity,
  type WorldOreSpeciesId,
} from '../../../../shared/worldOreRarity';

type OreItemSeed = {
  readonly typeId: string;
  readonly name: string;
  readonly speciesId: WorldOreSpeciesId;
  readonly description: string;
};

const DEFINING_WORLD_PLAZA_ORE_INVENTORY_ITEM_SEEDS: readonly OreItemSeed[] = [
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY,
    name: 'Clay',
    speciesId: 'clay',
    description:
      'Dense terracotta earth chipped from soft veins. Good for bricks and kiln work.',
  },
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_IRON,
    name: 'Iron ore',
    speciesId: 'iron',
    description:
      'Rusty stone with dark metal grit. Smelts into the bones of tools and nails.',
  },
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SILVER,
    name: 'Silver ore',
    speciesId: 'silver',
    description:
      'Cool grey rock shot with pale metal. Bright under hammer and fire.',
  },
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_GOLD,
    name: 'Gold ore',
    speciesId: 'gold',
    description:
      'Heavy stone with warm yellow flecks. Soft metal for wealth and fine work.',
  },
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COPPER,
    name: 'Copper ore',
    speciesId: 'copper',
    description:
      'Green-stained rock with orange metal. Early alloys and wire start here.',
  },
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COAL,
    name: 'Coal ore',
    speciesId: 'coal',
    description:
      'Black seam stone that burns hot. Fuel for forges and long camp nights.',
  },
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_NITER,
    name: 'Niter ore',
    speciesId: 'niter',
    description:
      'Chalky white saltpeter crust on grey rock. Sparks and powder recipes need it.',
  },
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SCARLET,
    name: 'Scarlet ore',
    speciesId: 'scarlet',
    description:
      'Cinnabar-red mineral in dark stone. Bright pigment and strange chemistry.',
  },
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_LEAD,
    name: 'Lead ore',
    speciesId: 'lead',
    description:
      'Galena cubes in heavy rock. Soft grey metal for weights and seals.',
  },
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SULFUR,
    name: 'Sulfur ore',
    speciesId: 'sulfur',
    description:
      'Bright yellow crystals in volcanic stone. Firelands stink and forge reagents.',
  },
];

/**
 * Registers all mineable ore inventory items.
 */
export function registeringWorldPlazaInventoryOreItemDefinitions(): readonly DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return DEFINING_WORLD_PLAZA_ORE_INVENTORY_ITEM_SEEDS.map((seed) => ({
    typeId: seed.typeId,
    name: seed.name,
    rarity: resolvingWorldOreSpeciesRarity(seed.speciesId),
    description: seed.description,
    maxStack: 99,
    isDroppable: true,
    isStackable: true,
    iconSpriteSheet:
      resolvingWorldPlazaInventoryOreSpriteSheetIcon(seed.typeId) ?? undefined,
  }));
}
