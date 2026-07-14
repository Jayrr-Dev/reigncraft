/**
 * Compact wildlife presentation fingerprint used to gate React reconciliation.
 *
 * Position, jump progress, and vitals-bar screen placement are intentionally
 * excluded because Pixi consumes them imperatively every tick.
 *
 * @module components/world/wildlife/domains/computingWildlifeRenderStructuralFingerprint
 */

import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Wildlife stamina bars are 24px wide, so finer updates cannot be seen. */
const COMPUTING_WILDLIFE_RENDER_VITALS_RATIO_BUCKET_COUNT = 24;

/**
 * Quantizes a vitals ratio to the smallest visible bar-width change.
 */
export function quantizingWildlifeRenderVitalsRatio(ratio: number): number {
  const clampedRatio = Math.max(0, Math.min(1, ratio));

  return (
    Math.round(
      clampedRatio * COMPUTING_WILDLIFE_RENDER_VITALS_RATIO_BUCKET_COUNT
    ) / COMPUTING_WILDLIFE_RENDER_VITALS_RATIO_BUCKET_COUNT
  );
}

/**
 * Returns a stable key for fields that require a React presentation update.
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
      // Quantized like stamina: health bars are 24px wide, so raw damage
      // ticks below one bucket cannot be seen and must not re-reconcile.
      `:${quantizingWildlifeRenderVitalsRatio(
        instance.healthState.baseMaxHealth > 0
          ? instance.healthState.currentHealth /
              instance.healthState.baseMaxHealth
          : 0
      )}` +
      `:${quantizingWildlifeRenderVitalsRatio(
        instance.staminaState.staminaRatio
      )}` +
      `:${quantizingWildlifeRenderVitalsRatio(
        instance.hungerState.hungerRatio
      )}`;
  }

  return fingerprint;
}
