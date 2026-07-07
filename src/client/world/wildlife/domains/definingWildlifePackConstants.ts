/**
 * Spawn-pack behavior tuning for wildlife groups.
 *
 * @module components/world/wildlife/domains/definingWildlifePackConstants
 */

/** Flee distance when the pack alpha dies and survivors scatter. */
export const DEFINING_WILDLIFE_PACK_ALPHA_DEATH_FLEE_DISTANCE_GRID = 18;

/** Shadow distance for the spawn-pack alpha (closest to the player). */
export const DEFINING_WILDLIFE_PACK_ALPHA_STALK_FOLLOW_DISTANCE_GRID = 5.5;

/** Back-off threshold for the alpha while shadowing. */
export const DEFINING_WILDLIFE_PACK_ALPHA_STALK_FOLLOW_MIN_DISTANCE_GRID = 4.5;

/** Catch-up threshold for the alpha while shadowing. */
export const DEFINING_WILDLIFE_PACK_ALPHA_STALK_FOLLOW_MAX_DISTANCE_GRID = 6.5;

/** Extra trailing distance per follower rank behind the alpha. */
export const DEFINING_WILDLIFE_PACK_FOLLOWER_STALK_DISTANCE_OFFSET_GRID = 1.75;

/** Surround radius for the alpha charge point (closest to the player). */
export const DEFINING_WILDLIFE_PACK_ALPHA_SURROUND_RADIUS_GRID = 2;

/** Extra surround radius per follower rank behind the alpha. */
export const DEFINING_WILDLIFE_PACK_FOLLOWER_SURROUND_RADIUS_OFFSET_GRID = 0.8;

/** Trailing distance for the alpha while the pack roams without prey. */
export const DEFINING_WILDLIFE_PACK_ALPHA_ROAM_FOLLOW_DISTANCE_GRID = 1.4;

/** Back-off threshold for followers while the alpha roams. */
export const DEFINING_WILDLIFE_PACK_ALPHA_ROAM_FOLLOW_MIN_DISTANCE_GRID = 0.9;

/** Catch-up threshold for followers while the alpha roams. */
export const DEFINING_WILDLIFE_PACK_ALPHA_ROAM_FOLLOW_MAX_DISTANCE_GRID = 2.4;

/** Extra trailing distance per follower rank during calm pack roam. */
export const DEFINING_WILDLIFE_PACK_FOLLOWER_ROAM_DISTANCE_OFFSET_GRID = 0.55;
