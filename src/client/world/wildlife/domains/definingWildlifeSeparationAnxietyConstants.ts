/**
 * Separation anxiety: young animals run back to larger same-species guardians.
 *
 * Size tiers stand in for age: σ ≤ −1 (young + baby) follow larger adults.
 *
 * @module components/world/wildlife/domains/definingWildlifeSeparationAnxietyConstants
 */

import type { DefiningWildlifeSizeTier } from '@/components/world/wildlife/domains/definingWildlifeNameTagConstants';

/** Young at this size tier or smaller feel separation anxiety. */
export const DEFINING_WILDLIFE_SEPARATION_ANXIETY_MAX_YOUNG_SIZE_TIER =
  -1 as DefiningWildlifeSizeTier;

/** Start running toward a guardian when farther than this (grid). */
export const DEFINING_WILDLIFE_SEPARATION_ANXIETY_TRIGGER_DISTANCE_GRID = 4;

/** Stop the catch-up run once within this distance of the guardian (grid). */
export const DEFINING_WILDLIFE_SEPARATION_ANXIETY_COMFORT_DISTANCE_GRID = 2;

/** How far a young animal looks for a larger same-species guardian (grid). */
export const DEFINING_WILDLIFE_SEPARATION_ANXIETY_SEARCH_RADIUS_GRID = 14;
