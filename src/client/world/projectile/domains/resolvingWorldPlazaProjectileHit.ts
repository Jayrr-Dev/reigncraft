import type {
  DefiningWorldPlazaProjectileArchetype,
  DefiningWorldPlazaProjectileInstance,
  DefiningWorldPlazaProjectileTarget,
} from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';
import { resolvingWorldPlazaProjectileMissReason } from '@/components/world/projectile/domains/resolvingWorldPlazaProjectileMissReason';

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
  return (
    resolvingWorldPlazaProjectileMissReason({
      instance,
      archetype,
      target,
    }) === 'none'
  );
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
