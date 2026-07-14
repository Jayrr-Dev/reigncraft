/**
 * Unique wildlife specialty loot items (body parts / products). Meat stays separate.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpecialtyLootItemCatalog
 */

import type { DefiningInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';

export type DefiningWildlifeSpecialtyLootItemDefinition = {
  readonly itemTypeId: string;
  readonly displayName: string;
  readonly rarity: DefiningInventoryItemRarity;
  readonly description: string;
  /** Sprite sheet group id used by specialty sprite constants. */
  readonly spriteGroupId: DefiningWildlifeSpecialtyLootSpriteGroupId;
  /** Index within that group's left→right, top→bottom cell order. */
  readonly spriteCellIndex: number;
};

export type DefiningWildlifeSpecialtyLootSpriteGroupId =
  | 'farm'
  | 'companions'
  | 'runners'
  | 'horses'
  | 'shell'
  | 'predators'
  | 'giants';

/** All unique specialty loot item definitions (shared across species). */
export const DEFINING_WILDLIFE_SPECIALTY_LOOT_ITEM_CATALOG: readonly DefiningWildlifeSpecialtyLootItemDefinition[] =
  [
    // farm (12) — 4×3
    {
      itemTypeId: 'world-plaza-wildlife-milk',
      displayName: 'Milk',
      rarity: 'common',
      description: 'Fresh milk from a plains cow.',
      spriteGroupId: 'farm',
      spriteCellIndex: 0,
    },
    {
      itemTypeId: 'world-plaza-wildlife-wool',
      displayName: 'Wool',
      rarity: 'common',
      description: 'Soft wool sheared from a grazer.',
      spriteGroupId: 'farm',
      spriteCellIndex: 1,
    },
    {
      itemTypeId: 'world-plaza-wildlife-feather',
      displayName: 'Feather',
      rarity: 'common',
      description: 'A light bird feather.',
      spriteGroupId: 'farm',
      spriteCellIndex: 2,
    },
    {
      itemTypeId: 'world-plaza-wildlife-egg',
      displayName: 'Egg',
      rarity: 'rare',
      description: 'A warm egg. Good food when cooked.',
      spriteGroupId: 'farm',
      spriteCellIndex: 3,
    },
    {
      itemTypeId: 'world-plaza-wildlife-bristle',
      displayName: 'Bristle',
      rarity: 'common',
      description: 'Stiff hair from a pig or boar.',
      spriteGroupId: 'farm',
      spriteCellIndex: 4,
    },
    {
      itemTypeId: 'world-plaza-wildlife-pig-fat',
      displayName: 'Pig Fat',
      rarity: 'rare',
      description: 'Dense fat. Cooks hot and fills the bag.',
      spriteGroupId: 'farm',
      spriteCellIndex: 5,
    },
    {
      itemTypeId: 'world-plaza-wildlife-hide',
      displayName: 'Hide',
      rarity: 'common',
      description: 'A plain animal hide.',
      spriteGroupId: 'farm',
      spriteCellIndex: 6,
    },
    {
      itemTypeId: 'world-plaza-wildlife-brown-hide',
      displayName: 'Brown Hide',
      rarity: 'rare',
      description: 'Hide from a brown-coat cow.',
      spriteGroupId: 'farm',
      spriteCellIndex: 7,
    },
    {
      itemTypeId: 'world-plaza-wildlife-sheep-skin',
      displayName: 'Sheep Skin',
      rarity: 'rare',
      description: 'Wool still clinging to the skin.',
      spriteGroupId: 'farm',
      spriteCellIndex: 8,
    },
    {
      itemTypeId: 'world-plaza-wildlife-muddy-hide',
      displayName: 'Muddy Hide',
      rarity: 'common',
      description: 'Hide caked in swamp mud.',
      spriteGroupId: 'farm',
      spriteCellIndex: 9,
    },
    {
      itemTypeId: 'world-plaza-wildlife-horn',
      displayName: 'Horn',
      rarity: 'rare',
      description: 'A solid horn tip for tools.',
      spriteGroupId: 'farm',
      spriteCellIndex: 10,
    },
    {
      itemTypeId: 'world-plaza-wildlife-shaggy-coat',
      displayName: 'Shaggy Coat',
      rarity: 'common',
      description: 'Thick coat fur from a heavy grazer.',
      spriteGroupId: 'farm',
      spriteCellIndex: 11,
    },

    // companions (8) — 4×2
    {
      itemTypeId: 'world-plaza-wildlife-dog-fur',
      displayName: 'Dog Fur',
      rarity: 'common',
      description: 'Soft fur shed by a companion dog.',
      spriteGroupId: 'companions',
      spriteCellIndex: 0,
    },
    {
      itemTypeId: 'world-plaza-wildlife-dog-tooth',
      displayName: 'Dog Tooth',
      rarity: 'rare',
      description: 'A clean dog tooth.',
      spriteGroupId: 'companions',
      spriteCellIndex: 1,
    },
    {
      itemTypeId: 'world-plaza-wildlife-whisker',
      displayName: 'Whisker',
      rarity: 'common',
      description: 'A long cat whisker.',
      spriteGroupId: 'companions',
      spriteCellIndex: 2,
    },
    {
      itemTypeId: 'world-plaza-wildlife-pale-fur',
      displayName: 'Pale Fur',
      rarity: 'common',
      description: 'Light fur from a white cat.',
      spriteGroupId: 'companions',
      spriteCellIndex: 3,
    },
    {
      itemTypeId: 'world-plaza-wildlife-sun-fur',
      displayName: 'Sun Fur',
      rarity: 'common',
      description: 'Warm orange cat fur.',
      spriteGroupId: 'companions',
      spriteCellIndex: 4,
    },
    {
      itemTypeId: 'world-plaza-wildlife-heavy-fur',
      displayName: 'Heavy Fur',
      rarity: 'common',
      description: 'Thick fur from a large cat.',
      spriteGroupId: 'companions',
      spriteCellIndex: 5,
    },
    {
      itemTypeId: 'world-plaza-wildlife-cat-claw',
      displayName: 'Cat Claw',
      rarity: 'rare',
      description: 'A curved house-cat claw.',
      spriteGroupId: 'companions',
      spriteCellIndex: 6,
    },
    {
      itemTypeId: 'world-plaza-wildlife-night-whisker',
      displayName: 'Night Whisker',
      rarity: 'common',
      description: 'A black cat whisker.',
      spriteGroupId: 'companions',
      spriteCellIndex: 7,
    },

    // runners (12) — 4×3
    {
      itemTypeId: 'world-plaza-wildlife-soft-hide',
      displayName: 'Soft Hide',
      rarity: 'common',
      description: 'Thin hide from a skittish browser.',
      spriteGroupId: 'runners',
      spriteCellIndex: 0,
    },
    {
      itemTypeId: 'world-plaza-wildlife-tendon',
      displayName: 'Tendon',
      rarity: 'rare',
      description: 'Tough sinew for string and bow work.',
      spriteGroupId: 'runners',
      spriteCellIndex: 1,
    },
    {
      itemTypeId: 'world-plaza-wildlife-antler',
      displayName: 'Antler',
      rarity: 'rare',
      description: 'A branched stag antler.',
      spriteGroupId: 'runners',
      spriteCellIndex: 2,
    },
    {
      itemTypeId: 'world-plaza-wildlife-stripe-hide',
      displayName: 'Stripe Hide',
      rarity: 'common',
      description: 'Hide with zebra stripes.',
      spriteGroupId: 'runners',
      spriteCellIndex: 3,
    },
    {
      itemTypeId: 'world-plaza-wildlife-thin-hide',
      displayName: 'Thin Hide',
      rarity: 'common',
      description: 'Light hide from a fast runner.',
      spriteGroupId: 'runners',
      spriteCellIndex: 4,
    },
    {
      itemTypeId: 'world-plaza-wildlife-desert-hide',
      displayName: 'Desert Hide',
      rarity: 'common',
      description: 'Dry hide from desert game.',
      spriteGroupId: 'runners',
      spriteCellIndex: 5,
    },
    {
      itemTypeId: 'world-plaza-wildlife-plume',
      displayName: 'Plume',
      rarity: 'common',
      description: 'A tall ostrich plume.',
      spriteGroupId: 'runners',
      spriteCellIndex: 6,
    },
    {
      itemTypeId: 'world-plaza-wildlife-ostrich-egg',
      displayName: 'Ostrich Egg',
      rarity: 'rare',
      description: 'An egg the size of a stone bowl.',
      spriteGroupId: 'runners',
      spriteCellIndex: 7,
    },
    {
      itemTypeId: 'world-plaza-wildlife-camel-hair',
      displayName: 'Camel Hair',
      rarity: 'common',
      description: 'Coarse hair from a desert camel.',
      spriteGroupId: 'runners',
      spriteCellIndex: 8,
    },
    {
      itemTypeId: 'world-plaza-wildlife-bladder',
      displayName: 'Bladder',
      rarity: 'rare',
      description: 'A sealed bladder. Holds water when cleaned.',
      spriteGroupId: 'runners',
      spriteCellIndex: 9,
    },
    {
      itemTypeId: 'world-plaza-wildlife-tall-hide',
      displayName: 'Tall Hide',
      rarity: 'common',
      description: 'Hide from a long-necked browser.',
      spriteGroupId: 'runners',
      spriteCellIndex: 10,
    },
    {
      itemTypeId: 'world-plaza-wildlife-neck-bone',
      displayName: 'Neck Bone',
      rarity: 'rare',
      description: 'A long neck bone for hafts.',
      spriteGroupId: 'runners',
      spriteCellIndex: 11,
    },

    // horses (12) — 4×3
    {
      itemTypeId: 'world-plaza-wildlife-horsehair',
      displayName: 'Horsehair',
      rarity: 'common',
      description: 'Long hair from a horse mane or tail.',
      spriteGroupId: 'horses',
      spriteCellIndex: 0,
    },
    {
      itemTypeId: 'world-plaza-wildlife-fine-hair',
      displayName: 'Fine Hair',
      rarity: 'common',
      description: 'Fine hair from a desert horse.',
      spriteGroupId: 'horses',
      spriteCellIndex: 1,
    },
    {
      itemTypeId: 'world-plaza-wildlife-coarse-hair',
      displayName: 'Coarse Hair',
      rarity: 'common',
      description: 'Rough hair from a donkey.',
      spriteGroupId: 'horses',
      spriteCellIndex: 2,
    },
    {
      itemTypeId: 'world-plaza-wildlife-hoof',
      displayName: 'Hoof',
      rarity: 'rare',
      description: 'A hard hoof chunk.',
      spriteGroupId: 'horses',
      spriteCellIndex: 3,
    },
    {
      itemTypeId: 'world-plaza-wildlife-llama-wool',
      displayName: 'Llama Wool',
      rarity: 'common',
      description: 'Wool from a rocky-flats llama.',
      spriteGroupId: 'horses',
      spriteCellIndex: 4,
    },
    {
      itemTypeId: 'world-plaza-wildlife-spit-sac',
      displayName: 'Spit Sac',
      rarity: 'rare',
      description: 'A llama spit sac. Messy but real.',
      spriteGroupId: 'horses',
      spriteCellIndex: 5,
    },
    {
      itemTypeId: 'world-plaza-wildlife-soft-fleece',
      displayName: 'Soft Fleece',
      rarity: 'rare',
      description: 'Fine alpaca fleece.',
      spriteGroupId: 'horses',
      spriteCellIndex: 6,
    },
    {
      itemTypeId: 'world-plaza-wildlife-yak-wool',
      displayName: 'Yak Wool',
      rarity: 'common',
      description: 'Dense cold-country yak wool.',
      spriteGroupId: 'horses',
      spriteCellIndex: 7,
    },
    {
      itemTypeId: 'world-plaza-wildlife-monkey-fur',
      displayName: 'Monkey Fur',
      rarity: 'common',
      description: 'Soft fur from a jungle monkey.',
      spriteGroupId: 'horses',
      spriteCellIndex: 8,
    },
    {
      itemTypeId: 'world-plaza-wildlife-stolen-fruit',
      displayName: 'Stolen Fruit',
      rarity: 'rare',
      description: 'Fruit still held in a monkey cheek pouch.',
      spriteGroupId: 'horses',
      spriteCellIndex: 9,
    },
    {
      itemTypeId: 'world-plaza-wildlife-chimp-fur',
      displayName: 'Chimp Fur',
      rarity: 'common',
      description: 'Dark fur from a chimp.',
      spriteGroupId: 'horses',
      spriteCellIndex: 10,
    },
    {
      itemTypeId: 'world-plaza-wildlife-knuckle-bone',
      displayName: 'Knuckle Bone',
      rarity: 'rare',
      description: 'A thick knuckle bone.',
      spriteGroupId: 'horses',
      spriteCellIndex: 11,
    },

    // shell (8) — 4×2
    {
      itemTypeId: 'world-plaza-wildlife-shell-scute',
      displayName: 'Shell Scute',
      rarity: 'common',
      description: 'A hard shell plate.',
      spriteGroupId: 'shell',
      spriteCellIndex: 0,
    },
    {
      itemTypeId: 'world-plaza-wildlife-full-shell',
      displayName: 'Full Shell',
      rarity: 'rare',
      description: 'A whole shell. Bowl or shield plate.',
      spriteGroupId: 'shell',
      spriteCellIndex: 1,
    },
    {
      itemTypeId: 'world-plaza-wildlife-down',
      displayName: 'Down',
      rarity: 'common',
      description: 'Soft cold-country down.',
      spriteGroupId: 'shell',
      spriteCellIndex: 2,
    },
    {
      itemTypeId: 'world-plaza-wildlife-blubber',
      displayName: 'Blubber',
      rarity: 'rare',
      description: 'Thick fat from a cold swimmer.',
      spriteGroupId: 'shell',
      spriteCellIndex: 3,
    },
    {
      itemTypeId: 'world-plaza-wildlife-river-hide',
      displayName: 'River Hide',
      rarity: 'common',
      description: 'Thick hide from a river beast.',
      spriteGroupId: 'shell',
      spriteCellIndex: 4,
    },
    {
      itemTypeId: 'world-plaza-wildlife-ivory-tooth',
      displayName: 'Ivory Tooth',
      rarity: 'rare',
      description: 'A big ivory tooth.',
      spriteGroupId: 'shell',
      spriteCellIndex: 5,
    },
    {
      itemTypeId: 'world-plaza-wildlife-scale',
      displayName: 'Scale',
      rarity: 'common',
      description: 'A tough reptile scale.',
      spriteGroupId: 'shell',
      spriteCellIndex: 6,
    },
    {
      itemTypeId: 'world-plaza-wildlife-tooth',
      displayName: 'Tooth',
      rarity: 'rare',
      description: 'A sharp predator tooth.',
      spriteGroupId: 'shell',
      spriteCellIndex: 7,
    },

    // predators (12) — 4×3
    {
      itemTypeId: 'world-plaza-wildlife-tusk',
      displayName: 'Tusk',
      rarity: 'rare',
      description: 'A curved boar tusk.',
      spriteGroupId: 'predators',
      spriteCellIndex: 0,
    },
    {
      itemTypeId: 'world-plaza-wildlife-brown-fur',
      displayName: 'Brown Fur',
      rarity: 'common',
      description: 'Warm brown bear fur.',
      spriteGroupId: 'predators',
      spriteCellIndex: 1,
    },
    {
      itemTypeId: 'world-plaza-wildlife-claw',
      displayName: 'Claw',
      rarity: 'rare',
      description: 'A heavy predator claw.',
      spriteGroupId: 'predators',
      spriteCellIndex: 2,
    },
    {
      itemTypeId: 'world-plaza-wildlife-white-fur',
      displayName: 'White Fur',
      rarity: 'common',
      description: 'White fur from a polar beast.',
      spriteGroupId: 'predators',
      spriteCellIndex: 3,
    },
    {
      itemTypeId: 'world-plaza-wildlife-fang',
      displayName: 'Fang',
      rarity: 'rare',
      description: 'A long predator fang.',
      spriteGroupId: 'predators',
      spriteCellIndex: 4,
    },
    {
      itemTypeId: 'world-plaza-wildlife-wolf-fur',
      displayName: 'Wolf Fur',
      rarity: 'common',
      description: 'Grey wolf fur.',
      spriteGroupId: 'predators',
      spriteCellIndex: 5,
    },
    {
      itemTypeId: 'world-plaza-wildlife-night-pelt',
      displayName: 'Night Pelt',
      rarity: 'common',
      description: 'Dark pelt from an omega wolf.',
      spriteGroupId: 'predators',
      spriteCellIndex: 6,
    },
    {
      itemTypeId: 'world-plaza-wildlife-omega-fang',
      displayName: 'Omega Fang',
      rarity: 'epic',
      description: 'A heavy fang from an omega wolf.',
      spriteGroupId: 'predators',
      spriteCellIndex: 7,
    },
    {
      itemTypeId: 'world-plaza-wildlife-spotted-hide',
      displayName: 'Spotted Hide',
      rarity: 'common',
      description: 'Hide with hyena spots.',
      spriteGroupId: 'predators',
      spriteCellIndex: 8,
    },
    {
      itemTypeId: 'world-plaza-wildlife-bone',
      displayName: 'Bone',
      rarity: 'rare',
      description: 'A stout scavenger bone.',
      spriteGroupId: 'predators',
      spriteCellIndex: 9,
    },
    {
      itemTypeId: 'world-plaza-wildlife-mane',
      displayName: 'Mane',
      rarity: 'common',
      description: 'A thick lion mane tuft.',
      spriteGroupId: 'predators',
      spriteCellIndex: 10,
    },
    {
      itemTypeId: 'world-plaza-wildlife-lean-hide',
      displayName: 'Lean Hide',
      rarity: 'common',
      description: 'Lean hide from a lioness.',
      spriteGroupId: 'predators',
      spriteCellIndex: 11,
    },

    // giants (12) — 4×3
    {
      itemTypeId: 'world-plaza-wildlife-stripe-fur',
      displayName: 'Stripe Fur',
      rarity: 'common',
      description: 'Fur with tiger stripes.',
      spriteGroupId: 'giants',
      spriteCellIndex: 0,
    },
    {
      itemTypeId: 'world-plaza-wildlife-spot-fur',
      displayName: 'Spot Fur',
      rarity: 'common',
      description: 'Fur with jaguar spots.',
      spriteGroupId: 'giants',
      spriteCellIndex: 1,
    },
    {
      itemTypeId: 'world-plaza-wildlife-jawbone',
      displayName: 'Jawbone',
      rarity: 'rare',
      description: 'A crushing jawbone.',
      spriteGroupId: 'giants',
      spriteCellIndex: 2,
    },
    {
      itemTypeId: 'world-plaza-wildlife-ember-scale',
      displayName: 'Ember Scale',
      rarity: 'common',
      description: 'A heat-hardened sunhead scale.',
      spriteGroupId: 'giants',
      spriteCellIndex: 3,
    },
    {
      itemTypeId: 'world-plaza-wildlife-crown-plate',
      displayName: 'Crown Plate',
      rarity: 'epic',
      description: 'A plate from a sunhead crown.',
      spriteGroupId: 'giants',
      spriteCellIndex: 4,
    },
    {
      itemTypeId: 'world-plaza-wildlife-thick-hide',
      displayName: 'Thick Hide',
      rarity: 'common',
      description: 'Heavy hide from megafauna.',
      spriteGroupId: 'giants',
      spriteCellIndex: 5,
    },
    {
      itemTypeId: 'world-plaza-wildlife-ivory',
      displayName: 'Ivory',
      rarity: 'rare',
      description: 'A shard of ivory.',
      spriteGroupId: 'giants',
      spriteCellIndex: 6,
    },
    {
      itemTypeId: 'world-plaza-wildlife-plate-hide',
      displayName: 'Plate Hide',
      rarity: 'common',
      description: 'Armor-thick rhino hide.',
      spriteGroupId: 'giants',
      spriteCellIndex: 7,
    },
    {
      itemTypeId: 'world-plaza-wildlife-shag-wool',
      displayName: 'Shag Wool',
      rarity: 'common',
      description: 'Shaggy mammoth wool.',
      spriteGroupId: 'giants',
      spriteCellIndex: 8,
    },
    {
      itemTypeId: 'world-plaza-wildlife-ice-tusk',
      displayName: 'Ice Tusk',
      rarity: 'epic',
      description: 'A cold mammoth tusk tip.',
      spriteGroupId: 'giants',
      spriteCellIndex: 9,
    },
    {
      itemTypeId: 'world-plaza-wildlife-gold-dust',
      displayName: 'Gold Dust',
      rarity: 'common',
      description: 'Fine gold dust shed by a fairy.',
      spriteGroupId: 'giants',
      spriteCellIndex: 10,
    },
    {
      itemTypeId: 'world-plaza-wildlife-wing-mote',
      displayName: 'Wing Mote',
      rarity: 'epic',
      description: 'A bright mote from a fairy wing.',
      spriteGroupId: 'giants',
      spriteCellIndex: 11,
    },
  ];

const DEFINING_WILDLIFE_SPECIALTY_LOOT_ITEM_BY_TYPE_ID = Object.fromEntries(
  DEFINING_WILDLIFE_SPECIALTY_LOOT_ITEM_CATALOG.map((entry) => [
    entry.itemTypeId,
    entry,
  ])
) as Record<string, DefiningWildlifeSpecialtyLootItemDefinition>;

export function resolvingWildlifeSpecialtyLootItemDefinition(
  itemTypeId: string
): DefiningWildlifeSpecialtyLootItemDefinition | null {
  return DEFINING_WILDLIFE_SPECIALTY_LOOT_ITEM_BY_TYPE_ID[itemTypeId] ?? null;
}

export function checkingWildlifeSpecialtyLootItemTypeId(
  itemTypeId: string
): boolean {
  return itemTypeId in DEFINING_WILDLIFE_SPECIALTY_LOOT_ITEM_BY_TYPE_ID;
}
