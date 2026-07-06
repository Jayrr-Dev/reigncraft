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

/**
 * Projectile hit resolution against generic targets (players, future mobs).
 *
 * @module components/world/projectile/domains/resolvingWorldPlazaProjectileHit
 */

export type ResolvingWorldPlazaProjectileHitParams = {
  readonly instance: DefiningWorldPlazaProjectileInstance;
  readonly archetype: DefiningWorldPlazaProjectileArchetype;
  readonly target: DefiningWorldPlazaProjectileTarget;
};

/**
 * Returns true when a projectile overlaps a target in grid space and altitude.
 */
export function resolvingWorldPlazaProjectileHit({
  instance,
  archetype,
  target,
}: ResolvingWorldPlazaProjectileHitParams): boolean {
  const horizontalOverlap = checkingWorldCollisionCircleOverlapsCircle(
    instance.position,
    archetype.hitbox.radiusGrid,
    target.point.x,
    target.point.y,
    target.collisionRadiusGrid
  );

  if (!horizontalOverlap) {
    return false;
  }

  const projectileLayer =
    instance.position.layer ??
    resolvingWorldPlazaPlayerWorldLayer(instance.position);
  const targetLayer =
    target.point.layer ?? resolvingWorldPlazaPlayerWorldLayer(target.point);
  const layerDelta = Math.abs(projectileLayer - targetLayer);

  if (layerDelta > DEFINING_WORLD_PLAZA_PROJECTILE_LAYER_HIT_TOLERANCE) {
    return false;
  }

  const hitBandPx = archetype.dodge.jumpDodgeable
    ? DEFINING_WORLD_PLAZA_PROJECTILE_JUMP_DODGE_HIT_BAND_PX
    : DEFINING_WORLD_PLAZA_PROJECTILE_FULL_HEIGHT_HIT_BAND_PX;

  const targetVerticalPx = -target.jumpArcOffsetPx;
  const verticalDelta = Math.abs(instance.altitudePx - targetVerticalPx);

  return verticalDelta <= hitBandPx;
}

/**
 * Lists target ids already hit by this projectile instance.
 */
export function checkingWorldPlazaProjectileAlreadyHitTarget(
  instance: DefiningWorldPlazaProjectileInstance,
  targetId: string
): boolean {
  return instance.hitTargetIds.includes(targetId);
}
