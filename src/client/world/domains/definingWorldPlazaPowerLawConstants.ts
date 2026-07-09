/**
 * Pareto Type I (continuous power-law) tuning for plaza sampling utilities.
 *
 * PDF: f(x) = α · xmin^α / x^(α+1) for x >= xmin
 * CDF: F(x) = 1 - (xmin / x)^α
 * Mean exists only when α > 1: E[X] = α·xmin / (α - 1)
 * Variance exists only when α > 2
 *
 * @module components/world/domains/definingWorldPlazaPowerLawConstants
 */

/** Floor for uniform draws so inverse-CDF never divides by zero. */
export const DEFINING_WORLD_PLAZA_POWER_LAW_MIN_UNIFORM = 1e-6 as const;

/**
 * Default shape α for game-safe heavy tails.
 * Smaller α = heavier tail; α ≈ 2–3 keeps rare extremes without infinite mean.
 */
export const DEFINING_WORLD_PLAZA_POWER_LAW_DEFAULT_ALPHA = 2.5 as const;

/**
 * Default cap as a multiple of xmin when callers want truncated samples.
 * Sample is clamped to xmin * this value at most.
 */
export const DEFINING_WORLD_PLAZA_POWER_LAW_DEFAULT_MAX_MULTIPLE_OF_XMIN =
  64 as const;
