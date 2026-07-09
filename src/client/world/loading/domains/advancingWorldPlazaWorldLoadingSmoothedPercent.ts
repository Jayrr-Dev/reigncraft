/**
 * Frame-rate-independent exponential smoothing for loading progress display.
 *
 * @module components/world/loading/domains/advancingWorldPlazaWorldLoadingSmoothedPercent
 */

import {
  DEFINING_WORLD_PLAZA_WORLD_LOADING_PROGRESS_SMOOTHING_RATE_PER_SECOND,
  DEFINING_WORLD_PLAZA_WORLD_LOADING_PROGRESS_SMOOTHING_SNAP_EPSILON,
} from '@/components/world/loading/domains/definingWorldPlazaWorldLoadingProgressDisplayConstants';

export type AdvancingWorldPlazaWorldLoadingSmoothedPercentInput = {
  readonly currentPercent: number;
  readonly targetPercent: number;
  readonly deltaMs: number;
  readonly smoothingRatePerSecond?: number;
  readonly snapEpsilon?: number;
};

/**
 * Eases `currentPercent` toward `targetPercent` without overshooting.
 * Progress only climbs in the pipeline, so the display never moves backward.
 */
export function advancingWorldPlazaWorldLoadingSmoothedPercent({
  currentPercent,
  targetPercent,
  deltaMs,
  smoothingRatePerSecond = DEFINING_WORLD_PLAZA_WORLD_LOADING_PROGRESS_SMOOTHING_RATE_PER_SECOND,
  snapEpsilon = DEFINING_WORLD_PLAZA_WORLD_LOADING_PROGRESS_SMOOTHING_SNAP_EPSILON,
}: AdvancingWorldPlazaWorldLoadingSmoothedPercentInput): number {
  const clampedTarget = Math.min(100, Math.max(0, targetPercent));
  const clampedCurrent = Math.min(100, Math.max(0, currentPercent));

  if (clampedTarget <= clampedCurrent) {
    return clampedCurrent;
  }

  const deltaSeconds = Math.min(0.05, Math.max(0, deltaMs) / 1000);
  const smoothingAlpha = 1 - Math.exp(-smoothingRatePerSecond * deltaSeconds);
  const nextPercent =
    clampedCurrent + (clampedTarget - clampedCurrent) * smoothingAlpha;

  if (clampedTarget - nextPercent <= snapEpsilon) {
    return clampedTarget;
  }

  return nextPercent;
}
