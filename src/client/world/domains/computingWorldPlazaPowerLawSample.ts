/**
 * Pareto Type I (continuous power-law) inverse-CDF sampling.
 *
 * Not a drop-in for σ-space bell curves. Returns positive magnitude >= xmin.
 * Callers map scale, sign, and clamp when swapping from Gaussian rolls.
 *
 * @module components/world/domains/computingWorldPlazaPowerLawSample
 */

import { DEFINING_WORLD_PLAZA_POWER_LAW_MIN_UNIFORM } from '@/components/world/domains/definingWorldPlazaPowerLawConstants';

export type ComputingWorldPlazaPowerLawSampleParams = {
  /** Minimum support; must be > 0. */
  xmin: number;
  /** Shape α; must be > 0. Smaller α = heavier tail. */
  alpha: number;
  /** Injectable RNG when uniform is omitted. */
  random?: () => number;
  /** Pre-drawn uniform in (0, 1]; overrides random for seeded paths. */
  uniform?: number;
};

function clampingWorldPlazaPowerLawUniform(uniform: number): number {
  return Math.min(
    1,
    Math.max(DEFINING_WORLD_PLAZA_POWER_LAW_MIN_UNIFORM, uniform)
  );
}

function checkingWorldPlazaPowerLawParamsValid(
  xmin: number,
  alpha: number
): void {
  if (xmin <= 0) {
    throw new RangeError('Power-law xmin must be > 0');
  }

  if (alpha <= 0) {
    throw new RangeError('Power-law alpha must be > 0');
  }
}

/**
 * Deterministic inverse-CDF quantile: x = xmin * p^(-1/α).
 * p must be in (0, 1]; p = 1 yields xmin.
 */
export function computingWorldPlazaPowerLawQuantile({
  xmin,
  alpha,
  p,
}: {
  xmin: number;
  alpha: number;
  p: number;
}): number {
  checkingWorldPlazaPowerLawParamsValid(xmin, alpha);

  const clampedP = clampingWorldPlazaPowerLawUniform(p);

  return xmin * clampedP ** (-1 / alpha);
}

/**
 * Mean E[X] = α·xmin / (α - 1) when α > 1; null when mean does not exist.
 */
export function computingWorldPlazaPowerLawMean({
  xmin,
  alpha,
}: {
  xmin: number;
  alpha: number;
}): number | null {
  checkingWorldPlazaPowerLawParamsValid(xmin, alpha);

  if (alpha <= 1) {
    return null;
  }

  return (alpha * xmin) / (alpha - 1);
}

/** Clamps a sample to [xmin, maxX] when maxX is provided. */
export function clampingWorldPlazaPowerLawSample(
  value: number,
  xmin: number,
  maxX?: number
): number {
  if (maxX === undefined) {
    return Math.max(xmin, value);
  }

  return Math.min(maxX, Math.max(xmin, value));
}

/**
 * Samples one Pareto Type I value via inverse transform.
 * Provide uniform for deterministic/seeded rolls, or random for stochastic rolls.
 */
export function samplingWorldPlazaPowerLawValue({
  xmin,
  alpha,
  random = Math.random,
  uniform,
}: ComputingWorldPlazaPowerLawSampleParams): number {
  checkingWorldPlazaPowerLawParamsValid(xmin, alpha);

  const drawnUniform =
    uniform === undefined
      ? clampingWorldPlazaPowerLawUniform(random())
      : uniform;

  return computingWorldPlazaPowerLawQuantile({
    xmin,
    alpha,
    p: drawnUniform,
  });
}
