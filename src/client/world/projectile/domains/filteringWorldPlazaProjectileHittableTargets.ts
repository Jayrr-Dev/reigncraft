/**
 * Drops the projectile's own spawner from the hittable / live-track target list.
 *
 * Player-owned shots must not home into or damage the caster. Wildlife / null
 * spawners keep the full target list (including the local player).
 *
 * @module components/world/projectile/domains/filteringWorldPlazaProjectileHittableTargets
 */

import type { DefiningWorldPlazaProjectileTarget } from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';

/**
 * Returns targets that this projectile may aim at or damage.
 */
export function filteringWorldPlazaProjectileHittableTargets(
  targets: readonly DefiningWorldPlazaProjectileTarget[],
  spawnerUserId: string | null
): readonly DefiningWorldPlazaProjectileTarget[] {
  if (!spawnerUserId) {
    return targets;
  }

  return targets.filter((target) => target.targetId !== spawnerUserId);
}
