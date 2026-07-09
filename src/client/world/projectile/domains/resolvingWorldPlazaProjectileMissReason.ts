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

  const hitBandPx = archetype.dodge.jumpDodgeable
    ? DEFINING_WORLD_PLAZA_PROJECTILE_JUMP_DODGE_HIT_BAND_PX
    : DEFINING_WORLD_PLAZA_PROJECTILE_FULL_HEIGHT_HIT_BAND_PX;

  const targetVerticalPx = -target.jumpArcOffsetPx;
  const verticalDelta = Math.abs(instance.altitudePx - targetVerticalPx);

  if (verticalDelta <= hitBandPx) {
    return 'none';
  }

  if (archetype.dodge.jumpDodgeable) {
    return 'jump_dodge';
  }

  return 'no_overlap';
}
