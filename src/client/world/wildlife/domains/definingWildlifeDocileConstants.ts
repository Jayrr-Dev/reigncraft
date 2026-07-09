/**
 * Tuning for docile wildlife temperament (dogs, cats).
 * Friendliness is the existing per-spawn aggressionLevel (tame / normal / aggressive).
 *
 * @module components/world/wildlife/domains/definingWildlifeDocileConstants
 */

import type { DefiningWildlifeAggressionLevel } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Player within this grid distance may trigger follow-or-flee. */
export const DEFINING_WILDLIFE_DOCILE_APPROACH_REACT_RADIUS_GRID = 4 as const;

/** Temporary trail duration after a follow roll (inclusive). */
export const DEFINING_WILDLIFE_DOCILE_FOLLOW_DURATION_MIN_MS = 30_000 as const;

/** Temporary trail duration after a follow roll (inclusive). */
export const DEFINING_WILDLIFE_DOCILE_FOLLOW_DURATION_MAX_MS = 90_000 as const;

/** Minimum ms between approach reactions. */
export const DEFINING_WILDLIFE_DOCILE_APPROACH_REACT_COOLDOWN_MS = 12_000 as const;

/** Trail the player until within this comfort distance (grid). */
export const DEFINING_WILDLIFE_DOCILE_FOLLOW_COMFORT_DISTANCE_GRID = 2.5 as const;

/** Seed salt for follow-duration rolls after approach react. */
export const DEFINING_WILDLIFE_DOCILE_FOLLOW_DURATION_SEED_SALT = 8803 as const;

/** Seed salt for follow-vs-flee approach rolls. */
export const DEFINING_WILDLIFE_DOCILE_APPROACH_REACT_SEED_SALT = 8805 as const;

/**
 * Chance to follow (else flee) on approach, keyed by aggressionLevel.
 * Tame is friendliest; aggressive mostly bolts.
 */
export const DEFINING_WILDLIFE_DOCILE_FOLLOW_CHANCE_BY_AGGRESSION: Record<
  DefiningWildlifeAggressionLevel,
  number
> = {
  tame: 0.85,
  normal: 0.55,
  aggressive: 0.2,
};
