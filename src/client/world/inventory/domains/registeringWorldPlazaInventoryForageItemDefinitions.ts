/**
 * Extended shrub forage inventory item definitions.
 *
 * @module components/world/inventory/domains/registeringWorldPlazaInventoryForageItemDefinitions
 */

import {
  DEFINING_WORLD_PLAZA_FORAGE_EAT_BUFF_CHANCE_EPIC,
  DEFINING_WORLD_PLAZA_FORAGE_EAT_BUFF_CHANCE_LEGENDARY,
  DEFINING_WORLD_PLAZA_FORAGE_EAT_BUFF_CHANCE_MYTHIC,
  DEFINING_WORLD_PLAZA_FORAGE_EAT_BUFF_CHANCE_RARE,
  DEFINING_WORLD_PLAZA_FORAGE_EAT_BUFF_CHANCE_UNCOMMON,
} from '@/components/world/hunger/domains/definingWorldPlazaForageEatBuffConstants';
import { DEFINING_WORLD_PLAZA_HUNGER_RESTORE_BERRIES } from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';
import { resolvingWorldPlazaInventoryForageSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryBerrySpriteSheetConstants';
import type { DefiningWorldPlazaInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_BILBERRY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_BLACKBERRY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_CRANBERRY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_JUNIPER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_LOTUS_FRUIT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RASPBERRY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_SEA_BUCKTHORN,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_WOLFBERRY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_YEW_ARIL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_BAY_LAUREL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_HOLLY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_LEMON_BALM,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_MISTLETOE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_MOLY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_MUGWORT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_NETTLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_OLIVE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_SAGE,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

const DEFINING_WORLD_PLAZA_FORAGE_FOOD_NO_HEALTH_HEAL = {
  baseFlat: 0,
  percentOfMax: 0,
} as const;

type DefiningWorldPlazaForageItemSeed = {
  readonly typeId: string;
  readonly name: string;
  readonly rarity: DefiningWorldPlazaInventoryItemRarity;
  readonly cookedWellFedBuffId?: string;
  readonly cookedWellFedChance?: number;
};

const DEFINING_WORLD_PLAZA_EXTENDED_FORAGE_ITEM_SEEDS: readonly DefiningWorldPlazaForageItemSeed[] =
  [
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_CRANBERRY,
      name: 'Cranberry',
      rarity: 'common',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_BLACKBERRY,
      name: 'Blackberry',
      rarity: 'common',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RASPBERRY,
      name: 'Raspberry',
      rarity: 'common',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_BILBERRY,
      name: 'Bilberry',
      rarity: 'uncommon',
      cookedWellFedBuffId: 'forage-bilberry-alert-buff',
      cookedWellFedChance: DEFINING_WORLD_PLAZA_FORAGE_EAT_BUFF_CHANCE_UNCOMMON,
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_JUNIPER,
      name: 'Juniper Berry',
      rarity: 'uncommon',
      cookedWellFedBuffId: 'forage-juniper-cold-comfort-buff',
      cookedWellFedChance: DEFINING_WORLD_PLAZA_FORAGE_EAT_BUFF_CHANCE_UNCOMMON,
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_SEA_BUCKTHORN,
      name: 'Sea Buckthorn',
      rarity: 'rare',
      cookedWellFedBuffId: 'forage-sea-buckthorn-heat-ward-buff',
      cookedWellFedChance: DEFINING_WORLD_PLAZA_FORAGE_EAT_BUFF_CHANCE_RARE,
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_YEW_ARIL,
      name: 'Yew Aril',
      rarity: 'epic',
      cookedWellFedBuffId: 'forage-yew-aril-vital-buff',
      cookedWellFedChance: DEFINING_WORLD_PLAZA_FORAGE_EAT_BUFF_CHANCE_EPIC,
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_WOLFBERRY,
      name: 'Wolfberry',
      rarity: 'mythic',
      cookedWellFedBuffId: 'forage-wolfberry-venom-ward-buff',
      cookedWellFedChance: DEFINING_WORLD_PLAZA_FORAGE_EAT_BUFF_CHANCE_MYTHIC,
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_LOTUS_FRUIT,
      name: 'Lotus Fruit',
      rarity: 'legendary',
      cookedWellFedBuffId: 'forage-lotus-trance-buff',
      cookedWellFedChance:
        DEFINING_WORLD_PLAZA_FORAGE_EAT_BUFF_CHANCE_LEGENDARY,
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_NETTLE,
      name: 'Nettle',
      rarity: 'common',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_LEMON_BALM,
      name: 'Lemon Balm',
      rarity: 'common',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_SAGE,
      name: 'Sage',
      rarity: 'common',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_MUGWORT,
      name: 'Mugwort',
      rarity: 'uncommon',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_BAY_LAUREL,
      name: 'Bay Laurel',
      rarity: 'uncommon',
      cookedWellFedBuffId: 'forage-bay-laurel-brace-buff',
      cookedWellFedChance: DEFINING_WORLD_PLAZA_FORAGE_EAT_BUFF_CHANCE_UNCOMMON,
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_HOLLY,
      name: 'Holly Leaf',
      rarity: 'rare',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_MISTLETOE,
      name: 'Mistletoe',
      rarity: 'epic',
      cookedWellFedBuffId: 'forage-mistletoe-kiss-buff',
      cookedWellFedChance: DEFINING_WORLD_PLAZA_FORAGE_EAT_BUFF_CHANCE_EPIC,
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_OLIVE,
      name: 'Olive Leaf',
      rarity: 'mythic',
      cookedWellFedBuffId: 'forage-olive-climate-ward-buff',
      cookedWellFedChance: DEFINING_WORLD_PLAZA_FORAGE_EAT_BUFF_CHANCE_MYTHIC,
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_MOLY,
      name: 'Moly',
      rarity: 'legendary',
      cookedWellFedBuffId: 'forage-moly-circe-ward-buff',
      cookedWellFedChance:
        DEFINING_WORLD_PLAZA_FORAGE_EAT_BUFF_CHANCE_LEGENDARY,
    },
  ] as const;

export function registeringWorldPlazaInventoryForageItemDefinitions(): readonly DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return DEFINING_WORLD_PLAZA_EXTENDED_FORAGE_ITEM_SEEDS.map((seed) => ({
    typeId: seed.typeId,
    name: seed.name,
    rarity: seed.rarity,
    maxStack: 99,
    isDroppable: true,
    isStackable: true,
    iconSpriteSheet:
      resolvingWorldPlazaInventoryForageSpriteSheetIcon(seed.typeId) ??
      undefined,
    food: {
      hungerRestoreRatio: DEFINING_WORLD_PLAZA_HUNGER_RESTORE_BERRIES,
      healthHeal: DEFINING_WORLD_PLAZA_FORAGE_FOOD_NO_HEALTH_HEAL,
      ...(seed.cookedWellFedBuffId && seed.cookedWellFedChance !== undefined
        ? {
            cookedWellFedBuffId: seed.cookedWellFedBuffId,
            cookedWellFedChance: seed.cookedWellFedChance,
          }
        : {}),
    },
  }));
}
