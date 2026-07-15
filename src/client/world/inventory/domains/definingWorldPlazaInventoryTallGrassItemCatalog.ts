/**
 * Tall-grass forage item catalog (type id, name, rarity, inspect description).
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryTallGrassItemCatalog
 */

import type { DefiningWorldPlazaInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BURROW_FLUFF,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CHIRPER_SHELL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_DEW_CAUGHT_SEED,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FIELD_SNAIL_TRAIL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_GRASS_FIBER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_KNOTWEED_STEM,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LOST_STITCH_SCRAP,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_MEADOW_MITE_HUSK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RUSTED_CLASP,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SOFT_DOWN,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_THATCH_BUNDLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WILD_OAT_HEAD,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

export type DefiningWorldPlazaTallGrassInventoryItemSeed = {
  readonly typeId: string;
  readonly name: string;
  readonly rarity: DefiningWorldPlazaInventoryItemRarity;
  readonly description: string;
};

/** Tall-grass forage seeds used by registration and the description corpus. */
export const DEFINING_WORLD_PLAZA_TALL_GRASS_INVENTORY_ITEM_SEEDS: readonly DefiningWorldPlazaTallGrassInventoryItemSeed[] =
  [
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_THATCH_BUNDLE,
      name: 'Thatch bundle',
      rarity: 'common',
      description:
        'Dry stalks pulled from the meadow and tied tight. Rope, roofing, pillow fill, or a quick fire wrap.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_GRASS_FIBER,
      name: 'Grass fiber',
      rarity: 'common',
      description:
        'Tough green strands stripped from living blades. Bandages, nets, trap string.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SOFT_DOWN,
      name: 'Soft down',
      rarity: 'common',
      description:
        'Seed fluff that sticks to your sleeve if you brush the seed heads. Soft lining for pouches, fever cloth, and bedding.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CHIRPER_SHELL,
      name: 'Chirper shell',
      rarity: 'uncommon',
      description:
        'Empty cricket shell, still faintly buzzing in your head. Good bait, or crush it for grit.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_MEADOW_MITE_HUSK,
      name: 'Meadow mite husk',
      rarity: 'rare',
      description:
        'Papery mite shell left in the thatch. Grind it into binder for plague and antiserum work.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WILD_OAT_HEAD,
      name: 'Wild oat head',
      rarity: 'common',
      description:
        'A grain spike knocked loose while parting the grass. Mash, travel cake, or animal feed.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_KNOTWEED_STEM,
      name: 'Knotweed stem',
      rarity: 'uncommon',
      description:
        'A bendy stem that springs back when you cut it. Holds as a splint stick or basket rib.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_DEW_CAUGHT_SEED,
      name: 'Dew-caught seed',
      rarity: 'uncommon',
      description:
        'A seed still wet with morning dew. Pocket it for a later field sow.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LOST_STITCH_SCRAP,
      name: 'Lost stitch scrap',
      rarity: 'uncommon',
      description:
        'Frayed cloth snagged on a stem, a few stitches still holding. Cheap dressing backing.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FIELD_SNAIL_TRAIL,
      name: 'Field snail trail',
      rarity: 'rare',
      description:
        'Sticky trail goo scraped off a leaf. Binds salves and drawing poultices.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BURROW_FLUFF,
      name: 'Burrow fluff',
      rarity: 'common',
      description:
        'Warm nest lining kicked free of a burrow mouth. Tinder, smoke packing, or soft fill when better cloth is dear.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RUSTED_CLASP,
      name: 'Rusted clasp',
      rarity: 'rare',
      description:
        'A corroded buckle pin lost in the grass years ago. Scrap metal for traps and repair kits.',
    },
  ];
