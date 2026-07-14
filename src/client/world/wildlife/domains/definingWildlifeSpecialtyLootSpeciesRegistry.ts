/**
 * Per-species specialty loot rolls (common + rare body parts / products).
 *
 * @module components/world/wildlife/domains/definingWildlifeSpecialtyLootSpeciesRegistry
 */

import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type DefiningWildlifeSpecialtyLootRoll = {
  readonly itemTypeId: string;
  /** Chance [0, 1] to drop quantity 1 on death loot pass. */
  readonly dropChance: number;
};

export type DefiningWildlifeSpecialtyLootSpeciesEntry = {
  readonly speciesId: DefiningWildlifeSpeciesId;
  readonly common: DefiningWildlifeSpecialtyLootRoll;
  readonly rare: DefiningWildlifeSpecialtyLootRoll;
};

const C = {
  farmCommon: 0.7,
  farmRare: 0.15,
  wildCommon: 0.55,
  wildRare: 0.1,
  predatorCommon: 0.5,
  predatorRare: 0.08,
  apexRare: 0.06,
  megaRare: 0.05,
  epicRare: 0.04,
  companionCommon: 0.65,
  companionRare: 0.12,
  fairyCommon: 0.8,
  fairyRare: 0.1,
} as const;

/** Specialty loot table for every registered wildlife species. */
export const DEFINING_WILDLIFE_SPECIALTY_LOOT_SPECIES_REGISTRY: readonly DefiningWildlifeSpecialtyLootSpeciesEntry[] =
  [
    // farm
    {
      speciesId: 'cow',
      common: { itemTypeId: 'world-plaza-wildlife-milk', dropChance: C.farmCommon },
      rare: { itemTypeId: 'world-plaza-wildlife-hide', dropChance: C.farmRare },
    },
    {
      speciesId: 'cow-brown',
      common: { itemTypeId: 'world-plaza-wildlife-milk', dropChance: C.farmCommon },
      rare: {
        itemTypeId: 'world-plaza-wildlife-brown-hide',
        dropChance: C.farmRare,
      },
    },
    {
      speciesId: 'sheep',
      common: { itemTypeId: 'world-plaza-wildlife-wool', dropChance: C.farmCommon },
      rare: {
        itemTypeId: 'world-plaza-wildlife-sheep-skin',
        dropChance: C.farmRare,
      },
    },
    {
      speciesId: 'chicken',
      common: {
        itemTypeId: 'world-plaza-wildlife-feather',
        dropChance: C.farmCommon,
      },
      rare: { itemTypeId: 'world-plaza-wildlife-egg', dropChance: C.farmRare },
    },
    {
      speciesId: 'pig',
      common: {
        itemTypeId: 'world-plaza-wildlife-bristle',
        dropChance: C.farmCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-pig-fat',
        dropChance: C.farmRare,
      },
    },
    {
      speciesId: 'bull',
      common: { itemTypeId: 'world-plaza-wildlife-hide', dropChance: C.wildCommon },
      rare: { itemTypeId: 'world-plaza-wildlife-horn', dropChance: C.wildRare },
    },
    {
      speciesId: 'bison',
      common: {
        itemTypeId: 'world-plaza-wildlife-shaggy-coat',
        dropChance: C.wildCommon,
      },
      rare: { itemTypeId: 'world-plaza-wildlife-horn', dropChance: C.wildRare },
    },
    {
      speciesId: 'water-buffalo',
      common: {
        itemTypeId: 'world-plaza-wildlife-muddy-hide',
        dropChance: C.wildCommon,
      },
      rare: { itemTypeId: 'world-plaza-wildlife-horn', dropChance: C.wildRare },
    },

    // companions
    {
      speciesId: 'shepherd-dog',
      common: {
        itemTypeId: 'world-plaza-wildlife-dog-fur',
        dropChance: C.companionCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-dog-tooth',
        dropChance: C.companionRare,
      },
    },
    {
      speciesId: 'husky',
      common: {
        itemTypeId: 'world-plaza-wildlife-dog-fur',
        dropChance: C.companionCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-dog-tooth',
        dropChance: C.companionRare,
      },
    },
    {
      speciesId: 'golden-retriever',
      common: {
        itemTypeId: 'world-plaza-wildlife-dog-fur',
        dropChance: C.companionCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-dog-tooth',
        dropChance: C.companionRare,
      },
    },
    {
      speciesId: 'cat-black',
      common: {
        itemTypeId: 'world-plaza-wildlife-night-whisker',
        dropChance: C.companionCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-cat-claw',
        dropChance: C.companionRare,
      },
    },
    {
      speciesId: 'cat-white',
      common: {
        itemTypeId: 'world-plaza-wildlife-pale-fur',
        dropChance: C.companionCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-cat-claw',
        dropChance: C.companionRare,
      },
    },
    {
      speciesId: 'cat-orange',
      common: {
        itemTypeId: 'world-plaza-wildlife-sun-fur',
        dropChance: C.companionCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-cat-claw',
        dropChance: C.companionRare,
      },
    },
    {
      speciesId: 'cat-large',
      common: {
        itemTypeId: 'world-plaza-wildlife-heavy-fur',
        dropChance: C.companionCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-cat-claw',
        dropChance: C.companionRare,
      },
    },

    // runners
    {
      speciesId: 'deer',
      common: {
        itemTypeId: 'world-plaza-wildlife-soft-hide',
        dropChance: C.wildCommon,
      },
      rare: { itemTypeId: 'world-plaza-wildlife-tendon', dropChance: C.wildRare },
    },
    {
      speciesId: 'stag',
      common: {
        itemTypeId: 'world-plaza-wildlife-soft-hide',
        dropChance: C.wildCommon,
      },
      rare: { itemTypeId: 'world-plaza-wildlife-antler', dropChance: C.wildRare },
    },
    {
      speciesId: 'zebra',
      common: {
        itemTypeId: 'world-plaza-wildlife-stripe-hide',
        dropChance: C.wildCommon,
      },
      rare: { itemTypeId: 'world-plaza-wildlife-hoof', dropChance: C.wildRare },
    },
    {
      speciesId: 'antilope',
      common: {
        itemTypeId: 'world-plaza-wildlife-thin-hide',
        dropChance: C.wildCommon,
      },
      rare: { itemTypeId: 'world-plaza-wildlife-tendon', dropChance: C.wildRare },
    },
    {
      speciesId: 'oryx',
      common: {
        itemTypeId: 'world-plaza-wildlife-desert-hide',
        dropChance: C.wildCommon,
      },
      rare: { itemTypeId: 'world-plaza-wildlife-horn', dropChance: C.wildRare },
    },
    {
      speciesId: 'ostrich',
      common: {
        itemTypeId: 'world-plaza-wildlife-plume',
        dropChance: C.wildCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-ostrich-egg',
        dropChance: C.wildRare,
      },
    },
    {
      speciesId: 'camel',
      common: {
        itemTypeId: 'world-plaza-wildlife-camel-hair',
        dropChance: C.wildCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-bladder',
        dropChance: C.wildRare,
      },
    },
    {
      speciesId: 'giraffe',
      common: {
        itemTypeId: 'world-plaza-wildlife-tall-hide',
        dropChance: C.wildCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-neck-bone',
        dropChance: C.wildRare,
      },
    },
    {
      speciesId: 'monkey',
      common: {
        itemTypeId: 'world-plaza-wildlife-monkey-fur',
        dropChance: C.wildCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-stolen-fruit',
        dropChance: C.wildRare,
      },
    },
    {
      speciesId: 'chimp',
      common: {
        itemTypeId: 'world-plaza-wildlife-chimp-fur',
        dropChance: C.wildCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-knuckle-bone',
        dropChance: C.wildRare,
      },
    },

    // horses / high ground
    {
      speciesId: 'brown-horse',
      common: {
        itemTypeId: 'world-plaza-wildlife-horsehair',
        dropChance: C.wildCommon,
      },
      rare: { itemTypeId: 'world-plaza-wildlife-hoof', dropChance: C.wildRare },
    },
    {
      speciesId: 'work-horse',
      common: {
        itemTypeId: 'world-plaza-wildlife-horsehair',
        dropChance: C.wildCommon,
      },
      rare: { itemTypeId: 'world-plaza-wildlife-hoof', dropChance: C.wildRare },
    },
    {
      speciesId: 'arabian-horse',
      common: {
        itemTypeId: 'world-plaza-wildlife-fine-hair',
        dropChance: C.wildCommon,
      },
      rare: { itemTypeId: 'world-plaza-wildlife-hoof', dropChance: C.wildRare },
    },
    {
      speciesId: 'donkey',
      common: {
        itemTypeId: 'world-plaza-wildlife-coarse-hair',
        dropChance: C.wildCommon,
      },
      rare: { itemTypeId: 'world-plaza-wildlife-hoof', dropChance: C.wildRare },
    },
    {
      speciesId: 'llama',
      common: {
        itemTypeId: 'world-plaza-wildlife-llama-wool',
        dropChance: C.wildCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-spit-sac',
        dropChance: C.wildRare,
      },
    },
    {
      speciesId: 'alpaca',
      common: {
        itemTypeId: 'world-plaza-wildlife-wool',
        dropChance: C.wildCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-soft-fleece',
        dropChance: C.wildRare,
      },
    },
    {
      speciesId: 'yak',
      common: {
        itemTypeId: 'world-plaza-wildlife-yak-wool',
        dropChance: C.wildCommon,
      },
      rare: { itemTypeId: 'world-plaza-wildlife-horn', dropChance: C.wildRare },
    },
    {
      speciesId: 'ram',
      common: {
        itemTypeId: 'world-plaza-wildlife-wool',
        dropChance: C.wildCommon,
      },
      rare: { itemTypeId: 'world-plaza-wildlife-horn', dropChance: C.wildRare },
    },

    // shell / water / ice
    {
      speciesId: 'turtle',
      common: {
        itemTypeId: 'world-plaza-wildlife-shell-scute',
        dropChance: C.wildCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-full-shell',
        dropChance: C.wildRare,
      },
    },
    {
      speciesId: 'tortoise',
      common: {
        itemTypeId: 'world-plaza-wildlife-shell-scute',
        dropChance: C.wildCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-full-shell',
        dropChance: C.wildRare,
      },
    },
    {
      speciesId: 'pinguin',
      common: {
        itemTypeId: 'world-plaza-wildlife-down',
        dropChance: C.wildCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-blubber',
        dropChance: C.wildRare,
      },
    },
    {
      speciesId: 'hippo',
      common: {
        itemTypeId: 'world-plaza-wildlife-river-hide',
        dropChance: C.predatorCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-ivory-tooth',
        dropChance: C.predatorRare,
      },
    },
    {
      speciesId: 'crocodile',
      common: {
        itemTypeId: 'world-plaza-wildlife-scale',
        dropChance: C.predatorCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-tooth',
        dropChance: C.predatorRare,
      },
    },

    // bears / boar / pack
    {
      speciesId: 'boar',
      common: {
        itemTypeId: 'world-plaza-wildlife-bristle',
        dropChance: C.wildCommon,
      },
      rare: { itemTypeId: 'world-plaza-wildlife-tusk', dropChance: C.wildRare },
    },
    {
      speciesId: 'brown-bear',
      common: {
        itemTypeId: 'world-plaza-wildlife-brown-fur',
        dropChance: C.predatorCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-claw',
        dropChance: C.predatorRare,
      },
    },
    {
      speciesId: 'grizzly',
      common: {
        itemTypeId: 'world-plaza-wildlife-brown-fur',
        dropChance: C.predatorCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-claw',
        dropChance: C.predatorRare,
      },
    },
    {
      speciesId: 'polar-bear',
      common: {
        itemTypeId: 'world-plaza-wildlife-white-fur',
        dropChance: C.predatorCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-fang',
        dropChance: C.predatorRare,
      },
    },
    {
      speciesId: 'grey-wolf',
      common: {
        itemTypeId: 'world-plaza-wildlife-wolf-fur',
        dropChance: C.predatorCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-fang',
        dropChance: C.predatorRare,
      },
    },
    {
      speciesId: 'omega-wolf',
      common: {
        itemTypeId: 'world-plaza-wildlife-night-pelt',
        dropChance: C.predatorCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-omega-fang',
        dropChance: C.epicRare,
      },
    },
    {
      speciesId: 'hyena',
      common: {
        itemTypeId: 'world-plaza-wildlife-spotted-hide',
        dropChance: C.predatorCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-bone',
        dropChance: C.predatorRare,
      },
    },
    {
      speciesId: 'lion',
      common: {
        itemTypeId: 'world-plaza-wildlife-mane',
        dropChance: C.predatorCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-claw',
        dropChance: C.apexRare,
      },
    },
    {
      speciesId: 'lioness',
      common: {
        itemTypeId: 'world-plaza-wildlife-lean-hide',
        dropChance: C.predatorCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-claw',
        dropChance: C.apexRare,
      },
    },
    {
      speciesId: 'tiger',
      common: {
        itemTypeId: 'world-plaza-wildlife-stripe-fur',
        dropChance: C.predatorCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-fang',
        dropChance: C.apexRare,
      },
    },
    {
      speciesId: 'jaguar',
      common: {
        itemTypeId: 'world-plaza-wildlife-spot-fur',
        dropChance: C.predatorCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-jawbone',
        dropChance: C.apexRare,
      },
    },
    {
      speciesId: 'sunhead',
      common: {
        itemTypeId: 'world-plaza-wildlife-ember-scale',
        dropChance: C.predatorCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-crown-plate',
        dropChance: C.epicRare,
      },
    },

    // giants
    {
      speciesId: 'elephant',
      common: {
        itemTypeId: 'world-plaza-wildlife-thick-hide',
        dropChance: C.predatorCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-ivory',
        dropChance: C.megaRare,
      },
    },
    {
      speciesId: 'elephant-female',
      common: {
        itemTypeId: 'world-plaza-wildlife-thick-hide',
        dropChance: C.predatorCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-ivory',
        dropChance: C.megaRare,
      },
    },
    {
      speciesId: 'rhino',
      common: {
        itemTypeId: 'world-plaza-wildlife-plate-hide',
        dropChance: C.predatorCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-horn',
        dropChance: C.megaRare,
      },
    },
    {
      speciesId: 'rhino-female',
      common: {
        itemTypeId: 'world-plaza-wildlife-plate-hide',
        dropChance: C.predatorCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-horn',
        dropChance: C.megaRare,
      },
    },
    {
      speciesId: 'mammoth',
      common: {
        itemTypeId: 'world-plaza-wildlife-shag-wool',
        dropChance: C.predatorCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-ice-tusk',
        dropChance: C.epicRare,
      },
    },

    // special
    {
      speciesId: 'fairy',
      common: {
        itemTypeId: 'world-plaza-wildlife-gold-dust',
        dropChance: C.fairyCommon,
      },
      rare: {
        itemTypeId: 'world-plaza-wildlife-wing-mote',
        dropChance: C.fairyRare,
      },
    },
  ];

const DEFINING_WILDLIFE_SPECIALTY_LOOT_BY_SPECIES_ID = Object.fromEntries(
  DEFINING_WILDLIFE_SPECIALTY_LOOT_SPECIES_REGISTRY.map((entry) => [
    entry.speciesId,
    entry,
  ])
) as Record<string, DefiningWildlifeSpecialtyLootSpeciesEntry>;

export function resolvingWildlifeSpecialtyLootSpeciesEntry(
  speciesId: DefiningWildlifeSpeciesId
): DefiningWildlifeSpecialtyLootSpeciesEntry | null {
  return DEFINING_WILDLIFE_SPECIALTY_LOOT_BY_SPECIES_ID[speciesId] ?? null;
}
