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
 * At ±2σ most animals land within ~16% of average scale.
 */
export const DEFINING_WILDLIFE_SIZE_SCALE_MULTIPLIER_PER_SIGMA = 0.08;

/** Hard minimum on rolled size multiplier. */
export const DEFINING_WILDLIFE_SIZE_SCALE_MIN_MULTIPLIER = 0.75;

/** Hard maximum on rolled size multiplier. */
export const DEFINING_WILDLIFE_SIZE_SCALE_MAX_MULTIPLIER = 1.35;
