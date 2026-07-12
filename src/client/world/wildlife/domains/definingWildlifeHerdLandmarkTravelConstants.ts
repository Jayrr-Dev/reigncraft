/**
 * Declarative tuning for herbivore herd rest → travel to landmarks.
 *
 * After a calm idle window, herds (and solo grazers) walk toward water
 * shores, tree shade, or open pasture so the world feels lived-in.
 *
 * @module components/world/wildlife/domains/definingWildlifeHerdLandmarkTravelConstants
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';

/** Landmark kinds herds may travel toward after resting. */
export type DefiningWildlifeHerdLandmarkKind = 'water' | 'trees' | 'pasture';

/** Seed salt for landmark travel rolls (distinct from calm wander). */
export const DEFINING_WILDLIFE_HERD_LANDMARK_SALT = 211;

/**
 * Chance that a paired wander-bucket cycle is rest-then-landmark instead of
 * normal random wander. Rest = first bucket; travel = second bucket.
 */
export const DEFINING_WILDLIFE_HERD_LANDMARK_TRAVEL_CHANCE = 0.55;

/** How far (grid) to scan for a matching landmark tile. */
export const DEFINING_WILDLIFE_HERD_LANDMARK_SCAN_RADIUS_GRID = 12;

/** Skip the animal's own tile ring so travel has visible motion. */
export const DEFINING_WILDLIFE_HERD_LANDMARK_MIN_TRAVEL_GRID = 2.5;

/** Pasture legs prefer a farther open patch than the rest spot. */
export const DEFINING_WILDLIFE_HERD_LANDMARK_PASTURE_MIN_TRAVEL_GRID = 4;

/** Reaching within this distance of a landmark counts as arrived. */
export const DEFINING_WILDLIFE_HERD_LANDMARK_ARRIVAL_RADIUS_GRID = 0.55;

/**
 * Weighted landmark picks. Water and pasture dominate; trees are shade stops.
 */
export const DEFINING_WILDLIFE_HERD_LANDMARK_KIND_WEIGHTS = {
  water: 0.34,
  trees: 0.28,
  pasture: 0.38,
} as const satisfies Record<DefiningWildlifeHerdLandmarkKind, number>;

/** Open biomes treated as grazing pasture. */
export const DEFINING_WILDLIFE_HERD_LANDMARK_PASTURE_BIOME_KINDS: ReadonlySet<DefiningWorldPlazaBiomeKind> =
  new Set(['plains', 'savanna', 'flower_forest', 'snowy_plains', 'beach']);
