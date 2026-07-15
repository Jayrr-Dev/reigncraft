/**
 * Tall-grass forage inventory item definitions.
 *
 * @module components/world/inventory/domains/registeringWorldPlazaInventoryTallGrassItemDefinitions
 */

import type { DefiningWorldPlazaInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
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
import { resolvingWorldPlazaInventoryTallGrassSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryTallGrassSpriteSheetConstants';

const DEFINING_WORLD_PLAZA_TALL_GRASS_INVENTORY_ITEM_SEEDS = [
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_THATCH_BUNDLE,
    name: 'Thatch bundle',
    rarity: 'common' as const satisfies DefiningWorldPlazaInventoryItemRarity,
    description:
      'Dry straw tied for rope, roofing, pillow fill, or a quick fire wrap.',
  },
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_GRASS_FIBER,
    name: 'Grass fiber',
    rarity: 'common' as const satisfies DefiningWorldPlazaInventoryItemRarity,
    description: 'Tough green thread for bandages, nets, and trap string.',
  },
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SOFT_DOWN,
    name: 'Soft down',
    rarity: 'common' as const satisfies DefiningWorldPlazaInventoryItemRarity,
    description:
      'Light fluff for pouch lining, fever cloth padding, and bedding.',
  },
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CHIRPER_SHELL,
    name: 'Chirper shell',
    rarity: 'uncommon' as const satisfies DefiningWorldPlazaInventoryItemRarity,
    description: 'A hard cricket shell. Good bait, or crush it for grit.',
  },
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_MEADOW_MITE_HUSK,
    name: 'Meadow mite husk',
    rarity: 'rare' as const satisfies DefiningWorldPlazaInventoryItemRarity,
    description:
      'Empty mite shell. Grind into binder for plague and antiserum work.',
  },
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WILD_OAT_HEAD,
    name: 'Wild oat head',
    rarity: 'common' as const satisfies DefiningWorldPlazaInventoryItemRarity,
    description: 'A grain spike for mash, travel cake, or animal feed.',
  },
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_KNOTWEED_STEM,
    name: 'Knotweed stem',
    rarity: 'uncommon' as const satisfies DefiningWorldPlazaInventoryItemRarity,
    description: 'A bendy stem that holds as a splint stick or basket rib.',
  },
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_DEW_CAUGHT_SEED,
    name: 'Dew-caught seed',
    rarity: 'uncommon' as const satisfies DefiningWorldPlazaInventoryItemRarity,
    description:
      'A seed still wet with morning dew. Ready for a later field sow.',
  },
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LOST_STITCH_SCRAP,
    name: 'Lost stitch scrap',
    rarity: 'uncommon' as const satisfies DefiningWorldPlazaInventoryItemRarity,
    description:
      'Frayed cloth with a few stitches left. Cheap dressing backing.',
  },
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FIELD_SNAIL_TRAIL,
    name: 'Field snail trail',
    rarity: 'rare' as const satisfies DefiningWorldPlazaInventoryItemRarity,
    description: 'Sticky trail goo. Binds salves and drawing poultices.',
  },
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BURROW_FLUFF,
    name: 'Burrow fluff',
    rarity: 'common' as const satisfies DefiningWorldPlazaInventoryItemRarity,
    description:
      'Warm nest lining. Tinder, smoke packing, or soft lining on the cheap.',
  },
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RUSTED_CLASP,
    name: 'Rusted clasp',
    rarity: 'rare' as const satisfies DefiningWorldPlazaInventoryItemRarity,
    description:
      'A corroded buckle pin. Scrap metal for traps and repair kits.',
  },
] as const;

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
