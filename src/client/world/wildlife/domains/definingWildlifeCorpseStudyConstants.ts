/**
 * Timed Study interaction on wildlife corpses for the bestiary.
 *
 * @module components/world/wildlife/domains/definingWildlifeCorpseStudyConstants
 */

/** Chebyshev grid reach for starting / continuing a corpse study. */
export const DEFINING_WILDLIFE_CORPSE_STUDY_PLAYER_RANGE_GRID = 2;

/** Shortest study channel (small animals), ms. */
export const DEFINING_WILDLIFE_CORPSE_STUDY_DURATION_MIN_MS = 3_000;

/** Longest study channel (megafauna), ms. */
export const DEFINING_WILDLIFE_CORPSE_STUDY_DURATION_MAX_MS = 10_000;

/** Mass at or below this uses the minimum study duration (kg). */
export const DEFINING_WILDLIFE_CORPSE_STUDY_MASS_MIN_KG = 3;

/** Mass at or above this uses the maximum study duration (kg). */
export const DEFINING_WILDLIFE_CORPSE_STUDY_MASS_MAX_KG = 5_000;

/** Fewest study points awarded for completing one corpse Study. */
export const DEFINING_WILDLIFE_CORPSE_STUDY_POINTS_MIN = 1;

/** Most study points awarded for completing one corpse Study (largest animals). */
export const DEFINING_WILDLIFE_CORPSE_STUDY_POINTS_MAX = 3;

/** Progress ring icon while studying a corpse. */
export const DEFINING_WILDLIFE_CORPSE_STUDY_PROGRESS_ICON =
  'mdi:book-open-page-variant' as const;

/** Floating action label on a selected corpse. */
export const LABELING_WILDLIFE_CORPSE_STUDY_ACTION = 'Study' as const;
