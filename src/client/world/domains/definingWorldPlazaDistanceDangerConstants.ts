/**
 * Distance-from-origin danger scaling for biomes and wildlife.
 *
 * Every {@link DEFINING_WORLD_PLAZA_DISTANCE_DANGER_BAND_TILES} tiles from spawn
 * (Euclidean) raises one danger band. Band 0 is the safe ring near origin.
 *
 * @module components/world/domains/definingWorldPlazaDistanceDangerConstants
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';

/** Radial tile distance per danger band (player "blocks traveled" from origin). */
export const DEFINING_WORLD_PLAZA_DISTANCE_DANGER_BAND_TILES = 1000;

/**
 * Additive HP / melee attack multiplier per danger band.
 * Band 1 = +5%, band 2 = +10%, …
 */
export const DEFINING_WORLD_PLAZA_DISTANCE_DANGER_COMBAT_BONUS_PER_BAND = 0.05;

/** Aggression bell-curve mean shift added per danger band. */
export const DEFINING_WORLD_PLAZA_DISTANCE_DANGER_AGGRESSION_MEAN_SHIFT_PER_BAND = 0.22;

/** Size σ bell-curve mean shift added per danger band (more +2σ / +3σ / +4σ). */
export const DEFINING_WORLD_PLAZA_DISTANCE_DANGER_SIZE_MEAN_SHIFT_PER_BAND = 0.28;

/** Predator spawn-weight multiplier growth per band (1 + rate * band). */
export const DEFINING_WORLD_PLAZA_DISTANCE_DANGER_PREDATOR_WEIGHT_BONUS_PER_BAND = 0.18;

/** Prey spawn-weight multiplier decay per band (1 - rate * band, floored). */
export const DEFINING_WORLD_PLAZA_DISTANCE_DANGER_PREY_WEIGHT_PENALTY_PER_BAND = 0.08;

/**
 * Extra weight decay for docile / passive (friendly) temperaments per band,
 * stacked on the prey penalty.
 */
export const DEFINING_WORLD_PLAZA_DISTANCE_DANGER_FRIENDLY_WEIGHT_PENALTY_PER_BAND = 0.12;

/** Floor for prey / friendly weight multipliers so pools never fully vanish. */
export const DEFINING_WORLD_PLAZA_DISTANCE_DANGER_MIN_SPAWN_WEIGHT_MULTIPLIER = 0.15;

/**
 * Chance to replace an easy biome with a harder neighbor, per danger band.
 * Kept modest so codex rarity sampling still sees common > uncommon.
 */
export const DEFINING_WORLD_PLAZA_DISTANCE_DANGER_EASY_BIOME_SUPPRESS_CHANCE_PER_BAND = 0.035;

/** Hard cap on easy-biome suppress rolls far from origin. */
export const DEFINING_WORLD_PLAZA_DISTANCE_DANGER_EASY_BIOME_SUPPRESS_CHANCE_MAX = 0.28;

/** Deterministic salt for easy-biome suppress + replacement picks. */
export const DEFINING_WORLD_PLAZA_DISTANCE_DANGER_BIOME_SUPPRESS_SALT = 7919;

/** Common / easy surface biomes that thin out with distance. */
export const DEFINING_WORLD_PLAZA_DISTANCE_DANGER_EASY_BIOME_KINDS = [
  'plains',
  'forest',
  'snowy_plains',
] as const satisfies readonly DefiningWorldPlazaBiomeKind[];

export type DefiningWorldPlazaDistanceDangerEasyBiomeKind =
  (typeof DEFINING_WORLD_PLAZA_DISTANCE_DANGER_EASY_BIOME_KINDS)[number];

/**
 * Harder replacements when an easy biome is suppressed.
 * Stay in uncommon tier so rare biomes are not inflated past uncommon.
 */
export const DEFINING_WORLD_PLAZA_DISTANCE_DANGER_EASY_BIOME_REPLACEMENTS: Record<
  DefiningWorldPlazaDistanceDangerEasyBiomeKind,
  readonly DefiningWorldPlazaBiomeKind[]
> = {
  plains: ['rocky', 'savanna'],
  forest: ['rocky', 'savanna'],
  snowy_plains: ['rocky', 'savanna'],
};
