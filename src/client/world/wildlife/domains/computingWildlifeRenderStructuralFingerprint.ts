/**
 * Compact wildlife presentation fingerprint used to gate React reconciliation.
 *
 * Position and jump progress are intentionally excluded because Pixi consumes
 * them imperatively every tick.
 *
 * @module components/world/wildlife/domains/computingWildlifeRenderStructuralFingerprint
 */

import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

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
      `:${instance.healthState.currentHealth}` +
      `:${instance.staminaState.staminaRatio}`;
  }

  return fingerprint;
}
