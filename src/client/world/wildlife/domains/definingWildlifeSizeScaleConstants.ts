/**
 * Per-spawn size bell-curve tuning and combat stat scaling.
 *
 * @module components/world/wildlife/domains/definingWildlifeSizeScaleConstants
 */

/** Salt for the first Box-Muller uniform when rolling size. */
export const DEFINING_WILDLIFE_SIZE_SCALE_BELL_CURVE_SEED_SALT_U1 = 937;

/** Salt for the second Box-Muller uniform when rolling size. */
export const DEFINING_WILDLIFE_SIZE_SCALE_BELL_CURVE_SEED_SALT_U2 = 941;

/** Size multiplier at 0σ before species shift. */
export const DEFINING_WILDLIFE_SIZE_SCALE_BASE_MULTIPLIER = 1;

/**
 * Linear size change per standard deviation.
 * At ±2σ most animals land within ~32% of average scale.
 */
export const DEFINING_WILDLIFE_SIZE_SCALE_MULTIPLIER_PER_SIGMA = 0.16;

/** Hard minimum on rolled visual size multiplier (scrawny / young-looking). */
export const DEFINING_WILDLIFE_SIZE_SCALE_MIN_MULTIPLIER = 0.42;

/** Hard maximum on rolled visual size multiplier (fully grown bruisers). */
export const DEFINING_WILDLIFE_SIZE_SCALE_MAX_MULTIPLIER = 1.9;

/**
 * Exponent on visual size when scaling HP, damage, and stamina.
 * Squaring makes runts fragile (~18% stats at min size) and bruisers scary (~3.6× at max).
 */
export const DEFINING_WILDLIFE_SIZE_COMBAT_STAT_POWER_EXPONENT = 2;

/**
 * Exponent on visual size when scaling walk/run speed.
 * Kept linear so big animals are not dramatically faster than average.
 */
export const DEFINING_WILDLIFE_SIZE_SPEED_STAT_POWER_EXPONENT = 1;
