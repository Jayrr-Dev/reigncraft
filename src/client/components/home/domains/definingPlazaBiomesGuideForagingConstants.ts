import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';

/**
 * Codex foraging data for discovered biomes.
 *
 * Edit this file when adding resources or vegetation to the biomes guide.
 * 1. Add a tag to {@link DEFINING_PLAZA_BIOMES_GUIDE_RESOURCE_TAG_CATALOG} or
 *    {@link DEFINING_PLAZA_BIOMES_GUIDE_VEGETATION_TAG_CATALOG}.
 * 2. Reference the tag id in {@link DEFINING_PLAZA_BIOMES_GUIDE_FORAGING_BY_KIND}.
 *
 * @module components/home/domains/definingPlazaBiomesGuideForagingConstants
 */

/** One player-facing resource or vegetation chip in the codex. */
export type DefiningPlazaBiomesGuideForagingTag = {
  label: string;
  icon: string;
};

/** Resource tags keyed by stable id. */
export const DEFINING_PLAZA_BIOMES_GUIDE_RESOURCE_TAG_CATALOG = {
  wood: {
    label: 'Wood',
    icon: 'game-icons:wood-axe',
  },
  stone: {
    label: 'Stone',
    icon: 'mdi:hammer',
  },
  flint: {
    label: 'Flint',
    icon: 'mdi:flash',
  },
  freshwater: {
    label: 'Fresh water',
    icon: 'mdi:water',
  },
  saltwater: {
    label: 'Salt water',
    icon: 'mdi:waves',
  },
  clay: {
    label: 'Clay',
    icon: 'mdi:terrain',
  },
  sand: {
    label: 'Sand',
    icon: 'mdi:beach',
  },
  wildflowers: {
    label: 'Wildflowers',
    icon: 'mdi:flower',
  },
  berries: {
    label: 'Berries',
    icon: 'mdi:fruit-cherries',
  },
  driftwood: {
    label: 'Driftwood',
    icon: 'game-icons:wood-axe',
  },
  fish: {
    label: 'Fish',
    icon: 'mdi:food-drumstick',
  },
  ash: {
    label: 'Ash',
    icon: 'mdi:fire-off',
  },
  embers: {
    label: 'Ember vents',
    icon: 'solar:fire-bold',
  },
} as const satisfies Record<string, DefiningPlazaBiomesGuideForagingTag>;

/** Vegetation tags keyed by stable id. */
export const DEFINING_PLAZA_BIOMES_GUIDE_VEGETATION_TAG_CATALOG = {
  oak: {
    label: 'Oak trees',
    icon: 'mdi:pine-tree',
  },
  birch: {
    label: 'Birch trees',
    icon: 'mdi:tree-outline',
  },
  pine: {
    label: 'Pine trees',
    icon: 'mdi:pine-tree',
  },
  blossom: {
    label: 'Blossom trees',
    icon: 'mdi:flower',
  },
  willow: {
    label: 'Willow trees',
    icon: 'mdi:tree-outline',
  },
  acacia: {
    label: 'Acacia trees',
    icon: 'mdi:tree-outline',
  },
  spruce: {
    label: 'Spruce trees',
    icon: 'mdi:pine-tree',
  },
  palm: {
    label: 'Palm trees',
    icon: 'mdi:beach',
  },
  cactus: {
    label: 'Cactus',
    icon: 'mdi:weather-sunny',
  },
  deadwood: {
    label: 'Deadwood',
    icon: 'mdi:tree-outline',
  },
  tall_grass: {
    label: 'Tall grass',
    icon: 'mdi:grass',
  },
  meadow_flowers: {
    label: 'Meadow flowers',
    icon: 'mdi:flower',
  },
  reeds: {
    label: 'Reeds',
    icon: 'mdi:grass',
  },
  lily_pads: {
    label: 'Lily pads',
    icon: 'mdi:water',
  },
  scrub: {
    label: 'Scrub brush',
    icon: 'mdi:grass',
  },
  moss: {
    label: 'Moss',
    icon: 'mdi:grass',
  },
  dune_grass: {
    label: 'Dune grass',
    icon: 'mdi:grass',
  },
  kelp: {
    label: 'Kelp beds',
    icon: 'mdi:waves',
  },
  scorched_stumps: {
    label: 'Scorched stumps',
    icon: 'mdi:fire-off',
  },
} as const satisfies Record<string, DefiningPlazaBiomesGuideForagingTag>;

export type PlazaBiomesGuideResourceTagId =
  keyof typeof DEFINING_PLAZA_BIOMES_GUIDE_RESOURCE_TAG_CATALOG;

export type PlazaBiomesGuideVegetationTagId =
  keyof typeof DEFINING_PLAZA_BIOMES_GUIDE_VEGETATION_TAG_CATALOG;

/** Per-biome resource and vegetation lists shown after discovery. */
export type DefiningPlazaBiomesGuideForagingProfile = {
  resources: readonly PlazaBiomesGuideResourceTagId[];
  vegetation: readonly PlazaBiomesGuideVegetationTagId[];
};

/** Section headings on explored biome cards. */
export const LABELING_PLAZA_BIOMES_FORAGING_RESOURCES_SECTION =
  'Resources' as const;

export const LABELING_PLAZA_BIOMES_FORAGING_VEGETATION_SECTION =
  'Vegetation' as const;

/**
 * Codex foraging profiles keyed by biome kind.
 * Order within each array is display order on the card.
 */
export const DEFINING_PLAZA_BIOMES_GUIDE_FORAGING_BY_KIND: Record<
  DefiningWorldPlazaBiomeKind,
  DefiningPlazaBiomesGuideForagingProfile
> = {
  plains: {
    resources: ['wood', 'freshwater', 'wildflowers', 'berries'],
    vegetation: ['oak', 'birch', 'pine', 'tall_grass'],
  },
  forest: {
    resources: ['wood', 'freshwater', 'berries'],
    vegetation: ['oak', 'birch', 'pine', 'scrub'],
  },
  flower_forest: {
    resources: ['wood', 'freshwater', 'wildflowers', 'berries'],
    vegetation: ['blossom', 'oak', 'birch', 'meadow_flowers'],
  },
  snowy_plains: {
    resources: ['wood', 'freshwater', 'flint'],
    vegetation: ['spruce', 'pine', 'birch', 'tall_grass'],
  },
  beach: {
    resources: ['sand', 'saltwater', 'driftwood'],
    vegetation: ['palm', 'dune_grass'],
  },
  savanna: {
    resources: ['wood', 'freshwater'],
    vegetation: ['acacia', 'deadwood', 'tall_grass'],
  },
  rocky: {
    resources: ['stone', 'flint'],
    vegetation: ['moss', 'scrub'],
  },
  desert: {
    resources: ['sand', 'flint'],
    vegetation: ['cactus', 'scrub'],
  },
  swamp: {
    resources: ['wood', 'clay', 'freshwater'],
    vegetation: ['willow', 'deadwood', 'reeds', 'lily_pads'],
  },
  badlands: {
    resources: ['clay', 'stone', 'flint'],
    vegetation: ['deadwood', 'cactus', 'scrub'],
  },
  ocean: {
    resources: ['saltwater', 'fish'],
    vegetation: ['kelp'],
  },
  firelands: {
    resources: ['ash', 'embers', 'stone'],
    vegetation: ['scorched_stumps', 'scrub'],
  },
};
