/**
 * Compact wildlife presentation fingerprint used to gate React reconciliation.
 *
 * Position, jump progress, and vitals-bar screen placement are intentionally
 * excluded because Pixi consumes them imperatively every tick.
 *
 * @module components/world/wildlife/domains/computingWildlifeRenderStructuralFingerprint
 */

import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeInstanceMaxStaminaRatio } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';

/** Wildlife stamina bars are 24px wide, so finer updates cannot be seen. */
const COMPUTING_WILDLIFE_RENDER_VITALS_RATIO_BUCKET_COUNT = 24;

/**
 * Quantizes a vitals ratio to the smallest visible bar-width change.
 * Pass `maxRatio` when the raw value can exceed 1 (apex / fleet stamina caps).
 */
export function quantizingWildlifeRenderVitalsRatio(
  ratio: number,
  maxRatio = 1
): number {
  const fillRatio = ratio / Math.max(maxRatio, Number.EPSILON);
  const clampedRatio = Math.max(0, Math.min(1, fillRatio));

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
    const species = resolvingWildlifeSpeciesDefinition(instance.speciesId);
    const maxStaminaRatio = resolvingWildlifeInstanceMaxStaminaRatio(
      instance,
      species ?? undefined
    );

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
        instance.staminaState.staminaRatio,
        maxStaminaRatio
      )}` +
      `:${quantizingWildlifeRenderVitalsRatio(
        instance.hungerState.hungerRatio
      )}`;
  }

  return fingerprint;
}
