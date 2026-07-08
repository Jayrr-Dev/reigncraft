/**
 * Declarative tuning for calm wildlife wander legs.
 *
 * @module components/world/wildlife/domains/definingWildlifeWanderConstants
 */

/** Seed salt for stable wander rolls per anchor tile and time bucket. */
export const DEFINING_WILDLIFE_WANDER_SALT = 97;

/** Wander targets stay stable for this window, then re-roll. */
export const DEFINING_WILDLIFE_WANDER_BUCKET_MS = 6_000;

/** Fraction of wander windows the animal simply stands still. */
export const DEFINING_WILDLIFE_WANDER_IDLE_CHANCE = 0.45;

/** Reaching within this distance of a wander target counts as arrived. */
export const DEFINING_WILDLIFE_WANDER_ARRIVAL_RADIUS_GRID = 0.4;

/** Cardinal steps rolled for each bounded random-walk leg. */
export const DEFINING_WILDLIFE_WANDER_STEP_COUNT = 4;

/** Fallback roam half-extent for species without a territory profile. */
export const DEFINING_WILDLIFE_WANDER_FALLBACK_HALF_EXTENT_GRID = 3;
