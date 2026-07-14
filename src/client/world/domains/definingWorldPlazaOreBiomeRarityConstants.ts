/**
 * Biome / shore weight tables for ore vein species rolls.
 *
 * Priority when resolving a column-rock anchor:
 * 1. firelands → volcanic pool
 * 2. near surface water → clay shore pool
 * 3. rocky biome → mountain metal pool
 * 4. else → default plains pool
 *
 * @module components/world/domains/definingWorldPlazaOreBiomeRarityConstants
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import {
  resolvingWorldOreSpeciesRarityEntry,
  type WorldOreSpeciesId,
  type WorldOreSpeciesRarityEntry,
} from '../../../shared/worldOreRarity';

/** Chebyshev radius (tiles) treated as "near river / lake / shore". */
export const DEFINING_WORLD_PLAZA_ORE_NEAR_WATER_RADIUS_TILES = 3;

/** Vein chance for ordinary biomes. */
export const DEFINING_WORLD_PLAZA_ORE_VEIN_CHANCE_DEFAULT = 0.24;

/** Vein chance on rocky stone fields. */
export const DEFINING_WORLD_PLAZA_ORE_VEIN_CHANCE_ROCKY = 0.38;

/** Vein chance on land beside surface water (clay banks). */
export const DEFINING_WORLD_PLAZA_ORE_VEIN_CHANCE_NEAR_WATER = 0.42;

/**
 * Vein chance in firelands. Almost every firelands column rock is an ore vein.
 */
export const DEFINING_WORLD_PLAZA_ORE_VEIN_CHANCE_FIRELANDS = 0.72;

function buildingWorldPlazaOreWeightEntry(
  speciesId: WorldOreSpeciesId,
  weight: number
): WorldOreSpeciesRarityEntry {
  const rarityEntry = resolvingWorldOreSpeciesRarityEntry(speciesId);

  return {
    speciesId,
    rarity: rarityEntry.rarity,
    weight,
  };
}

/**
 * Clay banks beside rivers, lakes, streams, and ponds.
 */
export const DEFINING_WORLD_PLAZA_ORE_WEIGHTS_NEAR_WATER: readonly WorldOreSpeciesRarityEntry[] =
  [
    buildingWorldPlazaOreWeightEntry('clay', 100),
    buildingWorldPlazaOreWeightEntry('coal', 12),
    buildingWorldPlazaOreWeightEntry('iron', 6),
    buildingWorldPlazaOreWeightEntry('copper', 4),
    buildingWorldPlazaOreWeightEntry('lead', 2),
    buildingWorldPlazaOreWeightEntry('niter', 2),
  ];

/**
 * Rocky biome mountain metals + saltpeter.
 */
export const DEFINING_WORLD_PLAZA_ORE_WEIGHTS_ROCKY: readonly WorldOreSpeciesRarityEntry[] =
  [
    buildingWorldPlazaOreWeightEntry('iron', 40),
    buildingWorldPlazaOreWeightEntry('copper', 34),
    buildingWorldPlazaOreWeightEntry('lead', 30),
    buildingWorldPlazaOreWeightEntry('niter', 28),
    buildingWorldPlazaOreWeightEntry('coal', 10),
    buildingWorldPlazaOreWeightEntry('silver', 4),
    buildingWorldPlazaOreWeightEntry('clay', 3),
  ];

/**
 * Legendary firelands volcanic ores.
 */
export const DEFINING_WORLD_PLAZA_ORE_WEIGHTS_FIRELANDS: readonly WorldOreSpeciesRarityEntry[] =
  [
    buildingWorldPlazaOreWeightEntry('sulfur', 36),
    buildingWorldPlazaOreWeightEntry('gold', 26),
    buildingWorldPlazaOreWeightEntry('silver', 22),
    buildingWorldPlazaOreWeightEntry('scarlet', 22),
  ];

/**
 * Everywhere else (plains, forest, desert rim, etc.).
 */
export const DEFINING_WORLD_PLAZA_ORE_WEIGHTS_DEFAULT: readonly WorldOreSpeciesRarityEntry[] =
  [
    buildingWorldPlazaOreWeightEntry('coal', 36),
    buildingWorldPlazaOreWeightEntry('clay', 22),
    buildingWorldPlazaOreWeightEntry('iron', 18),
    buildingWorldPlazaOreWeightEntry('copper', 12),
    buildingWorldPlazaOreWeightEntry('lead', 6),
    buildingWorldPlazaOreWeightEntry('niter', 4),
    buildingWorldPlazaOreWeightEntry('silver', 2),
  ];

export type DefiningWorldPlazaOreBiomePoolId =
  | 'firelands'
  | 'near-water'
  | 'rocky'
  | 'default';

export type DefiningWorldPlazaOreBiomePoolResolution = {
  readonly poolId: DefiningWorldPlazaOreBiomePoolId;
  readonly veinChance: number;
  readonly weights: readonly WorldOreSpeciesRarityEntry[];
  readonly label: string;
};

/**
 * Player-facing pool labels for Lapidary / debug.
 */
export const DEFINING_WORLD_PLAZA_ORE_BIOME_POOL_LABELS: Readonly<
  Record<DefiningWorldPlazaOreBiomePoolId, string>
> = {
  firelands: 'Firelands volcanic veins',
  'near-water': 'Clay banks near water',
  rocky: 'Rocky mountain metals',
  default: 'Common land seams',
};

/**
 * Preferred biome / habitat line for one ore species (Lapidary).
 */
export const DEFINING_WORLD_PLAZA_ORE_SPECIES_HABITAT_LABEL: Readonly<
  Record<WorldOreSpeciesId, string>
> = {
  clay: 'River and lake shores',
  coal: 'Open land and rocky rims',
  iron: 'Rocky biomes',
  copper: 'Rocky biomes',
  lead: 'Rocky biomes',
  niter: 'Rocky biomes',
  silver: 'Firelands (rare elsewhere)',
  scarlet: 'Firelands',
  gold: 'Firelands',
  sulfur: 'Firelands',
};

/**
 * Picks the active ore weight pool for one anchor context.
 */
export function resolvingWorldPlazaOreBiomePoolResolution(input: {
  readonly biomeKind: DefiningWorldPlazaBiomeKind;
  readonly isNearSurfaceWater: boolean;
  readonly isRockyBiome: boolean;
}): DefiningWorldPlazaOreBiomePoolResolution {
  if (input.biomeKind === 'firelands') {
    return {
      poolId: 'firelands',
      veinChance: DEFINING_WORLD_PLAZA_ORE_VEIN_CHANCE_FIRELANDS,
      weights: DEFINING_WORLD_PLAZA_ORE_WEIGHTS_FIRELANDS,
      label: DEFINING_WORLD_PLAZA_ORE_BIOME_POOL_LABELS.firelands,
    };
  }

  if (input.isNearSurfaceWater) {
    return {
      poolId: 'near-water',
      veinChance: DEFINING_WORLD_PLAZA_ORE_VEIN_CHANCE_NEAR_WATER,
      weights: DEFINING_WORLD_PLAZA_ORE_WEIGHTS_NEAR_WATER,
      label: DEFINING_WORLD_PLAZA_ORE_BIOME_POOL_LABELS['near-water'],
    };
  }

  if (input.isRockyBiome || input.biomeKind === 'rocky') {
    return {
      poolId: 'rocky',
      veinChance: DEFINING_WORLD_PLAZA_ORE_VEIN_CHANCE_ROCKY,
      weights: DEFINING_WORLD_PLAZA_ORE_WEIGHTS_ROCKY,
      label: DEFINING_WORLD_PLAZA_ORE_BIOME_POOL_LABELS.rocky,
    };
  }

  return {
    poolId: 'default',
    veinChance: DEFINING_WORLD_PLAZA_ORE_VEIN_CHANCE_DEFAULT,
    weights: DEFINING_WORLD_PLAZA_ORE_WEIGHTS_DEFAULT,
    label: DEFINING_WORLD_PLAZA_ORE_BIOME_POOL_LABELS.default,
  };
}
