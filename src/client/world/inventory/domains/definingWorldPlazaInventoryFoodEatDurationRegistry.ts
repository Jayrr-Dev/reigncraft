/**
 * Per-food eat channel durations (ms). Wildlife meats scale with animal size
 * from 1s (small) to 10s (largest). Forage foods stay quick.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryFoodEatDurationRegistry
 */

import {
  DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_COOKED_MEAT_ITEM_TYPE_ID,
  DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_RAW_MEAT_ITEM_TYPE_ID,
} from '@/components/world/wildlife/domains/definingWildlifeAggressiveChickenConstants';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Default when an edible item has no species or forage override. */
export const DEFINING_WORLD_PLAZA_FOOD_EAT_DURATION_MS_DEFAULT = 2_000;

/** Herbs from biome picks. */
export const DEFINING_WORLD_PLAZA_FOOD_EAT_DURATION_MS_FLOWER = 1_200;

/** Berries: quick snack. */
export const DEFINING_WORLD_PLAZA_FOOD_EAT_DURATION_MS_BERRIES = 1_000;

/** Brewed coffee: short drink. */
export const DEFINING_WORLD_PLAZA_FOOD_EAT_DURATION_MS_BREWED_COFFEE = 1_400;

/** Apple: slightly longer than berries. */
export const DEFINING_WORLD_PLAZA_FOOD_EAT_DURATION_MS_APPLE = 1_500;

/** Coconut (raw or cooked): denser forage snack. */
export const DEFINING_WORLD_PLAZA_FOOD_EAT_DURATION_MS_COCONUT = 1_800;

/** Aggressive chicken variant: tougher chew than normal chicken. */
export const DEFINING_WORLD_PLAZA_FOOD_EAT_DURATION_MS_AGGRESSIVE_CHICKEN = 2_500;

/**
 * Eat channel duration by wildlife species (raw and cooked share the same time).
 * Range: 1_000 … 10_000 ms.
 */
export const DEFINING_WILDLIFE_MEAT_EAT_DURATION_MS_BY_SPECIES: Record<
  DefiningWildlifeSpeciesId,
  number
> = {
  chicken: 1_000,
  monkey: 1_000,
  turtle: 1_500,
  tortoise: 2_000,
  ostrich: 2_000,
  antilope: 2_000,
  sheep: 2_500,
  alpaca: 2_500,
  hyena: 2_500,
  deer: 3_000,
  stag: 3_000,
  donkey: 3_000,
  llama: 3_000,
  zebra: 3_500,
  oryx: 3_500,
  'grey-wolf': 3_500,
  pig: 4_000,
  'arabian-horse': 4_000,
  chimp: 4_000,
  boar: 4_500,
  ram: 4_500,
  'brown-horse': 4_500,
  jaguar: 5_000,
  cow: 5_000,
  camel: 5_000,
  'omega-wolf': 5_500,
  lioness: 5_500,
  'work-horse': 5_500,
  crocodile: 6_000,
  lion: 6_000,
  tiger: 6_000,
  bull: 6_500,
  'water-buffalo': 6_500,
  yak: 7_000,
  giraffe: 7_500,
  bison: 8_000,
  'rhino-female': 8_500,
  'brown-bear': 9_000,
  'polar-bear': 9_000,
  rhino: 9_000,
  hippo: 9_500,
  'elephant-female': 9_500,
  elephant: 10_000,
  mammoth: 10_000,
};

/**
 * Resolves eat channel duration for a food definition.
 */
export function resolvingWorldPlazaInventoryFoodEatDurationMs(options: {
  readonly itemTypeId: string;
  readonly wildlifeSpeciesId?: string;
}): number {
  const { itemTypeId, wildlifeSpeciesId } = options;

  if (itemTypeId.startsWith('world-plaza-flower-')) {
    return DEFINING_WORLD_PLAZA_FOOD_EAT_DURATION_MS_FLOWER;
  }

  if (
    itemTypeId === 'world-plaza-berries' ||
    itemTypeId === 'world-plaza-berry-red' ||
    itemTypeId === 'world-plaza-berry-blue' ||
    itemTypeId === 'world-plaza-berry-golden' ||
    itemTypeId === 'world-plaza-tea-leaves'
  ) {
    return DEFINING_WORLD_PLAZA_FOOD_EAT_DURATION_MS_BERRIES;
  }

  if (
    itemTypeId === 'world-plaza-brewed-coffee' ||
    itemTypeId === 'world-plaza-cup-of-tea' ||
    itemTypeId === 'world-plaza-watered-clay-bottle' ||
    itemTypeId === 'world-plaza-bowl-of-porridge' ||
    itemTypeId === 'world-plaza-smoke-oil-crock'
  ) {
    return DEFINING_WORLD_PLAZA_FOOD_EAT_DURATION_MS_BREWED_COFFEE;
  }

  if (itemTypeId === 'world-plaza-apple') {
    return DEFINING_WORLD_PLAZA_FOOD_EAT_DURATION_MS_APPLE;
  }

  if (
    itemTypeId === 'world-plaza-coconut' ||
    itemTypeId === 'world-plaza-cooked-coconut'
  ) {
    return DEFINING_WORLD_PLAZA_FOOD_EAT_DURATION_MS_COCONUT;
  }

  if (
    itemTypeId === DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_RAW_MEAT_ITEM_TYPE_ID ||
    itemTypeId === DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_COOKED_MEAT_ITEM_TYPE_ID
  ) {
    return DEFINING_WORLD_PLAZA_FOOD_EAT_DURATION_MS_AGGRESSIVE_CHICKEN;
  }

  if (
    wildlifeSpeciesId &&
    wildlifeSpeciesId in DEFINING_WILDLIFE_MEAT_EAT_DURATION_MS_BY_SPECIES
  ) {
    return DEFINING_WILDLIFE_MEAT_EAT_DURATION_MS_BY_SPECIES[
      wildlifeSpeciesId as DefiningWildlifeSpeciesId
    ];
  }

  return DEFINING_WORLD_PLAZA_FOOD_EAT_DURATION_MS_DEFAULT;
}
