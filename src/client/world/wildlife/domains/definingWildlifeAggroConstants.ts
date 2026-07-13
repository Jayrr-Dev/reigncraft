/**
 * Aggro constants and helpers.
 *
 * @module components/world/wildlife/domains/definingWildlifeAggroConstants
 */

/** Minimum threat required before an animal selects a combat target. */
export const DEFINING_WILDLIFE_AGGRO_THREAT_THRESHOLD = 1.5;

/** Threat applied to packmates when one member is damaged. */
export const DEFINING_WILDLIFE_PACK_THREAT_SHARE_RATIO = 0.45;

/** Player proximity threat per second while starving. */
export const DEFINING_WILDLIFE_PROXIMITY_THREAT_PER_SECOND = 0.8;

/** Distance (grid units) within which a melee swing can land. */
export const DEFINING_WILDLIFE_MELEE_RANGE_GRID = 1.1;

/** How long the one-shot attack clip is held before falling back to idle (ms). */
export const DEFINING_WILDLIFE_ATTACK_CLIP_HOLD_MS = 450;

/**
 * Tiger drops player chase when it has not landed a hit within this window.
 * Clock starts at chase engage and resets on each successful melee hit.
 */
export const DEFINING_WILDLIFE_TIGER_CHASE_GIVE_UP_WITHOUT_DAMAGE_MS = 10_000;
