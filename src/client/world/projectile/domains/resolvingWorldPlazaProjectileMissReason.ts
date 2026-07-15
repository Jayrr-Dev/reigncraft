/**
 * Classifies why a projectile failed to hit a horizontally overlapping target.
 *
 * @module components/world/projectile/domains/resolvingWorldPlazaProjectileMissReason
 */

import { checkingWorldCollisionCircleOverlapsCircle } from '@/components/world/collision/domains/computingWorldCollisionShapeGeometry';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WORLD_PLAZA_PROJECTILE_FULL_HEIGHT_HIT_BAND_PX,
  DEFINING_WORLD_PLAZA_PROJECTILE_JUMP_DODGE_HIT_BAND_PX,
  DEFINING_WORLD_PLAZA_PROJECTILE_LAYER_HIT_TOLERANCE,
} from '@/components/world/projectile/domains/definingWorldPlazaProjectileConstants';
import type {
  DefiningWorldPlazaProjectileArchetype,
  DefiningWorldPlazaProjectileInstance,
  DefiningWorldPlazaProjectileTarget,
} from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';

export type ResolvingWorldPlazaProjectileMissReason =
  | 'none'
  | 'no_overlap'
  | 'layer'
  | 'jump_dodge';

export type ResolvingWorldPlazaProjectileMissReasonParams = {
  readonly instance: DefiningWorldPlazaProjectileInstance;
  readonly archetype: DefiningWorldPlazaProjectileArchetype;
  readonly target: DefiningWorldPlazaProjectileTarget;
};

/**
 * Returns why a projectile did not connect, or `none` when it would hit.
 */
export function resolvingWorldPlazaProjectileMissReason({
  instance,
  archetype,
  target,
}: ResolvingWorldPlazaProjectileMissReasonParams): ResolvingWorldPlazaProjectileMissReason {
  const horizontalOverlap = checkingWorldCollisionCircleOverlapsCircle(
    instance.position,
    archetype.hitbox.radiusGrid,
    target.point.x,
    target.point.y,
    target.collisionRadiusGrid
  );

  if (!horizontalOverlap) {
    return 'no_overlap';
  }

  const projectileLayer =
    instance.position.layer ??
    resolvingWorldPlazaPlayerWorldLayer(instance.position);
  const targetLayer =
    target.point.layer ?? resolvingWorldPlazaPlayerWorldLayer(target.point);
  const layerDelta = Math.abs(projectileLayer - targetLayer);

  if (layerDelta > DEFINING_WORLD_PLAZA_PROJECTILE_LAYER_HIT_TOLERANCE) {
    return 'layer';
  }

  // Jump-dodgeable: standing / low targets always connect; dodging requires
  // jumping high enough to clear the projectile's flight altitude.
  // (Old co-altitude band made flying ice spheres miss every grounded mob.)
  if (archetype.dodge.jumpDodgeable) {
    const targetLiftPx = Math.abs(target.jumpArcOffsetPx);
    const clearThresholdPx =
      instance.altitudePx +
      DEFINING_WORLD_PLAZA_PROJECTILE_JUMP_DODGE_HIT_BAND_PX;

    if (targetLiftPx > clearThresholdPx) {
      return 'jump_dodge';
    }

    return 'none';
  }

  const targetVerticalPx = -target.jumpArcOffsetPx;
  const verticalDelta = Math.abs(instance.altitudePx - targetVerticalPx);

  if (verticalDelta <= DEFINING_WORLD_PLAZA_PROJECTILE_FULL_HEIGHT_HIT_BAND_PX) {
    return 'none';
  }

  return 'no_overlap';
}
