/**
 * Compact wildlife presentation fingerprint used to gate React reconciliation.
 *
 * Position, jump progress, and vitals fills are intentionally excluded:
 * Pixi consumes transforms every tick, and vitals Graphics redraws happen in
 * `syncingWildlifeInstancesImperativePresentation` from quantized ratios.
 *
 * @module components/world/wildlife/domains/computingWildlifeRenderStructuralFingerprint
 */

import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Wildlife stamina bars are 24px wide, so finer updates cannot be seen. */
export const COMPUTING_WILDLIFE_RENDER_VITALS_RATIO_BUCKET_COUNT = 24;

/**
 * Hunger orb inner disc is ~11px across; coarser buckets than the HP bar keep
 * imperative redraws rare while still matching visible fill steps.
 */
export const COMPUTING_WILDLIFE_RENDER_HUNGER_CIRCLE_RATIO_BUCKET_COUNT = 12;

/**
 * Quantizes a vitals ratio to the smallest visible bar-width change.
 * Pass `maxRatio` when the raw value can exceed 1 (apex / fleet stamina caps).
 */
export function quantizingWildlifeRenderVitalsRatio(
  ratio: number,
  maxRatio = 1,
  bucketCount: number = COMPUTING_WILDLIFE_RENDER_VITALS_RATIO_BUCKET_COUNT
): number {
  const fillRatio = ratio / Math.max(maxRatio, Number.EPSILON);
  const clampedRatio = Math.max(0, Math.min(1, fillRatio));
  const safeBucketCount = Math.max(1, bucketCount);

  return Math.round(clampedRatio * safeBucketCount) / safeBucketCount;
}

/**
 * Quantizes hunger for the overhead pet orb (coarser than HP/stamina bars).
 */
export function quantizingWildlifeRenderHungerCircleRatio(
  hungerRatio: number
): number {
  return quantizingWildlifeRenderVitalsRatio(
    hungerRatio,
    1,
    COMPUTING_WILDLIFE_RENDER_HUNGER_CIRCLE_RATIO_BUCKET_COUNT
  );
}

/**
 * Returns a stable key for fields that require a React presentation update.
 * Vitals fills are omitted on purpose (imperative Graphics redraw).
 */
export function computingWildlifeRenderStructuralFingerprint(
  instances: readonly DefiningWildlifeInstance[]
): string {
  let fingerprint = `${instances.length}`;

  for (const instance of instances) {
    fingerprint +=
      `|${instance.instanceId}` +
      `:${instance.speciesId}` +
      `:${instance.facingDirection}` +
      `:${instance.aiState.motionClip}` +
      `:${instance.aiState.isMoving ? 1 : 0}` +
      `:${instance.isDead ? 1 : 0}` +
      `:${instance.petBond ? 1 : 0}` +
      `:${instance.petBond?.loyalty ?? ''}`;
  }

  return fingerprint;
}
