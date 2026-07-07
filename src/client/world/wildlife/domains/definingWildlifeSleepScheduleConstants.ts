/**
 * Per-instance sleep schedule bell-curve tuning.
 *
 * @module components/world/wildlife/domains/definingWildlifeSleepScheduleConstants
 */

/** Salt for the first Box-Muller uniform when rolling sleep schedule. */
export const DEFINING_WILDLIFE_SLEEP_SCHEDULE_BELL_CURVE_SEED_SALT_U1 = 811;

/** Salt for the second Box-Muller uniform when rolling sleep schedule. */
export const DEFINING_WILDLIFE_SLEEP_SCHEDULE_BELL_CURVE_SEED_SALT_U2 = 823;

/**
 * Cycle-phase expansion per positive σ on each sleep-window edge.
 * At +2σ a diurnal animal gains ~2.4 minutes of sleep per edge (~4.8 min total).
 */
export const DEFINING_WILDLIFE_SLEEP_SCHEDULE_PHASE_EXPANSION_PER_SIGMA = 0.015;

/**
 * Cycle-phase compression per negative σ on each sleep-window edge.
 * At -2σ a diurnal animal loses ~2.4 minutes of sleep per edge (~4.8 min total).
 */
export const DEFINING_WILDLIFE_SLEEP_SCHEDULE_PHASE_COMPRESSION_PER_SIGMA = 0.015;

/** Base cathemeral sleep probability at 0σ before per-bucket rolls. */
export const DEFINING_WILDLIFE_CATHEMERAL_SLEEP_BASE_PROBABILITY = 0.42;

/** Cathemeral sleep probability shift per σ (clamped). */
export const DEFINING_WILDLIFE_CATHEMERAL_SLEEP_PROBABILITY_PER_SIGMA = 0.06;

/** Minimum cathemeral sleep probability after bell-curve shift. */
export const DEFINING_WILDLIFE_CATHEMERAL_SLEEP_MIN_PROBABILITY = 0.18;

/** Maximum cathemeral sleep probability after bell-curve shift. */
export const DEFINING_WILDLIFE_CATHEMERAL_SLEEP_MAX_PROBABILITY = 0.72;
