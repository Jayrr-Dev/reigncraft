/**
 * Flower herb inventory item definitions.
 *
 * @module components/world/inventory/domains/registeringWorldPlazaInventoryFlowerItemDefinitions
 */

import { resolvingWorldPlazaInventoryFlowerSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryFlowerSpriteSheetConstants';
import type { DefiningWorldPlazaInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_ARNICA,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_BELLADONNA,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_CALENDULA,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_CHAMOMILE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_ECHINACEA,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_FOXGLOVE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_LAVENDER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_MEADOWSWEET,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_PEPPERMINT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_ROSE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_VALERIAN,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_YARROW,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { resolvingWorldPlazaInventoryFoodHealDeclaration } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryFoodHealDeclaration';
import type { WorldFlowerSpeciesId } from '../../../../shared/worldFlowerRarity';

type FlowerItemSeed = {
  readonly typeId: string;
  readonly name: string;
  readonly speciesId: WorldFlowerSpeciesId;
  readonly rarity: DefiningWorldPlazaInventoryItemRarity;
  readonly description: string;
};

const DEFINING_WORLD_PLAZA_FLOWER_INVENTORY_ITEM_SEEDS: readonly FlowerItemSeed[] =
  [
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_YARROW,
      name: 'Yarrow',
      speciesId: 'yarrow',
      rarity: 'basic',
      description:
        'Bitter white heads. Stanches a bleed or knits small wounds.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_CALENDULA,
      name: 'Calendula',
      speciesId: 'calendula',
      rarity: 'basic',
      description: 'Orange petals. Soothes flesh and quickens mending.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_CHAMOMILE,
      name: 'Chamomile',
      speciesId: 'chamomile',
      rarity: 'basic',
      description:
        'Small daisy heads. Clears a foggy head or grants a short rest.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_LAVENDER,
      name: 'Lavender',
      speciesId: 'lavender',
      rarity: 'common',
      description: 'Purple spikes. Cuts through nausea and food sickness.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_ECHINACEA,
      name: 'Echinacea',
      speciesId: 'echinacea',
      rarity: 'uncommon',
      description:
        'Cone flower. Shortens sickness or steels against infection.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_PEPPERMINT,
      name: 'Peppermint',
      speciesId: 'peppermint',
      rarity: 'common',
      description: 'Cool leaves. Briefly widens your cold comfort band.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_ROSE,
      name: 'Rose',
      speciesId: 'rose',
      rarity: 'common',
      description: 'Perfumed petals. Brief cold resistance when chewed.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_MEADOWSWEET,
      name: 'Meadowsweet',
      speciesId: 'meadowsweet',
      rarity: 'uncommon',
      description: 'Creamy clusters. Briefly widens your heat comfort band.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_ARNICA,
      name: 'Arnica',
      speciesId: 'arnica',
      rarity: 'uncommon',
      description: 'Yellow stars. Braces the body against incoming harm.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_VALERIAN,
      name: 'Valerian',
      speciesId: 'valerian',
      rarity: 'rare',
      description: 'Heavy root scent. Deep sleep with fierce recovery.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_FOXGLOVE,
      name: 'Foxglove',
      speciesId: 'foxglove',
      rarity: 'rare',
      description: 'Tall bells. A dangerous tonic with uneven mercy.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_BELLADONNA,
      name: 'Belladonna',
      speciesId: 'belladonna',
      rarity: 'legendary',
      description: 'Nightshade berry flower. Beautiful and venomous.',
    },
  ];

/**
 * Registers all pickable biome flower inventory items.
 */
export function registeringWorldPlazaInventoryFlowerItemDefinitions(): readonly DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return DEFINING_WORLD_PLAZA_FLOWER_INVENTORY_ITEM_SEEDS.map((seed) => ({
    typeId: seed.typeId,
    name: seed.name,
    rarity: seed.rarity,
    description: seed.description,
    maxStack: 99,
    isDroppable: true,
    isStackable: true,
    iconSpriteSheet:
      resolvingWorldPlazaInventoryFlowerSpriteSheetIcon(seed.typeId) ??
      undefined,
    food: {
      hungerRestoreRatio: 0,
      healthHeal: resolvingWorldPlazaInventoryFoodHealDeclaration({
        hungerRestoreRatio: 0,
      }),
      flowerSpeciesId: seed.speciesId,
    },
  }));
}
