import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type {
  DefiningWorldPlazaProjectileInstance,
  DefiningWorldPlazaProjectileMovementConfig,
  DefiningWorldPlazaProjectileTarget,
} from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';

/**
 * Resolves the aim point for one projectile tick (frozen spawn target or live track).
 *
 * @module components/world/projectile/domains/resolvingWorldPlazaProjectileAimPoint
 */

export type ResolvingWorldPlazaProjectileAimPointInput = {
  readonly instance: DefiningWorldPlazaProjectileInstance;
  readonly movement: DefiningWorldPlazaProjectileMovementConfig;
  readonly targets: readonly DefiningWorldPlazaProjectileTarget[];
};

/**
 * Returns the nearest live target when `tracksLiveTarget` is set; otherwise the
 * frozen spawn `targetPoint`.
 */
export function resolvingWorldPlazaProjectileAimPoint({
  instance,
  movement,
  targets,
}: ResolvingWorldPlazaProjectileAimPointInput): DefiningWorldPlazaWorldPoint | null {
  if (!movement.tracksLiveTarget || targets.length === 0) {
    return instance.targetPoint;
  }

  let nearestTarget = targets[0];
  let nearestDistanceSquared = Number.POSITIVE_INFINITY;

  for (const target of targets) {
    const deltaX = target.point.x - instance.position.x;
    const deltaY = target.point.y - instance.position.y;
    const distanceSquared = deltaX * deltaX + deltaY * deltaY;
    if (distanceSquared < nearestDistanceSquared) {
      nearestDistanceSquared = distanceSquared;
      nearestTarget = target;
    }
  }

  return nearestTarget.point;
}
