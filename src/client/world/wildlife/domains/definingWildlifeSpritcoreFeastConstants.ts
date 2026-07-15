/**
 * Wildlife Spritcore feast: priority, chew window, power, and heal regen.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpritcoreFeastConstants
 */

/** Minimum time an animal chews a Spritcore stack before gulping it. */
export const DEFINING_WILDLIFE_SPRITCORE_FEAST_BITE_DELAY_MIN_MS = 1_000;

/** Maximum time an animal chews a Spritcore stack before gulping it. */
export const DEFINING_WILDLIFE_SPRITCORE_FEAST_BITE_DELAY_MAX_MS = 5_000;

/**
 * Distance scale when ranking Spritcore vs other edibles (lower = first pick).
 * Beats favorite-food bias so SC is always the first thing animals rush.
 */
export const DEFINING_WILDLIFE_SPRITCORE_FEAST_DISTANCE_BIAS = 0.05;

/**
 * Flat attack-power multiplier bonus per SC unit gulped.
 * 40 SC → +80% melee; capped by {@link DEFINING_WILDLIFE_SPRITCORE_FEAST_ATTACK_POWER_MULTIPLIER_CAP}.
 */
export const DEFINING_WILDLIFE_SPRITCORE_FEAST_ATTACK_POWER_BONUS_PER_UNIT = 0.02;

/** Max attack-power multiplier from one Spritcore feast (includes the base 1). */
export const DEFINING_WILDLIFE_SPRITCORE_FEAST_ATTACK_POWER_MULTIPLIER_CAP = 3;

/**
 * Passive HP regen multiplier while recovering to full after a Spritcore feast.
 * Wildlife normally has regen gated off; feast temporarily enables it.
 */
export const DEFINING_WILDLIFE_SPRITCORE_FEAST_REGEN_MULTIPLIER = 12;

/**
 * When already at full HP after a feast, keep the power bonus this long (ms).
 * Damaged animals keep power until they finish regenerating to full instead.
 */
export const DEFINING_WILDLIFE_SPRITCORE_FEAST_FULL_HP_POWER_DURATION_MS = 30_000;
